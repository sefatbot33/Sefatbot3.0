module.exports.handleEvent = async function({ event, api }) {
  const { messageID, threadID, senderID, body, type, messageReply } = event;

  if (!body || body.toLowerCase() !== "edit") return;

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("⚠️ অনুগ্রহ করে একটি ছবির রিপ্লাইতে 'Edit' লিখুন।", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage("⚠️ শুধুমাত্র ছবির রিপ্লাই দিন।", threadID, messageID);
  }

  const imageUrl = attachment.url;
  const path = __dirname + `/cache/edit_${senderID}.jpg`;

  try {
    console.log("Image URL:", imageUrl);

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    if (response.status !== 200) throw new Error("Image download failed.");

    fs.writeFileSync(path, Buffer.from(response.data, "binary"));

    const image = await jimp.read(path);
    image
      .greyscale()
      .contrast(0.5)
      .resize(512, jimp.AUTO);

    await image.writeAsync(path);

    return api.sendMessage({
      body: "✅ এডিট করা ছবি নিচে দেওয়া হলো!",
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (error) {
    console.error("Image processing error:", error);
    return api.sendMessage("❌ ছবি এডিট করতে সমস্যা হয়েছে।", threadID, messageID);
  }
};
