import { JsonSchemaObject } from "../Types.js";

export const parseNull = (_schema: JsonSchemaObject & { type: "null" }) => {
  return `{"type": "null"}`;
};
