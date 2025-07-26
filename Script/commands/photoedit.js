const fs = require("fs-extra");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
  name: "photoedit",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️",
  description: "Reply 'Edit' to a photo to edit it",
  commandCategory: "media",
  usages: "reply 'Edit' to a photo",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID, body, messageReply, senderID } = event;

  if (!body || typeof body !== "string" || body.toLowerCase() !== "edit") return;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0 || messageReply.attachments[0].type !== "photo") {
    return api.sendMessage("⚠️ অনুগ্রহ করে একটি ছবির রিপ্লাইতে 'Edit' লিখুন।", threadID, messageID);
  }

  const imageUrl = messageReply.attachments[0].url;
  const path = __dirname + `/cache/edit_${senderID}.jpg`;

  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(response.data, "binary"));

    const image = await jimp.read(path);
    image
      .greyscale()
      .contrast(0.5)
      .resize(512, jimp.AUTO);

    await image.writeAsync(path);

    api.sendMessage({
      body: "✅ এডিট করা ছবি নিচে দেওয়া হলো!",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ ছবি এডিট করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};

module.exports.run = () => {};
