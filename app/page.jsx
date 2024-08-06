'use client'

import { useTheme } from "@context/ThemeContext"
import NavBarMain from "@public/components/NavBarMain"

const Home = () => {
  const {isDarkMode, toggleTheme} = useTheme()

  return (
    <div className="main-page">
      <NavBarMain/>
      {/* <button onClick={toggleTheme}>Change</button> */}
    </div>
  )
}

export default Home