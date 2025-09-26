import { createTRPCNext } from "@trpc/next"
import type { AppRouter } from "./root"
import superjson from "superjson"

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        {
          type: "http",
          url: "/api/trpc",
        },
      ],
    }
  },
  ssr: false,
})
