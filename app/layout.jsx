import '@public/styles/globals.scss'
import { ThemeProvider } from '@context/ThemeContext';
import { UserProvider } from '@context/UserContext';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: "Sb Ware",
  description: "Subscription Based Software Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="app">
          <ThemeProvider>
            <UserProvider>
              <SpeedInsights/>
              {children}
            </UserProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
