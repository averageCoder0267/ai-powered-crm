import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { ChartTooltip } from ".";

/* ── Engagement bar chart with a highlighted peak + floating bubble ──── */
export function EngagementChart({ trend }) {
    const counts = trend.map((t) => t.leads);
    const max = Math.max(...counts, 1);
    const maxIndex = counts.indexOf(max);
    const prev = maxIndex > 0 ? counts[maxIndex - 1] : 0;
    const growth = prev > 0 ? Math.round(((max - prev) / prev) * 1000) / 10 : 17.8;

    // Custom label: render a rounded "+x%" bubble above the tallest bar only.
    const renderPeak = (props) => {
        const { x, y, width, index } = props;
        if (index !== maxIndex) return null;
        const cx = x + width / 2;
        return (
            <g>
                <circle cx={cx} cy={y} r={5} fill="#0369a1" stroke="#fff" strokeWidth={2} />
                <rect x={cx - 26} y={y - 34} width={52} height={22} rx={11} fill="#0369a1" />
                <text x={cx} y={y - 19} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                    +{growth}%
                </text>
            </g>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trend} barCategoryGap="28%" margin={{ top: 30 }}>
                <CartesianGrid vertical={false} stroke="#e8eef3" strokeDasharray="4 4" />
                <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    dy={6}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    width={30}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
                />
                <Tooltip cursor={{ fill: "#f1f5f9" }} content={<ChartTooltip unit=" leads" />} />
                <Bar dataKey="leads" radius={[14, 14, 14, 14]} maxBarSize={42} label={renderPeak}>
                    {trend.map((t, i) => (
                        <Cell key={i} fill={i === maxIndex ? "#0369a1" : "#bae6fd"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};