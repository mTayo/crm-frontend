'use client';
import { AppSidebar } from "@/components/app-sidebar"
import HashLoader from "react-spinners/HashLoader"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { useAuthStore } from "@/store/useStore"
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, appInitialized, fetchAdminData } = useAuthStore();
  useEffect(() => {
    if (!appInitialized) {
      fetchAdminData();
    }
  }, [appInitialized, fetchAdminData]);
  return (
        <>
        {appInitialized ? 
        (
          <div>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" />
              <SidebarInset>
                <SiteHeader />
                  {children}
              </SidebarInset>
            </SidebarProvider>
          </div>
        ) : (
            <>
                <div className="max-h-screen min-h-screen flex antialiased relative">
               
                    <div className="w-full   text-white flex items-center justify-center p-8">
                        <div className="">
                            <HashLoader color="#1b1917" size={100} />
                        </div>
                    </div>
                </div>
                
            </>
        )}
    </>
 
  )
}
