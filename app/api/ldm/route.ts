import { NextResponse, type NextRequest } from "next/server";
import { fetchLdmRatesByPostcodeAndLoadMeter } from "./db";

export async function POST(req: NextRequest) {
  try {
    const {
      unloadingPostcode,
      loadMeter,
      unloadingCountry,
      carrier,
      importExport,
      weight,
    } = await req.json();

    const ldmrate = await fetchLdmRatesByPostcodeAndLoadMeter(
      unloadingPostcode,
      loadMeter,
      unloadingCountry,
      carrier,
      importExport,
      weight,
    );

    if (!ldmrate) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    return NextResponse.json({
      loadMeter: ldmrate.loadMeter,
      rate: ldmrate.rate,
      maxHeight: ldmrate.maxHeightPerLDM,
      fuelSurchargePercentage: ldmrate.fuelSurchargePercentage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
