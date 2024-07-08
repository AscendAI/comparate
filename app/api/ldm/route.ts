import { type NextRequest } from "next/server";
import { fetchLdmRatesByPostcodeAndLoadMeter } from "./db";

export async function POST(req: NextRequest) {
  const { unloadingPostcode, loadMeter } = await req.json();

  const ldmrate = await fetchLdmRatesByPostcodeAndLoadMeter(
    unloadingPostcode,
    loadMeter,
  );

  console.log(ldmrate);
  return ldmrate;
}
