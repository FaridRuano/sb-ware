import DelBtn from '@public/assets/icons/del-icon-big.png'
import EditBtn from '@public/assets/icons/btn-edit.png'
import AddBtn from '@public/assets/icons/btn-add.png'
import Image from 'next/image'
import RightArrow from '@public/assets/icons/right-arrow.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import { useEffect, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import StatusModal from './StatusModal'
import TrashBtn from '@public/assets/icons/trash-btn.png'
import SearchIcon from '@public/assets/icons/search-icon.png'
import WarningIcon from '@public/assets/icons/warning-icon.png'


const mongoClientData = async () => {

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
            const res = await fetch(`${uri}/api/client/clients?email=${json.data.email}`, {
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

const DtClients = ({ isActive, handleActive }) => {

    /* User */

    const [currentUser, setCurrentUser] = useState(null)

    /* Base Data */

    const [clientData, setClientData] = useState([])

    const fetchAndLoadData = async () => {
        try {
            const clientData = await mongoClientData()
            const planData = await mongoPlanData()
            if (clientData.length >= 0) {
                setClientData(clientData)
                setCurrentItems(clientData.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage))
                setTotalPages(Math.ceil(clientData.length / itemsPerPage))
            }
            if (planData.length >= 0) {
                setPlanData(planData)
            }
        } catch (e) {
            console.log(e)
        }
    }

    /* Datatable */

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
            const filtered = clientData.filter(cli =>
                cli.name.toLowerCase().includes(event.target.value.toLowerCase())
            )
            setCurrentItems(filtered.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ))
            setTotalPages(Math.ceil(filtered.length / itemsPerPage))
        }
    }

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
        if (selRow.id > 0) {
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
        setSelRow({ id: 0 })
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
                    deud: planSel.cost,
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
            setSelRow({ id: 0 })
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
            action: "update",
            id: selRow.id,
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
        console.log(data)
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
            id: selRow.id
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
        fetchAndLoadData()
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
                <div className="overlay-work">
                    <div className="close-overlay">
                        <Image src={DelBtn} width={25} height={'auto'} alt="Close" onClick={() => closeModal()} />
                    </div>
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
                                <div className={selRow.id > 0 ? "tool-btn edit" : "tool-btn disabled"} onClick={() => handleIsEdit()}>
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
                                <div className={selRow.id > 0 ? "tool-btn del" : "tool-btn disabled"} onClick={() => handleDeleteModal()}>
                                    <Image src={TrashBtn} width={15} height={'auto'} alt='Delete' />
                                    <span>
                                        Eliminar
                                    </span>
                                </div>
                            </div>
                            <div className={deselectBtn() ? "deselect active" : "deselect"} onClick={() => setSelRow({ id: 0 })}>
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
                                            currentItems.length > 0 ? (
                                                <table className='dt-all'>
                                                    <thead>
                                                        <tr className='clients-dt'>
                                                            <th>
                                                                ID
                                                            </th>
                                                            <th>
                                                                Nombre
                                                            </th>
                                                            <th>
                                                                Cedula
                                                            </th>
                                                            <th>
                                                                Email
                                                            </th>
                                                            <th>
                                                                Telefono
                                                            </th>
                                                            <th>
                                                                Direccion
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentItems.map((cli, id) => (
                                                                <tr key={id} className={selRow.id === cli.id ? 'clients-dt active' : 'clients-dt'} onClick={() => setEditClient(cli)}>
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
                                            )
                                                : (
                                                    <>
                                                        No existen datos
                                                    </>
                                                )
                                        }
                                    </div>
                                    {
                                        currentItems.length > 0 &&(

                                            <div className="dt-pagination dark">
                                                <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
                                                <span>
                                                    {currentPage} de {totalPages}
                                                </span>
                                                <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
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