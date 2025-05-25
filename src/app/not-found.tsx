import { Button } from "@/components/ui/button"
import Link from "next/link"
import BottomNavigation from "@/components/navbar"

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/">
        <Button variant="default">Go to Home</Button>
      </Link>
      <BottomNavigation />
    </main>
  )
}
