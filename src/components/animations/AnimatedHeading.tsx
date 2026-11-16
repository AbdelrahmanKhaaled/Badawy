import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  lines: ReactNode[];
  className?: string;
  /** Hero headings are animated by their own timeline instead of ScrollTrigger. */
  manual?: boolean;
  delay?: number;
  id?: string;
};

/** Heading whose lines are masked and slide up when revealed. Screen readers get plain text. */
export default function AnimatedHeading({ as: Tag = "h2", lines, className = "", manual, delay, id }: Props) {
  return (
    <Tag id={id} className={className} {...(manual ? {} : { "data-lines": "", "data-delay": delay })}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span className="line-in">{l}</span>
        </span>
      ))}
    </Tag>
  );
}
