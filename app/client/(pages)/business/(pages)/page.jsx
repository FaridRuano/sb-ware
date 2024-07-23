'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddBtn from '@public/assets/icons/btn-add.png'
import DelBtn from '@public/assets/icons/btn-delete.png'
import RenewBtn from '@public/assets/icons/btn-renew.png'
import AsisBtn from '@public/assets/icons/btn-asis.png'
import PayBtn from '@public/assets/icons/btn-pay.png'
import SearchIcon from '@public/assets/icons/search-icon.png'
import RightArrow from '@public/assets/icons/right-arrow.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import DeselectIcon from '@public/assets/icons/deselect-icon.png'
import WarningIcon from '@public/assets/icons/warning-icon.png'
import ConfirmModal from '@public/components/client/ConfirmModal'
import RenewModal from '@public/components/client/RenewModal'
import PayModal from '@public/components/client/PayModal'
import StatusModal from '@public/components/client/StatusModal'
import TrashBtn from '@public/assets/icons/trash-btn.png'

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

const postNewClient = async (newClient) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    });

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

    // Optionally, you can handle the response after posting if needed
    const postedFaculty = await res.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}


const deleteClient = async (client) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;


    const res = await fetch(`${uri}/api/client`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(client),
    });

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

    // Optionally, you can handle the response after posting if needed
    const postedFaculty = await res.json()

    // Fetch updated data after posting
    //const updatedData = await personData()
    //return updatedData
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const updateClient = async (data) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;


    const res = await fetch(`${uri}/api/client`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

    // Optionally, you can handle the response after posting if needed
    const postedFaculty = await res.json()

    // Fetch updated data after posting
    //const updatedData = await personData()
    //return updatedData
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}



