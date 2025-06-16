const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog App", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
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
      await loginWith(page, "mluukkai", "salainen");
    });
    test("a new blog can be created", async ({ page }) => {
      const blog = {
        title: "First Blog",
        author: "Matti Luukkainen",
        url: "http://example.blog/1",
      };
      await createBlog(page, blog);
      await expect(
        page.getByText(`${blog.title} ${blog.author}`),
      ).toBeVisible();
    });

    describe("and several notes exists", () => {
      const blog = {
        title: "New Blog",
        author: "Matti Luukkainen",
        url: "http://example.blog/1",
      };
      const blog2 = {
        title: "New Blog 2",
        author: "Matti Luukkainen",
        url: "http://example.blog/1",
      };

      beforeEach(async ({ page }) => {
        await createBlog(page, blog);
        await createBlog(page, blog2);
      });
      test("blog can be liked", async ({ page }) => {
        const blogText = page.getByText("New Blog Matti Luukkainen");
        const blogDiv = blogText.locator("..");

        await blogDiv.getByRole("button", { name: "view" }).click();
        await expect(blogDiv.getByText("likes 0")).toBeVisible();
        await blogDiv.getByRole("button", { name: "like" }).click();

        await expect(blogDiv.getByText("likes 1")).toBeVisible();
      });
    });
  });
});
