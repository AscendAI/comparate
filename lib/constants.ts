export const language = {
  CargoDetails: {
    english: "Cargo Details",
    dutch: "Vracht details",
  },
  detailsDescription: {
    english: "Please enter the details of your cargo shipment",
    dutch: "Voer de details van uw zending in.",
  },
  loadingpostcode: {
    english: "Loading Postcode",
    dutch: "Postcode van herkomst",
  },
  loadingcity: {
    english: "Loading Country",
    dutch: "Land herkomst",
  },
  unloadingpostcode: {
    english: "Unloading Postcode",
    dutch: "Postcode bestemming",
  },
  unloadingcity: {
    english: "Unloading Country",
    dutch: "Land bestemming",
  },
  enterpostcode: {
    english: "Enter Postcode",
    dutch: "Voer postcode in",
  },
  importexport: {
    english: "Import or Export",
    dutch: "Importeren of Exporteren",
  },
  import: {
    english: "Import",
    dutch: "Importeren",
  },
  export: {
    english: "Export",
    dutch: "Exporteren",
  },
  dimensions: {
    english: "Dimensions (cm)",
    dutch: "Afmetingen (cm)",
  },
  selectImportExport: {
    english: "Select Import or Export",
    dutch: "Selecteer Importeren of Exporteren",
  },
  lengthwidthheight: {
    english: "Length x Width x Height",
    dutch: "Lengte x Breedte x Hoogte",
  },
  weightinkilograms: {
    english: "Weight in Kilograms",
    dutch: "Gewicht in kil",
  },
  weight: {
    english: "Weight",
    dutch: "Gewicht",
  },
  noofpallets: {
    english: "No of Pallets",
    dutch: "Aantal pallets",
  },
  submit: {
    english: "Submit",
    dutch: "Verzenden",
  },
  carrier: {
    english: "Carrier",
    dutch: "Transporteur",
  },
  maxweight: {
    english: "Max Weight",
    dutch: "Max Gewicht",
  },
  rate: {
    english: "Rate",
    dutch: "Tarief",
  },
  roadtax: {
    english: "Road Tax",
    dutch: "Wegenbelasting",
  },
  fuelsurcharge: {
    english: "Fuel Surcharge",
    dutch: "Brandstoftoeslag",
  },
  totalcost: {
    english: "Total Cost",
    dutch: "Totale kosten",
  },
  length: {
    english: "Length",
    dutch: "Lengte",
  },
  width: {
    english: "Width",
    dutch: "Breedte",
  },
  height: {
    english: "height",
    dutch: "Hoogte",
  },
  invalidCode: {
    english: "Invalid postcode",
    dutch: "Ongeldige postcode",
  },
  invalidHeight: {
    english: "Height must be a positive number",
    dutch: "Hoogte moet een positief getal zijn",
  },
  invalidwidth: {
    english: "Width must be a positive number",
    dutch: "Breedte moet een positief getal zijn",
  },
  invalidlength: {
    english: "Length Must be a postive number",
    dutch: "Lengte moet een positief getal zijn",
  },
  invalidweight: {
    english: "Weight must be a positive number",
    dutch: "Gewicht moet een positief getal zijn",
  },
  invalidpallet: {
    english: "Number of pallets must be a non-negative integer",
    dutch: "Aantal pallets moet een niet-negatief geheel getal zijn",
  },
  noratesfound: {
    english: "No rates found for the given unloading country",
    dutch: "Geen tarieven gevonden voor het opgegeven losland",
  },
};

export const carriers = [
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
  "Drost",
] as const;

export const countryCodes = [
  "AT",
  "BE",
  "BG",
  "CH",
  "CZ",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "NO",
  "OK",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
] as const;

export const carrierList = [
  {
    name: "Rabelink",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "Dsv",
    maxWeightPerLDM: 1750,
    roadTax: 2.67,
  },
  {
    name: "Raben",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "NTGRoad",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "VanDijken",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "MooijTransport",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "Drost",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1500,
  },
  {
    name: "Lusocargo",
    fixedSurcharge: 0,
    roadTax: 0,
    maxWeightPerLDM: 1750,
  },
];
