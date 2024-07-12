'use client'

import UserIcon from '@public/assets/icons/user-icon.png'
import CheckIcon from '@public/assets/icons/check-icon.png'
import CalendarIcon from '@public/assets/icons/calendar-icon.png'
import DollarIcon from '@public/assets/icons/dollar-icon.png'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const mongoClientData = async () => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/dashboard`, {
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


const Client = () => {

  /* Navigation */
  const router = useRouter()

  //const totalMoney = 1840.52
  const totalSuppostedMoney = 2460
  const [totalMoney, setTotalMoney] = useState(0)

  const fetchAndLoadData = async () => {
    try {
      const fetchData = await mongoClientData()
     
      console.log(fetchData)
      //console.log(paids)
      
        setTotalMoney(fetchData.totalAmount)
        setPaids(fetchData.paids)
        setRecentClients(fetchData.recentClients)
        setMonthlyAverage(fetchData.monthlyAverage)
        setNoPaids(fetchData.nopaids)
        setRecentPays(fetchData.recentPays)
        setRecentAsistance(fetchData.recentAsistance)
        setTotalClients(fetchData.totalClients)

    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    fetchAndLoadData()
  }, [])

  //const paids = 154
  const [paids,setPaids]=useState(1)
  //const nopaids = 24
  const [nopaids,setNoPaids]=useState(1)

  const [recentPays,setRecentPays] =useState( [])

  const [recentClients,setRecentClients] = useState([])

  const [recentAsistance,setRecentAsistance] =useState ([])

  //const totalClients = 278
  const [totalClients,setTotalClients]=useState(1)
  const limitClients = 300

  //const monthlyAverage = 1240.45
  const [monthlyAverage,setMonthlyAverage]=useState(100)

  useEffect(()=>{
    console.log(totalMoney)
    const rootStyles = getComputedStyle(document.documentElement);

    const primaryColorLight = rootStyles.getPropertyValue('--primary-color-light').trim()
    const backgroundColorLight = rootStyles.getPropertyValue('--background-color-light').trim()

    let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".total")

    let progressStartValue = 0,
    progressEndValue = totalMoney,
    speed = 1

    let progress = setInterval(() => {

      if(progressStartValue <= progressEndValue * 0.999){
        progressStartValue = progressStartValue + 10
      }else{
        progressStartValue = progressStartValue + 0.01
      }

      progressValue.textContent = `$${progressStartValue.toFixed(2)}`
      circularProgress.style.background = `conic-gradient(${primaryColorLight} ${((progressStartValue * 100) / totalSuppostedMoney) * 3.6}deg, ${backgroundColorLight} 0deg)`

      if(progressStartValue >= progressEndValue){
        progressStartValue = progressStartValue - 0.01
        progressValue.textContent = `$${progressStartValue.toFixed(2)}`

        clearInterval(progress)
      }
    }, speed)

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
    textSpeed = 5

    let progressPaids = setInterval(() => {

      paidsStartValue++

      paidsText.textContent = `${paidsStartValue}`

      if(paidsStartValue == paidsEndValue){
        clearInterval(progressPaids)
      }
      
    },textSpeed)

    let progressNoPaids = setInterval(() => {

      nopaidsStartValue++

      nopaidsText.textContent = `${nopaidsStartValue}`

      if(paidsStartValue == nopaidsEndValue){
        clearInterval(progressNoPaids)
      }
      
    },textSpeed)

    let progressClients = setInterval(() => {

      clientsStartValue++

      clientsText.textContent = `${clientsStartValue}`

      if(clientsStartValue == clientsEndValue){
        clearInterval(progressClients)
      }
      
    },textSpeed)

    let progressAverage = setInterval(() => {

      if(averageStartValue <= averageEndValue * 0.999){
        averageStartValue = averageStartValue + 10
      }else{
        averageStartValue = averageStartValue + 0.01
      }

      averageText.textContent = `$${averageStartValue.toFixed(2)}`

      if(averageStartValue >= averageEndValue){
        averageStartValue = averageStartValue - 0.01
        averageText.textContent = `$${averageStartValue.toFixed(2)}`
        clearInterval(progressAverage)
      }
      
    },textSpeed)

    let progressBar = document.querySelector(".progress")

    let progressPercentage = (totalClients * 100) / limitClients,
    initialPercentage = 0

    let progressClientsBar = setInterval(() => {

      initialPercentage++

      progressBar.style.width = `${initialPercentage.toFixed(0)}%`

      if(initialPercentage == progressPercentage.toFixed(0)){
        clearInterval(progressClientsBar)
      }
      
    },10)

  },[totalMoney])

  const handleFormatDate = (isoDate) => {
    if(isoDate==null){
      return null
    }
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="home-client">
      <section className="tasks-shortcuts">
        <div className="shortcut">
          <div className="icon-wrap">
            <Image src={DollarIcon} width={20} height={'auto'} alt='User'/>
          </div>
          <span className='name'>
            Registrar Pago
          </span>
        </div>
        <div className="shortcut">
          <div className="icon-wrap">
            <Image src={UserIcon} width={20} height={'auto'} alt='User'/>
          </div>
          <span className='name'>
            Nuevo Cliente
          </span>
        </div>
        <div className="shortcut">
          <div className="icon-wrap">
            <Image src={CheckIcon} width={20} height={'auto'} alt='User'/>
          </div>
          <span className='name'>
            Marcar Asistencia
          </span>
        </div>
        <div className="shortcut">
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
          <span className="date">{new Date().getDate()} | {new Date().toLocaleString('default', { month: 'long' })}</span>
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
                              ${data.amount}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ):(
                <div className='nodata'>
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
            <a>
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
                <div className='nodata'>
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
                Te quedan <b>{limitClients - totalClients}</b> cupos
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
                <div className='nodata'>
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
            <a>
              Ver todos
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Client