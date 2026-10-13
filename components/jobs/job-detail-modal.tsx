'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle2, FileText, MapPin, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useSWRConfig } from 'swr'
import { useAuth } from '@/lib/auth-context'
import { useResumes } from '@/lib/hooks'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { formatDate } from '@/lib/format'
import type { Job } from '@/lib/api/types'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/shared/modal'
import { CompanyAvatar } from '@/components/shared/display'
import { Btn, btnClass, Spinner } from '@/components/shared/ui-kit'

export function JobDetailModal({
  job,
  onClose,
  applied,
}: {
  job: Job | null
  onClose: () => void
  applied?: boolean
}) {
  return (
    <Modal open={!!job} onClose={onClose} title={job?.title ?? ''} description={job?.company} className="max-w-2xl">
      {job && <JobDetailBody job={job} applied={applied} onDone={onClose} />}
    </Modal>
  )
}

function JobDetailBody({ job, applied, onDone }: { job: Job; applied?: boolean; onDone: () => void }) {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <CompanyAvatar name={job.company} className="size-14 text-base" />
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" /> {job.location}
            </span>
          )}
          <span>Posted {formatDate(job.created_at)}</span>
        </div>
      </div>

      <section>
        <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">About the role</h3>
        <p className="text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
      </section>
      {job.requirements && (
        <section>
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Requirements</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line">{job.requirements}</p>
        </section>
      )}

      <div className="border-t border-border pt-5">
        {!user ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Sign in as a job seeker to apply.</p>
            <div className="flex gap-2">
              <Link href={`/login?next=/dashboard/jobs`} className={btnClass('outline', 'md')}>Sign in</Link>
              <Link href="/register" className={btnClass('primary', 'md')}>Create account</Link>
            </div>
          </div>
        ) : user.role === 'admin' ? (
          <p className="text-sm text-muted-foreground">Admins manage jobs from the admin dashboard.</p>
        ) : applied ? (
          <p className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="size-4" aria-hidden="true" /> You already applied to this role.
          </p>
        ) : (
          <ApplyForm jobId={job.id} onDone={onDone} />
        )}
      </div>
    </div>
  )
}

function ApplyForm({ jobId, onDone }: { jobId: number; onDone: () => void }) {
  const { data: resumes, isLoading } = useResumes()
  const [resumeId, setResumeId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()

  if (isLoading) return <Spinner />

  if (!resumes?.length) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Upload a resume first to apply.</p>
        <Link href="/dashboard/resumes" className={btnClass('primary', 'md')}>
          <Upload aria-hidden="true" /> Upload resume
        </Link>
      </div>
    )
  }

  const chosen = resumeId ?? resumes[0].id

  const apply = async () => {
    setSubmitting(true)
    try {
      const app = await api.applications.apply(jobId, chosen)
      await mutate((key) => Array.isArray(key) && key[0] === 'applications')
      toast.success('Application submitted', { description: 'Run AI analysis to see your match.' })
      onDone()
      router.push(`/dashboard/applications/${app.id}`)
    } catch (err) {
      toast.error('Could not apply', { description: errorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-3 text-sm font-semibold">Choose a resume</legend>
      <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
        {resumes.map((r) => (
          <label
            key={r.id}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors',
              chosen === r.id ? 'border-primary/60 bg-primary/10' : 'border-border hover:bg-secondary/50',
            )}
          >
            <input
              type="radio"
              name="resume"
              className="accent-[var(--primary)]"
              checked={chosen === r.id}
              onChange={() => setResumeId(r.id)}
            />
            <FileText className="size-4 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{r.original_filename}</span>
            <span className="text-xs text-muted-foreground uppercase">{r.extraction_method}</span>
          </label>
        ))}
      </div>
      <Btn onClick={apply} loading={submitting} size="lg">Submit application</Btn>
    </fieldset>
  )
}
