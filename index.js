const { Client, Events, MessageType , Cooldown } = require("@mengkodingan/ckptw");
const axios = require('axios');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const botToken = '8099598394:AAFpb1fVCGCoUIyHIt5g3rqwE2i2QNCoMz4';
const chatId = '-4640521553';

const tbot = new TelegramBot(botToken, { polling: true });

const bot = new Client({
    prefix: ".",
    printQRInTerminal: true,
    readIncommingMsg: false,
    markOnlineOnConnect: false
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.MessagesUpsert, async(m, ctx) => {
  try{
    if(ctx.isGroup()){
    if(ctx._msg.key.remoteJid == '120363358457393520@g.us'){
    if(ctx.getMessageType() === MessageType.imageMessage) {
       try{
      const buffer = await ctx.msg.media.toBuffer();

      const filePath = './saved.jpeg';
      await fs.writeFileSync(filePath, buffer);
      (async () => {
        try {

          await tbot.sendPhoto(chatId, fs.createReadStream(filePath), {
            caption: ctx.msg.content || '',
          });
          fs.unlinkSync(filePath);
          ctx.react(ctx.id, "✅");
          console.log('File sent successfully!');
        } catch (error) {
          console.error('Error sending file:', error);
        }
      })();
         }catch (error) {ctx.react(ctx.id, "❌")}
    }
    if(ctx.getMessageType() === 'documentMessage' || ctx.getMessageType() === 'documentWithCaptionMessage') {
       try{
    const filepath = './' + (ctx.msg.message?.documentMessage?.fileName || '0.pdf');
    const buffer = await ctx.msg.media.toBuffer();
    await fs.writeFileSync(filepath, buffer);
    (async () => {
    try {

      await tbot.sendDocument(chatId, fs.createReadStream(filepath), {
        caption: ctx.msg.content || '',
      });
      fs.unlinkSync(filepath);
      ctx.react(ctx.id, "✅");
      console.log('File sent successfully!');
    } catch (error) {
      console.error('Error sending file:', error);
    }
    })();
         }catch (error) {ctx.react(ctx.id, "❌")}
    }
    if(ctx.getMessageType() === 'conversation' || m.content){
       try{
    await tbot.sendMessage(chatId, ctx.msg.content ||  m.content || 'msg');
    ctx.react(ctx.id, "✅");
         }catch (error) {ctx.react(ctx.id, "❌")}
    }
  }}
  }catch (error) {ctx.react(ctx.id, "❌")}
    
});
tbot.on('message', (msg) => {
  if(msg.chat.type=='private'){
    tbot.sendMessage(msg.chat.id,"ඔබ සමග සම්බන්ධ විමට මට අවසර  නැත❗");
  }
});
bot.launch();
