import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProgramsSection } from "@/components/programs-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <div id="programs-section">
          <ProgramsSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
