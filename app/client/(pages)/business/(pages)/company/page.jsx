'use client'
import DtPlans from '@public/components/client/DtPlans'
import DtClients from '@public/components/client/DtClients'
import React, { useEffect, useState } from 'react'
import DtAsis from '@public/components/client/DtAsis'
import Dtpaids from '@public/components/client/DtPaids'
const mongoClientData = async () => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/client`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Failed")
    }
    const ponse = await res.json()
    return ponse.clients
  } catch (error) {
    console.log(error)
  }
}
const mongoPlanData = async () => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/plan`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Failed")
    }
    const ponse = await res.json()
    return ponse.plans
  } catch (error) {
    console.log(error)
  }
}

const mongoAttenData = async () => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/atten`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Failed")
    }
    const ponse = await res.json()
    return ponse.clients
  } catch (error) {
    console.log(error)
  }
}

const mongoPyamentData = async () => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/payment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!res.ok) {
      throw new Error("Failed")
    }
    const ponse = await res.json()
    return ponse.payments
  } catch (error) {
    console.log(error)
  }
}

const Company = () => {

  /* Loading Page */

  const [isLoading, setLoading] = useState(true)

  /* Clients */

  const [isDtClient, setDtClient] = useState(false)

  const handleDtClient = (action) => {
    if (action === 'open') {
      setDtClient(true)
    } else {
      fetchAndLoadData()
      setDtClient(false)
    }
  }

  const fetchAndLoadData = async () => {
    try {
      setLoading(true)
      const fetchData = await mongoClientData()
      const planData = await mongoPlanData()
      const attenData= await mongoAttenData()
      const paymentData= await mongoPyamentData()
      if (fetchData.length >= 0) {
        setClientData(fetchData)
      }
      if (planData.length >= 0) {
        setPlanData(planData)
      }
      if (attenData.length >= 0) {
        setAsisData(attenData)
      }
      if (paymentData.length >= 0) {
        setPaidsData(paymentData)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const [clientData, setClientData] = useState([])

  /* Plans */
  const [isDtPlan, setDtPlan] = useState(false)

  const handleDtPlan = (action) => {
    if (action === 'open') {
      setDtPlan(true)
    } else {
      setDtPlan(false)
    }
  }

  const [planData, setPlanData] = useState([])

  /* Asistances */

  const [isDtAsis, setDtAsis] = useState(false)

  const handleDtAsis = (action) => {
    if (action === 'open') {
      setDtAsis(true)
    } else {
      setDtAsis(false)
    }
  }

  const handleFormatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  const [asisData, setAsisData] = useState([])

  /* Paids */

  const [isDtPaids, setDtPaids] = useState(false)

  const handleDtPaids = (action) => {
    if (action === 'open') {
      setDtPaids(true)
    } else {
      setDtPaids(false)
    }
  }

  const [paidsData, setPaidsData] = useState([])

  /* Fetch */

  useEffect(() => {
    fetchAndLoadData()
  }, [])

  if(isLoading){
    return (
      <div className='company-page'>
        <DtPlans isActive={isDtPlan} handleActive={handleDtPlan} />
        <DtClients isActive={isDtClient} handleActive={handleDtClient} />
        <DtAsis isActive={isDtAsis} handleActive={handleDtAsis} />
        <Dtpaids isActive={isDtPaids} handleActive={handleDtPaids} />
        <section className='charts-section loading'>
          <div className="container-option">
          </div>
          <div className="container-option">
          </div>
        </section>
        <section className='charts-section loading'>
          <div className="container-option">
          </div>
          <div className="container-option">
          </div>
        </section>
        <section className='charts-section loading'>
          <div className="container-option">
          </div>
          <div className="container-option">
          </div>
        </section>
        <section className='charts-section loading'>
          <div className="container-option">
          </div>
          <div className="container-option">
          </div>
        </section>
      </div>
    )
  }else{
    return (
      <div className='company-page'>
        <DtPlans isActive={isDtPlan} handleActive={handleDtPlan} />
        <DtClients isActive={isDtClient} handleActive={handleDtClient} />
        <DtAsis isActive={isDtAsis} handleActive={handleDtAsis} />
        <Dtpaids isActive={isDtPaids} handleActive={handleDtPaids} />
        <section className='charts-section'>
          <div className={"container-option"} onClick={() => handleDtClient('open')}>
            <span className='title-body'>
              Clientes
            </span>
          </div>
          <div className="container-option" onClick={() => handleDtClient('open')}>
            <div className="dt-body ">
              {
                clientData.length >= 1 ? (
                  <table className="dt-all">
                    <tbody>
                      {
                        clientData.map((cli, id) => (
                          <tr key={id} className='clients-dt'>
                            <td>
                              {cli.id}
                            </td>
                            <td>
                              {cli.name}
                            </td>
                            <td>
                              {cli.ced}
                            </td>
                            <td>
                              {cli.email}
                            </td>
                            <td>
                              {cli.phone}
                            </td>
                            <td>
                              {cli.address}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <div className="dt-empty">
                    No existe información para mostrar
                  </div>
                )
              }
            </div>
          </div>
        </section>
        <section className='charts-section'>
          <div className={"container-option"} onClick={() => handleDtPlan('open')}>
            <span className='title-body'>
              Planes
            </span>
          </div>
          <div className="container-option">
            <div className="dt-body ">
              {
                planData.length >= 1 ? (
                  <table className="dt-all">
                    <tbody>
                      {
                        planData.map((pla, id) => (
                          <tr key={id} className='plan-dt' onClick={() => handleDtPlan('open')}>
                            <td>
                              {pla.id}
                            </td>
                            <td>
                              {pla.name}
                            </td>
                            <td>
                              {pla.dura}
                            </td>
                            <td>
                              {pla.asis}
                            </td>
                            <td>
                              <b>${pla.cost}</b>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <div className="dt-empty">
                    No existe información para mostrar
                  </div>
                )
              }
            </div>
          </div>
        </section>
        <section className='charts-section'>
          <div className={"container-option"} onClick={() => handleDtAsis('open')}>
            <span className='title-body'>
              Asistencias
            </span>
          </div>
          <div className="container-option">
            <div className="dt-body ">
              {
                asisData.length >= 1 ? (
                  <table className="dt-all">
                    <tbody>
                      {
                        asisData.map((asi, id) => (
                          <tr key={id} className='asis-dt' onClick={() => handleDtAsis('open')}>
                            <td>
                              {asi.id}
                            </td>
                            <td>
                              {asi.name}
                            </td>
                            <td>
                              {handleFormatDate(asi.date)}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <div className="dt-empty">
                    No existe información para mostrar
                  </div>
                )
              }
            </div>
          </div>
        </section>
        <section className='charts-section'>
          <div className={"container-option"} onClick={() => handleDtPaids('open')}>
            <span className='title-body'>
              Pagos
            </span>
          </div>
          <div className="container-option">
            <div className="dt-body ">
              {
                paidsData.length >= 1 ? (
                  <table className="dt-all">
                    <tbody>
                      {
                        paidsData.map((pai, id) => (
                          <tr key={id} className='paids-dt' onClick={() => handleDtPaids('open')}>
                            <td>
                              {pai.id}
                            </td>
                            <td>
                              {pai.name}
                            </td>
                            <td>
                              {handleFormatDate(pai.date)}
                            </td>
                            <td>
                              <b>${pai.amount}</b>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <div className="dt-empty">
                    No existe información para mostrar
                  </div>
                )
              }
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Company