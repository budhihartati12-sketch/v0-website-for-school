import { router, publicProcedure } from "../trpc"
import { programSchema } from "@/lib/validations/school"
import { z } from "zod"

export const programsRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.program.findMany({
        where: input?.category ? { category: input.category } : undefined,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      })
    }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.program.findUnique({
      where: { id: input.id },
    })
  }),

  create: publicProcedure.input(programSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.program.create({
      data: input,
    })
  }),

  update: publicProcedure.input(programSchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    return await ctx.prisma.program.update({
      where: { id },
      data,
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.program.delete({
      where: { id: input.id },
    })
  }),
})
