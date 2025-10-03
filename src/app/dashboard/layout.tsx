"use client";
import { useAuthStore } from '@/store/useStore';
import React, { useEffect } from 'react';
import HashLoader from "react-spinners/HashLoader"

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
        (<div>{children}</div>) : (
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
  );
}