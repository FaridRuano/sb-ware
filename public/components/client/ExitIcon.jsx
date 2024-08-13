'use client'

import Image from 'next/image'
import Exit from '@public/assets/icons/exit-icon.png'
import { useRouter } from 'next/navigation'
import { useUser } from '@context/UserContext'

const ExitIcon = () => {

  const router = useRouter()

  const { deleteUserInfo } = useUser()
  
  return (
    <div className='btn-icon' id="exit" onClick={()=>{
      deleteUserInfo()
      router.push('/')
      }}>
        <Image src={Exit} width={15} height={'auto'} alt="Exit"/>
    </div>
  )
}

export default ExitIcon