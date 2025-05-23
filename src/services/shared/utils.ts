import { v4 } from "uuid";
import { JsonError } from "./validator";

export const ParseJson = (arg: string) => {
  try {
    return JSON.parse(arg);
  } catch (e) {
    throw new JsonError("");
  }
};

export const CreateRandomId = () => {
  return v4();
};
