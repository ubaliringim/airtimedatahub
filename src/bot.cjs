const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

const token = '7356287998:AAHwaXfKXFHjezwBsuaaOXKC_01uXgWzNW8';
const bot = new TelegramBot(token, { polling: true });

const supabase = createClient(
  'https://vnkdufqsmzqyqvrvwzuv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2R1ZnFzbXpxeXF2cnZ3enV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Mzc2NjQsImV4cCI6MjA2MzQxMzY2NH0.ZihwFcN3OmnkH0ENdmIPuOB9QsC8XDuGKwSX6vldx0E'
);

// Store users waiting for phone number
const waitingForPhone = new Map();

// Save or update user in Supabase
async function saveOrUpdateUser(user) {
  const { id, username, first_name, last_name, phone_number = null } = user;

  const { error } = await supabase.from('users').upsert(
    {
      telegram_id: id,
      username,
      first_name,
      last_name,
      phone_number,
      wallet_balance: 0,
      email: null
    },
    { onConflict: 'telegram_id' }
  );

  if (error) console.error('Supabase Error:', error);
}

// Update phone number only
async function updatePhoneNumber(telegramId, phoneNumber) {
  const { error } = await supabase
    .from('users')
    .update({ phone_number: phoneNumber })
    .eq('telegram_id', telegramId);

  if (error) console.error('Error updating phone number:', error);
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;

  // Save user without phone number
  await saveOrUpdateUser(user);

  // Ask for phone number
  bot.sendMessage(chatId, 'Welcome! Please enter your phone number:');
  waitingForPhone.set(user.id, true); // Flag this user
});

// Handle all messages (to capture phone number text)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Ignore commands and system messages
  if (msg.text?.startsWith('/')) return;

  // If waiting for phone number
  if (waitingForPhone.get(userId)) {
    const phoneNumber = msg.text;

    // Optional: validate format
    const isValid = /^\+?\d{7,15}$/.test(phoneNumber);
    if (!isValid) {
      return bot.sendMessage(chatId, 'Invalid phone number. Please try again (e.g., +2348012345678)');
    }

    // Save to Supabase
    await updatePhoneNumber(userId, phoneNumber);

    waitingForPhone.delete(userId); // Done collecting

    // Send CONTINUE button only
    bot.sendMessage(chatId, '✅ Phone number saved!', {
      reply_markup: {
       inline_keyboard: [
  [{ text: 'CONTINUE', web_app: { url: 'https://airtimedatahub.vercel.app' } }]
]

      }
    });
  }
});
