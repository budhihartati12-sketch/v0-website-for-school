import { router, publicProcedure } from "../trpc"
import { facilitySchema } from "@/lib/validations/school"
import { z } from "zod"

export const facilitiesRouter = router({
  getAll: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.facility.findMany({
        where: input?.category ? { category: input.category } : undefined,
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      })
    }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return await ctx.prisma.facility.findUnique({
      where: { id: input.id },
    })
  }),

  create: publicProcedure.input(facilitySchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.facility.create({
      data: input,
    })
  }),

  update: publicProcedure.input(facilitySchema.extend({ id: z.string() })).mutation(async ({ ctx, input }) => {
    const { id, ...data } = input
    return await ctx.prisma.facility.update({
      where: { id },
      data,
    })
  }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.facility.delete({
      where: { id: input.id },
    })
  }),
})
