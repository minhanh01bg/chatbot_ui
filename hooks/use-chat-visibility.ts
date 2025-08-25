'use client';

import { VisibilityType } from '@/components/visibility-selector';
import { Chat } from '@/lib/db/schema';
import { useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';

const updateChatVisibility = async ({ chatId, visibility }: { chatId: string; visibility: VisibilityType }) => {
  try {
    await fetch('/api/chat/visibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, visibility }),
    });
  } catch (e) {
    console.warn('updateChatVisibility stub failed', e);
  }
};

export function useChatVisibility({
  chatId,
  initialVisibility,
}: {
  chatId: string;
  initialVisibility: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: Array<Chat> = cache.get('/api/history')?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${chatId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const chat = history.find((chat) => chat.id === chatId);
    if (!chat) return 'private';
    return chat.visibility;
  }, [history, chatId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);

    mutate<Array<Chat>>(
      '/api/history',
      (history) => {
        return history
          ? history.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  visibility: updatedVisibilityType,
                };
              }
              return chat;
            })
          : [];
      },
      { revalidate: false },
    );

    updateChatVisibility({
      chatId: chatId,
      visibility: updatedVisibilityType,
    });
  };

  return { visibilityType, setVisibilityType };
}
