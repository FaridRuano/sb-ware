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
import RightTop from '@public/assets/icons/right-top.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import LeftTop from '@public/assets/icons/left-top.png'
import DeselectIcon from '@public/assets/icons/deselect-icon.png'
import WarningIcon from '@public/assets/icons/warning-icon.png'
import ConfirmModal from '@public/components/client/ConfirmModal'
import RenewModal from '@public/components/client/RenewModal'
import PayModal from '@public/components/client/PayModal'
import StatusModal from '@public/components/client/StatusModal'
import TrashBtn from '@public/assets/icons/trash-btn.png'
import ClientModal from '@public/components/client/ClientModal'

const mongoClientData = async (page, type, signal ) => {

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
        const res = await fetch(`${uri}/api/client/clients?email=${json.data.email}&page=${page}&type=${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            signal: signal
        })

        if (!res.ok) {
            throw new Error("Failed")
        }
        const ponse = await res.json()
        return {
          clientsData: ponse.clients,
          totalPages: ponse.totalPages,
          currentPage: ponse.currentPage,
          totalCli : ponse.totalCli,
          totalActive: ponse.totalCliActive,
          totalInactive: ponse.totalCliInactive,
        }
    } catch (error) {
      if (error.name === 'AbortError') {
        /* console.log('Fetch aborted'); */
      } else {
        console.error('Fetch error:', err);
      }
      return {
        clientsData: null,
        totalPages: 1,
        currentPage: page,
        totalCli: 0,
        totalActive: 0,
        totalInactive: 0
      }
    }
  }
}

const mongoSearchData = async (page, term, signal ) => {

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
        const res = await fetch(`${uri}/api/client/clients?email=${json.data.email}&page=${page}&term=${term}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            signal: signal
        })

        if (!res.ok) {
            throw new Error("Failed")
        }
        const ponse = await res.json()
        return {
          clientsData: ponse.clients,
          totalPages: ponse.totalPages,
          currentPage: ponse.currentPage,
        }
    } catch (error) {
      if (error.name === 'AbortError') {
        /* console.log('Fetch aborted'); */
      } else {
        console.error('Fetch error:', err);
      }
      return {
        clientsData: null,
        totalPages: 1,
        currentPage: page,
        totalCli: 0,
        totalActive: 0,
        totalInactive: 0
      }
    }
  }
}

