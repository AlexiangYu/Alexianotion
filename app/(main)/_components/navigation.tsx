import { cn } from "@/lib/utils"
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { UserItem } from "./user-item"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Item } from "./item"
import { DocumentList } from "./document-list"
import { TrashBox } from "./trash-box"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSearch } from "@/hooks/use-search"
import { useSettings } from "@/hooks/use-settings"
import { NavBar } from "./navbar"

/**
 * 主导航组件
 * 渲染一个可调整大小、可折叠的侧边栏，包含文档列表、设置、搜索和垃圾箱功能。
 */
export const Navigation = () => {
    
    const router = useRouter()  // Next.js 路由钩子，用于页面跳转
    const params = useParams()  // 获取动态路由参数，例如文档 ID
    const pathname = usePathname()      // 获取当前 URL 的路径名
    const isMobile = useMediaQuery('(max-width: 768px)')    // 判断是否为移动端设备
    const isResizingRef = useRef(false) // 标记侧边栏是否正在被拖拽调整大小

    const create = useMutation(api.documents.create)    // Convex 的 useMutation 钩子，用于创建新文档
    const settings = useSettings()  // 控制设置模态框的打开
    const { onOpen } = useSearch()  // 控制搜索模态框的打开

    const sidebarRef = useRef<HTMLDivElement>(null)     // 侧边栏    
    const navbarRef = useRef<HTMLDivElement>(null)  // 导航图标
    
    const [isReseting, setIsReseting] = useState(false)    // 标记侧边栏是否正在重置，用于过度动画
    const [isCollapsed, setIsCollapsed] = useState(isMobile)    // 是否已折叠


    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [pathname, isMobile])


    /**
     * 监听鼠标拖拽操作，调整侧边栏宽度
     */
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        isResizingRef.current = true
        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)
    }
    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return
        let newWidth = event.clientX
        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480
        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty("left", `${newWidth}px`)
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
        }
    }
    const handleMouseUp = (_: MouseEvent) => {
        isResizingRef.current = false
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
    }

     /**
     * 重置侧边栏宽度
     * 将侧边栏恢复到默认宽度（桌面端）或展开（移动端）。
     */
    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsReseting(true)
            sidebarRef.current.style.width = isMobile ? "100%" : "240px"
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : `240px`)
            navbarRef.current.style.setProperty("width", isMobile ? "0" : `calc(100% - 240px)`)
            setTimeout(() => setIsReseting(false), 300);
        }
    }
    /**
    * 折叠菜单栏
    */
    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsReseting(true)
            sidebarRef.current.style.width = "0"
            navbarRef.current.style.setProperty("left", "0")
            navbarRef.current.style.setProperty("width", "100%")
            setTimeout(() => setIsReseting(false), 300);
        }
    }

    /**
     * 创建文档
     */
    const handleCreate = () => {
        const promise = create({ title: "Untitled" }).then((documentId) => router.push(`/documents/${documentId}`))
        
        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        })
    }

    return (
        <div>
            <aside ref={sidebarRef} className={     // aside 标签表示跟当前页面的内容没有很相关的部分
                cn("group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[50]",
                    isReseting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                )
            }>
                <div role="button" onClick={collapse} className={
                    cn("h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100",
                        isMobile && !isCollapsed && "opacity-100")
                }>
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem />
                    <Item onClick={onOpen} label="Search" icon={Search} isSearch/>
                    <Item onClick={settings.onOpen} label="Settings" icon={Settings}/>
                    <Item onClick={handleCreate} label="New Page" icon={PlusCircle}/>
                </div>
                <div className="mt-4">
                    <DocumentList />
                    <Item onClick={handleCreate} label="Add a page" icon={Plus}/>
                    <Popover >
                        <PopoverTrigger className="w-full">
                            <Item label="Trash" icon={Trash}/>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" side={isMobile ? 'bottom': 'right'}>
                            <TrashBox />
                        </PopoverContent>
                    </Popover>
                </div>
                {/* 侧边栏宽度调整手柄 */}
                <div onClick={resetWidth} onMouseDown={handleMouseDown} className="opacity-0 group-hover/sidebar:opacity-100 transition
                cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
            </aside>
            
            <div ref={navbarRef} className={
                cn("absolute top-0 left-60  z-[50] w-[calc(100% - 240px)]",
                    isReseting && "transition-all ease-in-out duration-300",
                    isMobile && "left-0 w-full"
                )
            }>
                {/* 条件渲染：如果 URL 中有 documentId，则显示文档专用的 NavBar。否则，在折叠时显示一个菜单图标以展开侧边栏 */}
                {!!params.documentId ? (<NavBar isCollapsed={isCollapsed} onResetWidth={resetWidth} />): (<nav>
                    {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                </nav>)}
            </div>
      </div>
    )
}