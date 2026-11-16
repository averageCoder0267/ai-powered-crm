import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import { Card, SectionHeading } from "../../ui";
import { PieChart as PieIcon } from "lucide-react";
import { ChartTooltip } from ".";

/* ── Leads by source (donut chart) ──────────────────────────────────── */
export function LeadsBySource({ leads, sourceColors = [] }) {
    // Group leads by their source field.
    const grouped = leads.reduce((acc, l) => {
        const key = l.source || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const dataset = Object.entries(grouped).map(([name, value]) => ({ name, value }));

    return (
        <Card className="p-6">
            <SectionHeading icon={PieIcon} title="Leads by Source" subtitle="Where leads come from" />
            {dataset.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink-soft">No leads yet.</p>
            ) : (
                <div className="mt-2 flex items-center gap-4">
                    <div className="relative h-36 w-36 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataset}
                                    dataKey="value"
                                    innerRadius={44}
                                    outerRadius={66}
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {dataset.map((_, i) => (
                                        <Cell key={i} fill={sourceColors[i % sourceColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip unit=" leads" />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display text-xl font-bold text-ink">{leads.length}</span>
                            <span className="text-[11px] text-ink-soft">leads</span>
                        </div>
                    </div>
                    <ul className="flex-1 space-y-1.5">
                        {dataset.map((d, i) => (
                            <li key={d.name} className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2 text-ink-soft">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ background: sourceColors[i % sourceColors.length] }}
                                    />
                                    {d.name}
                                </span>
                                <span className="font-medium text-ink">{d.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};