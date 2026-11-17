import styles from "./section-heading.module.css";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  theme?: "dark" | "light";
  id?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  theme = "dark",
  id,
}: SectionHeadingProps) {
  return (
    <header className={styles.heading} data-theme={theme} data-heading>
      <div className={styles.kicker} data-heading-kicker>
        <span>{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className={styles.copy}>
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </header>
  );
}