const mongoPlanData = async () => {

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
      const res = await fetch(`${uri}/api/client/plan?email=${json.data.email}`, {
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
}

const postNewClient = async (newClient) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${uri}/api/client/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newClient),
    })

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

    const posted = await res.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const deleteClient = async (client) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;


    const res = await fetch(`${uri}/api/client/clients`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(client),
    });

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

    const posted = await res.json()

  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const updateClient = async (data) => {
  try {
    const uri = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${uri}/api/client/clients`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to post new data')
    }

  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

const Clients = () => {

  /* Screen */

  const [screenSize, setScreenSize] = useState(1000)

  /* User */

  const [currentUser, setCurrentUser] = useState(null)

  /* Loading Page */

  const [isLoading, setLoading] = useState(true)

  /* Active Table */

  const  [activeTable, setActiveTable ] = useState(1)

  /* Client Data */

  const [clientData, setClientData] = useState([])

  const [ totalClients, setTotalClients ] = useState(0)

  const [ totalActive, setTotalActive ] = useState(0)

  const [ totalInactive, setTotalInactive ] = useState(0)

  /* Plan Data */

  const [planData, setPlanData] = useState([])

  const [planSel, setPlanSel] = useState({
    id: 0
  })

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
      setPlanSel({ _id: 0})
    }
  }

  /* Add Client */

  const [addClient, setAddClient] = useState(false)

  const handleAddClient = () => {
    setAddClient(current => !current)
    setNewClient({
      ced: '',
      name: '',
      email: '',
      phone: '',
      address: '',
    })
    setPlanSel({ id: 0})
    setSelRow({ _id: '' })
    setStartDate(getFormattedDate(currentDate))
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

    if (name === 'ced' || name === 'phone') {
      const isNumeric = /^[0-9]*$/.test(value);

      if (!isNumeric && value !== '') {
        return;
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
    if (newClient.name.length < 2 || newClient.ced.length < 1 || newClient.email.length < 1 || newClient.phone.length < 1 || newClient.address.length < 1 || planSel.id === 0) {
      if (newClient.ced.length < 1) {
        setNewClient((prev) => ({
          ...prev,
          ced: '9999999999999',
        }));
      }
      
      if (newClient.email.length < 1) {
        setNewClient((prev) => ({
          ...prev,
          email: 'default@email.com',
        }));
      }
      if (newClient.phone.length < 1) {
        setNewClient((prev) => ({
          ...prev,
          phone: '9999999999',
        }));
      }
      if (newClient.address.length < 1) {
        setNewClient((prev) => ({
          ...prev,
          address: 'Ecuador',
        }));
      }
      setSendable(true)
      setErrorMsg('Nombre y plan son los únicos campos obligatorios!')
    } else {
      setSendable(false)
      const newClientData = {
        ced: newClient.ced,
        name: newClient.name.toUpperCase(),
        email: newClient.email.toLowerCase(),
        phone: newClient.phone,
        address: newClient.address,
        plan: {
          id: planSel.id,
          name: planSel.name,
          dura: durationPlan,
          asis: asisPlan,
          deud: planSel.cost,
          ini: startDate,
          end: endDate,
        },
        user: currentUser.email
      }
      try {
        await postNewClient(newClientData)
        await fetchAndLoadPersons()
        handleAddClient()
      } catch (error) {
        console.error('Error posting new person:', error)
      }
    }
  }

  /* DataTable */

  const [currentPage, setCurrentPage] = useState(1)

  const [selRow, setSelRow] = useState({
    _id: ''
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [totalPages, setTotalPages] = useState(1)

  const handleFirstPage = () => {
    setSelRow({ _id: '' })
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    setSelRow({ _id: '' })
    if(currentPage > 1){
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    setSelRow({ _id: '' })
    if(currentPage < totalPages){
      setCurrentPage(currentPage + 1)
    }
  }

  const handleTopPage = () => {
    setSelRow({ _id: '' })
    setCurrentPage(totalPages)
  }

  const handleClientActive = (cli) => {
    const endDate = new Date(cli.plan.end)
    const asis = cli.plan.asis
    const dura = cli.plan.dura

    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (endDate < currentDate || asis < 1) {
        return <td className='gray' />
    }

    const daysRemaining = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24))
    const oneThirdDuration = dura / 3

    if (daysRemaining < oneThirdDuration) {
        return <td className='secondary' />;
    }
    return <td className='primary'/>
  }

  const handleSearchTerm = (event) => {
    setCurrentPage(1)
    setSearchTerm(event.target.value);
  }

  const handleDataClient = (n) => {
    setSearchTerm('')
    setActiveTable(n)
    setSearchTerm('')
    setCurrentPage(1)
  }

  const [colData, setColData] = useState(1)

  const handleColData = () =>{
    if(screenSize < 601){
      if(colData === 4){
        setColData(1)
      }else{
        setColData(current => current + 1)
      }
      return
    }else{
      setColData(1)
      return
    }
  }

  const handleShowCol = () => {
    if(screenSize < 601){
      switch (colData) {
        case 1 : 
          return "Plan"
        case 2 : 
          return "Inicio"
        case 3 : 
          return "Fin"
        case 4 : 
          return "Asis"
      }
    }else{
      return "Plan"
    }
  }

  const handleShowData = (cli) => {
    if(screenSize < 601){
      switch (colData) {
        case 1 : 
          return cli.plan.name
        case 2 : 
          return handleFormatDate(cli.plan.ini)
        case 3 : 
          return handleFormatDate(cli.plan.end)
        case 4 : 
          return cli.plan.asis  
      }
    }else{
      return cli.plan.name
    }
  }

  const fetchAndLoadPersons = async (page, type, signal) => {
    try {
      const { clientsData, totalPages, currentPage, totalCli, totalActive, totalInactive } = await mongoClientData(page, type, signal)
      const planData = await mongoPlanData()
      if(clientsData === null){
        return
      }
      if (clientsData.length > 0) {
        setClientData(clientsData)
      }else{
        setClientData([])
      }
      if (planData.length >= 0) {
        setPlanData(planData)
      }
      setTotalInactive(totalInactive)
      setTotalActive(totalActive)
      setTotalClients(totalCli)
      setTotalPages(totalPages) 
      setCurrentPage(currentPage) 
      setLoading(false)
    } catch (e) {
      console.log(e)
    } 
  }

  const fetchAndLoadPersonsSearch = async (term, signal) => {

    try{
      const { clientsData, totalPages, currentPage } = await mongoSearchData(1, term, signal)
      if(clientsData === null){
        return
      }
      if(clientsData.length > 0){
        setClientData(clientsData)
      }else{
        setClientData([])
      }
      setTotalPages(totalPages) 
      setCurrentPage(currentPage) 
    }catch (e) {
      console.log(e)
    }
  }

  /* Modals */

  /* Confirm Delete */

  const [confirmModal, setConfirmModal] = useState(false)

  const handleConfirm = () => {
    handleStatusClose()
    setConfirmModal(current => !current)
  }

  const handleConfirmResponse = async () => {
    setConfirmModal(current => !current)
    const data = {
      id: selRow._id
    }
    await deleteClient(data)
    await fetchAndLoadPersons()

    handleStatus('Se elimino correctamente a ' + selRow.name + '.')
    setSelRow({ _id: '' })
    setSearchTerm('')
  }

  /* Renew */

  const [renewModal, setRenewModal] = useState(false)

  const handleRenew = () => {
    handleStatusClose()
    setRenewModal(current => !current)
  }

  const handleRenewResponse = async (plId, dt) => {
    setRenewModal(current => !current)

    const pl = planData.find(plan => plan.id === Number(plId))

    if (pl == undefined && dt == undefined) {

      const data = {
        action: "renew",
        id: selRow._id,
        data: {
          ini: selRow.plan.ini,
          end: selRow.plan.end
        }
      }

      await updateClient(data)
      await fetchAndLoadPersons()

    } else {
 
      const data = {
        action: "change",
        id: selRow._id,
        data: {
          plan: pl,
          date: dt,
        }
      }
      await updateClient(data)
      await fetchAndLoadPersons()
    }
    handleStatus('El plan de ' + selRow.name + ' renovo correctamente.')
    setSelRow({ _id: '' })
    setSearchTerm('')
  }

  /* Pay */

  const [payModal, setPayModal] = useState(false)

  const handlePay = () => {
    if (selRow.plan.deud === 0) {
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
      id: selRow._id,
      data: {
        amount: parseFloat(response), 
        date: currentDate
      }
    }

    await updateClient(data)
    await fetchAndLoadPersons()

    handleStatus('Se registro correctamente el pago de ' + selRow.name + '.')
    setSelRow({ _id: '' })
    setSearchTerm('')
  }

  /* Status */

  const [statusModal, setStatusModal] = useState(false)

  const handleStatus = async (msg) => {
    setStatusModal(current => !current)
    handleStatusMsg(msg)
    setSelRow({ _id: '' })
  }

  const handleAttent = async (msg) => {
    setStatusModal(current => !current)
    const data = {
      action: "registerAttendance",
      id: selRow._id,
      data: currentDate
    }
    await updateClient(data)
    await fetchAndLoadPersons()
    handleStatusMsg(msg)
    setSelRow({ _id: '' })
    setSearchTerm('')
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

  /* Client Modal */

  const [clientModal, setClientModal] = useState(false)

  const handleClientModal = () => {
    setClientModal(current => !current)
  }


  useEffect(() => {
    let storedUserStr = ''

    if (typeof window !== "undefined") {
      storedUserStr = localStorage.getItem('app.AUTH')
    }else{
      storedUserStr = ''
    }

    if(storedUserStr){
      const json = JSON.parse(storedUserStr)
      setCurrentUser(json.data)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenSize(window.innerWidth)
      }

      handleResize()
      
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  useEffect(()=>{
    const controller = new AbortController()
    fetchAndLoadPersons(currentPage, activeTable, controller.signal)
    return () => controller.abort()
  },[currentPage, activeTable])

  useEffect(()=>{
    const controller = new AbortController()
    if(searchTerm !== '') {
      fetchAndLoadPersonsSearch(searchTerm, controller.signal)
    }else{
      fetchAndLoadPersons()
    }
    return () => controller.abort()
  },[searchTerm])

if(isLoading){
  return (
    <div className="company-page">
      <section className="stats-bar anim">
        <div className="card-bar">
          <span>
          </span>
          <h1>
          </h1>
          <div className="active-bar" />
        </div>
        <div className="card-bar primary">
          <span>
          </span>
          <h1>
          </h1>
          <div className="active-bar" />
        </div>
        <div className="card-bar gray">
          <span>
          </span>
          <h1>
          </h1>
          <div className="active-bar" />
        </div>
      </section>
      <section className="tool-bar loading">
        <div className="tools-01"/>
      </section>
      <section className='data-table loading'>
      </section>
    </div>
  )
}else{
  return (
    <div className="company-page">
      <section className={addClient ? "stats-bar disabled" : "stats-bar"}>
        <div className={activeTable === 1 ? "card-bar active" : "card-bar"} onClick={() => handleDataClient(1)}>
          <span>
            Clientes
          </span>
          <h1>
            {totalClients}
          </h1>
          <div className="active-bar" />
        </div>
        <div className={activeTable === 2 ? "card-bar primary active" : "card-bar primary"} onClick={() => handleDataClient(2)}>
          <span>
            Activos
          </span>
          <h1>
            {totalActive}
          </h1>
          <div className="active-bar" />
        </div>
        <div className={activeTable === 3 ? "card-bar gray active" : "card-bar gray"} onClick={() => handleDataClient(3)}>
          <span>
            Inactivos
          </span>
          <h1>
            {totalInactive}
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
          <div className={selRow._id !== '' ? "btn secondary" : "btn secondary disabled"} onClick={() => handleRenew()}>
            <div className="btn-img">
              <Image src={RenewBtn} width={19} height={'auto'} alt="Renew" />
            </div>
            <div className="btn-name">
              Renovar
            </div>
          </div>
          <div className={selRow._id !== '' ? "btn secondary" : "btn secondary disabled"} onClick={() => handlePay()}>
            <div className="btn-img">
              <Image src={PayBtn} width={11} height={'auto'} alt="Pay" />
            </div>
            <div className="btn-name">
              Reg. Pago
            </div>
          </div>
          <div className={selRow._id !== '' ? "btn secondary" : "btn secondary disabled"} onClick={() => handleAttent('Se marco la asistencia de ' + selRow.name + ' con exito.')}>
            <div className="btn-img">
              <Image src={AsisBtn} width={17} height={'auto'} alt="Asis" />
            </div>
            <div className="btn-name">
              Reg. Asis
            </div>
          </div>
          <div className={selRow._id !== '' ? "btn warning" : "btn warning disabled"} onClick={() => handleConfirm()}>
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
                  selRow._id !== '' && (
                    <div className="header-deselect">
                      <Image src={DeselectIcon} width={21} height={'auto'} alt='Deselect' onClick={() => setSelRow({ _id: '' })} />
                    </div>
                  )
                }
              </div>
              <div className="dt-body">
                {
                  clientData.length > 0 ? (
                    <table className="dt-all">
                      <thead>
                        <tr className='client-dt'>
                          <th />

                          <th>
                            Nombre
                          </th>
                          <th onClick={()=>handleColData()}>
                            {handleShowCol()}
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
                          clientData.map((cli, id) => (
                            <tr className={selRow._id === cli._id ? 'client-dt active' : 'client-dt'} key={id} onClick={() => setSelRow(cli)} onDoubleClick={()=>handleClientModal()}>
                              {
                                handleClientActive(cli)
                              }
                              <td>
                                {cli.name}
                              </td>
                              <td>
                                {handleShowData(cli)}
                              </td>
                              <td>
                                {handleFormatDate(cli.plan.ini)}
                              </td>
                              <td>
                                {handleFormatDate(cli.plan.end)}
                              </td>
                              <td>
                                {cli.plan.asis}
                              </td>
                              <td>
                                <span className={cli.plan.deud > 0 ? 'loan' : 'loan full'}>
                                  ${cli.plan.deud}
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
              <Image src={LeftTop} width={16} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handleFirstPage} />
              <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
              <div>
                {currentPage} de {totalPages}
              </div>
              <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
              <Image src={RightTop} width={16} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleTopPage} />
            </div>
          </section>
        ) : (
          <section className='client-form'>
            <div className="form-header">
              Nuevo Cliente
            </div>
            <div className="form-body">
              <form className='form-client'>
                <div className="form">
                  <div className="header">
                    Datos Personales
                  </div>
                  <div className="body">
                    <div className="input-form">
                      <div>Cédula</div>
                      <input type="text" name='ced' onChange={handleNewClient} value={newClient.ced} autoComplete='off' maxLength={13}/>
                    </div>
                    <div className="input-form">
                      <div>Nombre</div>
                      <input type="text" name='name' onChange={handleNewClient} value={newClient.name} autoComplete='off'/>
                    </div>
                    <div className="input-form">
                      <div>Email</div>
                      <input type="text" name='email' onChange={handleNewClient} value={newClient.email} autoComplete='off'/>
                    </div>
                    <div className="input-form">
                      <div>Teléfono</div>
                      <input type="text" name='phone' onChange={handleNewClient} value={newClient.phone} autoComplete='off' maxLength={10}/>
                    </div>
                    <div className="input-form">
                      <div>Dirección</div>
                      <input type="text" name='address' onChange={handleNewClient} value={newClient.address} autoComplete='on'/>
                    </div>
                  </div>
                </div>
                <div className="form">
                  <div className="header">
                    Plan Mensual
                  </div>
                  <div className="body">
                    <div className="input-form">
                      <div>Plan</div>
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
                      <div>Inicio</div>
                      <input type="date" value={startDate} onChange={handleStartDate} />
                    </div>
                    <div className="input-form">
                      <div>Duración</div>
                      <input type="number" value={durationPlan} disabled />
                    </div>
                    <div className="input-form">
                      <div>No. Asis</div>
                      <input type="number" value={asisPlan} disabled />
                    </div>
                    <div className="input-form">
                      <div>Fin</div>
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
        )
      }
      <ConfirmModal isActive={confirmModal} handleModal={handleConfirm} handleResponse={handleConfirmResponse} dataModal={selRow} />
      <RenewModal isActive={renewModal} handleModal={handleRenew} handleResponse={handleRenewResponse} dataModal={selRow} dataModal2={planData} />
      <PayModal isActive={payModal} handleModal={handlePay} handleResponse={handlePayResponse} dataModal={selRow} />
      <StatusModal isActive={statusModal} message={statusMsg} handleModal={handleStatusClose}/>
      <ClientModal isActive={clientModal} handleModal={handleClientModal} dataModal={selRow._id}/>
    </div>
    )
  }
}


export default Clients