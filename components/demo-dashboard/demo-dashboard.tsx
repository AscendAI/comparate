import { FC } from "react";
import { Label } from "@/components/ui/label";
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

export const DemoDashboard: FC = () => {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Cargo Details</CardTitle>
        <CardDescription>
          Please enter the details of your cargo shipment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loading-postcode">Loading Postcode</Label>
            <Input
              id="loading-postcode"
              type="text"
              placeholder="Enter postcode"
              pattern="[0-9]{4,5}"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unloading-postcode">Unloading Postcode</Label>
            <Input
              id="unloading-postcode"
              type="text"
              placeholder="Enter postcode"
              pattern="[0-9]{4,5}"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loading-country">Loading Country</Label>
            <Input
              id="loading-country"
              type="text"
              placeholder="Country in English"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unloading-country">Unloading Country</Label>
            <Input
              id="unloading-country"
              type="text"
              placeholder="Country in English"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            type="text"
            placeholder="Length x Width x Height in cm"
            required
            className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Weight in kilograms"
              min="0"
              step="0.1"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pallets">Number of Pallets</Label>
            <Input
              id="pallets"
              type="number"
              placeholder="Number of pallets"
              min="0"
              step="1"
              required
              className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="fixed-surcharges"
            className="text-blue-500 focus:ring-blue-500 dark:text-blue-400 dark:focus:ring-blue-400"
          />
          <Label htmlFor="fixed-surcharges">
            Fixed Surcharges (for special requirements)
          </Label>
        </div>
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
  );
};
