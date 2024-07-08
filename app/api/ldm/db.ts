import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LdmRate {
  loadMeter: number;
  rate: number;
}

export async function fetchLdmRatesByPostcodeAndLoadMeter(
  unloadingPostcode: string,
  loadMeter: number,
) {
  try {
    const unloadingZone = unloadingPostcode.substring(0, 2);
    const shipments = await prisma.shipment.findMany({
      where: {
        zipcode: unloadingZone,
      },
      select: {
        ldmRates: true,
      },
    });

    // Parsing JSON field and filtering based on loadMeter
    const filteredShipments = shipments.map((shipment) => {
      const rates: LdmRate[] = shipment.ldmRates as unknown as LdmRate[];
      return {
        ...shipment,
        ldmRates: rates.filter((rate) => rate.loadMeter >= loadMeter),
      };
    });

    // Flatten the array and sort by loadMeter
    const sortedLdmRates = filteredShipments
      .flatMap((shipment) => shipment.ldmRates)
      .sort((a, b) => a.loadMeter - b.loadMeter);

    return sortedLdmRates;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching LDM rates");
  }
}
