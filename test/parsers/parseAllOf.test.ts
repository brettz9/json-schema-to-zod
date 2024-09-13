import { parseAllOf } from "../../src/parsers/parseAllOf";
import { suite } from "../suite";

suite("parseAllOf", (test) => {
  test("should create never if empty", (assert) => {
    assert(
      parseAllOf(
        {
          allOf: [],
        },
        { path: [], seen: new Map() },
      ),
      `{"type": "never"}`,
    );
  });

  test("should handle true values", (assert) => {
    assert(
      parseAllOf(
        {
          allOf: [{type: "string"}, true],
        },
        { path: [], seen: new Map() },
      ),
      `{"type": "intersection", "left": {"type": "string"}, "right": {"type": "any"}}`,
    );
  });

  // test("should handle false values", (assert) => {
  //   assert(
  //     parseAllOf(
  //       {
  //         allOf: [{type: "string"}, false],
  //       },
  //       { path: [], seen: new Map() },
  //     ),
  //     ``{"type": "intersection", "left": {"type": "string"}, "right": {"type": "any"}}`
  //       .refine((value) => !z.any().safeParse(value).success, "Invalid input: Should NOT be valid against schema"))`,
  //   );
  // });
});
