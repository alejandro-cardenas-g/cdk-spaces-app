import { ISpaceEntry } from "../model/space.model";

export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected`);
  }
}

export class JsonError extends Error {}

export const validateAsSpaceEntry = (arg: any): arg is ISpaceEntry => {
  try {
    const castedEntry = arg as ISpaceEntry;
    if (!castedEntry.location) return false;
    if (!castedEntry.name) return false;
    if (!castedEntry.id) return false;
    return true;
  } catch (exception) {
    return false;
  }
};
