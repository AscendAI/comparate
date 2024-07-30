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
    let unloadingZone = unloadingPostcode.substring(0, 2).replace(/^0/, "");

    // Query the database for matching shipments and fetch additional carrier information
    const shipments = await prisma.shipment.findMany({
      where: {
        toCountry: {
          code: unloadingCountry,
        },
        zipcode: {
          startsWith: unloadingZone,
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
          },
        },
      },
    });

    if (shipments.length === 0) {
      return null;
    }

    // Filter and sort the LDM rates
    const filteredRates = shipments.flatMap((shipment) => {
      const rates = shipment.ldmRates as unknown as Record<string, number>;
      return Object.entries(rates)
        .filter(([key, value]) => parseFloat(key) >= loadMeter)
        .map(([key, value]) => ({
          loadMeter: parseFloat(key),
          rate: value,
          maxWeightPerLDM: shipment.carrier.maxWeightPerLDM,
          fuelSurchargePercentage: shipment.carrier.fuelSurchargePercentage,
        }));
    });

    const sortedLdmRates = filteredRates.sort(
      (a, b) => a.loadMeter - b.loadMeter,
    );

    // Check if the maximum weight per LDM is greater than the input weight
    let finalRate = sortedLdmRates[0];
    console.log(finalRate);

    for (let i = 0; i <= sortedLdmRates.length; i++) {
      const rate = sortedLdmRates[i];
      const maxWeightLDM = rate.maxWeightPerLDM * rate.loadMeter;
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
