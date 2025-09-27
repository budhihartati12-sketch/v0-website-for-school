"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DashboardMobileNav } from "@/components/site/dashboard-mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine current page for active state
  const getCurrentPage = () => {
    if (pathname === "/dashboard/overview") return "overview"
    if (pathname === "/dashboard/school") return "school"
    if (pathname === "/dashboard/contact") return "contact"
    if (pathname === "/dashboard/admissions") return "admissions"
    if (pathname === "/dashboard/messages") return "messages"
    return "overview"
  }

  const currentPage = getCurrentPage()
  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <header className="mb-4 hidden items-center justify-between md:flex">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard Pengelolaan Website Sekolah</h1>
          <p className="text-sm text-muted-foreground">
            Kelola profil sekolah, fasilitas, kontak, jam operasional, dan SPMB.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/overview">
            <Button variant={currentPage === "overview" ? "default" : "outline"} size="sm">
              Overview
            </Button>
          </Link>
          <Link href="/dashboard/school">
            <Button variant={currentPage === "school" ? "default" : "outline"} size="sm">
              Sekolah
            </Button>
          </Link>
          <Link href="/dashboard/contact">
            <Button variant={currentPage === "contact" ? "default" : "outline"} size="sm">
              Kontak
            </Button>
          </Link>
          <Link href="/dashboard/admissions">
            <Button variant={currentPage === "admissions" ? "default" : "outline"} size="sm">
              SPMB
            </Button>
          </Link>
          <Link href="/dashboard/messages">
            <Button variant={currentPage === "messages" ? "default" : "outline"} size="sm">
              Pesan
            </Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Lihat Situs</Button>
          </Link>
        </div>
      </header>

      {children}

      <DashboardMobileNav />
    </main>
  )
}
