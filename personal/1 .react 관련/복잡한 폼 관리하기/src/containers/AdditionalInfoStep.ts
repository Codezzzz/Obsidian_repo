import { atom } from "jotai";
import { step } from "../bottom-up-approach";
import { type AdditionalInfo, AdditionalInfoStep } from "../components";
import { FormPayload, Step } from "./types";

export default step<AdditionalInfo, FormPayload>(AdditionalInfoStep, {
  stepId: Step.AdditionalInfo,
  valueAtom: ({ initialValue }) => {
    const { age, gender } = initialValue ?? {};

    return atom<AdditionalInfo>({ age, gender });
  },
  serializeAtom: ({ valueAtom }) => atom((get) => get(valueAtom)),
  validateAtom: ({ valueAtom }) =>
    atom((get) => {
      const { age = NaN, gender } = get(valueAtom);

      return !isNaN(age) && gender !== undefined;
    }),
});
