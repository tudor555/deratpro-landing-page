import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getDictionary } from "@/i18n/dictionaries";
import { ContactForm } from "./ContactForm";

const { form } = getDictionary("ro").contact;

function setup(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const user = userEvent.setup();
  render(<ContactForm copy={form} onSubmit={onSubmit} />);
  return {
    user,
    onSubmit,
    name: screen.getByLabelText(form.name.label),
    phone: screen.getByLabelText(form.phone.label),
    message: screen.getByLabelText(form.message.label),
    submit: screen.getByRole("button", { name: form.submit }),
  };
}

describe("ContactForm", () => {
  it("renders labelled fields with the spec placeholders", () => {
    const { name, phone, message } = setup();
    expect(name).toHaveAttribute("placeholder", form.name.placeholder);
    expect(phone).toHaveAttribute("type", "tel");
    expect(phone).toHaveAttribute("autocomplete", "tel");
    expect(message.tagName).toBe("TEXTAREA");
  });

  it("shows every error on an empty submit and focuses the first invalid field", async () => {
    const { user, name, phone, message, submit, onSubmit } = setup();
    await user.click(submit);

    expect(name).toHaveAccessibleDescription(form.errors.name);
    expect(phone).toHaveAccessibleDescription(form.errors.phone);
    expect(message).toHaveAccessibleDescription(form.errors.message);
    for (const field of [name, phone, message]) expect(field).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveFocus();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("reproduces the spec error state", async () => {
    const { user, name, phone, message, submit } = setup();
    await user.type(name, "Ion Popescu");
    await user.type(phone, "0722");
    await user.click(submit);

    expect(name).not.toHaveAttribute("aria-invalid", "true");
    expect(phone).toHaveAccessibleDescription(form.errors.phone);
    expect(message).toHaveAccessibleDescription(form.errors.message);
    expect(phone).toHaveFocus();
  });

  it("clears an error as soon as the field becomes valid", async () => {
    const { user, phone, submit } = setup();
    await user.click(submit);
    await user.type(phone, "0722 000 000");
    expect(phone).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText(form.errors.phone)).not.toBeInTheDocument();
  });

  it("does not nag before the first submit", async () => {
    const { user, phone } = setup();
    await user.type(phone, "07");
    await user.tab();
    expect(screen.queryByText(form.errors.phone)).not.toBeInTheDocument();
  });

  it("submits trimmed values and shows the confirmation", async () => {
    const { user, name, phone, message, submit, onSubmit } = setup();
    await user.type(name, "  Ion Popescu ");
    await user.type(phone, "0722 000 000");
    await user.type(message, "Am gândaci în bucătărie.");
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Ion Popescu",
      phone: "0722 000 000",
      message: "Am gândaci în bucătărie.",
    });
    const heading = await screen.findByRole("heading", { name: form.success.title });
    expect(heading).toHaveFocus();
    expect(screen.getByText(form.success.text)).toBeInTheDocument();
  });

  it("starts a fresh, empty form from the confirmation", async () => {
    const { user, name, phone, message, submit } = setup();
    await user.type(name, "Ion Popescu");
    await user.type(phone, "0722000000");
    await user.type(message, "Am șoareci în pod.");
    await user.click(submit);

    await user.click(await screen.findByRole("button", { name: form.success.again }));
    expect(screen.getByLabelText(form.name.label)).toHaveValue("");
    expect(screen.getByLabelText(form.name.label)).toHaveFocus();
  });

  it("shows a sending state, then confirms, when no delivery is wired up", async () => {
    const user = userEvent.setup();
    render(<ContactForm copy={form} />);
    await user.type(screen.getByLabelText(form.name.label), "Ion Popescu");
    await user.type(screen.getByLabelText(form.phone.label), "0722000000");
    await user.type(screen.getByLabelText(form.message.label), "Am șoareci în pod.");
    await user.click(screen.getByRole("button", { name: form.submit }));

    expect(screen.getByRole("button", { name: form.sending })).toBeDisabled();
    expect(await screen.findByRole("heading", { name: form.success.title }, { timeout: 2000 })).toBeInTheDocument();
  });
});
