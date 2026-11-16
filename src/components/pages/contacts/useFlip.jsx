import { useLayoutEffect, useRef } from "react";

/* ─── useFlip ─────────────────────────────────────────────────────────────────
   FLIP animation: when the ordered list changes (e.g. a contact is starred and
   floats to the top), smoothly slide each card from its previous position to
   its new one. Reads element rects before/after the reorder and animates the
   inverse transform to zero. Respects prefers-reduced-motion.
   ──────────────────────────────────────────────────────────────────────────── */

export function useFlip(dep) {
    const containerRef = useRef(null);
    const prevRects = useRef(new Map());

    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const nodes = Array.from(el.querySelectorAll("[data-flip-id]"));

        // Measure all new positions first, before applying any transforms.
        const nextRects = new Map();
        nodes.forEach((n) => nextRects.set(n.dataset.flipId, n.getBoundingClientRect()));

        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (!reduce) {
            nodes.forEach((n) => {
                const oldRect = prevRects.current.get(n.dataset.flipId);
                const newRect = nextRects.get(n.dataset.flipId);
                if (!oldRect) return; // newly added card — no slide-in
                const dx = oldRect.left - newRect.left;
                const dy = oldRect.top - newRect.top;
                if (dx || dy) {
                    n.animate(
                        [
                            { transform: `translate(${dx}px, ${dy}px)` },
                            { transform: "translate(0px, 0px)" },
                        ],
                        { duration: 350, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
                    );
                }
            });
        }

        prevRects.current = nextRects;
    }, [dep]);

    return containerRef;
};