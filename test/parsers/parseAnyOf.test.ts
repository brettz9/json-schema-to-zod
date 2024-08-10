import { parseAnyOf } from "../../src/parsers/parseAnyOf";
import { suite } from "../suite";

suite("parseAnyOf", (test) => {
  test("should create a union from two or more schemas", (assert) => {
    assert(
      parseAnyOf(
        {
          anyOf: [
            {
              type: "string",
            },
            { type: "number" },
          ],
        },
        { path: [], seen: new Map() },
      ),
      `{"type": "union", "options": [{"type": "string"}, {"type": "number"}]}`,
    );
  });

  test("should extract a single schema", (assert) => {
    assert(
      parseAnyOf(
        { anyOf: [{ type: "string" }] },
        { path: [], seen: new Map() },
      ),
      `{"type": "string"}`,
    );
  });

  test("should return z.any() if array is empty", (assert) => {
    assert(
      parseAnyOf({ anyOf: [] }, { path: [], seen: new Map() }),
      `{"type": "any"}`
    );
  });
});
