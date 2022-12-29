import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from "path"

export const connect = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, './auth_info_baileys'))

    let sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    })

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                await connect()
            }
        }
    })

    sock.ev.on('connection.update', saveCreds)

    return sock;
}