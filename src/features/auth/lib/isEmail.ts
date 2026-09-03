import { z } from "zod";

const emailSchema = z.string().email();

const isEmail = (str: string): boolean => {
  return emailSchema.safeParse(str).success;
}

export default isEmail;
