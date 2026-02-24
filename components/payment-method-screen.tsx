"use client"

import { ChevronRight, CreditCard, Wallet } from "lucide-react"
import { ClaroHeader } from "./claro-header"

interface PaymentMethodScreenProps {
  telefono: string
  amount: number
  onSelectMethod: (method: "tarjeta" | "claropay") => void
  onBack: () => void
  onLogout?: () => void
}

export function PaymentMethodScreen({
  telefono,
  amount,
  onSelectMethod,
  onBack,
  onLogout,
}: PaymentMethodScreenProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f2f2f2]">
      <ClaroHeader title="Metodo de pago" onBack={onBack} phone={telefono} onLogout={onLogout} />

      <div className="mx-auto w-full max-w-2xl px-3 py-4 sm:px-4 sm:py-6">
        <p className="mb-1 text-sm text-[#1a1a1a]">
          Tu recarga de{" "}
          <span className="font-bold text-[#1a1a1a]">$ {amount.toLocaleString("es-AR")}</span> a la linea{" "}
          <span className="font-bold text-[#1a1a1a]">{telefono}</span> esta casi lista.
        </p>

        <hr className="my-3 border-[#e0e0e0] sm:my-4" />

        {/* Cashback banner */}
        <div className="mb-3 overflow-hidden rounded-xl sm:mb-4">
          <div className="bg-[#da291c] px-4 py-3 sm:px-5 sm:py-4">
            <span className="text-base font-black text-[#c8e600] sm:text-lg">CA$HBACK</span>
            <span className="ml-2 text-base font-black text-[#ffffff] sm:text-lg"> TU PLATA VUELVE</span>
          </div>
          <div className="border border-t-0 border-[#e0e0e0] bg-[#ffffff] px-4 py-3 sm:px-5 sm:py-4">
            <p className="mb-1 text-sm font-semibold text-[#1a1a1a]">{'¿Como funciona?'}</p>
            <p className="text-[11px] text-[#666666] sm:text-xs">
              {'Paga con Claro Pay y acreditamos el '}
              <span className="font-bold italic text-[#1a1a1a]">CA$HBACK</span>
              {' como dinero disponible en tu billetera. '}
              <span className="cursor-pointer text-[#da291c]">Ver legales</span>
            </p>
          </div>
        </div>

        <p className="mb-3 text-sm font-medium text-[#1a1a1a]">{'¿Como queres pagar?'}</p>

        {/* Payment options */}
        <div className="overflow-hidden rounded-xl bg-[#ffffff] shadow-sm">
          <button
            onClick={() => onSelectMethod("claropay")}
            className="flex w-full items-center justify-between border-b border-[#e0e0e0] px-3 py-3 transition-colors hover:bg-[#fafafa] sm:px-4 sm:py-4"
          >
            <div className="flex items-center gap-3">
              <Wallet className="h-5 w-5 shrink-0 text-[#999999]" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {'CA$HBACK con '}
                  <span className="text-[#da291c]">{'Claro'}</span>
                  <span className="text-[#1a1a1a]">{' Pay'}</span>
                </p>
                <p className="text-[11px] text-[#999999] sm:text-xs">Billetera virtual</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#999999]" />
          </button>

          <button
            onClick={() => onSelectMethod("tarjeta")}
            className="flex w-full items-center justify-between px-3 py-3 transition-colors hover:bg-[#fafafa] sm:px-4 sm:py-4"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 shrink-0 text-[#999999]" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[#1a1a1a]">Con tarjeta</p>
                <p className="text-[11px] text-[#999999] sm:text-xs">{'Credito o debito'}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#999999]" />
          </button>
        </div>
      </div>
    </div>
  )
}
