const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog App", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("login to application")).toBeVisible();
  });
});
