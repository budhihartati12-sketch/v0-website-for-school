"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Users, 
  Calendar,
  Settings,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  BookOpen,
  School,
  Building,
  Globe,
  MessageSquare
} from "lucide-react"

// Custom hook untuk tab query
function useTabParam() {
  const [searchParams, setSearchParams] = React.useState<URLSearchParams>()
  const [current, setCurrent] = React.useState("forms")

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSearchParams(params)
    const tab = params.get("tab") || "forms"
    setCurrent(tab)
  }, [])

  const setTab = React.useCallback((tab: string) => {
    setCurrent(tab)
    if (searchParams) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set("tab", tab)
      window.history.replaceState({}, "", `?${newParams.toString()}`)
    }
  }, [searchParams])

  return { current, setTab }
}

// Mock data untuk pendaftar
const mockApplicants = [
  {
    id: "1",
    name: "Ahmad Fauzi",
    email: "ahmad@example.com",
    phone: "081234567890",
    school: "SD Negeri 1 Yogyakarta",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    documents: ["KTP", "Ijazah", "Foto"]
  },
  {
    id: "2",
    name: "Siti Rahma",
    email: "siti@example.com", 
    phone: "081234567891",
    school: "SD Muhammadiyah 1",
    status: "approved",
    submittedAt: "2024-01-14T14:20:00Z",
    documents: ["KTP", "Ijazah", "Foto", "SKHUN"]
  },
  {
    id: "3",
    name: "Budi Setiawan",
    email: "budi@example.com",
    phone: "081234567892", 
    school: "SD Islam Terpadu",
    status: "rejected",
    submittedAt: "2024-01-13T09:15:00Z",
    documents: ["KTP", "Ijazah"]
  }
]

