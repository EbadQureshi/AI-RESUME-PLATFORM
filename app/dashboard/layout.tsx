import { AppShell } from '@/components/app/app-shell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="job_applier">{children}</AppShell>
}
