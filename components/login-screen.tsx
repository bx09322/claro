"use client"

import { useState } from "react"
import { Smartphone } from "lucide-react"
import Image from "next/image"

interface LoginScreenProps {
  onContinue: (telefono: string) => void
}

export function LoginScreen({ onContinue }: LoginScreenProps) {
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!telefono || telefono.length < 10) {
      setError("Ingresa un numero valido (minimo 10 digitos)")
      return
    }
    setError("")
    onContinue(telefono)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#f2f2f2] px-4 py-8">
      <div className="w-full max-w-[460px]">
        {/* Packs Ya Logo */}
        <div className="mb-[-28px] flex justify-center relative z-10">
          <Image
            src="/images/packsya.png"
            alt="Packs Ya"
            width={80}
            height={80}
            className="h-16 w-16 rounded-xl sm:h-20 sm:w-20"
            priority
          />
        </div>

        {/* Card */}
        <div className="rounded-xl bg-[#ffffff] px-5 pb-6 pt-10 shadow-sm sm:px-8 sm:pb-8 sm:pt-12">
          <p className="mb-6 text-center text-sm font-medium leading-relaxed text-[#1a1a1a] sm:text-base">
            {'Ingresa tu numero de linea y te enviaremos un SMS con un codigo de verificacion.'}
          </p>

          <div className="mb-2 rounded-lg border border-[#e0e0e0] px-3 py-3 sm:px-4">
            <label className="mb-1 block text-[11px] text-[#999999] sm:text-xs">{'Numero de linea'}</label>
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 shrink-0 text-[#999999] sm:h-5 sm:w-5" />
              <input
                type="tel"
                placeholder="EJ: 1123456789"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value.replace(/\D/g, ""))
                  setError("")
                }}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#cccccc]"
                maxLength={12}
              />
            </div>
          </div>

          <p className="mb-5 text-[11px] text-[#999999] sm:text-xs">
            {'Codigo de area + tu numero sin el 15'}
          </p>

          {error && <p className="mb-3 text-xs text-[#da291c]">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full rounded-full bg-[#da291c] py-3 text-center text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 sm:py-3.5 sm:text-base"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
