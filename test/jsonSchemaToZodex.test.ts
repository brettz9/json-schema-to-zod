import {
  JSONSchema4,
  JSONSchema6Definition,
  JSONSchema7Definition,
} from "json-schema";
import jsonSchemaToZodex from "../src";
import { suite } from "./suite";

suite("jsonSchemaToZodex", (test) => {
  test("should accept json schema 7 and 4", (assert) => {
    const schema = { type: "string" } as unknown;

    assert(jsonSchemaToZodex(schema as JSONSchema4));
    assert(jsonSchemaToZodex(schema as JSONSchema6Definition));
    assert(jsonSchemaToZodex(schema as JSONSchema7Definition));
  });

//   test("should produce a string of JS code creating a Zod schema from a simple JSON schema", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.string()
// `,
//     );
//   });

//   test("should be possible to skip the import line", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//         },
//         { module: "esm", noImport: true },
//       ),
//       `export default z.string()
// `,
//     );
//   });

//   test("should be possible to add types", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//         },
//         { name: "mySchema", module: "esm", type: true },
//       ),
//       `import { z } from "zod"

// export const mySchema = z.string()
// export type MySchema = z.infer<typeof mySchema>
// `,
//     );
//   });

//   test("should be possible to add types with a custom name template", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//         },
//         { name: "mySchema", module: "esm", type: "MyType" },
//       ),
//       `import { z } from "zod"

// export const mySchema = z.string()
// export type MyType = z.infer<typeof mySchema>
// `,
//     );
//   });

//   test("should throw when given module cjs and type", (assert) => {
//     let didThrow = false;

//     try {
//       jsonSchemaToZodex(
//         { type: "string" },
//         { name: "hello", module: "cjs", type: true },
//       );
//     } catch {
//       didThrow = true;
//     }

//     assert(didThrow);
//   });

//   test("should throw when given type but no name", (assert) => {
//     let didThrow = false;

//     try {
//       jsonSchemaToZodex({ type: "string" }, { module: "esm", type: true });
//     } catch {
//       didThrow = true;
//     }

//     assert(didThrow);
//   });

//   test("should include defaults", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           default: "foo",
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.string().default("foo")
// `,
//     );
//   });

//   test("should include falsy defaults", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           default: "",
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.string().default("")
// `,
//     );
//   });

//   test("should include falsy defaults", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           const: "",
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.literal("")
// `,
//     );
//   });

//   test("can exclude defaults", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           default: "foo",
//         },
//         { module: "esm", withoutDefaults: true },
//       ),
//       `import { z } from "zod"

// export default z.string()
// `,
//     );
//   });

//   test("should include describes", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           description: "foo",
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.string().describe("foo")
// `,
//     );
//   });

//   test("can exclude describes", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "string",
//           description: "foo",
//         },
//         { module: "esm", withoutDescribes: true },
//       ),
//       `import { z } from "zod"

// export default z.string()
// `,
//     );
//   });

//   test("will remove optionality if default is present", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "object",
//           properties: {
//             prop: {
//               type: "string",
//               default: "def",
//             },
//           },
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.object({ "prop": z.string().default("def") })
// `,
//     );
//   });

//   test("will handle falsy defaults", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "boolean",
//           default: false,
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.boolean().default(false)
// `,
//     );
//   });

//   test("will ignore undefined as default", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           type: "null",
//           default: undefined,
//         },
//         { module: "esm" },
//       ),
//       `import { z } from "zod"

// export default z.null()
// `,
//     );
//   });

//   test("should be possible to define a custom parser", (assert) => {
//     assert(
//       jsonSchemaToZodex(
//         {
//           allOf: [
//             { type: "string" },
//             { type: "number" },
//             { type: "boolean", description: "foo" },
//           ],
//         },
//         {
//           // module: false,
//           parserOverride: (schema, refs) => {
//             if (
//               refs.path.length === 2 &&
//               refs.path[0] === "allOf" &&
//               refs.path[1] === 2 &&
//               schema.type === "boolean" &&
//               schema.description === "foo"
//             ) {
//               return "myCustomZodSchema";
//             }
//           },
//         },
//       ),

//       `z.intersection(z.string(), z.intersection(z.number(), myCustomZodSchema))`,
//     );
//   });

//   test("can output with cjs and a name", (assert) => {
//     assert(jsonSchemaToZodex({
//       type: "string"
//     }, { module: "cjs", name: "someName" }), `const { z } = require("zod")

// module.exports = { "someName": z.string() }
// `);
//   });

//   test("can output with cjs and no name", (assert) => {
//     assert(jsonSchemaToZodex({
//       type: "string"
//     }, { module: "cjs" }), `const { z } = require("zod")

// module.exports = z.string()
// `);
//   });

//   test("can output with name only", (assert) => {
//     assert(jsonSchemaToZodex({
//       type: "string"
//     }, { name: "someName" }), "const someName = z.string()");
//   });

  test("can exclude name", (assert) => {
    assert(jsonSchemaToZodex(true), `{"type": "any"}`);
  });
});
