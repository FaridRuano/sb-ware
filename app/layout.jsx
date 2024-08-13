import '@public/styles/globals.scss'
import { ThemeProvider } from '@context/ThemeContext';
import { UserProvider } from '@context/UserContext';

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
              {children}
            </UserProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  )
}
