import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import MobileMenu from "@/components/MobileMenu";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col ">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="flex flex-col lg:flex-row flex-1">
        <AppSidebar />
        <main className="flex-1">
          <Header />
          {children}
        </main>
      </div>
      {/* <SidebarProvider defaultOpen>
        <AppSidebar />
        <main className="flex-1">
          <Header />
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider> */}
      <MobileMenu />
    </div>
  );
}
