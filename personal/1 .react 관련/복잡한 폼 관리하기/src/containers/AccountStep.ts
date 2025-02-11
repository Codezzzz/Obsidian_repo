import { atom } from "jotai";
import { step } from "../bottom-up-approach";
import { type Account, AccountStep } from "../components";
import { FormPayload, Step } from "./types";

export default step<Account, FormPayload>(AccountStep, {
  stepId: Step.Account,
  valueAtom: ({ initialValue }) => {
    const { email = "", password = "" } = initialValue ?? {};

    return atom<Account>({ email, password });
  },
  serializeAtom: ({ valueAtom }) => {
    return atom((get) => get(valueAtom));
  },
  validateAtom: ({ valueAtom }) => {
    return atom((get) => {
      const { email, password } = get(valueAtom);

      return email.length > 0 && password.length > 0;
    });
  },
});
