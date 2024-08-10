import { parseNumber } from "../../src/parsers/parseNumber";
import { suite } from "../suite";

suite("parseNumber", (test) => {
  test("should handle integer", (assert) => {
    assert(
      parseNumber({
        type: "integer",
      }),
      `{"type": "number", "int": true}`
    );

    assert(
      parseNumber({
        type: "integer",
        multipleOf: 1
      }),
      `{"type": "number", "int": true}`
    );

    assert(
      parseNumber({
        type: "number",
        multipleOf: 1
      }),
      `{"type": "number", "int": true}`
    );
  });

  test("should handle maximum with exclusiveMinimum", (assert) => {
    assert(
      parseNumber({
        type: "number",
        exclusiveMinimum: true,
        minimum: 2,
      }),
      `{"type": "number", "min": 2}`
    );
  });

  test("should handle maximum with exclusiveMinimum", (assert) => {
    assert(
      parseNumber({
        type: "number",
        minimum: 2,
      }),
      `{"type": "number", "min": 2, "minInclusive": true}`
    );
  });

  test("should handle maximum with exclusiveMaximum", (assert) => {
    assert(
      parseNumber({
        type: "number",
        exclusiveMaximum: true,
        maximum: 2,
      }),
      `{"type": "number", "max": 2}`
    );
  });

  test("should handle numeric exclusiveMaximum", (assert) => {
    assert(
      parseNumber({
        type: "number",
        exclusiveMaximum: 2,
      }),
      `{"type": "number", "max": 2}`
    );
  });

  // test("should accept errorMessage", (assert) => {
  //   assert(
  //     parseNumber({
  //       type: "number",
  //       format: "int64",
  //       exclusiveMinimum: 0,
  //       maximum: 2,
  //       multipleOf: 2,
  //       errorMessage: {
  //         format: "ayy",
  //         multipleOf: "lmao",
  //         exclusiveMinimum: "deez",
  //         maximum: "nuts",
  //       },
  //     }),

  //     'z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")',
  //   );
  // });
});
