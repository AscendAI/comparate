import { InputDataTypes } from "@/components/input-component/inputdata";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = () => typeof window !== "undefined";

const carriers = [
  {
    name: "Rabelink",
    maxWeightPerLDM: 1500,
    fuelSurchargePercentage: 0.06,
    fixedSurcharge: 0,
    roadTax: 0,
  },
  {
    name: "Dsv",
    maxWeightPerLDM: 1750,
    fuelSurchargePercentage: 0.08,
    fixedSurcharge: 0,
    roadTax: 2.67,
  },
  {
    name: "Raben",
    maxWeightPerLDM: 1500,
    fuelSurchargePercentage: 0.06,
    fixedSurcharge: 0,
    roadTax: 0,
  },
  {
    name: "NTGRoad",
    maxWeightPerLDM: 1500,
    fuelSurchargePercentage: 0.06,
    fixedSurcharge: 0,
    roadTax: 0,
  },
  {
    name: "VanDijken",
    maxWeightPerLDM: 1500,
    fuelSurchargePercentage: 0.06,
    fixedSurcharge: 0,
    roadTax: 0,
  },
];

type CostCalculationResult =
  | {
      carrier: string;
      maxWeight: string;
      baseCost: string;
      fuelSurcharge: string;
      roadTax: string;
      fixedSurcharge: string;
      totalCost: string;
      roundedTotalCost: string;
    }
  | { error: string };

export async function costCalculation(
  values: InputDataTypes,
): Promise<CostCalculationResult[]> {
  const [length, width, height] = values.dimensions
    .split("x")
    .map((dim) => parseFloat(dim.trim()) / 100); // converting cm to meters

  let loadMeter = (length * width) / 2.4;
  const unroundedLoadMeter = loadMeter;
  loadMeter = Math.ceil(loadMeter * 10) / 10;

  const url = "http://localhost:3000/api/ldm";

  try {
    const fetchRate = async (carrier: string) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unloadingPostcode: values.unloadingPostcode,
          loadMeter: loadMeter,
          unloadingCountry: values.unloadingCountry,
          carrier: carrier,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Rate not found for carrier: ${carrier}`);
          return null;
        } else {
          throw new Error(
            `Network response was not ok for carrier: ${carrier}`,
          );
        }
      }

      const result = await response.json();

      if (result.error) {
        console.warn(`Error from server: ${result.error}`);
        return null;
      }

      return result.rate;
    };

    const ratePromises = carriers.map((carrier) =>
      fetchRate(carrier.name).then((rate) => ({
        ...carrier,
        baseRate: rate,
      })),
    );

    const resultsArray = (await Promise.all(ratePromises))
      .filter((carrier) => carrier.baseRate !== null) // Filter out carriers with no rates
      .map((carrier) => {
        const maxWeight = unroundedLoadMeter * carrier.maxWeightPerLDM;
        const fuelSurcharge = 1 + carrier.fuelSurchargePercentage;
        const totalCost = Math.ceil(
          carrier.baseRate * (1 + carrier.fuelSurchargePercentage) +
            carrier.roadTax,
        );
        const roundedTotalCost = Math.ceil(totalCost);

        return {
          carrier: carrier.name,
          maxWeight: maxWeight.toFixed(2),
          baseCost: carrier.baseRate.toFixed(2),
          fuelSurcharge: fuelSurcharge.toFixed(2),
          roadTax: carrier.roadTax.toFixed(2),
          fixedSurcharge: carrier.fixedSurcharge.toFixed(2),
          totalCost: totalCost.toFixed(2),
          roundedTotalCost: roundedTotalCost.toFixed(2),
        };
      });

    console.log(resultsArray);

    if (resultsArray.length === 0) {
      return [{ error: "No rates found for the given unloading country" }];
    }

    return resultsArray;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching rate:", error);
      return [{ error: error.message }];
    } else {
      console.error("Unexpected error:", error);
      return [{ error: "An unexpected error occurred" }];
    }
  }
}
