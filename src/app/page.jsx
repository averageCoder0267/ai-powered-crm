"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight, BarChart3, BellRing, Bot, Building2, CheckCircle2, Kanban,
  LayoutDashboard, Mail, Menu, Plus, Search, Sparkles, Target, Users, X,
} from "lucide-react";

/* ── Routes ────────────────────────────────────────────────────
   VERIFY these against your app/ folder (e.g. app/(auth)/login/page.tsx
   → "/login"). They are the only place routes are defined here. */
const ROUTES = { login: "/login", signup: "/register" };

const NAV = [
  { label: "Home", id: "home" },
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "About", id: "about" },
];

function scrollToId(id) {
  if (id === "home") return window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Shared bits ───────────────────────────────────────────── */
const btnPrimary =
  "brand-gradient brand-gradient-hover inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-pop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";
const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="brand-gradient grid size-9 place-items-center rounded-xl text-white shadow-soft">
        <Sparkles className="size-5" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">AI-Powered CRM</span>
    </span>
  );
}

function IconBubble({ icon: Icon, className = "" }) {
  return (
    <span className={`grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ${className}`}>
      <Icon className="size-5" />
    </span>
  );
}

function SectionHead({ title, text }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-ink-soft">{text}</p>}
    </div>
  );
}

const STATUS = {
  New: "bg-brand-500",
  Qualified: "bg-violet-500",
  Proposal: "bg-amber-500",
  Won: "bg-emerald-500",
  Lost: "bg-rose-500",
};

function StatusDot({ s }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink">
      <span className={`size-1.5 rounded-full ${STATUS[s]}`} />
      {s}
    </span>
  );
}

/* ── Navbar ────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => go("home")} aria-label="AI CRM home"><Logo /></button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-surface-muted hover:text-ink">
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href={ROUTES.login} className="rounded-full px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-muted">Sign In</Link>
          <Link href={ROUTES.signup} className={`${btnPrimary} py-2.5!`}>Get Started</Link>
        </div>

        <button className="grid size-10 place-items-center rounded-full border border-line md:hidden"
          onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 pb-5 pt-3 md:hidden">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)}
              className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-ink hover:bg-surface-muted">
              {n.label}
            </button>
          ))}
          <div className="mt-3 grid gap-2">
            <Link href={ROUTES.login} className={btnGhost}>Sign In</Link>
            <Link href={ROUTES.signup} className={btnPrimary}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Dashboard preview (hero) ──────────────────────────────── */
