"use client";
import ContactHeader from '@/components/contactHeader';
import TestimonialContainer from '@/components/testiContainer';
import React from 'react'

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
