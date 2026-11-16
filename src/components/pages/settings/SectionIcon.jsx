import { cn } from "@/lib/utils";

/* ── Small icon accent rendered beside each card title ─────────── */
export function SectionIcon({ icon: Icon, className }) {
    return (
        <div
            className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50",
                className
            )}
        >
            <Icon className="h-4 w-4 text-brand-700" />
        </div>
    );
};