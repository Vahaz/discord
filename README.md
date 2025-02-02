# match_logger_v2
[Archived] This project use discord bot and riot api to generate embeds containing stats on last player's game in league of legends.

:wave: Hey, this project is not serious at all. Still, I detailed this README for anyone who wants to read the code, have fun!

This program is a proof-of-concept, for the usage of a Personal Keys from the RIOT API to create a discord BOT.
- The BOT respond with a formatted embed who contains the player's important stats.
- The program will not be updated and will be ARCHIVED on GitHub when released.
- This is my first time using a Discord BOT with the Riot API and Node.JS.

:warning: I discourage anyone to use this code to show someone else stats rather than yourself.

:warning: This being my first Discord BOT / API usages, I might be wrong on some (major?) details.

# RATE LIMITS
According to [RIOT API Documentation](https://developer.riotgames.com):
→ Rate Limits [20 requests every 1 seconds(s) & 100 requests every 2 minutes(s)]

The program use between : 1 to 3 requests per usage.
- 1 request if: #PLAYER_UUID is already known, no new #MATCH_ID and #MATCH_DATA as already been fetch.
- 2 requests if: #PLAYER_UUID is already known, new #MATCH_ID and #MATCH_DATA needs to be fetch.
- 3 requests if: #PLAYER_UUID is not known, #MATCH_ID is not known and #MATCH_DATA needs to be fetch.

According to [Discord BOT Documentation](https://discord.com/developers/docs/topics/rate-limits):
→ "All bots can make up to 50 requests per second to our API." (If the bot is not big enough.)

The program use between : 1 and 3 requests per usage.
- 3 requests (on start) : Bot Log-In, Bot Activity, Command Creation.
- 1 request: Interaction reply.

# PROCESS
- The BOT take from a client-user command with the following arguments : #REGION & #SUMMONER_ID.

## STEP 1 - FETCH:
- 3 .JS functions fetch the Riot API:
- - To convert the #SUMMONER_ID to #PLAYER_UUID.
- - To get a list (of size one) of the recent match (#MATCH_ID) using #PLAYER_UUID.
- - To get the #MATCH_DATA in a JSON format from the #MATCH_ID.

## STEP 1 (bis) - CACHE:
- IF the #SUMMONER_ID has already been provided before, it will recover the #PLAYER_UUID from the #CACHE Map.
- IF the #MATCH_ID has already been provided before, it will recover the #MATCH_DATA from the #CACHE Map.

## STEP 2 - FORMAT & IMAGE:
- 2 .JS functions:
- - Extract from the JSON formatted data (#MATCH_DATA) and store them in a #RESULT Array.
- - Generate the thumbnail attached using #MERGE-IMAGES and #CONVERT-BASE64-TO-IMAGE modules.

Finally, the Embed is filled with the data and sent back to the user.

# .ENV VARIABLES
This program uses a .env file containing the following keys:

DISCORD_TOKEN="" → Discord BOT Token.

RIOT_TOKEN="" → RIOT API Token.

BOT_ID="" → Discord BOT ID.


:warning: IF YOU PLAN TO USE THIS CODE FOR YOURSELF, BEWARE NOT TO SHARE THE TOKENS AND APIS KEYS TO ANYONE. :warning:

# CREDITS
According to [RIOT API Documentation](https://developer.riotgames.com), here the "Approved Use Cases for Personal Keys" for this program:
- Creating a proof of concept for a Production Key request for showing (self) player stats.

To make this program, I used the following tools:
- Node.JS
- @discordjs
- @dotenv
- @merge-images
- @convert-base64-to-image
- @canvas
- Visual Studio Codes with the followings Extensions:
- - DotENV by mikestead
- - JavaScript (ES6) code snippets by charalampos karypidis
