import { Atom, PrimitiveAtom } from "jotai";

export type FormStep<
  StepValue extends Record<string, unknown> = Record<string, unknown>,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = React.ComponentType<FormStepProps<StepValue>> &
  FormStepStatic<StepValue, Payload>;

export type FormStepProps<StepValue extends Record<string, unknown>> = {
  value: StepValue;
  onChange?: (value: StepValue) => void;
  error?: boolean;
};

export type FormStepStatic<
  StepValue extends Record<string, unknown> = Record<string, unknown>,
  Payload extends Record<string, unknown> = Record<string, unknown>
> = {
  stepId: string;
  valueAtom: (options: ValueAtomOptions<Payload>) => ValueAtom<StepValue>;
  serializeAtom: (
    options: SerializeAtomOptions<StepValue>
  ) => SerializeAtom<Payload>;
  validateAtom?: (options: ValidateAtomOptions<StepValue>) => ValidateAtom;
};

export type ValueAtom<Value extends Record<string, unknown>> =
  PrimitiveAtom<Value>;

export type SerializeAtom<Payload extends Record<string, unknown>> = Atom<
  Partial<Payload>
>;

export type ValidateAtom = Atom<boolean>;

type ValueAtomOptions<Value extends Record<string, unknown>> = {
  initialValue: Value;
};

type SerializeAtomOptions<Value extends Record<string, unknown>> = {
  valueAtom: ValueAtom<Value>;
};

type ValidateAtomOptions<Value extends Record<string, unknown>> = {
  valueAtom: ValueAtom<Value>;
};
