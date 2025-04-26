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
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        className={cn(
          "min-h-[48px] max-h-[200px] resize-none py-3 pl-4 pr-12",
          "rounded-lg shadow-sm border-muted-foreground/20 w-full",
          "focus-visible:ring-1 focus-visible:ring-primary"
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
          "absolute right-2 top-[50%] translate-y-[-50%] h-8 w-8",
          "bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
      >
        <IconSend className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default ChatInput
