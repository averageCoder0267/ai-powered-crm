import { currency } from "@/lib/format";
import { Card, SectionHeading } from "../../ui";
import {
    AreaChart,
    CheckCircle2,
    Plus
} from "lucide-react";
import {
    Area,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import Link from "next/link";
import { ChartTooltip } from ".";

export function RevenueCard({ stats, data }) {
    return (
        <Card className="p-6">
            <SectionHeading title="Revenue Goal" subtitle="Closed-won total" to="/pipeline" />
            <p className="mt-4 text-center text-sm text-ink-soft">Total Won</p>
            <p className="text-center font-display text-3xl font-bold tracking-tight text-ink">
                {currency(stats.revenueWon)}
            </p>
            <BalanceChart trend={data?.trend || []} />
            <div className="mt-4 flex items-center gap-2">
                <Link
                    href="/leads"
                    className="brand-gradient brand-gradient-hover inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-white transition"
                >
                    <Plus className="h-4 w-4" /> Add Lead
                </Link>
                <Link
                    href="/tasks"
                    className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-line text-sm font-medium text-ink transition hover:bg-surface-muted"
                >
                    <CheckCircle2 className="h-4 w-4" /> Task
                </Link>
            </div>
        </Card>
    );
};

function BalanceChart({ trend }) {
    return (
        <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={trend} margin={{ top: 14, right: 0, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="balance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Tooltip content={<ChartTooltip prefix="$" />} />
                <Area type="monotone" dataKey="won" stroke="#0284c7" strokeWidth={2.5} fill="url(#balance)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};