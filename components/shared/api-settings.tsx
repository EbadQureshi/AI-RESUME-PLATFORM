'use client'

import { useState } from 'react'
import { Server } from 'lucide-react'
import { toast } from 'sonner'
import { mutate } from 'swr'
import { getApiBaseUrl, getDefaultApiBaseUrl, setApiBaseUrl } from '@/lib/api/client'
import { useHealth } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { Modal } from './modal'
import { Btn, Field, Input } from './ui-kit'

export function ApiStatusButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const { data, error, isLoading } = useHealth()
  const online = data?.status === 'ok' && !error

  const openModal = () => {
    setUrl(getApiBaseUrl())
    setOpen(true)
  }

  const save = async () => {
    setApiBaseUrl(url)
    setOpen(false)
    await mutate(() => true)
    toast.success('API endpoint updated', { description: getApiBaseUrl() })
  }

  return (
    <>
      <button
        onClick={openModal}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground',
          className,
        )}
        aria-label={`API status: ${isLoading ? 'checking' : online ? 'online' : 'offline'}. Configure API endpoint`}
      >
        <span className="relative flex size-2">
          {online && <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />}
          <span
            className={cn(
              'relative inline-flex size-2 rounded-full',
              isLoading ? 'bg-warning' : online ? 'bg-success' : 'bg-destructive',
            )}
          />
        </span>
        <span className="hidden sm:inline">{isLoading ? 'Checking API' : online ? 'API online' : 'API offline'}</span>
        <Server className="size-3.5" aria-hidden="true" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="API endpoint"
        description="Point the app at your FastAPI server. The server must allow CORS from this origin."
      >
        <div className="flex flex-col gap-4">
          <Field label="Base URL" id="api-url" hint={`Default: ${getDefaultApiBaseUrl()}`}>
            <Input
              id="api-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000"
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Btn
              variant="ghost"
              onClick={() => {
                setUrl(getDefaultApiBaseUrl())
              }}
            >
              Reset
            </Btn>
            <Btn onClick={save}>Save endpoint</Btn>
          </div>
        </div>
      </Modal>
    </>
  )
}
