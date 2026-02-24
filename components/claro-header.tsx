"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, User, LogOut, Phone } from "lucide-react"

interface ClaroHeaderProps {
  title: string
  onBack?: () => void
  phone?: string
  onLogout?: () => void
}

export function ClaroHeader({ title, onBack, phone, onLogout }: ClaroHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-[#da291c] px-3 py-3 text-[#ffffff] sm:px-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="flex items-center" aria-label="Volver">
            <ArrowLeft className="h-5 w-5 text-[#ffffff] sm:h-6 sm:w-6" />
          </button>
        )}
        <h1 className="text-base font-semibold text-[#ffffff] sm:text-lg">{title}</h1>
      </div>

      {phone && onLogout && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffffff]/20 transition-colors hover:bg-[#ffffff]/30 sm:h-9 sm:w-9"
            aria-label="Perfil"
          >
            <User className="h-4 w-4 text-[#ffffff] sm:h-5 sm:w-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg bg-[#ffffff] shadow-lg sm:w-64">
              <div className="border-b border-[#e0e0e0] px-4 py-3">
                <p className="text-xs text-[#999999]">Mi linea</p>
                <div className="mt-1 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#da291c]" />
                  <p className="text-sm font-semibold text-[#1a1a1a]">{phone}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onLogout()
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#da291c] transition-colors hover:bg-[#f2f2f2]"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesion
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
