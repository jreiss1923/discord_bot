const api = require("mangadex-full-api");
const Discord = require("discord.js");
require('dotenv').config();
api.agent.domainOverride = "mangadex.org";

const client = new Discord.Client();
client.on('ready', () => {
  console.log("Bot is ready!");
});

client.on('guildCreate', () => {
  var guilds = client.guilds.cache.values();
  var arr_guilds = [];
  for (let value of guilds) {
    arr_guilds.push(value);
  }
  var newest_guild;
  for (let i = 0; i < arr_guilds.length; i++) {
    console.log(arr_guilds.length);
    if (newest_guild === undefined || newest_guild.joinedTimestamp < arr_guilds[i]) {
      newest_guild = arr_guilds[i];
    }
  }
  var channels = newest_guild.channels.cache.values();
  for (let value of channels) {
    console.log(value);
    if (value.deleted == false && value.type === 'text') {
      const channel = client.channels.cache.get(value.id);
      const startUpEmbed = new Discord.MessageEmbed()
      .setAuthor('The Plot Device')
      .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
      .setColor('#c5e300')
      .setTitle('Hi! I\'m The Plot Device!')
      .addField('My prefix is \"!\" For all my commands, type \"!help\"', "To get started, !search for a manga.")
      .setFooter("There is nothing that I don't know. I know everything.");
      channel.send(startUpEmbed);
      break;
    }
  }
});

client.on('message', msg => {
  var message_content = msg.content;
  if (message_content.length >= 9 && message_content.substring(0, 8) === '!search ') {
    var manga_title = message_content.substring(8, message_content.length);
    api.agent.login("jreiss1923", process.env.MANGADEX_PWD, false).then(() => {
      var manga = new api.Manga();
      manga.fillByQuery(manga_title).then(manga => {
        var latest_chapter;
        var manga_chapters = manga.chapters;
        for (let i = 0; i < manga_chapters.length; i++) {
          if ((typeof latest_chapter === "undefined" || latest_chapter.timestamp < manga_chapters[i].timestamp) && manga_chapters[i].language === "GB") {
            latest_chapter = manga_chapters[i];
          }
        }
        return latest_chapter;
      }).then(latest_chapter => {
        const mangaEmbed = new Discord.MessageEmbed()
        .setTitle('Your manga has been found!')
        .setAuthor('The Plot Device')
        .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
        .setColor('#c5e300')
        .addField("The latest chapter of " + manga.title + " is Chapter " + latest_chapter.chapter + ", which was released on " + convertUnixToString(latest_chapter.timestamp), latest_chapter.link, true)
        .setImage('https://www.mangadex.org' + manga.cover)
        .setTimestamp()
        .setFooter("There is nothing that I don't know. I know everything.");
        msg.channel.send(mangaEmbed);
        msg.channel.send(msg.author.toString());
      }).catch((error) => {
        const errorEmbed = new Discord.MessageEmbed()
        .setTitle('Oops!')
        .setAuthor('The Plot Device')
        .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
        .setColor('#c5e300')
        .addField('Mangadex has thrown an error.', error)
        .setTimestamp()
        .setFooter("I know nothing. It's you who knows, mangadex-kun.");
        msg.channel.send(errorEmbed);
        msg.channel.send(msg.author.toString());
      });
    }).catch((error) => {
      const errorEmbed = new Discord.MessageEmbed()
      .setTitle('Oops!')
      .setAuthor('The Plot Device')
      .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
      .setColor('#c5e300')
      .addField('Mangadex has thrown an error.', error)
      .setTimestamp()
      .setFooter("I know nothing. It's you who knows, mangadex-kun.");
      msg.channel.send(errorEmbed);
      msg.channel.send(msg.author.toString());
    })
  }
  else if (message_content.substring(0, 5) === "!help") {
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle('Help is on the way!')
    .setAuthor('The Plot Device')
    .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
    .setColor('#c5e300')
    .addField("Here's my list of commands:", "!help - Shows all commands\n!search <manga title> - Search for the most recent release of a manga using the mangadex search function\n!report - Report an error")
    .setFooter("There is nothing that I don't know. I know everything.");
    msg.channel.send(helpEmbed);
    msg.channel.send(msg.author.toString());
   }
  else if (message_content.substring(0, 7) === "!report") {
    const reportEmbed = new Discord.MessageEmbed()
    .setTitle('Report Help Page')
    .setAuthor('The Plot Device')
    .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
    .setColor('#c5e300')
    .addField("Email me at joshua.reiss2@gmail.com to report any errors.", "Search errors are caused by mangadex, not by me.")
    .setFooter("I know nothing. It's you who knows, user-kun")
    msg.channel.send(reportEmbed);
    msg.channel.send(msg.author.toString());
  }
  else if (msg.author.toString() != "<@734215154228658198>" && message_content.substring(0, 1) === "!"){
    const errorEmbed = new Discord.MessageEmbed()
      .setTitle('Oops!')
      .setAuthor('The Plot Device')
      .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
      .setColor('#c5e300')
      .addField('You used an invalid or unfinished command.', "Use !help to see the list of all valid commands.")
      .setTimestamp()
      .setFooter("I know nothing. It's you who knows, user-kun.");
      msg.channel.send(errorEmbed);
      msg.channel.send(msg.author.toString());
  }
})

function convertUnixToString(unixTime) {
  var date = new Date(unixTime * 1000);
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


client.login(process.env.BOT_KEY);


