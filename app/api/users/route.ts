import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DB_PATH = path.join(process.cwd(), "data", "users.json")

interface UserEntry {
  telefono: string
  lastUsed: string
  recharges: number
}

async function ensureDB() {
  try {
    await fs.access(path.dirname(DB_PATH))
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
  }
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([]), "utf-8")
  }
}

async function readDB(): Promise<UserEntry[]> {
  await ensureDB()
  const data = await fs.readFile(DB_PATH, "utf-8")
  return JSON.parse(data)
}

async function writeDB(users: UserEntry[]) {
  await ensureDB()
  await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2), "utf-8")
}

export async function GET() {
  const users = await readDB()
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { telefono } = body

  if (!telefono) {
    return NextResponse.json({ error: "Missing telefono" }, { status: 400 })
  }

  const users = await readDB()
  const existing = users.find((u) => u.telefono === telefono)

  if (existing) {
    existing.lastUsed = new Date().toISOString()
    existing.recharges += 1
    await writeDB(users)
    return NextResponse.json({ user: existing, isNew: false })
  }

  const newUser: UserEntry = {
    telefono,
    lastUsed: new Date().toISOString(),
    recharges: 1,
  }
  users.push(newUser)
  await writeDB(users)
  return NextResponse.json({ user: newUser, isNew: true })
}