const BARS = [
  { m: "Jun", h: 14 }, { m: "Jul", h: 14 }, { m: "Aug", h: 14 },
  { m: "Sep", h: 45 }, { m: "Oct", h: 100 }, { m: "Nov", h: 62 },
];
const ACTIVITY = [
  { n: "Datadog", c: "Stark Industries", s: "New", v: "$45,000", i: "D", bg: "bg-rose-100 text-rose-600" },
  { n: "Notion", c: "Soylent", s: "New", v: "$12,400", i: "N", bg: "bg-amber-100 text-amber-700" },
  { n: "Figma", c: "Hooli", s: "Qualified", v: "$54,000", i: "F", bg: "bg-rose-100 text-rose-600" },
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-155">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-linear-to-br from-brand-100/70 to-transparent blur-2xl" />
      <div className="card border border-line p-3 shadow-pop motion-safe:animate-[float_7s_ease-in-out_infinite] sm:p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <p className="font-display text-base font-semibold sm:text-lg">Welcome Back, <span className="text-ink-soft">Yash</span></p>
          <span className="brand-gradient hidden items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white sm:inline-flex"><Plus className="size-3" />Add New Lead</span>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-5 sm:col-span-2">
            <div className="brand-gradient rounded-2xl p-4 text-white">
              <p className="font-display text-sm font-semibold">AI-Powered CRM</p>
              <p className="mt-4 text-[11px] text-white/80">Pipeline value</p>
              <p className="font-display text-2xl font-semibold">$1,076,368</p>
              <p className="mt-3 text-[10px] tracking-widest text-white/80">PIPELINE · LIVE</p>
            </div>
            <div className="mt-3 rounded-2xl border border-line p-3">
              <p className="text-[11px] text-ink-soft">Revenue Goal · Total Won</p>
              <p className="font-display text-xl font-semibold">$307,500</p>
            </div>
          </div>

          <div className="col-span-5 rounded-2xl border border-line p-3 sm:col-span-3">
            <p className="text-xs font-semibold">Pipeline Engagement</p>
            <p className="text-[11px] text-ink-soft">New leads per month</p>
            <div className="mt-3 flex h-28 items-end justify-between gap-2">
              {BARS.map((b) => (
                <div key={b.m} className="flex flex-1 flex-col items-center gap-1">
                  <div className={`w-full rounded-full ${b.m === "Oct" ? "bg-brand-700" : "bg-brand-200"}`} style={{ height: `${b.h}%` }} />
                  <span className="text-[10px] text-ink-soft">{b.m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-3">
          <div className="col-span-5 rounded-2xl border border-line p-3 sm:col-span-3">
            <p className="mb-1 text-xs font-semibold">Lead Activity</p>
            {ACTIVITY.map((r) => (
              <div key={r.n} className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0">
                <span className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold ${r.bg}`}>{r.i}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{r.n}</p>
                  <p className="truncate text-[10px] text-ink-soft">{r.c}</p>
                </div>
                <StatusDot s={r.s} />
                <span className="w-14 text-right text-xs font-semibold">{r.v}</span>
              </div>
            ))}
          </div>
          <div className="col-span-5 rounded-2xl border border-line p-3 text-center sm:col-span-2">
            <div className="flex items-center gap-2 text-left">
              <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-brand-600"><Sparkles className="size-3.5" /></span>
              <div><p className="text-xs font-semibold">AI Sales Insights</p><p className="text-[10px] text-ink-soft">Powered by Gemini</p></div>
            </div>
            <p className="mt-3 text-[11px] leading-snug text-ink-soft">Get an instant, data-driven read on your pipeline health and what to do next.</p>
            <span className="brand-gradient mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"><Sparkles className="size-3" />Analyze pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ──────────────────────────────────────────────────── */
function Hero() {
  const highlights = ["Smarter Lead Management", "AI-Powered Insights", "Effortless Follow-Ups"];
  return (
    <section id="home" className="scroll-mt-20 overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-28 lg:pt-10">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-medium text-brand-700">
            <Sparkles className="size-3.5" />AI-Powered Customer Relationship Management
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl lg:text-[3.5rem]">
            Close More Deals With Your AI Sales Co-Pilot.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Manage leads, automate follow-ups, and uncover smarter sales opportunities — all from one intelligent CRM workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.signup} className={btnPrimary}>Get Started for Free</Link>
            <button onClick={() => scrollToId("features")} className={btnGhost}>Explore Features</button>
          </div>
          <p className="mt-8 text-sm text-ink-soft">Everything you need to turn prospects into customers.</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-1.5 text-sm font-medium text-ink">
                <CheckCircle2 className="size-4 text-brand-500" />{h}
              </li>
            ))}
          </ul>
        </div>
        <div className="animate-fade-up [animation-delay:120ms]"><DashboardPreview /></div>
      </div>
    </section>
  );
}

/* ── Value strip ───────────────────────────────────────────── */
function ValueStrip() {
  const items = [
    [Users, "All Your Leads in One Place"],
    [Sparkles, "AI-Powered Sales Intelligence"],
    [BellRing, "Never Miss a Follow-Up"],
    [Kanban, "Complete Pipeline Visibility"],
  ];
  return (
    <section className="border-y border-line bg-surface-muted/50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map(([Icon, t]) => (
          <div key={t} className="flex items-center gap-3">
            <IconBubble icon={Icon} className="size-10!" />
            <p className="text-sm font-semibold text-ink">{t}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Features ──────────────────────────────────────────────── */
const FEATURES = [
  [Users, "Smart Lead Management", "Organize, track, and manage every lead from a single workspace."],
  [Kanban, "Visual Sales Pipeline", "Move opportunities through customizable sales stages with an intuitive visual pipeline."],
  [Target, "AI Lead Scoring", "Identify high-potential prospects and prioritize the opportunities that matter most."],
  [Mail, "AI Email Drafting", "Generate personalized sales emails and follow-ups with the help of AI."],
  [BellRing, "Intelligent Follow-Ups", "Keep track of important conversations, pending tasks, and upcoming follow-ups."],
  [BarChart3, "Sales Analytics & Insights", "Understand pipeline performance, revenue trends, and sales opportunities through actionable insights."],
];

function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead title="Everything You Need to Sell Smarter."
          text="Powerful CRM tools combined with AI intelligence to help you manage relationships and close deals faster." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([Icon, t, d]) => (
            <article key={t} className="card border border-line p-7 transition duration-200 hover:-translate-y-1 hover:shadow-pop">
              <IconBubble icon={Icon} className="rounded-xl!" />
              <h3 className="mt-5 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Showcase ──────────────────────────────────────────────── */
function Showcase({ title, text, reverse, children }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={reverse ? "lg:order-2" : ""}>
        <h3 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{text}</p>
      </div>
      <div className={`min-w-0 ${reverse ? "lg:order-1" : ""}`}>{children}</div>
    </div>
  );
}

const LEADS = [
  { n: "Datadog", c: "Stark Industries", s: "New", p: "Medium", src: "Website", v: "$45,000", i: "D", bg: "bg-rose-100 text-rose-600" },
  { n: "Figma", c: "Hooli", s: "Qualified", p: "Medium", src: "Website", v: "$54,000", i: "F", bg: "bg-rose-100 text-rose-600" },
  { n: "Linear", c: "Pied Piper", s: "Proposal", p: "High", src: "Referral", v: "$98,000", i: "L", bg: "bg-sky-100 text-sky-600" },
  { n: "Airtable", c: "Wayne Ent.", s: "Qualified", p: "High", src: "Event", v: "$67,000", i: "A", bg: "bg-sky-100 text-sky-600" },
];
const PRIORITY = { Medium: "bg-amber-50 text-amber-700", High: "bg-rose-50 text-rose-600" };

function LeadsPreview() {
  return (
    <div className="card border border-line p-4 shadow-pop">
      <div className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs text-ink-soft">
        <Search className="size-3.5" />Search by name, company or email…
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["All 16", "New 4", "Qualified 4", "Proposal 3"].map((t, i) => (
          <span key={t} className={`rounded-full px-3 py-1 text-[11px] font-medium ${i === 0 ? "bg-brand-600 text-white" : "border border-line text-ink-soft"}`}>{t}</span>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {LEADS.map((l) => (
          <div key={l.n} className="rounded-2xl border border-line p-3">
            <div className="flex items-center gap-2.5">
              <span className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${l.bg}`}>{l.i}</span>
              <div><p className="text-sm font-semibold leading-tight">{l.n}</p>
                <p className="flex items-center gap-1 text-[11px] text-ink-soft"><Building2 className="size-3" />{l.c}</p></div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <StatusDot s={l.s} />
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY[l.p]}`}>{l.p}</span>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] text-ink-soft">{l.src}</span>
            </div>
            <div className="mt-2.5 border-t border-line pt-2">
              <p className="text-[10px] text-ink-soft">Deal value</p>
              <p className="font-display text-base font-semibold">{l.v}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STAGES = [
  { s: "New", deals: [["Datadog", "$45,000"], ["Notion", "$12,400"]] },
  { s: "Qualified", deals: [["Figma", "$54,000"], ["Airtable", "$67,000"]] },
  { s: "Proposal", deals: [["Linear", "$98,000"]] },
  { s: "Won", deals: [["Stripe", "Closed"]] },
  { s: "Lost", deals: [["Asana", "Closed"]] },
];

function PipelinePreview() {
  return (
    <div className="card border border-line p-4 shadow-pop">
      <div className="no-scrollbar flex gap-3 overflow-x-auto">
        {STAGES.map((st) => (
          <div key={st.s} className="w-32 shrink-0 rounded-2xl bg-surface-muted p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <StatusDot s={st.s} />
              <span className="text-[10px] text-ink-soft">{st.deals.length}</span>
            </div>
            <div className="grid gap-2">
              {st.deals.map(([n, v]) => (
                <div key={n} className="rounded-xl border border-line bg-white p-2.5 shadow-soft">
                  <p className="text-xs font-semibold">{n}</p>
                  <p className="mt-0.5 text-[11px] text-ink-soft">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsPreview() {
  const recs = [
    "Datadog is your largest new lead — reach out this week.",
    "3 high-priority follow-ups are due. Start with the proposal for Amazon Shopping.",
    "Referral leads are converting best. Consider asking Linear for an intro.",
  ];
  return (
    <div className="card border border-line p-5 shadow-pop">
      <div className="flex items-center gap-3">
        <IconBubble icon={Sparkles} className="size-9!" />
        <div><p className="text-sm font-semibold">AI Sales Insights</p><p className="text-xs text-ink-soft">Powered by Gemini · sample output</p></div>
      </div>
      <ul className="mt-4 grid gap-2.5">
        {recs.map((r) => (
          <li key={r} className="flex gap-2.5 rounded-xl bg-brand-50/60 p-3 text-sm leading-snug text-ink">
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-brand-600" />{r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductShowcase() {
  return (
    <section className="bg-surface-muted/50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead title="Your Entire Sales Workflow. One Intelligent Workspace." />
        <div className="mt-16 grid gap-24">
          <Showcase title="Manage Your Leads" text="Get a clear overview of every opportunity. Search, filter, prioritize, and manage leads from an intuitive workspace.">
            <LeadsPreview />
          </Showcase>
          <Showcase reverse title="See Your Pipeline Clearly" text="Track every deal as it progresses through your sales process and get a real-time overview of your sales opportunities.">
            <PipelinePreview />
          </Showcase>
          <Showcase title="Let AI Work Alongside You" text="Get AI-generated email drafts, lead insights, and actionable recommendations to make better sales decisions.">
            <InsightsPreview />
          </Showcase>
        </div>
      </div>
    </section>
  );
}

/* ── How it works ──────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    ["Add Your Leads", "Bring your prospects and customer information into one organized workspace."],
    ["Manage Your Pipeline", "Track conversations, update deal stages, and stay on top of opportunities."],
    ["Close Smarter With AI", "Use AI insights, lead scoring, and email assistance to move deals forward."],
  ];
  return (
    <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHead title="Get Started in Three Simple Steps." />
        <div className="relative mt-14 grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16.7%] right-[16.7%] top-6 hidden h-px bg-brand-200 md:block" />
          {steps.map(([t, d], i) => (
            <div key={t} className="relative text-center">
              <span className="brand-gradient mx-auto grid size-12 place-items-center rounded-full font-display text-lg font-semibold text-white shadow-soft ring-8 ring-white">{i + 1}</span>
              <h3 className="mt-5 font-display text-lg font-semibold">{t}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AI section (id="about") ───────────────────────────────── */
function AiSection() {
  const caps = [
    [Target, "AI Lead Intelligence", "See which leads look most promising so you can decide where to focus."],
    [Mail, "Smart Email Generation", "Generate a draft, then review and edit it before you send."],
    [Sparkles, "Actionable Sales Insights", "Request an analysis of your pipeline whenever you want a fresh read."],
  ];
  return (
    <section id="about" className="scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 rounded-[2rem] border border-brand-100 bg-linear-to-br from-brand-50 to-white p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
        <div>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">More Than a CRM. Your AI Sales Co-Pilot.</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            AI CRM combines your sales data with intelligent assistance to help you understand your pipeline, prioritize leads, and take action faster.
          </p>
          <ul className="mt-8 grid gap-5">
            {caps.map(([Icon, t, d]) => (
              <li key={t} className="flex gap-4">
                <IconBubble icon={Icon} className="bg-white shadow-soft" />
                <div><p className="font-display font-semibold">{t}</p><p className="mt-1 text-sm text-ink-soft">{d}</p></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card min-w-0 border border-line p-5 shadow-pop">
          <div className="flex items-center gap-2 text-sm font-semibold"><Bot className="size-4 text-brand-600" />AI Assistant</div>
          <div className="mt-4 rounded-xl bg-surface-muted p-3.5">
            <p className="text-xs font-semibold">Recommended leads</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">Airtable (High, $67,000) and Linear (High, $98,000) are worth contacting first.</p>
          </div>
          <div className="mt-3 rounded-xl border border-line p-3.5">
            <p className="text-xs font-semibold">Suggested follow-up · Draft</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
              Hi Team, thanks for reviewing our proposal last week. I&apos;d love to answer any questions and plan next steps — are you free for a quick call?
            </p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold text-white">Edit draft</span>
              <span className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-ink-soft">Regenerate</span>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-brand-50/70 p-3.5">
            <p className="text-xs font-semibold">Pipeline performance</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">New leads peaked in October. Keep momentum by following up on November leads.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ─────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-linear-to-br from-brand-100 via-brand-50 to-white px-6 py-16 text-center ring-1 ring-brand-200 sm:px-12">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to Make Every Lead Count?</h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">Bring your leads, pipeline, and AI-powered sales insights together in one place.</p>
        <Link href={ROUTES.signup} className={`${btnPrimary} mt-8 px-8! py-3.5!`}>Get Started for Free</Link>
        <p className="mt-5 text-sm text-ink-soft">No complicated setup. Just a smarter way to manage your sales.</p>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────── */
function Footer() {
  const links = "text-sm text-ink-soft transition hover:text-brand-700";
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            An intelligent CRM workspace designed to help you manage relationships, streamline sales, and close more deals.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end" aria-label="Footer">
          <button onClick={() => scrollToId("home")} className={links}>Home</button>
          <button onClick={() => scrollToId("features")} className={links}>Features</button>
          <button onClick={() => scrollToId("how-it-works")} className={links}>How It Works</button>
          <Link href={ROUTES.login} className={links}>Sign In</Link>
          <Link href={ROUTES.signup} className={links}>Create Account</Link>
        </nav>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-ink-soft">
        Copyright © 2026 AI CRM. All rights reserved.
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
      <Navbar />
      <main>
        <Hero />
        <ValueStrip />
        <Features />
        <ProductShowcase />
        <HowItWorks />
        <AiSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}