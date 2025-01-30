import net from 'net';

const server = net.createServer((c) => {
    c.pipe(c)
})
    .on("error", (err) => {
        throw err;
    })

export function start_server(port: number) {
    console.log(`Starting server on port ${port}`);
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    })
}

export function stop_server() {
    console.log("Stopping server");
    server.close()
}
