import { useMutation } from "convex/react"
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/clerk-react"
import { cn } from "@/lib/utils"

interface ItemProps {
    id?: Id<"documents">
    documentIcon?: string   // emoji
    active?: boolean
    expanded?: boolean
    isSearch?: boolean
    level?: number
    label: string
    onClick?: () => void
    onExpand?: () => void
    icon: LucideIcon
}

/**
 * 边栏中的 Item 组件
 */
export const Item = ({ label, onClick, icon: Icon, level, active, documentIcon, id, isSearch, onExpand, expanded }: ItemProps) => {
    const router = useRouter()
    // 用户信息
    const { user } = useUser()

    // 创建
    const create = useMutation(api.documents.create)
    const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        if (!id) return;
        const promise = create({ title: "Untitled", parentDocument: id })
            .then(documentId => {
                if (!expanded) {
                    onExpand?.()
                }
                router.push(`/documents/${documentId}`)
            })
        toast.promise(promise, {
            loading: "Create a new Note...",
            success: "New note created",
            error: "Failed to create new note"
        })
    }

    // 删除
    const archive = useMutation(api.documents.archive)
    const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()

        if (!id) return;
        const promise = archive({ id })
            .then(() => router.push(`/documents`))
        toast.promise(promise, {
            loading: "Moving to trash...",
            success: "Note moved to trash!",
            error: "Failed to archive note"
        })
    }

    // 展开事件
    const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        onExpand?.()
    }
    // 展开和收齐图标
    const ChevronIcon = expanded ? ChevronDown : ChevronRight
    return (<>
        <div onClick={onClick} role="button" style={{ paddingLeft: level ? `${12 * (level + 1)}px` : "12px" }} className={
            cn("group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary"
            )
        }>

            {/* 展开和折叠 */}
            {!!id && (
                <div onClick={handleExpand} role="button" className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1">
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                </div>
            )}
            
            {documentIcon ? (<div className="shrink-0 h-[18px] mr-2" > { documentIcon } </div>):
                (<Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />)}
            
            <span className="truncate"> {/* 标题 */}
                {label}
            </span>

            {/* 搜索展示 */}
            {isSearch && (
                    <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ">
                        <span className="text-xs">⌘</span> + K
                    </kbd>  // 键盘输入提示
            )}
            {/* 操作按钮 */}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                            <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="right" forceMount>
                            <DropdownMenuItem onClick={onArchive}>
                                <div className="text-red-500 flex items-center">
                                    <Trash className="w-4 h-4 mr-2" /> Delete
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="text-xs text-muted-foreground p-2">Last edited by: {user?.fullName}</div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div role="button" onClick={onCreate} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600" >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    </>)
}

/**
 * Item 组件的骨架屏
 */
Item.Skeleton = function ItemSkeleton({ level }: { level: number }) {
    return (
        <div
            style={{ paddingLeft: level ? `${12 * (level + 1) + 25}px`: "12px" }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}