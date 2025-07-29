module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.1.0",
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑀_ ☢️",
	description: "Custom leave messages with random funny text",
	dependencies: {}
};

module.exports.onLoad = function () {
    return;
};

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { threadID } = event;
	const moment = require("moment-timezone");
	const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
	const hours = moment.tz("Asia/Dhaka").format("HH");

	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) 
		|| await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "leave" : "managed";

	// র‍্যান্ডম বার্তাগুলোর লিস্ট
	const leaveMessages = [
		"{name}, আগে জানলে আমিই তোমাকে বের করে দিতাম — নিজেকে পবিত্র করে তারপর আমাদের গ্রুপে আসবে — ধন্যবাদ 🙂",
		"{name}, চলে গেলে ভালো করছো... এখন একটু নিঃশ্বাস নিতে পারবো 😌",
		"{name}, মাটি এখনও কাঁপছে... এই তো একটু আগেও ছিলে 😔",
		"{name}, চলে গেলে মন খারাপ হলো না... কারণ তো থাকেই না কিছু 🤷‍♂️",
		"{name}, তুমি ছিলে একশো তে এক! এখন হলাম নিরব সেলফি গ্রুপ 📸"
	];

	// র‍্যান্ডম মেসেজ বাছাই
	const randomMessage = leaveMessages[Math.floor(Math.random() * leaveMessages.length)];

	// সময় এবং ট্যাগসহ পূর্ণ মেসেজ
	const msg = `${randomMessage}\n\n⏰ তারিখ ও সময়: ${time}\n⚙️ স্ট্যাটাস: ${type}`;

	const mention = [{
		tag: name,
		id: event.logMessageData.leftParticipantFbId
	}];

	return api.sendMessage({ body: msg, mentions: mention }, threadID);
};
