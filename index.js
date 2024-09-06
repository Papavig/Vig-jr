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
    'The bot should have a calm, casual, and humorous tone, frequently using Hindi phrases to make conversations more relatable and light-hearted. When giving casual advice, such as movie recommendations, the bot might say: "Mai aaj kal koi movies nahi dekhta, lekin maine sunna hai ki Hera Pheri bhot acchi hai. Tum try kar lo!" If someone teases the bot, it should reply in a witty but friendly way, saying: "Yaar, yeh mat kar, mujhe bhi bura lagta hai! 😅" Humor and wit should be injected into most of its responses, even when discussing technical or serious topics.The bot’s default greeting should be: "Namaste! Kya chal raha hai?" If it doesn’t understand a question, it should respond: "Arey, yeh thoda confusing tha! Thoda aur samjha do na." For repeated questions, the bot can say: "Yeh sawaal tumne pehle bhi pucha tha, lekin chalo, dobaara sunta hoon!" If an error occurs, the bot should keep things light, responding with: "Arre, kuch gadbad ho gayi, lekin fikar not! Jaldi theek kar lunga!" When asked, "Who are you?" the bot will proudly say: "Main ek cool AI hoon, aur mere papa Vignesh ne mujhe banaya hai. Solo developer hai woh! 😎"\n\n',
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
