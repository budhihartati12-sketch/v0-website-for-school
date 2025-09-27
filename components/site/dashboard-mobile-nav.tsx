"use client"

import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Info, PanelsTopLeft, Building2, Phone, FileText } from "lucide-react"

const items = [
  { key: "profile", icon: User, label: "Profil" },
  { key: "about", icon: Info, label: "Tentang" },
  { key: "organization", icon: PanelsTopLeft, label: "Struktur" },
  { key: "facility", icon: Building2, label: "Fasilitas" },
  { key: "contact", icon: Phone, label: "Kontak" },
  { key: "spmb", icon: FileText, label: "SPMB" },
] as const

export function DashboardMobileNav() {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  if (!pathname?.startsWith("/dashboard")) return null
  const current = params.get("tab") || "spmb"

  return (
    <nav
      aria-label="Dashboard Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border md:hidden"
    >
      <ul className="grid grid-cols-6 h-14">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = current === key || (!params.get("tab") && key === "spmb")
          const href = `/dashboard?tab=${key}`
          return (
            <li key={key}>
              <Link
                href={href}
                onClick={(e) => {
                  e.preventDefault()
                  const qp = new URLSearchParams(params.toString())
                  qp.set("tab", key)
                  if (key !== "spmb") {
                    qp.delete("sub")
                  } else if (!qp.get("sub")) {
                    qp.set("sub", "form")
                  }
                  router.push(`/dashboard?${qp.toString()}`)
                }}
                className={cn(
                  "flex h-full items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
