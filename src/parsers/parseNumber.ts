import { JsonSchemaObject } from "../Types.js";
import { withMessage } from "../utils/withMessage.js";

export const parseNumber = (
  schema: JsonSchemaObject & { type: "number" | "integer" },
) => {
  let r = `{"type": "number"`;

  if (schema.type === "integer") {
    r += withMessage(schema, "type", () => [`, "int": true`, ""]);
  } else {
    r += withMessage(schema, "format", ({ value }) => {
      if (value === "int64") {
        return [`, "int": true`, ""];
      }
    });
  }

  r += withMessage(schema, "multipleOf", ({ value, json }) => {
    if (value === 1) {
      if (r.startsWith(`{"type": "number", "int": true`)) {
        return;
      }

      return [`, "int": true`, ""];
    }

    return [`, "multipleOf": ${json}`, ""];
  });

  if (typeof schema.minimum === "number") {
    r += withMessage(schema, "minimum", ({ json }) => [
      `, "min": ${json}`,
      "",
    ]);
    if (schema.exclusiveMinimum !== true) {
      r += `, "minInclusive": true`;
    }
  } else if (typeof schema.exclusiveMinimum === "number") {
    r += withMessage(schema, "exclusiveMinimum", ({ json }) => [
      `, "min": ${json}`,
      "",
    ]);
  }

  if (typeof schema.maximum === "number") {
    r += withMessage(schema, "maximum", ({ json }) => [
      `, "max": ${json}`,
      "",
    ]);
    if (schema.exclusiveMaximum !== true) {
      r += `, "maxInclusive": true`;
    }
  } else if (typeof schema.exclusiveMaximum === "number") {
    r += withMessage(schema, "exclusiveMaximum", ({ json }) => [
      `, "max": ${json}`,
      "",
    ]);
  }

  r += "}";

  return r;
};
