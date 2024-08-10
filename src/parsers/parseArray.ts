import { JsonSchemaObject, Refs } from "../Types.js";
import { withMessage } from "../utils/withMessage.js";
import { parseSchema } from "./parseSchema.js";

export const parseArray = (
  schema: JsonSchemaObject & { type: "array" },
  refs: Refs,
) => {
  if (Array.isArray(schema.items)) {
    return `{"type": "tuple", "items": [${schema.items.map((v, i) =>
      parseSchema(v, { ...refs, path: [...refs.path, "items", i] }),
    )}]}`;
  }

  let r = !schema.items
    ? `{"type": "array", "element": {"type": "any"}}`
    : `{"type": "array", "element": ${parseSchema(schema.items, {
        ...refs,
        path: [...refs.path, "items"],
      })}${
        withMessage(schema, "minItems", ({ json }) => [
          `, "minLength": ${json}`,
          "",
        ])
      }${
        withMessage(schema, "maxItems", ({ json }) => [
          `, "maxLength": ${json}`,
          "",
        ])
      }}`;

  return r;
};