const Clients = () => {

  /* Active Table */

  const [activeTable, setActiveTable] = useState(1)

  /* Client Data */

  const [baseData, setBaseData] = useState([])


  const [clientData, setClientData] = useState([])



  const countClients = () => {
    return baseData.length
  }

  const countClientsInactive = () => {
    const current = new Date()
    const filteredData = (baseData.filter(cli => {
      const cliDate = new Date(cli.plan[0].end)

      // Control date validness
      if (isNaN(cliDate)) {
        console.warn(`Invalid date: ${cli.end}`)
        return false;
      }

      return cli.asis === 0 || cliDate < current
    }))
    return filteredData.length

  }

  const countClientsActive = () => {
    const current = new Date()
    const filteredData = (baseData.filter(cli => {
      const cliDate = new Date(cli.plan[0].end)

      // Control date validness
      if (isNaN(cliDate)) {
        console.warn(`Invalid date: ${cli.end}`)
        return false;
      }

      return cli.asis > 0 && cliDate > current
    }))
    return filteredData.length
  }

  /* Plan Data */

  const [planData, setPlanData] = useState([])

  const [planSel, setPlanSel] = useState([])

  const handlePlan = (e) => {
    const selPlan = planData.find(plan => plan.id === Number(e.target.value))

    if (selPlan) {
      setDurationPlan(selPlan.dura)
      setAsisPlan(selPlan.asis)
      const [year, month, day] = startDate.split('-')
      const date = new Date(year, month - 1, day)
      setEndDate(getFormattedDate(addDays(date, selPlan.dura)))
      setPlanSel(selPlan)
    } else {
      setDurationPlan(0)
      setAsisPlan(0)
      setEndDate(getFormattedDate(addDays(currentDate, 0)))
      setPlanSel(0)
    }
  }

  /* Add Client */

  const [addClient, setAddClient] = useState(false)

  const handleAddClient = () => {
    setAddClient(current => !current)
    setSelRow({ id: 0 })
  }

  const [durationPlan, setDurationPlan] = useState(0)

  const [asisPlan, setAsisPlan] = useState(0)

  const currentDate = new Date()

  const getFormattedDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [startDate, setStartDate] = useState(getFormattedDate(currentDate))

  const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const [endDate, setEndDate] = useState(getFormattedDate(addDays(currentDate, durationPlan)))

  const [newClient, setNewClient] = useState({
    ced: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const [sendable, setSendable] = useState(false)

  const [errorEmail, setErrorEmail] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')


  const handleNewClient = (e) => {
    const { name, value } = e.target

    /* Ced Controller */
    if (name === 'ced' || name === 'phone') {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return
      }
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        if (value.length < 1) {
          setErrorEmail(false)
        } else {
          setErrorEmail(true)
          setErrorMsg("Email no válido.")
        }
      } else {
        setErrorEmail(false)
      }
    }
    setNewClient({
      ...newClient,
      [name]: value,
    })
  }

  const handleStartDate = (e) => {
    const [year, month, day] = e.target.value.split('-')
    const date = new Date(year, month - 1, day)
    setStartDate(getFormattedDate(date))
    setEndDate(getFormattedDate(addDays(date, durationPlan)))
  }

  const handleSubmit = async () => {
    if (newClient.ced.length < 10 || newClient.name.length < 2
      || errorEmail || newClient.email.length < 1 || newClient.ced.length < 7 || newClient.address.length < 1
      || !planSel > 0
    ) {
      setSendable(true)
      setErrorMsg('Existen campos vacios. Porfavor llenalos!')
    } else {
      setSendable(false)
      const newClientData = {
        ced: newClient.ced,
        name: newClient.name,
        plan: [{
          ...planSel,   // Copia las propiedades existentes de planSel
          ini: startDate,
          end: endDate
        }],
        asis: asisPlan,
        debt: durationPlan,
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
        payments: []
      }

      try {
        //console.log(newClientData)
        await postNewClient(newClientData)
        await fetchAndLoadPersons()

      } catch (error) {
        console.error('Error posting new person:', error)
      }
      handleAddClient()
    }
  }

  /* DataTable */

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const [selRow, setSelRow] = useState({
    id: 0
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [totalPages, setTotalPages] = useState(Math.ceil(clientData.length / itemsPerPage))

  const [currentItems, setCurrentItems] = useState(clientData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ))

  useEffect(() => {
    const fetchAndLoadPersons = async () => {
      try {
        setCurrentItems(clientData.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        ))
        setTotalPages(Math.ceil(clientData.length / itemsPerPage))
      } catch (e) {
        console.log(e)
      }
    }
    fetchAndLoadPersons()
  }, [clientData])


  const handlePreviousPage = () => {
    setSelRow({ id: 0 })
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      const nextPage = currentPage - 1
      setCurrentPage(nextPage)
      setCurrentItems(clientData.slice(
        (nextPage - 1) * itemsPerPage,
        nextPage * itemsPerPage
      ))
    }
  }

  const handleNextPage = () => {
    setSelRow({ id: 0 })
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      setCurrentItems(clientData.slice(
        (nextPage - 1) * itemsPerPage,
        nextPage * itemsPerPage
      ))
    }
  }

  const handleClientActive = (cli) => {
    const isDate = new Date(cli.end)

    const asis = cli.asis

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (isDate < currentDate) {
      return false
    } else if (asis < 1) {
      return false
    } else {
      return true
    }
  }

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
    if (event.target.value.length < 1) {
      setCurrentItems(clientData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ))
      setTotalPages(Math.ceil(clientData.length / itemsPerPage))
    } else {
      setTotalPages(1)
      setCurrentItems(clientData.filter(cli =>
        cli.name.toLowerCase().includes(event.target.value.toLowerCase())
      ))
    }
  }

  const handleDataClient = (n) => {
    setActiveTable(n)
    const current = new Date()
    if (n === 1) {
      setClientData(baseData)
      setTotalPages(Math.ceil(baseData.length / itemsPerPage))
      setCurrentItems(baseData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ))
    }

    if (n === 2) {
      const filteredData = (baseData.filter(cli => {
        const cliDate = new Date(cli.end)

        // Control date validness
        if (isNaN(cliDate)) {
          console.warn(`Invalid date: ${cli.end}`)
          return false;
        }

        return cli.asis > 0 && cliDate > current
      }))
      setClientData(filteredData)
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage))
      setCurrentItems(filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ))
    }
    if (n === 3) {
      const filteredData = (baseData.filter(cli => {
        const cliDate = new Date(cli.end)

        // Control date validness
        if (isNaN(cliDate)) {
          console.warn(`Invalid date: ${cli.end}`)
          return false;
        }

        return cli.asis === 0 || cliDate < current
      }))
      setClientData(filteredData)
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage))
      setCurrentItems(filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ))
    }
  }

  const fetchAndLoadPersons = async () => {
    try {
      const fetchData = await mongoClientData()
      const planData = await mongoPlanData()
      //console.log(planData)
      if (fetchData.length >= 0) {
        setBaseData(fetchData)
        setClientData(fetchData)
        //console.log(fetchData)
      }
      if (planData.length >= 0) {
        setPlanData(planData)
      }

    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchAndLoadPersons()
  }, [])



  /* Modals */

  /* Confirm Delete */

  const [confirmModal, setConfirmModal] = useState(false)

  const handleConfirm = () => {
    handleStatusClose()
    setConfirmModal(current => !current)
  }

  const handleConfirmResponse = async () => {
    setConfirmModal(current => !current)
    // const filteredData = (clientData.filter(cli => {
    //   return cli.id !== selRow.id
    // }))
    const data = {
      id: selRow.id
    }
    await deleteClient(data)
    await fetchAndLoadPersons()
    //setClientData(baseData)
    setTotalPages(Math.ceil(clientData.length / itemsPerPage))
    setCurrentItems(clientData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ))
    handleStatus('Se elimino correctamente a ' + selRow.name + '.')
    setSelRow({ id: 0 })
  }

  /* Renew */

  const [renewModal, setRenewModal] = useState(false)

  const handleRenew = () => {
    handleStatusClose()
    setRenewModal(current => !current)
  }

  const handleRenewResponse = async (pl, dt) => {
    setRenewModal(current => !current)
    if (pl == undefined && dt == undefined) {

      const data = {
        action: "renew",
        id: selRow.id,
        data: startDate
      };
      console.log(data)
      await updateClient(data)
      await fetchAndLoadPersons()
    } else {
 
    const data = {
      action: "change",
      id: selRow.id,
      data: [{
        ...pl,   // Copia las propiedades existentes de planSel
        ini: dt,
        //end: dt
      }]
    };
    console.log(data)
    await updateClient(data)
    await fetchAndLoadPersons()
  }

  handleStatus('El plan de ' + selRow.name + ' renovo correctamente.')
  setSelRow({ id: 0 })
}

