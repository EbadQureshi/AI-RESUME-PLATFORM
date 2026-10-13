'use client'

import useSWR from 'swr'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/client'
import { Modal } from '@/components/shared/modal'
import { Btn, Skeleton } from '@/components/shared/ui-kit'
import { ErrorBox } from '@/components/shared/display'
import type { Job } from '@/lib/api/types'

const stars = (count: number) => count ? '★'.repeat(count) + '☆'.repeat(5-count) : '☆☆☆☆☆'

export function CompetitionModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { data, error, isLoading, mutate } = useSWR(job ? ['competition', job.id] : null, () => api.admin.competition(job!.id))
  const download = async (applicationId: number, filename: string) => {
    try { await api.admin.downloadResume(applicationId, filename) }
    catch (err) { toast.error('Resume download failed', { description: errorMessage(err) }) }
  }
  return <Modal open={!!job} onClose={onClose} title={`Interview competition · ${job?.title ?? ''}`} description="Rankings include candidates with a completed interview. Score is the percentage of correctly assessed answers; ties are ordered by completion time." className="max-w-4xl">
    {error ? <ErrorBox message={errorMessage(error)} onRetry={() => mutate()} /> : isLoading ? <div className="flex flex-col gap-3">{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-16" />)}</div> : !data?.length ? <p className="py-10 text-center text-sm text-muted-foreground">No completed interview sessions for this job yet.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead><tr className="border-b border-border text-left text-xs uppercase text-muted-foreground"><th className="p-3">Rank</th><th className="p-3">Candidate</th><th className="p-3">CV</th><th className="p-3">Correct</th><th className="p-3">Score</th><th className="p-3">Stars</th><th className="p-3">Download</th></tr></thead><tbody className="divide-y divide-border">{data.map((candidate) => <tr key={candidate.application_id} className="hover:bg-secondary/20"><td className="p-3 font-bold">#{candidate.rank}</td><td className="p-3"><p className="font-medium">{candidate.candidate_name}</p><p className="text-xs text-muted-foreground">{candidate.candidate_email}</p></td><td className="p-3"><p className="max-w-40 truncate">{candidate.resume_filename}</p></td><td className="p-3 tabular-nums">{candidate.correct_answers}/{candidate.total_questions}</td><td className="p-3 font-semibold tabular-nums">{candidate.score}%</td><td className="p-3 whitespace-nowrap text-amber-400" title={`${candidate.stars} stars`}>{stars(candidate.stars)} <span className="text-xs text-muted-foreground">({candidate.stars})</span></td><td className="p-3"><Btn size="sm" variant="outline" onClick={() => download(candidate.application_id, candidate.resume_filename)}><Download className="size-4" /> CV</Btn></td></tr>)}</tbody></table></div>}
    <p className="mt-4 text-xs text-muted-foreground">Star thresholds: 0% = 0 stars; greater than 0–under 20% = 1; 20–under 40% = 2; 40–under 60% = 3; 60–under 80% = 4; 80–100% = 5.</p>
  </Modal>
}
