import { z } from "zod"

export const schoolProfileSchema = z.object({
  name: z.string().min(1, "Nama sekolah harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  phone: z.string().min(1, "Nomor telepon harus diisi"),
  email: z.string().email("Email tidak valid"),
  website: z.string().url("Website tidak valid").optional().or(z.literal("")),
  established: z.number().min(1900, "Tahun berdiri tidak valid"),
  accreditation: z.string().min(1, "Akreditasi harus diisi"),
  vision: z.string().min(1, "Visi harus diisi"),
  mission: z.array(z.string().min(1, "Misi tidak boleh kosong")),
  goals: z.array(z.string().min(1, "Tujuan tidak boleh kosong")),
  indicators: z.array(z.string().min(1, "Indikator tidak boleh kosong")),
  history: z.string().min(1, "Sejarah harus diisi"),
})

export const leadershipSchema = z.object({
  name: z.string().min(1, "Nama harus diisi"),
  position: z.string().min(1, "Jabatan harus diisi"),
  category: z.enum(["leadership", "yasma", "class_teacher", "teacher"]),
  subject: z.string().optional(),
  class: z.string().optional(),
  order: z.number().default(0),
})

export const facilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  category: z.enum(["academic", "religious", "sports", "support"]),
  icon: z.string().min(1, "Icon harus dipilih"),
  order: z.number().default(0),
})

export const subjectSchema = z.object({
  name: z.string().min(1, "Nama mata pelajaran harus diisi"),
  category: z.enum(["core", "islamic", "local"]),
  description: z.string().optional(),
  order: z.number().default(0),
})

export const programSchema = z.object({
  name: z.string().min(1, "Nama program harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  category: z.enum(["tahfidz", "tahsin", "activities", "habits"]),
  icon: z.string().min(1, "Icon harus dipilih"),
  order: z.number().default(0),
})

export const registrationWaveSchema = z.object({
  name: z.string().min(1, "Nama gelombang harus diisi"),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(false),
  order: z.number().default(0),
})

export const registrationPathwaySchema = z.object({
  name: z.string().min(1, "Nama jalur harus diisi"),
  description: z.string().min(1, "Deskripsi harus diisi"),
  requirements: z.array(z.string().min(1, "Persyaratan tidak boleh kosong")),
  baseFee: z.number().min(0, "Biaya tidak boleh negatif"),
  discount: z.number().min(0).max(100, "Diskon maksimal 100%").default(0),
  order: z.number().default(0),
})

export const faqSchema = z.object({
  question: z.string().min(1, "Pertanyaan harus diisi"),
  answer: z.string().min(1, "Jawaban harus diisi"),
  category: z.enum(["general", "registration", "academic", "facilities"]),
  order: z.number().default(0),
})

export const settingsSchema = z.object({
  key: z.string().min(1, "Key harus diisi"),
  value: z.string().min(1, "Value harus diisi"),
  type: z.enum(["string", "number", "boolean", "json"]),
})

export type SchoolProfile = z.infer<typeof schoolProfileSchema>
export type Leadership = z.infer<typeof leadershipSchema>
export type Facility = z.infer<typeof facilitySchema>
export type Subject = z.infer<typeof subjectSchema>
export type Program = z.infer<typeof programSchema>
export type RegistrationWave = z.infer<typeof registrationWaveSchema>
export type RegistrationPathway = z.infer<typeof registrationPathwaySchema>
export type FAQ = z.infer<typeof faqSchema>
export type Settings = z.infer<typeof settingsSchema>
