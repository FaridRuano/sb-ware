'use client'

import Image from 'next/image'
import BusinessIcon from '@public/assets/icons/my-business.png'
import MyPaids from '@public/assets/icons/my-paids.png'
import CancelPlan from '@public/assets/icons/cancel-plan.png'
import ChangePlan from '@public/assets/icons/change-plan.png'
import ViewIcon from '@public/assets/icons/view-icon.png'
import DownloadIcon from '@public/assets/icons/download-icon.png'
import WarningIcon from '@public/assets/icons/warning-icon.png'
import { useEffect, useState } from 'react'

const fetchCliData = async () => {


  let storedUserStr = ''

  if (typeof window !== "undefined") {
    storedUserStr = localStorage.getItem('app.AUTH')
  }else{
    storedUserStr = ''
  }

  if(storedUserStr){

    const json = JSON.parse(storedUserStr)
    try {
      const uri = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${uri}/api/client/config?email=${json.data.email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        throw new Error("Failed")
      }
      const ponse = await res.json()
      return ponse
    } catch (error) {
      console.log(error)
    }
  }
}

const fetchPostData = async (editData) => {

  const storedUserStr = localStorage.getItem('app.AUTH')

  if(storedUserStr){

    const json = JSON.parse(storedUserStr)

    try {
      const uri = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${uri}/api/client/config?email=${json.data.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editData),

      })

      if (!res.ok) {
        throw new Error("Failed")
      }
      const ponse = await res.json()

      return ponse

    } catch (error) {
      console.log(error)
    }
  }
}

