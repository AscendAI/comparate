import fetchRetry from "fetch-retry";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { carrierList } from "./constants";
import { CostCalculationResult } from "./types";
import { InputDataTypes } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = () => typeof window !== "undefined";

const fetch = fetchRetry(global.fetch);

export async function costCalculation(
  values: InputDataTypes,
): Promise<CostCalculationResult[]> {
  const length = values.length / 100;
  const width = values.width / 100;
  let loadMeter = (length * width) / 2.4;
  console.log(loadMeter);

  const url = "/api/ldm";

  const fetchRate = async (carrier: string) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        retries: 3,
        retryDelay: 1000,
        body: JSON.stringify({
          unloadingPostcode: values.unloadingPostcode,
          loadMeter: loadMeter,
          unloadingCountry: values.unloadingCountry,
          carrier: carrier,
          importExport: values.importExport,
          weight: values.weight,
          loadingPostcode: values.loadingPostcode,
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

      console.log(`values of ${carrier}`, result);

      if (result.error) {
        console.warn(`Error from server: ${result.error}`);
        return null;
      }

      return {
        ...result,
        carrier,
      };
    } catch (error) {
      console.error(`Error fetching rate for carrier: ${carrier}`, error);
      return null;
    }
  };

  try {
    const ratePromises = carrierList.map((carrier) => fetchRate(carrier.name));
    const rateResults = await Promise.all(ratePromises);
    const validResults = rateResults.filter((result) => result !== null);

    const resultsArray = validResults.map((result) => {
      const fuelSurcharge = result.fuelSurchargePercentage / 100 + 1;
      const totalCost = Math.ceil(result.rate * fuelSurcharge);
      const roundedTotalCost = Math.ceil(totalCost);

      return {
        carrier: result.carrier,
        maxWeight: result.maxWeight,
        maxHeight: result.maxHeight,
        baseCost: result.rate.toFixed(2),
        fuelSurcharge: result.fuelSurchargePercentage.toFixed(2),
        roadTax: carrierList[0].roadTax.toFixed(2),
        totalCost: totalCost.toFixed(2),
        roundedTotalCost: roundedTotalCost.toFixed(2),
        loadMeter: result.loadMeter,
      };
    });

    console.log(resultsArray);

    if (resultsArray.length === 0) {
      return [{ error: "No rates found for the given unloading country" }];
    }

    return resultsArray;
  } catch (error) {
    console.error("Error in cost calculation:", error);
    return [{ error: "An unexpected error occurred during cost calculation" }];
  }
}

export function findLoadingCountry(
  input: string | null,
  postCodeRange: Object,
) {
  if (!input) return null;

  const code = parseInt(input);

  for (const [label, ranges] of Object.entries(postCodeRange)) {
    for (const [start, end] of ranges) {
      if (code >= start && code <= end) {
        return label;
      }
    }
  }
}
