"use client";

import { FC, Key, useState } from "react";
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
import { CarrierCostResult } from "@/app/types";

import {
  Table,
  TableBody,
  TableCaption,
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
] as const;

const formSchema = z.object({
  carrierName: z.enum(carriers),
  loadingPostcode: z
    .string()
    .regex(/[0-9]{4,5}/, "Invalid postcode")
    .min(4)
    .max(5),
  unloadingPostcode: z
    .string()
    .regex(/[0-9]{4,5}/, "Invalid postcode")
    .min(4)
    .max(5),
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

  const [result, setResult] = useState<any | null>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const calculatedResult = costCalculation(values);
    setResult(calculatedResult);
  }

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
              <div>
                <FormField
                  control={form.control}
                  name="carrierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrier Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a carrier name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier} value={carrier}>
                              {carrier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                            <SelectValue placeholder="to country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((carrier) => (
                            <SelectItem key={carrier} value={carrier}>
                              {carrier}
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
                            <SelectValue placeholder="From country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((carrier) => (
                            <SelectItem key={carrier} value={carrier}>
                              {carrier}
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

      {result && result.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Carrier</TableHead>
              <TableHead>RoadTax</TableHead>
              <TableHead>Base cost</TableHead>
              <TableHead>Total cost</TableHead>
              <TableHead>Fuel Surcharge</TableHead>
              <TableHead>Max Weight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.map((item: CarrierCostResult, index: Key) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.carrier}</TableCell>
                <TableCell>{item.roadTax}</TableCell>
                <TableCell>{item.baseCost}</TableCell>
                <TableCell>{item.totalCost}</TableCell>
                <TableCell>{item.fuelSurcharge}</TableCell>
                <TableCell>{item.maxWeight}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption>A list of your recent invoices.</TableCaption>
        </Table>
      )}
    </div>
  );
};
