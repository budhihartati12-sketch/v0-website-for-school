"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/lib/trpc/client"
import { leadershipSchema, type Leadership } from "@/lib/validations/school"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const categoryLabels = {
  leadership: "Pimpinan Sekolah",
  yasma: "Pengurus YASMA",
  class_teacher: "Wali Kelas",
  teacher: "Staf Pengajar",
}

export default function StructurePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("leadership")

  const { data: leadership = [], refetch } = trpc.leadership.getAll.useQuery()
  const createMutation = trpc.leadership.create.useMutation()
  const updateMutation = trpc.leadership.update.useMutation()
  const deleteMutation = trpc.leadership.delete.useMutation()

  const form = useForm<Leadership>({
    resolver: zodResolver(leadershipSchema),
    defaultValues: {
      name: "",
      position: "",
      category: "leadership",
      subject: "",
      class: "",
      order: 0,
    },
  })

  const filteredLeadership = leadership.filter((item) =>
    selectedCategory === "all" ? true : item.category === selectedCategory,
  )

  const onSubmit = async (data: Leadership) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, ...data })
        toast({ title: "Berhasil", description: "Data berhasil diperbarui" })
      } else {
        await createMutation.mutateAsync(data)
        toast({ title: "Berhasil", description: "Data berhasil ditambahkan" })
      }
      setIsDialogOpen(false)
      setEditingItem(null)
      form.reset()
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    form.reset(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteMutation.mutateAsync({ id })
        toast({ title: "Berhasil", description: "Data berhasil dihapus" })
        refetch()
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus data",
          variant: "destructive",
        })
      }
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Struktur Organisasi</h1>
          <p className="text-muted-foreground">Kelola struktur kepemimpinan dan staff sekolah</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Data
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Data" : "Tambah Data Baru"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Perbarui informasi staff" : "Tambahkan staff atau pimpinan baru"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jabatan</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="leadership">Pimpinan Sekolah</SelectItem>
                          <SelectItem value="yasma">Pengurus YASMA</SelectItem>
                          <SelectItem value="class_teacher">Wali Kelas</SelectItem>
                          <SelectItem value="teacher">Staf Pengajar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("category") === "teacher" && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mata Pelajaran</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("category") === "class_teacher" && (
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kelas</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urutan</FormLabel>
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
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Batal
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Simpan
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          Semua
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === "all"
              ? "Semua Data"
              : categoryLabels[selectedCategory as keyof typeof categoryLabels]}
          </CardTitle>
          <CardDescription>{filteredLeadership.length} data ditemukan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeadership.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <Badge variant="secondary">{categoryLabels[item.category as keyof typeof categoryLabels]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.position}</p>
                  {item.subject && <p className="text-sm text-muted-foreground">Mata Pelajaran: {item.subject}</p>}
                  {item.class && <p className="text-sm text-muted-foreground">Kelas: {item.class}</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredLeadership.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">Belum ada data untuk kategori ini</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
