import { useEffect, useState } from "react"

/**
 * 确保只有在组件挂载后，才会返回网页的源地址，在服务端渲染或尚未挂载时，返回空字符串，避免访问未定义的 window 对象导致错误。
 */
export const useOrigin = () => {
    const [mount, setMount] = useState(false)
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    useEffect(() => {
        setMount(true)
    }, [])
    if (!mount) return ""
    return origin
}