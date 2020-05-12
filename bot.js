// Run dotenv
require("dotenv").config();
const Discord = require("discord.js");
var fs = require("fs");
const client = new Discord.Client();
let screamIntervalMap = {};

const getRandomAudio = async () => {
  // Randomize scream from /screams folder
  let res = fs.readdir('./screams', function(err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    
    const random = Math.floor(Math.random() * files.length);
    screamFile = './screams/' + files[random];
  })
}

// set default scream, rotate random scream every 5 seconds
let screamFile = './screams/ahhh.m4a';
screamFile = setInterval(getRandomAudio, 5000);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  if (message.content === "!SCREAM") {
    if (message.channel.type !== "text") return;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply("please join a voice channel first!");
    }

    // Logic to join, scream, and leave channel
    const scream = () => {
      voiceChannel.join().then(connection => {
        const dispatcher = connection.play(screamFile);
        dispatcher.on("finish", () => {
          voiceChannel.leave();
        });
      });
    };

    // First scream before interval kicks off
    scream();
    let screamInterval = setInterval(scream, 20000);
    screamIntervalMap[message.member.voice.channel.id] = screamInterval;
  }

  if (message.content === "!STOP") {
    clearInterval(screamIntervalMap[message.member.voice.channel.id]);
    delete screamIntervalMap[message.member.voice.channel.id];
  }
});

client.login(process.env.DxISCORD_TOKEN);
