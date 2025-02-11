export const enum Step {
  UserName = "UserName",
  Account = "Account",
  AdditionalInfo = "AdditionalInfo",
}

export type FormPayload = {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: "male" | "female" | "other";
};
