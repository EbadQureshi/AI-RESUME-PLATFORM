'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Bot, CheckCircle2, GraduationCap, Map, MessagesSquare, Send, Trophy, User, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { formatDate } from '@/lib/format'
import type { InterviewSession, LearningSession } from '@/lib/api/types'
import { ErrorBox } from '@/components/shared/display'
import { Btn, Card, Skeleton, Textarea } from '@/components/shared/ui-kit'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Kind = 'interview' | 'learning'
type Session = InterviewSession | LearningSession

interface Turn {
  n: number
  question: string
  answer: string
  isCorrect?: boolean | null
  feedback?: string | null
}

const MAX_LEARNING_QUESTIONS = 10

export function SessionRunner({ kind, id }: { kind: Kind; id: number }) {
  const fetcher = () => (kind === 'interview' ? api.interviews.get(id) : api.learning.get(id))
  const { data, error, isLoading, mutate } = useSWR<Session>([kind, id], fetcher, { revalidateOnFocus: false })
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [turns, setTurns] = useState<Turn[]>([])
  const formRef = useRef<HTMLFormElement>(null)

  const backHref = kind === 'interview' ? '/dashboard/interviews' : '/dashboard/learning'
  const Icon = kind === 'interview' ? MessagesSquare : GraduationCap

  useEffect(() => {
    if (kind === 'interview' && data && 'answers' in data) {
      setTurns(
        data.answers.map((item) => ({
          n: item.question_number,
          question: item.question,
          answer: item.answer,
          isCorrect: item.is_correct,
          feedback: item.feedback,
        })),
      )
    }
  }, [data, kind])

  if (error) return <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
  if (isLoading || !data) return <div className="flex flex-col gap-4"><Skeleton className="h-24" /><Skeleton className="h-72" /></div>

  const total = 'question_count' in data ? data.question_count : MAX_LEARNING_QUESTIONS
  const current = data.question_number
  const done = data.status === 'completed'
  const answered = done ? total : Math.max((current ?? 1) - 1, 0)
  const progress = Math.round((answered / total) * 100)
  const roadmap = 'roadmap' in data ? data.roadmap : null
  const finalFeedback = 'final_feedback' in data ? data.final_feedback : data.feedback

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = answer.trim()
    if (!text || !data.question || current === null) return
    setSubmitting(true)
    try {
      const updated = kind === 'interview' ? await api.interviews.answer(id, text) : await api.learning.answer(id, text)
      if (kind === 'interview' && 'answers' in updated) {
        setTurns(
          updated.answers.map((item) => ({
            n: item.question_number,
            question: item.question,
            answer: item.answer,
            isCorrect: item.is_correct,
            feedback: item.feedback,
          })),
        )
      } else {
        setTurns((t) => [
          ...t,
          {
            n: current,
            question: data.question as string,
            answer: text,
            feedback: 'answer_feedback' in updated ? updated.answer_feedback : null,
          },
        ])
      }
      setAnswer('')
      await mutate(updated, { revalidate: false })
      if (updated.status === 'completed') toast.success('Session complete!', { description: 'Your feedback is ready.' })
    } catch (err) {
      toast.error('Could not submit answer', { description: errorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }


function FeedbackContent({ content }: { content: string }) {
  // Older LLM responses may contain literal HTML line-break tags.
  const normalized = content
    .replace(/<br\s*\/?>/gi, ' · ')
    .replace(/<\/?(?:p|div|span)>/gi, '')

  return (
    <div className="min-w-0 space-y-4 break-words text-sm leading-7 text-foreground/90">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-lg font-semibold text-foreground">
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-base font-semibold text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="leading-7">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2 pl-6">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="ps-1">{children}</li>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/70 text-foreground">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-3 font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-3 align-top">
              {children}
            </td>
          ),
          hr: () => <hr className="border-border" />,
        }}
      >
        {normalized}
      </ReactMarkdown>
    </div>
  )
}


  return (
    <div className="flex flex-col gap-6">
      <Link href={backHref} className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-bold">{kind === 'interview' ? 'Mock interview' : 'Learning session'} #{data.id}</h1>
              <p className="text-sm text-muted-foreground">
                {done ? `Completed ${formatDate(data.completed_at)}` : `Question ${current} of ${total}`}
              </p>
            </div>
          </div>
          <span className="font-display text-2xl font-bold tabular-nums text-primary">{progress}%</span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </Card>

      {roadmap && (
        <Card>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            <Map className="size-4 text-accent" aria-hidden="true" /> Your roadmap
          </h2>
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{roadmap}</p>
        </Card>
      )}

      {turns.length > 0 && (
        <ol className="flex flex-col gap-4" aria-label="Your answers this session">
          {turns.map((t) => (
            <li key={t.n} className="flex flex-col gap-3">
              <Bubble role="ai" label={`Question ${t.n}`}>{t.question}</Bubble>
              <Bubble role="user">{t.answer}</Bubble>
              {typeof t.isCorrect === 'boolean' && (
                <div
                  role="status"
                  className={`ml-11 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                    t.isCorrect
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'border-destructive/30 bg-destructive/10 text-destructive'
                  }`}
                >
                  {t.isCorrect ? (
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  ) : (
                    <XCircle className="size-4" aria-hidden="true" />
                  )}
                  {t.isCorrect ? 'Correct' : 'Needs improvement'}
                </div>
              )}
              {t.feedback && (
                <Bubble
                  role="ai"
                  label={kind === 'interview' ? 'AI assessment' : 'Feedback'}
                  tone={t.isCorrect === false ? 'danger' : 'success'}
                >
                  {t.feedback}
                </Bubble>
              )}
            </li>
          ))}
        </ol>
      )}

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="relative overflow-hidden border-success/30 p-6">
              <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-success/15 blur-3xl" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <motion.span
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15 }}
                  className="inline-flex size-12 items-center justify-center rounded-2xl bg-success/15 text-success"
                >
                  <Trophy className="size-6" aria-hidden="true" />
                </motion.span>
                <div>
                  <h2 className="text-lg font-semibold">Session complete</h2>
                  <p className="text-sm text-muted-foreground">Here&apos;s your AI feedback</p>
                </div>
              </div>
              <p className="relative mt-5 leading-relaxed whitespace-pre-line text-foreground/90">
                {finalFeedback || 'Feedback is not available.'}
              </p>
              <Link href={backHref} className="relative mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Back to sessions
              </Link>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/30 p-6">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-primary uppercase">
                <Bot className="size-4" aria-hidden="true" /> Question {current}
              </p>
              <p className="mt-3 text-lg leading-relaxed font-medium text-balance">{data.question}</p>
              <form ref={formRef} onSubmit={submit} className="mt-6 flex flex-col gap-3">
                <label htmlFor="answer" className="sr-only">Your answer</label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer… (Ctrl/⌘ + Enter to submit)"
                  maxLength={10000}
                  className="min-h-36"
                  disabled={submitting}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) formRef.current?.requestSubmit()
                  }}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground tabular-nums">{answer.length}/10,000</span>
                  <Btn type="submit" loading={submitting} disabled={!answer.trim()}>
                    {!submitting && <Send aria-hidden="true" />}
                    {current === total ? 'Submit & finish' : 'Submit answer'}
                  </Btn>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Bubble({
  role,
  label,
  tone,
  children,
}: {
  role: 'ai' | 'user'
  label?: string
  tone?: 'success' | 'danger'
  children: React.ReactNode
}) {
  const isUser = role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <span
        className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : tone === 'danger'
              ? 'bg-destructive/15 text-destructive'
              : tone === 'success'
                ? 'bg-success/15 text-success'
                : 'bg-secondary text-accent'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </span>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          isUser
            ? 'rounded-tr-sm bg-primary/15 text-foreground'
            : tone === 'danger'
              ? 'rounded-tl-sm border border-destructive/25 bg-destructive/10'
              : tone === 'success'
              ? 'rounded-tl-sm border border-success/25 bg-success/10'
              : 'glass rounded-tl-sm border border-border'
        }`}
      >
        {label && <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>}
        {children}
      </div>
    </motion.div>
  )
}
