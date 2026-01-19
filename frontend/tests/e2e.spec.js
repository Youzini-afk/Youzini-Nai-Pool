const { test, expect } = require("@playwright/test");

test.describe("NovelAI Pool UI", () => {
  test("login, upload key, view history", async ({ page }) => {
    await page.goto("http://localhost:5002");

    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByLabel("Username").first().fill("test");
    await page.getByLabel("Password").first().fill("test123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Signed in as")).toBeVisible();

    await page.getByRole("button", { name: "Keys" }).click();
    await page.getByLabel("API Key").fill("fake-key-for-test");
    await page.getByRole("button", { name: "Upload" }).click();

    await page.getByRole("button", { name: "Generate" }).click();
    await page.getByRole("button", { name: "Refresh" }).click();
    await page.getByText("Generation History").isVisible();
  });
});
