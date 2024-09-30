'use client'
import LogoNavBar from "@public/assets/icons/logo-navbar.png"
import LogoNavBarDark from "@public/assets/icons/logo-navbar-dark.png"
import Menu from "@public/assets/icons/menu-icon.png"
import LogIn from "@public/assets/icons/login-icon.png"
import Close from "@public/assets/icons/del-icon-big.png"
import { useTheme } from "@context/ThemeContext"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Script from "next/script"
import { useUser } from "@context/UserContext"

const useWindowSize = () => {

    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    })
  
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
  
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    }, [])
  
    return windowSize
}

const NavBarMain = () => {

    const [isLogged, setLogged] = useState(false)

    const router = useRouter()

    const {isDarkMode} = useTheme()

    const size = useWindowSize()

    const [menu, setMenu] = useState(false)

    useEffect(() => {
        if (menu) {
          document.body.classList.add('no-scroll')
        } else {
          document.body.classList.remove('no-scroll')
        }
    }, [menu])

    useEffect(()=>{
        let storedUserStr = ''

        if (typeof window !== "undefined") {
          storedUserStr = localStorage.getItem('app.AUTH')
        }else{
          storedUserStr = ''
        }

        if(storedUserStr){
            setLogged(true)
        }else{
            setLogged(false)
        }
    },[])

    if(size.width > 800){
        return (
            <>
                <Script src="/utils/scrollSection.js"/>
                <div className="logo-navbar">
                    {
                        isDarkMode ? (
                            <Image src={LogoNavBarDark} height={40} width={'auto'} alt="Logo" onClick={()=>scrollToSection('main')}/>    
                        ):(
                            <Image src={LogoNavBar} height={40} width={'auto'} alt="Logo" onClick={()=>scrollToSection('main')}/>    
                        )
                    }
                </div>
                <nav className="main-navbar">
                    <ul className="items-wrap">
                        <li className="nav-item" onClick={()=>scrollToSection('prices')}>
                            Precios
                        </li>
                        <li className="nav-item" onClick={()=>scrollToSection('contact')}>
                            Contáctate
                        </li>
                    </ul>
                    <ul className="items-wrap">
                        <li className="nav-item" onClick={()=>{
                            if(isLogged){
                                router.push('/client')
                            }else{
                                router.push('/login')
                            }
                        }}>
                            Crear Cuenta
                        </li>
                        <li className="btn01" onClick={()=>{
                            if(isLogged){
                                router.push('/client')
                            }else{
                                router.push('/login')
                            }
                        }}>
                            Ingresar
                        </li>
                    </ul>
                </nav>
            </>
          )
    }else{
        return(
            <>
                <Script src="/utils/scrollSection.js"/>
                <div className="main-navbar-min">
                    <div className="nav-item" onClick={()=>setMenu(true)}>
                        <Image src={Menu} width={25} height={'auto'} alt="Menu"/>
                    </div>
                    <div className="nav-item">
                        <Image src={LogoNavBarDark} width={'auto'} height={30} alt="Sb Ware" onClick={()=>scrollToSection('main')}/>
                    </div>
                    <div className="nav-item"onClick={()=>{
                            if(isLogged){
                                router.push('/client')
                            }else{
                                router.push('/login')
                            }
                        }}>
                        <Image src={LogIn} width={20} height={'auto'} alt="LogIn"/>
                    </div>
                </div>
                <div className={menu ? "menu-overlay" : "menu-overlay off"}>
                    <div className="menu-close" onClick={()=>setMenu(false)}>
                        <Image src={Close} width={35} height={'auto'} alt="Close"/>
                    </div>
                    <ul className="items-wrap">
                        <li className="nav-item" onClick={()=>{
                            scrollToSection('main')   
                            setMenu(false)
                        }}>
                            Inicio
                        </li>
                        <li className="nav-item" onClick={()=>{
                            scrollToSection('prices')   
                            setMenu(false)
                        }}>
                            Precios
                        </li>
                        <li className="nav-item" onClick={()=>{
                            scrollToSection('contact')   
                            setMenu(false)
                        }}>
                            Contáctate
                        </li>
                        <li className="nav-item">
                            Crear Cuenta
                        </li>
                        <li className="nav-item btn01" onClick={()=>{
                            if(isLogged){
                                router.push('/client')
                            }else{
                                router.push('/login')
                            }
                        }}>
                            Ingresar
                        </li>
                    </ul>
                </div>
            </>
        )
    }

  
}

export default NavBarMain