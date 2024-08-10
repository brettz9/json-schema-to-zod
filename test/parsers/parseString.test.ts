import { dezerialize } from "zodex";
import { parseString } from "../../src/parsers/parseString";
import { suite } from "../suite";

suite("parseString", (test) => {
  // const run = (output: string, data: unknown) =>
  //   dezerialize(JSON.parse(output)).safeParse(
  //     data,
  //   );

  // test("DateTime format", (assert) => {
  //   const datetime = "2018-11-13T20:20:39Z";

  //   const code = parseString({
  //     type: "string",
  //     format: "date-time",
  //     errorMessage: { format: "hello" },
  //   });

  //   assert(code, 'z.string().datetime({ offset: true, message: "hello" })');

  //   assert(run(code, datetime), { success: true, data: datetime });
  // });

  test("email", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "email",
      }),
      `{"type": "string", "kind": "email"}`,
    );
  });

  test("ip", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "ip",
      }),
      `{"type": "string", "kind": "ip"}`,
    );
    assert(
      parseString({
        type: "string",
        format: "ipv6",
      }),
      `{"type": "string", "kind": "ip", "version": "v6"}`,
    );
  });

  test("uri", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "uri",
      }),
      `{"type": "string", "kind": "url"}`,
    );
  });

  test("uuid", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "uuid",
      }),
      `{"type": "string", "kind": "uuid"}`,
    );
  });

  test("time", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "time",
      }),
      `{"type": "string", "kind": "time"}`,
    );
  });

  test("date", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "date",
      }),
      `{"type": "string", "kind": "date"}`,
    );
  });

  test("duration", (assert) => {
    assert(
      parseString({
        type: "string",
        format: "duration",
      }),
      `{"type": "string", "kind": "duration"}`,
    );
  });

  test("base64", (assert) => {
    assert(
      parseString({
        type: "string",
        contentEncoding: "base64",
      }),
      `{"type": "string", "kind": "base64"}`,
    );
    // assert(
    //   parseString({
    //     type: "string",
    //     contentEncoding: "base64",
    //     errorMessage: {
    //       contentEncoding: "x",
    //     },
    //   }),
    //   'z.string().base64("x")',
    // );
    assert(
      parseString({
        type: "string",
        format: "binary",
      }),
      `{"type": "string", "kind": "base64"}`,
    );
    // assert(
    //   parseString({
    //     type: "string",
    //     format: "binary",
    //     errorMessage: {
    //       format: "x",
    //     },
    //   }),
    //   'z.string().base64("x")',
    // );
  });

  // test("should accept errorMessage", (assert) => {
  //   assert(
  //     parseString({
  //       type: "string",
  //       format: "ipv4",
  //       pattern: "x",
  //       minLength: 1,
  //       maxLength: 2,
  //       errorMessage: {
  //         format: "ayy",
  //         pattern: "lmao",
  //         minLength: "deez",
  //         maxLength: "nuts",
  //       },
  //     }),
  //     'z.string().ip({ version: "v4", message: "ayy" }).regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")',
  //   );
  // });
});
