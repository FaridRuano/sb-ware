import DelBtn from '@public/assets/icons/del-icon-big.png'
import EditBtn from '@public/assets/icons/btn-edit.png'
import AddBtn from '@public/assets/icons/btn-add.png'
import Image from 'next/image'
import RightArrow from '@public/assets/icons/right-arrow.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import { useState } from 'react'

const DtPlans = ({isActive, handleActive}) => {

    /* Base Data */

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
        },
        {
            id: 7,
            name: 'Plan Guaytambo 6',
            duration: 50,
            asis: 50,
            costo: 50
        },
        {
            id: 8,
            name: 'Plan Guaytambo 5',
            duration: 50,
            asis: 50,
            costo: 50
        }, 
        {
            id: 9,
            name: 'Plan Guaytambo 6',
            duration: 50,
            asis: 50,
            costo: 50
        },
        {
            id: 10,
            name: 'Plan Guaytambo 6',
            duration: 50,
            asis: 50,
            costo: 50
        },
        {
            id: 11,
            name: 'Plan Guaytambo 5',
            duration: 50,
            asis: 50,
            costo: 50
        }, 
        {
            id: 12,
            name: 'Plan Guaytambo 6',
            duration: 50,
            asis: 50,
            costo: 50
        },
        {
            id: 13,
            name: 'Plan Guaytambo 6',
            duration: 50,
            asis: 50,
            costo: 50
        },
    ])

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
        setSelRow({id:0})
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
        setSelRow({id:0})
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
        if(event.target.value.length<1){
          setCurrentItems(planData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          ))
          setTotalPages(Math.ceil(planData.length / itemsPerPage))
        }else{
          setTotalPages(1)
          setCurrentItems(planData.filter(cli =>
            cli.name.toLowerCase().includes(event.target.value.toLowerCase())
          ))
        }
    }

    //Form Display

    const openForm = () => {
        if(isAdd || isEdit){
            return false
        }else{
            return true
        }
    }

    const wForm = () => {
        if(isAdd){
            return true
        }
        if(isEdit){
            return false
        }
    }

    /* Add Plan */

    const [isAdd, setIsAdd] = useState(false)

    const handleIsAdd = () => {
        setSelRow({id:0})
        setIsAdd(current => !current)
    }

    const [newPlan, setNewPlan] = useState({
        name: '',
        dura: '',
        asis: '',
        cost: '',
    })

    const handleNewPlan = (e) => {
        const { name, value } = e.target
        
        /* Ced Controller */
        if(name === 'name'){
          if (value.length > 50) {
            return
          }
        }
        if(name === 'dura' || name === 'asis'){
            if (!/^\d*$/.test(value)) {
                return
                }
            if(value > 999){
                return
            }
        }
        if(name === 'cost'){
            if (!/^\d*\.?\d{0,2}$/.test(value)) {
                return
                }
            if(value > 999){
                return
            }
        }
        setNewPlan({
          ...newPlan,
          [name]: value,
        })
      }

    const isPlanSendable = () => {
        if(newPlan.name.length > 0 && newPlan.asis.length > 0 &&  newPlan.dura.length > 0 &&  newPlan.cost.length > 0){
            return true
        }else{
            return false
        }
    }

    const handleSubmitAdd = () => {
        setNewPlan({
            name: '',
            dura: '',
            asis: '',
            cost: '',
        })

        //Send Data Here

        handleIsAdd()
        
    }

    /* Edit Plan */

    const [isEdit, setIsEdit] = useState(false)

    const handleIsEdit = () => {
        setIsEdit(current => !current)
    }
  return (
    <>
        <div className={isActive?'screen-overlay active':'screen-overlay'}>
            <div className="overlay-work">
            <div className="close-overlay">
                <Image src={DelBtn} width={25} height={'auto'} alt="Close" onClick={()=>handleActive('close')}/>
            </div>
            <div className="dashboard">
                <div className="title">
                Planes
                </div>
                <div className="header">
                    <div className="toolbar">
                        <div className={!isAdd?"tool-btn add":"tool-btn cancel"} onClick={()=>handleIsAdd()}>
                            {
                                isAdd ? (
                                    <>
                                        <Image src={DelBtn} width={15} height={'auto'} alt='Delete'/>
                                        <span>
                                            Cancelar
                                        </span>
                                    </>
                                ):(
                                    <>
                                        <Image src={AddBtn} width={15} height={'auto'} alt='Delete'/>
                                        <span>
                                            Agregar
                                        </span>
                                    </>
                                )
                            }
                        </div>
                        <div className={selRow.id > 0 ? "tool-btn edit" : "tool-btn disabled"} onClick={()=>handleIsEdit()}>
                            {
                                isEdit ? (
                                    <>
                                        <Image src={DelBtn} width={15} height={'auto'} alt='Delete'/>
                                        <span>
                                            Cancelar
                                        </span>
                                    </>
                                ):(
                                    <>
                                        <Image src={EditBtn} width={15} height={'auto'} alt='Delete'/>
                                        <span>
                                            Editar
                                        </span>
                                    </>
                                )
                            }
                            
                        </div>
                        <div className={selRow.id > 0 ? "tool-btn del" : "tool-btn disabled"}>
                            <Image src={DelBtn} width={15} height={'auto'} alt='Delete'/>
                            <span>
                            Eliminar
                            </span>
                        </div>
                    </div>
                    <div className={selRow.id > 0 ? "deselect active" : "deselect"} onClick={()=>setSelRow({id: 0})}>
                        <Image src={DelBtn} width={25} height={'auto'} alt='Deselect'/>
                    </div>
                </div>
                {
                    openForm() ? (
                        <>
                            <div className="body">
                            {
                                currentItems.length > 0 ?(
                                <table className='dt-all'>
                                    <thead>
                                    <tr className='plan-dt'>
                                        <th>
                                        ID
                                        </th>
                                        <th>
                                        Name
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
                                            currentItems.map((pla, id)=>(
                                                <tr key={id} className={selRow.id === pla.id ? 'plan-dt active':'plan-dt'} onClick={()=>setSelRow(pla)}>
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
                                )
                                :(
                                <>
                                    No existen datos
                                </>
                                )
                            }
                            </div>
                            <div className="dt-pagination dark">
                                <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage}/>
                                <span>
                                    {currentPage} de {totalPages}
                                </span>
                                <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage}/>
                            </div>
                        </>
                    ):(
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
                                            <label>Nombre</label>
                                            <input type="text" name="name" placeholder='Plan #1' value={newPlan.name} onChange={handleNewPlan}/>
                                            </div>
                                            <div className="input-form sm">
                                            <label>Duración</label>
                                            <input type="text" name="dura" placeholder='Dias' value={newPlan.dura} onChange={handleNewPlan}/>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="input-form sm">
                                            <label>Asistencias</label>
                                            <input type="text" name="asis" placeholder='30' value={newPlan.asis} onChange={handleNewPlan}/>
                                            </div>
                                            <div className="input-form sm">
                                            <label>Costo</label>
                                            <input type="text" name="cost" placeholder='$10.00' value={newPlan.cost} onChange={handleNewPlan}/>
                                            </div>
                                        </div>
                                        </div>
                                        <div className={isPlanSendable()?"submit":"submit disabled"} onClick={()=>handleSubmitAdd()}>
                                            <button>
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ):(
                                <div className="body light">
                                    <div className='form-dt'>
                                        <div className="header-form">
                                        Editar Información del Plan
                                        </div>
                                        <div className="cols">
                                        <div className="col">
                                            <div className="input-form sm">
                                            <label>Nombre</label>
                                            <input type="text" name="name" placeholder='Plan #1' value={newPlan.name} onChange={handleNewPlan}/>
                                            </div>
                                            <div className="input-form sm">
                                            <label>Duración</label>
                                            <input type="text" name="dura" placeholder='Dias' value={newPlan.dura} onChange={handleNewPlan}/>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="input-form sm">
                                            <label>Asistencias</label>
                                            <input type="text" name="asis" placeholder='30' value={newPlan.asis} onChange={handleNewPlan}/>
                                            </div>
                                            <div className="input-form sm">
                                            <label>Costo</label>
                                            <input type="text" name="cost" placeholder='$10.00' value={newPlan.cost} onChange={handleNewPlan}/>
                                            </div>
                                        </div>
                                        </div>
                                        <div className={isPlanSendable()?"submit":"submit disabled"} onClick={()=>handleSubmitAdd()}>
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