type Account = { username: string; isAdmin: boolean };

function validateUsername(input: { username: string }) {
  if (input.username.length < 5) {
    throw new Error("Account name is too short");
  }
  return input;
}

function printRecord(input: Record<string, string>) {
  for (const key in input) {
    const value = input[key];
    console.log(`${key}: ${value.trim().toLowerCase()}`);
  }
}

const account: Account = { username: "dmmulroy", isAdmin: true };
const validatedAccount = validateUsername(account);

printRecord(validatedAccount);
