import { JsonSchemaObject, Refs } from "../Types.js";
import { parseAnyOf } from "./parseAnyOf.js";
import { parseOneOf } from "./parseOneOf.js";
import { its, parseSchema } from "./parseSchema.js";
import { parseAllOf } from "./parseAllOf.js";

export function parseObject(
  objectSchema: JsonSchemaObject & { type: "object" },
  refs: Refs,
): string {
  let properties: string | undefined = undefined;

  if (objectSchema.properties) {
    if (its.an.anyOf(objectSchema) || its.a.oneOf(objectSchema) || its.an.allOf(objectSchema)) {
      properties = `{"type": "intersection", "left": `;
    } else {
      properties = "";
    }
    if (!Object.keys(objectSchema.properties).length) {
      properties += `{"type": "object", "properties": {}`;
    } else {
      properties += `{"type": "object", "properties": {`;

      properties += Object.keys(objectSchema.properties)
        .map((key) => {
          const propSchema = objectSchema.properties![key];

          const result = `${JSON.stringify(key)}: ${parseSchema(propSchema, {
            ...refs,
            path: [...refs.path, "properties", key],
          })}`;

          const hasDefault =
            typeof propSchema === "object" && propSchema.default !== undefined;

          const required = Array.isArray(objectSchema.required)
            ? objectSchema.required.includes(key)
            : typeof propSchema === "object" && propSchema.required === true;

          const optional = !hasDefault && !required;

          return optional ? `${result.slice(0, -1)}, "isOptional": true}` : result;
        })
        .join(", ");

      properties += "}";
    }
  }

  const additionalProperties =
    objectSchema.additionalProperties !== undefined
      ? parseSchema(objectSchema.additionalProperties, {
          ...refs,
          path: [...refs.path, "additionalProperties"],
        })
      : undefined;

  let patternProperties: string | undefined = undefined;

  if (objectSchema.patternProperties) {
    const parsedPatternProperties = Object.fromEntries(
      Object.entries(objectSchema.patternProperties).map(([key, value]) => {
        return [
          key,
          parseSchema(value, {
            ...refs,
            path: [...refs.path, "patternProperties", key],
          }),
        ];
      }, {}),
    );

    patternProperties = "";

    if (properties) {
      if (additionalProperties) {
        patternProperties += `, "catchall": {"type": "union", "options": [${[
          ...Object.values(parsedPatternProperties),
          additionalProperties,
        ].join(", ")}]}`;
      } else if (Object.keys(parsedPatternProperties).length > 1) {
        patternProperties += `, "catchall": {"type": "union", "options": [${Object.values(
          parsedPatternProperties,
        ).join(", ")}]}`;
      } else {
        patternProperties += `, "catchall": ${Object.values(
          parsedPatternProperties,
        )}}`;
      }
    } else {
      if (additionalProperties) {
        patternProperties += `z.record(z.union([${[
          ...Object.values(parsedPatternProperties),
          additionalProperties,
        ].join(", ")}]))`;
      } else if (Object.keys(parsedPatternProperties).length > 1) {
        patternProperties += `z.record(z.union([${Object.values(
          parsedPatternProperties,
        ).join(", ")}]))`;
      } else {
        patternProperties += `z.record(${Object.values(
          parsedPatternProperties,
        )})`;
      }
    }

    patternProperties += ".superRefine((value, ctx) => {\n";

    patternProperties += "for (const key in value) {\n";

    if (additionalProperties) {
      if (objectSchema.properties) {
        patternProperties += `let evaluated = [${Object.keys(
          objectSchema.properties,
        )
          .map((key) => JSON.stringify(key))
          .join(", ")}].includes(key)\n`;
      } else {
        patternProperties += `let evaluated = false\n`;
      }
    }

    for (const key in objectSchema.patternProperties) {
      patternProperties +=
        "if (key.match(new RegExp(" + JSON.stringify(key) + "))) {\n";
      if (additionalProperties) {
        patternProperties += "evaluated = true\n";
      }
      patternProperties +=
        "const result = " +
        parsedPatternProperties[key] +
        ".safeParse(value[key])\n";
      patternProperties += "if (!result.success) {\n";

      patternProperties += `ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;

      patternProperties += "}\n";
      patternProperties += "}\n";
    }

    if (additionalProperties) {
      patternProperties += "if (!evaluated) {\n";
      patternProperties +=
        "const result = " + additionalProperties + ".safeParse(value[key])\n";
      patternProperties += "if (!result.success) {\n";

      patternProperties += `ctx.addIssue({
          path: [...ctx.path, key],
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`;

      patternProperties += "}\n";
      patternProperties += "}\n";
    }
    patternProperties += "}\n";
    patternProperties += "})";
  }

  let output = properties
    ? patternProperties
      ? properties + patternProperties
      : additionalProperties
        ? additionalProperties === `{"type": "never"}`
          ? properties + `, "unknownKeys": "strict"`
          : properties + `, "catchall": ${additionalProperties}`
        : properties
    : patternProperties
      ? patternProperties
      : additionalProperties
        ? `{"type": "record", "key": {"type": "string"}, "value": ${additionalProperties}`
        : `{"type": "record", "key": {"type": "string"}, "value": {"type": "any"}`;

  if (its.an.anyOf(objectSchema)) {
    output += `}, "right": ${parseAnyOf(
      {
        ...objectSchema,
        anyOf: objectSchema.anyOf.map((x) =>
          typeof x === "object" &&
          !x.type &&
          (x.properties || x.additionalProperties || x.patternProperties)
            ? { ...x, type: "object" }
            : x,
        ) as any,
      },
      refs,
    )}`;
  }

  if (its.a.oneOf(objectSchema)) {
    output += `}, "right": ${parseOneOf(
      {
        ...objectSchema,
        oneOf: objectSchema.oneOf.map((x) =>
          typeof x === "object" &&
          !x.type &&
          (x.properties || x.additionalProperties || x.patternProperties)
            ? { ...x, type: "object" }
            : x,
        ) as any,
      },
      refs,
    )}`;
  }

  if (its.an.allOf(objectSchema)) {
    output += `}, "right": ${parseAllOf(
      {
        ...objectSchema,
        allOf: objectSchema.allOf.map((x) =>
          typeof x === "object" &&
          !x.type &&
          (x.properties || x.additionalProperties || x.patternProperties)
            ? { ...x, type: "object" }
            : x,
        ) as any,
      },
      refs,
    )}`;
  }

  output += '}';

  return output;
}
