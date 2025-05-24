// /api/register.ts

import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabaseUrl = 'https://vnkdufqsmzqyqvrvwzuv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2R1ZnFzbXpxeXF2cnZ3enV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Mzc2NjQsImV4cCI6MjA2MzQxMzY2NH0.ZihwFcN3OmnkH0ENdmIPuOB9QsC8XDuGKwSX6vldx0E';

const supabase = createClient(supabaseUrl, supabaseKey);

interface TelegramUser {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
  allows_write_to_pm?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Request body:', req.body);

  try {
    const { telegramUser }: { telegramUser: TelegramUser } = req.body;

    if (!telegramUser || !telegramUser.id) {
      console.error('Invalid telegramUser data:', telegramUser);
      return res.status(400).json({ error: 'Invalid user data' });
    }

    const { data, error } = await supabase.from('users').upsert(
      [
        {
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          language_code: telegramUser.language_code,
          photo_url: telegramUser.photo_url,
          allows_write_to_pm: telegramUser.allows_write_to_pm,
          wallet_balance: 0,
        },
      ],
      { onConflict: 'telegram_id' }
    );

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('User registered/updated:', data);
    return res.status(200).json({
      message: 'User registered/updated',
      user: data,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
