import type { ReactNode } from "react";

export default function PolicyPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <section className="page-hero">
        <div className="container-narrow stack">
          <span className="eyebrow">Policies</span>
          <h1 className="h1">{title}</h1>
          <p className="muted small">Last updated {updated}</p>
        </div>
      </section>
      <section className="section-sm">
        <div className="container-narrow">
          <div className="prose">{children}</div>
        </div>
      </section>
    </>
  );
}
