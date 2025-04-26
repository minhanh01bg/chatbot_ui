'use client'

import ChatContainer from '@/components/stream-chat/ChatContainer'

export default function StreamPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col">
      <div className="flex-1 w-full overflow-hidden">
        <div className="relative h-full mx-auto max-w-4xl px-4">
          <ChatContainer />
        </div>
      </div>
    </div>
  )
}
