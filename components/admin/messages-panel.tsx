"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Maximize2, Minimize2 } from "lucide-react"

type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  createdAt: string
  status: "new" | "read"
}

type ColKey = "time" | "name" | "email" | "phone" | "subject" | "message" | "status" | "actions"
const allColumns: { key: ColKey; label: string }[] = [
  { key: "time", label: "Waktu" },
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telepon" },
  { key: "subject", label: "Subjek" },
  { key: "message", label: "Pesan" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aksi" },
]

export default function MessagesPanel() {
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<"all" | "new" | "read">("all")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [visibleCols, setVisibleCols] = React.useState<Record<ColKey, boolean>>({
    time: true,
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
    status: true,
    actions: true,
  })
  const [isMaximized, setIsMaximized] = React.useState(false)

  function toggleColumn(col: ColKey) {
    setVisibleCols((prev) => {
      const next = { ...prev, [col]: !prev[col] }
      const count = Object.values(next).filter(Boolean).length
      if (count === 0) return prev
      return next
    })
  }

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("contact_messages")
      let list = raw ? (JSON.parse(raw) as ContactMessage[]) : []

      if (!Array.isArray(list) || list.length === 0) {
        const seeded = seedMockMessages()
        localStorage.setItem("contact_messages", JSON.stringify(seeded))
        list = seeded
      }

      setMessages(list)
      // do not auto-select; keep preview hidden until user picks one
      setSelectedId(null)
    } catch {
      setMessages([])
      setSelectedId(null)
    }

    try {
      const rawCols = localStorage.getItem("inbox_visible_cols")
      if (rawCols) {
        const stored = JSON.parse(rawCols) as Partial<Record<ColKey, boolean>>
        setVisibleCols((prev) => ({ ...prev, ...stored }))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("inbox_visible_cols", JSON.stringify(visibleCols))
    } catch {
      // ignore
    }
  }, [visibleCols])

  function persist(next: ContactMessage[]) {
    localStorage.setItem("contact_messages", JSON.stringify(next))
    setMessages(next)
    if (selectedId && !next.find((m) => m.id === selectedId)) {
      setSelectedId(next[0]?.id ?? null)
    }
  }

  function toggleRead(id: string) {
    const next = messages.map((m) => (m.id === id ? { ...m, status: m.status === "new" ? "read" : "new" } : m))
    persist(next)
  }

  function remove(id: string) {
    const next = messages.filter((m) => m.id !== id)
    persist(next)
  }

  const filtered = messages.filter((m) => {
    const q = query.toLowerCase()
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    const matchS = status === "all" ? true : m.status === status
    return matchQ && matchS
  })

  const selected = selectedId
    ? (filtered.find((m) => m.id === selectedId) ?? messages.find((m) => m.id === selectedId))
    : null

  const visibleCount = Object.values(visibleCols).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Cari (nama, email, subjek, isi)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full md:w-80"
            aria-label="Cari pesan"
          />
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="all">Semua</option>
            <option value="new">Baru</option>
            <option value="read">Dibaca</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 bg-transparent">
                Pilih Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {allColumns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={visibleCols[c.key]}
                  onCheckedChange={() => toggleColumn(c.key)}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="h-9 bg-transparent" onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filtered.length} / {messages.length}
        </div>
      </div>

      {/* Mobile: stacked list and preview */}
      <div className="md:hidden space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                {visibleCols.time && <th className="text-left py-2 px-2">Waktu</th>}
                {visibleCols.name && <th className="text-left py-2 px-2">Nama</th>}
                {visibleCols.email && <th className="text-left py-2 px-2">Email</th>}
                {visibleCols.phone && <th className="text-left py-2 px-2">Telepon</th>}
                {visibleCols.subject && <th className="text-left py-2 px-2">Subjek</th>}
                {visibleCols.message && <th className="text-left py-2 px-2">Pesan</th>}
                {visibleCols.status && <th className="text-left py-2 px-2">Status</th>}
                {visibleCols.actions && <th className="text-left py-2 px-2">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                    Belum ada pesan.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                    onClick={() => setSelectedId(m.id)}
                  >
                    {visibleCols.time && (
                      <td className="py-2 px-2 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                    )}
                    {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                    {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                    {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                    {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                    {visibleCols.message && (
                      <td className="py-2 px-2 max-w-[360px]">
                        <div className="line-clamp-3 text-pretty">{m.message}</div>
                      </td>
                    )}
                    {visibleCols.status && (
                      <td className="py-2 px-2">
                        <span
                          className={
                            m.status === "new"
                              ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-primary"
                              : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-muted-foreground"
                          }
                        >
                          {m.status === "new" ? "Baru" : "Dibaca"}
                        </span>
                      </td>
                    )}
                    {visibleCols.actions && (
                      <td className="py-2 px-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRead(m.id)
                            }}
                          >
                            {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              remove(m.id)
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Preview below list */}
        {selected ? (
          <div className="rounded-md border p-4">
            <PreviewMessage
              m={selected}
              onToggle={() => toggleRead(selected.id)}
              onDelete={() => remove(selected.id)}
              onToggleMaximize={() => setIsMaximized((v) => !v)}
              isMaximized={isMaximized}
            />
          </div>
        ) : null}
      </div>

      {/* Desktop: resizable split */}
      <div className="hidden md:block">
        <div className="rounded-md border h-[70vh] overflow-hidden">
          {isMaximized && selected ? (
            // Maximized reading view: only preview, full width
            <div className="h-full p-4 overflow-auto">
              <div className="h-full rounded-md border p-4">
                <PreviewMessage
                  m={selected}
                  onToggle={() => toggleRead(selected.id)}
                  onDelete={() => remove(selected.id)}
                  onToggleMaximize={() => setIsMaximized(false)}
                  isMaximized={true}
                />
              </div>
            </div>
          ) : selected ? (
            // Split view with list and preview
            <ResizablePanelGroup direction="horizontal" className="h-full w-full">
              <ResizablePanel defaultSize={58} minSize={28}>
                <div className="h-full overflow-auto p-3">
                  <table className="min-w-[900px] w-full text-sm">
                    <thead className="text-muted-foreground">
                      <tr className="border-b">
                        {visibleCols.time && <th className="text-left py-2 px-2">Waktu</th>}
                        {visibleCols.name && <th className="text-left py-2 px-2">Nama</th>}
                        {visibleCols.email && <th className="text-left py-2 px-2">Email</th>}
                        {visibleCols.phone && <th className="text-left py-2 px-2">Telepon</th>}
                        {visibleCols.subject && <th className="text-left py-2 px-2">Subjek</th>}
                        {visibleCols.message && <th className="text-left py-2 px-2">Pesan</th>}
                        {visibleCols.status && <th className="text-left py-2 px-2">Status</th>}
                        {visibleCols.actions && <th className="text-left py-2 px-2">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                            Belum ada pesan.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((m) => (
                          <tr
                            key={m.id}
                            className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                            onClick={() => setSelectedId(m.id)}
                          >
                            {visibleCols.time && (
                              <td className="py-2 px-2 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                            )}
                            {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                            {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                            {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                            {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                            {visibleCols.message && (
                              <td className="py-2 px-2 max-w-[360px]">
                                <div className="line-clamp-3 text-pretty">{m.message}</div>
                              </td>
                            )}
                            {visibleCols.status && (
                              <td className="py-2 px-2">
                                <span
                                  className={
                                    m.status === "new"
                                      ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                      : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                  }
                                >
                                  {m.status === "new" ? "Baru" : "Dibaca"}
                                </span>
                              </td>
                            )}
                            {visibleCols.actions && (
                              <td className="py-2 px-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleRead(m.id)
                                    }}
                                  >
                                    {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      remove(m.id)
                                    }}
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-border" />

              <ResizablePanel defaultSize={42} minSize={24}>
                <div className="h-full p-4 overflow-auto">
                  <div className="h-full rounded-md border p-4">
                    <PreviewMessage
                      m={selected}
                      onToggle={() => toggleRead(selected.id)}
                      onDelete={() => remove(selected.id)}
                      onToggleMaximize={() => setIsMaximized(true)}
                      isMaximized={false}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            // No selection: show list only
            <div className="h-full">
              <div className="h-full overflow-auto p-3">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="text-muted-foreground">
                    <tr className="border-b">
                      {visibleCols.time && <th className="text-left py-2 px-2">Waktu</th>}
                      {visibleCols.name && <th className="text-left py-2 px-2">Nama</th>}
                      {visibleCols.email && <th className="text-left py-2 px-2">Email</th>}
                      {visibleCols.phone && <th className="text-left py-2 px-2">Telepon</th>}
                      {visibleCols.subject && <th className="text-left py-2 px-2">Subjek</th>}
                      {visibleCols.message && <th className="text-left py-2 px-2">Pesan</th>}
                      {visibleCols.status && <th className="text-left py-2 px-2">Status</th>}
                      {visibleCols.actions && <th className="text-left py-2 px-2">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                          Belum ada pesan.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((m) => (
                        <tr
                          key={m.id}
                          className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                          onClick={() => setSelectedId(m.id)}
                        >
                          {visibleCols.time && (
                            <td className="py-2 px-2 whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                          )}
                          {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                          {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                          {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                          {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                          {visibleCols.message && (
                            <td className="py-2 px-2 max-w-[360px]">
                              <div className="line-clamp-3 text-pretty">{m.message}</div>
                            </td>
                          )}
                          {visibleCols.status && (
                            <td className="py-2 px-2">
                              <span
                                className={
                                  m.status === "new"
                                    ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                    : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                }
                              >
                                {m.status === "new" ? "Baru" : "Dibaca"}
                              </span>
                            </td>
                          )}
                          {visibleCols.actions && (
                            <td className="py-2 px-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRead(m.id)
                                  }}
                                >
                                  {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    remove(m.id)
                                  }}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewMessage({
  m,
  onToggle,
  onDelete,
  onToggleMaximize,
  isMaximized,
}: {
  m: {
    id: string
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    createdAt: string
    status: "new" | "read"
  }
  onToggle: () => void
  onDelete: () => void
  onToggleMaximize: () => void
  isMaximized: boolean
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{m.subject || "Tanpa Subjek"}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden md:inline-flex bg-transparent"
              onClick={onToggleMaximize}
              aria-label={isMaximized ? "Kembalikan tampilan" : "Perbesar tampilan baca"}
              title={isMaximized ? "Kembalikan" : "Perbesar"}
            >
              {isMaximized ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>
            <span
              className={
                m.status === "new"
                  ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              }
            >
              {m.status === "new" ? "Baru" : "Dibaca"}
            </span>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {new Date(m.createdAt).toLocaleString()} • {m.name} • {m.email} {m.phone ? `• ${m.phone}` : ""}
        </div>
      </div>
      <div className="mt-4 flex-1 overflow-auto">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.message}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={onToggle}>
          {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          Hapus
        </Button>
      </div>
    </div>
  )
}

function seedMockMessages(): ContactMessage[] {
  const now = Date.now()
  const id = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)

  const items: ContactMessage[] = [
    {
      id: id(),
      name: "Ahmad Fauzi",
      email: "ahmad@example.com",
      phone: "081234567890",
      subject: "Informasi Pendaftaran",
      message:
        "Assalamualaikum, saya ingin menanyakan jadwal pendaftaran dan persyaratan dokumen yang harus disiapkan. Terima kasih.",
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
      status: "new",
    },
    {
      id: id(),
      name: "Siti Rahma",
      email: "siti.rahma@example.com",
      phone: "082233445566",
      subject: "Kunjungan Sekolah",
      message: "Apakah saya bisa melakukan kunjungan sekolah minggu depan? Mohon informasi hari dan jam yang tersedia.",
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      status: "read",
    },
    {
      id: id(),
      name: "Budi Setiawan",
      email: "budi.s@example.com",
      subject: "Beasiswa",
      message: "Apakah tersedia program beasiswa untuk siswa berprestasi? Jika ada, bagaimana prosedurnya?",
      createdAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      status: "new",
    },
    {
      id: id(),
      name: "Dewi Lestari",
      email: "dewi.lestari@example.com",
      phone: "08199887766",
      subject: "Kegiatan Ekstrakurikuler",
      message: "Saya ingin mengetahui daftar kegiatan ekstrakurikuler yang tersedia beserta jadwalnya.",
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
      status: "read",
    },
  ]
  return items
}
