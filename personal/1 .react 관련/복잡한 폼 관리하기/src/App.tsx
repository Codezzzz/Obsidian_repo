import { useState } from "react";
import { match } from "ts-pattern";

import {
  useFormPayload,
  useFormStepValidation,
  useFormValidation,
  withFormProvider,
  Step as StepComponent,
} from "./bottom-up-approach";
import type { Account, UserName, AdditionalInfo } from "./components";
import {
  AccountStep,
  AdditionalInfoStep,
  UserNameStep,
  Step,
} from "./containers";
import { submit } from "./utils";

function App() {
  const payload = useFormPayload();
  const isFormValid = useFormValidation();

  const [currentStep, setCurrentStep] = useState<Step>(Step.UserName);
  const isFirstStep = currentStep === Step.UserName;
  const isLastStep = currentStep === Step.AdditionalInfo;
  const isStepValid = useFormStepValidation(currentStep);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        submit(payload);
      }}
    >
      {match(currentStep)
        .with(Step.UserName, (stepId) => (
          <StepComponent<UserName> stepId={stepId}>
            {({ value, onChange }) => (
              <UserNameStep value={value} onChange={onChange} />
            )}
          </StepComponent>
        ))
        .with(Step.Account, (stepId) => (
          <StepComponent<Account> stepId={stepId}>
            {({ value, onChange }) => (
              <AccountStep value={value} onChange={onChange} />
            )}
          </StepComponent>
        ))
        .with(Step.AdditionalInfo, (stepId) => (
          <StepComponent<AdditionalInfo> stepId={stepId}>
            {({ value, onChange }) => (
              <AdditionalInfoStep value={value} onChange={onChange} />
            )}
          </StepComponent>
        ))
        .exhaustive()}

      {!isFirstStep && (
        <button
          onClick={() => {
            match(currentStep)
              .with(Step.Account, () => setCurrentStep(Step.UserName))
              .with(Step.AdditionalInfo, () => setCurrentStep(Step.Account))
              .exhaustive();
          }}
        >
          이전
        </button>
      )}

      {!isLastStep && (
        <button
          disabled={!isStepValid}
          onClick={() => {
            match(currentStep)
              .with(Step.UserName, () => setCurrentStep(Step.Account))
              .with(Step.Account, () => setCurrentStep(Step.AdditionalInfo))
              .exhaustive();
          }}
        >
          다음
        </button>
      )}

      <button
        type="submit"
        disabled={!isFormValid}
        style={{ display: "block" }}
      >
        제출
      </button>
    </form>
  );
}

export default withFormProvider(App, {
  steps: {
    [Step.UserName]: UserNameStep,
    [Step.Account]: AccountStep,
    [Step.AdditionalInfo]: AdditionalInfoStep,
  },
  initialValue: {
    email: "jane.doe@johndoehub.com",
    password: "janedoe",
    name: "Jane Doe",
    age: 14,
    gender: "male",
  },
});
