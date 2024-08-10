import { parseEnum } from "../../src/parsers/parseEnum";
import { suite } from "../suite";

suite("parseEnum", (test) => {
  test("should create never with empty enum", (assert) => {
    assert(
      parseEnum(
        {
          enum: []
        },
      ),
      `{"type": "never"}`,
    );
  });

  test("should create literal with single item enum", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue"]
        },
      ),
      `{"type": "literal", "value": "someValue"}`,
    );
  });

  test("should create enum array with string enums", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue", "anotherValue"]
        },
      ),
      `{"type": "enum", "values": ["someValue","anotherValue"]}`,
    );
  });
  test("should create union with mixed enums", (assert) => {
    assert(
      parseEnum(
        {
          enum: ["someValue", 57]
        },
      ),
      `{"type": "union", "options": [{"type": "literal", "value": "someValue"}, {"type": "literal", "value": 57}]}`,
    );
  });
});
