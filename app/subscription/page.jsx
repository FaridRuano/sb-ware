'use client'
import React, { useState } from 'react'
import Asset4 from "@public/assets/icons/main-asis.png"
import Image from 'next/image'
import ArrowLeft from "@public/assets/icons/arrow-left.png"
import DeUna from "@public/assets/icons/deuna-icon.png"
import Transfer from "@public/assets/icons/transfer-icon.png"
import Card from "@public/assets/icons/card-icon.png"
import QrDUna from "@public/assets/imgs/duna-qrcode.png"

import { useRouter } from 'next/navigation'

const Subscription = () => {

    const router = useRouter()

    const [isSwitch, setSwitch] = useState(true)

    const [selPlan, setSelPlan] = useState(0)

    const [selMethod, setSelMethod] = useState(0)

    const costToPay = () => {
        if(selPlan === 1){
            if(isSwitch){
                return '$12.90'
            }else{
                return '$144'
            }
        }
        if(selPlan === 2){
            if(isSwitch){
                return '$23.90'
            }else{
                return '$276'
            }
        }
        if(selPlan === 2){
            if(isSwitch){
                return '$32.90'
            }else{
                return '$384'
            }
        }
        return '$00.00'
    }

  return (
    <div className="subs-page">
        {
            selPlan > 0 ? (
                <div className='return-btn' onClick={()=>setSelPlan(0)}>
                    <div className="icon">
                        <Image src={ArrowLeft} width={20} height={'auto'} alt="Return"/>
                    </div>
                    <span>
                        Regresar a <b>planes</b>
                    </span>
                </div>
            ): (
                <div className='return' onClick={()=>router.push('/login')}>
                    <div className="icon">
                        <Image src={ArrowLeft} width={20} height={'auto'} alt="Return"/>
                    </div>
                    <span>
                        Regresar
                    </span>
                </div>
            )
        }
        <div className={selPlan > 0 ? "warp selected" : "warp"} >
            <div className="title">
                Selecciona el plan que mas te <b>convenga</b>
            </div>
            <div className="switch-btn">
                <div className={"switch"} onClick={()=>setSwitch(true)}>
                Mensual
                </div>
                <div className={"switch"} onClick={()=>setSwitch(false)}>
                Anual
                </div>
                <div className={isSwitch ? "active" : "active off"}/>
            </div>
            <div className="plans">
                <div className="plan">
                <div className="name">
                    SB40
                </div>
                <div className="price">
                    {
                    isSwitch ? (
                        <span>$12.90</span>
                    ) : (
                        <span>$144</span>
                    )
                    }
                    <p>costo +iva</p>
                </div>
                <div className="specs">
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Hasta 40 clientes
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Respaldos mensuales
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Soporte técnico
                    </span>
                    </div>
                </div>
                <div className="suscribe" onClick={()=>setSelPlan(1)}>
                    Suscríbete
                </div>
                </div>
                <div className="plan sv">
                <div className="name">
                    SB120
                </div>
                <div className="price">
                    {
                    isSwitch ? (
                        <span>$23.90</span>
                    ) : (
                        <span>$276</span>
                    )
                    }
                    <p>costo +iva</p>
                </div>
                <div className="specs">
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Hasta 120 clientes
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Respaldos mensuales
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Soporte técnico
                    </span>
                    </div>
                </div>
                <div className="suscribe" onClick={()=>setSelPlan(2)}>
                    Suscríbete
                </div>
                <div className="saving">
                    Ahorra el 36%
                </div>
                </div>
                <div className="plan lv">
                <div className="name">
                    SB360
                </div>
                <div className="price">
                    {
                    isSwitch ? (
                        <span>$32.90</span>
                    ) : (
                        <span>$384</span>
                    )
                    }
                    <p>costo +iva</p>
                </div>
                <div className="specs">
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Hasta 360 clientes
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Respaldos mensuales
                    </span>
                    </div>
                    <div className="spec">
                    <Image src={Asset4} width={15} height={'auto'} alt="Spec"/>
                    <span>
                        Soporte técnico
                    </span>
                    </div>
                </div>
                <div className="suscribe" onClick={()=>setSelPlan(3)}>
                    Suscríbete
                </div>
                <div className="saving">
                    Ahorra el 70%
                </div>
                </div>
            </div>
        </div>
        <div className={selPlan > 0 ? "warp-02 active" : "warp-02"}>
            <div className="title">
                Selecciona un <b>método de pago</b>
            </div>
            <div className="methods">
                <div className="method" onClick={()=>setSelMethod(current => {
                    if(current === 0 || current !== 1){
                        return 1
                    }else{
                        return 0
                    }
                })}>
                    <div className="logo">
                        <Image src={DeUna} width={40} height={'auto'} alt='Card'/>
                    </div>
                    <div className="name">
                        Pagar con DeUna
                    </div>
                    <div className={selMethod === 1 ? "icon active":"icon"}>
                        <Image src={ArrowLeft} width={10} height={'auto'} alt="Return"/>
                    </div>
                </div>
                <div className={selMethod === 1 ? "method-1":"method-1 hide"}>
                    <div className="cols">
                        <div className="qr-code">
                            <Image src={QrDUna} width={150} height={'auto'} alt='QR Code'/>
                        </div>
                        <div className="col">
                            <div className="text">
                                Escanea el qr y realiza el pago de 
                            </div>
                            <div className="amount">
                                {costToPay()}
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="text">
                            Una vez podamos verificar el pago
                        </div>
                        <div className="text-hg">
                            tu acceso a la app será habilitado
                        </div>
                        <div className="text-pr">
                            <a href="https://wa.me/+593996447884" target="_blank">
                                ¿Tienes problemas con el pago?
                            </a>
                        </div>
                    </div>

                    
                </div>
                <div className="method" onClick={()=>setSelMethod(current => {
                    if(current === 0 || current !== 2){
                        return 2
                    }else{
                        return 0
                    }
                })}>
                    <div className="logo">
                        <Image src={Transfer} width={40} height={'auto'} alt='Card'/>
                    </div>
                    <div className="name">
                        Pagar con Transferencia bancaria
                    </div>
                    <div className="icon">
                        <Image src={ArrowLeft} width={10} height={'auto'} alt="Return"/>
                    </div>
                </div>
                <div className={selMethod === 2 ? "method-1":"method-1 hide"}>
                    <div className="text">
                        Realiza una transferencia directa o interbancaria a los siguientes datos:
                    </div>
                    <div className="text">
                        <h3>
                            Banco de Pichincha | Cuenta de Ahorros
                        </h3>
                    </div>
                    <div className="text">
                        <b>No: </b> 2206358813
                    </div>
                    <div className="text">
                        <b>CI: </b> 1805467527
                    </div>
                    <div className="text">
                        <b>Nombre: </b> MARCO FARID RUANO CAICEDO
                    </div>
                    <div className="amount">
                        {costToPay()}
                    </div>
                    <div className="footer">
                        <div className="text">
                            Una vez podamos verificar el pago
                        </div>
                        <div className="text-hg">
                            tu acceso a la app será habilitado
                        </div>
                        <div className="text-pr">
                            <a href="https://wa.me/+593996447884" target="_blank">
                                ¿Tienes problemas con el pago?
                            </a>
                        </div>
                    </div>
                </div>
                <div className="method disabled" onClick={()=>setSelMethod(3)}>
                    <div className="logo">
                        <Image src={Card} width={40} height={'auto'} alt='Card'/>
                    </div>
                    <div className="name">
                        Pagar con Tarjeta de Débito/Crédito
                    </div>
                    <div className="icon">
                        <Image src={ArrowLeft} width={10} height={'auto'} alt="Return"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Subscription