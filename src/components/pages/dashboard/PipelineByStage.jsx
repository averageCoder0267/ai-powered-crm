import { STAGE_STYLES } from "@/lib/constants";
import { Card, SectionHeading } from "../../ui";
import { cn } from "@/lib/utils";
import { currency } from "@/lib/format";
import { Layers } from "lucide-react";

/* ── Pipeline by stage (funnel-style breakdown) ─────────────────────── */
export function PipelineByStage({ pipeline, className }) {
    const maxValue = Math.max(...pipeline.map((s) => s.value), 1);
    const totalValue = pipeline.reduce((sum, s) => sum + s.value, 0);

    return (
        <Card className={cn("p-6", className)}>
            <SectionHeading
                icon={Layers}
                title="Pipeline by Stage"
                subtitle="Deal value across each stage"
                to="/pipeline"
            />
            <div className="mt-5 space-y-4">
                {pipeline.map((s) => {
                    const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
                    const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
                    return (
                        <div key={s.stage}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 font-medium text-ink">
                                    <span className={cn("h-2.5 w-2.5 rounded-full", style.dot)} />
                                    {s.stage}
                                    <span className="text-ink-soft">· {s.count}</span>
                                </span>
                                <span className="font-semibold text-ink">
                                    {currency(s.value, { compact: true })}
                                    <span className="ml-1.5 text-xs font-normal text-ink-soft">{pct}%</span>
                                </span>
                            </div>
                            <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                                <div
                                    className={cn("h-full rounded-full transition-all", style.bar)}
                                    style={{ width: `${Math.max((s.value / maxValue) * 100, 2)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
                {pipeline.length === 0 && (
                    <p className="py-6 text-center text-sm text-ink-soft">No pipeline data yet.</p>
                )}
            </div>
        </Card>
    );
};