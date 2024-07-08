import { InputDataTypes } from "@/components/input-component/inputdata";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = () => typeof window !== "undefined";

export async function costCalculation(values: InputDataTypes) {
  const [length, width, height] = values.dimensions
    .split("x")
    .map((dim) => parseFloat(dim.trim()) / 100); // converting cm to meters

  let loadMeter = (length * width) / 2.4;
  loadMeter = Math.ceil(loadMeter * 10) / 10;

  const carriers = [
    {
      name: "Raben",
      maxWeightPerLDM: 1500,
      baseRate: 106.2,
      fuelSurchargePercentage: 0.06,
      fixedSurcharge: 0,
      roadTax: 0, // assuming no road tax for Raben
    },
    {
      name: "DSV",
      maxWeightPerLDM: 1750,
      baseRate: 88.59,
      fuelSurchargePercentage: 0.08,
      fixedSurcharge: 0,
      roadTax: 2.67,
    },
  ];

  const results = carriers.map((carrier) => {
    const maxWeight = loadMeter * carrier.maxWeightPerLDM;
    const baseCost = carrier.baseRate;
    const fuelSurcharge = baseCost * carrier.fuelSurchargePercentage;
    const totalCost =
      baseCost +
      fuelSurcharge +
      carrier.roadTax +
      (values.fixedSurcharges ? carrier.fixedSurcharge : 0);
    const roundedTotalCost = Math.round(totalCost);

    return {
      carrier: values.carrierName,
      maxWeight: maxWeight.toFixed(2),
      baseCost: baseCost.toFixed(2),
      fuelSurcharge: fuelSurcharge.toFixed(2),
      roadTax: carrier.roadTax.toFixed(2),
      fixedSurcharge: carrier.fixedSurcharge.toFixed(2),
      totalCost: totalCost.toFixed(2),
      roundedTotalCost: roundedTotalCost.toFixed(2),
    };
  });

  console.log(results);

  return results;
}
