import { createConnection } from 'net';
import assert from 'assert';

import { start_server, stop_server } from '../../src/tcp_server';

describe("TCP Echo server", () => {
    beforeEach(() => start_server(9000));
    afterEach(() => stop_server());

    it("Should echo back the same data sent to it", (done) => {
        const test_data = "Hello, World!"
        const client = createConnection({ port: 9000 }, () => {
            client.write(test_data);
        });

        client.on("data", (data) => {
            assert.strictEqual(data.toString(), test_data)
            done()
        })
    })
})
