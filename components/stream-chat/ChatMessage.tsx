import { FC } from 'react'
import { IconRobot, IconUser } from './icons'
import { Markdown } from '@/components/markdown'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: string
  isBot?: boolean
  showAvatar?: boolean
}

const ChatMessage: FC<ChatMessageProps> = ({ message, isBot = false, showAvatar = true }) => {
  return (
    <>
      {!showAvatar ? (
        <Markdown>{message}</Markdown>
      ) : (
        <div className={cn(
          "flex gap-4 w-full box-border p-2",
          isBot ? "bg-muted/50 py-6 border-y" : "py-2"
        )}>
          <div className="flex-none">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border",
              isBot ? "bg-primary/10 text-primary border-primary/20" : "bg-background"
            )}>
              {isBot ? <IconRobot /> : <IconUser />}
            </div>
          </div>
          <div className="flex-1 space-y-2 min-w-0 overflow-hidden pr-4">
            <p className="font-semibold">{isBot ? 'AI Assistant' : 'You'}</p>
            <div className={cn(
              "prose prose-neutral dark:prose-invert max-w-none break-words",
              "prose-pre:overflow-auto prose-pre:max-w-full prose-pre:whitespace-pre-wrap",
              isBot ? "prose-p:leading-relaxed prose-pre:my-4" : ""
            )}>
              {isBot ? <Markdown>{message}</Markdown> : message}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatMessage
