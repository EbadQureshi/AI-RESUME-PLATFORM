'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { CloudUpload, FileCheck2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/shared/ui-kit'

export function ResumeDropzone({ onUploaded }: { onUploaded: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported')
      return
    }
    setUploading(file.name)
    try {
      const res = await api.resumes.upload(file)
      toast.success('Resume uploaded', {
        description: `${res.original_filename} · extracted via ${res.extraction_method}`,
      })
      onUploaded()
    } catch (err) {
      toast.error('Upload failed', { description: errorMessage(err) })
    } finally {
      setUploading(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        upload(e.dataTransfer.files?.[0])
      }}
      className={cn(
        'relative overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-all',
        dragging ? 'scale-[1.01] border-primary bg-primary/10' : 'border-border bg-card/40 hover:border-primary/50',
      )}
    >
      {uploading && (
        <div className="absolute inset-x-8 top-0 h-0.5 animate-scan bg-gradient-to-r from-transparent via-accent to-transparent" aria-hidden="true" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        id="resume-file"
        onChange={(e) => upload(e.target.files?.[0])}
        disabled={!!uploading}
      />
      <motion.span
        animate={dragging ? { y: -6, scale: 1.1 } : { y: 0, scale: 1 }}
        className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-accent/15 text-primary"
      >
        {uploading ? <Spinner className="size-7" /> : dragging ? <FileCheck2 className="size-7" aria-hidden="true" /> : <CloudUpload className="size-7" aria-hidden="true" />}
      </motion.span>
      <p className="mt-4 font-semibold">
        {uploading ? `Extracting ${uploading}…` : 'Drag & drop your resume PDF'}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {uploading ? 'Scanned files may take a little longer (OCR).' : 'or'}
      </p>
      {!uploading && (
        <label
          htmlFor="resume-file"
          className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-xl bg-gradient-to-r from-primary to-[oklch(0.6_0.2_260)] px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
        >
          Browse files
        </label>
      )}
    </motion.div>
  )
}
