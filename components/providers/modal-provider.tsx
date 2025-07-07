"use client";

import { useEffect, useState } from "react";

import { CoverImageModal } from "../modals/cover-image-modal";
import { SettingsModal } from "../modals/settings-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    if (!isMounted) // 阻止服务端渲染
        return null
    
    return (
        <>
            <SettingsModal />
            <CoverImageModal />
        </>
    )
}