import { AuthShell } from "@/components/layout/auth/AuthShell";

export default function ({ children }) {
    return (
        <AuthShell>
            {children}
        </AuthShell>
    );
};