import { CarrierName, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function fetchLdmRatesByPostcodeAndLoadMeter(
  unloadingPostcode: string,
  loadMeter: number,
  unloadingCountry: string,
  carrier: string,
  importExport: "Import" | "Export",
  weight: number,
) {
  try {
    // Extract the first two characters of the postcode, removing leading zeros if present
    let unloadingZone: string;

    if (carrier === "Alles" && unloadingPostcode.startsWith("80")) {
      unloadingZone = unloadingPostcode.substring(0, 4).replace(/^0/, "");
    } else {
      unloadingZone = unloadingPostcode.substring(0, 2).replace(/^0/, "");
    }

    // Query the database for matching shipments and fetch additional carrier information
    const shipments = await prisma.shipment.findMany({
      where: {
        toCountry: {
          code: unloadingCountry,
        },
        zipcode: {
          equals: unloadingZone,
        },
        carrier: {
          name: carrier as CarrierName,
        },
        flow: importExport,
      },
      select: {
        ldmRates: true,
        carrier: {
          select: {
            maxWeightPerLDM: true,
            fuelSurchargePercentage: true,
            maxHeightPerLDM: true,
          },
        },
      },
    });

    if (shipments.length === 0) {
      return null;
    }

    // Filter and sort the LDM rates
    const filteredRates = shipments.flatMap((shipment) => {
      const rates = shipment.ldmRates as unknown as Record<string, any>;
      return Object.entries(rates)
        .filter(([key]) => parseFloat(key) >= loadMeter)
        .map(([key, value]) => {
          let rateValue =
            typeof value === "object" && value !== null ? value.rate : value;
          let maxWeight =
            typeof value === "object" && value !== null && value.weight
              ? value.weight
              : shipment.carrier.maxWeightPerLDM;

          return {
            loadMeter: parseFloat(key),
            rate: rateValue,
            maxWeightPerLDM: maxWeight,
            maxHeightPerLDM: shipment.carrier.maxHeightPerLDM,
            fuelSurchargePercentage: shipment.carrier.fuelSurchargePercentage,
            isWeightFromRateObject:
              typeof value === "object" && value !== null && value.weight
                ? true
                : false,
          };
        });
    });

    const sortedLdmRates = filteredRates.sort(
      (a, b) => a.loadMeter - b.loadMeter,
    );

    // Check if the maximum weight per LDM is greater than the input weight
    let finalRate = sortedLdmRates[0];

    for (let i = 0; i < sortedLdmRates.length; i++) {
      const rate = sortedLdmRates[i];

      // Calculate maxWeightLDM only if the weight is not from the rate object
      const maxWeightLDM = rate.isWeightFromRateObject
        ? rate.maxWeightPerLDM
        : rate.maxWeightPerLDM * rate.loadMeter;

      console.log(maxWeightLDM);

      if (maxWeightLDM >= weight) {
        finalRate = rate;
        break;
      }
    }

    return finalRate;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching LDM rates");
  }
}
