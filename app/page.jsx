'use client'

import { useTheme } from "@context/ThemeContext"
import NavBarMain from "@public/components/NavBarMain"
import Image from "next/image"
import Mobile1 from "@public/assets/imgs/screen-dashboard.png"
import Asset1 from "@public/assets/imgs/asset-main.png"
import Asset2 from "@public/assets/icons/main-clients.png"
import Asset3 from "@public/assets/icons/main-money.png"
import Asset4 from "@public/assets/icons/main-asis.png"
import Asset5 from "@public/assets/icons/main-plan.png"
import Asset6 from "@public/assets/imgs/screen-company.png"
import Asset7 from "@public/assets/imgs/screen-dash-pc.png"
import IdeeLogo from "@public/assets/icons/idee-logo.png"
import { useState } from "react"
import Script from "next/script"
import { useRouter } from "next/navigation"

const Home = () => {

  /* Mode */

  const {isDarkMode, toggleTheme} = useTheme()

  /* Router */

  const router = useRouter()

  /* Switch Button */

  const [isSwitch, setSwitch] = useState(true)

  return (
    <div className="main-page">
      <NavBarMain/>
      <section className="main-first" id='main'>
        <div className="text-warp">
          <div className="header">
            <h1>
              Subscription <span>Based</span>
            </h1>
            <h2>
              Software Solution
            </h2>
          </div>
          <div className="body">
            <p>
              Descubre la solución perfecta diseñada especialmente para adaptarse a un modelo basado en suscripción.
              <br/>
              <b>
                ¡Transforma tu negocio y lleva la eficiencia al siguiente nivel con nuestra innovadora plataforma!
              </b>
            </p>
          </div>
        </div>
        <Image className="asset as1" src={Mobile1} width={320} height={'auto'} alt="Mobile Demo"/>
        <Image className="asset as2" src={Asset1} width={500} height={'auto'} alt="Mobile Demo"/>
      </section>
      <section className="main-second">
        <div className="text-warp">
          <div className="statistic">
            <span>
              30%
            </span>
            <p>
              Aumento en la retención de clientes.
            </p>
          </div>
          <div className="statistic">
            <span>
              40%
            </span>
            <p>
              Aumento en la optimización de la empresa.
            </p>
          </div>
          <div className="statistic">
            <span>
              25%
            </span>
            <p>
              Aumento en ganancias en el primer año.
            </p>
          </div>
        </div>
      </section>
      <section className="main-third">
        <div className="warp">
          <div className="title">
            Controla <b>todos</b> tus <span><b>datos</b>
            </span>
          </div>
          <div className="features-warp">
            <div className="column">
              <div className="feature">
                <div className="icon">
                  <Image src={Asset2} width={30} height={'auto'} alt="Feature"/>
                </div>
                <div className="text">
                  <h3>
                    Clientes
                  </h3>
                  <p>
                    Gestión total sobre datos personales y de contacto.
                  </p>
                </div>
              </div>
              <div className="feature">
                <div className="icon">
                  <Image src={Asset4} width={30} height={'auto'} alt="Feature"/>
                </div>
                <div className="text">
                  <h3>
                    Asistencias
                  </h3>
                  <p>
                    Registro y contabilidad de asistencias.
                  </p>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="feature">
                <div className="icon">
                  <Image src={Asset5} width={30} height={'auto'} alt="Feature"/>
                </div>
                <div className="text">
                  <h3>
                    Planes
                  </h3>
                  <p>
                    Personalización total de planes.
                  </p>
                </div>
              </div>
              <div className="feature">
                <div className="icon">
                  <Image src={Asset3} width={30} height={'auto'} alt="Feature"/>
                </div>
                <div className="text">
                  <h3>
                    Pagos 
                  </h3>
                  <p>
                    Registro y contabilidad de pagos de clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="descrip">
            <p>
              Este software te permitira controlar tus datos de forma sencilla y práctica para que empieces
              a construir un flujo de trabajo mucho mas óptimo y eficiente.
            </p>
            <p>
            Teniendo 4 pilares principales para la evolución de tu negocio;
            <br/><b>clientes, planes, asistencias y pagos.</b>
            </p>
          </div>
          <Image className="asset" src={Asset6} width={320} height={'auto'} alt="Mobile Demo"/>
        </div>
      </section>
      <section className="main-fourth">
        <Image className="asset" src={Asset7} width={1000} height={'auto'} alt="Laptop Demo"/>
        <div className="warp">
          <div className="title">
            Disponible en <b>todos</b> tus <span><b>dispositivos</b></span>
          </div>
          <div className="body">
            <div className="bigbtn" onClick={()=>router.push('/login')}>
              Ingresa
            </div>
            <div className="text">
              Desde tu <b>Laptop/Pc</b><br/>
              y desde tu <b>Móvil/Tablet</b>
            </div>
          </div>
        </div>
      </section>
      <section className="main-fifth" id='prices'>
        <div className="warp">
          <div className="title">
            Descubre <b>todos</b> nuestros <span><b>planes</b></span>
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
              <div className="suscribe">
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
              <div className="suscribe">
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
              <div className="suscribe">
                Suscríbete
              </div>
              <div className="saving">
                Ahorra el 70%
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="main-sixth" id='contact'>
        <div className="warp">
          <div className="contact">
            <span>Buscas algo más personalizado?</span>
            <a href="https://wa.me/+593996447884" target="_blank">
              <div className="wpp">
                Contáctanos
              </div>
            </a>
          </div>
          <div className="info-warp">
            <div className="info">
              <div className="title">
                Datos de contacto
              </div>
              <div className="columns">
                <div className="column h">
                  <span>
                    Propietario:
                  </span>
                  <span>
                    Email:
                  </span>
                  <span>
                    Teléfono:
                  </span>
                </div>
                <div className="column">
                  <span>
                    <a href="https://www.instagram.com/farid.ruano/" target="_blank">
                      @farid.ruano
                    </a>
                  </span>
                  <span>
                    fruanocm2777@gmail.com
                  </span>
                  <span>
                    +593 99644 7884
                  </span>
                </div>
              </div>
            </div>
            <div className="info e">
              <span>Una solución software desarrollada por</span>
              <Image src={IdeeLogo} width={200} height={'auto'} alt="IDEE"/>
            </div>
          </div>
        </div>
      </div>
      <Script src='@public/utils/scrollAnim.js'/>
      {/* <button onClick={toggleTheme}>Change</button> */}
    </div>
  )
}

export default Home