import Image from "next/image";
import Google from "@public/assets/icons/google-logo.png"
import ArrowLeft from "@public/assets/icons/arrow-left.png"

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="page-warp">
        <div className="return-btn">
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
            <form action="submit">
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
                <input type="text" />
              </div>
              <div className="check-login">
                <div>
                  Recordar mis datos
                </div>
                <input type="checkbox" />
              </div>
              <div className="submit-login">
                <div>
                  Ingresar
                </div>
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
                  <Image src={Google} width={30} height={'auto'} alt="Google"/>
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