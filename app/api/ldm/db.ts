import { CarrierName, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function fetchLdmRatesByPostcodeAndLoadMeter(
  unloadingPostcode: string,
  loadMeter: number,
  unloadingCountry: string,
  carrier: string,
  importExport: "Import" | "Export",
) {
  try {
    let unloadingZone = unloadingPostcode.substring(0, 2);
    if (unloadingZone.startsWith("0")) {
      unloadingZone = unloadingZone.substring(1);
    }

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

    const sortedLdmRates = filteredRates.sort(
      (a, b) => a.loadMeter - b.loadMeter,
    );

    return sortedLdmRates;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching LDM rates");
  }
}
