import { parseConst } from "../../src/parsers/parseConst";
import { suite } from "../suite";

suite("parseConst", (test) => {
  test("should handle falsy constants", (assert) => {
    assert(
      parseConst({
        const: false,
      }),
      `{"type": "literal", "value": false}`,
    );
  });
});
