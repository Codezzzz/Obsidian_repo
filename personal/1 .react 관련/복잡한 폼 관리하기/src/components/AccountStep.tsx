type Account = {
  email: string;
  password: string;
};

type Props = {
  value: Account;
  onChange?: (value: Account) => void;
};

function AccountStep({ value, onChange }: Props) {
  return (
    <div>
      <input
        type="email"
        placeholder="이메일을 입력해주세요."
        value={value.email}
        onChange={(event) => {
          onChange?.({ ...value, email: event.target.value });
        }}
      />

      <input
        type="password"
        placeholder="패스워드를 입력해주세요."
        value={value.password}
        onChange={(event) => {
          onChange?.({ ...value, password: event.target.value });
        }}
      />
    </div>
  );
}

export { type Account, AccountStep };
