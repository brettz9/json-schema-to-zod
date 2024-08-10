import { JsonSchemaObject, Refs } from "../Types.js";
import { parseSchema } from "./parseSchema.js";

export const parseMultipleType = (
  schema: JsonSchemaObject & { type: string[] },
  refs: Refs,
) => {
  return `{"type": "union", "options": [${schema.type
    .map((type) => parseSchema({ ...schema, type } as any, refs))
    .join(", ")}]}`;
};
