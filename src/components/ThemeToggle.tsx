'use client'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon } from 'react-icons/fa'
import { TbSunHigh } from 'react-icons/tb'

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()
  // const currentTheme = theme === 'system' ? systemTheme : theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <button
      className="flex h-6 w-10 items-center rounded-full bg-white dark:bg-zinc-800 sm:h-7 sm:w-11"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <div
          id="switch-toggle"
          className="h-6 w-6 rounded-full bg-amber-300 p-1 transition sm:h-7 sm:w-7"
        >
          <TbSunHigh className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      ) : (
        <div
          id="switch-toggle"
          className="h-6 w-6 translate-x-4 rounded-full bg-amber-300 p-1 transition sm:h-7 sm:w-7"
        >
          <FaMoon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      )}
    </button>
  )
}

export default ThemeToggleButton
