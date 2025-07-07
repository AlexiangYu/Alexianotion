import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
})

export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2">
            <Image src="/png/logo.png" className="dark:hidden" width={40} height={40} alt="logo" />
            <Image src="/png/logo-dark.png" className="hidden dark:block" width={40} height={40} alt="logo" />
            <p className={cn("font-semibold ", font.className)}>
                Alexianotion
            </p>
        </div>
    )
}