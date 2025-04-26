import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

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
  return (
    <div className="space-y-2">
      {Array.from({length: 5}).map((_, i) => (
        <button
          key={i}
          className={cn(
            'flex w-full items-center rounded-lg px-3 py-2 text-sm',
            'hover:bg-accent/50 transition-colors',
            'text-left text-foreground'
          )}
        >
          <div className="flex flex-col flex-1 gap-1 overflow-hidden">
            <div className="truncate">Chat session {i + 1}</div>
            <div className="text-xs text-muted-foreground truncate">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
