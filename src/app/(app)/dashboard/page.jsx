"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
    analyticsApi,
    contactsApi,
    leadsApi,
    tasksApi
} from "@/lib/services";
import { format } from "date-fns";
import Link from "next/link";
import {
    ActivityTable,
    EngagementChart,
    HeroCard,
    LeadsBySource,
    PipelineByStage,
    RevenueCard,
    TopContactsCard,
    TopDeals,
    UpcomingTasks
} from "@/components/pages/dashboard";
import { currency } from "@/lib/format";
import {
    Card,
    SectionHeading,
    Badge,
    Tabs,
    Skeleton
} from "@/components/ui";
import {
    CreditCard,
    CalendarRange,
    Plus,
    ArrowUpRight,
    Target
} from "lucide-react";
import { AiInsightsCard } from "@/components/ai";

const SOURCE_COLORS = ["#0ea5e9", "#38bdf8", "#0369a1", "#7dd3fc", "#0284c7", "#bae6fd"];

export default function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [leads, setLeads] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [range, setRange] = useState("monthly");

    useEffect(() => {
        analyticsApi.overview().then(setData).catch(() => setData(false));
        contactsApi.list().then((res) => setContacts(res.contacts || [])).catch(() => { });
        leadsApi.list().then((res) => setLeads(res.leads || [])).catch(() => { });
        tasksApi.list().then((res) => setTasks(res.tasks || [])).catch(() => { });
    }, []);

    if (data === null) return <DashboardSkeleton />;
    const stats = data?.stats || {};

    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const rangeLabel = `${format(start, "dd MMM")} - ${format(today, "dd MMM, yyyy")}`;

    return (
        <div className="space-y-6">
            {/* Title row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-[2.5rem]">
                    Welcome Back, <span className="text-ink-soft">{user?.name?.split(" ")[0]}</span>
                </h1>
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft shadow-[var(--shadow-soft)] sm:flex">
                        <CalendarRange className="h-4 w-4" />
                        {rangeLabel}
                    </div>
                    <Link
                        href="/leads"
                        className="brand-gradient brand-gradient-hover inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-sm transition"
                    >
                        <Plus className="h-4 w-4" /> Add New Lead
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
                {/* ── Left column ───────────────────────────────── */}
                <div className="space-y-5 lg:col-span-3">
                    <HeroCard value={stats.pipelineValue} />

                    <Card className="p-5">
                        <p className="text-sm text-ink-soft">Weekly Revenue</p>
                        <div className="mt-2 flex items-end justify-between gap-2">
                            <p className="font-display text-2xl font-bold text-ink">
                                {currency(stats.revenueWon, { compact: true })}
                            </p>
                            <Badge className="bg-brand-50 text-brand-700">
                                <ArrowUpRight className="h-3 w-3" /> 12.8%
                            </Badge>
                        </div>
                    </Card>

                    {/* Conversion stat */}
                    <Card className="p-6">
                        <SectionHeading icon={Target} title="Conversion" subtitle="Win rate" />
                        <div className="mt-4 flex items-end gap-2">
                            <p className="font-display text-3xl font-bold text-ink">
                                {stats.conversionRate ?? 0}
                                <span className="text-xl text-ink-soft">%</span>
                            </p>
                            <Badge className="mb-1 bg-brand-50 text-brand-700">
                                <ArrowUpRight className="h-3 w-3" /> 4.1%
                            </Badge>
                        </div>
                        <p className="mt-1 text-sm text-ink-soft">
                            {stats.totalLeads ?? 0} leads · {stats.openTasks ?? 0} open tasks
                        </p>
                    </Card>

                    <UpcomingTasks tasks={tasks} />
                    <TopContactsCard contacts={contacts} />
                </div>

                {/* ── Center column ─────────────────────────────── */}
                <div className="space-y-5 lg:col-span-6">
                    <Card className="p-6">
                        <SectionHeading
                            icon={CreditCard}
                            title="Pipeline Engagement"
                            subtitle="New leads per month"
                            action={
                                <Tabs
                                    value={range}
                                    onChange={setRange}
                                    tabs={[
                                        { value: "monthly", label: "Monthly" },
                                        { value: "annually", label: "Annually" },
                                    ]}
                                />
                            }
                        />
                        <div className="mt-4">
                            <EngagementChart trend={data?.trend || []} />
                        </div>
                    </Card>

                    <Card className="p-6">
                        <SectionHeading
                            title="Lead Activity"
                            subtitle="Recent lead movements"
                            to="/leads"
                        />
                        <div className="mt-4">
                            <ActivityTable leads={data?.recentLeads || []} />
                        </div>
                    </Card>

                    <PipelineByStage pipeline={data?.pipeline || []} />
                </div>

                {/* ── Right column ──────────────────────────────── */}
                <div className="space-y-5 lg:col-span-3">
                    {/* Revenue / balance card */}
                    <RevenueCard stats={stats} data={data} />

                    <AiInsightsCard />
                    <LeadsBySource leads={leads} sourceColors={SOURCE_COLORS} />
                    <TopDeals leads={leads} />
                </div>
            </div>

        </div>
    );
};

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-80" />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-3">
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-24 rounded-3xl" />
                </div>
                <div className="space-y-5 lg:col-span-6">
                    <Skeleton className="h-80 rounded-3xl" />
                    <Skeleton className="h-64 rounded-3xl" />
                </div>
                <div className="space-y-5 lg:col-span-3">
                    <Skeleton className="h-56 rounded-3xl" />
                    <Skeleton className="h-32 rounded-3xl" />
                    <Skeleton className="h-32 rounded-3xl" />
                </div>
            </div>
        </div>
    );
};