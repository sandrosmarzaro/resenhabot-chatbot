import { connect } from "./connection";

export default (async () => {
    const sock = await connect()

    sock.ev.on('messages.upsert', async (msg) => {
        console.log(JSON.stringify(msg, null, 4))
    })
})();