'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, FileText, ScanText } from 'lucide-react'
import { useResumes } from '@/lib/hooks'
import { errorMessage } from '@/lib/api/client'
import type { Resume } from '@/lib/api/types'
import { EmptyState, ErrorBox, PageHeader } from '@/components/shared/display'
import { Badge, Skeleton } from '@/components/shared/ui-kit'
import { ResumeDropzone } from '@/components/resumes/resume-dropzone'

export default function ResumesPage() {
  const { data: resumes, error, isLoading, mutate } = useResumes()

  return (
    <>
      <PageHeader
        icon={FileText}
        title="My resumes"
        description="Upload PDFs. We extract text directly, or with OCR for scanned files."
      />
      <ResumeDropzone onUploaded={() => mutate()} />

      <section className="mt-10" aria-labelledby="resume-list">
        <h2 id="resume-list" className="mb-4 text-lg font-semibold">
          Uploaded resumes {resumes ? `(${resumes.length})` : ''}
        </h2>
        {error ? (
          <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : !resumes?.length ? (
          <EmptyState icon={FileText} title="No resumes yet" description="Drop a PDF above to get started." />
        ) : (
          <ul className="flex flex-col gap-3">
            {resumes.map((r, i) => <ResumeItem key={r.id} resume={r} index={i} />)}
          </ul>
        )}
      </section>
    </>
  )
}

function ResumeItem({ resume, index }: { resume: Resume; index: number }) {
  const [open, setOpen] = useState(false)
  const words = resume.extracted_text.trim().split(/\s+/).filter(Boolean).length
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="glass overflow-hidden rounded-2xl border border-border"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-4 text-left hover:bg-secondary/30"
      >
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{resume.original_filename}</p>
          <p className="text-xs text-muted-foreground">
            Resume #{resume.id} · {words.toLocaleString()} words
          </p>
        </div>
        <Badge tone={resume.extraction_method === 'ocr' ? 'warning' : 'accent'} className="uppercase">
          <ScanText className="size-3" aria-hidden="true" />
          {resume.extraction_method}
        </Badge>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <pre className="max-h-80 overflow-auto border-t border-border bg-background/50 p-4 font-sans text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {resume.extracted_text || 'No text could be extracted.'}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
