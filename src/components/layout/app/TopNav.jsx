"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";

import {
  Avatar,
  IconButton,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
} from "../../ui";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { ComingSoon } from "@/components/common";

/* Centered text links — a subset of the primary nav, rendered in a white pill
   exactly like the reference top bar. */
const LINKS = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/contacts", label: "Contacts" },
  { to: "/tasks", label: "Follow-ups" },
];

export function TopNav({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push("/login");
  };

  const isActive = (to, end) => {
    if (end)
      return pathname === to;
    return pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <header className="flex items-center gap-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 pr-2">
        <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="hidden font-display text-lg font-bold text-ink sm:block">
          AI-Powered CRM
        </span>
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-ink-soft hover:bg-surface-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Centered nav pill */}
      <nav className="mx-auto hidden items-center gap-1 rounded-full bg-surface p-1.5 shadow-(--shadow-soft) lg:flex">
        {LINKS.map(({ to, label, end }) => {
          const active = isActive(to, end);

          return (
            <Link
              key={to}
              href={to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition",
                active
                  ? "bg-surface-muted text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-2">
        <IconButton
          aria-label="Search"
          className="hidden sm:inline-flex"
          onClick={ComingSoon}
        >
          <Search className="h-4.5 w-4.5" />
        </IconButton>

        <IconButton
          aria-label="Notifications"
          className="relative"
          onClick={ComingSoon}
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-surface" />
        </IconButton>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition hover:bg-surface-muted">
              <Avatar name={user?.name} src={user?.avatar} size="sm" />
              <ChevronDown className="h-4 w-4 text-ink-soft" />
            </button>
          }
        >
          <DropdownLabel>{user?.email}</DropdownLabel>
          <DropdownSeparator />

          <DropdownItem onClick={() => router.push("/settings")}>
            <User className="h-4 w-4" />
            Profile & settings
          </DropdownItem>

          <DropdownItem danger onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};