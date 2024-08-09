'use client'

import Image from "next/image";
import Google from "@public/assets/icons/google-logo.png"
import Google2 from "@public/assets/icons/google-logo2.png"
import ArrowLeft from "@public/assets/icons/arrow-left.png"
import CheckBox from "@public/components/shared/CheckBox";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  /* Routes */

  const router = useRouter()
2
  /* Login Form */

  const [isChecked, setChecked] = useState(false)

  const handleCheck = () => {
    setChecked(current => !current)
  }

  return (
    <div className="login-page">
      <div className="page-warp">
        <div className="return-btn" onClick={()=>router.push('/')}>
          <div className="icon">
            <Image src={ArrowLeft} width={18} height={'auto'} alt="Arrow"/>
          </div>
          <div className="text">
            Regresar
          </div>
        </div>
        <div className="title">
          <h1>
            Bienvenido
          </h1>
          <p>
            Ingresa tus credenciales de usuario para poder empezar a usar.
          </p>
        </div>
        <div className="login-warp">
          <div className="login-header">
            <h1>
              Iniciar Sesión
            </h1>
            <div className="separate-div">
              <div className="line"/>
              <span>o</span>
              <div className="line"/>
            </div>
          </div>
          <div className="login-body">
            <form>
              <div className="input-login">
                <div>
                  Email
                </div>
                <input type="text" />
              </div>
              <div className="input-login">
                <div>
                  Contraseña
                </div>
                <input type="password" />
              </div>
              <div className="check-login">
                <CheckBox checked={isChecked} onChange={handleCheck}/>
                <div>
                  Recordar mis datos
                </div>
              </div>
              <div className="submit-login">
                <button type="submit">
                  Ingresar
                </button>
              </div>
            </form>            
          </div>
          <div className="login-footer">
            <div className="login-forget">
              <span>
                Olvide mi contraseña.
              </span>
            </div>
            <div className="login-options">
              <div className="google-btn">
                <div className="icon">
                  <Image className="o" src={Google} width={20} height={'auto'} alt="Google"/>
                  <Image className="i" src={Google2} width={20} height={'auto'} alt="Google"/>
                </div>
                <div className="text">
                  Ingresar con Cuenta Google
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}