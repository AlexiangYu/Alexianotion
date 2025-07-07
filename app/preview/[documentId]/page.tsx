"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"
import { useMutation, useQuery } from "convex/react"
import { useParams } from "next/navigation";

import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Toolbar } from "@/app/(main)/_components/toolbar"
import { Cover } from "@/app/(main)/_components/cover"
import { Skeleton } from "@/components/ui/skeleton"


const DocumentIdPage = () => {
    // 动态导入编辑器
    const Editor = useMemo(() => dynamic(() => import("@/components/editor"), { ssr: false }), []);

    const param = useParams()
    const document = useQuery(api.documents.getById, { documentId: param.documentId as Id<"documents"> })

    const update = useMutation(api.documents.update)

    const onChange = (content: string) => {
        update({
            id: document?._id as Id<"documents">,
            content
        })
    }

    if (document === undefined) {
        return (<div>
            <Cover.Skeleton />
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
                <div className="space-y-4 pl-8 pt-4">
                    <Skeleton className="h-14 w-[50%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[40%]" />
                    <Skeleton className="h-4 w-[60%]" />
                </div>
            </div>
        </div>)
    }
    if (document === null) {
        return <div>Document not found</div>
    }

    return (<div className="pt-4">
        <div className="md:max-w-3xl lg:md-max-w-4xl mx-auto">
            <Cover preview url={document.coverImage} />
            <div className="w-full">
                <Toolbar initialData={document} />
                <Editor
                    editable={false}
                    onChange={onChange}
                    initialContent={document.content}
                />
            </div>
        </div>
    </div>)
}

export default DocumentIdPage