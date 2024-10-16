'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'


const NavBarBusiness = () => {
  
  const router = useRouter()

  /* Handle Active */

  const [activePage, setActivePage] = useState('')

  const handleActivePage = (id) => {

      setActivePage(id)

      router.push(id)
  }


  useEffect(()=>{
        
    const path = window.location.pathname;

    if(path){
        setActivePage(path)
    }

  },[])
  return (
    <nav className="navbar-business">
      <ul>
        <li className={activePage === '/client/business' ? 'active':''}  onClick={()=>handleActivePage('/client/business')}>
          Clientes
        </li>
        <li className={activePage === '/client/business/company' ? 'active':''} onClick={()=>handleActivePage('/client/business/company')}>
          Negocio
        </li>
        <li className={activePage === '/client/business/register' ? 'active':''} onClick={()=>handleActivePage('/client/business/register')}>
          Registros
        </li>
      </ul>
    </nav>
  )
}

export default NavBarBusiness