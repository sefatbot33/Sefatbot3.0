const fs = global.nodemodule["fs-extra"];
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "photoedit",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Edit photo when replied with 'Edit'",
  commandCategory: "media",
  usages: "reply with 'Edit' to an image",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ event, api, Users }) {
  const { messageID, threadID, senderID, body, type, messageReply } = event;

  // Only act if the message is "Edit"
  if (!body || body.toLowerCase() !== "edit") return;

  // Check if the message is a reply to a photo
  if (!messageReply || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("⚠️ অনুগ্রহ করে একটি ছবির রিপ্লাইতে 'Edit' লিখুন।", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;

  try {
    const path = __dirname + `/cache/edit_${senderID}.jpg`;

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data, "binary"));

    const image = await jimp.read(path);
    image
      .greyscale() // কালো-সাদা করে দিচ্ছে
      .contrast(0.5) // কনট্রাস্ট বাড়িয়ে দিচ্ছে
      .resize(512, jimp.AUTO); // সাইজ পরিবর্তন

    await image.writeAsync(path);

    api.sendMessage({
      body: "✅ এডিট করা ছবি নিচে দেওয়া হলো!",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ ছবি এডিট করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};

module.exports.run = () => {};
