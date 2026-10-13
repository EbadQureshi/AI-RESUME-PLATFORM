'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import type { Job, JobInput } from '@/lib/api/types'
import { Modal } from '@/components/shared/modal'
import { Btn, Field, Input, Textarea } from '@/components/shared/ui-kit'

const empty: JobInput = { title: '', company: '', location: '', description: '', requirements: '' }

export function JobFormModal({
  open,
  job,
  onClose,
  onSaved,
}: {
  open: boolean
  job: Job | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<JobInput>(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      job
        ? { title: job.title, company: job.company, location: job.location ?? '', description: job.description, requirements: job.requirements ?? '' }
        : empty,
    )
  }, [open, job])

  const set = (k: keyof JobInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload: JobInput = {
      title: form.title.trim(),
      company: form.company.trim(),
      description: form.description.trim(),
      location: form.location?.trim() || null,
      requirements: form.requirements?.trim() || null,
    }
    setSaving(true)
    try {
      if (job) await api.jobs.update(job.id, payload)
      else await api.jobs.create(payload)
      toast.success(job ? 'Job updated' : 'Job posted')
      onSaved()
      onClose()
    } catch (err) {
      toast.error('Could not save job', { description: errorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={job ? 'Edit job' : 'Post a new job'}
      description="Descriptions and requirements power the AI keyword matching."
      className="max-w-2xl"
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" id="job-title">
            <Input id="job-title" required maxLength={200} value={form.title} onChange={set('title')} placeholder="Backend Engineer" />
          </Field>
          <Field label="Company" id="job-company">
            <Input id="job-company" required maxLength={200} value={form.company} onChange={set('company')} placeholder="Acme" />
          </Field>
        </div>
        <Field label="Location" id="job-location" hint="Optional">
          <Input id="job-location" maxLength={200} value={form.location ?? ''} onChange={set('location')} placeholder="Remote" />
        </Field>
        <Field label="Description" id="job-description">
          <Textarea id="job-description" required value={form.description} onChange={set('description')} className="min-h-28" placeholder="Build and maintain APIs…" />
        </Field>
        <Field label="Requirements" id="job-requirements" hint="Optional — skills, tools, experience">
          <Textarea id="job-requirements" value={form.requirements ?? ''} onChange={set('requirements')} className="min-h-24" placeholder="Python, FastAPI, PostgreSQL" />
        </Field>
        <div className="mt-2 flex justify-end gap-2">
          <Btn type="button" variant="ghost" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" loading={saving}>{job ? 'Save changes' : 'Publish job'}</Btn>
        </div>
      </form>
    </Modal>
  )
}
