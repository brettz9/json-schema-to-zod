import { parseAnyOf } from "./parseAnyOf.js";
import { parseBoolean } from "./parseBoolean.js";
import { parseDefault } from "./parseDefault.js";
import { parseMultipleType } from "./parseMultipleType.js";
import { parseNot } from "./parseNot.js";
import { parseNull } from "./parseNull.js";
import { parseAllOf } from "./parseAllOf.js";
import { parseArray } from "./parseArray.js";
import { parseConst } from "./parseConst.js";
import { parseEnum } from "./parseEnum.js";
import { parseIfThenElse } from "./parseIfThenElse.js";
import { parseNumber } from "./parseNumber.js";
import { parseObject } from "./parseObject.js";
import { parseString } from "./parseString.js";
import { parseOneOf } from "./parseOneOf.js";
import { parseNullable } from "./parseNullable.js";
import {
  ParserSelector,
  Refs,
  JsonSchemaObject,
  JsonSchema,
  Serializable,
} from "../Types.js";

export const parseSchema = (
  schema: JsonSchema,
  refs: Refs = { seen: new Map(), path: [] },
  blockMeta?: boolean,
): string => {
  if (typeof schema !== "object") return schema ? `{"type": "any"}` : `{"type": "never"}`;

  if (refs.parserOverride) {
    const custom = refs.parserOverride(schema, refs);

    if (typeof custom === "string") {
      return custom;
    }
  }

  let seen = refs.seen.get(schema);

  if (seen) {
    if (seen.r !== undefined) {
      return seen.r;
    }

    if (refs.depth === undefined || seen.n >= refs.depth) {
      return `{"type": "any"}`;
    }

    seen.n += 1;
  } else {
    seen = { r: undefined, n: 0 };
    refs.seen.set(schema, seen);
  }

  let parsed = selectParser(schema, refs);
  if (!blockMeta) {
    if (!refs.withoutDescribes) {
      parsed = addDescribes(schema, parsed);
    }

    if (!refs.withoutDefaults) {
      parsed = addDefaults(schema, parsed);
    }

    parsed = addAnnotations(schema, parsed)
  }

  seen.r = parsed;

  return parsed;
};

const addDescribes = (schema: JsonSchemaObject, parsed: string): string => {
  if (schema.description) {
    parsed += `, "description": ${JSON.stringify(schema.description)}}`;
  }

  return parsed;
};

const addDefaults = (schema: JsonSchemaObject, parsed: string): string => {
  if (schema.default !== undefined) {
    parsed = parsed.slice(0, -1) + `, "defaultValue": ${JSON.stringify(schema.default)}}`;
  }

  return parsed;
};

const addAnnotations = (schema: JsonSchemaObject, parsed: string): string => {
  if (schema.readOnly) {
    parsed = parsed.slice(0, -1) + `, "readonly": true}`;
  }

  return parsed;
};

const selectParser: ParserSelector = (schema, refs) => {
  if (its.a.nullable(schema)) {
    return parseNullable(schema, refs);
  } else if (its.an.object(schema)) {
    return parseObject(schema, refs);
  } else if (its.an.array(schema)) {
    return parseArray(schema, refs);
  } else if (its.an.anyOf(schema)) {
    return parseAnyOf(schema, refs);
  } else if (its.an.allOf(schema)) {
    return parseAllOf(schema, refs);
  } else if (its.a.oneOf(schema)) {
    return parseOneOf(schema, refs);
  } else if (its.a.not(schema)) {
    return parseNot(schema, refs);
  } else if (its.an.enum(schema)) {
    return parseEnum(schema); //<-- needs to come before primitives
  } else if (its.a.const(schema)) {
    return parseConst(schema);
  } else if (its.a.multipleType(schema)) {
    return parseMultipleType(schema, refs);
  } else if (its.a.primitive(schema, "string")) {
    return parseString(schema);
  } else if (
    its.a.primitive(schema, "number") ||
    its.a.primitive(schema, "integer")
  ) {
    return parseNumber(schema);
  } else if (its.a.primitive(schema, "boolean")) {
    return parseBoolean(schema);
  } else if (its.a.primitive(schema, "null")) {
    return parseNull(schema);
  } else if (its.a.conditional(schema)) {
    return parseIfThenElse(schema, refs);
  } else {
    return parseDefault(schema);
  }
};

export const its = {
  an: {
    object: (x: JsonSchemaObject): x is JsonSchemaObject & { type: "object" } =>
      x.type === "object",
    array: (x: JsonSchemaObject): x is JsonSchemaObject & { type: "array" } =>
      x.type === "array",
    anyOf: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      anyOf: JsonSchema[];
    } => x.anyOf !== undefined,
    allOf: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      allOf: JsonSchema[];
    } => x.allOf !== undefined,
    enum: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      enum: Serializable | Serializable[];
    } => x.enum !== undefined,
  },
  a: {
    nullable: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & { nullable: true } =>
      (x as any).nullable === true,
    multipleType: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & { type: string[] } => Array.isArray(x.type),
    not: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      not: JsonSchema;
    } => x.not !== undefined,
    const: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      const: Serializable;
    } => x.const !== undefined,
    primitive: <T extends "string" | "number" | "integer" | "boolean" | "null">(
      x: JsonSchemaObject,
      p: T,
    ): x is JsonSchemaObject & { type: T } => x.type === p,
    conditional: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      if: JsonSchema;
      then: JsonSchema;
      else: JsonSchema;
    } =>
      Boolean(
        "if" in x && x.if && "then" in x && "else" in x && x.then && x.else,
      ),
    oneOf: (
      x: JsonSchemaObject,
    ): x is JsonSchemaObject & {
      oneOf: JsonSchema[];
    } => x.oneOf !== undefined,
  },
};
