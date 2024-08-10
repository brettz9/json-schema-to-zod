import { JsonSchemaObject, Serializable } from "../Types.js";

export const parseEnum = (
  schema: JsonSchemaObject & { enum: Serializable[] },
) => {
  if (schema.enum.length === 0) {
    return `{"type": "never"}`;
  } else if (schema.enum.length === 1) {
    // union does not work when there is only one element
    return `{"type": "literal", "value": ${JSON.stringify(schema.enum[0])}}`;
  } else if (schema.enum.every((x) => typeof x === "string")) {
    return `{"type": "enum", "values": [${schema.enum.map((x) => JSON.stringify(x))}]}`;
  } else {
    return `{"type": "union", "options": [${schema.enum
      .map((x) => `{"type": "literal", "value": ${JSON.stringify(x)}}`)
      .join(", ")}]}`;
  }
};
