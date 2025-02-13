import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <Header />
          {children}
          <Footer />
        </main>
        <Toaster />
      </SidebarProvider>
    </>
  );
}
