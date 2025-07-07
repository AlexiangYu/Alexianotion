"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const DocumnetsPage = () => {
    // 用户信息
    const { user } = useUser()
    // 创建
    const create = useMutation(api.documents.create)
    // 路由
    const router = useRouter()
    // 创建
    const onCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))
        
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        })
    }


    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image width="300" height="300" alt="empty" src="/note.svg" className="dark:hidden" />
            <Image width="300" height="300" alt="empty" src="/note-dark.svg" className="hidden dark:block" />
            <h2>Welcome to {user?.firstName}&apos;s Notes</h2>
            <Button onClick={onCreate}>
                <PlusCircle className="w-4 h-4 mr-2" /> Create a note
            </Button>
        </div>
    )
}
export default DocumnetsPage;