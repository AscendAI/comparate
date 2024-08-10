import { z } from "zod";
import { useStore } from "@/lib/userStore";
import {
  carriers,
  language,
  countryCodes,
  loadingCountryCodes,
} from "./constants";

const { toggleLanguage } = useStore.getState();

export const formSchema = z.object({
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
  loadingCountry: z.enum(loadingCountryCodes).optional(),
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
  height: z.coerce
    .number()
    .positive(
      toggleLanguage
        ? language.invalidHeight.english
        : language.invalidHeight.dutch,
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

export type InputDataTypes = z.infer<typeof formSchema>;
