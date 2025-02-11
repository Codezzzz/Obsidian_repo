import { FormStep, ValueAtom, SerializeAtom, ValidateAtom } from "./types";
import { atom, Atom, useAtomValue } from "jotai";
import React, { createContext, JSX, useContext, useMemo } from "react";

export type Payload = Record<string, unknown>;

export type StepAtom = {
  valueAtom: ValueAtom<Record<string, unknown>>;
  serializeAtom: SerializeAtom<Payload>;
  validateAtom: ValidateAtom;
};

type FormContext = {
  valueAtoms: Record<string, StepAtom>;
  valueAtom: Atom<Payload>;
  validateAtom: Atom<boolean>;
};

const FormContext = createContext<FormContext | null>(null);

type Props = {
  steps: Record<string, FormStep>;
  children?: React.ReactNode;
  initialValue?: Payload;
};

export function FormProvider({
  steps,
  children,
  initialValue: _initialValue,
}: Props) {
  const initialValue: Payload = useMemo(
    () => _initialValue ?? {},
    [_initialValue]
  );

  const valueAtoms = useMemo(() => {
    const valueAtoms: Record<string, StepAtom> = {};

    Object.entries(steps).forEach(([stepId, step]) => {
      const valueAtom = step.valueAtom({ initialValue });
      const serializeAtom = step.serializeAtom({ valueAtom });
      const validateAtom = step.validateAtom?.({ valueAtom }) ?? atom(true);

      valueAtoms[stepId] = { valueAtom, serializeAtom, validateAtom };
    });

    return valueAtoms;
  }, [initialValue, steps]);

  const valueAtom = useMemo(() => {
    return atom<Payload>((get) => {
      const data = Object.values(valueAtoms).reduce((acc, step) => {
        return { ...acc, ...get(step.serializeAtom) };
      }, {});

      return data;
    });
  }, [valueAtoms]);

  const validateAtom = useMemo(() => {
    return atom<boolean>((get) => {
      const data = Object.values(valueAtoms).every((step) => {
        return get(step.validateAtom ?? atom(true));
      });

      return data;
    });
  }, [valueAtoms]);

  return (
    <FormContext.Provider value={{ valueAtoms, valueAtom, validateAtom }}>
      {children}
    </FormContext.Provider>
  );
}

export function withFormProvider<Props extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<Props>,
  {
    steps,
    initialValue,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    steps: Record<string, FormStep<any, any>>;
    initialValue?: Record<string, unknown>;
  }
) {
  return function Wrapper(props: Props) {
    return (
      <FormProvider steps={steps} initialValue={initialValue}>
        <Component {...props} />
      </FormProvider>
    );
  };
}

export function useFormContext() {
  const context = useContext(FormContext);

  if (context == null) {
    throw new Error("FormContext not found");
  }

  return context;
}

export function useFormPayload() {
  const context = useContext(FormContext);
  const valueAtom = context?.valueAtom;

  if (valueAtom == null) {
    throw new Error("FormContext not found");
  }

  return useAtomValue(valueAtom);
}

export function useFormValidation() {
  const context = useContext(FormContext);
  const validateAtom = context?.validateAtom;

  if (validateAtom == null) {
    throw new Error("FormContext not found");
  }

  return useAtomValue(validateAtom);
}

export function useFormStepValidation(step: string) {
  const context = useContext(FormContext);

  if (context == null) {
    throw new Error("FormContext not found");
  }

  const stepAtom = context.valueAtoms[step];

  return useAtomValue(stepAtom.validateAtom);
}
