import OurServices from '@/components/ourServices'
import ServiceConnect from '@/components/serviceConnect'
import ServiceHeader from '@/components/serviceHeader'
import React from 'react'

export default function ServicesPage() {
  return (
    <div className='py-16 pb-0'>
        <ServiceHeader/>
        <OurServices />
        <ServiceConnect />
    </div>
  )
}
