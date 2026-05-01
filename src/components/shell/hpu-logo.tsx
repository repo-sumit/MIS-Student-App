"use client";

import Image from "next/image";

export function HpuLogo({ size = 28, withWordmark = false, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2 " + (className || "")}>
      <span
        className="inline-flex items-center justify-center overflow-hidden rounded-md ring-1 ring-line bg-white"
        style={{ width: size, height: size }}
      >
        <Image
          src="/assets/HPU_Logo.png"
          alt="HPU"
          width={size}
          height={size}
          priority
          className="object-contain"
        />
      </span>
      {withWordmark && (
        <span className="leading-none">
          <span className="block text-[12.5px] font-bold text-ink">HPU Admission</span>
          <span className="block text-[10.5px] text-ink-muted">Department of Higher Education</span>
        </span>
      )}
    </span>
  );
}
