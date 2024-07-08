import { NextResponse, type NextRequest } from "next/server";
import { fetchLdmRatesByPostcodeAndLoadMeter } from "./db";

export async function POST(req: NextRequest) {
  const { unloadingPostcode, loadMeter, unloadingCountry } = await req.json();

  const ldmrate = await fetchLdmRatesByPostcodeAndLoadMeter(
    unloadingPostcode,
    loadMeter,
    unloadingCountry,
  );

  const rateObject = ldmrate.find(
    (rate) => rate.loadMeter === parseFloat(loadMeter),
  );

  if (rateObject) {
    return NextResponse.json({ rate: rateObject.rate });
  } else {
    return NextResponse.json({ error: "Rate not found" }, { status: 404 });
  }
}
