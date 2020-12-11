let hackablePorts;
let hackableServers;

export const main = async function(ns) {
    hackableServers = false;

    findHackablePorts(ns);
    findServer(ns, 'home', 'home', serverReport);

    if (hackableServers) {
        let autoHack = await ns.prompt('Hack available servers?');

        if (autoHack) {
            ns.tprint('Injecting scripts...');
            ns.tprint('Hacking servers...');
            ns.run('/scripts/chael/autoHack.js');
            ns.tprint('Servers hacked');
        }
    }

    let ownedServers = await ns.prompt('Manage owned servers?');

    if (ownedServers) {
        ns.run('/scripts/chael/purchaseServers.js');
    }

    if (ownedServers || hackableServers) {
        let remoteHack = await ns.prompt('Refresh remote hacks?');

        if (remoteHack) {
            ns.run('/scripts/chael/autoRemoteHack.js');
        }
    }
};

function findHackablePorts(ns) {
    let hackPorts = 0;

    if (ns.fileExists('BruteSSH.exe')) {
        hackPorts += 1;
    }

    if (ns.fileExists('FTPCrack.exe')) {
        hackPorts += 1;
    }

    if (ns.fileExists('relaySMTP.exe')) {
        hackPorts += 1;
    }

    if (ns.fileExists('HTTPWorm.exe')) {
        hackPorts += 1;
    }

    if (ns.fileExists('SQLInject.exe')) {
        hackPorts += 1;
    }

    hackablePorts = hackPorts;
}

function findServer(ns, startServer, targetServer, func) {
    let servers = ns.scan(targetServer, true).filter((server) => server !== startServer && !server.includes('neon'));

    servers.forEach((server) => {
        func.call(this, ns, server);

        // If server is not portLocked then find subservers of server
        if (serverStatus(ns, server) !== 'portLocked') {
            findServer(ns, targetServer, server, func);
        }
    });
}

function serverReport(ns, server) {
    let status = serverStatus(ns, server);

    // Print hostname and status of server to the terminal
    ns.tprint(`Hostname : ${server}`);
    ns.tprint(`Status : ${status}`);

    // If server is rooted then display server details else display server requirements
    if (status == 'rooted') {
        ns.tprint(`🛡 : ${Math.round(ns.getServerSecurityLevel(server))} | ${ns.getServerMinSecurityLevel(server)}`);
        ns.tprint(`⨷ : ${ns.nFormat(ns.getServerMoneyAvailable(server), '$0.000a')} | ${ns.nFormat(ns.getServerMaxMoney(server), '$0.000a')}`);
    } else {
        ns.tprint(`Req. Level : ${ns.getServerRequiredHackingLevel(server)}`);
        ns.tprint(`Req. Ports : ${ns.getServerNumPortsRequired(server)}`);
    }

    // Print '-' 24 times
    ns.tprint('-'.repeat(24));
}

// Get the status of a specified server
function serverStatus(ns, server) {
    if (ns.hasRootAccess(server)) {
        return 'rooted';
    }

    if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) {
        return 'levelLocked';
    }

    if (ns.getServerNumPortsRequired(server) > hackablePorts) {
        return 'portLocked';
    }

    hackableServers = true;

    return 'locked';
}