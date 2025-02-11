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
            const bufs = parseBuffer(buf)

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

function parseBuffer(buf: Buffer): CustomBuffer | null {
    const first_break = buf.indexOf("\r\n")
    if (first_break === -1) return null

    const header = buf.subarray(0, first_break)
    if (header.toString() !== "MON") return null

    const second_break = buf.indexOf("\r\n", first_break + 2)
    if (second_break === -1) return null

    const message_length = buf.subarray(first_break + 2, second_break)
    if (isNaN(parseInt(message_length.toString()))) return null

    const third_break = buf.indexOf("\r\n", second_break + 2)
    if (third_break === -1) return null

    const message = buf.subarray(second_break + 2, third_break)
    return [
        header.toString(),
        parseInt(message_length.toString()),
        message.toString()
    ]
}

//function parseBuffer(buf: string): CustomBuffer | null {
//    const bufs = buf.split('\r\n')
//    bufs.length = 3
//
//    if (bufs.length < 3) {
//        return null
//    }
//
//    if (bufs[0] !== "MON") {
//        return null
//    }
//
//    return [bufs[0], parseInt(bufs[1]), bufs[2]] as CustomBuffer
//}

type CustomBuffer = [string, number, string]
