require("dotenv").config();

const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const moment = require("moment-timezone");

const URL = "https://www.youtube.com/watch?v=Nr3ot5gSvkM";
const VOICE_CHANNEL_NAME = "00:00";
const secondsToAdd = parseInt(process.env.SECONDS_TO_SYNC) + parseInt(process.env.SECONDS_DELAY_GCP_DISCORD);

exports.play = (req, res) => {
  const client = new Discord.Client();
  client.login(process.env.DISCORD_KEY);

  client.on("ready", () => {
    console.log("Client is ready");
    const channels = client.channels.cache
      .filter((channel) => channel.type === "voice")
      .filter((channel) => channel.name === VOICE_CHANNEL_NAME);
    if (!channels || channels.length === 0 || channels.length > 1) {
      console.log("Could not find 00:00 channel =(");
    } else {
      console.log("Found channel", VOICE_CHANNEL_NAME);
      channels.forEach((channel) => {
        const now = moment().tz("America/Lima");
        const target = moment()
          .tz("America/Lima")
          .seconds(parseInt(process.env.TARGET_SECONDS))
          .minutes(parseInt(process.env.TARGET_MINUTES))
          .hours(parseInt(process.env.TARGET_HOURS))
          .subtract(secondsToAdd, "seconds")
          .add(1, "seconds");
        const diff = target.diff(now);
        setTimeout(() => {
          channel.join().then((connection) => {
            console.log("Joined voice channel", VOICE_CHANNEL_NAME);
            connection.play(ytdl(URL)).on("finish", () => {
              console.log("Done playing leaving channel", VOICE_CHANNEL_NAME);
              channel.leave();
              console.log("done");
              client.destroy();
              res.status(200).send("played successfully");
            });
          });
        }, diff);
      });
    }
  });
};
