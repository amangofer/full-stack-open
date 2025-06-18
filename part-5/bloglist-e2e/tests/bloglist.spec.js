const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog, likeBlog } = require("./helper");

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
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Amanuel Haile",
        username: "aman",
        password: "password",
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
        url: "http://example.blog/2",
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

      test("blog can be deleted by the owner", async ({ page }) => {
        page.on("dialog", (dialog) => dialog.accept());
        const blogText = page.getByText("New Blog Matti Luukkainen");
        const blogDiv = blogText.locator("..");
        await blogDiv.getByRole("button", { name: "view" }).click();

        await expect(
          page.getByRole("button", { name: "remove" }),
        ).toBeVisible();
        await blogDiv.getByRole("button", { name: "remove" }).click();
        await expect(
          page.getByText("New Blog Matti Luukkainen"),
        ).not.toBeVisible();
      });

      test("can't delete a blog of diffrent user", async ({ page }) => {
        await page.getByRole("button", { name: "Logout" }).click();
        await loginWith(page, "aman", "password");
        const blogText = page.getByText("New Blog 2 Matti Luukkainen");
        const blogDiv = blogText.locator("..");
        await blogDiv.getByRole("button", { name: "view" }).click();
        await expect(
          page.getByRole("button", { name: "remove" }),
        ).not.toBeVisible();
      });

      test("blogs are arranged in the order according to the likes", async ({
        page,
      }) => {
        const blog3 = {
          title: "New Blog 3",
          author: "Amanuel Haile",
          url: "http://example.blog/3",
        };
        const blog4 = {
          title: "New Blog 4",
          author: "Amanuel Haile",
          url: "http://example.blog/4",
        };
        await createBlog(page, blog3);
        await createBlog(page, blog4);

        await expect(
          page.getByText(`${blog3.title} ${blog3.author}`),
        ).toBeVisible();
        await expect(
          page.getByText(`${blog4.title} ${blog4.author}`),
        ).toBeVisible();

        const firstBlog = page.locator(".blog").first()
        const blogs = await page.locator(".blog").all()
        const blog3Title = page.getByText(`${blog3.title} ${blog3.author}`);
        expect(await firstBlog.textContent()).not.toStrictEqual(await blog3Title.textContent()) 
 
        const blog3Div = await likeBlog(blog3Title);
        await likeBlog(blog3Title);
        await likeBlog(blog3Title);
        await blog3Div.getByRole("button", { name: "view" }).click();
        await expect(blog3Div.getByText("likes 3")).toBeVisible();
        expect(await firstBlog.textContent()).toStrictEqual(await blogs[0].textContent()) 
      });
    });
  });
});
