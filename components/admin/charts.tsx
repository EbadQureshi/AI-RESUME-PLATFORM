'use client'

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { APPLICATION_STATUSES, type AdminApplication, type Analytics } from '@/lib/api/types'

const tooltipStyle = {
  contentStyle: {
    background: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: 'var(--popover-foreground)',
    fontSize: 12,
  },
  itemStyle: { color: 'var(--popover-foreground)' },
  cursor: { fill: 'color-mix(in oklch, var(--primary) 10%, transparent)' },
}

export function FunnelChart({ analytics }: { analytics: Analytics }) {
  const data = [
    { name: 'Applied', value: analytics.total_applications, fill: 'var(--primary)' },
    { name: 'Interviewed', value: analytics.interviewed_candidates, fill: 'var(--accent)' },
    { name: 'Selected', value: analytics.selected_candidates, fill: 'var(--success)' },
  ]
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={90} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={34} animationDuration={1200}>
            {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function JobsDonut({ open, closed }: { open: number; closed: number }) {
  const data = [
    { name: 'Open', value: open, fill: 'var(--accent)' },
    { name: 'Closed', value: closed, fill: 'var(--warning)' },
  ]
  const total = open + closed
  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip {...tooltipStyle} />
          <Pie
            data={total ? data : [{ name: 'None', value: 1, fill: 'var(--secondary)' }]}
            dataKey="value"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={total ? 4 : 0}
            stroke="none"
            animationDuration={1200}
          >
            {(total ? data : [{ name: 'None', fill: 'var(--secondary)' }]).map((d) => <Cell key={d.name} fill={d.fill} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular-nums">{total}</span>
        <span className="text-xs text-muted-foreground">total jobs</span>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs">
        {data.map((d) => (
          <span key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: d.fill }} aria-hidden="true" />
            {d.name} {d.value}
          </span>
        ))}
      </div>
    </div>
  )
}

const statusColor: Record<string, string> = {
  received: 'var(--muted-foreground)',
  reviewing: 'var(--accent)',
  interviewed: 'var(--primary)',
  selected: 'var(--success)',
  rejected: 'var(--destructive)',
}

export function StatusBars({ applications }: { applications: AdminApplication[] }) {
  const data = APPLICATION_STATUSES.map((s) => ({
    name: s,
    value: applications.filter((a) => a.status === s).length,
  }))
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1200}>
            {data.map((d) => <Cell key={d.name} fill={statusColor[d.name]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
