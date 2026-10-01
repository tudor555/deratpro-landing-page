import { describe, expect, it } from "vitest";
import { isValidPhone, validateContact } from "./validation";

describe("isValidPhone", () => {
  it.each([
    "0722000000",
    "0722 000 000",
    "0722-000-000",
    "0722.000.000",
    "+40722000000",
    "+40 722 000 000",
    "0040722000000",
    "0212345678",
    "(021) 234 5678",
    "0364 123 456",
  ])("accepts %j", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(["", "0722", "07220000000", "072200000", "0122000000", "+41722000000", "0722abc000", "phone"])(
    "rejects %j",
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
    },
  );
});

describe("validateContact", () => {
  const valid = { name: "Ion Popescu", phone: "0722 000 000", message: "Am gândaci în bucătărie." };

  it("returns no errors for a complete request", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every empty field", () => {
    expect(validateContact({ name: "", phone: "", message: "" })).toEqual({
      name: "name",
      phone: "phone",
      message: "message",
    });
  });

  it("matches the spec's error state: short phone and empty message", () => {
    expect(validateContact({ name: "Ion Popescu", phone: "0722", message: "" })).toEqual({
      phone: "phone",
      message: "message",
    });
  });

  it("ignores surrounding whitespace when counting characters", () => {
    expect(validateContact({ ...valid, name: "  I  " })).toEqual({ name: "name" });
    expect(validateContact({ ...valid, message: "   123456789   " })).toEqual({ message: "message" });
    expect(validateContact({ ...valid, message: "1234567890" })).toEqual({});
  });
});
