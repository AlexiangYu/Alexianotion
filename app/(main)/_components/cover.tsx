"use client"

import { useMutation } from "convex/react"
import { ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCoverImage } from "@/hooks/use-cover-images"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface CoverImageProps {
    url?: string
    preview?: boolean
}

export const Cover = ({ url, preview }: CoverImageProps) => {
    const param = useParams()
    const removeCoverImage = useMutation(api.documents.removeCoverImage)
    const coverImage = useCoverImage()

    const onRemoveCover = () => {
        removeCoverImage({
            id: param.documentId as Id<"documents">
        })
    }
    return (
        <div className={cn("relative w-full h-[35vh] group", !url && "h-[12vh]", url && "bg-muted")}>
            {!!url && (
                <Image src={url} fill alt="Cover" className="object-cover w-full" />
            )}
            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={() => coverImage.onReplace(url)}
                        className="text-muted-foreground text-xs mr-2"
                        variant={"outline"}
                        size={"sm"}
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Change cover
                    </Button>
                    <Button
                        onClick={onRemoveCover}
                        className="text-muted-foreground text-xs"
                        variant={"outline"}
                        size={"sm"}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Delete cover
                    </Button>
                </div>
            )}
        </div>
    )
}

Cover.Skeleton = function CoverSkeleton() {
    return (<Skeleton className="w-full h-[12vh]" />)
}