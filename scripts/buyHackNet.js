let maxNodeCost;

export const main = async function(ns) {
    let choice = ns.args[0];
    
    switch (choice) {
        case 'buy':
            if (buyNewNode(ns)) {
                ns.tprint('Node purchased');
            } else {
                ns.tprint('Not enough money to purchase a new node');
                ns.tprint(`${ns.nFormat(ns.getServerMoneyAvailable('home'), '$0.00a')} / ${ns.nFormat(ns.hacknet.getPurchaseNodeCost(), '$0.00a')}`);
            }
            
            break;
        case 'buyMax':
            let newNodeCount = buyNewNodes(ns);
            
            if (newNodeCount > 0) {
                ns.tprint(`${newNodeCount} ${newNodeCount > 1 ? 'nodes' : 'node'} purchased`);
            } else {
                ns.tprint('Not enough money to purchase new nodes');
                ns.tprint(`${ns.nFormat(ns.getServerMoneyAvailable('home'), '$0.00a')} / ${ns.nFormat(ns.hacknet.getPurchaseNodeCost(), '$0.00a')}`);
            }
            
            break;
        case 'upgrade':
            if (upgradeNodes(ns)) {
                ns.tprint('Nodes upgraded');
            } else {
                ns.tprint('Either not enough money to upgrade nodes, or nodes are already fully upgraded');
            }
            
            break;
        default:
            if (!choice) {
                ns.tprint('Error: No argument given');
            } else {
                ns.tprint(`Error: Invalid argument given \'${choice}\'`);
            }
            ns.tprint('Valid arguments: buy, buyMax, upgrade');
    }
};

function buyNewNodes(ns) {
    let runLoop = true;
    let i = 0;
    
    while (runLoop) {
        if (buyNewNode(ns)) {
            i = i + 1;
        } else {
            runLoop = false;
        }
    }
    
    return i;
}

function buyNewNode(ns) {
    if (ns.getServerMoneyAvailable('home') >= ns.hacknet.getPurchaseNodeCost()) {
        let index = ns.hacknet.purchaseNode();

        maxNodeCost = maxNodeCost || getNodeMaxedCost(ns, index);

        if (ns.getServerMoneyAvailable('home') >= maxNodeCost) {
            ns.hacknet.upgradeLevel(index, 200);
            ns.hacknet.upgradeCore(index, 16);
            ns.hacknet.upgradeRam(index, 6);
        } else {
            upgradeNode(ns, index);
        }
        
        return true;
    } else {
        return false;
    }
}

function getNodeMaxedCost(ns, index) {
    return (
        ns.hacknet.getLevelUpgradeCost(index, 200) + 
        ns.hacknet.getCoreUpgradeCost(index, 16) + 
        ns.hacknet.getRamUpgradeCost(index, 6)
    );
}

function upgradeNodePart(ns, nodeIndex, upgradePart, increment) {
    let upgradeFunc = `upgrade${upgradePart}`;
    let costFunc = `get${upgradePart}UpgradeCost`;
    let upgrade = false;
    let cost = ns.hacknet[costFunc](nodeIndex, increment);
    
    if (ns.getServerMoneyAvailable('home') >= cost && isFinite(cost)) {
        while (ns.getServerMoneyAvailable('home') >= cost && isFinite(cost)) {
            ns.hacknet[upgradeFunc](nodeIndex, increment);

            cost = ns.hacknet[costFunc](nodeIndex, increment);
        }
        
        upgrade = true;
    }
    
    return upgrade;
}

function upgradeNodes(ns) {
    let upgrades = false;
    let nodes = ns.hacknet.numNodes();
    
    if (ns.getServerMoneyAvailable('home') >= ns.hacknet.getPurchaseNodeCost()) {
        for (let i = 0;i < nodes;i++) {
            upgradeNode(ns, i);
        }
        
        upgrades = true;
    }
    
    return upgrades;
}

function upgradeNode(ns, index) {
    let level = upgradeNodePart(ns, index, 'Level', 10);
    let core = upgradeNodePart(ns, index, 'Core', 1);
    let ram = upgradeNodePart(ns, index, 'Ram', 2);
    
    return level || core || ram;
}