'use client'
import DelBtn from '@public/assets/icons/del-icon-big.png'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ClientModal = ({isActive, handleModal, dataModal}) => {

    /* Client */

    const [client, setClient] = useState({})

    /* Loading */

    const [loading, setLoading] = useState(true)

    /* Client Data */

    const fetchClientData = async() => {
        setLoading(true)
        try{
            const res = await axios.post(`/api/client/clients/${dataModal}`)
            setClient(res.data.user)
        }catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        if(isActive){
            fetchClientData()
            setLoading(false)
        }
    },[isActive])

    if(loading){
        return(
            <div className={isActive?'modal-container':'modal-container hidden'}>
                <div className="container loading"/>
            </div>
        )
    }

  return (
    <div className={isActive?'modal-container':'modal-container hidden'}>
        <div className="container">
            <div className="closebtn" onClick={()=> handleModal()}>
                <Image src={DelBtn} width={20} height={'auto'} alt='Close Button'/>
            </div>
            <div className="name-holder">
                <span>Cliente:</span>
                <h1>{client.name}</h1>
            </div>
        </div>
    </div>
  )
}

export default ClientModal