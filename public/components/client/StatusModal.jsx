'use client'
import React, { useEffect } from 'react'
import DelBtn from '@public/assets/icons/btn-delete.png'
import Image from 'next/image'


const StatusModal = ({isActive, message, handleModal, full=false}) => {

  useEffect(()=>{
    if(isActive){
      const timer = setTimeout(()=>{
        handleModal()
      },5001)

      return ()=> clearTimeout(timer)
    }
  },[isActive, handleModal])

  if(isActive){
    return (
      <div className={full?'status-container full':'status-container'}>
          <span>
            {message}
          </span>
          <div className='status-close' onClick={()=>handleModal()}>
            <Image src={DelBtn} width={12} height={'auto'} alt="Delete"/>
          </div>
      </div>
    )
  }

  return null
}

export default StatusModal