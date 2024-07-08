import { InputDataTypes } from "@/components/input-component/inputdata";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = () => typeof window !== "undefined";

export function costCalculation(values: InputDataTypes) {
  const [length, width, height] = values.dimensions
    .split("x")
    .map((dim) => parseFloat(dim.trim()) / 100); // converting cm to meters

  const loadMeter = (length * width) / 2.4;

  const carriers = [
    {
      name: "Raben",
      maxWeightPerLDM: 1500,
      baseRate: 106.2,
      fuelSurchargePercentage: 0.06,
      roadTax: 0, // assuming no road tax for Raben
    },
    {
      name: "DSV",
      maxWeightPerLDM: 1750,
      baseRate: 88.59,
      fuelSurchargePercentage: 0.08,
      roadTax: 2.67,
    },
  ];

  const results = carriers.map((carrier) => {
    const maxWeight = loadMeter * carrier.maxWeightPerLDM;
    const baseCost = carrier.baseRate;
    const fuelSurcharge = baseCost * carrier.fuelSurchargePercentage;
    const totalCost = baseCost + fuelSurcharge + carrier.roadTax;

    return {
      carrier: carrier.name,
      maxWeight: maxWeight.toFixed(2),
      baseCost: baseCost.toFixed(2),
      fuelSurcharge: fuelSurcharge.toFixed(2),
      roadTax: carrier.roadTax.toFixed(2),
      totalCost: totalCost.toFixed(2),
    };
  });

  return results;
}
