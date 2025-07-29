module.exports.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.1.0",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ (Modified by ChatGPT)",
    description: "Automatically set nickname and send welcome messages for new members"
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID } = event;
    const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

    // কিছু সুন্দর র্যান্ডম লাইন (প্রতিবার এলোমেলোভাবে পাঠাবে)
    const welcomeMessages = [
        "আসসালামু আলাইকুম 🌸\nআমি সিফাতের বট 🤖\nসিফাত ভাই পৃথিবীর সেরা এডমিন! ❤️",
        "হ্যালো নতুন সদস্য! 👋\nআমি সিফাত ভাইয়ের বিশ্বস্ত বট 😊\nসিফাত ভাইকে সালাম দাও, উনি অসাধারণ!",
        "স্বাগতম নতুন ভাই/বোন! 🎉\nআমি সিফাত ভাইয়ের সহকারী বট 💎\nসিফাত ভাইকে ধন্যবাদ, উনার জন্যই আমি আছি!",
        "ওহে নতুন বন্ধু! 😍\nআমি সিফাতের প্রিয় বট 🌟\nসিফাত ভাইকে কুর্নিশ, উনি কিংবদন্তি এডমিন!"
    ];

    for (let idUser of memJoin) {
        const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const pathData = join("./modules/commands", "cache", "autosetname.json");

        // ইউজারের নাম সেট করার কাজ (যেমন আগের মতোই ছিল)
        var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
        var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
        if (thisThread.nameUser.length != 0) {
            var setName = thisThread.nameUser[0];
            await new Promise(resolve => setTimeout(resolve, 1000));
            var nameInfo = await api.getUserInfo(idUser);
            var fullName = nameInfo[idUser].name;
            api.changeNickname(`${setName} ${fullName}`, threadID, idUser);
        }

        // এলোমেলো ওয়েলকাম মেসেজ পাঠানো
        const randomMsg = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
        api.sendMessage(randomMsg, threadID);
    }

    return api.sendMessage(`Set temporary nickname & welcomed new member(s)`, threadID);
};
