import { router, publicProcedure } from "../trpc"
import { registrationWaveSchema, registrationPathwaySchema } from "@/lib/validations/school"
import { z } from "zod"

export const registrationRouter = router({
  // Waves
  getWaves: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.registrationWave.findMany({
      orderBy: [{ order: "asc" }, { startDate: "asc" }],
    })
  }),

  createWave: publicProcedure.input(registrationWaveSchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.registrationWave.create({
      data: input,
    })
  }),

  updateWave: publicProcedure
    .input(registrationWaveSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await ctx.prisma.registrationWave.update({
        where: { id },
        data,
      })
    }),

  deleteWave: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.registrationWave.delete({
      where: { id: input.id },
    })
  }),

  // Pathways
  getPathways: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.registrationPathway.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    })
  }),

  createPathway: publicProcedure.input(registrationPathwaySchema).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.registrationPathway.create({
      data: input,
    })
  }),

  updatePathway: publicProcedure
    .input(registrationPathwaySchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await ctx.prisma.registrationPathway.update({
        where: { id },
        data,
      })
    }),

  deletePathway: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.registrationPathway.delete({
      where: { id: input.id },
    })
  }),
})
