import { router, publicProcedure } from "../trpc"
import { schoolProfileSchema } from "@/lib/validations/school"
import { z } from "zod"

export const schoolRouter = router({
  getProfile: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.schoolProfile.findFirst({
      orderBy: { createdAt: "desc" },
    })
  }),

  updateProfile: publicProcedure
    .input(schoolProfileSchema.partial().extend({ id: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      if (id) {
        return await ctx.prisma.schoolProfile.update({
          where: { id },
          data,
        })
      } else {
        // Create new profile if none exists
        return await ctx.prisma.schoolProfile.create({
          data: data as any,
        })
      }
    }),
})
