import { parseSchema } from "../../src/parsers/parseSchema.js";
import { suite } from "../suite";

suite("parseSchema", (test) => {
  test("should be usable without providing refs", (assert) => {
    assert(parseSchema({ type: "string" }), `{"type": "string"}`);
  });

  test("should return a seen and processed ref", (assert) => {
    const seen = new Map();
    const schema = {
      type: "object",
      properties: {
        prop: {
          type: "string"
        }
      }
    };
    assert(
      parseSchema(schema, { seen, path: [] })
    );
    assert(
      parseSchema(schema, { seen, path: [] })
    );
  });

  test("should be possible to describe a readonly schema", (assert) => {
    assert(
      parseSchema({ type: "string", readOnly: true }),
      `{"type": "string", "readonly": true}`,
    );
  });

  test("should handle nullable", (assert) => {
    assert(
      parseSchema(
        {
          type: "string",
          nullable: true,
        },
        { path: [], seen: new Map() },
      ),
      `{"type": "string", "isNullable": true}`,
    );
  });

  test("should handle enum", (assert) => {
    assert(
      parseSchema({ enum: ["someValue", 57] }),
      `{"type": "union", "options": [{"type": "literal", "value": "someValue"}, {"type": "literal", "value": 57}]}`,
    );
  });

  test("should handle multiple type", (assert) => {
    assert(
      parseSchema({ type: [
        "string", "number"
      ] }),
      `{"type": "union", "options": [{"type": "string"}, {"type": "number"}]}`,
    );
  });

//   test("should handle if-then-else type", (assert) => {
//     assert(
//       parseSchema({
//         if: {type: 'string'},
//         then: {type: 'number'},
//         else: {type: 'boolean'}
//       }),
//       `z.union([z.number(), z.boolean()]).superRefine((value,ctx) => {
//   const result = z.string().safeParse(value).success
//     ? z.number().safeParse(value)
//     : z.boolean().safeParse(value);
//   if (!result.success) {
//     result.error.errors.forEach((error) => ctx.addIssue(error))
//   }
// })`,
//     );
//   });

  test("should handle anyOf", (assert) => {
    assert(
      parseSchema({ anyOf: [
        {
          type: "string",
        },
        { type: "number" },
      ] }),
      `{"type": "union", "options": [{"type": "string"}, {"type": "number"}]}`,
    );
  });

  // test("should handle oneOf", (assert) => {
  //   assert(
  //     parseSchema({ oneOf: [
  //       {
  //         type: "string",
  //       },
  //       { type: "number" },
  //     ] }),
  //     `z.any().superRefine((x, ctx) => {
  //   const schemas = [z.string(), z.number()];
  //   const errors = schemas.reduce<z.ZodError[]>(
  //     (errors, schema) =>
  //       ((result) =>
  //         result.error ? [...errors, result.error] : errors)(
  //         schema.safeParse(x),
  //       ),
  //     [],
  //   );
  //   if (schemas.length - errors.length !== 1) {
  //     ctx.addIssue({
  //       path: ctx.path,
  //       code: "invalid_union",
  //       unionErrors: errors,
  //       message: "Invalid input: Should pass single schema",
  //     });
  //   }
  // })`,
  //   );
  // });
});
