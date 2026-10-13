'use client'

import { useParams } from 'next/navigation'
import { SessionRunner } from '@/components/sessions/session-runner'

export default function LearningSessionPage() {
  const { id } = useParams<{ id: string }>()
  return <SessionRunner kind="learning" id={Number(id)} />
}
