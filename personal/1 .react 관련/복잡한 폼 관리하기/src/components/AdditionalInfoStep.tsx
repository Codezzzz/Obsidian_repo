type AdditionalInfo = {
  age?: number;
  gender?: "male" | "female" | "other";
};

type Props = {
  value: AdditionalInfo;
  onChange?: (value: AdditionalInfo) => void;
};

function AdditionalInfoStep({ value, onChange }: Props) {
  return (
    <div>
      <label htmlFor="age">나이를 입력해주세요.</label>
      <input
        type="number"
        name="age"
        value={value.age ?? 1}
        min={1}
        max={999}
        onChange={(event) => {
          onChange?.({ ...value, age: Number(event.target.value) });
        }}
      />

      <label htmlFor="gender">성별을 입력해주세요.</label>
      <select
        name="gender"
        value={value.gender}
        onChange={(event) => {
          onChange?.({
            ...value,
            gender: event.target.value as "male" | "female" | "other",
          });
        }}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
}

export { type AdditionalInfo, AdditionalInfoStep };
