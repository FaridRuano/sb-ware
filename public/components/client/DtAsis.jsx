import DelBtn from '@public/assets/icons/del-icon-big.png'
import EditBtn from '@public/assets/icons/btn-edit.png'
import AddBtn from '@public/assets/icons/btn-add.png'
import Image from 'next/image'
import RightArrow from '@public/assets/icons/right-arrow.png'
import LeftArrow from '@public/assets/icons/left-arrow.png'
import { useEffect, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import StatusModal from './StatusModal'
import TrashBtn from '@public/assets/icons/trash-btn.png'

const mongoAttenData = async () => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${uri}/api/atten`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!res.ok) {
            throw new Error("Failed")
        }
        const ponse = await res.json()
        return ponse.clients
    } catch (error) {
        console.log(error)
    }
}
const deleteAsis = async (client) => {
    try {
        const uri = process.env.NEXT_PUBLIC_API_URL;


        const res = await fetch(`${uri}/api/atten`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(client),
        });

        if (!res.ok) {
            throw new Error('Failed to post new data')
        }

        // Optionally, you can handle the response after posting if needed
        const postedFaculty = await res.json()

        // Fetch updated data after posting
        //const updatedData = await personData()
        //return updatedData
    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}

const DtAsis = ({ isActive, handleActive }) => {

    /* Base Data */

    const [asisData, setAsisData] = useState([])

    const fetchAndLoadData = async () => {
        try {

            const attenData = await mongoAttenData()
            if (attenData.length >= 0) {
                setAsisData(attenData)
            }

        } catch (e) {
            console.log(e)
        }
    }

    /* Datatable */

    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 10

    const [selRow, setSelRow] = useState({
        id: 0
    })

    const [totalPages, setTotalPages] = useState(Math.ceil(asisData.length / itemsPerPage))

    const [currentItems, setCurrentItems] = useState(asisData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ))

    const handlePreviousPage = () => {
        setSelRow({ id: 0 })
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            const nextPage = currentPage - 1
            setCurrentPage(nextPage)
            setCurrentItems(asisData.slice(
                (nextPage - 1) * itemsPerPage,
                nextPage * itemsPerPage
            ))
        }
    }

    const handleNextPage = () => {
        setSelRow({ id: 0 })
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            setCurrentItems(asisData.slice(
                (nextPage - 1) * itemsPerPage,
                nextPage * itemsPerPage
            ))
        }
    }
    const handleFormatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    /* Delete*/

    const [deleteModal, setDeleteModal] = useState(false)

    const handleDeleteModal = () => {
        if (statusModal === true) {
            setStatusModal(false)
        }
        setDeleteModal(current => !current)
    }

    const handleSubmitDelete = async () => {
        //Send Data Here
        const data = {
            id: selRow.id,
            date: selRow.date
        }
        //console.log(data)
        await deleteAsis(data)
        await fetchAndLoadData()
        handleStatus('Se elimino con exito.')
        handleDeleteModal()

    }

    /* Status Modal*/

    const [statusModal, setStatusModal] = useState(false)

    const handleStatus = (msg) => {
        setStatusModal(current => !current)
        handleStatusMsg(msg)
        setSelRow({ id: 0 })
    }

    const handleStatusClose = () => {
        setStatusModal(false)
    }

    const [statusMsg, setStatusMsg] = useState('Proceso Exitoso.')

    const handleStatusMsg = (msg) => {
        setStatusMsg(msg)
    }

    useEffect(() => {
        fetchAndLoadData()
    }, [isActive])

    useEffect(() => {
        setCurrentItems(asisData.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage))
    }, [asisData])

    return (
        <>
            <ConfirmModal isActive={deleteModal} handleModal={handleDeleteModal} handleResponse={handleSubmitDelete} dataModal={selRow} />
            <StatusModal isActive={statusModal} message={statusMsg} handleModal={handleStatusClose} full={true} />
            <div className={isActive ? 'screen-overlay active' : 'screen-overlay'}>
                <div className="overlay-work">
                    <div className="close-overlay">
                        <Image src={DelBtn} width={25} height={'auto'} alt="Close" onClick={() => handleActive('close')} />
                    </div>
                    <div className="dashboard">
                        <div className="title">
                            Asistencias
                        </div>
                        <div className="header">
                            <div className="toolbar">
                                <div className={selRow.id > 0 ? "tool-btn del" : "tool-btn disabled"} onClick={() => handleDeleteModal()}>
                                    <Image src={TrashBtn} width={15} height={'auto'} alt='Delete' />
                                    <span>
                                        Eliminar
                                    </span>
                                </div>
                            </div>
                            <div className={selRow.id > 0 ? "deselect active" : "deselect"} onClick={() => setSelRow({ id: 0 })}>
                                <Image src={DelBtn} width={25} height={'auto'} alt='Deselect' />
                            </div>
                        </div>
                        <div className="body">
                            {
                                currentItems.length > 0 ? (
                                    <table className='dt-all'>
                                        <thead>
                                            <tr className='asis-dt'>
                                                <th>
                                                    ID
                                                </th>
                                                <th>
                                                    Nombre
                                                </th>
                                                <th>
                                                    Fecha
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                currentItems.map((asi, id) => (
                                                    <tr key={id} className={selRow.id === asi.id && selRow.date === asi.date ? 'asis-dt active' : 'asis-dt'} onClick={() => setSelRow(asi)}>
                                                        <td>
                                                            {asi.id}
                                                        </td>
                                                        <td>
                                                            {asi.name}
                                                        </td>
                                                        <td>
                                                            {handleFormatDate(asi.date)}
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )
                                    : (
                                        <>
                                            No existen datos
                                        </>
                                    )
                            }
                        </div>
                        <div className="dt-pagination dark">
                            <Image src={LeftArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === 1 ? 'disabled' : ''} onClick={handlePreviousPage} />
                            <span>
                                {currentPage} de {totalPages}
                            </span>
                            <Image src={RightArrow} width={12} height={'auto'} alt='Change Page' className={currentPage === totalPages ? 'disabled' : ''} onClick={handleNextPage} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DtAsis