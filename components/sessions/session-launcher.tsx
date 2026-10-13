'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GraduationCap, MessagesSquare, Play, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { getSessionFor, rememberSession } from '@/lib/sessions'
import { Btn } from '@/components/shared/ui-kit'

type Kind = 'interview' | 'learning'

const routes: Record<Kind, string> = {
  interview: '/dashboard/interviews',
  learning: '/dashboard/learning',
}

const DEFAULT_INTERVIEW_QUESTION_COUNT = 4
const MIN_INTERVIEW_QUESTION_COUNT = 1
const MAX_INTERVIEW_QUESTION_COUNT = 30

export function useSessionLauncher(kind: Kind, applicationId: number) {
  const router = useRouter()
  const [existing, setExisting] = useState<number | null>(null)
  const [starting, setStarting] = useState(false)
  const [questionCount, setQuestionCount] = useState(String(DEFAULT_INTERVIEW_QUESTION_COUNT))
  const parsedQuestionCount = Number(questionCount)
  const validQuestionCount =
    Number.isInteger(parsedQuestionCount) &&
    parsedQuestionCount >= MIN_INTERVIEW_QUESTION_COUNT &&
    parsedQuestionCount <= MAX_INTERVIEW_QUESTION_COUNT

  useEffect(() => {
    setExisting(getSessionFor(kind, applicationId))
  }, [kind, applicationId])

  const start = async () => {
    if (kind === 'interview' && !validQuestionCount) return
    setStarting(true)
    const id = toast.loading(
      kind === 'interview'
        ? `Generating ${parsedQuestionCount} tailored questions…`
        : 'Building your learning roadmap…',
    )
    try {
      const session =
        kind === 'interview'
          ? await api.interviews.start(applicationId, parsedQuestionCount)
          : await api.learning.start(applicationId)
      rememberSession(kind, applicationId, session.id)
      toast.success('Session ready', { id })
      router.push(`${routes[kind]}/${session.id}`)
    } catch (err) {
      toast.error('Could not start session', { id, description: errorMessage(err) })
      setStarting(false)
    }
  }

  const resume = () => existing && router.push(`${routes[kind]}/${existing}`)

  return {
    existing,
    starting,
    start,
    resume,
    questionCount,
    setQuestionCount,
    validQuestionCount,
  }
}

export function SessionLauncher({
  kind,
  applicationId,
  compact,
}: {
  kind: Kind
  applicationId: number
  compact?: boolean
}) {
  const {
    existing,
    starting,
    start,
    resume,
    questionCount,
    setQuestionCount,
    validQuestionCount,
  } = useSessionLauncher(kind, applicationId)
  const Icon = kind === 'interview' ? MessagesSquare : GraduationCap
  const label = kind === 'interview' ? 'interview' : 'learning plan'

  return (
    <div className="flex flex-wrap gap-2">
      {kind === 'interview' && (
        <label className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background/60 px-3 text-xs font-medium text-muted-foreground">
          Questions
          <input
            type="number"
            min={MIN_INTERVIEW_QUESTION_COUNT}
            max={MAX_INTERVIEW_QUESTION_COUNT}
            step={1}
            inputMode="numeric"
            aria-label="Number of interview questions"
            value={questionCount}
            onChange={(event) => setQuestionCount(event.target.value)}
            disabled={starting}
            className="w-12 bg-transparent text-center text-sm font-semibold text-foreground outline-none"
          />
        </label>
      )}
      {existing && (
        <Btn variant="secondary" size={compact ? 'sm' : 'md'} onClick={resume}>
          <Play aria-hidden="true" /> Resume {compact ? '' : label}
        </Btn>
      )}
      <Btn
        variant={existing ? 'outline' : 'primary'}
        size={compact ? 'sm' : 'md'}
        loading={starting}
        onClick={start}
        disabled={kind === 'interview' && !validQuestionCount}
      >
        {!starting && (existing ? <RotateCcw aria-hidden="true" /> : <Icon aria-hidden="true" />)}
        {existing ? 'New' : 'Start'} {label}
      </Btn>
    </div>
  )
}
