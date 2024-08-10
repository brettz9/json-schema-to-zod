import { JsonSchemaObject } from "../Types.js";

export const parseDefault = (_schema: JsonSchemaObject) => {
  return `{"type": "any"}`;
};
