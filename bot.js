// Run dotenv
require("dotenv").config();
const db = require("./db");
const helpers = require("./helpers")

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// msg.guild.id
// msg.user.id
client.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }

  if (msg.content.startsWith("!ac")) {
    const commandArr = msg.content.split(" ");
    let [ac, command, key, ...value] = commandArr
    value = value.join(' ')
    console.log(command, key, value);

    if (command === "set") {
      if (key === "friendcode") {
        db.setCode(msg.guild.id, msg.author.username, value);
        msg.reply("Set friendcode to " + value);
      }
      if (key === "fruit") {
        db.setFruit(msg.guild.id, msg.author.username, value);
        msg.reply("Set fruit to " + value);
      }
    }
    else if (command === "get") {
      if (key === "friendcode") {
        db.getUser(msg.guild.id, value).then(code => {
          if (code.data()) {
            msg.reply(value + "'s friend code is " + code.data().code);
          } else {
            msg.reply(value + " hasn't set their friend code yet!");
          }
        });
      }

      if (key === "fruit") {
        db.getUser(msg.guild.id, value).then(fruit => {
          if (fruit.data()) {
            msg.reply(value + "'s fruit is " + fruit.data().fruit);
          } else {
            msg.reply(value + " hasn't set their fruit yet!");
          }
        });
      }

      if (key === "turnip") {
        if (value === "all") {
          db.getDate(msg.guild.id, helpers.today).then(data => {
            if(data.data()) {
              msg.reply(helpers.sortByPrice(data.data()))
            }
            else {
              msg.reply("No turnip prices have been recorded for today!");
            }
          });
        } else {
          db.getUser(msg.guild.id, value).then(data => {
            if (data.data()) {
              msg.reply(helpers.sortByTime(data.data(), value))
            } else {
              msg.reply(value + " hasn't recorded any turnip prices today!");
            }
          });
        }
      }
    }
    else if (command === "add") {
      if (key === "turnip") {
        db.addTurnipPrice(msg.guild.id, msg.author.username, value);
        msg.reply("Added turnip price: " + value);
      }
    }
    else {
      helpMsg = `\nUse this bot to set/get friendcodes & fruit, and upload your turnip prices to the guild!
      Commands: !ac help
      Set Info: !ac set friendcode 1234-1234-1234, !ac set fruit pears
      Get Info: !ac get friendcode Kevinipple, !ac get fruit Kevinipple
      Add Turnip: !ac add turnip 100
      Check Turnip Prices: !ac get turnip all
      `

      if(command !== "help") {
        helpMsg = `Command not found.\n` + helpMsg
      }

      msg.reply(helpMsg)
    }
  }
});

client.login(process.env.DxISCORD_TOKEN);
