"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Error = () => {
    return (<div className="h-full flex flex-col items-center justify-center space-y-4">
        <Image src="/error.svg" height={300} width={300} alt="error" className="dark:hidden" />
        <Image src="/error-dark.svg" height={300} width={300} alt="error" className="hidden dark:block" />
        <h2 className="text-xl font-medium">
            Oops! Something went wrong.
        </h2>
        <Button asChild>    {/* 向下传递属性 */}
            <Link href="/documents">
                Go back
            </Link>
        </Button>
    </div>)

}

export default Error