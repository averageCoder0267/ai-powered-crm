import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import "./globals.css";

export const metadata = {
  title: "AI-Powered CRM | Smarter Customer Relationship Management",
  description:
    "An AI-powered CRM platform to streamline customer management, track leads, manage interactions, and grow your business with intelligent insights and automation.",
  keywords: [
    "AI-Powered CRM",
    "AI CRM",
    "Customer Relationship Management",
    "Lead Management",
    "Sales Automation",
    "Customer Management",
    "CRM Software",
  ],
  authors: [{ name: "Yash Jain" }],
  creator: "Yash Jain",
  openGraph: {
    title: "AI-Powered CRM | Smarter Customer Relationship Management",
    description:
      "Manage customers, track leads, and streamline your business with an intelligent AI-powered CRM platform.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI-Powered CRM Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Powered CRM | Smarter Customer Relationship Management",
    description:
      "Manage customers, track leads, and grow your business with an AI-powered CRM.",
    images: ["/og-image.png"],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense>
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{ style: { borderRadius: "14px" } }}
            />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
