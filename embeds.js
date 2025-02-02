import { EmbedBuilder, Colors, codeBlock } from "discord.js"
import mergeImages from 'merge-images'
import { Canvas, Image } from 'canvas'
import { converBase64ToImage } from 'convert-base64-to-image'

export async function getDataFromJSON(data, playerUUID) {
  if (playerUUID == undefined || data == undefined) return undefined

  let player
  let participants = data.info.participants
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].puuid == playerUUID) {
      player = participants[i]
      break
    }
  }

  // Good value or Default value
  let result = {
    gameMode: data.info.gameMode || 'CLASSIC',
    gameCreation: data.info.gameCreation || Date.now(),
    championId: player.championId || 0,
    championName: player.championName || 'Aatrox',
    championLevel: player.champLevel || 0,
    kda: `${player.kills} • ${player.deaths} • ${player.assists}` || '0 • 0 • 0',
    dmgDealt: `${player.totalDamageDealt} (${player.magicDamageDealt} • ${player.physicalDamageDealt} • ${player.totalDamageDealt})` || '0 (0 • 0 • 0)',
    dmgTaken: `${player.totalDamageTaken} (${player.magicDamageTaken} • ${player.physicalDamageTaken} • ${player.totalDamageTaken})` || '0 (0 • 0 • 0)',
    gold: `${player.goldEarned} • ${player.goldSpent}` || '0 • 0',
    role: player.role || 'BOTTOM',
    win: player.win || false,
    summonerLevel: player.summonerLevel || 0,
    profileIcon: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/profileicon/${player.profileIcon}.png` || 'https://ddragon.leagueoflegends.com/cdn/15.2.1/img/profileicon/1.png',
    minionsKilled: player.totalMinionsKilled || 0,
    visionScore: `${player.visionScore} (${player.wardsPlaced} • ${player.wardsKilled})` || '0 (0 • 0)',
    championAsset: `https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/${player.championName}.png` || 'https://ddragon.leagueoflegends.com/cdn/15.2.1/img/champion/Aatrox.png',
    items: []
  }

  for (let i = 0; i <= 6; i++) result.items.push(`https://ddragon.leagueoflegends.com/cdn/15.2.1/img/item/${player[`item${i}`]}.png`)
  return result
}

export async function getThumbnail(items) {
  if (items == undefined) return undefined
  for (let i = 1; i <= 6; i++) { if (items[i] == "https://ddragon.leagueoflegends.com/cdn/15.2.1/img/item/0.png") { items[i] = "blank_item.png" }}

  await mergeImages([
    { src: "background.png", x: 0, y: 0},
    { src: items[0], x: 0, y: 0 },
    { src: items[1], x: 64, y: 0 },
    { src: items[2], x: 128, y: 0 },
    { src: items[3], x: 0, y: 64 },
    { src: items[4], x: 64, y: 64 },
    { src: items[5], x: 128, y: 64 }
  ], {Canvas: Canvas, Image: Image})
  .then(b64 => { converBase64ToImage(b64, "./image.png") })
  return true
}

export async function createEmbed(summonerID, region, data) {
  if (summonerID == undefined || region == undefined || data == undefined) return undefined
  let embed = new EmbedBuilder()
    .setTitle(`→ ${data.gameMode} • ${data.win ? "VICTORY" : "DEFEAT"}`)
    .setColor(data.win ? Colors.Green : Colors.Red)
    .setAuthor({
      name: `🙟 ${data.championName} (${data.championLevel}) • ${data.role}`,
      iconURL: data.championAsset
    })
    .setFooter({
      text: `${summonerID} • ${region}`,
      iconURL: data.profileIcon
    })
    .setTimestamp(new Date(data.gameCreation))
    .setFields(
      {
        name: "K • D • A",
        value: codeBlock(`${data.kda}`),
        inline: true
      },
      {
        name: "👁‍🗨 Score",
        value: codeBlock(`${data.visionScore}`),
        inline: true
      },
      {
        name: "CS Killed ♟",
        value: codeBlock(`→ ${data.minionsKilled}`),
        inline: true
      },
      {
        name: "Gold 📉 • 📈",
        value: codeBlock(`${data.gold}`),
        inline: true
      },
      {
        name: "Damage Dealt (🌠•⚔️•🛡)",
        value: codeBlock(`→ ${data.dmgDealt}`),
        inline: false
      },
      {
        name: "Damage Taken (🌠•⚔️•🛡)",
        value: codeBlock(`→ ${data.dmgTaken}`),
        inline: false
      }
    )
  return embed
}