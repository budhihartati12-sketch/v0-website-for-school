import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, GraduationCap, UserCheck, Building, Award } from "lucide-react"

export default function StaffPage() {
  const pimpinanSekolah = [
    {
      nama: "Meilani Noor Khasanah, S. Pd.",
      jabatan: "Kepala Sekolah",
      mapel: "IPS",
    },
    {
      nama: "Yamidah, M. Pd.",
      jabatan: "Wakil Kepala Bidang Akademik/Kurikulum",
      mapel: "IPA Fisika",
    },
    {
      nama: "Dwi Purnomo, S. Pd. Si.",
      jabatan: "Wakil Kepala Bidang Administrasi Umum, Sarpras & Keuangan",
      mapel: "Matematika",
    },
    {
      nama: "Tarmidzi Taher A.S. S. Pt.",
      jabatan: "Wakil Kepala Bidang Kesiswaan dan Diniyah",
      mapel: "Tahfidz Putra",
    },
  ]

  const pengurusYasma = [
    {
      nama: "H.R.M. Tirun Marwito, S.H",
      jabatan: "Ketua Umum",
    },
    {
      nama: "Ir. H. Muhammad Hanief, M.T",
      jabatan: "Wakil Ketua Umum",
    },
    {
      nama: "Muhammad Suyanto, S.Ag, M.Si.",
      jabatan: "Sekretaris",
    },
    {
      nama: "Busro Sanjaya, S.EI.",
      jabatan: "Wakil Sekretaris",
    },
    {
      nama: "Drs. H. Sunardi Syahuri",
      jabatan: "Bendahara",
    },
    {
      nama: "Drs. H. Muhammad Bachroni, S.U",
      jabatan: "Wakil Bendahara",
    },
    {
      nama: "DR. Ir. Harry Sulistyo",
      jabatan: "Ketua Bidang Pendidikan",
    },
    {
      nama: "Drs. Sholihin",
      jabatan: "Anggota Bidang Pendidikan",
    },
    {
      nama: "Mu'minan",
      jabatan: "Anggota Bidang Pendidikan",
    },
    {
      nama: "Dra. Hj. Suwarni Angesti Rahayu",
      jabatan: "Anggota Bidang Pendidikan",
    },
  ]

  const waliKelas = [
    { kelas: "VII A", nama: "DITA WULANSARI, S. Pd. Gr." },
    { kelas: "VII B", nama: "HASIFAH NUR F., S.Pd." },
    { kelas: "VII C", nama: "FATHUL LAILI K., S. Pd." },
    { kelas: "VII D", nama: "-" },
    { kelas: "VIII A", nama: "Dra. ZAMROH NOVIANDARI" },
    { kelas: "VIII B", nama: "DINI PRISTIANA, S.Pd. Gr." },
    { kelas: "VIII C", nama: "AULIYATUN NISA', S.Sos.I. M.A." },
    { kelas: "VIII D", nama: "NURUL HIDAYAH, S.Pd." },
    { kelas: "IX A", nama: "MUSTAGHFIROH, S. Pd." },
    { kelas: "IX B", nama: "MUHAMMAD FAUZAN HANIF, S. Pd." },
    { kelas: "IX C", nama: "AYUN KHILIYATUL MILLA, S.Pd.I" },
    { kelas: "IX D", nama: "YUNITA IKA SARI B., M.P." },
  ]

  const stafPengajar = [
    { nama: "Meilani Noor Khasanah, S. Pd.", jabatan: "Kepala Sekolah", mapel: "IPS" },
    { nama: "Yamidah, M. Pd.", jabatan: "Wakil Kepala Bid. Akademik", mapel: "IPA Fisika" },
    {
      nama: "Dwi Purnomo, S. Pd. Si.",
      jabatan: "Wakil Kepala Bid. Administrasi, Sarana Prasarana, dan Keuangan",
      mapel: "Matematika",
    },
    { nama: "Arif Taba Nasuha, S. Ag.", jabatan: "Koordinator Bidang Diniyah", mapel: "Pendidikan Agama Islam" },
    { nama: "Dra. Zamroh Noviandari", jabatan: "Staf Urusan Humas", mapel: "IPA Biologi" },
    { nama: "Mustaghfiroh, S. Pd.", jabatan: "–", mapel: "Matematika" },
    { nama: "Ayun Khiliyatul Milla, S. Pd. I.", jabatan: "–", mapel: "Bahasa Arab/PAI" },
    { nama: "Yunita Ika Sari B., M. P.", jabatan: "–", mapel: "Prakarya/TIK" },
    { nama: "Dini Pristiana, S. Pd. Gr.", jabatan: "–", mapel: "Bahasa Inggris" },
    { nama: "Karlina, S. Pd.", jabatan: "–", mapel: "Bahasa Jawa" },
    { nama: "Nur Arif Fuadi, M. Si.", jabatan: "–", mapel: "Matematika" },
    { nama: "Hasifah Nur Fitriana, S. Pd.", jabatan: "–", mapel: "Bahasa Indonesia" },
    { nama: "Dita Wulansari, S. Pd. Gr.", jabatan: "–", mapel: "Bahasa Inggris" },
    { nama: "Tarmidzi Taher AS, S. Pt.", jabatan: "Wakil Kepala Bidang Kesiswaan dan Diniyah", mapel: "Tahfidz Putra" },
    { nama: "Okita Maya Asiah, S. Pd.", jabatan: "–", mapel: "Tahfidz Putri" },
    { nama: "Feplita Agustin Kusrianingtyas", jabatan: "–", mapel: "Tahfidz Putri" },
    { nama: "Muhammad Fauzan Hanif, S. Pd.", jabatan: "–", mapel: "Bimbingan dan Konseling Putra" },
    { nama: "Muhammad Tahir, S. Pd.", jabatan: "–", mapel: "SBK" },
    { nama: "Ada Kurnia, S. Pd.", jabatan: "–", mapel: "IPS" },
    { nama: "Auliyatun Nisa', S. Sos. MA.", jabatan: "–", mapel: "Bimbingan dan Konseling Putri" },
    { nama: "Pandhu Daudha Sulaiman", jabatan: "–", mapel: "Bahasa Arab" },
    { nama: "Fathul Laili Khoirun Nisa", jabatan: "–", mapel: "Pendidikan Kewarganegaraan" },
    { nama: "Muhammad Raihan A. P.", jabatan: "–", mapel: "Penjasorkes Putra" },
    { nama: "Muhammad Agung Nugraha", jabatan: "–", mapel: "Pendidikan Kewarganegaraan" },
    { nama: "Aufa Nada", jabatan: "–", mapel: "Penjasorkes Putri" },
    { nama: "Annisa Cahya R., M.Pd.", jabatan: "–", mapel: "Bahasa Indonesia" },
    { nama: "Joko Susanto", jabatan: "–", mapel: "IPA" },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Staff & Pengajar</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Tim pendidik dan tenaga kependidikan yang berpengalaman dan berkualitas
              </p>
            </div>
          </div>
        </section>

        {/* Staff Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="p-8">
                  <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">18 Guru</h3>
                  <p className="text-muted-foreground">Berkualifikasi S1</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <UserCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">5 Staff</h3>
                  <p className="text-muted-foreground">Tenaga Kependidikan</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">100%</h3>
                  <p className="text-muted-foreground">Sesuai Bidang</p>
                </CardContent>
              </Card>
            </div>

            {/* Staff Directory */}
            <Tabs defaultValue="pimpinan" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pimpinan">Pimpinan</TabsTrigger>
                <TabsTrigger value="yasma">YASMA</TabsTrigger>
                <TabsTrigger value="wali">Wali Kelas</TabsTrigger>
                <TabsTrigger value="pengajar">Pengajar</TabsTrigger>
              </TabsList>

              <TabsContent value="pimpinan" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Crown className="h-6 w-6 text-primary" />
                      <span>Pimpinan Sekolah</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {pimpinanSekolah.map((pimpinan, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="h-8 w-8 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{pimpinan.nama}</h3>
                                <p className="text-primary font-medium mb-2">{pimpinan.jabatan}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {pimpinan.mapel}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="yasma" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Building className="h-6 w-6 text-primary" />
                      <span>Pengurus YASMA Syuhada</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-8">
                      Yayasan Masjid dan Asrama (YASMA) Syuhada Yogyakarta yang menaungi TK, SD, dan SMP IT Masjid
                      Syuhada.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pengurusYasma.map((pengurus, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-sm mb-1">{pengurus.nama}</h4>
                            <p className="text-primary text-xs font-medium">{pengurus.jabatan}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wali" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Users className="h-6 w-6 text-primary" />
                      <span>Wali Kelas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {waliKelas.map((wali, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-primary font-bold text-sm">{wali.kelas}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-sm mb-1">Kelas {wali.kelas}</h4>
                                <p className="text-muted-foreground text-xs">{wali.nama}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pengajar" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <span>Staf Pengajar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-8">
                      Seluruh pendidik di SMP IT Masjid Syuhada memenuhi kualifikasi Sarjana (S-1) sesuai dengan latar
                      belakang pendidikannya.
                    </p>
                    <div className="space-y-4">
                      {stafPengajar.map((staff, index) => (
                        <Card key={index} className="bg-muted/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm mb-1">{staff.nama}</h4>
                                  {staff.jabatan !== "–" && (
                                    <p className="text-primary text-xs font-medium mb-1">{staff.jabatan}</p>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {staff.mapel}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
