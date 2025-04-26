'use client'

import ChatContainer from '@/components/stream-chat/ChatContainer'

export default function StreamPage() {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col">
      <div className="flex-1 w-full overflow-hidden">
        <div className="relative h-full w-full">
          <ChatContainer />
        </div>
      </div>
    </div>
  )
}
