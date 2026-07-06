"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type DropdownOption = Readonly<{
  label: string;
  value: string;
  description?: string;
}>;

type CustomDropdownProps = Readonly<{
  name?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustomValue?: boolean;
  required?: boolean;
  className?: string;
  menuClassName?: string;
}>;

export function CustomDropdown({
  name,
  value,
  options,
  onChange,
  placeholder = "Select",
  searchPlaceholder = "Search",
  allowCustomValue = false,
  required = false,
  className = "h-12 rounded-full bg-white px-4",
  menuClassName = "top-[calc(100%+8px)]",
}: CustomDropdownProps) {
  const dropdownId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? value;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options.slice(0, 5);
    }

    return options
      .filter((option) =>
        `${option.label} ${option.description ?? ""}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 5);
  }, [options, query]);
  const canUseCustomValue =
    allowCustomValue &&
    query.trim().length > 0 &&
    !options.some(
      (option) => option.label.toLowerCase() === query.trim().toLowerCase(),
    );

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectValue(nextValue: string) {
    onChange(nextValue);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative min-w-0">
      {name ? (
        <input name={name} required={required} type="hidden" value={value} />
      ) : null}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full min-w-0 items-center justify-between gap-3 border border-line text-left text-[14px] font-semibold text-black outline-none transition hover:border-black/20 focus:border-accent ${className}`}
      >
        <span className={displayValue ? "truncate" : "truncate text-black/45"}>
          {displayValue || placeholder}
        </span>
        <span className="text-[10px] text-black/45">v</span>
      </button>

      {isOpen ? (
        <div
          className={`absolute left-0 z-30 w-full min-w-[220px] rounded-[22px] border border-line bg-white p-2 shadow-[0_20px_55px_rgba(0,0,0,0.14)] ${menuClassName}`}
        >
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-2xl border border-line bg-card px-3 text-[13px] font-semibold text-black outline-none transition placeholder:text-black/35 focus:border-accent"
          />
          <div
            id={dropdownId}
            role="listbox"
            className="mt-2 max-h-[230px] overflow-y-auto pr-1"
          >
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => selectValue(option.value)}
                className="grid w-full gap-0.5 rounded-2xl px-3 py-2.5 text-left transition hover:bg-card"
              >
                <span className="text-[13px] font-bold text-black">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="text-[11px] font-medium text-black/55">
                    {option.description}
                  </span>
                ) : null}
              </button>
            ))}
            {canUseCustomValue ? (
              <button
                type="button"
                onClick={() => selectValue(query.trim())}
                className="grid w-full gap-0.5 rounded-2xl px-3 py-2.5 text-left transition hover:bg-card"
              >
                <span className="text-[13px] font-bold text-black">
                  Add &quot;{query.trim()}&quot;
                </span>
                <span className="text-[11px] font-medium text-black/55">
                  Use this custom value
                </span>
              </button>
            ) : null}
            {filteredOptions.length === 0 && !canUseCustomValue ? (
              <p className="px-3 py-4 text-center text-[12px] font-semibold text-black/50">
                No matches
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
