export type ContactField = "name" | "phone" | "message";
export type ContactValues = Record<ContactField, string>;
/** Maps each invalid field to the key of its error message in the dictionary. */
export type ContactErrors = Partial<Record<ContactField, ContactField>>;

export const NAME_MIN_LENGTH = 2;
export const MESSAGE_MIN_LENGTH = 10;

// Romanian numbers: 10 digits starting 02/03 (landline) or 07 (mobile), optionally +40 / 0040.
const RO_PHONE = /^(?:\+40|0040|0)[237]\d{8}$/;

export function isValidPhone(raw: string): boolean {
  return RO_PHONE.test(raw.replace(/[\s().-]/g, ""));
}

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < NAME_MIN_LENGTH) errors.name = "name";
  if (!isValidPhone(values.phone)) errors.phone = "phone";
  if (values.message.trim().length < MESSAGE_MIN_LENGTH) errors.message = "message";
  return errors;
}
