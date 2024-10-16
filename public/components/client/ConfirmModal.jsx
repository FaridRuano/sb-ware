'use client'

import TrashIcon from '@public/assets/icons/trash-icon.png'
import Image from 'next/image'

const ConfirmModal = ({isActive, handleModal, handleResponse, dataModal}) => {

  return (
    <div className={isActive?'modal-container':'modal-container hidden'} id='confirm-container'>
        <div className="modal-wrap">
            <div className="modal-header">
                <div className="modal-icon">
                    <Image src={TrashIcon} width={25} height={'auto'} alt='Trash'/>
                </div>
                <p>
                    ¿Estas Seguro?
                </p>
            </div>
            <p className='modal-msg'>
                Se eliminara definitivamente <br/>
                a <b>{dataModal.name}</b>
            </p>
            <div className="modal-options">
                <button className='option cancel' onClick={()=>handleModal()}>
                    Cancelar
                </button>
                <button className='option confirm' onClick={()=>handleResponse()}>
                    Aceptar
                </button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmModal