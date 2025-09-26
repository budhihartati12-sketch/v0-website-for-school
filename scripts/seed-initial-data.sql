-- Seed initial school profile data
INSERT INTO school_profiles (
  id, name, address, phone, email, website, established, accreditation, 
  vision, mission, goals, indicators, history, created_at, updated_at
) VALUES (
  'school_profile_1',
  'SMP IT Masjid Syuhada Yogyakarta',
  'Jl. I Dewa Nyoman Oka No. 28, Kotabaru, Kec. Gondokusuman, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55224',
  '(0274) 512912',
  'smpitsyuhada@gmail.com',
  'https://smpitsyuhada.sch.id',
  2004,
  'A',
  'SMP IT Masjid Syuhada menjadi Sekolah Unggulan yang Mewujudkan Lulusan yang Unggul, Cerdas, Kreatif, dan Berakhlakul Karimah.',
  '["Menanamkan aqidah yang lurus", "Menciptakan lingkungan dan budaya sekolah yang islami", "Menanamkan jiwa dakwah, toleransi, dan cinta tanah air", "Membina dan mengembangkan karakter peserta didik menjadi generasi muslim yang tangguh, amanah, dan beramar ma''ruf nahi mungkar", "Menyelenggarakan program unggulan dalam bidang kediniyahan yang terdiri dari Tahsin, tahfidz, dan Bahasa Arab", "Melaksanakan pengembangan kurikulum dalam upaya peningkatan mutu pendidikan bagi peserta didik", "Melaksanakan proses pembelajaran dan bimbingan yang optimal dalam upaya peningkatan ilmu dan prestasi peserta didik sesuai potensi yang dimilikinya", "Meningkatkan kreasi, prestasi, dan apresiasi dalam bidang kegiatan non-akademik", "Menumbuhkan budaya literasi", "Memfasilitasi peserta didik yang berkebutuhan khusus (slow learner)", "Meningkatkan kompetensi pendidik dan tenaga kependidikan", "Menjalin dan meningkatkan kerja sama dengan mitra sekolah", "Menanamkan jiwa kewirausahaan melalui pengembangan kecakapan hidup (life skill)"]',
  '["Seluruh peserta didik mampu beribadah sesuai dengan syariat", "Seluruh peserta didik menunjukkan karakter profil pelajar Pancasila yaitu beriman, bertakwa kepada Tuhan YME dan berakhlak mulia, berkebhinekaan global, mandiri, gotong royong, bernalar kritis dan kreatif", "Terwujudnya \"School Wellbeing\"", "Seluruh peserta didik menjadi seorang muslim yang pantang menyerah, tepercaya, berani menyampaikan kebenaran dan mencegah kemungkaran", "Seluruh peserta didik menjalankan ibadah wajib dan sunnah secara baik dan benar", "Seluruh peserta didik dapat membaca Al Quran dengan kaidah tajwid yang baik dan benar", "Terlaksananya pengembangan kurikulum yang kontinue menyesuaikan perkembangan zaman", "Guru mampu mengembangkan inovasi pembelajaran", "Meningkatkan pendampingan dan partisipasi peserta didik dalam lomba non akademik minimal meraih juara tingkat kota", "Meningkatkan nilai literasi dan numerasi sebesar 5 point dari tahun sebelumnya pada Asesmen Nasional", "Meningkatkan kemampuan bidang sains, teknologi informasi, dan komunikasi, bakat dan minat peserta didik", "Guru mampu memanfaatkan lingkungan sekolah dan mitra sekolah untuk mendukung proses pembelajaran", "Terlaksananya program kecakapan (life skill) untuk siswa"]',
  '["Unggul dalam mengamalkan ajaran agama islam sesuai dengan tuntunan Al Quran dan As Sunnah", "Unggul dalam prestasi bidang akademik dan non akademik", "Cerdas dalam menerapkan ilmu pengetahuan dan teknologi serta tetap berpijak pada jati diri bangsa", "Cerdas dalam memadukan nilai-nilai ajaran islam dalam Pendidikan", "Kreatif dalam meningkatkan potensi diri untuk berkreasi dan berinovasi", "Kreatif dalam mengembangkan lingkungan pembelajaran yang kondusif dan islami", "Kreatif dalam mengembangkan bakat dan kecakapan hidup (life skill)", "Membentuk dan menumbuhkan pribadi muslim yang berakhlakul karimah"]',
  'Sekolah Menengah Pertama Islam Terpadu Masjid Syuhada (SMP IT Masjid Syuhada) Yogyakarta secara resmi berdiri pada tanggal 25 Maret 2004 seiring dengan adanya SK dari Dinas Pendidikan dan Pengajaran Kota Yogyakarta Nomor 188/853 Tahun 2004.\n\nSMP IT Masjid Syuhada berlindung dalam Yayasan Masjid dan Asrama (YASMA) Syuhada Yogyakarta bersama dengan TK Masjid Syuhada dan SD Masjid Syuhada Yogyakarta.',
  datetime('now'),
  datetime('now')
);

