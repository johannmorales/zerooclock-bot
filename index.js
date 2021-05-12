require('dotenv').config()

const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const URL = "https://www.youtube.com/watch?v=Nr3ot5gSvkM";
const VOICE_CHANNEL_NAME = "00:00";

function play() {
  const client = new Discord.Client();
  
  client.on("ready", () => {
    const channels = client.channels.cache
      .filter((channel) => channel.type === "voice")
      .filter((channel) => channel.name === VOICE_CHANNEL_NAME);
  
    if (!channels || channels.length === 0 || channels.length > 1) {
      console.log("Could not find 00:00 channel =(");
    } else {
      channels.forEach((channel) => {
        channel.join().then((connection) => {
          connection.play(ytdl(URL)).on("finish", () => {
            channel.leave();
            client.destroy();
          });
        });
      });
    }
  
  });

  client.login(process.env.DISCORD_KEY);
}

exports.play = (req, res) => {
  play();
  res.status(200).send("played successfully");
};