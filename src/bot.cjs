const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const token = '7356287998:AAHwaXfKXFHjezwBsuaaOXKC_01uXgWzNW8'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

const supabaseUrl = 'https://vnkdufqsmzqyqvrvwzuv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZua2R1ZnFzbXpxeXF2cnZ3enV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4Mzc2NjQsImV4cCI6MjA2MzQxMzY2NH0.ZihwFcN3OmnkH0ENdmIPuOB9QsC8XDuGKwSX6vldx0E';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to save phone number to Supabase
async function savePhoneNumber(telegramId, phoneNumber) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ phone_number: phoneNumber })
      .eq('telegram_id', telegramId);

    if (error) {
      console.error('Error updating phone number:', error);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Send a message with an inline keyboard to request the phone number
  bot.sendMessage(chatId, 'Please share your phone number:', {
    reply_markup: {
      keyboard: [
        [{ text: 'Share Contact', request_contact: true }]
      ],
      one_time_keyboard: true
    }
  });
});

bot.on('contact', (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;

  // Save the phone number to your database
  savePhoneNumber(msg.from.id, phoneNumber);

  // Send a message with a link to the web app
  bot.sendMessage(chatId, 'Thank you! You can now access the web app: https://your-web-app-url.com');
}); 