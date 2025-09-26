"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { isAuthenticated, logout, getAdminUser } from "@/lib/auth"
import { Users, Building, Phone, Clock, Calendar, Settings, LogOut, Edit, Plus, Trash2, Save, Eye } from "lucide-react"

const mockSchoolData = {
  profile: {
    name: "SMP IT Masjid Syuhada",
    foundedYear: "2010",
    address: "Jl. Masjid Syuhada No. 123, Yogyakarta",
    phone: "0274-123456",
    email: "info@smpitsyuhada.sch.id",
    website: "www.smpitsyuhada.sch.id",
  },
  visionMission: {
    vision:
      "Menjadi lembaga pendidikan Islam terpadu yang unggul dalam prestasi, berakhlak mulia, dan berwawasan global.",
    mission: [
      "Menyelenggarakan pendidikan Islam terpadu yang berkualitas",
      "Membentuk generasi yang beriman, bertakwa, dan berakhlak mulia",
      "Mengembangkan potensi siswa secara optimal",
      "Menciptakan lingkungan belajar yang kondusif dan Islami",
    ],
  },
  facilities: [
    { id: 1, name: "Masjid", description: "Masjid untuk kegiatan ibadah dan pembelajaran agama", status: "Tersedia" },
    { id: 2, name: "Laboratorium Komputer", description: "Lab komputer dengan 30 unit PC", status: "Tersedia" },
    { id: 3, name: "Perpustakaan", description: "Perpustakaan dengan koleksi 5000+ buku", status: "Tersedia" },
    { id: 4, name: "Lapangan Olahraga", description: "Lapangan serbaguna untuk berbagai olahraga", status: "Tersedia" },
  ],
  operatingHours: {
    weekdays: "07:00 - 14:30",
    saturday: "07:00 - 11:00",
    sunday: "Libur",
  },
  organizationStructure: [
    { position: "Kepala Sekolah", name: "Drs. Ahmad Fauzi, M.Pd", photo: "/placeholder.svg?height=100&width=100" },
    { position: "Wakil Kepala Sekolah", name: "Siti Nurhaliza, S.Pd", photo: "/placeholder.svg?height=100&width=100" },
    { position: "Kepala TU", name: "Budi Santoso, S.E", photo: "/placeholder.svg?height=100&width=100" },
  ],
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [schoolData, setSchoolData] = useState(mockSchoolData)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
    setUser(getAdminUser())
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSave = (section: string, data: any) => {
    setSchoolData((prev) => ({
      ...prev,
      [section]: data,
    }))
    setEditingSection(null)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">SMP IT Masjid Syuhada</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold text-gray-900">240</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fasilitas</p>
                  <p className="text-2xl font-bold text-gray-900">{schoolData.facilities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tahun Berdiri</p>
                  <p className="text-2xl font-bold text-gray-900">{schoolData.profile.foundedYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className="bg-green-100 text-green-800">Aktif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="vision">Visi Misi</TabsTrigger>
            <TabsTrigger value="structure">Struktur</TabsTrigger>
            <TabsTrigger value="facilities">Fasilitas</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="forms">Formulir</TabsTrigger>
          </TabsList>

          {/* Profile Management */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Profil Sekolah</CardTitle>
                    <CardDescription>Kelola informasi dasar sekolah</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection(editingSection === "profile" ? null : "profile")}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editingSection === "profile" ? "Batal" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nama Sekolah</label>
                    <p className="mt-1 text-sm text-gray-900">{schoolData.profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tahun Berdiri</label>
                    <p className="mt-1 text-sm text-gray-900">{schoolData.profile.foundedYear}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Alamat</label>
                    <p className="mt-1 text-sm text-gray-900">{schoolData.profile.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Telepon</label>
                    <p className="mt-1 text-sm text-gray-900">{schoolData.profile.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{schoolData.profile.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vision Mission Management */}
          <TabsContent value="vision">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Visi & Misi</CardTitle>
                    <CardDescription>Kelola visi dan misi sekolah</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visi</h3>
                  <p className="text-gray-700">{schoolData.visionMission.vision}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Misi</h3>
                  <ul className="space-y-2">
                    {schoolData.visionMission.mission.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-semibold">{index + 1}.</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Structure */}
          <TabsContent value="structure">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Struktur Organisasi</CardTitle>
                    <CardDescription>Kelola struktur organisasi sekolah</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolData.organizationStructure.map((person, index) => (
                    <Card key={index} className="border-2">
                      <CardContent className="p-4 text-center">
                        <img
                          src={person.photo || "/placeholder.svg"}
                          alt={person.name}
                          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                        />
                        <h4 className="font-semibold text-gray-900">{person.name}</h4>
                        <p className="text-sm text-gray-600">{person.position}</p>
                        <div className="flex justify-center gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facilities Management */}
          <TabsContent value="facilities">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Fasilitas Sekolah</CardTitle>
                    <CardDescription>Kelola fasilitas yang tersedia</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Fasilitas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schoolData.facilities.map((facility) => (
                    <div key={facility.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{facility.name}</h4>
                        <p className="text-sm text-gray-600">{facility.description}</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">{facility.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact & Hours */}
          <TabsContent value="contact">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Informasi Kontak</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Telepon</p>
                      <p className="text-sm text-gray-600">{schoolData.profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp Center</p>
                      <p className="text-sm text-gray-600">085878958029</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Jam Operasional</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Senin - Jumat</p>
                      <p className="text-sm text-gray-600">{schoolData.operatingHours.weekdays}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Sabtu</p>
                      <p className="text-sm text-gray-600">{schoolData.operatingHours.saturday}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Minggu</p>
                      <p className="text-sm text-gray-600">{schoolData.operatingHours.sunday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Forms Management */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Kelola Formulir Online</CardTitle>
                    <CardDescription>Atur field dan validasi formulir pendaftaran</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Form
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Field Formulir Aktif</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p>• Nama Lengkap (Required)</p>
                        <p>• Tempat, Tanggal Lahir (Required)</p>
                        <p>• Jenis Kelamin (Required)</p>
                        <p>• Alamat Lengkap (Required)</p>
                        <p>• Nama Ayah (Required)</p>
                        <p>• Nama Ibu (Required)</p>
                      </div>
                      <div className="space-y-2">
                        <p>• Pekerjaan Ayah (Required)</p>
                        <p>• Pekerjaan Ibu (Required)</p>
                        <p>• No. HP Orangtua (Required)</p>
                        <p>• Asal Sekolah (Required)</p>
                        <p>• Prestasi (Optional)</p>
                        <p>• Upload Foto (Required)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Field
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
