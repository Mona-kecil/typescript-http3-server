import dgram from 'dgram';

const server = dgram.createSocket('udp4')
    .on("connect", () => {
        console.log("client connected");
    })
    .on("message", (msg, rinfo) => {
        server.send(msg, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.log("error sending message");
            }
        })
    })

export function start_server(port: number) {
    server.bind({
        port: port,
        address: "localhost"
    });
    console.log(`starting udp server on port ${port}`);
}

export function stop_server() {
    console.log("stopping udp server");
    server.close();
}
