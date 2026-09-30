"use client";

import { Check, Lock, Send } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Dictionary } from "@/i18n/dictionaries";
import { Field } from "./Field";
import { type ContactErrors, type ContactField, type ContactValues, validateContact } from "./validation";

type ContactFormProps = {
  copy: Dictionary["contact"]["form"];
  /** Delivers the request. The demo only simulates a round trip. */
  onSubmit?: (values: ContactValues) => Promise<void>;
};

const FIELDS: ContactField[] = ["name", "phone", "message"];
const EMPTY: ContactValues = { name: "", phone: "", message: "" };

const simulateSend = () => new Promise<void>((resolve) => setTimeout(resolve, 700));

export function ContactForm({ copy, onSubmit = simulateSend }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const ids = { name: useId(), phone: useId(), message: useId() };
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successHeading = useRef<HTMLHeadingElement>(null);
  const restarting = useRef(false);

  // Move focus with the view swap so keyboard and screen-reader users land on the new content.
  useEffect(() => {
    if (status === "sent") {
      successHeading.current?.focus();
    } else if (status === "idle" && restarting.current) {
      restarting.current = false;
      fieldRefs.current.name?.focus();
    }
  }, [status]);

  const update = (field: ContactField, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted) setErrors(validateContact(next));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(values);
    setAttempted(true);
    setErrors(found);

    const firstInvalid = FIELDS.find((field) => found[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("sending");
    await onSubmit({ name: values.name.trim(), phone: values.phone.trim(), message: values.message.trim() });
    setStatus("sent");
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setAttempted(false);
    restarting.current = true;
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex h-full min-h-[480px] flex-col items-center justify-center text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald text-white shadow-halo">
          <Icon icon={Check} size={32} />
        </span>
        <h3 ref={successHeading} tabIndex={-1} className="mt-6 font-display text-h3 text-ink focus:outline-none">
          {copy.success.title}
        </h3>
        <p className="mt-2 max-w-sm text-ink-muted">{copy.success.text}</p>
        <Button variant="secondary" className="mt-8" onClick={reset}>
          {copy.success.again}
        </Button>
      </div>
    );
  }

  const errorFor = (field: ContactField) => (errors[field] ? copy.errors[field] : undefined);

  return (
    <form noValidate onSubmit={handleSubmit} aria-busy={status === "sending"}>
      <h3 className="font-display text-h3 text-ink">{copy.title}</h3>
      <div className="mt-6 flex flex-col gap-5">
        <Field
          id={ids.name}
          ref={(el) => {
            fieldRefs.current.name = el;
          }}
          label={copy.name.label}
          placeholder={copy.name.placeholder}
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          error={errorFor("name")}
        />
        <Field
          id={ids.phone}
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          label={copy.phone.label}
          placeholder={copy.phone.placeholder}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errorFor("phone")}
        />
        <Field
          multiline
          id={ids.message}
          ref={(el) => {
            fieldRefs.current.message = el;
          }}
          label={copy.message.label}
          placeholder={copy.message.placeholder}
          name="message"
          maxLength={1000}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          error={errorFor("message")}
        />
      </div>

      <Button type="submit" fullWidth trailingIcon={Send} disabled={status === "sending"} className="mt-8">
        {status === "sending" ? copy.sending : copy.submit}
      </Button>
      <p className="mt-4 text-center text-caption text-ink-muted">
        <Icon icon={Lock} size={14} className="mr-1.5 inline-block align-[-2px]" />
        {copy.privacy}
      </p>
    </form>
  );
}
