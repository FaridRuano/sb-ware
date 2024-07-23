'use client'

import Image from 'next/image'
import BusinessIcon from '@public/assets/icons/my-business.png'
import MyPaids from '@public/assets/icons/my-paids.png'
import CancelPlan from '@public/assets/icons/cancel-plan.png'
import ChangePlan from '@public/assets/icons/change-plan.png'
import ViewIcon from '@public/assets/icons/view-icon.png'
import DownloadIcon from '@public/assets/icons/download-icon.png'
import { useState } from 'react'

const Config = () => {

  /* Active Option */

  const [activeOption, setActiveOption] = useState(0)

  /* Paids */

  const paids = [
    {
      id: 1,
      date: '2024-06-01',
      noAutorization: '180282371912301232',
      plan: 'SB 50 students',
      amount: '29.99'
    },
    {
      id: 2,
      date: '2024-06-01',
      noAutorization: '180282371912301231',
      plan: 'SB 50 students',
      amount: '29.99'
    }
  ]

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
                <div className="input-config">
                  <span>
                    Razón Social
                  </span>
                  <input type="text" placeholder='Mi empresa'/>
                </div>
              </div>
              <div className="form-body">
                <div className="input-config">
                  <span>
                    RUC
                  </span>
                  <input type="text" placeholder='180039189001'/>
                </div>  
              </div>
            </div>
          </>
        )
      case 1:
        return (
          <>
            <div className="header-dt">
              <h1>
                Factura e historial de facturación
              </h1>
              <p>
                Revisa tu historial de facturación y gestiona las facturas.
              </p>
            </div>
            <div className="paids-config">
              {
                paids.length > 1 ? (
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
                                <tr key={id}>
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
                                          <Image src={ViewIcon} width={20} height={'auto'}/>
                                        </div>
                                      </div>
                                      <div className="tool-btn">
                                        <div className="tool-tip">
                                          Descargar PDF
                                        </div>
                                        <div className="tool-icon">
                                          <Image src={DownloadIcon} width={20} height={'auto'}/>
                                        </div>
                                      </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                  </table>
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
            Hola 3
          </>
        )
      case 3:
        return (
          <>
            Hola 4
          </>
        )
    }
  }


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
              Nombre Empresa
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
              Cancelar Suscripción
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

export default Config