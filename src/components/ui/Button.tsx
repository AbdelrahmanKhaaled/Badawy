import type { ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/animations/MagneticButton";
import { bookHref, type PresetId } from "@/lib/booking-presets";

type Props = {
  children: ReactNode;
  href?: string;
  /** Booking CTA: renders a real /book link (no-JS fallback) that opens the booking modal. */
  book?: { preset?: PresetId; service?: string };
  variant?: "solid" | "outline";
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  hero?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
};

export default function Button({ children, href, book, variant = "solid", arrow = true, icon, className = "", hero, onClick }: Props) {
  const cls = `btn btn-${variant} ${className}`;
  const heroAttr = hero ? { "data-hero": "" } : {};
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ArrowRight size={15} className="arr" aria-hidden="true" />}
    </>
  );
  let el: ReactNode;
  if (book) {
    el = <a href={bookHref(book)} data-book="" className={cls} {...heroAttr}>{inner}</a>;
  } else if (href?.startsWith("/")) {
    el = <Link href={href} className={cls} {...heroAttr}>{inner}</Link>;
  } else if (href) {
    el = <a href={href} className={cls} {...heroAttr}>{inner}</a>;
  } else {
    el = <button type="button" onClick={onClick} className={cls} {...heroAttr}>{inner}</button>;
  }
  return <MagneticButton {...(hero ? { className: "" } : {})}>{el}</MagneticButton>;
}
