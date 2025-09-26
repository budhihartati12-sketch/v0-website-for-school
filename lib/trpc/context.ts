import { prisma } from "@/lib/prisma"
import type { CreateNextContextOptions } from "@trpc/server/adapters/next"

export async function createContext(opts: CreateNextContextOptions) {
  return {
    prisma,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
