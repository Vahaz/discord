import "dotenv/config"
import { Client, GatewayIntentBits, SlashCommandBuilder, ActivityType, AttachmentBuilder } from "discord.js"
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})
import { getMatchID, getPUUID, getMatchData } from "./functions.js"
import { createEmbed, getDataFromJSON, getThumbnail } from "./embeds.js"

client.on("ready", (event) => {
  console.log(`${event.user.tag} is ready ! :)`)
  client.user.setActivity({
    name: "Rammus 'OK'",
    type: ActivityType.Listening
  })

  const lastmatch = new SlashCommandBuilder()
    .setName("lastmatch")
    .setDescription("Send player's latch match.")
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Your Region")
        .setRequired(true)
        .addChoices(
          { name: "Brazil", value: "BR1" },
          { name: "Europe Nordic & East", value: "EUN1" },
          { name: "Europe West", value: "EUW1" },
          { name: "Japan", value: "JP1" },
          { name: "Republic of Korea", value: "KR" },
          { name: "Latin America North", value: "LA1" },
          { name: "Latin America South", value: "LA2" },
          { name: "North America", value: "NA1" },
          { name: "Oceania", value: "OC1" },
          { name: "Turkey", value: "TR1" },
          { name: "Russia", value: "RU" },
          {
            name: "Singapore, Malaysia, Indonesia, The Philippines, Thailand",
            value: "SG2",
          },
          { name: "Taiwan, Hong Kong, and Macao", value: "TW2" },
          { name: "Vietnam", value: "VN2" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("riot_id")
        .setDescription("RiotID : Name#ID")
        .setRequired(true)
    )

  client.application.commands.create(lastmatch)
})

client.on("interactionCreate", async (interaction) => {
  if(!interaction.isChatInputCommand()) return
  if (interaction.commandName === "lastmatch") {
    const region = interaction.options.getString("region")
    const summonerID = interaction.options.getString("riot_id")
    if (!summonerID.includes("#")) {
      interaction.reply({
        content: "Sorry, you must use a valid RiotID : Name#ID",
        ephemeral: true,
      })
      return
    }

    let playerUUID = await getPUUID(summonerID, region)
    let matchID = await getMatchID(playerUUID, region)
    if (matchID == undefined || playerUUID == undefined) {
      interaction.reply({
        content: "Sorry, no recent matches found or something went wrong. Check player's name, id and region.",
        ephemeral: true,
      })
      return
    }

    let matchData = await getMatchData(matchID, region)
    if (matchData == undefined) {
      interaction.reply({
        content: "Sorry, no match data found. Check player's name, id and region.",
        ephemeral: true,
      })
      return
    }

    console.log(`Getting data for ${summonerID} in ${region} with PUUID: "${playerUUID}" on MatchID: "${matchID}"`)

    let data = await getDataFromJSON(matchData, playerUUID)
    if (data == undefined) {
      interaction.reply({
        content: "Sorry, an error occured while retrieving data. Check player's name, id and region.",
        ephemeral: true,
      })
      return
    }

    let image
    let isThumbnailGenerated = await getThumbnail(data.items)
    if (isThumbnailGenerated) image = new AttachmentBuilder('./image.png')
    if (isThumbnailGenerated == undefined) image = new AttachmentBuilder('./background.png')

    let embed = await createEmbed(summonerID, region, data)
    if (embed == undefined) {
      interaction.reply({
        content: "Sorry, an error occured with the Embed creation. Check player's name, id and region.",
        ephemeral: true,
      })
      return
    }

    embed.setThumbnail('attachment://image.png')
    await interaction.reply({ embeds: [embed], files: [image] })
  }
})

client.login(process.env.DISCORD_TOKEN)