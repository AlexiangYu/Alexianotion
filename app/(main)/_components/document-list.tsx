"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileIcon } from "lucide-react";
import { useQuery } from "convex/react";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Item } from "./item";

interface DocumentListProps {
    parentDocumentId?: Id<"documents">
    level?: number
    data?: Doc<"documents">[]
}

export const DocumentList = ({ parentDocumentId, level = 0 }: DocumentListProps) => {
    
    const params = useParams()  // 路由参数
    const router = useRouter()  // 路由
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})   // 是否展开
    
    // 展开操作
    const onExpand = (documentId: string) => {
        setExpanded((prevExpand) => ({
            ...prevExpand,
            [documentId]: !prevExpand[documentId]
        }))
    }
    // 获取所有的文档
    const documents = useQuery(api.documents.getSidebar, {parentDocument: parentDocumentId})

    // 页面跳转
    const onRedirect = (documentId: string) => {
        router.push(`/documents/${documentId}`)
    }

    if (documents === undefined)
        return (<>
            <Item.Skeleton level={level} />
            { level === 0 && (<>
                    <Item.Skeleton level={level} />
                    <Item.Skeleton level={level} />
            </>) }
        </>)

    return (
        <>
            {/* <div style={{ paddingLeft: level ? `${12 * level + 25}px` : "12px" }}> */}
            <p
                style={{ paddingLeft: level ? `${12 * (level + 1) + 25}px` : "12px" }}
                className={cn("hidden text-sm font-medium text-muted-foreground/80",
                    expanded && "last:block",
                    level === 0 && "hidden"
                )}
            >
                No pages inside
            </p>
            {
                documents?.map(document => (
                    <div key={document._id}>
                        <Item
                            id={document._id}
                            onClick={() => onRedirect(document._id)}
                            label={document.title}
                            icon={FileIcon}
                            documentIcon={document.icon}
                            active={params.documentId === document._id}
                            onExpand={() => onExpand(document._id)}
                            expanded={expanded[document._id]}
                            level={level}
                        />
                        {/* 递归渲染子文档列表 */}
                        {
                            expanded[document._id] && (
                                <DocumentList parentDocumentId={document._id} level={level + 1} />      
                            )
                        }
                    </div>
                ))
            }
        </>)
}