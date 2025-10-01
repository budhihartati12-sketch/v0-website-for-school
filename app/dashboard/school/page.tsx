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
  School, 
  Users, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award,
  BookOpen,
  GraduationCap,
  Library,
  Wifi,
  Car,
  Utensils,
  Shield,
  Camera,
  Music,
  Dumbbell,
  Microscope,
  Computer,
  Globe
} from "lucide-react"
import { useTabParam } from "@/hooks"

export default function SchoolPage() {
  const { current, setTab } = useTabParam("profil")

  return (
    <div className="space-y-6">
      <nav aria-label="School sections" className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {[
            { key: "profil", label: "Profil" },
            { key: "tentang", label: "Tentang" },
            { key: "struktur", label: "Struktur" },
            { key: "fasilitas", label: "Fasilitas" },
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
        {/* Profil Sekolah */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Profil Sekolah
              </CardTitle>
              <CardDescription>Atur informasi utama profil sekolah.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="school-name">Nama Sekolah</Label>
                <Input id="school-name" placeholder="SMP Syuhada" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="established-year">Tahun Berdiri</Label>
                <Input id="established-year" placeholder="1995" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school-type">Jenjang Pendidikan</Label>
                <Input id="school-type" placeholder="Sekolah Menengah Pertama" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accreditation">Akreditasi</Label>
                <Input id="accreditation" placeholder="A" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="vision">Visi</Label>
                <Textarea 
                  id="vision" 
                  placeholder="Menjadi sekolah unggulan yang menghasilkan generasi berkarakter, berprestasi, dan berakhlak mulia"
                  rows={3}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="mission">Misi</Label>
                <Textarea 
                  id="mission" 
                  placeholder="1. Menyelenggarakan pendidikan berkualitas tinggi&#10;2. Mengembangkan karakter dan akhlak mulia&#10;3. Meningkatkan prestasi akademik dan non-akademik"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tentang Sekolah */}
        <TabsContent value="tentang">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Sejarah Sekolah
                </CardTitle>
                <CardDescription>Ceritakan sejarah dan perkembangan sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="SMP Syuhada didirikan pada tahun 1995 dengan tujuan memberikan pendidikan berkualitas tinggi untuk masyarakat Yogyakarta. Sekolah ini telah mengalami berbagai perkembangan dan pencapaian yang membanggakan..."
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Prestasi & Pencapaian
                </CardTitle>
                <CardDescription>Daftar prestasi dan pencapaian sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="achievement-1">Prestasi 1</Label>
                    <Input id="achievement-1" placeholder="Juara 1 Olimpiade Matematika Tingkat Kota" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement-2">Prestasi 2</Label>
                    <Input id="achievement-2" placeholder="Sekolah Adiwiyata Tingkat Nasional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement-3">Prestasi 3</Label>
                    <Input id="achievement-3" placeholder="Akreditasi A dari BAN-S/M" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="achievement-4">Prestasi 4</Label>
                    <Input id="achievement-4" placeholder="Sekolah Ramah Anak" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Program Unggulan
                </CardTitle>
                <CardDescription>Program-program unggulan yang ditawarkan sekolah</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="program-1">Program 1</Label>
                    <Input id="program-1" placeholder="Program Tahfidz Al-Quran" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program-2">Program 2</Label>
                    <Input id="program-2" placeholder="Program Bahasa Inggris Intensif" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program-3">Program 3</Label>
                    <Input id="program-3" placeholder="Program STEM (Science, Technology, Engineering, Math)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program-4">Program 4</Label>
                    <Input id="program-4" placeholder="Program Ekstrakurikuler Unggulan" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Struktur Organisasi */}
        <TabsContent value="struktur">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kepemimpinan Sekolah
                </CardTitle>
                <CardDescription>Informasi kepemimpinan dan struktur organisasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="principal-name">Nama Kepala Sekolah</Label>
                    <Input id="principal-name" placeholder="Dr. Ahmad Fauzi, M.Pd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principal-period">Masa Jabatan</Label>
                    <Input id="principal-period" placeholder="2020 - Sekarang" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vice-principal">Wakil Kepala Sekolah</Label>
                    <Input id="vice-principal" placeholder="Siti Rahma, S.Pd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="curriculum-coordinator">Koordinator Kurikulum</Label>
                    <Input id="curriculum-coordinator" placeholder="Budi Setiawan, M.Pd" />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Struktur Organisasi</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="academic-staff">Staf Akademik</Label>
                      <Input id="academic-staff" placeholder="25 Guru" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="non-academic-staff">Staf Non-Akademik</Label>
                      <Input id="non-academic-staff" placeholder="8 Orang" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-students">Total Siswa</Label>
                      <Input id="total-students" placeholder="450 Siswa" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total-classes">Total Kelas</Label>
                      <Input id="total-classes" placeholder="15 Kelas" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Komite Sekolah
                </CardTitle>
                <CardDescription>Informasi komite sekolah dan peranannya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="committee-chairman">Ketua Komite</Label>
                    <Input id="committee-chairman" placeholder="H. Muhammad Yusuf" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-secretary">Sekretaris Komite</Label>
                    <Input id="committee-secretary" placeholder="Dra. Fatimah Az-Zahra" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-treasurer">Bendahara Komite</Label>
                    <Input id="committee-treasurer" placeholder="Ahmad Rizki, S.E" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="committee-members">Anggota Komite</Label>
                    <Input id="committee-members" placeholder="12 Orang" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fasilitas Sekolah */}
        <TabsContent value="fasilitas">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Fasilitas Akademik
                </CardTitle>
                <CardDescription>Fasilitas pendukung kegiatan pembelajaran</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Library className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Perpustakaan</p>
                      <p className="text-sm text-muted-foreground">2 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Computer className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Lab Komputer</p>
                      <p className="text-sm text-muted-foreground">1 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Microscope className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Lab IPA</p>
                      <p className="text-sm text-muted-foreground">2 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Ruang Kelas</p>
                      <p className="text-sm text-muted-foreground">15 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Music className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="font-medium">Ruang Seni</p>
                      <p className="text-sm text-muted-foreground">1 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Camera className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">Ruang Multimedia</p>
                      <p className="text-sm text-muted-foreground">1 Ruang</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Fasilitas Olahraga & Rekreasi
                </CardTitle>
                <CardDescription>Fasilitas untuk kegiatan olahraga dan rekreasi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Dumbbell className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Lapangan Basket</p>
                      <p className="text-sm text-muted-foreground">1 Lapangan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Dumbbell className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Lapangan Voli</p>
                      <p className="text-sm text-muted-foreground">1 Lapangan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Dumbbell className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Lapangan Futsal</p>
                      <p className="text-sm text-muted-foreground">1 Lapangan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Dumbbell className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Lapangan Badminton</p>
                      <p className="text-sm text-muted-foreground">2 Lapangan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Dumbbell className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Lapangan Upacara</p>
                      <p className="text-sm text-muted-foreground">1 Lapangan</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Fasilitas Pendukung
                </CardTitle>
                <CardDescription>Fasilitas pendukung lainnya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Utensils className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Kantin</p>
                      <p className="text-sm text-muted-foreground">2 Ruang</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Parkir</p>
                      <p className="text-sm text-muted-foreground">Area Luas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Wifi className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">WiFi</p>
                      <p className="text-sm text-muted-foreground">Area Seluruh Sekolah</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Keamanan</p>
                      <p className="text-sm text-muted-foreground">24 Jam</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Globe className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="font-medium">Internet</p>
                      <p className="text-sm text-muted-foreground">High Speed</p>
                    </div>
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
