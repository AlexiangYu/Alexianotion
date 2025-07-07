"use client"

import { useRef, useState } from "react"
import { useMutation } from "convex/react"

import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TitleProps {
    initialData: Doc<"documents">
}

export const Title = ({ initialData }: TitleProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const upate = useMutation(api.documents.update)

    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(initialData.title || "Untitled")
    // 开启编辑
    const enableInput = () => {
        setTitle(initialData.title)
        setIsEditing(true)
        // 使用 setTimeout(() => xxx, 0) 的机制在于利用事件循环将代码的执行推迟到当前事件循环之后，从而确保在 React 状态更新和组件重新渲染完成后执行。
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelectionRange(0, initialData.title.length)
        }, 0)
    }
    // 禁止编辑
    const disableInput = () => { setIsEditing(false) }

    // 内容更新
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
        upate({ id: initialData._id, title: event.target.value || 'Untitled' })
    }

    // 回车保存
    const onkeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter')
            disableInput()
    }

    return (
        <div className="flex items-center gap-x-1">
            {initialData.icon && <p>{initialData.icon}</p>}
            {
                isEditing ? 
                    (<Input
                        ref={inputRef}
                        onClick={enableInput}
                        onBlur={disableInput}
                        onChange={onChange}
                        onKeyDown={onkeyDown}
                        value={title}
                        className="h-7 px-2  border-transparent focus-visible:ring-transparent" />) :
                    (<Button
                        onClick={enableInput}
                        variant={"ghost"}
                        size={"sm"}
                        className="font-normal h-auto p-1">
                        {initialData.title}
                    </Button>)
            }
        </div>
    )
}
// 骨架屏
Title.Skeleton = function TitleSkeleton({ }) {
    return (<Skeleton className="h-9 w-20 rounded-sm" />)
}