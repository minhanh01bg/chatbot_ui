import { FC, FormEvent, useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { IconSend } from './icons'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

const ChatInput: FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight + 2, 200)}px`
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [message])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="w-full relative">
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className={cn(
            "min-h-[56px] max-h-[200px] resize-none py-4 pl-5 pr-16",
            "rounded-2xl border-0 shadow-none bg-transparent",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-gray-400 text-gray-700",
            "text-base leading-relaxed"
          )}
          disabled={disabled}
          rows={1}
        />
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          size="icon"
          className={cn(
            "absolute right-2 top-[50%] translate-y-[-50%] h-10 w-10",
            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
            "text-white shadow-md hover:shadow-lg transition-all duration-200",
            "rounded-xl border-0",
            disabled || !message.trim() ? "opacity-50 cursor-not-allowed" : "opacity-100"
          )}
        >
          <IconSend className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Helper text */}
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-xs text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </p>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
