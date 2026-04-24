import { sharedMetadata } from '@/lib/metadata';
import { redirect } from 'next/navigation'

export const metadata = sharedMetadata;

export default function HomeRedirect() {
  redirect('/public/home')
}