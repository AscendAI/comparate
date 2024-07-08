import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LdmRate {
  loadMeter: number;
  rate: number;
}

export async function fetchLdmRatesByPostcodeAndLoadMeter(
  unloadingPostcode: string,
  loadMeter: number,
  unloadingCountry: string,
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
      },
      select: {
        ldmRates: true,
      },
    });

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
