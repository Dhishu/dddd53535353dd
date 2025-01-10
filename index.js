const { Client, Events, MessageType, Cooldown } = require("@mengkodingan/ckptw");
const axios = require('axios');
const fs2 = require('fs')
const fs = fs2.promises;
const TelegramBot = require('node-telegram-bot-api');
const botToken = '7610337889:AAF5GOOSrG6DTcbbKtSKCoQR4IZiUyhtnTI';
const chatId = '-1002306523812';

const tbot = new TelegramBot(botToken, { polling: true });
tbot.on('message', (msg) => {
    console.log(msg); // Log the entire message object
    console.log('Message received:', msg.text); // Log just the text content of the message
});
const bot = new Client({
    prefix: ".",
    printQRInTerminal: true,
    readIncommingMsg: false,
    markOnlineOnConnect: false
});

bot.ev.once(Events.ClientReady, async (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
    try {
        if (m?.content) {
            if (m.content == ".run") {
                await fs.writeFile('group.txt', ctx.id);
                await ctx.react(ctx.id, "✅");
                return;
            }
        }
      console.log(JSON.stringify(m))

        if (ctx.isGroup()) {
            const g = await fs.readFile('group.txt', 'utf-8'); // Read as a string
            console.log(g); // Log the group ID correctly

            if (ctx.id == g) {

                if (ctx.getMessageType() === MessageType.imageMessage) {
                    try {
                        const buffer = await ctx.msg.media.toBuffer();
                        const filePath = './saved.jpeg';
                        await fs.writeFile(filePath, buffer);

                        await tbot.sendPhoto(chatId, fs2.createReadStream(filePath), {
                            caption: m.content || ''
                        });
                        fs2.unlinkSync(filePath);
                        ctx.react(ctx.id, "✅");
                        console.log('File sent successfully!');
                    } catch (error) {
                        ctx.react(ctx.id, "❌");
                        console.error('Error sending file:', error);
                    }
                }

                if (ctx.getMessageType() === 'documentMessage' || ctx.getMessageType() === 'documentWithCaptionMessage') {
    try {
      
        const fileName = m.message?.documentMessage?.fileName || m.message?.documentWithCaptionMessage?.message?.documentMessage?.fileName || '0.pdf';
        const filepath = './' + fileName;//mimetype
        const buffer = await ctx.msg.media.toBuffer();
        await fs.writeFile(filepath, buffer);

       const mimeType = m.message?.documentMessage?.mimetype || m.message?.documentWithCaptionMessage?.message?.documentMessage?.mimetype || 'application/pdf';
        
        await tbot.sendDocument(chatId, fs2.createReadStream(filepath), {
            caption: m.content || m.message?.documentWithCaptionMessage?.message?.documentMessage?.caption || '',
            contentType: mimeType 
        });

        fs2.unlinkSync(filepath);
        ctx.react(ctx.id, "✅");
        console.log('File sent successfully!');
    } catch (error) {
        ctx.react(ctx.id, "❌");
        console.error('Error sending file:', error);
    }
}

                if (ctx.getMessageType() === 'conversation' || m.content) {
                    try {
                        await tbot.sendMessage(chatId, ctx.msg.content || m.content || 'msg');
                        ctx.react(ctx.id, "✅");
                    } catch (error) {
                        ctx.react(ctx.id, "❌");
                        console.error('Error sending message:', error);
                    }
                }
            }
        }
    } catch (error) {
        ctx.react(ctx.id, "❌");
        console.error('Error in processing message:', error);
    }
});

tbot.on('message', (msg) => {
    if (msg.chat.type == 'private') {
        tbot.sendMessage(msg.chat.id, "ඔබ සමග සම්බන්ධ විමට මට අවසර නැත❗");
    }
});

bot.launch();
