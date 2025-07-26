const moment = require("moment-timezone");

module.exports.config = {
  name: "sefatboss",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Custom AI Bot",
  description: "বাংলা বট – Sefat বস, কৌতুক, কোরআন-হাদিস ও শুভেচ্ছা",
  commandCategory: "AI",
  usages: "auto reply",
  cooldowns: 3
};

// Sefat বসের জন্য ভিন্ন ভিন্ন প্রশংসা
const sefats = [
  "🌟 কিং **Sefat বস** 💎 – উনি না থাকলে এই গ্রুপ নীরস হয়ে যেত!",
  "😎 **Sefat এডমিন** 🏆 – সবার হিরো, সবার প্রিয়!",
  "🔥 **Sefat বস** – সবসময় সাহায্যকারী ও মজার মানুষ! 😂",
  "💖 **Sefat এডমিন** – হাসি আর আনন্দের প্রতীক! 🌈",
  "✨ **Sefat বস** – গ্রুপের প্রাণভোমরা! 💕"
];

// ব্যবহারকারীর নামসহ লাইন
const replies = [
  name => `😄 হ্যালো ${name}! কেমন আছেন আজ? 🌸`,
  name => `😂 ${name}, হাসিই জীবনকে সুন্দর করে – হাসুন! 😘`,
  name => `🤗 ${name}, আপনি সবার অনুপ্রেরণা – চালিয়ে যান! 💫`,
  name => `💌 ${name}, ভালোবাসা ছড়িয়ে দিন, সুখী থাকুন! 🌺`,
  name => `🙌 ${name}, সাফল্য আপনার সাথেই আছে! 🌟`
];

// কৌতুক (বাংলায়)
const jokes = [
  "😂 শিক্ষক: পরীক্ষায় শূন্য পেলি কেন? ছাত্র: প্রশ্নপত্রে লেখা ছিল 'উত্তর লিখুন' — আমি লিখিনি!",
  "🤣 ডাক্তার: সমস্যা কী? রোগী: সমস্যা নেই, কিন্তু বউ আছে, সেটাই সমস্যা!",
  "😄 বন্ধু ১: তুই এত খুশি কেন? বন্ধু ২: বউ শপিং করতে গিয়েছিল, দোকান বন্ধ ছিল!"
];

// ইসলামিক স্মরণিকা (কোরআন-হাদিস)
const islamicQuotes = [
  "🕌 রাসূল ﷺ বলেছেন: “সেরা মানুষ সেই, যে অন্যদের উপকারে আসে।” (দারাকুতনি)",
  "📖 আল-কোরআন: “নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।” (সূরা বাকারা ২:১৫৩)",
  "🕋 রাসূল ﷺ বলেছেন: “যেখানেই থাকো, আল্লাহকে ভয় কর।” (তিরমিজি)"
];

// সময় অনুযায়ী শুভেচ্ছা
function timeGreeting() {
  const hour = parseInt(moment().tz("Asia/Dhaka").format("HH"));
  if (hour < 12) return "☀️ শুভ সকাল!";
  if (hour < 18) return "🌤️ শুভ দুপুর!";
  return "🌙 শুভ রাত্রি!";
}

module.exports.handleEvent = async function({ api, event, Users }) {
  try {
    const { threadID, messageID, senderID } = event;
    const name = await Users.getNameUser(senderID) || "বন্ধু";

    // র‍্যান্ডম কন্টেন্ট নির্বাচন
    const sef = sefats[Math.floor(Math.random() * sefats.length)];
    const line = replies[Math.floor(Math.random() * replies.length)](name);
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    const islam = islamicQuotes[Math.floor(Math.random() * islamicQuotes.length)];
    const greeting = timeGreeting();
    const time = moment().tz("Asia/Dhaka").format("hh:mm A");

    const message = `
${greeting}

${sef}
${line}

কৌতুক: ${joke}
ইসলামিক স্মরণিকা: ${islam}

⏰ সময়: ${time}
`;

    api.sendMessage(message, threadID, messageID);
  } catch (err) {
    console.error(err);
  }
};
