"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { createPortal } from "react-dom";

export function Dropdown({ trigger, children, align = "right", className }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef(null);
  const triggerRef = useRef(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left:
        align === "right"
          ? rect.right
          : rect.left,
    });
  };

  useEffect(() => {
    const onClick = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !e.target.closest("[data-dropdown-portal]")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, align]);

  return (
    <div className="relative" ref={ref}>
      <div
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </div>

      {open &&
        createPortal(
          <div
            data-dropdown-portal
            className={cn(
              "fixed z-9999 min-w-48 rounded-2xl border border-line bg-surface p-1.5 shadow-(--shadow-pop) animate-fade-up",
              align === "right"
                ? "-translate-x-full"
                : "",
              className
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
            onClick={() => setOpen(false)}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
};

export function DropdownItem({ className, danger, children, ...props }) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink transition hover:bg-surface-muted",
        danger && "text-rose-600 hover:bg-rose-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export function DropdownLabel({ children }) {
  return (
    <p className="px-3 py-1.5 text-xs font-medium text-ink-soft">{children}</p>
  );
};

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-line" />;
};
