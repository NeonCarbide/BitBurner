import { getFolder, getServerPrefix } from 'import.js';
import { serverHackStatus, serverReport } from '/scripts/serverStatus.js';

let hackableServers;

export const main = async function(ns) {
    hackableServers = false;

    findServer(ns, 'home', 'home', serverReport);

    let autoHack;

    if (hackableServers) {
        autoHack = await ns.prompt('Hack available servers?');

        if (autoHack) {
            ns.tprint('Injecting scripts...');
            ns.tprint('Hacking servers...');
            ns.run(`/${getFolder()}/autoHack.js`);
            ns.tprint('Servers hacked');
        }
    }

    let buyServers = await ns.prompt('Manage owned servers?');

    if (buyServers) { ns.run(`/${getFolder()}/purchaseServers.js`); }
    if (buyServers || autoHack) {
        let remoteHack = await ns.prompt('Refresh remote hacks?');

        if (remoteHack) { ns.run(`/${getFolder()}/autoRemoteHack.js`); }
    }
};

function findServer(ns, start, target, func) {
    let servers = ns.scan(target, true).filter((server) => server !== start && !server.includes(getServerPrefix()));

    servers.forEach((server) => {
        func.call(this, ns, server);

        let status = serverHackStatus(ns, server);
        
        if (status == 'locked') { hackableServers = true; }
        if (status !== 'portLocked') { findServer(ns, target, server, func); }
    });
}