-- Seed sample facilities data
INSERT INTO facilities (id, name, description, category, icon, "order", created_at, updated_at) VALUES
('facility_1', 'Ruang Kelas', 'Ruang kelas yang representatif dengan fasilitas pembelajaran modern', 'academic', 'Building', 1, datetime('now'), datetime('now')),
('facility_2', 'Laboratorium IPA', 'Laboratorium lengkap untuk praktikum mata pelajaran IPA', 'academic', 'FlaskConical', 2, datetime('now'), datetime('now')),
('facility_3', 'Laboratorium Komputer', 'Lab komputer dengan perangkat terkini untuk pembelajaran TIK', 'academic', 'Computer', 3, datetime('now'), datetime('now')),
('facility_4', 'Perpustakaan', 'Koleksi buku lengkap untuk mendukung kegiatan literasi siswa', 'academic', 'BookOpen', 4, datetime('now'), datetime('now')),
('facility_5', 'Masjid Agung Syuhada', 'Masjid untuk kegiatan ibadah dan pembelajaran agama', 'religious', 'Church', 1, datetime('now'), datetime('now')),
('facility_6', 'Ruang UKS', 'Unit Kesehatan Sekolah untuk pelayanan kesehatan siswa', 'support', 'Heart', 1, datetime('now'), datetime('now')),
('facility_7', 'Ruang Bimbingan dan Konseling', 'Ruang konseling untuk pembimbingan siswa', 'support', 'Users', 2, datetime('now'), datetime('now')),
('facility_8', 'Kantin', 'Kantin sekolah dengan makanan sehat dan halal', 'support', 'Coffee', 3, datetime('now'), datetime('now')),
('facility_9', 'Koperasi Sekolah', 'Koperasi untuk kebutuhan alat tulis dan perlengkapan sekolah', 'support', 'ShoppingCart', 4, datetime('now'), datetime('now'));

-- Seed sample leadership data
INSERT INTO leadership (id, name, position, category, subject, class, "order", created_at, updated_at) VALUES
('leader_1', 'Meilani Noor Khasanah, S. Pd.', 'Kepala Sekolah', 'leadership', 'IPS', NULL, 1, datetime('now'), datetime('now')),
('leader_2', 'Yamidah, M. Pd.', 'Wakil Kepala Bidang Akademik/Kurikulum', 'leadership', 'IPA Fisika', NULL, 2, datetime('now'), datetime('now')),
('leader_3', 'Dwi Purnomo, S. Pd. Si.', 'Wakil Kepala Bidang Administrasi Umum, Sarpras & Keuangan', 'leadership', 'Matematika', NULL, 3, datetime('now'), datetime('now')),
('leader_4', 'Tarmidzi Taher A.S. S. Pt.', 'Wakil Kepala Bidang Kesiswaan dan Diniyah', 'leadership', 'Tahfidz Putra', NULL, 4, datetime('now'), datetime('now'));
