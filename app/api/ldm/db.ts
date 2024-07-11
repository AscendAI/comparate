import { CarrierName, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function fetchLdmRatesByPostcodeAndLoadMeter(
  unloadingPostcode: string,
  loadMeter: number,
  unloadingCountry: string,
  carrier: string,
) {
  try {
    const unloadingZone = unloadingPostcode.substring(0, 2);

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
      },
      select: {
        ldmRates: true,
      },
    });

    if (shipments.length === 0) {
      return [];
    }

    const filteredRates = shipments.flatMap((shipment) => {
      const rates = shipment.ldmRates as unknown as Record<string, number>;
      const filteredRate = Object.entries(rates)
        .filter(([key, value]) => parseFloat(key) >= loadMeter)
        .map(([key, value]) => ({ loadMeter: parseFloat(key), rate: value }));

      return filteredRate;
    });

    // Find the specific rate for the given load meter
    const sortedLdmRates = filteredRates.sort(
      (a, b) => a.loadMeter - b.loadMeter,
    );

    return sortedLdmRates;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching LDM rates");
  }
}
