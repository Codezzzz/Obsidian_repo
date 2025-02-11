import { atom } from "jotai";
import { step } from "../bottom-up-approach";
import { type UserName, UserNameStep } from "../components";
import { FormPayload, Step } from "./types";

export default step<UserName, FormPayload>(UserNameStep, {
  stepId: Step.UserName,
  valueAtom: ({ initialValue }) => {
    const [firstName = "", lastName = ""] = (initialValue?.name ?? "").split(
      " "
    );

    return atom<UserName>({ firstName, lastName });
  },
  serializeAtom: ({ valueAtom }) =>
    atom((get) => {
      const value = get(valueAtom);

      return { name: `${value.firstName} ${value.lastName}` };
    }),
  validateAtom: ({ valueAtom }) =>
    atom((get) => {
      const { firstName, lastName } = get(valueAtom);

      return firstName.length > 0 && lastName.length > 0;
    }),
});
