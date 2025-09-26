"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Crown, GraduationCap, UserCheck, Building, Award, Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc/client"

const categoryLabels = {
  leadership: "Pimpinan Sekolah",
  yasma: "Pengurus YASMA",
  class_teacher: "Wali Kelas",
  teacher: "Staf Pengajar",
}

export default function StaffPage() {
  const { data: allStaff = [], isLoading } = trpc.leadership.getAll.useQuery()

  const pimpinanSekolah = allStaff.filter((staff) => staff.category === "leadership")
  const pengurusYasma = allStaff.filter((staff) => staff.category === "yasma")
  const waliKelas = allStaff.filter((staff) => staff.category === "class_teacher")
  const stafPengajar = allStaff.filter((staff) => staff.category === "teacher")

  const totalGuru = stafPengajar.length
  const totalStaff = pimpinanSekolah.length + pengurusYasma.length + waliKelas.length

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
                  <h3 className="text-2xl font-bold mb-2">{totalGuru} Guru</h3>
                  <p className="text-muted-foreground">Berkualifikasi S1</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <UserCheck className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{totalStaff} Staff</h3>
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
                    {pimpinanSekolah.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {pimpinanSekolah.map((pimpinan) => (
                          <Card key={pimpinan.id} className="bg-muted/30">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <GraduationCap className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg mb-1">{pimpinan.name}</h3>
                                  <p className="text-primary font-medium mb-2">{pimpinan.position}</p>
                                  {pimpinan.subject && (
                                    <Badge variant="secondary" className="text-xs">
                                      {pimpinan.subject}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Belum ada data pimpinan sekolah</p>
                    )}
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
                    {pengurusYasma.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pengurusYasma.map((pengurus) => (
                          <Card key={pengurus.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <h4 className="font-bold text-sm mb-1">{pengurus.name}</h4>
                              <p className="text-primary text-xs font-medium">{pengurus.position}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Belum ada data pengurus YASMA</p>
                    )}
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
                    {waliKelas.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waliKelas.map((wali) => (
                          <Card key={wali.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-primary font-bold text-sm">{wali.class}</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm mb-1">Kelas {wali.class}</h4>
                                  <p className="text-muted-foreground text-xs">{wali.name}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Belum ada data wali kelas</p>
                    )}
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
                    {stafPengajar.length > 0 ? (
                      <div className="space-y-4">
                        {stafPengajar.map((staff) => (
                          <Card key={staff.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-sm mb-1">{staff.name}</h4>
                                    {staff.position && staff.position !== "–" && (
                                      <p className="text-primary text-xs font-medium mb-1">{staff.position}</p>
                                    )}
                                  </div>
                                </div>
                                {staff.subject && (
                                  <Badge variant="secondary" className="text-xs">
                                    {staff.subject}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">Belum ada data staf pengajar</p>
                    )}
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
