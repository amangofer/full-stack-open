import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { describe, expect } from "vitest";

describe("Blog Component Test", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "user",
    url: "www",
    likes: 4,
  };

  test("renders blog title and author", () => {
    render(<Blog blog={blog} />);

    const title = screen.getByText(`${blog.title} ${blog.author}`);
    expect(title).toBeDefined();
  });

  test("dose not render url", () => {
    const { container } = render(<Blog blog={blog} />);

    const url = container.querySelector(".blog-url");
    expect(url).toBe(null);
  });

  test("dose not render number of likes", () => {
    const { container } = render(<Blog blog={blog} />);

    const likes = container.querySelector(".blog-likes");
    expect(likes).toBe(null);
  });

  test("renders url and number of likes", async () => {
    render(<Blog blog={blog} />);

    const button = screen.getByRole("button", { name: /view/i });
    await userEvent.click(button);

    const likes = screen.getByText(`likes ${blog.likes}`);
    expect(likes).toBeDefined();

    const url = screen.getByText(blog.url);
    expect(url).toBeDefined();
  });

  test("like button works", async () => {
    const likeHandler = vi.fn();
    render(<Blog blog={blog} handleLike={likeHandler} />);

    const button = screen.getByRole("button", { name: /view/i });
    await userEvent.click(button);

    const user = userEvent.setup();
    const like = screen.getByRole("button", { name: /like/i });
    await user.click(like);
    await user.click(like);

    expect(likeHandler.mock.calls).toHaveLength(2);
  });
});