export default function SPMBPage() {
  const { current, setTab } = useTabParam()
  const [applicants] = React.useState(mockApplicants)

  return (
    <div className="space-y-6">
      <nav aria-label="SPMB sections" className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {[
            { key: "forms", label: "Formulir" },
            { key: "applicants", label: "Pendaftar" },
            { key: "settings", label: "Pengaturan" },
            { key: "reports", label: "Laporan" },
          ].map((item) => {
            const isActive = current === item.key
            return (
              <li key={item.key}>
                <button
                  onClick={() => setTab(item.key)}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <Tabs value={current} onValueChange={setTab} className="w-full">
        {/* Formulir Pendaftaran */}
        <TabsContent value="forms">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Formulir Pendaftaran
                </CardTitle>
                <CardDescription>Kelola formulir pendaftaran siswa baru</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-title">Judul Formulir</Label>
                    <Input id="form-title" placeholder="Formulir Pendaftaran SMP Syuhada 2024/2025" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Tahun Ajaran</Label>
                    <Input id="academic-year" placeholder="2024/2025" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-period">Periode Pendaftaran</Label>
                    <Input id="registration-period" placeholder="1 Januari - 31 Maret 2024" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota">Kuota Siswa</Label>
                    <Input id="quota" placeholder="150 Siswa" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Persyaratan Pendaftaran</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="age-requirement">Syarat Usia</Label>
                      <Input id="age-requirement" placeholder="Minimal 12 tahun per 1 Juli 2024" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education-requirement">Syarat Pendidikan</Label>
                      <Input id="education-requirement" placeholder="Lulus SD/MI atau sederajat" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documents-required">Dokumen Wajib</Label>
                      <Textarea 
                        id="documents-required" 
                        placeholder="1. Fotokopi KTP Orang Tua&#10;2. Fotokopi Akta Kelahiran&#10;3. Fotokopi Ijazah SD/MI&#10;4. Fotokopi SKHUN&#10;5. Pas Foto 3x4 (4 lembar)"
                        rows={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additional-requirements">Persyaratan Tambahan</Label>
                      <Textarea 
                        id="additional-requirements" 
                        placeholder="1. Surat Keterangan Sehat dari Dokter&#10;2. Surat Keterangan Kelakuan Baik&#10;3. Surat Pernyataan Orang Tua"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pengaturan Formulir
                </CardTitle>
                <CardDescription>Konfigurasi formulir pendaftaran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-status">Status Formulir</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-approval">Persetujuan Otomatis</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="enabled">Diaktifkan</option>
                      <option value="disabled">Dinonaktifkan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Email Notifikasi</Label>
                    <Input id="notification-email" placeholder="admin@smp-syuhada.sch.id" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">Ukuran File Maksimal</Label>
                    <Input id="max-file-size" placeholder="5 MB" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>Simpan Pengaturan</Button>
                  <Button variant="outline">Reset ke Default</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Pendaftar */}
        <TabsContent value="applicants">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Data Pendaftar
                </CardTitle>
                <CardDescription>Kelola data calon siswa yang mendaftar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Cari pendaftar..." className="w-64" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select className="p-2 border rounded-md">
                      <option value="all">Semua Status</option>
                      <option value="pending">Menunggu</option>
                      <option value="approved">Disetujui</option>
                      <option value="rejected">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 p-3 text-left">No</th>
                        <th className="border border-gray-200 p-3 text-left">Nama</th>
                        <th className="border border-gray-200 p-3 text-left">Email</th>
                        <th className="border border-gray-200 p-3 text-left">Telepon</th>
                        <th className="border border-gray-200 p-3 text-left">Asal Sekolah</th>
                        <th className="border border-gray-200 p-3 text-left">Status</th>
                        <th className="border border-gray-200 p-3 text-left">Tanggal Daftar</th>
                        <th className="border border-gray-200 p-3 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant, index) => (
                        <tr key={applicant.id}>
                          <td className="border border-gray-200 p-3">{index + 1}</td>
                          <td className="border border-gray-200 p-3 font-medium">{applicant.name}</td>
                          <td className="border border-gray-200 p-3">{applicant.email}</td>
                          <td className="border border-gray-200 p-3">{applicant.phone}</td>
                          <td className="border border-gray-200 p-3">{applicant.school}</td>
                          <td className="border border-gray-200 p-3">
                            <Badge 
                              variant={applicant.status === "approved" ? "default" : 
                                      applicant.status === "rejected" ? "destructive" : "secondary"}
                            >
                              {applicant.status === "approved" ? "Disetujui" :
                               applicant.status === "rejected" ? "Ditolak" : "Menunggu"}
                            </Badge>
                          </td>
                          <td className="border border-gray-200 p-3">
                            {new Date(applicant.submittedAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="border border-gray-200 p-3">
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan {applicants.length} dari {applicants.length} pendaftar
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pengaturan SPMB */}
        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pengaturan Umum
                </CardTitle>
                <CardDescription>Konfigurasi sistem SPMB</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">Nama Sistem</Label>
                    <Input id="system-name" placeholder="SPMB SMP Syuhada" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Administrator</Label>
                    <Input id="admin-email" placeholder="admin@smp-syuhada.sch.id" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Frekuensi Backup</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="daily">Harian</option>
                      <option value="weekly">Mingguan</option>
                      <option value="monthly">Bulanan</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Retensi Data</Label>
                    <Input id="data-retention" placeholder="5 Tahun" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notifikasi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Notifikasi Email</Label>
                        <p className="text-sm text-muted-foreground">Kirim notifikasi via email</p>
                      </div>
                      <input type="checkbox" id="email-notifications" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-notifications">Notifikasi SMS</Label>
                        <p className="text-sm text-muted-foreground">Kirim notifikasi via SMS</p>
                      </div>
                      <input type="checkbox" id="sms-notifications" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-reminders">Pengingat Otomatis</Label>
                        <p className="text-sm text-muted-foreground">Kirim pengingat otomatis</p>
                      </div>
                      <input type="checkbox" id="auto-reminders" className="rounded" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Laporan */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Laporan SPMB
                </CardTitle>
                <CardDescription>Generate dan kelola laporan pendaftaran</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-sm text-muted-foreground">Total Pendaftar</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">142</p>
                          <p className="text-sm text-muted-foreground">Disetujui</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-8 w-8 text-yellow-500" />
                        <div>
                          <p className="text-2xl font-bold">14</p>
                          <p className="text-sm text-muted-foreground">Menunggu</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Generate Laporan</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Jenis Laporan</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="summary">Ringkasan Pendaftaran</option>
                        <option value="detailed">Detail Pendaftar</option>
                        <option value="statistics">Statistik</option>
                        <option value="export">Export Data</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-period">Periode</Label>
                      <Input id="report-period" placeholder="Januari - Maret 2024" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-format">Format</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-status">Status</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="all">Semua</option>
                        <option value="approved">Disetujui</option>
                        <option value="pending">Menunggu</option>
                        <option value="rejected">Ditolak</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Laporan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
