"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Calendar, Clock } from "lucide-react";

type Mode = "date" | "time";

type Props = {
  id?: string;
  mode: Mode;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  onValidChange?: (val: Date | number | null) => void;
  className?: string;
  required?: boolean;
  ghostText?: string;
  placeholder?: string;
  showRightChevron?: boolean;
  invalidBehavior?: "revert" | "clear";
  onFocusChange?: (focused: boolean) => void;
};

export function MaskedField({
  id,
  mode,
  label,
  value,
  onChange,
  onValidChange,
  className = "",
  required,
  ghostText = mode === "date" ? "Data da busca" : "Horário",
  placeholder = mode === "date" ? "DD/MM/AAAA" : "HH:MM",
  showRightChevron = mode === "time",
  invalidBehavior = "revert",
  onFocusChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const showGhost = !focused && !value;

  useEffect(() => {
    onFocusChange?.(!showGhost);
  }, [showGhost]);

  // Keep the last valid *masked string* (ex: "23:45" or "12/09/2025")
  const lastValidMaskedRef = useRef<string>("");

  const maskDate = useCallback((raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  }, []);

  const maskTime = useCallback((raw: string) => {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}:${d.slice(2)}`;
  }, []);

  const maskify = useCallback(
    (raw: string) => (mode === "date" ? maskDate(raw) : maskTime(raw)),
    [mode, maskDate, maskTime]
  );

  // ---- parsers ----
  const parseDate = useCallback((text: string) => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
    if (!m) return null;
    const [, dd, mm, yyyy] = m;
    const d = Number(dd),
      mth = Number(mm) - 1,
      y = Number(yyyy);

    if (y < 1900 || mth < 0 || mth > 11) return null;

    const dt = new Date(y, mth, d);
    // blocks 32/12/2025, 31/02/2025, etc.
    if (dt.getFullYear() !== y || dt.getMonth() !== mth || dt.getDate() !== d) return null;

    return dt;
  }, []);

  const parseTime = useCallback((text: string) => {
    const m = /^(\d{2}):(\d{2})$/.exec(text);
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null; // blocks 25:00, 23:99, etc.
    return hh * 60 + mm; // minutes since 00:00
  }, []);

  const parseCurrent = useCallback(
    (masked: string) => (mode === "date" ? parseDate(masked) : parseTime(masked)),
    [mode, parseDate, parseTime]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskify(e.target.value);
      onChange(masked);

      const parsed = parseCurrent(masked);
      onValidChange?.(parsed);

      // update last valid ONLY when fully valid
      if (parsed !== null) {
        lastValidMaskedRef.current = masked;
      }
    },
    [maskify, onChange, onValidChange, parseCurrent]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;
      const el = e.currentTarget;
      const pos = el.selectionStart ?? 0;
      const sep = mode === "date" ? "/" : ":";

      if (pos > 0 && (el.value[pos - 1] === sep || el.value[pos] === sep)) {
        e.preventDefault();
        const left = el.value.slice(0, pos).replace(/\D/g, "").slice(0, -1);
        const right = el.value.slice(pos).replace(/\D/g, "");
        const newMasked = maskify(left + right);
        onChange(newMasked);

        requestAnimationFrame(() => {
          const seps = (newMasked.match(new RegExp(`\\${sep}`, "g")) || []).length;
          const newPos = Math.max(0, seps + left.length);
          el.setSelectionRange(newPos, newPos);
        });
      }
    },
    [maskify, onChange, mode]
  );

  const handleBlur = useCallback(() => {
    setFocused(false);

    if (!value) {
      onValidChange?.(null);
      lastValidMaskedRef.current = "";
      return;
    }

    const parsed = parseCurrent(value);

    if (parsed === null) {
      const next = invalidBehavior === "clear" ? "" : lastValidMaskedRef.current || "";
      onChange(next);
      onValidChange?.(next ? parseCurrent(next) : null);
    } else {
      lastValidMaskedRef.current = value;
    }
  }, [value, parseCurrent, onChange, onValidChange, invalidBehavior, onFocusChange]);


  const LeftIcon = mode === "date" ? Calendar : Clock;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <LeftIcon
          className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5
          text-zinc-500 dark:text-zinc-400 transition-opacity ${showGhost ? "opacity-0" : "opacity-100"
            }`}
        />

        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onFocus={(e) => {
            e.stopPropagation();
            if (!showGhost) setFocused(true);
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full h-12 rounded-xl border border-zinc-200 bg-white pl-10 pr-8 text-sm text-zinc-800
            outline-none ring-0 focus:border-zinc-300
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
          aria-label={label}
          required={required}
        />

        {showGhost && (
          <button
            type="button"
            aria-hidden="true"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFocused(true);
              onFocusChange?.(true);
              inputRef.current?.focus();
            }}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 flex items-center gap-2 rounded-xl
              bg-zinc-100 text-zinc-600 px-3 pl-10 text-sm transition-colors
              hover:bg-zinc-200
              dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <LeftIcon className="h-5 w-5 absolute left-3 text-zinc-500 dark:text-zinc-400" />
            <span className="truncate">{ghostText}</span>
          </button>
        )}
      </div>
    </div>
  );
}
