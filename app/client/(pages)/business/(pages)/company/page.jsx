'use client'
import DtPlans from '@public/components/client/DtPlans'
import DtClients from '@public/components/client/DtClients'
import React, { useState } from 'react'

const Company = () => {

  /* Clients */
  const [clientCont, setClientCont] = useState(1)

  const handleClientConst = (op) => {
    if(clientCont === op) {
      return
    }else{
      setClientCont(op)
    }
  }

  const [isDtClient, setDtClient] = useState(false)

  const handleDtClient = (action) => {
    if(action === 'open'){
      setDtClient(true)
    }else{
      setDtClient(false)
    }
  }

  const [clientData, setClientData] = useState([
    {
      id: 1,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    },
    {
      id: 2,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    },
    {
      id: 3,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    },
    {
      id: 4,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    },
    {
      id: 5,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    }, 
    {
      id: 6,
      ced: '1805467527',
      name: 'Farid Ruano',
      email: 'fruanocm2777@gmail.com',
      phone: '0996447884',
      address: 'Ambato'
    }
  ])

  /* Plans */
  const [planCont, setPlanCont] = useState(1)

  const handlePlanConst = (op) => {
    if(planCont === op) {
      return
    }else{
      setPlanCont(op)
    }
  }

  const [isDtPlan, setDtPlan] = useState(false)

  const handleDtPlan = (action) => {
    if(action === 'open'){
      setDtPlan(true)
    }else{
      setDtPlan(false)
    }
  }

  const [planData, setPlanData] = useState([
    {
      id: 1,
      name: 'Plan Guaytambo',
      duration: 30,
      asis: 30,
      costo: 30
    },
    {
      id: 2,
      name: 'Plan Guaytambo 2',
      duration: 40,
      asis: 40,
      costo: 40
    },
    {
      id: 3,
      name: 'Plan Guaytambo 3',
      duration: 50,
      asis: 50,
      costo: 50
    },
    {
      id: 4,
      name: 'Plan Guaytambo 4',
      duration: 50,
      asis: 50,
      costo: 50
    },
    {
      id: 5,
      name: 'Plan Guaytambo 5',
      duration: 50,
      asis: 50,
      costo: 50
    }, 
    {
      id: 6,
      name: 'Plan Guaytambo 6',
      duration: 50,
      asis: 50,
      costo: 50
    }
  ])



  return (
    <div className='company-page'>
      <DtPlans isActive={isDtPlan} handleActive={handleDtPlan}/>
      <DtClients isActive={isDtClient} handleActive={handleDtClient}/>
      <section className='charts-section'>
        <div className={"container-option"} onClick={()=>handleDtClient('open')}>
          <span className='title-body'>
            Clientes
          </span>
        </div>
        <div className="container-option" onClick={()=>handleDtClient('open')}>
          {
            clientCont === 1 ?
            (
              <div className="dt-body ">
                {
                  clientData.length > 1 ? (
                    <table className="dt-all">
                      <tbody>
                        {
                          clientData.map((cli, id)=>(
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
                  ):(
                    <div className="dt-empty">
                      No existe información para mostrar
                    </div>
                  )
                }
              </div>
            ):
            (
              <form className='form-dt'>
                <div className="header-form">
                  Información del Nuevo Plan
                </div>
                <div className="cols">
                  <div className="col">
                    <div className="input-form sm">
                      <label>Nombre</label>
                      <input type="text" name="name" placeholder='Plan #1'/>
                    </div>
                    <div className="input-form sm">
                      <label>Duración</label>
                      <input type="number" name="dura" placeholder='Dias'/>
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-form sm">
                      <label>Asistencias</label>
                      <input type="number" name="asis" placeholder='30'/>
                    </div>
                    <div className="input-form sm">
                      <label>Costo</label>
                      <input type="number" name="cost" placeholder='$10.00'/>
                    </div>
                  </div>
                </div>
                <div className="submit">
                  <button type='submit'>
                    Guardar
                  </button>
                </div>
              </form>
            )
          }
          
        </div>
      </section>
      <section className='charts-section'>
      <div className={"container-option"} onClick={()=>handleDtPlan('open')}>
          <span className='title-body'>
            Planes
          </span>
        </div>
        <div className="container-option">
          {
            planCont === 1 ?
            (
              <div className="dt-body ">
                {
                  planData.length > 1 ? (
                    <table className="dt-all">
                      <tbody>
                        {
                          planData.map((pla, id)=>(
                            <tr key={id} className='plan-dt' onClick={()=>handleDtPlan('open')}>
                              <td>
                                {pla.id}
                              </td>
                              <td>
                                {pla.name}
                              </td>
                              <td>
                                {pla.duration}
                              </td>
                              <td>
                                {pla.asis}
                              </td>
                              <td>
                                ${pla.costo}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  ):(
                    <div className="dt-empty">
                      No existe información para mostrar
                    </div>
                  )
                }
              </div>
            ):
            (
              <form className='form-dt'>
                <div className="header-form">
                  Información del Nuevo Plan
                </div>
                <div className="cols">
                  <div className="col">
                    <div className="input-form sm">
                      <label>Nombre</label>
                      <input type="text" name="name" placeholder='Plan #1'/>
                    </div>
                    <div className="input-form sm">
                      <label>Duración</label>
                      <input type="number" name="dura" placeholder='Dias'/>
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-form sm">
                      <label>Asistencias</label>
                      <input type="number" name="asis" placeholder='30'/>
                    </div>
                    <div className="input-form sm">
                      <label>Costo</label>
                      <input type="number" name="cost" placeholder='$10.00'/>
                    </div>
                  </div>
                </div>
                <div className="submit">
                  <button type='submit'>
                    Guardar
                  </button>
                </div>
              </form>
            )
          }
          
        </div>
      </section>
    </div>
  )
}

export default Company