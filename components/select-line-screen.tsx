"use client"

import { useState } from "react"
import { ChevronRight, ChevronUp, ChevronDown, Smartphone, Plus } from "lucide-react"
import { ClaroHeader } from "./claro-header"

interface SelectLineScreenProps {
  savedPhone: string | null
  onSelectLine: (telefono: string) => void
  onBack: () => void
  onLogout: () => void
}

export function SelectLineScreen({ savedPhone, onSelectLine, onBack, onLogout }: SelectLineScreenProps) {
  const [showOtherLine, setShowOtherLine] = useState(!savedPhone)
  const [newNumber, setNewNumber] = useState("")
  const [error, setError] = useState("")

  const handleContinue = () => {
    if (!newNumber || newNumber.length < 10) {
      setError("Ingresa un numero valido")
      return
    }
    onSelectLine(newNumber)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f2f2f2]">
      <ClaroHeader title="Recargar" onBack={onBack} phone={savedPhone || undefined} onLogout={onLogout} />

      <div className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <p className="mb-3 text-sm font-medium text-[#1a1a1a] sm:mb-4">
          {'¿Que linea queres recargar?'}
        </p>

        {/* Saved phone */}
        {savedPhone && (
          <button
            onClick={() => onSelectLine(savedPhone)}
            className="mb-3 flex w-full items-center justify-between rounded-xl border border-[#e0e0e0] bg-[#ffffff] px-3 py-3 shadow-sm transition-shadow hover:shadow-md sm:px-4 sm:py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0e0e0] sm:h-10 sm:w-10">
                <Smartphone className="h-4 w-4 text-[#da291c] sm:h-5 sm:w-5" />
              </div>
              <div className="text-left">
                <p className="text-[11px] text-[#999999] sm:text-xs">Mi linea</p>
                <p className="text-sm font-bold text-[#1a1a1a] sm:text-base">{savedPhone}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#999999]" />
          </button>
        )}

        {/* Other line */}
        <div className="rounded-xl border border-[#e0e0e0] bg-[#ffffff] shadow-sm">
          <button
            onClick={() => setShowOtherLine(!showOtherLine)}
            className="flex w-full items-center justify-between px-3 py-3 sm:px-4 sm:py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-[#999999] sm:h-10 sm:w-10">
                <Plus className="h-4 w-4 text-[#999999] sm:h-5 sm:w-5" />
              </div>
              <p className="text-sm font-semibold text-[#1a1a1a]">Ingresar otra linea</p>
            </div>
            {showOtherLine ? (
              <ChevronUp className="h-5 w-5 text-[#999999]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#999999]" />
            )}
          </button>

          {showOtherLine && (
            <div className="border-t border-[#e0e0e0] px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
              <div className="mb-2 rounded-lg border border-[#e0e0e0] px-3 py-3 sm:px-4">
                <label className="mb-1 block text-[11px] text-[#999999] sm:text-xs">{'Numero de linea'}</label>
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 shrink-0 text-[#999999] sm:h-5 sm:w-5" />
                  <input
                    type="tel"
                    placeholder="EJ: 1121872500"
                    value={newNumber}
                    onChange={(e) => {
                      setNewNumber(e.target.value.replace(/\D/g, ""))
                      setError("")
                    }}
                    className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#cccccc]"
                    maxLength={12}
                  />
                </div>
              </div>
              <p className="mb-3 text-[11px] text-[#999999] sm:text-xs">
                {'Codigo de area + tu numero sin el 15'}
              </p>
              {error && <p className="mb-3 text-xs text-[#da291c]">{error}</p>}
              <button
                onClick={handleContinue}
                className="w-full rounded-full bg-[#da291c] py-3 text-center text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 sm:text-base"
              >
                Continuar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
