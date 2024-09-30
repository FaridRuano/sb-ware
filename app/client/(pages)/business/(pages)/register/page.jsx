'use client'
import React, { useEffect, useState } from 'react'


const fetchPlanData = async () => {

    let storedUserStr = ''
  
    if (typeof window !== "undefined") {
      storedUserStr = localStorage.getItem('app.AUTH')
    }else{
      storedUserStr = ''
    }
  
    if(storedUserStr){
  
      const json = JSON.parse(storedUserStr)
  
      try {
          const uri = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${uri}/api/client/clients/register/plans?email=${json.data.email}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          })
  
          if (!res.ok) {
              throw new Error("Failed")
          }
          const ponse = await res.json()
          return {
            plans: ponse.plans,
          }
      } catch (error) {
          console.log(error)
      }
    }
}

const fetchClientsData = async (id) => {

    let storedUserStr = ''
  
    if (typeof window !== "undefined") {
      storedUserStr = localStorage.getItem('app.AUTH')
    }else{
      storedUserStr = ''
    }
  
    if(storedUserStr){
  
      const json = JSON.parse(storedUserStr)
  
      try {
          const uri = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${uri}/api/client/clients/register?email=${json.data.email}&id=${id}`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json"
              }
          })
  
          if (!res.ok) {
              throw new Error("Failed")
          }
          const ponse = await res.json()
          return {
            clients: ponse.clients,
          }
      } catch (error) {
          console.log(error)
      }
    }
}

const postAsisData = async (id) => {

    let storedUserStr = ''
  
    if (typeof window !== "undefined") {
      storedUserStr = localStorage.getItem('app.AUTH')
    }else{
      storedUserStr = ''
    }
  
    if(storedUserStr){
  
      const json = JSON.parse(storedUserStr)
  
      try {
          const uri = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${uri}/api/client/clients/register?email=${json.data.email}&id=${id}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              }
          })
  
          if (!res.ok) {
              throw new Error("Failed")
          }
          const ponse = await res.json()
          console.log(ponse)
          return ponse
      } catch (error) {
          console.log(error)
      }
    }
}

const Register = () => {

    /* Loading Data */

    const [loading, setLoading] = useState(true)

    const [loadingDt, setLoadingDt] = useState(true)

    /* Plans Data */

    const [plans, setPlans] = useState([])

    const [selPlan, setSelPlan] = useState({id: 0})

    const loadPlans = async() => {
        const { plans } = await fetchPlanData()
        if(plans.length > 0) {
            setPlans(plans)
        }
        setLoading(false)
    }

    const handlePlan = (e) => {
        setLoadingDt(true)
        const plan = plans.find((plan)=> plan.id === Number(e.target.value))
        if(plan){
            setSelPlan(plan)
        }else{
            setSelPlan({id:0})
        }
    }

    /* Plans Data */

    const [clients, setClients] = useState([])

    const [filteredCli, setFilteredCli] = useState([])

    const loadClients = async(id) => {
        const { clients } = await fetchClientsData(id)
        
        if(clients.length > 0) {
            const sortedClients = [...clients].sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
            setClients(sortedClients)
            setFilteredCli(sortedClients)
            console.log(sortedClients)
        }else{
            setClients([])
            setFilteredCli([])
        }
        setLoadingDt(false)
        setLoading(false)
    }

    /* Search */

    const [searchTerm, setSearchTerm] = useState('')

    const handleSearchTerm = (e) => {
        setSearchTerm(e.target.value)
    }

    /* Tools */

    const clientStatus = (cli) => {
        const isDate = new Date(cli.end)
        const asis = cli.asis
    
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
    
        if (isDate < currentDate) {
          return false
        } else if (asis < 1) {
          return false
        } else {
          return true
        }
    }

    const today = new Date().toISOString().split('T')[0]

    const todayAsisted = (cli) => {
        const asis = cli.attent
        if(asis){
            const hasAsistedToday = asis.some(date => date.split('T')[0] === today)
            return hasAsistedToday;
        }
        return false
    }

    const checkAsis = async(cli) => {
        const id = cli._id
        await postAsisData(id)
        loadClients(selPlan.id)
    }

    useEffect(()=>{
        loadPlans()
    },[])

    useEffect(()=>{
        if(selPlan.id > 0){
            loadClients(selPlan.id)
        }
    },[selPlan])

    useEffect(()=>{
        if(searchTerm !== ''){
            const filtered = clients.filter((cli) =>
                cli.name.toUpperCase().includes(searchTerm.toUpperCase())
            )
            setFilteredCli(filtered)
        }else{
            if(selPlan.id > 0){
                loadClients(selPlan.id)
            }
        }
    },[searchTerm])

    if(loading){
        return (
                <div className='register-page loading'>
                <div className='reg-tools'>
                    <div className='tool-option bg-01'>
                        
                    </div>
                    <div className='tool-option bg-02'>
                        
                    </div>
                </div>
                <div className='reg-datatable'>
                </div>
            </div>
        )
    }else{

    return (
        <div className='register-page'>
            <div className='reg-tools'>
                <div className='tool-option bg-01'>
                    <h3>
                        Planes
                    </h3>
                    <div className='input-field'>
                        <select onChange={handlePlan}>
                            <option>
                                Selecciona
                            </option>
                            {
                                plans.map((plan, id)=>(
                                    <option key={id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='tool-option bg-02'>
                    <h3>
                        Buscar
                    </h3>
                    <div className='input-field'>
                        <input type='text' value={searchTerm} onChange={handleSearchTerm} placeholder='Escribe Aqui'/>
                    </div>
                </div>
            </div>
            <div className='reg-datatable'>
                {
                    !loadingDt ? (
                        <div className='dt-warp'>
                            <div className="dt-body">
                                {
                                filteredCli.length > 0 ? (
                                    <table className="dt-all">
                                    <thead>
                                        <tr className='reg-dt'>
                                            <th/>
                                            <th>
                                                Nombre
                                            </th>
                                            <th>
                                                Asis
                                            </th>
                                            <th/>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        filteredCli.map((cli, id) => (
                                            <tr key={id} className={todayAsisted(cli)?'reg-dt asisted':'reg-dt'}>
                                                <td className={clientStatus(cli.plan) ? ("primary"): ("gray")}>

                                                </td>
                                                <td>
                                                    {cli.name}
                                                </td>
                                                <td>
                                                    {cli.plan.asis}
                                                </td>
                                                <td className='btn-td' onClick={()=>checkAsis(cli)}>
                                                    Marcar
                                                </td>
                                            </tr>
                                        ))
                                        }
                                    </tbody>
                                    </table>
                                ) : (
                                    <div className='register'>
                                        No existen datos
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    ) : (
                        <div className={selPlan.id === 0 ? 'register':'register loading'}>
                            {
                                selPlan.id === 0 && (
                                    <>
                                        Selecciona un plan
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
    }

}

export default Register