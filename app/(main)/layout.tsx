"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Navigation } from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { ModalProvider } from "@/components/providers/modal-provider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    
    const { isAuthenticated, isLoading } = useConvexAuth()
    if (isLoading) {
        return <div className="h-full w-full flex items-center justify-center">
            <Spinner size={"lg"} />
        </div>
    }
    if (!isAuthenticated) {
        return redirect("/")
    }
    return (
        <div className="h-full flex dark:bg-[#1f1f1f]">
            <Navigation />            
            <main className="flex-1 h-full overflow-y-auto">    {/* 导航栏 */}
                <SearchCommand />
                <ModalProvider />
                {children}
            </main>
        </div>
    )
}

export default MainLayout