import { createSocket } from "dgram";
import { start_server, stop_server } from "../../src/udp_server";
import assert from "assert";

const PORT: number = 1234;

describe("udp_server", () => {
    beforeEach(() => {
        start_server(PORT);
    })
    afterEach(() => {
        stop_server();
    })

    it("Should echo back messages", (done) => {
        const client = createSocket("udp4");

        const data = Buffer.from("hello");

        client.on("message", (msg) => {
            assert.strictEqual(msg.toString(), data.toString());
            done();
        })

        client.send(data, PORT, "localhost")
    })
})
