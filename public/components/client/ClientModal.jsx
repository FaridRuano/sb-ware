'use client'
import DelBtn from '@public/assets/icons/del-icon-big.png'
import axios from 'axios'
import Image from 'next/image'
import UserIcon from '@public/assets/icons/user-icon.png'
import TrashIcon from '@public/assets/icons/trash-btn.png'
import WeightIcon from '@public/assets/icons/weight-icon.webp'
import React, { useEffect, useState } from 'react'

const ClientModal = ({isActive, handleModal, dataModal}) => {

    /* Client */

    const [client, setClient] = useState({})

    /* Loading */

    const [loading, setLoading] = useState(true)

    /* Client Data */

    const fetchClientData = async() => {
        setLoading(true)
        try{
            const res = await axios.post(`/api/client/clients/${dataModal}`)
            setClient(res.data.user)
            setLoading(false)
        }catch(e){
            console.log(e)
        }
    }

    const handleFormatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    const handleDeudFormat = (deud) => {
        if (deud === 0) {
            return <h3 className='deud'>${deud}</h3>;
        } else if (deud > 0) {
            return <h3 className='deud more'>${deud}</h3>;
        }
    }

    /* Weigths Control */

    const activeWeightControl = async() => {
        setLoading(true)
        try{
            const res = await axios.post(`/api/client/clients/company/weight/${dataModal}`)
            setClient(res.data.user)
            setLoading(false)
        }catch(e){
            console.log(e)
        }
    }

    const [weights, setWeights] = useState({
        weight: '',
        height: ''
    })

    const handleWeights = (e) => {
        const {name, value} = e.target

        if(value === ''){
            setWeights(
                (prev)=>({
                    ...weights,
                    [name]: ''
                })
            )
        }

        const roundedValue = Math.round(parseFloat(value) * 100) / 100;

        if(isNaN(roundedValue)){
            return
        }

        setWeights(
            (prev)=>({
                ...weights,
                [name]: roundedValue
            })
        )
    }

    const handleSubmitWeight = async(e) => {
        e.preventDefault()

        if(weights.weight.length === 0 || weights.height.length === 0){
            return
        }

        const data={
            weight: weights.weight,
            height: weights.height,
            id: dataModal
        } 


        try{
            const res = await axios.post('/api/client/clients/company/weight' , data)
            setClient(res.data.user)
        }catch(e){
            console.log(e)
        }

        setWeights({
            weight: '',
            height: ''
        })
    }

    const handleDeleteWeight = async(date) => {

        const data= {
            date: date,
            id: dataModal
        }

        try{
            const res = await axios.delete('/api/client/clients/company/weight', {data})
            setClient(res.data.user)
        }catch(e){
            console.log(e)
        }

    }

    const renderWeights = () => {
        const sortedWeights = client.weights.sort((a, b) => new Date(b.date) - new Date(a.date))
    
        return sortedWeights.map((row, id) => (
            <tr key={id}>
                <th>
                    {row.weight} <b>kg</b>
                </th>
                <th>
                    {row.height} <b>cm</b>
                </th>
                <th>
                    {handleFormatDate(row.date)}
                </th>
                <th>
                    <Image src={TrashIcon} width={'auto'} height={20} alt='Icon' onClick={() => handleDeleteWeight(row.date)} />
                </th>
            </tr>
        ))
    }

    useEffect(()=>{
        if(isActive){
            fetchClientData()
        }else{
            setLoading(true)
        }
    },[isActive])

    if(loading){
        return(
            <div className={isActive?'modal-container':'modal-container hidden'}>
                <div className="container loading">
                    <div className="closebtn">
                        <Image src={DelBtn} width={20} height={'auto'} alt='Close Button'/>
                    </div>
                    <div className="name-holder">
                    </div>
                    <div className="info-holder">

                    </div>
                </div>
            </div>
        )
    }else{
        return (
            <div className={isActive?'modal-container':'modal-container hidden'}>
                <div className="container">
                    <div className="closebtn" onClick={()=> handleModal()}>
                        <Image src={DelBtn} width={20} height={'auto'} alt='Close Button'/>
                    </div>
                    <div className="name-holder">
                        <h1>{client.name}</h1>
                    </div>

                    <div className="info-holder">
                        <div className="header-wrap">
                            <div className="header-icon">
                                <Image src={UserIcon} width={20} height={'auto'} alt='Icon'/>
                            </div>
                            <div className="header-title">
                                Información de Cliente
                            </div>
                        </div>
                        <div className="body-wrap">
                            <div className="col">
                                <div className="info">
                                    <div>Cédula</div>
                                    <h3>{client.ced}</h3>
                                </div>
                                <div className="info">
                                    <div>Email</div>
                                    <h3>{client.email}</h3>
                                </div>
                                <div className="info">
                                    <div>Teléfono</div>
                                    <h3>{client.phone}</h3>
                                </div>
                                <div className="info">
                                    <div>Dirección</div>
                                    <h3>{client.address}</h3>
                                </div>
                            </div>
                            <div className="col">
                                <div className="info">
                                    <div>Plan</div>
                                    <h3>{client.plan.name}</h3>
                                </div>
                                <div className="info">
                                    <div>Asistencias</div>
                                    <h3>{client.plan.asis}</h3>
                                </div>
                                <div className="info">
                                    <div>Fecha de Inicio</div>
                                    <h3>{handleFormatDate(client.plan.ini)}</h3>
                                </div>
                                <div className="info">
                                    <div>Fecha de Fin</div>
                                    <h3>{handleFormatDate(client.plan.end)}</h3>
                                </div>
                                <div className="info">
                                    <div>Deuda</div>
                                    {handleDeudFormat(client.plan.deud)}
                                </div>
                            </div>
                            <div className="col">
                                <button className={client.weights ? "btn-option dis" : "btn-option"} onClick={()=>activeWeightControl()}>
                                    Habilitar control de peso
                                </button>
                                <button className="btn-option info dis">
                                    Enviar Email
                                </button>
                            </div>
                        </div>
                    </div>

                    {
                        client.weights && (
                            <div className="info-holder">
                                <div className="header-wrap">
                                    <div className="header-icon">
                                        <Image src={WeightIcon} width={20} height={'auto'} alt='Icon'/>
                                    </div>
                                    <div className="header-title">
                                        Control de Peso
                                    </div>
                                </div>
                                <div className="body-wrap">
                                    <div className="col-f">
                                        <form onSubmit={handleSubmitWeight}>
                                            <div className="input-field">
                                                <span>
                                                    Peso (kg):
                                                </span>
                                                <input type="number" name="weight" value={weights.weight} onChange={handleWeights} step="0.01"/>
                                            </div>
                                            <div className="input-field">
                                                <span>
                                                    Altura (cm):
                                                </span>
                                                <input type="number" name="height" value={weights.height} onChange={handleWeights}/>
                                            </div>
                                            <button className='btn-form' type='submit'>
                                                Agregar
                                            </button>
                                        </form>
                                        {
                                            client.weights.length > 0 && (
                                                <div className="dt">
                                                    <table>
                                                        <tbody>
                                                            {
                                                                renderWeights()
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
          )
    }

  
}

export default ClientModal