/* Pay */

const [payModal, setPayModal] = useState(false)

const handlePay = () => {
  if (selRow.debt === 0) {
    return
  } else {
    handleStatusClose()
    setPayModal(current => !current)
  }
}

const handlePayResponse = async (response) => {
  setPayModal(current => !current)
  const data = {
    action: "registerPayment",
    id: selRow.id,
    data: [parseFloat(response), currentDate]
  };
  console.log(data)
  await updateClient(data)
  await fetchAndLoadPersons()
  handleStatus('Se registro correctamente el pago de ' + selRow.name + '.')
  setSelRow({ id: 0 })
}

/* Status */

const [statusModal, setStatusModal] = useState(false)

const handleStatus = async (msg) => {
  setStatusModal(current => !current)
  handleStatusMsg(msg)
  setSelRow({ id: 0 })
}
const handleAttent = async (msg) => {
  setStatusModal(current => !current)
  const data = {

    action: "registerAttendance",
    id: selRow.id,
    data: currentDate
  };
  console.log(data)
  await updateClient(data)
  await fetchAndLoadPersons()
  handleStatusMsg(msg)
  setSelRow({ id: 0 })
}

const handleStatusClose = () => {
  setStatusModal(false)
}

const [statusMsg, setStatusMsg] = useState('Proceso Exitoso.')

const handleStatusMsg = (msg) => {
  setStatusMsg(msg)
}

const handleFormatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

