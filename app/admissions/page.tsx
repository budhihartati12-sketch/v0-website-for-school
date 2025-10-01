"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calendar,
  Clock,
  Users,
  Award,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Home,
} from "lucide-react"
import { useTabParam } from "@/hooks"
import { Breadcrumb, FloatingActions } from "@/components/navigation"

export default function SMPBPage() {
  const { current, setTab } = useTabParam("gelombang")

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/", icon: Home },
          { label: "SPMB", current: true },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">SPMB SMP IT MASJID SYUHADA</h1>
            <p className="text-xl mb-2">TAHUN PELAJARAN 2025/2026</p>
            <p className="text-emerald-100 mb-6">Assalaamu'alaikum warahmatullaahi wabarakaatuh</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed">
                Selamat datang di laman informasi Penerimaan Peserta Didik Baru (PPDB) SMP IT Masjid Syuhada. Kami
                melayani pendaftaran secara online maupun offline dan{" "}
                <strong>TIDAK MEMBERLAKUKAN SISTEM ZONASI WILAYAH</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Tabs value={current} onValueChange={setTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="gelombang">Gelombang</TabsTrigger>
            <TabsTrigger value="jalur">Jalur</TabsTrigger>
            <TabsTrigger value="biaya">Biaya</TabsTrigger>
            <TabsTrigger value="syarat">Syarat</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Gelombang Pendaftaran */}
          <TabsContent value="gelombang" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  Gelombang Pendaftaran
                </CardTitle>
                <CardDescription>
                  Periode pendaftaran dibagi menjadi beberapa gelombang dengan potongan biaya yang berbeda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-2 border-emerald-200">
                    <CardHeader className="pb-3">
                      <Badge className="w-fit bg-emerald-600">Gelombang Inden</Badge>
                      <CardTitle className="text-lg">September 2024</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Potongan maksimal</p>
                      <p className="font-semibold text-emerald-600">Dana pengembangan hanya Rp 1.000.000</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200">
                    <CardHeader className="pb-3">
                      <Badge className="w-fit bg-blue-600">Gelombang 1</Badge>
                      <CardTitle className="text-lg">01 Okt - 31 Jan 2025</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Potongan 50%</p>
                      <p className="font-semibold text-blue-600">Dana pengembangan Rp 2.500.000</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-200">
                    <CardHeader className="pb-3">
                      <Badge className="w-fit bg-orange-600">Gelombang 2</Badge>
                      <CardTitle className="text-lg">01 Feb - 30 Apr 2025</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Potongan 25%</p>
                      <p className="font-semibold text-orange-600">Dana pengembangan Rp 3.750.000</p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red-200">
                    <CardHeader className="pb-3">
                      <Badge className="w-fit bg-red-600">Gelombang 3</Badge>
                      <CardTitle className="text-lg">01 Mei - Juli 2025</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">Tanpa potongan</p>
                      <p className="font-semibold text-red-600">Dana pengembangan Rp 5.000.000</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jalur Pendaftaran */}
          <TabsContent value="jalur" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-emerald-600" />
                  Jalur Pendaftaran
                </CardTitle>
                <CardDescription>
                  Tersedia jalur reguler dan jalur prestasi dengan keunggulan masing-masing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Jalur Reguler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">
                        Jalur pendaftaran umum untuk semua calon siswa yang memenuhi persyaratan dasar.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-emerald-200 bg-emerald-50">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-emerald-600" />
                        Jalur Prestasi
                      </CardTitle>
                      <Badge className="w-fit bg-emerald-600">Dana pengembangan hanya Rp 1.000.000</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Akademik</h4>
                        <p className="text-sm text-gray-600">
                          Ranking 1-3 di kelas 4, 5, 6 SD (dibuktikan dengan surat pernyataan)
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Non Akademik</h4>
                        <p className="text-sm text-gray-600">Dibuktikan dengan sertifikat kejuaraan lomba</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-2">Prestasi Tahfidz</h4>
                        <p className="text-sm text-gray-600">
                          Hafal 3 juz Al-Quran (dibuktikan dengan sertifikat dan tes)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biaya */}
          <TabsContent value="biaya" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  Rincian Biaya
                </CardTitle>
                <CardDescription>Struktur biaya pendidikan di SMP IT Masjid Syuhada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Biaya Wajib</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Dana Pengembangan</span>
                        <span className="font-semibold">Rp 5.000.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Pendaftaran (Formulir)</span>
                        <span className="font-semibold">Rp 100.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>SPP + Komite (per bulan)</span>
                        <span className="font-semibold">Rp 580.000</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Potongan Biaya</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang Inden</span>
                          <Badge className="bg-emerald-600">Rp 1.000.000</Badge>
                        </div>
                        <p className="text-sm text-emerald-700">Dana pengembangan khusus</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang 1</span>
                          <Badge className="bg-blue-600">Potongan 50%</Badge>
                        </div>
                        <p className="text-sm text-blue-700">Dari dana pengembangan</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Gelombang 2</span>
                          <Badge className="bg-orange-600">Potongan 25%</Badge>
                        </div>
                        <p className="text-sm text-orange-700">Dari dana pengembangan</p>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Jalur Prestasi</span>
                          <Badge className="bg-yellow-600">Rp 1.000.000</Badge>
                        </div>
                        <p className="text-sm text-yellow-700">Dana pengembangan khusus</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">Catatan Penting:</p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Dana pengembangan dapat diangsur selama 1 semester (2-3 kali angsuran)</li>
                        <li>• SPP sudah termasuk catering</li>
                        <li>• Biaya tambahan untuk ekstrakurikuler Robotika dan Futsal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syarat Pendaftaran */}
          <TabsContent value="syarat" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    Syarat Pendaftaran
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Mengisi Formulir Pendaftaran online</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">
                        Fotokopi Ijazah dan Surat Keterangan Nilai ASPD yang dilegalisir (gelombang 3)
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Kartu Keluarga (C1) 1 lembar</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Piagam Prestasi (jika ada)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Fotokopi Akta Kelahiran 1 lembar</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2"></div>
                      <p className="text-sm">Mengikuti wawancara siswa dan orangtua</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-emerald-600" />
                    Proses Wawancara
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">Wawancara Siswa</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          <strong>Diniyah:</strong> Praktek Ibadah, Membaca Al-Quran, Hafalan Surat-surat pendek
                        </p>
                        <p>
                          <strong>Kesiswaan:</strong> Pembiasaan/keseharian anak dan identifikasi potensi
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">Wawancara Orangtua</h4>
                      <p className="text-sm text-gray-600">Tentang pembayaran administrasi keuangan</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-700">
                        <strong>Catatan:</strong> Bacaan Quran dan hafalan tidak menjadi patokan lolos/tidaknya, hanya
                        untuk pemetaan siswa.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact & Registration */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="text-center text-emerald-800">Cara Pendaftaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-700">
                      1. Transfer biaya formulir Rp 100.000 ke rekening sekolah
                    </p>
                    <p className="text-sm text-emerald-700">
                      2. Konfirmasi pembayaran ke WA Center untuk mendapatkan nomor dan kode pendaftaran
                    </p>
                    <p className="text-sm text-emerald-700">
                      3. Isi formulir pendaftaran online menggunakan kode yang diberikan
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/auth/signup">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Formulir Online
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Bantuan: 085878958029
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions (FAQ)</CardTitle>
                <CardDescription>
                  Pertanyaan yang paling sering ditanyakan seputar PPDB SMP IT Masjid Syuhada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Bagaimana tata cara pendaftaran siswa baru?</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>Membayar uang pendaftaran Rp. 100.000</li>
                        <li>Mengisi formulir pendaftaran dengan melengkapi fotokopi akta lahir dan kartu keluarga</li>
                        <li>Mengikuti sesi wawancara (diniyah, kepribadian, keuangan)</li>
                        <li>Setelah dinyatakan lolos, membayar administrasi wajib</li>
                        <li>Mengambil kain seragam (jika sudah lunas administrasi wajib)</li>
                        <li>Dana Pengembangan dapat dibayarkan setelah masuk sekolah dan boleh diangsur</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Apakah belum bisa Quran dan belum hafal juz 30 tetap dapat lolos masuk?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Ya, bacaan Quran dan hafalan yang dimiliki tidak menjadi patokan lolos atau tidaknya siswa. Hal
                        ini hanya menjadi pemetaan siswa untuk penempatan kelas yang sesuai.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Berapa kelas yang dibuka setiap angkatan?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Total setiap angkatan ada 4 kelas: 2 kelas putra dan 2 kelas putri. Kelas putra dan putri
                        dipisah sesuai dengan konsep pendidikan Islam terpadu.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Jam berapa mulai KBM dan pulangnya?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Jam masuk sekolah adalah 7.00 WIB, dimulai dengan sholat dhuha dan dzikir pagi di masjid
                        Syuhada, kemudian dilanjutkan dengan KBM. Pulang sekolah pukul 14.30 WIB jika tidak ada kegiatan
                        tambahan (ekstrakurikuler atau kegiatan diniyah).
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Apakah siswa diperkenankan membawa HP?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Siswa tidak boleh membawa HP ke sekolah. Untuk keperluan penjemputan, dapat menghubungi wali
                        kelas atau satpam sekolah. Jika ada keperluan mendesak dan harus membawa HP, harus dengan izin
                        dan dititipkan ke waka kesiswaan sampai pulang.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger>Apa saja ekstrakurikuler yang tersedia?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Wajib:</p>
                          <p>Pramuka</p>
                        </div>
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Wajib Pilihan:</p>
                          <p>Qiro'ah, Murottal, Adzan, Kaligrafi, Pidato, Rebana, Acapella</p>
                        </div>
                        <div>
                          <p className="font-semibold">Ekstrakurikuler Umum Pilihan:</p>
                          <p>
                            Film Maker, Tari Tradisional, Nasyid Vocal, KIR, Robotika, Multimedia, OSN, Futsal,
                            Bulutangkis, Jemparingan, Pencak Silat
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger>Apa program unggulan sekolah?</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>• Program Perbaikan Baca Alquran dengan metode Tilawati</p>
                        <p>• Hafalan/Tahfidz Alquran, baik yang reguler maupun intensif (takhosus)</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-8">
                    <AccordionTrigger>Apakah sekolah menerima siswa pindahan dari luar kota?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">
                        Ya, kami menerima siswa pindahan dari luar kota. Untuk tata cara mengurus siswa pindah/mutasi
                        masuk, langsung hubungi Bu Ning/WA Center (0858 7895 8029).
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Information */}
        <Card className="mt-8 bg-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-center text-white">Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">WA Center</span>
                </div>
                <p>085878958029</p>
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Chat WhatsApp
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">Alamat Sekolah</span>
                </div>
                <p className="text-sm">SMP IT Masjid Syuhada Yogyakarta</p>
                <Button variant="secondary" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Lihat di Maps
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-emerald-500 text-center space-y-2">
              <p className="text-emerald-100">Media Sosial Kami:</p>
              <div className="flex justify-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700">
                  YouTube
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700">
                  TikTok
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-emerald-700">
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <FloatingActions
        backButton={{
          href: "/",
          label: "Kembali ke Beranda",
        }}
        scrollToTop={{
          show: true,
          threshold: 400,
          label: "Kembali ke Atas",
        }}
      />
    </div>
  )
}
