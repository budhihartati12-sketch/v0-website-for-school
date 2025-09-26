import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function KontakPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Hubungi Kami</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Silakan hubungi kami untuk informasi lebih lanjut tentang pendaftaran dan program sekolah
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Informasi Kontak</h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Kami siap membantu Anda dengan informasi tentang SMP IT Masjid Syuhada Yogyakarta
                  </p>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Alamat</h3>
                          <p className="text-muted-foreground">
                            Jl. I Dewa Nyoman Oka No. 28
                            <br />
                            Kotabaru, Yogyakarta 55224
                            <br />
                            Daerah Istimewa Yogyakarta
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Telepon</h3>
                          <p className="text-muted-foreground">(0274) 563972</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Email</h3>
                          <p className="text-muted-foreground">info@smpitmasjidsyuhada.sch.id</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Jam Operasional</h3>
                          <div className="text-muted-foreground space-y-1">
                            <p>Senin - Jumat: 07.00 - 14.30 WIB</p>
                            <p>Sabtu - Minggu: Tutup</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                      <Send className="h-6 w-6 text-primary" />
                      <span>Kirim Pesan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input id="nama" placeholder="Masukkan nama lengkap" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Masukkan email" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telepon">Nomor Telepon</Label>
                        <Input id="telepon" placeholder="Masukkan nomor telepon" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subjek">Subjek</Label>
                        <Input id="subjek" placeholder="Subjek pesan" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pesan">Pesan</Label>
                      <Textarea id="pesan" placeholder="Tulis pesan Anda di sini..." rows={6} />
                    </div>

                    <Button className="w-full" size="lg">
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Pesan
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      Kami akan merespons pesan Anda dalam 1-2 hari kerja
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map Section */}
            <Card className="mt-16">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Lokasi Sekolah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Peta Lokasi</h3>
                    <p className="text-muted-foreground">Jl. I Dewa Nyoman Oka No. 28, Kotabaru, Yogyakarta</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Dekat dengan RRI, Balai Bahasa, dan Jogja Study Center
                    </p>
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
