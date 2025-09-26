import { router } from "./trpc"
import { schoolRouter } from "./routers/school"
import { leadershipRouter } from "./routers/leadership"
import { facilitiesRouter } from "./routers/facilities"
import { programsRouter } from "./routers/programs"
import { subjectsRouter } from "./routers/subjects"
import { registrationRouter } from "./routers/registration"
import { faqsRouter } from "./routers/faqs"

export const appRouter = router({
  school: schoolRouter,
  leadership: leadershipRouter,
  facilities: facilitiesRouter,
  programs: programsRouter,
  subjects: subjectsRouter,
  registration: registrationRouter,
  faqs: faqsRouter,
})

export type AppRouter = typeof appRouter
