import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type LinkProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined };

export type ButtonProps = LinkProps | NativeButtonProps;

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-strong hover:-translate-y-px",
  secondary: "border-[1.5px] border-primary text-primary hover:bg-mint-haze hover:text-primary-strong",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "lg",
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-button whitespace-nowrap",
    "transition-[background-color,color,transform] duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  const content = (
    <>
      {leadingIcon && <Icon icon={leadingIcon} />}
      {children}
      {trailingIcon && <Icon icon={trailingIcon} />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} data-variant={variant} className={classes}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} type={type} data-variant={variant} className={classes}>
      {content}
    </button>
  );
}
