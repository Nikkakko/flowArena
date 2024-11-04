import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import MobileMenu from "@/components/MobileMenu";
import Footer from "@/components/Footer";

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
      </SidebarProvider>
    </>
  );
}
