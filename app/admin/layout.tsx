"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  School,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  UserCheck,
  HelpCircle,
  Settings,
  Menu,
  Home,
  LogOut,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Profil Sekolah",
    href: "/admin/profil",
    icon: School,
  },
  {
    title: "Struktur Organisasi",
    href: "/admin/struktur",
    icon: Users,
  },
  {
    title: "Fasilitas",
    href: "/admin/fasilitas",
    icon: Building2,
  },
  {
    title: "Mata Pelajaran",
    href: "/admin/mata-pelajaran",
    icon: BookOpen,
  },
  {
    title: "Program",
    href: "/admin/program",
    icon: GraduationCap,
  },
  {
    title: "Registrasi",
    href: "/admin/registrasi",
    icon: UserCheck,
  },
  {
    title: "FAQ",
    href: "/admin/faq",
    icon: HelpCircle,
  },
  {
    title: "Pengaturan",
    href: "/admin/pengaturan",
    icon: Settings,
  },
]

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 py-2">
            <School className="h-6 w-6 text-emerald-600" />
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <div className="space-y-1 mt-4">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <School className="h-6 w-6 text-emerald-600" />
              <span className="text-emerald-900">SMP IT Syuhada</span>
            </Link>
          </div>
          <ScrollArea className="flex-1">
            <Sidebar />
          </ScrollArea>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex items-center gap-2 px-4 py-2">
                <School className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-semibold text-emerald-900">SMP IT Syuhada</span>
              </div>
              <ScrollArea className="flex-1">
                <Sidebar />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Lihat Website
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
