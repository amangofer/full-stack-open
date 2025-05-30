import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { describe } from "vitest";

describe("BlogForm Component Tests", () => {
  test("updates parent state and calls onSubmit", async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm handleSubmit={createBlog} />);

    const title = screen.getByLabelText("title");
    const author = screen.getByLabelText("author");
    const url = screen.getByLabelText("url");
    const submit = screen.getByRole("button", { name: /create/i });

    await user.type(title, "First Blog");
    await user.type(author, "User");
    await user.type(url, "www.userblog.dev/blogs/1");

    await user.click(submit);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("First Blog");
    expect(createBlog.mock.calls[0][0].author).toBe("User");
    expect(createBlog.mock.calls[0][0].url).toBe("www.userblog.dev/blogs/1");
  });
});
