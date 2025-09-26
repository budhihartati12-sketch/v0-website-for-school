import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SchoolHubPage() {
  const items = [
    { href: "/profil", title: "Profil" },
    { href: "/akademik", title: "Akademik" },
    { href: "/staff", title: "Staff & Pengajar" },
    { href: "/fasilitas", title: "Fasilitas" },
    { href: "/spmb", title: "SPMB" },
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 pb-20 md:pb-6">
      <h1 className="mb-4 text-balance text-2xl font-bold md:text-3xl">Menu Sekolah</h1>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((it) => (
          <Link key={it.href} href={it.href}>
            <Card className="transition-colors hover:bg-accent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{it.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Buka halaman {it.title}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
