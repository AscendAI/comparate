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
    } = await req.json();

    const ldmrate = await fetchLdmRatesByPostcodeAndLoadMeter(
      unloadingPostcode,
      loadMeter,
      unloadingCountry,
      carrier,
      importExport,
    );

    if (ldmrate.length === 0) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    return NextResponse.json({ rate: ldmrate[0].rate });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
