import { JsonSchemaObject, Serializable } from "../Types.js";

export const parseConst = (
  schema: JsonSchemaObject & { const: Serializable },
) => {
  return `{"type": "literal", "value": ${JSON.stringify(schema.const)}}`;
};
