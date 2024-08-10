import { JsonSchemaObject } from "../Types.js";

export const parseBoolean = (
  _schema: JsonSchemaObject & { type: "boolean" },
) => {
  return `{"type": "boolean"}`;
};
