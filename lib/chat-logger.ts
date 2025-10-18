'use client';

export async function logChatMessage(message: string, source: string) {
  try {
    await fetch('/api/chat-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, source }),
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to log chat message', error);
    }
  }
}
