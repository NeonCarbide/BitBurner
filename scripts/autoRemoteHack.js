let maxedServers;

export const main = async function(ns) {
    maxedServers = [];

    findServer(ns, 'home', 'home', checkValue);
    
    ns.run('/scripts/chael/remoteHack.js', 1, ...maxedServers);
};

function checkValue(ns, server) {
    let check = 1 * Math.pow(10, 9);

    if (ns.getServerMaxMoney(server) > check && ns.hasRootAccess(server)) {
        maxedServers.push(server);
    }
}

function findServer(ns, start, target, func) {
    let servers = ns.scan(target, true).filter((server) => server !== start && !server.includes('neon'));

    if (!ns.hasRootAccess(target)) {
        return false;
    }

    servers.forEach((server) => {
        func.call(this, ns, server);

        if (ns.hasRootAccess(server)) {
            findServer(ns, target, server, func);
        }
    });
}