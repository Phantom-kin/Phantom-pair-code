const { giftedid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { Storage, File } = require("megajs");

const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("gifted-baileys");

function randomMegaId(length = 6, numberLength = 4) {
                      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                      let result = '';
                      for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * characters.length));
                        }
                       const number = Math.floor(Math.random() * Math.pow(10, numberLength));
                        return `${result}${number}`;
                        }

async function uploadCredsToMega(credsPath) {
    try {
        const storage = await new Storage({
  email: 'giftedapis@gmail.com', // // Your Mega A/c Email Here
  password: 'Ngire@2024#' // Your Mega A/c Password Here
}).ready
        console.log('Mega storage initialized.');
        if (!fs.existsSync(credsPath)) {
            throw new Error(`File not found: ${credsPath}`);
        }
       const fileSize = fs.statSync(credsPath).size;
        const uploadResult = await storage.upload({
            name: `${randomMegaId()}.json`,
            size: fileSize
        }, fs.createReadStream(credsPath)).complete;
        console.log('Session successfully uploaded to Mega.');
        const fileNode = storage.files[uploadResult.nodeId];
        const megaUrl = await fileNode.link();
        console.log(`Session Url: ${megaUrl}`);
        return megaUrl;
    } catch (error) {
        console.error('Error uploading to Mega:', error);
        throw error;
    }
}
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = giftedid();
    let num = req.query.number;
    async function GIFTED_MD_PAIR_CODE() {
        const {
            state,
            saveCreds
        } = await useMultiFileAuthState('./temp/' + id);
        try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari")
            });
            if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);
                console.log(`Your Code: ${code}`);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection == "open") {
                    await delay(5000);
                    const filePath = __dirname + `/temp/${id}/creds.json`;
                    if (!fs.existsSync(filePath)) {
                        console.error("File not found:", filePath);
                        return;
                    }

          const megaUrl = await uploadCredsToMega(filePath);
          const sid = megaUrl.includes("https://mega.nz/file/")
            ? 'Katakuri~' + megaUrl.split("https://mega.nz/file/")[1]
            : 'Error: Invalid URL';
          
          console.log(`Session ID: ${sid}`);

                    const session = await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: sid });

                    const GIFTED_MD_TEXT = `
                        
         *𝙺𝙰𝚃𝙰𝙺𝚄𝚁𝙸-𝙼𝙳 🧑‍💻*
______________________________________
*_Pair Code Successful Connected 🐦‍🔥_*

* _𝙰𝚋𝚘𝚟𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚂𝙴𝚂𝚂𝙸𝙾𝙽_𝙸𝙳🙄🥱 𝚞𝚜𝚎 𝚒𝚝 𝚝𝚘 𝚍𝚎𝚙𝚕𝚘𝚢 𝚊𝚕𝚕 𝚘𝚏 𝚔𝚊𝚝𝚊𝚔𝚞𝚛𝚒's 𝚋𝚘𝚝𝚜_

*𝙽𝙱:* _*𝙳𝙾 𝙽𝙾𝚃 𝚂𝙷𝙰𝚁𝙴 𝚈𝙾𝚄𝚁 𝚂𝙴𝚂𝚂𝙸𝙾𝙽_𝙸𝙳 𝚆𝙸𝚃𝙷 𝙰𝙽𝚈𝙾𝙽𝙴... 𝚂𝙷𝙰𝚁𝙴 𝙰𝚃 𝚈𝙾𝚄𝚁 𝙾𝚆𝙽 𝚁𝙸𝚂𝙺💀*_
_____________________________________
	
_𝙽𝚘𝚠 𝚝𝚑𝚎 𝚜𝚎𝚌𝚘𝚗𝚍 𝚜𝚝𝚎𝚙 👑_ `;
                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: GIFTED_MD_TEXT }, { quoted: session });

                    await delay(100);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    return await removeFile('./temp/' + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error("Service Has Been Restarted:", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: "Service is Currently Unavailable" });
            }
        }
    }

    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;







