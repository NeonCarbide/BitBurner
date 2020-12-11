import { getHackScript } from 'import.js';

export const main = async function(ns) {
    let servers = ns.getPurchasedServers();
    let targets = ns.args;

    servers.map((server, index) => {
        ns.killall(server);

        let serverIndex = index % targets.length;
        let scriptRam = ns.getScriptRam(getHackScript());
        let serverRam = ns.getServerRam(server)[0];
        let threads = Math.floor(serverRam / scriptRam);
        let target = targets[serverIndex];

        ns.tprint(`${server} targeting ${target} with ${threads} threads`);
        ns.scp(getHackScript(), server);

        if (threads > 0) {
            ns.exec(getHackScript(), server, threads, target, threads);
        }
    });
};