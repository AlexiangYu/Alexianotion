import { useEffect, useState } from "react";
/**
 * 自定义 Hook，用于检测网页是否滚动超过指定阈值
 * @param {number} threshold - 触发阈值（像素），默认值为 10
 * @returns {boolean} - 当前是否已经滚动超过阈值
 */
export const useScrollTop = (threshold = 10) => {     // 触发阈值（像素），默认值为 10
    const [scrolled, setScrolled] = useState(false);
   
    useEffect(() => {
        const scrollHandler = ()=>{
            if(window.scrollY > threshold) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }
        window.addEventListener('scroll', scrollHandler);   // 滚动事件监听器
        return () => window.removeEventListener('scroll', scrollHandler);

    }, [threshold]);

    return scrolled;
}