var header = new Headers()
header.append("X-Riot-Token", process.env.RIOT_TOKEN)

var fetchOptions = {
  method: "GET",
  headers: header,
  redirect: "manual",
}

const cache = new Map()

export async function getPUUID(summonerID, region) {
  if (summonerID == undefined || region == undefined) return undefined
  if (cache.has(summonerID)) return cache.get(summonerID)

  let server = await getMainRegion(region)
  if (server == undefined) return undefined
  let ID = summonerID.split("#")
  const response = await fetch(
    `https://${server}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${ID[0]}/${ID[1]}`,
    fetchOptions
  )

  if (!response.ok) return undefined
  const result = await response.json()
  cache.set(summonerID, result.puuid)
  return result.puuid
}

export async function getMatchID(PUUID, region) {
  if (PUUID == undefined || region == undefined) return undefined
  let server = await getMainRegion(region)
  if (server == undefined) return undefined
  const response = await fetch(
    `https://${server}.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=1`,
    fetchOptions
  )

  if (!response.ok) return undefined
  const result = await response.text()
  let replace = result.replace('["', "").replace('"]', "")
  return replace
}

async function getMainRegion(region) {
  if (region == undefined) return undefined
  if (["EUN1", "EUW1", "RU", "TR1"].includes(region)) return "europe"
  if (["BR1", "LA1", "LA2", "NA1"].includes(region)) return "americas"
  if (["JP1", "KR"].includes(region)) return "asia"
  if (["SG2", "OC1", "TW2", "VN2"].includes(region)) return "americas"
  return undefined
}

export async function getMatchData(matchID, region) {
  if (matchID == undefined || region == undefined) return undefined
  if (cache.has(matchID)) return cache.get(matchID)

  let server = await getMainRegion(region)
  if (server == undefined) return undefined
  const response = await fetch(
    `https://${server}.api.riotgames.com/lol/match/v5/matches/${matchID}`,
    fetchOptions
  )

  if (!response.ok) return undefined
  const result = await response.json()
  cache.set(matchID, result)
  return result
}