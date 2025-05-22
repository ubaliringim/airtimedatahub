import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vnkdufqsmzqyqvrvwzuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2R1ZnFzbXpxeXF2cnZ3enV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Mzc2NjQsImV4cCI6MjA2MzQxMzY2NH0.ZihwFcN3OmnkH0ENdmIPuOB9QsC8XDuGKwSX6vldx0E';
const supabase = createClient(supabaseUrl, supabaseKey);

interface TelegramUser {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  email?: string;
  wallet_balance?: number;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("Request body:", req.body); // Log the request body

  const { telegramUser }: { telegramUser: TelegramUser } = req.body;

  // Upsert user into 'users' table
  const { data, error } = await supabase
    .from('users')
    .upsert([
      {
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        email: telegramUser.email,
        wallet_balance: telegramUser.wallet_balance || 0, // Default to 0 if not provided
      }
    ], { onConflict: 'telegram_id' });

  if (error) {
    console.error("Supabase error:", error); // Log Supabase error
    return res.status(500).json({ error: error.message });
  }

  console.log("User registered/updated:", data); // Log success
  return res.status(200).json({
    message: 'User registered/updated',
    user: data,
  });
}