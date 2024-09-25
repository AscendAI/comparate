import { Prisma } from "@prisma/client";

export type CostCalculationResult =
  | {
      carrier: string;
      maxWeight: string;
      maxHeight: number;
      baseCost: string;
      fuelSurcharge: string;
      roadTax: string;
      totalCost: string;
      roundedTotalCost: string;
      loadMeter: number;
    }
  | { error: string };

export type Shipments = {
  ldmRates: Prisma.JsonValue;
  carrier: {
    maxWeightPerLDM: number;
    maxHeightPerLDM: number;
    fuelSurchargePercentage: number;
  };
}[];
