"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { Check, Copy, Globe } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { useOrigin } from "@/hooks/use-origin"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PublishedProps {
    initialData: Doc<"documents">,

}

export const Publish = ({ initialData }: PublishedProps) => {
    // 获取原始url
    const origin = useOrigin()
    const url = `${origin}/preview/${initialData._id}`
    // 更新
    const update = useMutation(api.documents.update)
    // 剪贴板
    const [copied, setCopied] = useState(false)
    // 是否发布
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 发布
    const onPublish = () => {
        setIsSubmitting(true)
        const promise = update({
            id: initialData._id,
            isPublished: true
        }).finally(() => setIsSubmitting(false))

        toast.promise(promise, {
            loading: "Publishing...",
            success: "Note Published",
            error: "Failed to publish"
        })
    }
    // 取消发布
    const onUnpublish = () => {
        setIsSubmitting(true)
        const promise = update({
            id: initialData._id,
            isPublished: false
        }).finally(() => setIsSubmitting(false))
        
        toast.promise(promise, {
            loading: "Unpublishing...",
            success: "Note Unpublished",
            error: "Failed to unpublish"
        })
    }
    // 复制链接
    const onCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }
    return (<>
        <Popover>
            <PopoverTrigger asChild>
                <Button size="sm" variant={"ghost"}>
                    Publish
                    {initialData.isPublished && <Globe className="text-sky-500 w-4 h-4 ml-2" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end" alignOffset={0} forceMount>
                {
                    initialData.isPublished ? (<div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <Globe className="text-sky-500 w-4 h-4 animate-pulse" />
                            <p className="text-xs font-medium text-sky-500">
                                This note is live on web.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate" value={url} />
                            <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                                {copied ? (<Check className="w-4 h-4" />) : (<Copy className="w-4 h-4" />)}
                            </Button>
                        </div>
                        <Button disabled={isSubmitting} onClick={onUnpublish} className="w-full text-xs" size={"sm"}>
                            Unpublish
                        </Button>
                    </div>) : (<>
                        <div className="flex flex-col items-center justify-center">
                            <Globe className="text-sky-500 w-4 h-4 mb-2" />
                            <p className="text-sm font-medium mb-2">Publish this note</p>
                            <span className="text-xs text-muted-foreground mb-4">
                                Share your work with others
                            </span>
                            <Button disabled={isSubmitting} onClick={onPublish} className="w-full text-xs" size={"sm"}>
                                Publish
                            </Button>
                        </div>
                    </>)
                }
            </PopoverContent>
        </Popover>
    </>)
}

