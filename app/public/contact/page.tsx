import ContactForm from '@/components/contactForm'
import ContactHeader from '@/components/contactHeader'
import React from 'react'

export default function ContactPage() {
  const data = {
    title: 'Contact Us',
    subtitle: 'Have a question or need assistance? Our team is ready to guide you with the right solution.',
    colorleft: '#f7b500',
    colorright: '#fff1c9'
  }
  return (
    <div className='py-16 pb-0'>
      <ContactHeader data={data} />
      <ContactForm />
    </div>
  )
}
