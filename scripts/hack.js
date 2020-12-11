// args[0] : target hostname
// args[1] : desired thread count

export async function main(ns) {
    await hackServer(ns, ns.args[0], ns.args[1]);
}

async function hackServer(ns, server, thread) {
    let serverSecThresh = ns.getServerMinSecurityLevel(server) + 2;
    let serverMonThresh = ns.getServerMaxMoney(server) * 0.95;

    let opts = { threads: thread };

    while (true) {
        if (ns.getServerSecurityLevel(server) > serverSecThresh) {
            await ns.weaken(server, opts);
        } else if (ns.getServerMoneyAvailable(server) < serverMonThresh) {
            await ns.grow(server, opts);
        } else {
            await ns.hack(server, opts);
        }
    }
}