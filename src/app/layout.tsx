import type { Metadata } from "next"
import "./globals.css"
import { SolanaWalletProvider } from "@/components/providers/WalletProvider"
import { ReduxProvider } from "@/providers/ReduxProvider"
import { TopLoader } from "@/components/ui/top-loader"
import { TooltipProvider } from "@radix-ui/react-tooltip"

export const metadata: Metadata = {
  title: "MedX",
  description: "Your personal healthcare assistant",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <TooltipProvider>
          <div className="w-full min-h-screen max-w-screen-md mx-auto flex flex-col justify-center">
            <TopLoader />
            <ReduxProvider>
              <SolanaWalletProvider>{children}</SolanaWalletProvider>
            </ReduxProvider>
          </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
