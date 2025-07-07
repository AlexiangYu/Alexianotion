"use client"

import Link from "next/link"
import { useConvexAuth } from "convex/react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/spinner"
import { SignInButton } from "@clerk/clerk-react"

const Heading = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    return (
        <div className="max-w-3xl spaced-y-4 dark:bg-[#1F1F1F]">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
                Wealcome to our website!
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl my-4 font-medium">
                We want to connect your workspaces with your audience for better engagement.
            </h3>
            {isLoading && <div className="mx-auto flex items-center justify-center"><Spinner size={"lg"} /></div>}

            {isAuthenticated && !isLoading && (
                <Button asChild>
                    <Link href={"/documents"}>
                        Enter your notebook
                        <ArrowRight className="h-4 w-4 ml-2" />                    
                    </Link>
                </Button>
            )}
            {!isAuthenticated && !isLoading &&
                (<>
                    <SignInButton mode="modal">
                        <Button asChild>
                            <Link href={"/documents"}>
                                Enter your notebook
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </SignInButton>

                </>
                )
            }
        </div>
    );
}
 
export default Heading;