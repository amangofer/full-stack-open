const loginWith = async (page, username, password) => {
  await page.getByTestId("username").fill(username);
  await page.getByTestId("password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

const createBlog = async (page, blog) => {
  await page.getByRole("button", { name: "New Blog" }).click();
  await page.getByTestId("title").fill(blog.title);
  await page.getByTestId("author").fill(blog.author);
  await page.getByTestId("url").fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
};

const likeBlog = async (blogTitle) => {
  const blogDiv = blogTitle.locator("..");

  await blogDiv.getByRole("button", { name: "view" }).click();
  await blogDiv.getByRole("button", { name: "like" }).click();
  await blogDiv.getByRole("button", { name: "hide" }).click();

  return blogDiv;
};

export { loginWith, createBlog, likeBlog };
