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
          "flex gap-4 w-full box-border p-4",
          isBot ? "bg-white/60 backdrop-blur-sm border-b border-gray-200/30" : "py-4"
        )}>
          <div className="flex-none">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm",
              isBot 
                ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white border-purple-200" 
                : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 border-gray-300"
            )}>
              {isBot ? <IconRobot /> : <IconUser />}
            </div>
          </div>
          <div className="flex-1 space-y-3 min-w-0 overflow-hidden pr-4">
            <div className="flex items-center gap-2">
              <p className={cn(
                "font-semibold text-sm",
                isBot ? "text-purple-700" : "text-gray-700"
              )}>
                {isBot ? 'AI Assistant' : 'You'}
              </p>
              {isBot && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>
            <div className={cn(
              "prose prose-neutral dark:prose-invert max-w-none break-words",
              "prose-pre:overflow-auto prose-pre:max-w-full prose-pre:whitespace-pre-wrap",
              "prose-p:leading-relaxed prose-pre:my-4 prose-p:text-gray-700",
              isBot ? "prose-p:text-gray-800" : "prose-p:text-gray-700"
            )}>
              {isBot ? <Markdown>{message}</Markdown> : (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-fit ml-auto">
                  <p className="text-white">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatMessage
