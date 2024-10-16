import DelBtn from '@public/assets/icons/del-icon-big.png'
import EditBtn from '@public/assets/icons/btn-edit.png'
import AddBtn from '@public/assets/icons/btn-add.png'
import Image from 'next/image'
import RightArrow from '@public/assets/icons/right-arrow.png'
import RightTop from '@public/assets/icons/right-top.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import LeftTop from '@public/assets/icons/left-top.png'
import { useEffect, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import StatusModal from './StatusModal'
import TrashBtn from '@public/assets/icons/trash-btn.png'
import SearchIcon from '@public/assets/icons/search-icon.png'
import WarningIcon from '@public/assets/icons/warning-icon.png'


const mongoClientData = async (page, signal) => {

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
            const res = await fetch(`${uri}/api/client/clients/company/clients?email=${json.data.email}&page=${page}`, {
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
                clients: ponse.clients,
                plans: ponse.plans,
                currentPage: ponse.currentPage,
                totalPages: ponse.totalPages
            }
        } catch (error) {
            if (error.name === 'AbortError') {
              /* console.log('Fetch aborted') */
            } else {
              console.error('Fetch error:', err);
            }
            return {
                clients: null,
                plans: null,
                currentPage: page,
                totalPages: 1
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
          const res = await fetch(`${uri}/api/client/clients/company/clients?email=${json.data.email}&page=${page}&term=${term}`, {
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
            clients: ponse.clients,
            plans: ponse.plans,
            currentPage: ponse.currentPage,
            totalPages: ponse.totalPages
        }
    } catch (error) {
        if (error.name === 'AbortError') {
          /* console.log('Fetch aborted'); */
        } else {
          console.error('Fetch error:', err);
        }
        return {
            clients: null,
            plans: null,
            currentPage: page,
            totalPages: 1
        }
      }
    }
  }

const postNewClient = async (newClient) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${uri}/api/client/clients/company/clients`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newClient),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }

    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const deleteClient = async (client) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;


        const res = await fetch(`${uri}/api/client/clients/company/clients`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(client),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }

    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const updateClient = async (data) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;


        const res = await fetch(`${uri}/api/client/clients/company/clients`, {
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

const DtClients = ({ isActive, handleActive }) => {

    /* User */

    const [currentUser, setCurrentUser] = useState(null)

    /* Base Data */

    const [clientData, setClientData] = useState([])

    /* Datatable */

    const [totalPages, setTotalPages] = useState(1)
    
    const [currentPage, setCurrentPage] = useState(1)

    const [selRow, setSelRow] = useState({
        _id: ''
    })

    const [searchTerm, setSearchTerm] = useState('')

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

    const handleSearchTerm = (event) => {
        setCurrentPage(1)
        setSearchTerm(event.target.value);
      }

    const fetchAndLoadData = async (page, signal) => {
        try {
            const {clients, plans, totalPages, currentPage} = await mongoClientData(page, signal)
            if(clients === null){
                return
            }
            if (clients.length >= 0) {
                setClientData(clients)
            }
            if (plans.length >= 0) {
                setPlanData(plans)
            }
            setCurrentPage(currentPage)
            setTotalPages(totalPages)
        } catch (e) {
            console.log(e)
        }
    }

    const fetchAndLoadDataSearch = async (term, signal) => {
        try{
          const { clients, plans, totalPages, currentPage } = await mongoSearchData(1, term, signal)
            if(clients === null){
                return
            }
            if(clients.length > 0){
                setClientData(clients)
            }
            if (plans.length >= 0) {
                setPlanData(plans)
            }
            setTotalPages(totalPages) 
            setCurrentPage(currentPage) 
        }catch (e) {
            console.log(e)
        }
      }

    useEffect(()=>{
        const controller = new AbortController()
        fetchAndLoadData(currentPage, controller.signal)
        return () => controller.abort()
      },[currentPage])

      useEffect(()=>{
        const controller = new AbortController()
        if(searchTerm !== '') {
            fetchAndLoadDataSearch(searchTerm, controller.signal)
        }else{
            fetchAndLoadData()
        }
        return () => controller.abort()
      },[searchTerm])

    //Form Display

    const openForm = () => {
        if (isAdd || isEdit) {
            return false
        } else {
            return true
        }
    }

    const wForm = () => {
        if (isAdd) {
            return true
        }
        if (isEdit) {
            return false
        }
    }

    const deselectBtn = () => {
        if (selRow._id > '') {
            if (isEdit) {
                return false
            } else {
                return true
            }
        }
        return false
    }

    /* Add Client */

    const [newClient, setNewClient] = useState({
        id: '',
        ced: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        debt: '',
        plan: {
            id: '',
            name: '',
            dura: '',
            asis: '',
        },
        user: ''
    })

    const [isAdd, setIsAdd] = useState(false)

    const [planData, setPlanData] = useState([])

    const [planSel, setPlanSel] = useState({ id: 0 })

    const handlePlan = (e) => {
        const selPlan = planData.find(plan => plan.id === Number(e.target.value))
        if (selPlan) {
            setDurationPlan(selPlan.dura)
            setAsisPlan(selPlan.asis)
            setDeudPlan(selPlan.cost)
            const [year, month, day] = startDate.split('-')
            const date = new Date(year, month - 1, day)
            setEndDate(getFormattedDate(addDays(date, selPlan.dura)))
            setPlanSel(selPlan)

            setNewClient((prev) => ({
                ...prev,
                debt: selPlan.cost,
                plan: [{
                    ...selPlan,
                    ini: startDate,
                    end: endDate
                }]
            }))
        } else {
            setDurationPlan(0)
            setAsisPlan(0)
            setEndDate(getFormattedDate(addDays(currentDate, 0)))
            setPlanSel(0)
        }
    }

    const [durationPlan, setDurationPlan] = useState(0)

    const [asisPlan, setAsisPlan] = useState(0)

    const [deudPlan, setDeudPlan] = useState(0)

    const currentDate = new Date()

    const getFormattedDate = (date) => {
        const year = date.getUTCFullYear()
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const day = String(date.getUTCDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const [startDate, setStartDate] = useState(getFormattedDate(currentDate))

    const addDays = (date, days) => {
        const result = new Date(date)
        result.setDate(result.getDate() + days)
        return result
    }

    const [endDate, setEndDate] = useState(getFormattedDate(addDays(currentDate, durationPlan)))

    const handleStartDate = (e) => {
        const [year, month, day] = e.target.value.split('-')
        const date = new Date(year, month - 1, day)
        setStartDate(getFormattedDate(date))
        setEndDate(getFormattedDate(addDays(date, durationPlan)))
    }

    const AddButton = () => {
        if (isEdit) {
            return false
        }
        if (isAdd) {
            return true
        }
        return true
    }

    const handleIsAdd = () => {
        setSelRow({ _id: '' })
        setNewClient({
            ced: '',
            name: '',
            email: '',
            phone: '',
            address: '',
            debt: '',
            plan: {
                id: '',
                name: '',
                dura: '',
                asis: '',
            },
            user: currentUser.email
        })
        setAsisPlan('')
        setDurationPlan('')
        setEndDate(currentDate)
        setPlanSel({id:0})
        setDeudPlan(0)
        setIsAdd(current => !current)
    }

    const [errorForm, setErrorForm] = useState(false)

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

    const handleSubmitAdd = async () => {
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
            setErrorForm(true)
            setErrorMsg('Nombre y Plan son los únicos campos obligatorios!')
        }
        else{
            setErrorForm(false)
            setErrorMsg('')
            const newClientData = {
                ced: newClient.ced,
                name: newClient.name.toUpperCase(),
                plan: {
                    id: planSel.id,
                    name: planSel.name,
                    dura: durationPlan,
                    asis: asisPlan,
                    deud: deudPlan,
                    ini: startDate,
                    end: endDate,
                },
                ini: startDate,
                end: endDate,
                asis: asisPlan,
                debt: durationPlan,
                email: newClient.email.toLowerCase(),
                phone: newClient.phone,
                address: newClient.address,
                payments: [],
                user: currentUser.email
            }
    
            try {
                await postNewClient(newClientData)
                await fetchAndLoadData()
                handleIsAdd()
              } catch (error) {
                console.error('Error posting new person:', error)
              }
        }
    }

    /* Edit Client */

    const [isEdit, setIsEdit] = useState(false)

    const handleIsEdit = () => {
        if (isEdit) {
            setSelRow({ _id: '' })
            setPlanSel({ id: 0 })
            setDurationPlan(0)
            setAsisPlan(0)
            setStartDate(getFormattedDate(currentDate))
            setEndDate(getFormattedDate(currentDate))
            setNewClient({
                ced: '',
                name: '',
                email: '',
                phone: '',
                address: '',
            })
        }
        setIsEdit(current => !current)
    }

    const setEditClient = (row) => {
        setSelRow(row)
        const selPlan = planData.find(plan => plan.id === Number(row.plan.id))
        if (selPlan) {
            setDurationPlan(row.plan.dura)
            setAsisPlan(row.plan.asis)
            setDeudPlan(row.plan.deud)
            const dateString = row.plan.ini
            const date = new Date(dateString)
            setStartDate(getFormattedDate(date))
            const dateString2 = row.plan.end
            const date2 = new Date(dateString2)
            setEndDate(getFormattedDate(date2))
            setPlanSel(selPlan)
        } else {
            setDurationPlan(0)
            setAsisPlan(0)
            setEndDate(getFormattedDate(addDays(currentDate, 0)))
            setPlanSel(0)
        }
        setNewClient({
            id: row.id,
            ced: row.ced,
            name: row.name,
            email: row.email,
            phone: row.phone,
            address: row.address,
        })
    }

    const isEditSendable = () => {
        return true
    }

    const handleSubmitEdit = async () => {

        const data = {
            id: selRow._id,
            data: {
                ced: newClient.ced,
                name: newClient.name.toUpperCase(),
                plan: {
                    id: planSel.id,
                    name: planSel.name,
                    dura: durationPlan,
                    asis: asisPlan,
                    deud: deudPlan || 0,
                    ini: startDate,
                    end: endDate
                },
                email: newClient.email.toLowerCase(),
                phone: newClient.phone,
                address: newClient.address,
                user: currentUser.email
            }
        }

        await updateClient(data)
        await fetchAndLoadData()
        //Send Data Here

        setNewClient({
            ced: '',
            name: '',
            email: '',
            phone: '',
            address: '',
            user: currentUser.email
        })
        setPlanSel({ id: 0 })

        handleStatus('Se edito con exito.')
        handleIsEdit()
    }

    /* Delete Client */

    const [deleteModal, setDeleteModal] = useState(false)

    const handleDeleteModal = () => {
        setDeleteModal(current => !current)
    }

    const handleSubmitDelete = async () => {
        
        const data = {
            id: selRow._id
        }
        setIsEdit(false)
        await deleteClient(data)
        await fetchAndLoadData()
        handleStatus('Se elimino con exito.')
        handleDeleteModal()

    }

    /* Status Modal*/

    const [statusModal, setStatusModal] = useState(false)

    const handleStatus = (msg) => {
        setStatusModal(current => !current)
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

    /* Close Modal */

    const closeModal = () => {
        handleActive('close')
        setSelRow({ id: 0 })
        setIsEdit(false)
        setIsAdd(false)
    }

    useEffect(() => {
        if(isActive){
            fetchAndLoadData()
        }
    }, [isActive])

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
          setNewClient({
              ...newClient,
              user: json.data.email
              }
          )
        }
      
    }, [])

    return (
        <>
            <ConfirmModal isActive={deleteModal} handleModal={handleDeleteModal} handleResponse={handleSubmitDelete} dataModal={selRow} />
            <StatusModal isActive={statusModal} message={statusMsg} handleModal={handleStatusClose}/>
            <div className={isActive ? 'screen-overlay active' : 'screen-overlay'}>
                <div className="close-overlay">
                    <Image src={DelBtn} width={25} height={'auto'} alt="Close" onClick={() => closeModal()} />
                </div>
                <div className="overlay-work">
                    <div className="dashboard">
                        <div className="title">
                            Clientes
                        </div>
                        <div className="header">
                            <div className="toolbar">
                                <div className={AddButton() ? "tool-btn add" : "tool-btn disabled"} onClick={() => handleIsAdd()}>
                                    {
                                        isAdd ? (
                                            <>
                                                <Image src={DelBtn} width={15} height={'auto'} alt='Delete' />
                                                <span>
                                                    Cancelar
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Image src={AddBtn} width={15} height={'auto'} alt='Delete' />
                                                <span>
                                                    Agregar
                                                </span>
                                            </>
                                        )
                                    }
                                </div>
                                <div className={selRow._id !== '' ? "tool-btn edit" : "tool-btn disabled"} onClick={() => handleIsEdit()}>
                                    {
                                        isEdit ? (
                                            <>
                                                <Image src={DelBtn} width={15} height={'auto'} alt='Delete' />
                                                <span>
                                                    Cancelar
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Image src={EditBtn} width={15} height={'auto'} alt='Delete' />
                                                <span>
                                                    Editar
                                                </span>
                                            </>
                                        )
                                    }

                                </div>
                                <div className={selRow._id !== '' ? "tool-btn del" : "tool-btn disabled"} onClick={() => handleDeleteModal()}>
                                    <Image src={TrashBtn} width={15} height={'auto'} alt='Delete' />
                                    <span>
                                        Eliminar
                                    </span>
                                </div>
                            </div>
                            <div className={deselectBtn() ? "deselect active" : "deselect"} onClick={() => setSelRow({ _id: '' })}>
                                <Image src={DelBtn} width={25} height={'auto'} alt='Deselect' />
                            </div>
                        </div>
                        <div className="header">
                            <div className="header-wrap">
                                <Image src={SearchIcon} width={27} height={'auto'} alt='Search' />
                                <input placeholder='Buscar' type='text' onChange={handleSearchTerm} value={searchTerm} />
                            </div>
                        </div>
                        {
                            openForm() ? (
                                <>
                                    <div className="body">
                                        {
                                            clientData.length > 0 ? (
                                                <table className='dt-all'>
                                                    <thead>
                                                        <tr className='clients-dt'>
                                                            <th>
                                                                Nombre
                                                            </th>
                                                            <th>
                                                                Cedúla
                                                            </th>
                                                            <th>
                                                                Email
                                                            </th>
                                                            <th>
                                                                Teléfono
                                                            </th>
                                                            <th>
                                                                Dirección
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            clientData.map((cli, id) => (
                                                                <tr key={id} className={selRow._id === cli._id ? 'clients-dt active' : 'clients-dt'} onClick={() => setEditClient(cli)}>
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
                                            )
                                                : (
                                                    <>
                                                        No existen datos
                                                    </>
                                                )
                                        }
                                    </div>
                                    {
                                        clientData.length > 0 &&(

                                            <div className="dt-pagination dark">
                                                <Image src={LeftTop} width={16} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handleFirstPage} />
                                                <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
                                                <div>
                                                    {currentPage} de {totalPages}
                                                </div>
                                                <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
                                                <Image src={RightTop} width={16} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleTopPage} />
                                            </div>
                                        )
                                    }
                                </>
                            ) : (
                                <>
                                    <div className="body light">
                                        <div className="form-dt">
                                            <div className="header-form">
                                                {
                                                    wForm() ? (
                                                        <>
                                                            Información del Nuevo Cliente
                                                        </>
                                                    ) : (
                                                        <>
                                                            Editar Información del Cliente
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className="cols">
                                                <div className="col">
                                                    <div className="input-form">
                                                        <div>Cédula</div>
                                                        <input type="text" name="ced" placeholder='9999999999' value={newClient.ced} onChange={handleNewClient} autoComplete='off' />
                                                    </div>
                                                    <div className="input-form">
                                                        <div>Nombre</div>
                                                        <input type="text" name="name" placeholder='Cliente' value={newClient.name} onChange={handleNewClient} autoComplete='off' />
                                                    </div>
                                                    <div className="input-form">
                                                        <div>Email</div>
                                                        <input type="text" name="email" placeholder='cliente@email.com' value={newClient.email} onChange={handleNewClient} autoComplete='off' />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="input-form">
                                                        <div>Teléfono</div>
                                                        <input type="text" name="phone" placeholder='0999999999' value={newClient.phone} onChange={handleNewClient} autoComplete='off' />
                                                    </div>
                                                    <div className="input-form">
                                                        <div>Dirección</div>
                                                        <input type="text" name="address" placeholder='Av...' value={newClient.address} onChange={handleNewClient} autoComplete='off' />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="header-form">
                                                {
                                                    wForm() ? (
                                                        <>
                                                            Plan del Nuevo Cliente
                                                        </>
                                                    ) : (
                                                        <>
                                                            Editar Plan del Cliente
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className="cols">
                                                <div className="col">
                                                    <div className="input-form">
                                                        <div>Plan</div>
                                                        <select onChange={handlePlan} value={planSel.id}>
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
                                                        <input type="number" value={durationPlan} onChange={(e) => setDurationPlan(e.target.value)} placeholder='0'/>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="input-form">
                                                        <div>No. Asis</div>
                                                        <input type="number" value={asisPlan} onChange={(e) => setAsisPlan(e.target.value)} placeholder='0'/>
                                                    </div>
                                                    <div className="input-form">
                                                        <div>Fin</div>
                                                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                                    </div>
                                                    <div className="input-form">
                                                        <div>Deuda</div>
                                                        <input type="number" value={deudPlan} onChange={(e) => setDeudPlan(e.target.value)} placeholder='0'/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-submit">
                                                {
                                                    wForm() ? (
                                                        <>
                                                            <div className={errorForm ? "error-msg" : "error-msg hidden"}>
                                                                <Image src={WarningIcon} width={22} height={'auto'} alt='WARNING' />
                                                                <span>
                                                                    {
                                                                        errorMsg
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="submit">
                                                                <button onClick={() => handleSubmitAdd()}>
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={errorForm ? "error-msg" : "error-msg hidden"}>
                                                                <Image src={WarningIcon} width={22} height={'auto'} alt='WARNING' />
                                                                <span>
                                                                    {
                                                                        errorMsg
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className={isEditSendable() ? "submit" : "submit disabled"} >
                                                                <button onClick={() => handleSubmitEdit()}>
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default DtClients