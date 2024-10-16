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

const postNewPlan = async (newPlan) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${uri}/api/client/plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlan),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }


    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const deletePlan = async (plan) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;


        const res = await fetch(`${uri}/api/client/plan`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(plan),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }



    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const updatePlan = async (newPlan) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;
        console.log(uri)
        const res = await fetch(`${uri}/api/client/plan`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlan),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }

    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const DtPlans = ({ isActive, handleActive }) => {

    /* User */

    const [currentUser, setCurrentUser] = useState(null)

    /* Base Data */

    const [planData, setPlanData] = useState([])

    const fetchAndLoadData = async () => {
        try {
            const planData = await mongoPlanData()
            if (planData.length >= 0) {
                setPlanData(planData)
                setCurrentItems(planData.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage))
                setTotalPages(Math.ceil(planData.length / itemsPerPage))
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

    const [totalPages, setTotalPages] = useState(Math.ceil(planData.length / itemsPerPage))

    const [currentItems, setCurrentItems] = useState(planData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ))

    const handlePreviousPage = () => {
        setSelRow({ id: 0 })
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            const nextPage = currentPage - 1
            setCurrentPage(nextPage)
            setCurrentItems(planData.slice(
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
            setCurrentItems(planData.slice(
                (nextPage - 1) * itemsPerPage,
                nextPage * itemsPerPage
            ))
        }
    }

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
        if (event.target.value.length < 1) {
            setCurrentItems(planData.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            ))
            setTotalPages(Math.ceil(planData.length / itemsPerPage))
        } else {
            const filtered = planData.filter(cli =>
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

    /* Add Plan */

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

    const [newPlan, setNewPlan] = useState({
        name: '',
        dura: '',
        asis: '',
        cost: '',
        user: '',
    })

    const handleIsAdd = () => {
        setSelRow({ id: 0 })
        setNewPlan({
            name: '',
            dura: '',
            asis: '',
            cost: '',
            user: currentUser.email,
        })
        setIsAdd(current => !current)
    }

    const handleNewPlan = (e) => {
        const { name, value } = e.target

        /* Ced Controller */
        if (name === 'name') {
            if (value.length > 50) {
                return
            }
        }
        if (name === 'dura' || name === 'asis') {
            if (!/^\d*$/.test(value)) {
                return
            }
            if (value > 999) {
                return
            }
        }
        if (name === 'cost') {
            if (!/^\d*\.?\d{0,2}$/.test(value)) {
                return
            }
            if (value > 999) {
                return
            }
        }
        setNewPlan({
            ...newPlan,
            [name]: value,
        })
    }

    const isPlanSendable = () => {
        if (newPlan.name.length > 0 && Number(newPlan.asis) > 0 && Number(newPlan.dura) > 0 && Number(newPlan.cost) > 0) {
            return true
        } else {
            return false
        }
    }

    const handleSubmitAdd = async () => {
        
        //Send Data Here
        await postNewPlan(newPlan)
        await fetchAndLoadData()

        setNewPlan({
            name: '',
            dura: '',
            asis: '',
            cost: '',
        })
        
        handleStatus('Se agrego con exito.')
        handleIsAdd()
    }

    /* Edit Plan */

    const [isEdit, setIsEdit] = useState(false)

    const handleIsEdit = () => {
        if (isEdit) {
            setSelRow({ id: 0 })
            setNewPlan({
                name: '',
                dura: '',
                asis: '',
                cost: '',
            })
        }
        setIsEdit(current => !current)
    }

    const setEditPlan = (row) => {
        setSelRow(row)
        setNewPlan({
            id: row.id,
            name: row.name,
            dura: row.dura,
            asis: row.asis,
            cost: row.cost
        })
    }

    const isEditSendable = () => {
        if (newPlan.name.length > 0 && Number(newPlan.asis) > 0 && Number(newPlan.dura) > 0 && Number(newPlan.cost) > 0) {
            return true
        } else {
            return false
        }
    }

    const handleSubmitEdit = async() => {
        setNewPlan({
            name: '',
            dura: '',
            asis: '',
            cost: '',
        })

        //Send Data Here
        await updatePlan(newPlan)
        await fetchAndLoadData()
        handleStatus('Se edito con exito.')
        handleIsEdit()
    }

    /* Delete Plan */

    const [deleteModal, setDeleteModal] = useState(false)

    const handleDeleteModal = () => {
        setDeleteModal(current => !current)
    }

    const handleSubmitDelete = async() => {
        //Send Data Here
        const data = {
            id: selRow.id
        }
        await deletePlan(data)
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

    useEffect(() => {
        if(isActive){
            fetchAndLoadData()
        }
    }, [isActive])

    useEffect(() => {
        setCurrentItems(planData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage))
    }, [planData])

    useEffect(() => {
        const storedUserStr = localStorage.getItem('app.AUTH')
      
        if(storedUserStr){
          const json = JSON.parse(storedUserStr)
          setCurrentUser(json.data)
          setNewPlan({
              ...newPlan,
              user: json.data.email
              }
          )
        }
      
    }, [])

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
                            Planes
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
                                                        <tr className='plan-dt'>
                                                            <th>
                                                                Nombre
                                                            </th>
                                                            <th>
                                                                Duracion
                                                            </th>
                                                            <th>
                                                                Asistencias
                                                            </th>
                                                            <th>
                                                                Costo
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentItems.map((pla, id) => (
                                                                <tr key={id} className={selRow.id === pla.id ? 'plan-dt active' : 'plan-dt'} onClick={() => setEditPlan(pla)}>
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
                                                                        ${pla.cost}
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
                                    {
                                        wForm() ? (
                                            <div className="body light">
                                                <div className='form-dt'>
                                                    <div className="header-form">
                                                        Información del Nuevo Plan
                                                    </div>
                                                    <div className="cols">
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <div>Nombre</div>
                                                                <input type="text" name="name" placeholder='Plan #1' value={newPlan.name} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <div>Duración</div>
                                                                <input type="text" name="dura" placeholder='Dias' value={newPlan.dura} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <div>Asistencias</div>
                                                                <input type="text" name="asis" placeholder='30' value={newPlan.asis} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <div>Costo</div>
                                                                <input type="text" name="cost" placeholder='$10.00' value={newPlan.cost} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={isPlanSendable() ? "submit" : "submit disabled"} onClick={() => handleSubmitAdd()}>
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
                                                        Editar Información del Plan
                                                    </div>
                                                    <div className="cols">
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <div>Nombre</div>
                                                                <input type="text" name="name" placeholder='Plan #1' value={newPlan.name} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <div>Duración</div>
                                                                <input type="text" name="dura" placeholder='Dias' value={newPlan.dura} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="input-form sm">
                                                                <div>Asistencias</div>
                                                                <input type="text" name="asis" placeholder='30' value={newPlan.asis} onChange={handleNewPlan} autoComplete='off' />
                                                            </div>
                                                            <div className="input-form sm">
                                                                <div>Costo</div>
                                                                <input type="text" name="cost" placeholder='$10.00' value={newPlan.cost} onChange={handleNewPlan} autoComplete='off' />
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

export default DtPlans