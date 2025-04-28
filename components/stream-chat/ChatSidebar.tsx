import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { getSessions } from '@/services/sessionService'
import { useEffect, useState } from 'react'
import {SessionResponse} from '@/services/sessionService'

interface ChatSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatSidebar({ open, onOpenChange }: ChatSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Chat Sessions</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full pb-4">
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 p-4">
              <SessionsList />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function SessionsList() {
  const [sessions, setSessions] = useState<SessionResponse | null>(null) // TODO: Replace 'any[]' with the correct type if known, e.g. SessionResponse[]
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await getSessions();
        console.log(data);
        setSessions(data)
      } catch (err) {
        setError('Failed to load sessions')
      } finally {
        setIsLoading(false)
      }
    }
    loadSessions()
  }, [])

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading sessions...</div>
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>
  }

  return (
    <div className="space-y-2">
      {sessions?.data?.map((session) => (
        <button
          key={session._id}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-sm',
            'hover:bg-accent/50 transition-colors',
            'text-left text-foreground'
          )}
        >
          <div className="flex flex-col flex-1 gap-1 overflow-hidden">
            <div className="truncate">{session.first_question || `Chat ${session._id}`}</div>
            <div className="text-xs text-muted-foreground truncate">
              {new Date(session.created_time).toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
