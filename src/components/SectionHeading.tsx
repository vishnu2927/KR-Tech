import React from "react";

interface SectionHeadingProps {
  badge: string;
  badgeClass?: string;
  title: string;
  accent?: string;
  desc?: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  badgeClass = "badge-purple",
  title,
  accent,
  desc,
  center = true,
}: SectionHeadingProps) {
  return (
    <div
      style={{
        textAlign: center ? "center" : "left",
        maxWidth: center ? 640 : undefined,
        margin: center ? "0 auto" : undefined,
      }}
    >
      <span className={`badge ${badgeClass}`}>{badge}</span>
      <h2 className="section-title" style={{ marginTop: 12 }}>
        {title}
        {accent && <> <span className="gradient-text">{accent}</span></>}
      </h2>
      {desc && (
        <p
          className="section-desc"
          style={{ margin: center ? "12px auto 0" : "12px 0 0" }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
