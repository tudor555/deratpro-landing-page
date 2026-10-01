import { CircleAlert } from "lucide-react";
import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-md border border-line bg-surface px-4 text-body-md text-ink transition-[border-color,box-shadow] placeholder:text-ink-muted/70 focus:border-[1.5px] focus:border-primary focus:shadow-[0_0_0_4px_var(--color-mint-soft)] focus:outline-none";
const invalid = "border-[1.5px] border-error focus:border-error focus:shadow-[0_0_0_4px_rgb(220_38_38/0.12)]";

type BaseProps = {
  id: string;
  label: string;
  error?: string;
};

type InputFieldProps = BaseProps & { multiline?: false; ref?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement>;
type TextareaFieldProps = BaseProps & { multiline: true; ref?: Ref<HTMLTextAreaElement> } & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Field(props: InputFieldProps | TextareaFieldProps) {
  const { id, label, error } = props;
  const errorId = `${id}-error`;
  const a11y = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  } as const;

  let input;
  if (props.multiline) {
    const { multiline: _multiline, label: _label, error: _error, className, ...rest } = props;
    input = <textarea {...rest} {...a11y} className={cn(control, "h-35 resize-y py-3.5", error && invalid, className)} />;
  } else {
    const { multiline: _multiline, label: _label, error: _error, className, ...rest } = props;
    input = <input {...rest} {...a11y} className={cn(control, "h-13", error && invalid, className)} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-ink">
        {label}
      </label>
      {input}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-caption text-error">
          <Icon icon={CircleAlert} size={16} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
