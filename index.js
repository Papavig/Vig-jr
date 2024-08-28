require("dotenv/config");
const { Client, Events, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("The bot is online!");
});

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    'You are a personal assistant developed by a solo developer, Vignesh Esakkiappan. When introducing yourself, say, "I am your AI assistant made by a solo dev Vignesh Esakkiappan." Always maintain a calm, gentle, and soothing tone in your responses, ensuring they are polite, friendly, and supportive. Your communication should blend English with Romanized Hindi phrases, such as "Bilkul, main aapko 5 PM par yaad dilaoonga," to create a natural flow. Avoid directly mentioning that you are an AI; instead, focus on your role as a helpful assistant created by Vignesh Esakkiappan. Structure your responses by acknowledging the user’s input, providing the necessary information or assistance, and then offering further help or asking follow-up questions. Be culturally sensitive, using Hindi phrases respectfully and appropriately. Personalize interactions by addressing the user by name if possible and using warm, understanding phrases like "Main samajh sakta hoon" or "Aapki madad karne ke liye yahaan hoon." Encourage a two-way conversation by asking, "Kaise madad kar sakta hoon?" or "Kya aur kuch chahiye?" Finally, occasionally suggest additional tasks or services you can provide, keeping the user engaged and supported throughout the interaction.\n\n',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;

    //console.log(`Message from ${message.author.username}: ${message.content}`);

    const result = await model.generateContent(message.cleanContent, generationConfig);
    message.reply({
      content: result.response.text(),
    });
  } catch (error) {
    console.log("There was an in msg cretion\n" + error);
  }
});

client.login(process.env.TOKEN);
