import { NextRequest, NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILES = [
  path.join(LOG_DIR, 'chat.log'),
  path.join(LOG_DIR, 'chat-copy-1.log'),
  path.join(LOG_DIR, 'chat-copy-2.log'),
  path.join(LOG_DIR, 'chat-copy-3.log'),
  path.join(LOG_DIR, 'chat-copy-4.log'),
  path.join(LOG_DIR, 'chat-copy-5.log'),
];

async function ensureLogFiles() {
  await mkdir(LOG_DIR, { recursive: true });
  await Promise.all(
    LOG_FILES.map(async (filePath) => {
      if (!existsSync(filePath)) {
        await appendFile(filePath, '', { encoding: 'utf8' });
      }
    })
  );
}

export async function POST(request: NextRequest) {
  try {
    const { message, source } = await request.json();
    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await ensureLogFiles();

    const entry = `[${new Date().toISOString()}][${(source ?? 'unknown').toString()}] ${message.trim()}\n`;
    await Promise.all(
      LOG_FILES.map((filePath) => appendFile(filePath, entry, { encoding: 'utf8' }))
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Chat log error:', error);
    return NextResponse.json({ error: 'Failed to log message' }, { status: 500 });
  }
}
