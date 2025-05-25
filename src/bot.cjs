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

// Function to check if user exists in Supabase
async function checkUserExists(telegramId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('telegram_id')
      .eq('telegram_id', telegramId);

    if (error) {
      console.error('Error checking user existence:', error);
      return false;
    }

    return data.length > 0;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Function to save new user to Supabase
async function saveNewUser(telegramId, username, firstName, lastName) {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        telegram_id: telegramId,
        username: username,
        first_name: firstName,
        last_name: lastName,
        wallet_balance: 0, // Initialize wallet balance to 0
        email: null, // Email can be updated later if available
        phone_number: null // Phone number will be updated when received
      });

    if (error) {
      console.error('Error saving new user:', error);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name || ''; // Handle case where last name might be undefined

  // Check if user exists
  const userExists = await checkUserExists(telegramId);

  if (!userExists) {
    // Save new user
    await saveNewUser(telegramId, username, firstName, lastName);

    // Greet the user and ask for phone number
    bot.sendMessage(chatId, `Hi ${firstName}! Please insert your phone number:`, {
      reply_markup: {
        keyboard: [
          [{ text: 'Share Contact', request_contact: true }]
        ],
        one_time_keyboard: true
      }
    });
  } else {
    // Greet returning user
    bot.sendMessage(chatId, `Welcome back, ${firstName}!`);
  }
});

bot.on('contact', async (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;
  const telegramId = msg.from.id;

  // Save the phone number to your database
  await savePhoneNumber(telegramId, phoneNumber);

  // Send a message with a link to the web app
  bot.sendMessage(chatId, 'Thank you! You can now access the web app: https://your-web-app-url.com', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Open App',
            url: 'https://your-web-app-url.com' // Replace with your actual app URL
          }
        ]
      ]
    }
  });
}); 