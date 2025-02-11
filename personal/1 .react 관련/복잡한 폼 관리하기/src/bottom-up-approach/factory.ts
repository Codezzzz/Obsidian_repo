import { FormStep, FormStepProps, FormStepStatic } from "./types";

export function step<
  StepValue extends Record<string, unknown>,
  Payload extends Record<string, unknown>
>(
  Component: React.ComponentType<FormStepProps<StepValue>>,
  options: FormStepStatic<StepValue, Payload>
): FormStep<StepValue, Payload> {
  return Object.assign(Component, {
    displayName: `step(${Component.displayName})`,
    ...options,
  });
}
