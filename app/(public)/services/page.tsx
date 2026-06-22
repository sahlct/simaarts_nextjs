import OurServices from '@/components/ourServices'
import ServiceConnect from '@/components/serviceConnect'
import ServiceHeader from '@/components/serviceHeader'
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Our Services",
  description: "From sourcing the world's finest ceramic tiles to expert installation and aftercare — ELBANO handles every stage of your roofing project with premium quality materials and professional service across Kerala.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Our Services | ELBANO",
    description: "From sourcing the world's finest ceramic tiles to expert installation and aftercare — ELBANO handles every stage of your roofing project.",
    url: "https://elbanoindia.com/services",
  },
}

export default function ServicesPage() {
  return (
    <div className='py-16 pb-0'>
        <ServiceHeader/>
        <OurServices />
        <ServiceConnect />
    </div>
  )
}
