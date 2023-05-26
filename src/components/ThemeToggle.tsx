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
      className="w-12 h-6 rounded-full bg-white flex items-center dark:bg-zinc-800"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <div
          id="switch-toggle"
          className="w-8 h-8 rounded-full bg-amber-300 p-1 transition"
        >
          <TbSunHigh size={24} />
        </div>
      ) : (
        <div
          id="switch-toggle"
          className="w-8 h-8 rounded-full bg-amber-300 p-1 translate-x-5 transition"
        >
          <FaMoon size={24} />
        </div>
      )}
    </button>
  )
}

export default ThemeToggleButton