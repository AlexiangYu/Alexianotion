"use client"

import { useMutation } from "convex/react"
import { MoreHorizontal, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useUser } from "@clerk/clerk-react"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"

interface MenuProps {
    documentId: Id<"documents">
}
export const Menu = ({ documentId }: MenuProps) => {
    const router = useRouter()
    const { user } = useUser()
    const archive = useMutation(api.documents.archive)
    const onArchive = () => {
        const promise = archive({ id: documentId })
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note"
        })
        router.push("/documents")
    }
    return (<div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className="w-4 h-4 mr-2" />Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="text-xs text-muted-foreground p-2">
                    Last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>)
}

Menu.Skeleton = function MenuSkeleton() {
    return (<Skeleton className="h-10 w-10" />)
}