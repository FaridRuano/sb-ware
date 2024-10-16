import Image from 'next/image'
import Sb from '@public/assets/icons/sb-icon.png'

const SbIcon = () => {
  return (
    <div className='btn-icon' id="sb">
        <Image src={Sb} width={20} height={'auto'} alt="Exit"/>
    </div>
  )
}

export default SbIcon