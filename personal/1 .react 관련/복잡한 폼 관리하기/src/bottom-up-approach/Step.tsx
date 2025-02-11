import { Atom, atom, useAtom, useAtomValue } from "jotai";
import { useFormContext } from "./context";
import { FormStepProps } from "./types";

export function Step<StepValue extends Record<string, unknown>>({
  stepId,
  children,
}: {
  stepId: string;
  children: (props: FormStepProps<StepValue>) => React.ReactNode;
}) {
  const { valueAtoms } = useFormContext();
  const { valueAtom, validateAtom } = valueAtoms[stepId];

  const [value, onChange] = useAtom(valueAtom as Atom<StepValue>);
  const error = useAtomValue<boolean>(validateAtom ?? atom(false));

  return <section id={stepId}>{children({ value, onChange, error })}</section>;
}
