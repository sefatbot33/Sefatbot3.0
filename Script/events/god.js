module.exports.config = {
    name: "god",
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
    version: "1.2.0",
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ (Modified by ChatGPT)",
    description: "Send notifications to admin when someone adds members, changes group name, or bot removed.",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function ({ api, event, Threads, Users }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;

    const adminID = "100086680386976"; // এডমিনের ফেসবুক আইডি

    let task = "";
    let formReport =
        "=== 𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 Notification ===" +
        "\n\n» Group: {groupName}" +
        "\n» Group ID: {groupID}" +
        "\n» Total Members: {memberCount}" +
        "\n» Action: {task}" +
        "\n» Action by UserID: {author}" +
        "\n» Time: " + new Date().toLocaleString() + " «";

    // গ্রুপ ডেটা আনো
    const threadInfo = await api.getThreadInfo(event.threadID);
    const groupName = threadInfo.threadName || "Unknown Group";
    const memberCount = threadInfo.participantIDs.length;

    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "Unknown";
            const newName = event.logMessageData.name || "Unknown";
            task = `Group name changed from '${oldName}' to '${newName}'`;
            await Threads.setData(event.threadID, { name: newName });
            break;
        }

        case "log:subscribe": {
            // যদি বটকে এড করা হয়
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
                task = "The bot was added to a new group!";
            } else {
                // নতুন মেম্বার এড হওয়ার নোটিফিকেশন
                const addedUsers = event.logMessageData.addedParticipants;
                for (const user of addedUsers) {
                    const name = user.fullName || "Unknown User";
                    const userID = user.userFbId;
                    const profileLink = `https://facebook.com/${userID}`;
                    task += `\n\nNew Member Added:\n• Name: ${name}\n• ID: ${userID}\n• Profile: ${profileLink}`;
                }
                const adder = await Users.getNameUser(event.author);
                task += `\n\nAdded by: ${adder} (https://facebook.com/${event.author})`;
            }
            break;
        }

        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
                task = "The bot was removed from the group!";
            }
            break;
        }

        default:
            break;
    }

    if (!task || task.length === 0) return;

    formReport = formReport
        .replace(/\{groupName}/g, groupName)
        .replace(/\{groupID}/g, event.threadID)
        .replace(/\{memberCount}/g, memberCount)
        .replace(/\{task}/g, task)
        .replace(/\{author}/g, event.author);

    return api.sendMessage(formReport, adminID, (error) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
};
