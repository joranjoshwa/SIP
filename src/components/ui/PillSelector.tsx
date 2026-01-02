"use client";

import React, { forwardRef, JSX, useImperativeHandle } from "react";

export type PillOption<T extends string> = {
  value: T;
  label: string;
};

export type PillSelectorRef = {
  reset: () => void;
};

type Props<T extends string> = {
  label?: string;
  value: T | null;
  onChange: (value: T | null) => void;
  options: PillOption<T>[];
  className?: string;
  disabled?: boolean;
};

function PillSelectorInner<T extends string>(
  {
    label,
    value,
    onChange,
    options,
    className = "",
    disabled = false,
  }: Props<T>,
  ref: React.ForwardedRef<PillSelectorRef>
) {
  useImperativeHandle(ref, () => ({
    reset: () => onChange(null),
  }));

  return (
    <div className={className}>
      {label && (
        <div className="mb-2 text-sm text-neutral-900 dark:text-neutral-100">
          {label}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;

          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(active ? null : opt.value)}
              className={[
                "rounded-full px-2 py-1 text-sm font-medium transition border",
                active
                  ? "bg-[#D4EED9] dark:bg-[#183E1F] border-[#D4EED9] dark:border-[#183E1F]"
                  : "bg-transparent dark:text-neutral-100",
                disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PillSelectorWithRef = forwardRef(PillSelectorInner) as (
  props: Props<any> & React.RefAttributes<PillSelectorRef>
) => JSX.Element;

export const PillSelector = PillSelectorWithRef as <T extends string>(
  props: Props<T> & React.RefAttributes<PillSelectorRef>
) => JSX.Element;
