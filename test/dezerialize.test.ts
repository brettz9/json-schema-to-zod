import { dezerialize } from "zodex";
import { jsonSchemaToZodex } from "../src/jsonSchemaToZodex.js";
import { suite } from "./suite.js";

suite("dezerialize", (test) => {
  test("is usable I guess", (assert) => {
    const zodSchema = dezerialize(
      JSON.parse(jsonSchemaToZodex({ type: "string" })),
    );

    assert(zodSchema.safeParse("Please just use Ajv instead"), {
      success: true,
      data: "Please just use Ajv instead",
    });
  });
});
