"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { trpc } from "@/lib/trpc/client"
import { schoolProfileSchema, type SchoolProfile } from "@/lib/validations/school"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SchoolProfilePage() {
  const [isLoading, setIsLoading] = useState(false)

  const { data: profile, isLoading: profileLoading } = trpc.school.getProfile.useQuery()
  const updateProfileMutation = trpc.school.updateProfile.useMutation()

  const form = useForm<SchoolProfile>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      established: new Date().getFullYear(),
      accreditation: "",
      vision: "",
      mission: [""],
      goals: [""],
      indicators: [""],
      history: "",
    },
  })

  const {
    fields: missionFields,
    append: appendMission,
    remove: removeMission,
  } = useFieldArray({
    control: form.control,
    name: "mission",
  })

  const {
    fields: goalsFields,
    append: appendGoal,
    remove: removeGoal,
  } = useFieldArray({
    control: form.control,
    name: "goals",
  })

  const {
    fields: indicatorsFields,
    append: appendIndicator,
    remove: removeIndicator,
  } = useFieldArray({
    control: form.control,
    name: "indicators",
  })

  // Load profile data when available
  if (profile && !form.formState.isDirty) {
    form.reset({
      name: profile.name,
      address: profile.address,
      phone: profile.phone,
      email: profile.email,
      website: profile.website || "",
      established: profile.established,
      accreditation: profile.accreditation,
      vision: profile.vision,
      mission: profile.mission,
      goals: profile.goals,
      indicators: profile.indicators,
      history: profile.history,
    })
  }

  const onSubmit = async (data: SchoolProfile) => {
    setIsLoading(true)
    try {
      await updateProfileMutation.mutateAsync({
        id: profile?.id,
        ...data,
      })
      toast({
        title: "Berhasil",
        description: "Profil sekolah berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui profil sekolah",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Sekolah</h1>
        <p className="text-muted-foreground">Kelola informasi dasar sekolah</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
              <CardDescription>Data dasar sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Sekolah</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="established"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tahun Berdiri</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="accreditation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Akreditasi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Visi</CardTitle>
              <CardDescription>Visi sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Misi</CardTitle>
              <CardDescription>Misi sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missionFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`mission.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeMission(index)}
                    disabled={missionFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendMission("")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Misi
              </Button>
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Tujuan</CardTitle>
              <CardDescription>Tujuan sekolah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {goalsFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`goals.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeGoal(index)}
                    disabled={goalsFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendGoal("")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tujuan
              </Button>
            </CardContent>
          </Card>

          {/* Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Indikator</CardTitle>
              <CardDescription>Indikator pencapaian visi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {indicatorsFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <FormField
                    control={form.control}
                    name={`indicators.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIndicator(index)}
                    disabled={indicatorsFields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => appendIndicator("")}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Indikator
              </Button>
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle>Sejarah</CardTitle>
              <CardDescription>Sejarah singkat sekolah</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
