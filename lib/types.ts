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
    }
  | { error: string };
