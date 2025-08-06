"use client"

import { useTheme } from "next-themes"
import { useEdgeStore } from "@/lib/edgestore"
import { useCreateBlockNote, } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { BlockNoteEditor } from "@blocknote/core"
import "@blocknote/mantine/style.css"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"

interface EditorProps {
    onChange: (value: string) => void
    initialContent?: string
    editable?: boolean
}

const Editor = ({
    onChange,
    initialContent,
    editable
}: EditorProps) => {

    // 主题
    const { resolvedTheme } = useTheme()
    // 文件存储
    const { edgestore } = useEdgeStore()

    const handleUpload = async (file: File) => {
        const response = await edgestore.publicFiles.upload({ file })
        return response.url
    }

    // 编辑器
    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) : undefined,
        uploadFile: handleUpload,
    })

    return (
        <div>
            <BlockNoteView
                editable={editable}
                onChange={() => { onChange(JSON.stringify(editor.document, null, 2)) }}
                editor={editor}
                theme={resolvedTheme === "dark"? "dark" : "light"}
            />
        </div>
    )
}

export default Editor