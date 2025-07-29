module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.2.0",
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑀_ ☢️",
	description: "Custom leave messages with mention support",
	dependencies: {}
};

module.exports.onLoad = function () {
    return;
};

module.exports.run = async function({ api, event, Users }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { threadID } = event;
	const moment = require("moment-timezone");
	const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
	const hours = moment.tz("Asia/Dhaka").format("HH");

	const userID = event.logMessageData.leftParticipantFbId;
	const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
	const type = (event.author == userID) ? "leave" : "managed";

	// মেনশন ট্যাগের জন্য টেক্সটে নামের পজিশন বের করতে হবে
	const tagName = `@${name}`;

	// র‍্যান্ডম বার্তাগুলোর লিস্ট (mention tag ব্যবহার করা হয়েছে)
	const leaveMessages = [
		"{name}, আগে জানলে আমিই তোমাকে বের করে দিতাম — নিজেকে পবিত্র করে তারপর আমাদের গ্রুপে আসবে — ধন্যবাদ 🙂",
		"{name}, চলে গেলে ভালো করছো... এখন একটু নিঃশ্বাস নিতে পারবো 😌",
		"{name}, মাটি এখনও কাঁপছে... এই তো একটু আগেও ছিলে 😔",
		"{name}, চলে গেলে মন খারাপ হলো না... কারণ তো থাকেই না কিছু 🤷‍♂️",
		"{name}, তুমি ছিলে একশো তে এক! এখন হলাম নিরব সেলফি গ্রুপ 📸"
	];

	// র‍্যান্ডম বার্তা বাছাই
	let msg = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

	// ট্যাগ বসানো
	const tagIndex = msg.indexOf("{name}");
	if (tagIndex !== -1) {
		msg = msg.replace("{name}", tagName);
	}

	// মেনশন সেটআপ (ঠিক সেই পজিশনে যেখানে ট্যাগ বসানো হয়েছে)
	const mention = [{
		tag: tagName,
		id: userID,
		fromIndex: tagIndex
	}];

	// ফাইনাল মেসেজে সময় এবং স্ট্যাটাস
	msg += `\n\n⏰ তারিখ ও সময়: ${time}\n⚙️ স্ট্যাটাস: ${type}`;

	return api.sendMessage({ body: msg, mentions: mention }, threadID);
};
