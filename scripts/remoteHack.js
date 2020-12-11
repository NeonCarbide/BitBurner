import { getHackScript } from 'import.js';

export const main = async function(ns) {
    let servers = ns.getPurchasedServers();
    let targets = ns.args[0].split(',');
    let hackScript = ns.args[1] || getHackScript();

    servers.map((server, index) => {
        ns.killall(server);

        let serverIndex = index % targets.length;
        let scriptRam = ns.getScriptRam(hackScript);
        let serverRam = ns.getServerRam(server)[0];
        let threads = Math.floor(serverRam / scriptRam);
        let target = targets[serverIndex];

        ns.tprint(`${server} targeting ${target} with ${threads} threads`);
        ns.scp(hackScript, server);

        if (threads > 0) {
            ns.exec(hackScript, server, threads, target, threads);
        }
    });
};