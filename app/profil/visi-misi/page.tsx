"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Eye, Compass, CheckCircle, Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc/client"

export default function VisiMisiPage() {
  const { data: profile, isLoading } = trpc.school.getProfile.useQuery()

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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Visi & Misi</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Arah dan tujuan pendidikan {profile.name}
              </p>
            </div>
          </div>
        </section>

        {/* Visi Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mb-12">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Visi</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <blockquote className="text-2xl md:text-3xl font-bold text-primary leading-relaxed mb-8">
                  "{profile.vision}"
                </blockquote>

                {profile.indicators && profile.indicators.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-6">Indikator Visi</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {profile.indicators.map((indikator, index) => (
                        <div key={index} className="flex items-start space-x-3 text-left">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{indikator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Misi Section */}
            <Card className="mb-12">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Compass className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.mission.map((misi, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{misi}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tujuan Section */}
            <Card>
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">Tujuan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-8">
                  Sesuai dengan visi, misi sekolah, tujuan {profile.name} adalah mengantarkan peserta didik untuk:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.goals.map((tujuan, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tujuan}</span>
                    </div>
                  ))}
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
