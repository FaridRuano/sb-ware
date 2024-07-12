'use client'

import RenewIcon from '@public/assets/icons/renew-icon.png'
import Image from 'next/image'
import { useState } from 'react'
import DelBtn from '@public/assets/icons/btn-delete.png'

const RenewModal = ({isActive, handleModal, handleResponse, dataModal, dataModal2}) => {

    const currentDate = new Date()

    const getFormattedDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const [startDate, setStartDate] = useState(getFormattedDate(currentDate))

    const handleStartDate = (e) => {
        const [year, month, day] = e.target.value.split('-')
        const date = new Date(year, month - 1, day)
        setStartDate(getFormattedDate(date))
    }

    const [changeModal, setChangeModal] = useState(false)

    const handleChangeModal = () => {
        setChangeModal(current => !current)
    }

    const [plan, setPlan] = useState(0)
    
    const handlePlan = (e) => {
        const selPlan = dataModal2.find(plan => plan.id === Number(e.target.value))
    
        if(selPlan){
          //setPlan(e.target.value)
          setPlan(selPlan)
        }else{
          setPlan([])
        }
    }

    const resetModal = () => {
        setChangeModal(false)
        setStartDate(getFormattedDate(currentDate))
        setPlan([])
        handleModal()
    }
    if(changeModal){
        return(
            <div className={isActive?'modal-container':'modal-container hidden'} id='confirm-container'>
                <div className="modal-wrap">
                    <span className="modal-exit" onClick={()=>resetModal()}>
                        <Image src={DelBtn} width={14} height={'auto'} alt='Exit'/>
                    </span>
                    <div className="modal-msg center">
                        Selecciona un plan para <br/>
                        <b>{dataModal.name}</b>
                    </div>
                    <div className="modal-renew">
                        <div className="input-form">
                            <select onChange={handlePlan} value={plan}>
                                <option value='0'>
                                    Seleccionar
                                </option>
                                {
                                dataModal2.map((op, id)=>(
                                    <option key={id} value={op.id}>
                                    {op.name}
                                    </option>
                                ))
                                }
                            </select>
                        </div>
                        <div className="modal-msg center">
                            Fecha de inicio
                        </div>
                        <div className="input-form">
                            <input type="date" value={startDate} onChange={handleStartDate}/>
                        </div>
                    </div>
                    <div className="modal-options">
                        <button className='option' onClick={()=>{
                            setChangeModal(false)
                        }}>
                            Regresar
                        </button>
                        <button className={plan !== 0 ?'option confirm':'option confirm disabled'} disabled={plan === 0} onClick={()=>{
                            handleResponse(plan, startDate)
                            setChangeModal(false)
                            setStartDate(getFormattedDate(currentDate))
                            setPlan(0)
                        }}>
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <div className={isActive?'modal-container':'modal-container hidden'} id='confirm-container'>
                <div className="modal-wrap">
                    <div className="modal-header">
                        <div className="modal-icon">
                            <Image src={RenewIcon} width={25} height={'auto'} alt='Trash'/>
                        </div>
                        <p>
                            Renovación de plan
                        </p>
                    </div>
                    <p className='modal-msg'>
                        Como deseas renovar el plan de <br/>
                        <b>{dataModal.name}</b>
                    </p>
                    <div className="modal-options">
                        <button className='option' onClick={()=>handleChangeModal()}>
                            Cambiar
                        </button>
                        <button className='option confirm' onClick={()=>handleResponse()}>
                            Mantener
                        </button>
                    </div>
                    <div className="modal-options">
                        <button className='option cancel' onClick={()=>resetModal()}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default RenewModal