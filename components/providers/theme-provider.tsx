"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 此组件封装Next.js ThemeProvider组件，以在整个应用程序中提供一致的主题。
*/

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}> {children} </NextThemesProvider>
}
