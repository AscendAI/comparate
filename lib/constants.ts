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
  loadingZonecode: {
    english: "Enter postcode for Nederlands",
    dutch: "Voer de postcode in voor Nederland",
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
    english: "Max Weight for 1 ldm",
    dutch: "Max Gewicht voor 1 ldm",
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
  tooltipMessage: {
    english: "Only required for NL to NL or NL to GB",
    dutch: "Alleen vereist voor NL naar NL of NL naar GB",
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
  "Lusocargo",
  "Leodejong",
  "Kingsrod",
  "Alles",
  "Tarieven",
  "Dimetra",
  "Rhenus",
] as const;

export const countryCodes = [
  "AT",
  "BE",
  "NL",
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
  "DK",
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
  "ES",
] as const;

export const carrierList = [
  {
    name: "Rabelink",
    roadTax: 0,
  },
  {
    name: "Dsv",
    roadTax: 2.67,
  },
  {
    name: "Raben",
    roadTax: 0,
  },
  {
    name: "NTGRoad",
    roadTax: 0,
  },
  {
    name: "VanDijken",
    roadTax: 0,
  },
  {
    name: "MooijTransport",
    roadTax: 0,
  },
  {
    name: "Drost",
    roadTax: 0,
  },
  {
    name: "Lusocargo",
    roadTax: 0,
  },
  {
    name: "ScanGlobalLogistics",
    roadTax: 0,
  },
  {
    name: "ThomasBoers",
    roadTax: 0,
  },
  {
    name: "Roemaat",
    roadTax: 0,
  },
  {
    name: "Palletways",
    roadTax: 0,
  },
  {
    name: "Mandersloot",
    roadTax: 0,
  },
  {
    name: "Leodejong",
    roadTax: 0,
  },
  {
    name: "Kingsrod",
    roadTax: 0,
  },
  {
    name: "Alles",
    roadTax: 0,
  },
  {
    name: "TarievenElst",
    roadTax: 0,
  },
  {
    name: "TarievenDeWit",
    roadTax: 0,
  },
  {
    name: "Dimetra",
    roadTax: 0,
  },
  {
    name: "Rhenus",
    roadTax: 0,
  },
  {
    name: "TarievenEasy",
    roadTax: 0,
  },
  {
    name: "Heppner",
    roadTax: 0,
  },
];

export const AllesPostCodeRange = {
  NL: [
    [0, 42],
    [46, 72],
    [76, 79],
    [8050, 8099],
    [81, 99],
  ],
  NLR: [
    [73, 75],
    [8000, 8045],
  ],
  NLZ: [[43, 45]],
};

export const TarievanEasyRange = {
  NL11: [[10, 15]],
  NL12: [[15, 20]],
  NL1: [[20, 25]],
  NL2: [[25, 30]],
  NL3: [[35, 40]],
  NL13: [[30, 35]],
  NL4: [[40, 45]],
  NL5: [[45, 50]],
  NL6: [[50, 55]],
  NL14: [[55, 60]],
  NL15: [[60, 65]],
  NL7: [[65, 70]],
  NL8: [[70, 75]],
  NL16: [[75, 80]],
  NL17: [[80, 85]],
  NL9: [[90, 95]],
  NL10: [[95, 99]],
};
