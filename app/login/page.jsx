'use client'

import Image from "next/image";
import Google from "@public/assets/icons/google-logo.png"
import Google2 from "@public/assets/icons/google-logo2.png"
import ArrowLeft from "@public/assets/icons/arrow-left.png"
import CheckBox from "@public/components/shared/CheckBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@context/UserContext";

export default function LoginPage() {

  /* Routes */

  const router = useRouter()

  /* Cookies */

  const { userInfo, handleUserInfo } = useUser()

  /* Set Login or Singup */

  const [signup, setSingUp] = useState(false)

  /* Login Form */

  const [isChecked, setChecked] = useState(false)

  const handleCheck = () => {
    setChecked(current => !current)
  }

  /* SignUp */

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    pwrd: '',
    confpwrd: '',
  })

  const [errEmail, setErrEmail] = useState(false)

  const [existEmail, setExistEmail] = useState(false)

  const [errPass, setErrPass] = useState(false)

  const handleNewUser = (e) => {

    const { name, value } = e.target

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        if (value.length < 1) {
          setErrEmail(false)
        } else {
          setErrEmail(true)
        }
      } else {
        setErrEmail(false)
      }
    }

    if(name === 'confpwrd'){
      if(value.length > 0){
        if(value === newUser.pwrd){
          setErrPass(false)
        }else{
          setErrPass(true)
        }
      }else{
        setErrPass(false)
      }
    }

    setNewUser({
      ...newUser,
      [name] : value,
    })
  }
  
  const [userSendable, setUserSendable] = useState(false)

  const isUserSendable = () => {
    if(newUser.name.length > 0 && newUser.email.length > 0 && newUser.pwrd.length > 0 && newUser.confpwrd.length > 0 && !errEmail && !errPass){
      setUserSendable(true)
    }else{
      setUserSendable(false)
    }
  }

  useEffect(()=>{
    isUserSendable()
  },[newUser])

  const handleSubmitSignUp = async (e) => {
    e.preventDefault()

    const userData = {
      name: newUser.name,
      email: newUser.email.toLowerCase(),
      password: newUser.pwrd
    }

    try{
      const res = await axios.post('/api/sesion/signup', userData)

      if(res.data.error){
        setExistEmail(true)
        const timer = setTimeout(()=>{
          setExistEmail(false)
        },5000)
  
        return () => clearTimeout(timer)
      }else{
        setNewUser({
          name: '',
          email: '',
          pwrd: '',
          confpwrd: '',
        })
        router.push('/subscription')
      }

    }catch(error) {
      console.log(error)
    }
  }

  /* LogIn */

  const [userCred, setUserCred] = useState({
    email2: '',
    pwrd2: ''
  })

  const [errEmail2, setErrEmail2] = useState(false)

  const [errLogin, setErrLogin] = useState('')

  const handleUserCred = (e) => {
    const { name, value } = e.target

    if (name === 'email2') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        if (value.length < 1) {
          setErrEmail2(false)
        } else {
          setErrEmail2(true)
        }
      } else {
        setErrEmail2(false)
      }
    }

    setUserCred({
      ...userCred,
      [name] : value,
    })
  }

  const [userLogeable, setUserLogeable] = useState(false)

  const isUserLogeable = () => {
    if(userCred.email2.length > 0 && userCred.pwrd2.length > 0 && !errEmail2 ){
      setUserLogeable(true)
    }else{
      setUserLogeable(false)
    }
  }

  useEffect(()=>{
    isUserLogeable()
  },[userCred])

  const handleSubmitLogIn = async (e) => {
    e.preventDefault()

    const userData = {
      email: userCred.email2.toLowerCase(),
      password: userCred.pwrd2
    }

    try{
      const res = await axios.post('/api/sesion/login', userData)

      if(res.data.error){

        const err = res.data.error
        
        if(err === 'no-exists'){
          setErrLogin('No existe un usuario con ese email registrado.')
          const timer = setTimeout(()=>{
            setErrLogin('')
          },5000)
    
          return () => clearTimeout(timer)
        }else if(err === 'no-match'){
          setErrLogin('No coinciden las credenciales. Porfavor vuelve a intentarlo.')
          const timer = setTimeout(()=>{
            setErrLogin('')
          },5000)
    
          return () => clearTimeout(timer)
        }
      }else{
        if(res.data.user.sub.plan.length > 0){
          handleUserInfo(res.data.user, isChecked)
          router.push('/client')
        }else{
          router.push('/subscription')
        }
      }
    }catch(error) {
      console.log(error)
    }
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
            <div className="options">
              <h1 className={signup ? "option": "option active"} onClick={()=>setSingUp(false)}>
                Inicia Sesión
              </h1>
              <h1>
                o
              </h1>
              <h1 className={signup ? "option active": "option"} onClick={()=>setSingUp(true)}>
                Registrate
              </h1>
            </div>
            <div className="separate-div"/>
          </div>
          {
            signup ? (
              <>
                <div className="login-body">
                  <form onSubmit={handleSubmitSignUp}>
                    <div className="input-login">
                      <div>
                        Nombre
                      </div>
                      <input type="text" name='name' value={newUser.name} onChange={handleNewUser} autoComplete="off"/>
                    </div>
                    <div className={!errEmail ? "input-login": "input-login err"}>
                      <div>
                        Email
                      </div>
                      <input type="text" name='email' value={newUser.email} onChange={handleNewUser} autoComplete="off"/>
                    </div>
                    <div className="input-login">
                      <div>
                        Contraseña
                      </div>
                      <input type="password" name='pwrd' value={newUser.pwrd} onChange={handleNewUser} autoComplete="off"/>
                    </div>
                    <div className={errPass ? "input-login err": "input-login"}>
                      <div>
                        Confirmar Contraseña
                      </div>
                      <input type="password" name= 'confpwrd' value={newUser.confpwrd} onChange={handleNewUser} autoComplete="off"/>
                    </div>
                    <div className={userSendable ? "submit-login" : "submit-login disabled"}>
                      <button type="submit" disabled={!userSendable}>
                        Crear Cuenta
                      </button>
                    </div>
                  </form>            
                </div>
                <div className="login-footer">
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
                <div className={existEmail ? "login-error" : "login-error disabled"}>
                  Ya existe un usuario registrado con ese email. Porfavor escribe otro.
                </div>
              </>
            ) : (
              <>
                <div className="login-body">
                  <form onSubmit={handleSubmitLogIn}>
                    <div className={!errEmail2 ? "input-login" : "input-login err"}>
                      <div>
                        Email
                      </div>
                      <input type="text" name='email2'  onChange={handleUserCred} value={userCred.email2}/>
                    </div>
                    <div className="input-login">
                      <div>
                        Contraseña
                      </div>
                      <input type="password" name='pwrd2' value={userCred.pwrd2} onChange={handleUserCred}/>
                    </div>
                    <div className="check-login">
                      <CheckBox checked={isChecked} onChange={handleCheck}/>
                      <div>
                        Recordar mis datos
                      </div>
                    </div>
                    <div className={userLogeable ? "submit-login" : "submit-login disabled"}>
                      <button type="submit" disabled={!userLogeable}>
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
                <div className={errLogin.length > 0 ? "login-error" : "login-error disabled"}>
                  {errLogin}
                </div>
              </>
            )
          }
          
        </div>
      </div>
    </div>
  )
}