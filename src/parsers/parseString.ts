import { JsonSchemaObject } from "../Types.js";
import { withMessage } from "../utils/withMessage.js";

export const parseString = (schema: JsonSchemaObject & { type: "string" }) => {
  let r = `{"type": "string"`;

  r += withMessage(schema, "format", ({ value }) => {
    switch (value) {
      case "email":
        return [`, "kind": "email"`, ""];
      case "ip":
        return [`, "kind": "ip"`, ""];
      case "ipv4":
        return [`, "kind": "ip", "version": "v4"`, ""];
      case "ipv6":
        return [`, "kind": "ip", "version": "v6"`, ""];
      case "uri":
        return [`, "kind": "url"`, ""];
      case "uuid":
        return [`, "kind": "uuid"`, ""];
      case "date-time":
        return [`, "kind": "datetime", "offset": true`, ""];
      case "time":
        return [`, "kind": "time"`, ""];
      case "date":
        return [`, "kind": "date"`, ""];
      case "binary":
        return [`, "kind": "base64"`, ""];
      case "duration":
        return [`, "kind": "duration"`, ""];
    }
  });

  r += withMessage(schema, "contentEncoding", ({ value }) => {
    if (value === "base64") {
      return [`, "kind": "base64"`, ""];
    }
  });

  r += withMessage(schema, "pattern", ({ json }) => [
    `, "regex": ${json}`,
    "",
  ]);

  r += withMessage(schema, "minLength", ({ json }) => [
    `, "min": ${json}`,
    "",
  ]);

  r += withMessage(schema, "maxLength", ({ json }) => [
    `, "max": ${json}`,
    "",
  ]);

  r += '}';

  return r;
};