const Config = () => {

  /* Active Option */

  const [activeOption, setActiveOption] = useState(0)

  /* Business Info */

  const [businesInfo, setBusinesInfo] = useState({
    socialName: '',
    ruc: '',
    email: '',
    phone: '',
    address: '',
  })

  const [subType, setSubType] = useState('')

  const [expireDate, setExpireDate] = useState(new Date())

  const [space, setSpace] = useState(0)

  const [spaceRemain, setSpaceRemain] = useState(0)

  const [editInfo, setEditInfo] = useState(false)

  const daysUntilPay = (date, plan) => {
    const inputDate = new Date(date);
    
    const dayOfMonth = inputDate.getDate();
    const currentMonth = inputDate.getMonth();
    const currentYear = inputDate.getFullYear();
    
    let nextDate;
    
    if (plan.endsWith('M')) { // Monthly plan
        const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        nextDate = new Date(nextYear, nextMonth, dayOfMonth);
    } else if (plan.endsWith('A')) { // Annual plan
        const nextYear = currentYear + 1;
        nextDate = new Date(nextYear, currentMonth, dayOfMonth);
    } else if (plan.endsWith('360')) { // Special case for 360-day plans
        nextDate = new Date(inputDate);
        nextDate.setDate(nextDate.getDate() + 360); // Add 360 days
    } else {
        console.error('Unknown plan type');
        return;
    }
    
    const differenceInMillis = nextDate - inputDate;
    const differenceInDays = Math.round(differenceInMillis / (1000 * 60 * 60 * 24));
    
    setExpireDate(differenceInDays);
}

  const handleEditInfo = () => {
    setEditForm(businesInfo)
    setEditInfo(current => !current)
  }

  const [editForm, setEditForm] = useState({
    id: '',
    socialName: '',
    ruc: '',
    email: '',
    phone: '',
    address: '',
  })

  const [errorMsg, setErrorMsg] = useState("")

  const [errorForm, setErrorForm] = useState(false)

  const handleEditForm = (e) => {
    const { name, value } = e.target

    if (name === 'ruc') {
      if (!/^\d*$/.test(value) || value.length > 13) {
          return
      }
    }
    if (name === 'phone') {
      if (!/^\d*$/.test(value) || value.length > 10) {
          return
      }
    }
    if (name === 'address') {
      if (value.length > 100) {
          return
      }
    }
    if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            if (value.length < 1) {
                setErrorMsg("")
                setErrorForm(false)
            } else {
                setErrorForm(true)
                setErrorMsg("Email no válido.")
            }
        } else {
            setErrorForm(false)
            setErrorMsg("")
        }
    }

    setEditForm({
        ...editForm,
        [name]: value,
    })
  }

  const isBusInfoSendable = () => {

    if(editForm.ruc.length > 0){
      if(editForm.ruc.length < 13){
        return false
      }
    }
    if(editForm.phone.length > 0){
      if(editForm.phone.length < 10){
        return false
      }
    }

    return true

  }

  const handleSubmitEdit = async () => {

    setLoading(true)

    const editData = {
      name: editForm.socialName,
      ruc: editForm.ruc,
      emailRuc: editForm.email,
      phone: editForm.phone,
      address: editForm.address
    }


    try{
      await fetchPostData(editData)
    }catch(e){
      console.log(e)
    }
    fetchAndLoadData()
    handleEditInfo()
    setLoading(false)
  }

  /* Paids */

  const [paids, setPaids] = useState([])

  const ActiveDashboard = () => {

    switch (activeOption) {
      case 0:
        return (
          <>
            <div className="form-config">
              <div className="form-header">
                Información de la Empresa
              </div>
              <div className="form-body">
                {
                  editInfo ? (
                    <>
                      <div className="input-config">
                          <div className='edit'>
                            Razón Social
                          </div>
                          <input type="text" placeholder='Mi empresa' name='socialName' value={editForm.socialName} onChange={handleEditForm} maxLength={20}/>
                        </div>
                        <div className="input-config">
                          <div className='edit'>
                            RUC
                          </div>
                          <input type="text" placeholder='9999999999999' name='ruc' value={editForm.ruc} onChange={handleEditForm} maxLength={13}/>
                        </div>  
                        <div className="input-config">
                          <div className='edit'>
                            Email
                          </div>
                          <input type="text" placeholder='user@email.com' name='email' value={editForm.email} onChange={handleEditForm}/>
                        </div>  
                        <div className="input-config">
                          <div className='edit'>
                            Teléfono
                          </div>
                          <input type="text" placeholder='0998887777' name='phone' value={editForm.phone} onChange={handleEditForm} maxLength={10}/>
                        </div>  
                        <div className="input-config">
                          <div className='edit'>
                            Dirección
                          </div>
                          <input type="text" placeholder='Ecuador' name='address' maxLength={100} value={editForm.address} onChange={handleEditForm}/>
                        </div>
                        <div className="form-footer">
                              <div className="errors-config">
                          {
                            errorForm && (
                              <>
                                <Image src={WarningIcon} width={20} height={'auto'} alt='Warning'/>
                                <span>
                                  {errorMsg}
                                </span>
                              </>
                            )
                          }
                              </div>
                          <div className="buttons-config">
                            <button type="button" className='button default' onClick={()=>{
                              handleEditInfo()
                              setEditForm(businesInfo)
                              setErrorMsg("")
                              setErrorForm(false)
                            }}>
                                Cancelar
                            </button>
                            <button type="button" className={isBusInfoSendable() ? 'button primary':'button primary disabled'} disabled={!isBusInfoSendable()} onClick={()=>handleSubmitEdit()}>Guardar</button>
                          </div>
                        </div>
                    </>
                  ):(
                    <>
                      <div className="input-config">
                        <div>
                          Razón Social
                        </div>
                        <input type="text" placeholder='Mi empresa' name='socialName' value={businesInfo.socialName} disabled/>
                      </div>
                      <div className="input-config">
                        <div>
                          RUC
                        </div>
                        <input type="text" placeholder='9999999999999' name='ruc' value={businesInfo.ruc} disabled/>
                      </div>  
                      <div className="input-config">
                        <div>
                          Email
                        </div>
                        <input type="text" placeholder='user@email.com' name='email' value={businesInfo.email} disabled/>
                      </div>  
                      <div className="input-config">
                        <div>
                          Teléfono
                        </div>
                        <input type="text" placeholder='0998887777' name='phone' value={businesInfo.phone} disabled/>
                      </div>  
                      <div className="input-config">
                        <div>
                          Dirección
                        </div>
                        <input type="text" placeholder='Ecuador' name='address' value={businesInfo.address} disabled/>
                      </div>
                      <div className="form-footer one">
                        <div className="buttons-config">
                          <button type="button" className='button' onClick={()=>handleEditInfo()}>Editar</button>
                        </div>
                      </div>
                    </>
                  )
                }
              </div>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="header-dt">
              <h1>
                Facturas e historial de facturación
              </h1>
              <p>
                Revisa tu historial de facturación y gestiona las facturas.
              </p>
            </div>
            <div className="paids-config">
              {
                paids.length > 1 ? (
                  <>
                    <table className='dt-all'>
                      <thead>
                          <tr className='config-paids-dt'>
                              <th>
                                  Fecha
                              </th>
                              <th>
                                  Número de Autorización
                              </th>
                              <th>
                                  Plan
                              </th>
                              <th>
                                  Cantidad
                              </th>
                              <th>
                                  Opciones
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {
                              paids.map((paid, id) => (
                                  <tr key={id} className='config-paids-dt'>
                                      <td>
                                          {paid.date}
                                      </td>
                                      <td>
                                          {paid.noAutorization}
                                      </td>
                                      <td>
                                          {paid.plan}
                                      </td>
                                      <td>
                                          ${paid.amount}
                                      </td>
                                      <td className='actions'>
                                        <div className="tool-btn">
                                          <div className="tool-tip">
                                            Ver XML
                                          </div>
                                          <div className="tool-icon">
                                            <Image src={ViewIcon} width={20} height={'auto'} alt='View'/>
                                          </div>
                                        </div>
                                        <div className="tool-btn">
                                          <div className="tool-tip">
                                            Descargar PDF
                                          </div>
                                          <div className="tool-icon">
                                            <Image src={DownloadIcon} width={20} height={'auto'} alt='Download'/>
                                          </div>
                                        </div>
                                      </td>
                                  </tr>
                              ))
                          }
                      </tbody>
                    </table>
                    <div className="dt-footer">
                      Solo se puede acceder al historial de facturas de los últimos 12 meses anteriores a través de la cuenta.
                    </div>
                  </>
                ):(
                  <>
                    No existen datos
                  </>
                )
              }
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="header-dt">
              <h1>
                Mi Suscripción
              </h1>
              <p>
                Puedes cancelar o expandir tu suscripción en cualquier momento.
              </p>
            </div>
            <div className="plan-cf">
              <div className="actual-sb">
                <div className="details">
                  <span>
                    Vence en {expireDate} días.
                  </span>
                  <h1>
                    {subType}
                  </h1>
                  <p>
                    Capacidad de {space} clientes.
                  </p>
                </div>
                <div className="details two">
                  <span>
                    Espacio Usado.
                  </span>
                  <h1>
                    {spaceRemain}
                  </h1>
                  <p>
                    Clientes.
                  </p>
                </div>
              </div>
            </div>
            <div className="options-cf">
              <a href="https://wa.me/+593996447884" target="_blank">
                <div className='update-plan'>
                  Expandir mi espacio
                </div>
              </a>
              
              <a href="https://wa.me/+593996447884" target="_blank">
                <span>
                    Cancelar mi suscripción.
                </span>
              </a>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="header-dt">
              <h1>
                Soporte al usuario
              </h1>
              <p>
                Envía un mensaje directo para reportar errores o problemas en el sistema.
              </p>
            </div>
            <a href="https://wa.me/+593996447884" target="_blank">
              <div className="contact-cf">
                Empezar Discusión
              </div>
            </a>
          </>
        )
    }
  }

  const [isLoading, setLoading] = useState(true)

  const fetchAndLoadData = async () => {
    try {
      setLoading(true)
      const fetchData = await fetchCliData()
      if(fetchData){
        setBusinesInfo({
          socialName: fetchData.business.name,
          ruc: fetchData.business.ruc,
          email: fetchData.business.email,
          phone: fetchData.business.phone,
          address: fetchData.business.address,
        })
        setPaids(fetchData.sub.paids || [])
        setSubType(fetchData.sub.plan)
        setSpace(fetchData.sub.space)
        setSpaceRemain(fetchData.sub.space - fetchData.totalCli)
        daysUntilPay(fetchData.sub.paydate, fetchData.sub.plan)
        
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    fetchAndLoadData()
  },[])

  if(isLoading) {
    return (
      <>
        <section className='business-options loading'>
          <div className="business-card">
          </div>
          <div className="business-btns">
            <div className="business-btn">
            </div>
            <div className="business-btn secondary">
            </div>
            <div className="business-btn warning">
            </div>
          </div>
        </section>
        <section className="business-dashboard">

        </section>
      </>
  
    )
  }else{
    return (
      <>
        <section className='business-options'>
          <div className={activeOption === 0 ? "business-card active":"business-card"} onClick={()=>setActiveOption(0)}>
            <div className="card-icon">
              <Image src={BusinessIcon} width={90} height={'auto'} alt='Bussiness'/>
            </div>
            <div className="card-title">
              <p>
                Mi empresa
              </p>
              <h1>
                {businesInfo.socialName || 'S/N'}
              </h1>
            </div>
          </div>
          <div className="business-btns">
            <div className={activeOption === 1 ? "business-btn active":"business-btn"} onClick={()=>setActiveOption(1)}>
              <div className="business-btn-icon">
                <Image src={MyPaids} width={25} height={'auto'} alt='My Paids'/>
              </div>
              <div className="business-title">
                Mis pagos
              </div>
            </div>
            <div className={activeOption === 2 ? "business-btn secondary active":"business-btn secondary"} onClick={()=>setActiveOption(2)}>
              <div className="business-btn-icon">
                <Image src={ChangePlan} width={25} height={'auto'} alt='My Paids'/>
              </div>
              <div className="business-title">
                Configurar Suscripción
              </div>
            </div>
            <div className={activeOption === 3 ? "business-btn warning active":"business-btn warning"} onClick={()=>setActiveOption(3)}>
              <div className="business-btn-icon">
                <Image src={CancelPlan} width={25} height={'auto'} alt='My Paids'/>
              </div>
              <div className="business-title">
                Reportar errores y Ayuda
              </div>
            </div>
          </div>
        </section>
        <section className="business-dashboard">
          {
            ActiveDashboard()
          }
        </section>
      </>
  
    )
  }

}

export default Config