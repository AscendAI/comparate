"use client";

import { FC, useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { costCalculation } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const carriers = [
  "Dsv",
  "ScanGlobalLogistics",
  "VanDijken",
  "ThomasBoers",
  "Roemaat",
  "Raben",
  "Rabelink",
  "Palletways",
  "NTGRoad",
  "MooijTransport",
  "Mandersloot",
] as const;

const countryCodes = [
  "DE",
  "FR",
  "NL",
  "ES",
  "IT",
  "BE",
  "LU",
  "GB",
  "CH",
  "NO",
  "SE",
  "DK",
  "FI",
] as const;

const formSchema = z.object({
  carrierName: z.enum(carriers),
  loadingPostcode: z
    .string()
    .regex(/^(?:[0-9]{4}[A-Za-z]{2}|[0-9]{5})$/, "Invalid postcode")
    .min(5)
    .max(6), // The length should be exactly 5 or 6 characters
  unloadingPostcode: z
    .string()
    .regex(/^(?:[0-9]{4}[A-Za-z]{2}|[0-9]{5})$/, "Invalid postcode")
    .min(5)
    .max(6), // The length should be exactly 5 or 6 characters
  loadingCountry: z.enum(countryCodes),
  unloadingCountry: z.enum(countryCodes),
  dimensions: z
    .string()
    .regex(/^[0-9]+x[0-9]+x[0-9]+$/, "Invalid dimensions format"),
  weight: z.coerce.number().positive("Weight must be a positive number"),
  pallets: z.coerce
    .number()
    .int()
    .nonnegative("Number of pallets must be a non-negative integer"),
  fixedSurcharges: z.boolean().optional(),
});

export type InputDataTypes = z.infer<typeof formSchema>;

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

export const InputData: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carrierName: "Dsv",
      loadingPostcode: "",
      unloadingPostcode: "",
      loadingCountry: "NL",
      unloadingCountry: "DE",
      dimensions: "",
      weight: 0,
      pallets: 0,
      fixedSurcharges: false,
    },
  });

  const [results, setResults] = useState<CostCalculationResult[]>([]);
  const [noRatesFound, setNoRatesFound] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const calculatedResults = await costCalculation(values);
    setResults(calculatedResults);

    if (calculatedResults.length > 0 && "error" in calculatedResults[0]) {
      setNoRatesFound(true);
    } else {
      setNoRatesFound(false);
    }
  }

  const getLowestCost = (results: CostCalculationResult[]) => {
    const costs = results
      .filter(
        (result): result is Exclude<CostCalculationResult, { error: string }> =>
          "totalCost" in result,
      )
      .map((result) => parseFloat(result.totalCost));
    return Math.min(...costs);
  };

  const lowestCost =
    results.length > 0 && !noRatesFound ? getLowestCost(results) : null;

  const sortedResults = results
    .filter(
      (result): result is Exclude<CostCalculationResult, { error: string }> =>
        "totalCost" in result,
    )
    .sort((a, b) => parseFloat(a.totalCost) - parseFloat(b.totalCost));

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>Cargo Details</CardTitle>
              <CardDescription>
                Please enter the details of your cargo shipment.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loadingPostcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="loading-postcode">
                        Loading Postcode
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="loading-postcode"
                          type="text"
                          placeholder="Enter postcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unloadingPostcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="unloading-postcode">
                        Unloading Postcode
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="unloading-postcode"
                          type="text"
                          placeholder="Enter postcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loadingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loading Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unloadingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unloading Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dimensions">Dimensions</FormLabel>
                    <FormControl>
                      <Input
                        id="dimensions"
                        type="text"
                        placeholder="Length x Width x Height in cm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="weight">Weight</FormLabel>
                      <FormControl>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="Weight in kilograms"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pallets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="pallets">Number of Pallets</FormLabel>
                      <FormControl>
                        <Input
                          id="pallets"
                          type="number"
                          placeholder="Number of pallets"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="fixedSurcharges"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Checkbox
                        id="fixed-surcharges"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel htmlFor="fixed-surcharges">
                      Fixed Surcharges (for special requirements)
                    </FormLabel>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="ml-auto bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-500 dark:focus:ring-blue-400"
              >
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      {noRatesFound ? (
        <div className="mt-4 text-red-500">
          No rates found for the given unloading country
        </div>
      ) : (
        results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Carrier</TableHead>
                <TableHead>Max Weight</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>RoadTax</TableHead>
                <TableHead>Fuel Surcharge</TableHead>
                <TableHead>Total cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow
                  key={index}
                  className={
                    parseFloat(result.totalCost) === lowestCost
                      ? "bg-green-100"
                      : ""
                  }
                >
                  <TableCell className="font-medium">
                    {result.carrier}
                  </TableCell>
                  <TableCell>{result.maxWeight}</TableCell>
                  <TableCell
                    className={
                      parseFloat(result.baseCost) === 0 ? "text-yellow-500" : ""
                    }
                  >
                    {parseFloat(result.baseCost) === 0
                      ? "on Request"
                      : result.baseCost}
                  </TableCell>
                  <TableCell>{result.roadTax}</TableCell>
                  <TableCell>{result.fuelSurcharge}</TableCell>
                  <TableCell>{result.totalCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
};
