import ContactHeader from '@/components/contactHeader';
import TestimonialContainer from '@/components/testiContainer';
import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what our happy customers have to say about ELBANO's premium roofing solutions. Real experiences and reviews from homeowners across Kerala who trust ELBANO for their roofing needs.",
  alternates: {
    canonical: "/testimonials",
  },
  openGraph: {
    title: "Customer Testimonials | ELBANO",
    description: "Read what our happy customers have to say about ELBANO's premium roofing solutions across Kerala.",
    url: "https://elbanoindia.com/testimonials",
  },
}

export default function TestimonialsListPage() {
    const data = {
        title: 'What Our Customers Say',
        subtitle: 'Real experiences from our happy customers',
        colorleft: '#6982ce',
        colorright: '#e0e5f5'
    }
  return (
    <div className='py-16'>
        <ContactHeader data={data} />
        <TestimonialContainer />
    </div>
  )
}
