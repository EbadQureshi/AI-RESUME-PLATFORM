'use client'

import useSWR from 'swr'
import { motion } from 'motion/react'
import { Crown, Download } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { useAdminApplications } from '@/lib/hooks'
import { toPct } from '@/lib/format'
import type { Job } from '@/lib/api/types'
import { Modal } from '@/components/shared/modal'
import { ErrorBox, ScoreRing, StatusBadge } from '@/components/shared/display'
import { Btn, Skeleton } from '@/components/shared/ui-kit'
import { cn } from '@/lib/utils'

export function TopMatchesModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { data, error, isLoading, mutate } = useSWR(job ? ['top-matches', job.id] : null, () =>
    api.admin.topMatches(job!.id),
  )
  const { data: apps } = useAdminApplications()
  const appMap = new Map(apps?.map((a) => [a.id, a]))

  const download = async (id: number, filename: string) => {
    try {
      await api.admin.downloadResume(id, filename)
    } catch (err) {
      toast.error('Download failed', { description: errorMessage(err) })
    }
  }

  return (
    <Modal
      open={!!job}
      onClose={onClose}
      title={`Top matches · ${job?.title ?? ''}`}
      description="Applicants ranked by keyword similarity between their resume and this job."
      className="max-w-2xl"
    >
      {error ? (
        <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : !data?.length ? (
        <p className="py-10 text-center text-sm text-muted-foreground">No applicants for this job yet.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {data.map((m, i) => {
            const app = appMap.get(m.application_id)
            return (
              <motion.li
                key={m.application_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-3',
                  i === 0 ? 'border-warning/40 bg-warning/8' : 'border-border bg-secondary/30',
                )}
              >
                <span
                  className={cn(
                    'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                    i === 0 ? 'bg-warning/20 text-warning' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {i === 0 ? <Crown className="size-4" aria-label="Rank 1" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{app?.candidate_email ?? `User #${m.user_id}`}</p>
                  <p className="text-xs text-muted-foreground">
                    Application #{m.application_id} · Resume #{m.resume_id}
                  </p>
                </div>
                {app && <StatusBadge status={app.status} />}
                {app && (
                  <Btn variant="ghost" size="icon" onClick={() => download(app.id, app.resume_filename)} aria-label="Download resume">
                    <Download className="size-4" />
                  </Btn>
                )}
                <ScoreRing value={toPct(m.score)} size={44} />
              </motion.li>
            )
          })}
        </ol>
      )}
    </Modal>
  )
}
