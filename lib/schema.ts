import { z } from "zod";
import { useStore } from "@/lib/userStore";
import { carriers, language, countryCodes } from "./constants";

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
      .min(4, {
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
      .min(4, {
        message: toggleLanguage
          ? language.invalidCode.english
          : language.invalidCode.dutch,
      }),
  ]),
  unloadingCountry: z.enum(countryCodes),
  loadingPostcode: z
    .union([
      z
        .string()
        .max(6, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        })
        .min(4, {
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
        .min(4, {
          message: toggleLanguage
            ? language.invalidCode.english
            : language.invalidCode.dutch,
        }),
    ])
    .optional(),
  importExport: z.enum(["Import", "Export"]),
  width: z.coerce
    .number({
      invalid_type_error: toggleLanguage
        ? language.invalidwidth.english
        : language.invalidwidth.dutch,
    })
    .positive(),
  length: z.coerce
    .number({
      invalid_type_error: toggleLanguage
        ? language.invalidlength.english
        : language.invalidlength.dutch,
    })
    .positive(),
  height: z.coerce
    .number({
      invalid_type_error: toggleLanguage
        ? language.invalidHeight.english
        : language.invalidHeight.dutch,
    })
    .positive(),
  weight: z.coerce
    .number({
      required_error: toggleLanguage
        ? language.invalidweight.english
        : language.invalidweight.dutch,
    })
    .positive(),
  fixedSurcharges: z.boolean().optional(),
});

export type InputDataTypes = z.infer<typeof formSchema>;
