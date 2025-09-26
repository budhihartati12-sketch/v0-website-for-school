import { router, publicProcedure } from "../trpc"
import { leadershipSchema } from "@/lib/validations/school"
import { z } from "zod"

export const leadershipRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.leadership.findMany({
        where: input?.category ? { category: input.category } : undefined,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      })
    }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.leadership.findUnique({
      where: { id: input.id },
    })
  }),

  create: publicProcedure.input(leadershipSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.leadership.create({
      data: input,
    })
  }),

  update: publicProcedure.input(leadershipSchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    return await ctx.prisma.leadership.update({
      where: { id },
      data,
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.leadership.delete({
      where: { id: input.id },
    })
  }),

  reorder: publicProcedure
    .input(z.object({ items: z.array(z.object({ id: z.string(), order: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      const updates = input.items.map((item) =>
        ctx.prisma.leadership.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      )
      return await Promise.all(updates)
    }),
})
