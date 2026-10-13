'use client'

import { useParams } from 'next/navigation'
import { SessionRunner } from '@/components/sessions/session-runner'

export default function InterviewSessionPage() {
  const { id } = useParams<{ id: string }>()
  return <SessionRunner kind="interview" id={Number(id)} />
}
