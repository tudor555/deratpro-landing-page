import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("opens the default language from the bare domain", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/ro\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("renders every section in Romanian without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/ro/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("fără dăunători");
    for (const name of ["Tot ce ai nevoie", "De ce aleg clienții DeratPro", "Simplu, în 3 pași", "Cere o ofertă gratuită"]) {
      await expect(page.getByRole("heading", { level: 2, name: new RegExp(name) })).toBeVisible();
    }
    expect(errors).toEqual([]);
  });

  test("switches to English and back", async ({ page }) => {
    await page.goto("/ro/");
    await page.getByRole("group", { name: "Limba site-ului" }).getByRole("link", { name: "EN" }).click();
    await expect(page).toHaveURL(/\/en\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("pest-free");

    await page.getByRole("group", { name: "Site language" }).getByRole("link", { name: "RO" }).click();
    await expect(page).toHaveURL(/\/ro\/$/);
  });

  test("validates the quote form and confirms a valid request", async ({ page }) => {
    await page.goto("/ro/#contact");
    const submit = page.getByRole("button", { name: "Trimite cererea" });

    await page.getByLabel("Nume").fill("Ion Popescu");
    await page.getByLabel("Telefon").fill("0722");
    await submit.click();
    await expect(page.getByText("Introdu un număr de telefon valid.")).toBeVisible();
    await expect(page.getByText("Mesajul trebuie să aibă cel puțin 10 caractere.")).toBeVisible();
    await expect(page.getByLabel("Telefon")).toBeFocused();

    await page.getByLabel("Telefon").fill("0722 000 000");
    await page.getByLabel("Mesaj").fill("Am gândaci în bucătărie, apartament 2 camere.");
    await submit.click();
    await expect(page.getByRole("heading", { name: "Mulțumim!" })).toBeVisible();

    await page.getByRole("button", { name: "Trimite o altă cerere" }).click();
    await expect(page.getByLabel("Nume")).toHaveValue("");
  });

  test("reaches the contact form from the navigation", async ({ page, isMobile }) => {
    await page.goto("/ro/");
    if (isMobile) {
      await page.getByRole("button", { name: "Deschide meniul" }).click();
    }
    await page.getByRole("navigation", { name: "Navigare principală" }).getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole("heading", { name: "Cere o ofertă gratuită" })).toBeInViewport();
  });

  test("mounts the Clean Sweep scene behind the hero", async ({ page }) => {
    await page.goto("/ro/");
    await expect(page.locator("section canvas")).toHaveCount(1, { timeout: 10_000 });
  });

  test("skips the 3D scene for reduced-motion users", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/ro/");
    await page.waitForTimeout(2000);
    await expect(page.locator("canvas")).toHaveCount(0);
  });

  for (const locale of ["ro", "en"]) {
    test(`has no serious accessibility violations (${locale})`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}/`);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});
