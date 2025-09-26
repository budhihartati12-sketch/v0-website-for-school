"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import * as Icons from "lucide-react"

const categoryLabels = {
  academic: "Akademik",
  religious: "Keagamaan",
  sports: "Olahraga",
  support: "Penunjang",
}

const categoryIcons = {
  academic: Icons.Building,
  religious: Icons.Church,
  sports: Icons.Trophy,
  support: Icons.Users,
}

export default function FasilitasPage() {
  const { data: facilities = [], isLoading } = trpc.facilities.getAll.useQuery()

  const facilitiesByCategory = {
    academic: facilities.filter((f) => f.category === "academic"),
    religious: facilities.filter((f) => f.category === "religious"),
    sports: facilities.filter((f) => f.category === "sports"),
    support: facilities.filter((f) => f.category === "support"),
  }

  const getIconComponent = (iconName: string) => {
    // @ts-ignore - Dynamic icon access
    const IconComponent = Icons[iconName] || Icons.Building
    return IconComponent
  }

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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Fasilitas Sekolah</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Fasilitas lengkap dan modern untuk mendukung kegiatan pembelajaran yang optimal
              </p>
            </div>
          </div>
        </section>

        {/* Facilities Overview */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {Object.entries(facilitiesByCategory).map(([category, items]) => {
                const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                return (
                  <Card key={category} className="text-center">
                    <CardContent className="p-6">
                      <CategoryIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">{items.length}</h3>
                      <p className="text-muted-foreground text-sm">
                        Fasilitas {categoryLabels[category as keyof typeof categoryLabels]}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Facilities by Category */}
            <div className="space-y-12">
              {Object.entries(facilitiesByCategory).map(([category, items]) => {
                if (items.length === 0) return null

                return (
                  <div key={category}>
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                      Fasilitas {categoryLabels[category as keyof typeof categoryLabels]}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((facility) => {
                        const IconComponent = getIconComponent(facility.icon)
                        return (
                          <Card
                            key={facility.id}
                            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                          >
                            <CardHeader className="text-center pb-4">
                              <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                                <IconComponent className="h-8 w-8 text-primary" />
                              </div>
                              <CardTitle className="text-lg font-bold">{facility.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground text-center text-sm leading-relaxed">
                                {facility.description}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {facilities.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Belum ada data fasilitas yang tersedia</p>
              </div>
            )}

            {/* Location Advantage */}
            <Card className="mt-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Lokasi Strategis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground text-center mb-8 leading-relaxed">
                  Lokasi SMP IT Masjid Syuhada yang berdekatan dengan berbagai lembaga pendukung pembelajaran
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.Building className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">RRI</h4>
                    <p className="text-sm text-muted-foreground">Radio Republik Indonesia</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Balai Bahasa</h4>
                    <p className="text-sm text-muted-foreground">Pusat Pengembangan Bahasa</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icons.Users className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="font-bold mb-2">JSC</h4>
                    <p className="text-sm text-muted-foreground">Jogja Study Center</p>
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
