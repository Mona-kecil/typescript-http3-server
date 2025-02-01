/* Mon Protocol is a simple protocol to accept data from the client.
 * This protocol will be implemented using TCP.
 *
 * Accepted data format:
 * MON\r\n
 * 10\r\n
 * Hi, there!\r\n\r\n
 * 
 * The plan:
 * 1. Check first 3 byte of the data, if it's "MON" then we process it.
 * 2. Check the next line of bytes, this will be the length of the data.
 * 3. Check the next line of bytes, this will be the data.
 * 4. We extract the data from the buffer and send it back to the client.
 *
 * We'll try to handle it as string first, then we'll try to handle it as buffer.
 * */

import net from 'net'

export class MonProtocolServer {
    private server: net.Server
    private port: number

    constructor(port: number) {
        this.port = port
        this.server = net.createServer((client) => {
            this.handleConnection(client)
        })
    }

    private handleConnection(client: net.Socket) {
        let buf: Buffer = Buffer.allocUnsafe(0)

        client.on('data', (chunk) => {
            buf = Buffer.concat([buf, chunk])
            const bufs = parseBuffer(buf.toString())

            if (bufs === null) {
                client.write("Invalid data format\r\n")
                return
            }

            const length = bufs[1]
            const message = Buffer.allocUnsafe(length)
            message.write(bufs[2], 0)

            client.write(`MON /OK\r\n${message}`)

        })
    }

    public start() {
        this.server.listen(this.port, () => {
            console.log('Server started')
        })
    }

    public stop() {
        this.server.close(() => {
            console.log('Server closed')
        })
    }
}

function parseBuffer(buf: string): CustomBuffer | null {
    const bufs = buf.split('\r\n')
    bufs.length = 3

    if (bufs.length < 3) {
        return null
    }

    if (bufs[0] !== "MON") {
        return null
    }

    return [bufs[0], parseInt(bufs[1]), bufs[2]] as CustomBuffer
}

type CustomBuffer = ["MON", number, string]
