"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ClaroHeader } from "./claro-header"

interface SelectAmountScreenProps {
  onSelectAmount: (amount: number) => void
  onBack: () => void
  phone?: string
  onLogout?: () => void
}

const MAIN_AMOUNTS = [8000, 7000, 6000, 5000]
const EXTRA_AMOUNTS = [4000, 3000, 2500, 2000, 1500, 1000, 500, 9000, 10000, 12000, 15000, 18000, 20000, 25000, 30000]

function CashbackBadge() {
  return (
    <div className="flex h-8 w-11 flex-col items-center justify-center rounded bg-[#c8e600] text-center leading-none sm:h-9 sm:w-12">
      <span className="text-[9px] font-black text-[#1a1a1a] sm:text-[10px]">50%</span>
      <span className="text-[7px] font-black text-[#da291c] sm:text-[8px]">CA$H</span>
      <span className="text-[7px] font-black text-[#da291c] sm:text-[8px]">BACK</span>
    </div>
  )
}

function AmountRow({ amount, onSelect }: { amount: number; onSelect: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const cashback = Math.floor(amount * 0.5)

  return (
    <div className="border-b border-[#e0e0e0] last:border-b-0">
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[#1a1a1a] sm:text-lg">
            {'$ '}
            {amount.toLocaleString("es-AR")}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 rounded-full border border-[#da291c] px-2.5 py-0.5 text-[11px] text-[#da291c] sm:px-3 sm:py-1 sm:text-xs"
          >
            {'Esta recarga incluye'}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {amount >= 5000 && <CashbackBadge />}
          <button
            onClick={onSelect}
            className="rounded bg-[#da291c] px-3 py-1.5 text-xs font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 sm:px-4 sm:py-2 sm:text-sm"
          >
            Recargar
          </button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-[#e0e0e0] bg-[#fafafa] px-3 py-2.5 text-[11px] text-[#666666] sm:px-4 sm:py-3 sm:text-xs">
          <p>Incluye datos, minutos y SMS segun el plan vigente.</p>
          {amount >= 5000 && (
            <p className="mt-1">
              50% Cashback: te devolvemos ${cashback.toLocaleString("es-AR")} en Claro Pay.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function SelectAmountScreen({ onSelectAmount, onBack, phone, onLogout }: SelectAmountScreenProps) {
  const [showOtherAmounts, setShowOtherAmounts] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customAmount, setCustomAmount] = useState("")

  const sortedExtra = [...EXTRA_AMOUNTS].sort((a, b) => b - a)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f2f2f2]">
      <ClaroHeader title="Seleccionar monto" onBack={onBack} phone={phone} onLogout={onLogout} />

      <div className="mx-auto w-full max-w-2xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        <p className="mb-3 text-sm font-medium text-[#1a1a1a] sm:mb-4">
          {'¿Cuanto queres recargar?'}
        </p>

        {/* Cashback Banner */}
        <div className="mb-3 overflow-hidden rounded-xl sm:mb-4">
          <div className="relative flex items-center justify-between bg-[#da291c] px-3 py-3 sm:px-5 sm:py-4">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#ffffff] sm:text-2xl md:text-3xl">50%</span>
              <span className="text-lg font-black text-[#c8e600] sm:text-2xl md:text-3xl"> CA$HBACK</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#ffffff] sm:text-xs md:text-sm">{'RECARGAS'}</p>
              <p className="text-base font-black text-[#c8e600] sm:text-xl md:text-2xl">$7000</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#ffffff] sm:text-xs md:text-sm">TE VUELVEN</p>
              <p className="text-base font-black text-[#c8e600] sm:text-xl md:text-2xl">$3500</p>
            </div>
          </div>
          <div className="bg-[#b22318] px-3 py-1 text-center text-[9px] text-[#ffffff] sm:px-5 sm:py-1.5 sm:text-[10px]">
            {'EL CASHBACK APLICA UNICAMENTE A LA LINEA ASOCIADA EN CLARO PAY'}
          </div>
        </div>

        {/* Main amount list */}
        <div className="mb-3 overflow-hidden rounded-xl bg-[#ffffff] shadow-sm sm:mb-4">
          {MAIN_AMOUNTS.map((amount) => (
            <AmountRow key={amount} amount={amount} onSelect={() => onSelectAmount(amount)} />
          ))}
        </div>

        {/* Otros montos button */}
        {!showOtherAmounts ? (
          <button
            onClick={() => setShowOtherAmounts(true)}
            className="w-full rounded-full bg-[#da291c] py-3 text-center text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 sm:text-base"
          >
            Otros montos
          </button>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {/* Extended amounts list */}
            <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
              {sortedExtra.map((amount) => (
                <AmountRow key={amount} amount={amount} onSelect={() => onSelectAmount(amount)} />
              ))}
            </div>

            {/* Custom amount input */}
            {!showCustom ? (
              <button
                onClick={() => setShowCustom(true)}
                className="w-full rounded-full border-2 border-[#da291c] bg-[#ffffff] py-3 text-center text-sm font-semibold text-[#da291c] transition-opacity hover:opacity-90 active:opacity-80 sm:text-base"
              >
                Ingresar otro monto
              </button>
            ) : (
              <div className="rounded-xl bg-[#ffffff] p-3 shadow-sm sm:p-4">
                <p className="mb-2 text-sm font-medium text-[#1a1a1a]">{'Ingresa el monto (minimo $100)'}</p>
                <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#e0e0e0] px-3 py-3 sm:px-4">
                  <span className="text-lg font-bold text-[#1a1a1a]">$</span>
                  <input
                    type="tel"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-transparent text-lg font-bold text-[#1a1a1a] outline-none placeholder:text-[#cccccc]"
                  />
                </div>
                {customAmount && parseInt(customAmount) > 0 && parseInt(customAmount) < 100 && (
                  <p className="mb-2 text-xs text-[#da291c]">El monto minimo es $100</p>
                )}
                <button
                  onClick={() => {
                    const n = parseInt(customAmount)
                    if (n && n >= 100) onSelectAmount(n)
                  }}
                  disabled={!customAmount || parseInt(customAmount) < 100}
                  className="w-full rounded-full bg-[#da291c] py-3 text-center text-sm font-semibold text-[#ffffff] transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:text-base"
                >
                  Recargar ${customAmount ? parseInt(customAmount).toLocaleString("es-AR") : "0"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
