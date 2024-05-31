import bcrypt from "bcrypt";

const passwordHashing = async (password: string) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

const passwordCompare = async (
  password: string,
  passwordHash: string
): Promise<boolean> => {
  const matched = await bcrypt.compare(password, passwordHash);

  return matched;
};

export default {
  passwordHashing,
  passwordCompare,
};
