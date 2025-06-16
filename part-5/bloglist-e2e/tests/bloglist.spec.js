const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog App", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/reset");
    await request.post("http://localhost:3001/api/user", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("login to application")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");
      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
      await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("wongpassword");
      await page.getByRole("button", { name: "Login" }).click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("invalid username or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
    });
  });

  describe("When loged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId("username").fill("mluukkai");
      await page.getByTestId("password").fill("salainen");
      await page.getByRole("button", { name: "Login" }).click();
    });
    test("a new blog can be created", async({ page }) => {
      await page.getByRole("button", {name: "New Blog"}).click()
      await page.getByTestId("title").fill("First Blog")
      await page.getByTestId("author").fill("Matti Luukkainen")
      await page.getByTestId("url").fill("http://example.blog/1")
      await page.getByRole("button", {name: "create"}).click()

      await expect(page.getByText("First Blog Matti Luukkainen")).toBeVisible()
    });
  });
});
