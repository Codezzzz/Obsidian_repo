type UserName = {
  firstName: string;
  lastName: string;
};

type Props = {
  value: UserName;
  onChange?: (value: UserName) => void;
};

function UserNameStep({ value, onChange }: Props) {
  return (
    <div>
      <input
        type="text"
        placeholder="성을 입력해주세요."
        value={value.lastName}
        onChange={(event) => {
          onChange?.({ ...value, lastName: event.target.value });
        }}
      />

      <input
        type="text"
        placeholder="이름을 입력해주세요."
        value={value.firstName}
        onChange={(event) => {
          onChange?.({ ...value, firstName: event.target.value });
        }}
      />
    </div>
  );
}

export { type UserName, UserNameStep };
