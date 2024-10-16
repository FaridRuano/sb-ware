'use client'

import Image from 'next/image'
import CheckIcon from '@public/assets/icons/checkbox-icon.png'
import React, { useState } from 'react'

const CheckedBox = ({checked, onChange}) => {

  const [isActive, setActive] = useState(checked || false)

  const handleActive = () => {
    setActive(current => !current)
    if (onChange) {
      onChange()
    }
  }

  return (
    <div className={isActive ? 'check-box active' : 'check-box'} onClick={()=>handleActive()}>
      <Image src={CheckIcon} width={12} height={'auto'} alt='Check'/>
    </div>
  )
}

export default CheckedBox