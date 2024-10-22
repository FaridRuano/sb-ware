'use client'

import UserIcon from '@public/assets/icons/user-icon.png'
import CheckIcon from '@public/assets/icons/check-icon.png'
import CalendarIcon from '@public/assets/icons/calendar-icon.png'
import DollarIcon from '@public/assets/icons/dollar-icon.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@context/UserContext'

const mongoClientData = async () => {

  const storedUserStr = localStorage.getItem('app.AUTH')

  if(storedUserStr){

    const json = JSON.parse(storedUserStr)
    try {
      const uri = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${uri}/api/client/dashboard?email=${json.data.email}`, {
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


const Client = () => {

  /* User */

  let storedUserStr = ''

  if (typeof window !== "undefined") {
    storedUserStr = localStorage.getItem('app.AUTH')
  }else{
    storedUserStr = ''
  }


  /* Loading Page */

  const [isLoading, setLoading] = useState(true)

  /* Navigation */

  const router = useRouter()

  const [totalSuppostedMoney, setTotalSuppostedMoney] = useState(300)

  const [totalMoney, setTotalMoney] = useState(0)

  const [paids, setPaids] = useState(0)

  const [nopaids, setNoPaids] = useState(0)

  const [recentPays,setRecentPays] =useState([])

  const [recentClients,setRecentClients] = useState([])

  const [recentAsistance,setRecentAsistance] = useState ([])

  const [totalClients, setTotalClients] = useState(0)

  const limitClients = () => {
    if(storedUserStr){
      const json = JSON.parse(storedUserStr)
      return json.data.sub.space
    }else{
      return 100
    }
  }

  const [monthlyAverage, setMonthlyAverage] = useState(0)

  const handleFormatDate = (isoDate) => {
    if(isoDate==null){
      return null
    }
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }

  const actualDate = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const month = monthNames[date.getMonth()]
    return `${day} | ${month}`
  }

  /* Load Page */

  const fetchAndLoadData = async () => {
    try {
      setLoading(true)
      const fetchData = await mongoClientData()
      setTotalMoney(fetchData.totalAmount)
      setPaids(fetchData.paids)
      setNoPaids(fetchData.noPaids)
      setRecentClients(fetchData.recentClients)
      setMonthlyAverage(fetchData.monthlyAverage)
      setRecentPays(fetchData.recentPays)
      setRecentAsistance(fetchData.recentAttent)
      setTotalClients(fetchData.totalClients)
      setTotalSuppostedMoney(fetchData.totalDebt + fetchData.totalAmount)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(()=>{
    if(!isLoading){

      const rootStyles = getComputedStyle(document.documentElement);
  
      const primaryColorLight = rootStyles.getPropertyValue('--primary-color-light').trim()
      const backgroundColorLight = rootStyles.getPropertyValue('--background-color-light').trim()
  
      let circularProgress = document.querySelector(".circular-progress"),
      progressValue = document.querySelector(".total")
  
      let progressStartValue = 0,
      progressEndValue = totalMoney
  
      let progress = setInterval(() => {
  
        if(progressStartValue <= progressEndValue * 0.999){
          progressStartValue = progressStartValue + 10
        }else{
          progressStartValue = progressStartValue + 1
        }
  
        progressValue.textContent = `$${progressStartValue.toFixed(2)}`
        circularProgress.style.background = `conic-gradient(${primaryColorLight} ${((progressStartValue * 100) / totalSuppostedMoney) * 3.6}deg, ${backgroundColorLight} 0deg)`
  
        if(progressStartValue >= progressEndValue){
          progressValue.textContent = `$${totalMoney.toFixed(2)}`
          clearInterval(progress)
        }
      }, .01)
  
      let paidsText = document.getElementById('paids'),
      nopaidsText = document.getElementById('nopaids'),
      clientsText = document.getElementById('clientsNumber'),
      averageText = document.getElementById('averageNumber')
  
      
  
      let paidsStartValue = 0,
      paidsEndValue = paids,
      nopaidsStartValue = 0,
      nopaidsEndValue = nopaids,
      clientsStartValue = 0,
      clientsEndValue = totalClients,
      averageStartValue = 0,
      averageEndValue = monthlyAverage,
      textSpeed = 1
  
      let progressPaids = setInterval(() => {
  
        if(paids === 0){
          clearInterval(progressPaids)
        }else{
          paidsStartValue++
        }
  
        paidsText.textContent = `${paidsStartValue}`
  
        if(paidsStartValue == paidsEndValue){
         
          clearInterval(progressPaids)
        }
        
      },textSpeed)
  
      let progressNoPaids = setInterval(() => {
        if(nopaids === 0 ){
          clearInterval(progressNoPaids)
        }else{
          nopaidsStartValue++
        }
  
        nopaidsText.textContent = `${nopaidsStartValue}`
  
        if(nopaidsStartValue == nopaidsEndValue){
          clearInterval(progressNoPaids)
        }
        
      },textSpeed)
  
      let progressClients = setInterval(() => {
  
        if(totalClients === 0){
          clearInterval(progressClients)
        }else{
          clientsStartValue++
        }
  
        clientsText.textContent = `${clientsStartValue}`
  
        if(clientsStartValue == clientsEndValue){
          clearInterval(progressClients)
        }
        
      },textSpeed)
  
      let progressAverage = setInterval(() => {
        
        if(progressAverage === 0){
          averageText.textContent = `$${monthlyAverage.toFixed(2)}`
          clearInterval(progressAverage)
        }else{
          if(averageStartValue <= averageEndValue * 0.999){
            averageStartValue = averageStartValue + 10
          }else{
            averageStartValue = averageStartValue + 1
          }
        }
        averageText.textContent = `$${averageStartValue.toFixed(2)}`
  
        if(averageStartValue >= averageEndValue){
          averageStartValue = averageEndValue
          averageText.textContent = `$${monthlyAverage.toFixed(2)}`
          clearInterval(progressAverage)
        }
  
      }, .01)
  
      let progressBar = document.querySelector(".progress")
  
      let progressPercentage = (totalClients * 100) / limitClients(),
      initialPercentage = 0

      
      let progressClientsBar = setInterval(() => {
        initialPercentage++
        progressBar.style.width = `${initialPercentage.toFixed(0)}%`
        if(initialPercentage >=  100 - progressPercentage){
          clearInterval(progressClientsBar)
        }
        
      },30)
    }
  },[totalMoney])

  useEffect(() => {
    fetchAndLoadData()
  }, [])

  if(isLoading){
    return (
      <div className="home-client">
        <section className="tasks-shortcuts loading">
          <div className="shortcut"/>
          <div className="shortcut"/>
          <div className="shortcut"/>
          <div className="shortcut"/>
        </section>
        <section className='dashboard-part-01'>
          <div className="money-statistics">
            <div className="total-money loading">
              <div className="circular-progress"/>
            </div>
            <div className="total-paids loading">
              <div className="paids">
              </div>
              <div className="nopaids">
              </div>
            </div>
          </div>
          <div className="datatable-wrap">
            <div className="recent-pays loading"/>
          </div>
        </section>
        <section className="dashboard-part-02">
          <div className="datatable-wrap d2">
            <div className="recent-clients loading"/>
          </div>
          <div className="cards-wrap loading">
              <div className="card"/>
              <div className="card c2"/>
          </div>
          <div className="datatable-wrap d2">
            <div className="recent-clients loading"/>
          </div>
        </section>
      </div>
    )
  }else{
    return (
      <div className="home-client">
        <section className="tasks-shortcuts">
          <div className="shortcut" onClick={()=>router.push('/client/business')}>
            <div className="icon-wrap">
              <Image src={DollarIcon} width={20} height={'auto'} alt='User'/>
            </div>
            <span className='name'>
              Registrar Pago
            </span>
          </div>
          <div className="shortcut" onClick={()=>router.push('/client/business')}>
            <div className="icon-wrap">
              <Image src={UserIcon} width={20} height={'auto'} alt='User'/>
            </div>
            <span className='name'>
              Nuevo Cliente
            </span>
          </div>
          <div className="shortcut" onClick={()=>router.push('/client/business')}>
            <div className="icon-wrap">
              <Image src={CheckIcon} width={20} height={'auto'} alt='User'/>
            </div>
            <span className='name'>
              Marcar Asistencia
            </span>
          </div>
          <div className="shortcut" onClick={()=>router.push('/client/business')}>
            <div className="icon-wrap">
              <Image src={CalendarIcon} width={20} height={'auto'} alt='User'/>
            </div>
            <span className='name'>
              Crear Plan
            </span>
          </div>
        </section>
        <section className='dashboard-part-01'>
          <div className="money-statistics">
            <div className="total-money">
            <span className="date">{actualDate()}</span>
              <span className="total">{0}</span>
              <span className="tag">Total Pagos</span>
              <div className="circular-progress"/>
            </div>
            <div className="total-paids">
              <div className="paids">
                <span className='total-paids' id='paids'>{0}</span>
                <span className='tag'>Pagados</span>
              </div>
              <div className="nopaids">
                <span className='total-paids' id='nopaids'>{0}</span>
                <span className='tag'>No Pagados</span>
              </div>
            </div>
          </div>
          <div className="datatable-wrap">
            <div className="recent-pays">
              {
                recentPays.length > 0 ? (
                  <div className='datatable'>
                    <table>
                      <tbody>
                        {
                          recentPays.map((data, id) => (
                            <tr key={id}>
                              <td>
                                {data.name}
                              </td>
                              <td>
                                {data.plan}
                              </td>
                              <td>
                                {handleFormatDate(data.date)}
                              </td>
                              <td>
                                <b>${data.amount}</b>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div className='datatable'>
                    <span className='nodata-txt'>
                      No existe información aún
                    </span>
                  </div>
                )
              }
            </div>
            <div className="footer-datatable">
              <span>
                Últimos pagos
              </span>
              <a href='/client/business/company'>
                Ver todos
              </a>
            </div>
          </div>
        </section>
        <section className="dashboard-part-02">
          <div className="datatable-wrap d2">
            <div className="recent-clients">
              {
                recentClients.length > 0 ? (
                  <div className='datatable'>
                    <table>
                      <tbody>
                        {
                          recentClients.map((data, id) => (
                            <tr key={id}>
                              <td>
                                {data.name}
                              </td>
                              <td>
                                {data.plan}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div className='datatable'>
                    <span className='nodata-txt'>
                      No existe información aún
                    </span>
                  </div>
                )
              }
            </div>
            <div className="footer-datatable">
              <span>
                Últimos clientes
              </span>
              <a onClick={()=>router.push('/client/business')}>
                Ver todos
              </a>
            </div>
          </div>
          <div className="cards-wrap">
              <div className="card">
                <span className="title">
                  Clientes
                </span>
                <span className="amount" id='clientsNumber'>
                  {0}
                </span>
                <div className="progress-bar">
                  <div className="progress"/>
                </div>
                <span className="footer">
                  Te quedan <b>{limitClients() - totalClients}</b> cupos
                  disponibles
                </span>
              </div>
              <div className="card c2">
                <span className="title">
                  Promedio Ingresos Mensuales
                </span>
                <span className="amount" id='averageNumber'>
                  {0}
                </span>
                <div className="progress-bar">
                </div>
                <span className="footer">
                  Últimos <b>{3}</b> meses
                </span>
              </div>
          </div>
          <div className="datatable-wrap d2">
            <div className="recent-clients">
              {
                recentClients.length > 0 ? (
                  <div className='datatable'>
                    <table>
                      <tbody>
                        {
                          recentAsistance.map((data, id) => (
                            <tr key={id}>
                              <td>
                                {data.name}
                              </td>
                              <td>
                                {handleFormatDate(data.attent)}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div className='datatable'>
                    <span className='nodata-txt'>
                      No existe información aún
                    </span>
                  </div>
                )
              }
            </div>
            <div className="footer-datatable">
              <span>
                Últimas asistencias
              </span>
              <a href='/client/business/company'>
                Ver todos
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }
}


export default Client