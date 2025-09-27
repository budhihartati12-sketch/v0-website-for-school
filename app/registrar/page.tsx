"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Status = "pending" | "approved" | "declined"
interface Applicant {
  id: string
  name: string
  email: string
  status: Status
  createdAt: string
}

const STORAGE_KEY = "registrar_applicants"

function findApplicant(id: string): Applicant | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const list: Applicant[] = JSON.parse(raw)
    return list.find((a) => a.id === id) ?? null
  } catch {
    return null
  }
}

export default function RegistrarStatusPage() {
  const params = useSearchParams()
  const router = useRouter()
  const idParam = params.get("id") || ""
  const [query, setQuery] = React.useState(idParam)
  const [result, setResult] = React.useState<Applicant | null>(null)
  const [notFound, setNotFound] = React.useState(false)

  React.useEffect(() => {
    if (idParam) {
      const found = findApplicant(idParam)
      setResult(found)
      setNotFound(!found)
    } else {
      setResult(null)
      setNotFound(false)
    }
  }, [idParam])

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/registrar?id=${encodeURIComponent(query.trim())}`)
  }

  const statusText =
    result?.status === "approved" ? "disetujui" : result?.status === "declined" ? "tertolak" : "sedang di tinjau"

  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-balance">Cek Status Pendaftaran</CardTitle>
          <CardDescription>Masukkan nomor pendaftar untuk melihat status SPMB Anda.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={onSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input
              inputMode="search"
              placeholder="Masukkan No. Pendaftar (mis. REG-2025-0001)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="shrink-0">
              Cari
            </Button>
          </form>

          {!idParam && (
            <div className="text-xs text-muted-foreground">
              Contoh nomor: <span className="font-mono">REG-2025-0001</span>
            </div>
          )}

          {idParam && notFound && (
            <div className="rounded-md border border-dashed p-4 text-sm">
              Nomor pendaftar <span className="font-mono">{idParam}</span> tidak ditemukan.
              <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Input placeholder="Cari nomor lain..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button onClick={onSearch} className="shrink-0">
                  Cari
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  Nomor pendaftar: <span className="font-mono">{result.id}</span>
                </div>
                <Badge
                  variant={
                    result.status === "approved"
                      ? "default"
                      : result.status === "declined"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {statusText}
                </Badge>
              </div>
              <div className="text-sm">
                Nama: <span className="font-medium">{result.name}</span>
              </div>
              <div className="text-sm">
                Email: <span className="font-medium">{result.email}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Diperbarui: {new Date(result.createdAt).toLocaleString()}
              </div>
              <div>
                <Button variant="outline" onClick={() => router.push("/registrar")}>
                  Cari Nomor Lain
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
