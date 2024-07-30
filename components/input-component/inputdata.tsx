"use client";

import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
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
import { carriers, countryCodes, language } from "@/lib/constants";
import { CostCalculationResult } from "@/app/types";

const formSchema1 = z.object({
  carrierName: z.enum(carriers),
  unloadingPostcode: z.union([
    z.string().max(6).min(5),
    z.number().max(6).min(5),
  ]),
  unloadingCountry: z.enum(countryCodes),
  importExport: z.enum(["Import", "Export"]),
  width: z.coerce.number().positive("Width must be a positive number"),
  length: z.coerce.number().positive("Length Must be a postive number"),
  weight: z.coerce.number().positive("Weight must be a positive number"),
  fixedSurcharges: z.boolean().optional(),
});

export type InputDataTypes = z.infer<typeof formSchema1>;

export const InputData: FC = () => {
  const [results, setResults] = useState<CostCalculationResult[]>([]);
  const [toggleLanguage, setToggleLanguage] = useState(false);
  const [noRatesFound, setNoRatesFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    carrierName: z.enum(carriers),
    unloadingPostcode: z.union([
      z
        .string()
        .max(6, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        })
        .min(5, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        }),
      z
        .number()
        .max(6, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        })
        .min(5, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        }),
    ]),
    unloadingCountry: z.enum(countryCodes),
    importExport: z.enum(["Import", "Export"]),
    width: z.coerce
      .number()
      .positive(
        toggleLanguage
          ? language.invalidwidth.english
          : language.invalidwidth.dutch,
      ),
    length: z.coerce
      .number()
      .positive(
        toggleLanguage
          ? language.invalidlength.english
          : language.invalidlength.dutch,
      ),
    weight: z.coerce
      .number()
      .positive(
        toggleLanguage
          ? language.invalidweight.english
          : language.invalidweight.dutch,
      ),
    fixedSurcharges: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carrierName: "Dsv",
      unloadingPostcode: "",
      unloadingCountry: "DE",
      importExport: "Export",
      fixedSurcharges: false,
      weight: 0,
    },
  });

  const getPostcodeLabel = () => {
    const importExport = form.watch("importExport");
    if (importExport === "Import") {
      return toggleLanguage
        ? language.loadingpostcode.english
        : language.loadingpostcode.dutch;
    } else {
      return toggleLanguage
        ? language.unloadingpostcode.english
        : language.unloadingpostcode.dutch;
    }
  };

  const getCityLabel = () => {
    const importExport = form.watch("importExport");
    if (importExport === "Import") {
      return toggleLanguage
        ? language.loadingcity.english
        : language.loadingcity.dutch;
    } else {
      return toggleLanguage
        ? language.unloadingcity.english
        : language.unloadingcity.dutch;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const calculatedResults = await costCalculation(values);
    setResults(calculatedResults);
    setLoading(false);

    console.log("this is ", results);

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
          <Toggle
            aria-label="Toggle bold"
            variant="outline"
            onPressedChange={() => setToggleLanguage(!toggleLanguage)}
          >
            Toggle English/Dutch
          </Toggle>
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle>
                {toggleLanguage
                  ? language.CargoDetails.english
                  : language.CargoDetails.dutch}
              </CardTitle>
              <CardDescription>
                {toggleLanguage
                  ? language.detailsDescription.english
                  : language.detailsDescription.dutch}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="unloadingPostcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="unloading-postcode">
                        {getPostcodeLabel()}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="unloading-postcode"
                          type="text"
                          placeholder={
                            toggleLanguage
                              ? language.enterpostcode.english
                              : language.enterpostcode.dutch
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unloadingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getCityLabel()}</FormLabel>
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="importExport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {toggleLanguage
                          ? language.importexport.english
                          : language.importexport.dutch}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                toggleLanguage
                                  ? language.selectImportExport.english
                                  : language.selectImportExport.dutch
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"Export"}>
                            {toggleLanguage
                              ? language.export.english
                              : language.export.dutch}
                          </SelectItem>
                          <SelectItem value={"Import"}>
                            {toggleLanguage
                              ? language.import.english
                              : language.import.dutch}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormLabel htmlFor="dimensions">
                {toggleLanguage
                  ? language.dimensions.english
                  : language.dimensions.dutch}
              </FormLabel>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Input
                            id="length"
                            type="number"
                            placeholder={
                              toggleLanguage
                                ? language.length.english
                                : language.length.dutch
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Input
                            id="width"
                            type="number"
                            placeholder={
                              toggleLanguage
                                ? language.width.english
                                : language.width.dutch
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="weight">
                        {toggleLanguage
                          ? language.weight.english
                          : language.weight.dutch}
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="weight"
                          type="number"
                          placeholder={
                            toggleLanguage
                              ? language.weightinkilograms.english
                              : language.weightinkilograms.dutch
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-start">
              <Button
                type="submit"
                className="bg-lime-500 text-white hover:bg-lime-600 focus:ring-blue-500 dark:bg-blue-400 dark:text-gray-900 dark:hover:bg-blue-500 dark:focus:ring-blue-400"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {toggleLanguage
                  ? language.submit.english
                  : language.submit.dutch}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      {noRatesFound ? (
        <div className="mt-4 text-red-500">
          {toggleLanguage
            ? language.noratesfound.english
            : language.noratesfound.dutch}
        </div>
      ) : (
        results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  {toggleLanguage
                    ? language.carrier.english
                    : language.carrier.dutch}
                </TableHead>
                <TableHead>
                  {toggleLanguage
                    ? language.maxweight.english
                    : language.maxweight.dutch}
                </TableHead>
                <TableHead>
                  {toggleLanguage ? language.rate.english : language.rate.dutch}
                </TableHead>
                <TableHead>
                  {toggleLanguage
                    ? language.fuelsurcharge.english
                    : language.fuelsurcharge.dutch}
                </TableHead>
                <TableHead>
                  {toggleLanguage
                    ? language.totalcost.english
                    : language.totalcost.dutch}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((result, index) => (
                <TableRow
                  key={index}
                  className={`
        ${parseFloat(result.totalCost) === lowestCost ? "bg-green-100" : ""}
        ${parseFloat(result.baseCost) === 0 ? "bg-yellow-100" : ""}
      `}
                >
                  <TableCell className="font-medium">
                    {result.carrier}
                  </TableCell>
                  <TableCell>{result.maxWeight}</TableCell>
                  <TableCell>
                    {parseFloat(result.baseCost) === 0
                      ? "on Request"
                      : result.baseCost}
                  </TableCell>
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
