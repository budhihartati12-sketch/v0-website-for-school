"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DashboardMobileNav } from "@/components/site/dashboard-mobile-nav"

const FormSchemaEditor = dynamic(
  () => import("@/components/admin/form-schema-editor").then((m: any) => m.default ?? m),
  { ssr: false },
)

function useTabParam() {
  const router = useRouter()
  const params = useSearchParams()
  // default now 'spmb'
  const current = params.get("tab") || "spmb"
  const setTab = React.useCallback(
    (tab: string) => {
      const qp = new URLSearchParams(params.toString())
      qp.set("tab", tab)
      if (tab !== "spmb") {
        qp.delete("sub")
      } else if (!qp.get("sub")) {
        qp.set("sub", "form")
      }
      router.push(`/dashboard?${qp.toString()}`)
    },
    [params, router],
  )
  return { current, setTab }
}

function useSubParam() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get("sub") || "form"
  const setSub = React.useCallback(
    (sub: "form" | "table") => {
      const qp = new URLSearchParams(params.toString())
      qp.set("tab", "spmb")
      qp.set("sub", sub)
      router.push(`/dashboard?${qp.toString()}`)
    },
    [params, router],
  )
  return { current, setSub }
}

class ClientErrorBoundary extends React.Component<
  { fallback?: React.ReactNode; children?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: any) {
    console.log("[v0] Error in child:", error?.message || error)
  }
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="text-sm text-muted-foreground">Terjadi kesalahan saat memuat komponen ini.</div>
        )
      )
    }
    return this.props.children as any
  }
}

export default function DashboardPage() {
  const { current, setTab } = useTabParam()
  const { current: sub, setSub } = useSubParam()

  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <header className="mb-4 hidden items-center justify-between md:flex">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard Pengelolaan Website Sekolah</h1>
          <p className="text-sm text-muted-foreground">
            Kelola profil sekolah, fasilitas, kontak, jam operasional, dan SPMB.
          </p>
        </div>
        <Link href="/">
          <Button variant="secondary">Lihat Situs</Button>
        </Link>
      </header>

      <nav aria-label="Dashboard sections" className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {[
            { key: "profile", label: "Profil" },
            { key: "about", label: "Tentang" },
            { key: "organization", label: "Struktur" },
            { key: "facility", label: "Fasilitas" },
            { key: "contact", label: "Kontak & Jam" },
            { key: "spmb", label: "SPMB" },
            { key: "messages", label: "Pesan" },
          ].map((item) => {
            const href = `/dashboard?tab=${item.key}`
            const isActive = current === item.key
            return (
              <li key={item.key}>
                <Link
                  href={href}
                  onClick={(e) => {
                    e.preventDefault()
                    setTab(item.key)
                  }}
                  className={cn(
                    "inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Tabs value={current} onValueChange={setTab} className="w-full h-full flex flex-col">
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil Sekolah</CardTitle>
              <CardDescription>Atur informasi utama profil sekolah.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Nama Sekolah</label>
                <Input placeholder="SMP Syuhada" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Tahun Berdiri</label>
                <Input placeholder="1995" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Profil Singkat</label>
                <Textarea placeholder="Deskripsi singkat sekolah..." className="min-h-28" />
              </div>
              <div className="flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Visi & Misi</CardTitle>
              <CardDescription>Perbarui narasi visi dan misi.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Visi</label>
                <Textarea placeholder="Visi sekolah..." className="min-h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Misi</label>
                <Textarea placeholder="Misi sekolah..." className="min-h-32" />
              </div>
              <div className="flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Struktur Organisasi</CardTitle>
              <CardDescription>Kelola struktur organisasi (mock data).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Kepala Sekolah</label>
                  <Input placeholder="Nama Kepala Sekolah" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Wakil Kepala</label>
                  <Input placeholder="Nama Wakil" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Kepala Kurikulum</label>
                  <Input placeholder="Nama" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Kesiswaan</label>
                  <Input placeholder="Nama" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facility">
          <Card>
            <CardHeader>
              <CardTitle>Fasilitas</CardTitle>
              <CardDescription>Kelola fasilitas dan ketersediaannya (mock data).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-3 gap-4">
                <FacilityItem label="Laboratorium" />
                <FacilityItem label="Perpustakaan" />
                <FacilityItem label="Lapangan Olahraga" />
              </div>
              <div className="flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Kontak & Jam Operasional</CardTitle>
              <CardDescription>Atur informasi kontak dan jam buka.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Alamat</label>
                <Textarea placeholder="Alamat lengkap..." className="min-h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Telepon</label>
                <Input placeholder="021-xxxxxxx" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="info@sekolah.sch.id" type="email" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Jam Operasional</label>
                <Input placeholder="Senin–Jumat, 07:00–15:00" />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button>Simpan</Button>
                <Button variant="outline">Batal</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spmb">
          <Card>
            <CardHeader>
              <CardTitle>SPMB</CardTitle>
              <CardDescription>Kelola Formulir Online dan Data Pendaftar.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-2">
                <Button variant={sub === "form" ? "default" : "outline"} size="sm" onClick={() => setSub("form")}>
                  Kelola Formulir Online
                </Button>
                <Button variant={sub === "table" ? "default" : "outline"} size="sm" onClick={() => setSub("table")}>
                  Data Pendaftar
                </Button>
              </div>

              {sub === "form" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Skema Formulir Online</CardTitle>
                    <CardDescription>Atur field formulir pendaftaran (dinamis, mock).</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClientErrorBoundary
                      fallback={<div className="text-sm text-destructive">Gagal memuat editor formulir.</div>}
                    >
                      <FormSchemaEditor />
                    </ClientErrorBoundary>
                  </CardContent>
                </Card>
              )}

              {sub === "table" && <ApplicantsTable />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="h-full flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Pesan Masuk</CardTitle>
              <CardDescription>Pesan dari halaman Kontak.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <MessagesPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DashboardMobileNav />
    </main>
  )
}

function FacilityItem({ label }: { label: string }) {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Tersedia</label>
          <Input type="checkbox" className="h-4 w-4" />
        </div>
      </div>
    </div>
  )
}

function ApplicantsTable() {
  const Dyn = React.useMemo(
    () => dynamic(() => import("@/components/admin/applicants-table"), { ssr: false }),
    [],
  ) as any
  return <Dyn />
}

function MessagesPanel() {
  const Dyn = React.useMemo(() => dynamic(() => import("@/components/admin/messages-panel"), { ssr: false }), []) as any
  return <Dyn />
}
