import { describe, expect, it } from "vitest";
import { getDictionary } from "./dictionaries";

describe("service area", () => {
  it("covers Bihor and Cluj counties", () => {
    expect(getDictionary("ro").contact.info.area).toBe("Județele Bihor și Cluj");
    expect(getDictionary("en").contact.info.area).toBe("Bihor and Cluj counties");
  });
});
