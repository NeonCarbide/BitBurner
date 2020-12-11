export async function main(ns) {
    let server = ns.args[0];
    
    serverReport(ns, server);
}
    
export function serverReport(ns, server) {
    let status = serverHackStatus(ns, server);

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
export function serverHackStatus(ns, server) {
    if (ns.hasRootAccess(server)) {
        return 'rooted';
    }

    if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel()) {
        return 'levelLocked';
    }

    if (ns.getServerNumPortsRequired(server) > hackablePorts(ns)) {
        return 'portLocked';
    }

    hackableServers = true;

    return 'locked';
}

export function hackablePorts(ns) {
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

    return hackPorts;
}