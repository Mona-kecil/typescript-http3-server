import { createConnection } from "net";
import { MonProtocolServer } from "../../src/mon_protocol_server";
import assert from "assert";

describe("MonProtocolServer", () => {

    let server: MonProtocolServer

    beforeEach(() => {
        server = new MonProtocolServer(12345)
    })
    afterEach(() => {
        server.stop()
    })

    it("Should return 'Hi, mom' with 'MON /OK' as header", (done) => {
        const message = Buffer.from("Hi, mom")
        const length = message.byteLength

        const client = createConnection({ port: 12345 }, () => {

            client.write(`MON\r\n${length}\r\n${message}\r\n\r\n`)

        })

        client.on('data', (data) => {
            const bufs = data.toString().split('\r\n')
            assert.strictEqual(bufs[0], "MON /OK")
            assert.strictEqual(bufs[1], message.toString())
            done()
        })
    })


})
