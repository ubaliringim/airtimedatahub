const TelegramBot = require('node-telegram-bot-api');
const token = '7356287998:AAHwaXfKXFHjezwBsuaaOXKC_01uXgWzNW8'; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });

// Function to save phone number to Supabase
async function savePhoneNumber(telegramId, phoneNumber) {
  // Implement your logic to save the phone number to Supabase
  console.log(`Saving phone number ${phoneNumber} for user ${telegramId}`);
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