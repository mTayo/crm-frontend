// app/auth/layout.tsx
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


export const metadata = {
  title: 'Auth | CRM App',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">

      <header className="w-full py-4 text-center bg-white shadow-md">
        <h1 className="text-xl font-semibold text-gray-800">Welcome Back to CRM</h1>
      </header>


      <main className="flex flex-1  px-3 items-center justify-start lg:justify-center">
        {children}
      </main>
    </div>
  );
}
