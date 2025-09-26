"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  School,
  Users,
  Building2,
  BookOpen,
  GraduationCap,
  UserCheck,
  HelpCircle,
  Settings,
  Plus,
  Edit,
  Eye,
} from "lucide-react"
import Link from "next/link"

const dashboardStats = [
  {
    title: "Profil Sekolah",
    description: "Informasi dasar sekolah",
    icon: School,
    href: "/admin/profil",
    status: "Lengkap",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Struktur Organisasi",
    description: "Kepemimpinan dan staff",
    icon: Users,
    href: "/admin/struktur",
    count: "25 orang",
    status: "Perlu Update",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    title: "Fasilitas",
    description: "Sarana dan prasarana",
    icon: Building2,
    href: "/admin/fasilitas",
    count: "12 fasilitas",
    status: "Lengkap",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Mata Pelajaran",
    description: "Kurikulum dan mapel",
    icon: BookOpen,
    href: "/admin/mata-pelajaran",
    count: "15 mapel",
    status: "Lengkap",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Program",
    description: "Program unggulan sekolah",
    icon: GraduationCap,
    href: "/admin/program",
    count: "8 program",
    status: "Lengkap",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Registrasi",
    description: "Gelombang dan jalur PPDB",
    icon: UserCheck,
    href: "/admin/registrasi",
    count: "4 gelombang",
    status: "Aktif",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    title: "FAQ",
    description: "Pertanyaan yang sering diajukan",
    icon: HelpCircle,
    href: "/admin/faq",
    count: "20 FAQ",
    status: "Lengkap",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Pengaturan",
    description: "Konfigurasi sistem",
    icon: Settings,
    href: "/admin/pengaturan",
    status: "Default",
    statusColor: "bg-gray-100 text-gray-800",
  },
]

const quickActions = [
  {
    title: "Tambah Pengumuman",
    description: "Buat pengumuman baru untuk website",
    icon: Plus,
    href: "/admin/pengumuman/baru",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    title: "Edit Profil Sekolah",
    description: "Update informasi dasar sekolah",
    icon: Edit,
    href: "/admin/profil",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Lihat Website",
    description: "Preview website yang sudah dipublish",
    icon: Eye,
    href: "/",
    color: "bg-purple-500 hover:bg-purple-600",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Kelola konten website SMP IT Masjid Syuhada</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <action.icon className="h-5 w-5 text-muted-foreground" />
                <Button size="sm" className={action.color} asChild>
                  <Link href={action.href}>Aksi</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Management Overview */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Manajemen Konten</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  {stat.count && <p className="text-sm font-medium">{stat.count}</p>}
                  <div className="flex items-center justify-between">
                    <Badge className={stat.statusColor}>{stat.status}</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={stat.href}>Kelola</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>Update terbaru pada konten website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profil sekolah diperbarui</p>
                <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Fasilitas baru ditambahkan</p>
                <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">FAQ diperbarui</p>
                <p className="text-xs text-muted-foreground">3 hari yang lalu</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
