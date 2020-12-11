import { getHackScript, getServerPrefix } from 'import.js';

let hackablePorts;

export const main = async function(ns) {
    findHackablePorts(ns);
    findServer(ns, 'home', 'home', hackServer);
};

function findServer(ns, start, target, func) {
    // Get array of subservers for current server then filter out current server and userPC
    let servers = ns.scan(target, true).filter((server) => server !== start && !server.includes(getServerPrefix()));

    // For each server in servers run hackServer on server then recursively call findServer
    servers.forEach((server) => {
        func.call(this, ns, server);
        findServer(ns, target, server, func);
    });
}

function hackServer(ns, server) {
    // Check if server has been rooted
    if (crackServer(ns, server)) {
        // Kill all running scripts on target server
        ns.killall(server);

        // Get ram usage for script
        let scriptRam = ns.getScriptRam(getHackScript());

        // Get max ram of server
        let serverRam = ns.getServerRam(server)[0];

        // Get available thread count
        let threads = Math.floor(serverRam / scriptRam);

        // Copy hack.js to target server
        ns.scp(getHackScript(), server);

        // Run hack.js on target server if it has any threads to run on
        if (threads > 0) {
            ns.exec(getHackScript(), server, threads, server, threads);
        }
    }
}

function crackServer(ns, server) {
    // Server is already rooted
    if (ns.hasRootAccess(server)) {
        return true;
    }

    // Run cracking programs based on availability
    if (ns.fileExists('BruteSSH.exe')) {
        ns.brutessh(server);
    }

    if (ns.fileExists('FTPCrack.exe')) {
        ns.ftpcrack(server);
    }

    if (ns.fileExists('relaySMTP.exe')) {
        ns.relaysmtp(server);
    }

    if (ns.fileExists('HTTPWorm.exe')) {
        ns.httpworm(server);
    }

    if (ns.fileExists('SQLInject.exe')) {
        ns.sqlinject(server);
    }

    // Check if hacking level enough is high enough, as well as if required amount of open ports has been reached
    if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel() ||
        ns.getServerNumPortsRequired(server) > hackablePorts) {
        return false;
    } else {
        ns.nuke(server);
        return true;
    }
}

// Find the number of ports that can be opened based on available cracking programs
function findHackablePorts(ns) {
    let ports = 0;

    if (ns.fileExists('BruteSSH.exe')) {
        ports += 1;
    }

    if (ns.fileExists('FTPCrack.exe')) {
        ports += 1;
    }

    if (ns.fileExists('relaySMTP.exe')) {
        ports += 1;
    }

    if (ns.fileExists('HTTPWorm.exe')) {
        ports += 1;
    }

    if (ns.fileExists('SQLInject.exe')) {
        ports += 1;
    }

    hackablePorts = ports;
}