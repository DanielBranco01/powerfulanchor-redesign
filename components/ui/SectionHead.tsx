import Reveal from "./Reveal";

/** Cable-label style tag: magenta index cell + mono caption, like a printed Brady label. */
export function Tag({ code, children, dark = false }: { code: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`tag${dark ? " dark" : ""}`}>
      <b>{code}</b>
      <span>{children}</span>
    </span>
  );
}

export default function SectionHead({
  code,
  eyebrow,
  title,
  description,
  index = 0,
}: {
  code: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  index?: number;
}) {
  return (
    <Reveal className="sec-head" index={index}>
      <Tag code={code}>{eyebrow}</Tag>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}
