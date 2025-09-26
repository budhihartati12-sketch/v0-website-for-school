"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award, MapPin, Users, Building, BookOpen, Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc/client"

export default function SejarahPage() {
  const { data: profile, isLoading } = trpc.school.getProfile.useQuery()
  const { data: allStaff = [] } = trpc.leadership.getAll.useQuery()

  const timelineEvents = [
    {
      year: "2004",
      title: "Pendirian Sekolah",
      description:
        "SMP IT Masjid Syuhada resmi berdiri pada tanggal 25 Maret 2004 dengan SK Dinas Pendidikan dan Pengajaran Kota Yogyakarta Nomor 188/853 Tahun 2004.",
      icon: Building,
    },
    {
      year: "2009",
      title: "Akreditasi Pertama",
      description:
        "Memperoleh akreditasi dengan peringkat 'B' berdasarkan SK BAP S/M Provinsi DIY Nomor 12.01/BAP/TU/X/2009 tanggal 12 Oktober 2009.",
      icon: Award,
    },
    {
      year: "2014",
      title: "Akreditasi A",
      description:
        "Berhasil meningkatkan akreditasi menjadi peringkat 'A' berdasarkan SK BAP-SM DIY Nomor 16.01/BAP-SM/TU/X/2014 tanggal 16 Oktober 2014.",
      icon: Award,
    },
    {
      year: "2024",
      title: "Sekolah Unggulan",
      description:
        "Terus berkembang menjadi sekolah unggulan di Kota Yogyakarta dengan berbagai prestasi dan program inovatif.",
      icon: BookOpen,
    },
  ]

  const totalStaff = allStaff.length
  const totalTeachers = allStaff.filter((staff) => staff.category === "teacher").length
  const currentYear = new Date().getFullYear()
  const yearsOfExperience = profile ? currentYear - profile.established : 20

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Data profil sekolah belum tersedia</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Sejarah Sekolah</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Perjalanan dan perkembangan {profile.name} dari tahun {profile.established} hingga sekarang
              </p>
            </div>
          </div>
        </section>

        {/* History Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overview */}
            <Card className="mb-12">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>Sejarah Pendirian</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg text-muted-foreground leading-relaxed">
                  {profile.history.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Lokasi Strategis</h3>
                    <p className="text-sm text-muted-foreground">{profile.address}</p>
                  </div>

                  <div className="text-center">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Tim Pendidik</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalTeachers} pendidik berkualifikasi S1 dan {totalStaff - totalTeachers} karyawan berpengalaman
                    </p>
                  </div>

                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="font-bold text-lg mb-2">Kurikulum Terpadu</h3>
                    <p className="text-sm text-muted-foreground">
                      Integrasi kurikulum nasional dengan kurikulum agama Islam
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-12">Timeline Perkembangan</h2>
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <event.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                    <Card className="flex-1">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="text-lg px-3 py-1">
                            {event.year}
                          </Badge>
                          <CardTitle className="text-xl">{event.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Status Saat Ini</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
                  Semoga {profile.name} selalu berkembang dan menjadi sekolah unggulan di Kota Yogyakarta, DIY, dan
                  Indonesia.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{profile.accreditation}</div>
                    <p className="text-sm text-muted-foreground">Akreditasi</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{yearsOfExperience}+</div>
                    <p className="text-sm text-muted-foreground">Tahun Pengalaman</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{totalStaff}</div>
                    <p className="text-sm text-muted-foreground">Total Staff</p>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <p className="text-sm text-muted-foreground">Guru S1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
