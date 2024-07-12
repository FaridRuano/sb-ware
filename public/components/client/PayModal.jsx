'use client'

import RenewIcon from '@public/assets/icons/renew-icon.png'
import Image from 'next/image'
import { useState } from 'react'
import DelBtn from '@public/assets/icons/btn-delete.png'


const PayModal = ({ isActive, handleModal, handleResponse, dataModal }) => {

    const [changeModal, setChangeModal] = useState(false)

    const handleChangeModal =async () => {
     
        setChangeModal(current => !current)
    }

    const resetModal = () => {
        setChangeModal(false)
        handleModal()
        setAmount(0)
        setError(false)
    }

    const [amount, setAmount] = useState(0)

    const [error, setError] = useState(false)

    const [actual, setActual] = useState(dataModal.debt)

    const handleAmount = (e) => {

        const value = e.target.value;

        console.log(actual)

        const regex = /^\d*\.?\d{0,2}$/;

        if (regex.test(value)) {
            setAmount(value);
            if (value === dataModal.debt) {
                setActual(0)
            } else {
                setActual(dataModal.debt - value)
            }

            if (value > dataModal.debt) {
                setError(true)
            } else {
                setError(false)
            }
        }
    }

    if (changeModal) {
        return (
            <div className={isActive ? 'modal-container' : 'modal-container hidden'} id='confirm-container'>
                <div className="modal-wrap">
                    <span className="modal-exit" onClick={() => resetModal()}>
                        <Image src={DelBtn} width={14} height={'auto'} alt='Exit' />
                    </span>
                    <div className="modal-msg center">
                        Ingresa el valor <br />
                    </div>
                    <div className="modal-renew">
                        <div className="input-form number-big">
                            <input type="text" value={amount} onChange={handleAmount} placeholder='00.00' />
                        </div>
                    </div>
                    <div className={error ? "modal-msg center sm error" : "modal-msg center sm"}>
                        {
                            error ? (
                                <>
                                    El valor no puede ser mayor a la deuda.
                                </>
                            ) : (
                                <>
                                    La deuda de actual es de ${actual}
                                </>
                            )
                        }
                    </div>
                    <div className="modal-options">
                        <button className='option' onClick={() => {
                            setChangeModal(false)
                        }}>
                            Regresar
                        </button>
                        <button className={amount > 0 && amount <= dataModal.debt ? 'option confirm' : 'option confirm disabled'} onClick={() => {
                            handleResponse(amount)
                            setChangeModal(false)
                            setAmount(0)
                        }}>
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={isActive ? 'modal-container' : 'modal-container hidden'} id='confirm-container'>
                <div className="modal-wrap">
                    <div className="modal-header">
                        <div className="modal-icon">
                            <Image src={RenewIcon} width={25} height={'auto'} alt='Trash' />
                        </div>
                        <p>
                            Registro de Pago
                        </p>
                    </div>
                    <p className='modal-msg'>
                        Que cantidad se esta pagando de <br />
                        <b>{dataModal.name}</b>?
                    </p>
                    <div className="modal-options">
                        <button className='option' onClick={() => handleChangeModal()}>
                            Otro
                        </button>
                        <button className='option confirm' onClick={() => handleResponse(dataModal.debt)}>
                            Total: ${dataModal.debt}
                        </button>
                    </div>
                    <div className="modal-options">
                        <button className='option cancel' onClick={() => resetModal()}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default PayModal