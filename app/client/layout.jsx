import ExitIcon from "@public/components/client/ExitIcon";
import ExpiredSubs from "@public/components/client/ExpiredSubs";
import NavBarClient from "@public/components/client/NavBarClient";
import SbIcon from "@public/components/client/SbIcon";

export default function RootLayout({ children }) {
  return (
    <div className="client-page">
        <NavBarClient/>
        <ExitIcon/>
        <SbIcon/>
        <ExpiredSubs/>
        {children}
    </div>
  )
}