return (
  <div className="company-page">
    <section className={addClient ? "stats-bar disabled" : "stats-bar"}>
      <div className={activeTable === 1 ? "card-bar active" : "card-bar"} onClick={() => handleDataClient(1)}>
        <span>
          Clientes
        </span>
        <h1>
          {countClients()}
        </h1>
        <div className="active-bar" />
      </div>
      <div className={activeTable === 2 ? "card-bar primary active" : "card-bar primary"} onClick={() => handleDataClient(2)}>
        <span>
          Activos
        </span>
        <h1>
          {countClientsActive()}
        </h1>
        <div className="active-bar" />
      </div>
      <div className={activeTable === 3 ? "card-bar gray active" : "card-bar gray"} onClick={() => handleDataClient(3)}>
        <span>
          Inactivos
        </span>
        <h1>
          {countClientsInactive()}
        </h1>
        <div className="active-bar" />
      </div>
    </section>
    <section className={addClient ? "tool-bar hidden" : "tool-bar"}>
      <div className="tools-01">
        <div className={!addClient ? "btn" : "btn cancel"} onClick={() => handleAddClient()}>
          <div className="btn-img">
            {
              !addClient ? (
                <Image src={AddBtn} width={14} height={'auto'} alt="Add" />
              ) : (
                <Image src={DelBtn} width={12} height={'auto'} alt="Delete" />
              )
            }
          </div>
          <div className="btn-name">
            {!addClient ? 'Agregar' : 'Cancelar'}
          </div>
        </div>
      </div>
      <div className="tools-02">
        <div className={selRow.id > 0 ? "btn secondary" : "btn secondary disabled"} onClick={() => handleRenew()}>
          <div className="btn-img">
            <Image src={RenewBtn} width={19} height={'auto'} alt="Renew" />
          </div>
          <div className="btn-name">
            Renovar
          </div>
        </div>
        <div className={selRow.id > 0 ? "btn secondary" : "btn secondary disabled"} onClick={() => handlePay()}>
          <div className="btn-img">
            <Image src={PayBtn} width={11} height={'auto'} alt="Pay" />
          </div>
          <div className="btn-name">
            Reg. Pago
          </div>
        </div>
        <div className={selRow.id > 0 ? "btn secondary" : "btn secondary disabled"} onClick={() => handleAttent('Se marco la asistencia de ' + selRow.name + ' con exito.')}>
          <div className="btn-img">
            <Image src={AsisBtn} width={17} height={'auto'} alt="Asis" />
          </div>
          <div className="btn-name">
            Reg. Asis
          </div>
        </div>
        <div className={selRow.id > 0 ? "btn warning" : "btn warning disabled"} onClick={() => handleConfirm()}>
          <div className="btn-img">
            <Image src={TrashBtn} width={12} height={'auto'} alt="Delete" />
          </div>
          <div className="btn-name">
            Eliminar
          </div>
        </div>
      </div>
    </section>
    {
      !addClient ? (
        <section className='data-table'>
          <div className="dt-wrap">
            <div className="dt-header">
              <div className="header-wrap">
                <Image src={SearchIcon} width={27} height={'auto'} alt='Search' />
                <input placeholder='Buscar' type='text' onChange={handleSearchTerm} value={searchTerm} />
              </div>
              {
                selRow.id > 0 && (
                  <div className="header-deselect">
                    <Image src={DeselectIcon} width={21} height={'auto'} alt='Deselect' onClick={() => setSelRow({ id: 0 })} />
                  </div>
                )
              }
            </div>
            <div className="dt-body">
              {
                currentItems.length > 0 ? (
                  <table className="dt-all">
                    <thead>
                      <tr className='client-dt'>
                        <th />
                        <th>
                          ID
                        </th>
                        <th>
                          Nombre
                        </th>
                        <th>
                          Plan
                        </th>
                        <th>
                          Inicio
                        </th>
                        <th>
                          Final
                        </th>
                        <th>
                          Asis
                        </th>
                        <th>
                          Deuda
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        currentItems.map((cli, id) => (
                          <tr className={selRow.id === cli.id ? 'client-dt active' : 'client-dt'} key={id} onClick={() => setSelRow(cli)}>
                            {
                              handleClientActive(cli) ? (
                                <td className='primary' />
                              ) : (
                                <td className='gray' />
                              )
                            }
                            <td>
                              {cli.id}
                            </td>
                            <td>
                              {cli.name}
                            </td>
                            <td>
                              {cli.plan[0].name}
                            </td>
                            <td>
                              {handleFormatDate(cli.plan[0].ini)}
                            </td>
                            <td>
                              {handleFormatDate(cli.plan[0].end)}
                            </td>
                            <td>
                              {cli.asis}
                            </td>
                            <td>
                              <span className={cli.debt > 0 ? 'loan' : 'loan full'}>
                                ${cli.debt.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                ) : (
                  <>
                    No existen datos
                  </>
                )
              }

            </div>
          </div>
          <div className="dt-pagination">
            <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
            <span>
              {currentPage} de {totalPages}
            </span>
            <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
          </div>
        </section>
      ) : (
        <>
          <section className='client-form'>
            <div className="form-header">
              Nuevo Cliente
            </div>
            <div className="form-body">
              <div className="id-client">
                ID <span>100</span>
              </div>
              <form className='form-client'>
                <div className="form">
                  <div className="header">
                    Datos Personales
                  </div>
                  <div className="body">
                    <div className="input-form">
                      <label>Cédula</label>
                      <input type="text" name='ced' onChange={handleNewClient} value={newClient.ced} />
                    </div>
                    <div className="input-form">
                      <label>Nombre</label>
                      <input type="text" name='name' onChange={handleNewClient} value={newClient.name} />
                    </div>
                    <div className="input-form">
                      <label>Email</label>
                      <input type="text" name='email' onChange={handleNewClient} value={newClient.email} />
                    </div>
                    <div className="input-form">
                      <label>Teléfono</label>
                      <input type="text" name='phone' onChange={handleNewClient} value={newClient.phone} />
                    </div>
                    <div className="input-form">
                      <label>Dirección</label>
                      <input type="text" name='address' onChange={handleNewClient} value={newClient.address} />
                    </div>
                  </div>
                </div>
                <div className="form">
                  <div className="header">
                    Plan Mensual
                  </div>
                  <div className="body">
                    <div className="input-form">
                      <label>Plan</label>
                      <select onChange={handlePlan}>
                        <option value='0'>
                          Seleccionar
                        </option>
                        {
                          planData.map((op, id) => (
                            <option key={id} value={op.id}>
                              {op.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="input-form">
                      <label>Inicio</label>
                      <input type="date" value={startDate} onChange={handleStartDate} />
                    </div>
                    <div className="input-form">
                      <label>Duración</label>
                      <input type="number" value={durationPlan} disabled />
                    </div>
                    <div className="input-form">
                      <label>No. Asis</label>
                      <input type="number" value={asisPlan} disabled />
                    </div>
                    <div className="input-form">
                      <label>Fin</label>
                      <input type="date" disabled value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                  </div>
                </div>
              </form>
              <div className="form-submit">
                <div className={sendable || errorEmail ? "error-msg" : "error-msg hidden"}>
                  <Image src={WarningIcon} width={22} height={'auto'} alt='WARNING' />
                  <span>
                    {errorMsg}
                  </span>
                </div>
                <div className="btn primary" onClick={() => handleSubmit()}>
                  Guardar
                </div>
              </div>
            </div>
          </section>
        </>
      )
    }
    <ConfirmModal isActive={confirmModal} handleModal={handleConfirm} handleResponse={handleConfirmResponse} dataModal={selRow} />
    <RenewModal isActive={renewModal} handleModal={handleRenew} handleResponse={handleRenewResponse} dataModal={selRow} dataModal2={planData} />
    <PayModal isActive={payModal} handleModal={handlePay} handleResponse={handlePayResponse} dataModal={selRow} />
    <StatusModal isActive={statusModal} message={statusMsg} handleModal={handleStatusClose} />
  </div>
)
}

export default Clients