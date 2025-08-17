"use client";
import { Logo } from "./logo";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const Navbar = () => {
    const scrolled = useScrollTop();
    const { isAuthenticated, isLoading } = useConvexAuth()
    return (
        <div
            className={cn(      // cn 用来合并多个 className 字符串
                "z-50 bg-background fixed top-0 flex items-center w-full p-6 dark:bg-[#1F1F1F]",
                scrolled && "border-b shadow-sm"    // 下拉 10px 后添加阴影
            )}
        >
            <Logo />
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading && <Spinner />}
                {!isAuthenticated && !isLoading &&
                    (<>
                        <SignInButton mode="modal">
                            <Button variant={"ghost"} size={"sm"}>Log in</Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button size={"sm"} asChild>
                                <Link href={"/documents"}> Get Notion Free </Link>
                            </Button>
                        </SignInButton>
                    </>
                    )
                }
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant={"ghost"} size={"sm"} asChild>
                            <Link href={"/documents"}> Enter Notion </Link>
                        </Button>
                        <UserButton/>
                    </>
                )}
                <div className="ml-2"><ModeToggle /></div>
            </div>
        </div>
    );
};
