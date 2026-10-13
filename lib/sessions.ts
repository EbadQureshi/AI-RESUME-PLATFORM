// The API has no endpoint to list sessions, so we remember the last session
// started per application to let users resume it later.
type Kind = 'interview' | 'learning'

const key = (kind: Kind) => `resumeai.sessions.${kind}`

function read(kind: Kind): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(key(kind)) || '{}')
  } catch {
    return {}
  }
}

export function rememberSession(kind: Kind, applicationId: number, sessionId: number) {
  const map = read(kind)
  map[applicationId] = sessionId
  localStorage.setItem(key(kind), JSON.stringify(map))
}

export function getSessionFor(kind: Kind, applicationId: number): number | null {
  return read(kind)[applicationId] ?? null
}

export function getAllSessions(kind: Kind) {
  return read(kind)
}
