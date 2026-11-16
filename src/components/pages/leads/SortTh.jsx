import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

export function SortTh({ label, k, sort, onSort, align = "left" }) {
    const active = sort.key === k;
    return (
        <th className={cn("px-6 py-3.5 font-medium", align === "right" && "text-right")}>
            <button
                onClick={() => onSort(k)}
                className={cn(
                    "inline-flex items-center gap-1 transition hover:text-ink",
                    active && "text-ink"
                )}
            >
                {label}
                <span className="text-ink-soft">
                    {active ? (
                        sort.dir === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                        )
                    ) : (
                        <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                    )}
                </span>
            </button>
        </th>
    );
};