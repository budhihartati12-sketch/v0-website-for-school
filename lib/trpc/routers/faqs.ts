import { router, publicProcedure } from "../trpc"
import { faqSchema } from "@/lib/validations/school"
import { z } from "zod"

export const faqsRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.fAQ.findMany({
        where: input?.category ? { category: input.category } : undefined,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      })
    }),

  create: publicProcedure.input(faqSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.fAQ.create({
      data: input,
    })
  }),

  update: publicProcedure.input(faqSchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    return await ctx.prisma.fAQ.update({
      where: { id },
      data,
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.fAQ.delete({
      where: { id: input.id },
    })
  }),
})
