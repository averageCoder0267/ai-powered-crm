"use client";
import { PageHeader } from "@/components/common";
import { AccountCard, AiIntegrationCard, ProfileCard, SecurityCard } from "@/components/pages/settings";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Settings() {
    const { user, updateUser, logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push("/login");
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <PageHeader
                title="Settings"
                subtitle="Manage your account and integrations."
            />

            <ProfileCard user={user} updateUser={updateUser} />
            <SecurityCard />
            <AiIntegrationCard />
            <AccountCard user={user} logout={handleLogout} />
        </div>
    );
};