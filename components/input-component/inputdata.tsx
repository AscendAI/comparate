"use client";

import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
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
import { countryCodes, language } from "@/lib/constants";
import { CostCalculationResult } from "@/lib/types";
import { useStore } from "@/lib/userStore";
import { formSchema } from "@/lib/schema";

export const InputData: FC = () => {
  const [results, setResults] = useState<CostCalculationResult[]>([]);
  const [noRatesFound, setNoRatesFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toggleLanguage } = useStore();

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

  const sortedResults = results
    .filter(
      (result): result is Exclude<CostCalculationResult, { error: string }> =>
        "totalCost" in result,
    )
    .sort((a, b) => {
      // Prioritize by height constraint first, then by cost
      const isAHeightValid = a.maxHeight > form.getValues().height;
      const isBHeightValid = b.maxHeight > form.getValues().height;

      if (isAHeightValid && !isBHeightValid) return -1; // a should come first
      if (!isAHeightValid && isBHeightValid) return 1; // b should come first

      // If both are valid or invalid, sort by total cost
      return parseFloat(a.totalCost) - parseFloat(b.totalCost);
    });

  const lowestCost =
    sortedResults.length > 0 ? parseFloat(sortedResults[0].totalCost) : null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Input
                            id="height"
                            type="number"
                            placeholder={
                              toggleLanguage
                                ? language.height.english
                                : language.height.dutch
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
              {sortedResults.map((result, index) =>
                result.maxHeight > form.getValues().height ? (
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
                ) : (
                  <TableRow key={index}>
                    <TableCell
                      colSpan={5}
                      align="center"
                      className="border border-gray-300 bg-gray-100 p-4 text-gray-700 font-semibold"
                    >
                      Exceeds {result.carrier}&apos;s height limit
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
};
