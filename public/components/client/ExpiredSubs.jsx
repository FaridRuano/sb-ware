'use client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ExpiredSubs = () => {

    const router = useRouter()

    const [expired, setExpired] = useState(false)

    const fetchUser = async () => {

        let storedUserStr = ''

        if (typeof window !== "undefined") {
          storedUserStr = localStorage.getItem('app.AUTH')
        }else{
          storedUserStr = ''
        }
        
        if (storedUserStr) {
            const info = JSON.parse(storedUserStr)

            const id = {
                id: info.data.id
            }

            try{
                const res = await axios.post('/api/sesion/user', id)

                if(res.data.error){
                    const err = res.data.error
                    console.log(err)
                }else{
                    const expired = res.data.data
                    setExpired(!expired.sub.active)
                }
            }catch(error) {
                console.log(error)
            }
        }else{
            router.push('/')
            return 
        }
    }

    useEffect(()=>{
        fetchUser()
    },[])


    if(expired){
        return (
          <div className='expired-overlay'>
              <div className="text">
                  Renueva tu suscripción para seguir
                  usando la aplicación
              </div>
              <div className="contact">
                  <a href="https://wa.me/+593996447884" target="_blank">
                      Contáctate si tienes problemas
                  </a>
              </div>
          </div>
        )
    }
}

export default ExpiredSubs