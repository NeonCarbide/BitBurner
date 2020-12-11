import { getServerPrefix } from 'import.js';

let maxServers;
let servers;

export const main = async function(ns) {
    maxServers = ns.getPurchasedServerLimit();
    servers = ns.getPurchasedServers(true);

    serverInfo(ns);
    await buyServers(ns);
};

function serverInfo(ns) {
    ns.tprint(`Owned Servers: ${servers.length} / ${maxServers}`);
    ns.tprint('-'.repeat(24));

    Object.entries(groupServers(ns)).map((server) => {
        ns.tprint(`${server[0]}GB : ${server[1]}`);
    });
}

function groupServers(ns) {
    let group = {};

    servers.forEach((server) => {
        let ram = ns.getServerRam(server)[0];
        
        group[ram] = group[ram] || [];
        group[ram].push(server);
    });

    return group;
}

async function buyServers(ns) {
    let ram = ns.getPurchasedServerMaxRam();
    let buy = true;

    while (buy) {
        let money = ns.getServerMoneyAvailable('home');
        let cost = ns.getPurchasedServerCost(ram);

        while (cost > money && ram > findMin(ns)) {
            ram = ram / 2;
            cost = ns.getPurchasedServerCost(ram);
        }

        buy = (cost > money) || (servers.length == maxServers)? false : await ns.prompt(`Buy ${ram}GB for ${ns.nFormat(cost, '$0.00a')}`);

        if (buy) {
                buy = buyServer(ns, ram);
        }
    }
}

function buyServer(ns, ram) {
    if (servers.length == maxServers) {
        let check = removeWeakestServer(ns, ram);

        if (!check) {
            return false;
        }
    }
    let server = ns.purchaseServer(`${getServerPrefix()}-${ram}GB`, ram);

    servers.push(server);
    ns.tprint(`Purchased ${server} : ${ram}GB`);

    return true;
}

function removeWeakestServer(ns, ram) {
    let group = groupServers(ns);
    let min = findMin(ns);

    if (ram <= min) {
        ns.tprint(`All owned servers already have a minimum of ${ram}GB of ram!`);

        return false;
    }

    ns.killall(group[min][0]);
    ns.deleteServer(group[min][0]);

    servers = ns.getPurchasedServers(true);

    return true;
}

function findMin(ns) {
    return Math.min(...Object.keys(groupServers(ns)));
}