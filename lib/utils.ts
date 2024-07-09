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
  const unroundedLoadMeter = loadMeter;
  loadMeter = Math.ceil(loadMeter * 10) / 10;

  const url = "http://localhost:3000/api/ldm";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      unloadingPostcode: values.unloadingPostcode,
      loadMeter: loadMeter,
      unloadingCountry: values.unloadingCountry,
    }),
  });

  const result = await response.json();

  console.log(result.rate);

  const carriers = [
    {
      name: "Rabelink",
      maxWeightPerLDM: 1500,
      baseRate: 106.2,
      fuelSurchargePercentage: 0.06,
      fixedSurcharge: 0,
      roadTax: 0,
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

  // Filter carriers based on the provided carrier name (e.g., 'Dsv')
  const selectedCarrier = carriers.find(
    (carrier) =>
      carrier.name.toLowerCase() === values.carrierName.toLowerCase(),
  );

  if (!selectedCarrier) {
    throw new Error(`Carrier ${values.carrierName} not found`);
  }

  const maxWeight = unroundedLoadMeter * selectedCarrier.maxWeightPerLDM;
  const baseCost = result.rate;
  const fuelSurcharge = baseCost * selectedCarrier.fuelSurchargePercentage;
  const totalCost = baseCost * 1.08 + selectedCarrier.roadTax;
  const roundedTotalCost = Math.round(totalCost);

  const resultObject = {
    carrier: selectedCarrier.name,
    maxWeight: maxWeight.toFixed(2),
    baseCost: baseCost.toFixed(2),
    fuelSurcharge: fuelSurcharge.toFixed(2),
    roadTax: selectedCarrier.roadTax.toFixed(2),
    fixedSurcharge: selectedCarrier.fixedSurcharge.toFixed(2),
    totalCost: totalCost.toFixed(2),
    roundedTotalCost: roundedTotalCost.toFixed(2),
  };

  console.log(resultObject);

  return resultObject;
}
