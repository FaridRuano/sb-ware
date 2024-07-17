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
  
      // Fetch updated data after posting
      //const updatedData = await personData()
      //return updatedData
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }

const DtClients = ({ isActive, handleActive }) => {

    /* Base Data */

    const [clientData, setClientData] = useState([])

    const fetchAndLoadData = async () => {
        try {
            const fetchData = await mongoClientData()
            if (fetchData.length > 0) {
                console.log(fetchData)
                setClientData(fetchData)
            }
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        fetchAndLoadData()
    }, [isActive])

    useEffect(() => {
        setCurrentItems(clientData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage))
    }, [clientData])




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
            setTotalPages(1)
            setCurrentItems(clientData.filter(cli =>
                cli.name.toLowerCase().includes(event.target.value.toLowerCase())
            ))
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

    const [isAdd, setIsAdd] = useState(false)

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
            address: ''
        })
        setIsAdd(current => !current)
    }

    const [newClient, setNewClient] = useState({
        ced: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    })

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

    const isClientSendable = () => {
        if (newClient.ced.length < 10 || newClient.name.length < 2 || newClient.last.length < 2
            || errorEmail || newClient.email.length < 1 || newClient.ced.length < 7 || newClient.address.length < 1
            || !planSel > 0
        ) {
            return false
        } else {
            return true
        }
    }

    const handleSubmitAdd =async () => {
        setNewClient({
            ced: '',
            name: '',
            email: '',
            phone: '',
            address: ''
        })

        //Send Data Here
        await postNewClient(newClient)

        handleStatus('Se agrego con exito.')
        handleIsAdd()
    }

    /* Edit Client */

    const [isEdit, setIsEdit] = useState(false)

    const handleIsEdit = () => {
        if (isEdit) {
            setSelRow({ id: 0 })
            setNewClient({
                ced: '',
                name: '',
                email: '',
                phone: '',
                address: ''
            })
        }
        setIsEdit(current => !current)
    }

    const setEditClient = (row) => {

        setSelRow(row)
        setNewClient({
            id: row.id,
            ced: row.ced,
            name: row.name,
            email: row.email,
            phone: row.phone,
            address: row.address
        })
    }

    const isEditSendable = () => {
        if (newClient.name.length > 0 && Number(newClient.asis) > 0 && Number(newClient.dura) > 0 && Number(newClient.cost) > 0) {
            return true
        } else {
            return false
        }
    }

    const handleSubmitEdit = () => {
        setNewClient({
            name: '',
            dura: '',
            asis: '',
            cost: '',
        })

        //Send Data Here

        handleStatus('Se edito con exito.')
        handleIsEdit()
    }

    /* Delete Client */

    const [deleteModal, setDeleteModal] = useState(false)

    const handleDeleteModal = () => {
        setDeleteModal(current => !current)
    }

    const handleSubmitDelete = () => {
        //Send Data Here

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

    return (
        <>
            <ConfirmModal isActive={deleteModal} handleModal={handleDeleteModal} handleResponse={handleSubmitDelete} dataModal={selRow} />
            <StatusModal isActive={statusModal} message={statusMsg} handleModal={handleStatusClose} full={true} />
            <div className={isActive ? 'screen-overlay active' : 'screen-overlay'}>
                <div className="overlay-work">
                    <div className="close-overlay">
                        <Image src={DelBtn} width={25} height={'auto'} alt="Close" onClick={() => handleActive('close')} />
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
                                    <div className="dt-pagination dark">
                                        <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
                                        <span>
                                            {currentPage} de {totalPages}
                                        </span>
                                        <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {
                                        wForm() ? (
                                            <div className="body light">
                                                <div className='form-dt'>
                                                    <div className="header-form">
                                                        Información del Nuevo Cliente
                                                    </div>
                                                    <div className="cols">
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <label>Cédula</label>
                                                                <input type="text" name="ced" placeholder='9999999999' value={newClient.ced} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Nombre</label>
                                                                <input type="text" name="name" placeholder='Cliente' value={newClient.name} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Email</label>
                                                                <input type="text" name="email" placeholder='Dias' value={newClient.email} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <label>Teléfono</label>
                                                                <input type="text" name="phone" placeholder='0999999999' value={newClient.phone} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Dirección</label>
                                                                <input type="text" name="address" placeholder='Av...' value={newClient.address} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={isClientSendable() ? "submit" : "submit disabled"} onClick={() => handleSubmitAdd()}>
                                                        <button>
                                                            Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="body light">
                                                <div className='form-dt'>
                                                    <div className="header-form">
                                                        Editar Información del Cliente
                                                    </div>
                                                    <div className="cols">
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <label>Cédula</label>
                                                                <input type="text" name="ced" placeholder='9999999999' value={newClient.ced} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Nombre</label>
                                                                <input type="text" name="name" placeholder='Cliente' value={newClient.name} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Email</label>
                                                                <input type="text" name="email" placeholder='cliente@email.com' value={newClient.email} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <label>Teléfono</label>
                                                                <input type="text" name="phone" placeholder='0999999999' value={newClient.phone} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <label>Dirección</label>
                                                                <input type="text" name="address" placeholder='Av...' value={newClient.address} onChange={handleNewClient} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={isEditSendable() ? "submit" : "submit disabled"} onClick={() => handleSubmitEdit()}>
                                                        <button>
                                                            Guardar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
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