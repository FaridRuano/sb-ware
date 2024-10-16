import NavBarBusiness from "@public/components/client/NavBarBusiness";

export default function RootLayout({ children }) {
  return (
    <>
        <NavBarBusiness/>
        {children}
    </>
  )
}
