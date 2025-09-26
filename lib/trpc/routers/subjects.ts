import { router, publicProcedure } from "../trpc"
import { subjectSchema } from "@/lib/validations/school"
import { z } from "zod"

export const subjectsRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.subject.findMany({
        where: input?.category ? { category: input.category } : undefined,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      })
    }),

  create: publicProcedure.input(subjectSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.subject.create({
      data: input,
    })
  }),

  update: publicProcedure.input(subjectSchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    return await ctx.prisma.subject.update({
      where: { id },
      data,
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.subject.delete({
      where: { id: input.id },
    })
  }),
})
