const symbols = { 
    'foodnstuff': 'FNS',
    'joesguns': 'JGN',
    'omega-net': 'OMGA',
    'sigma-cosmetics': 'SGC'
};

export const main = async function(ns) {
    let target = ns.args[0];
    let thread = ns.args[1];
    let symbol = symbols[target];
    let thresh = ns.getServerMinSecurityLevel(target) + 2;
    
    while (ns.getServerMoneyAvailable(target) > 0) {
        if (ns.getServerSecurityLevel(target) > thresh) {
            await ns.weaken(target);
        } else {
            await ns.hack(target, { stock: true });
        }
    }
    
    ns.tprint('-'.repeat(24));
    ns.tprint('Buying stock...');
    ns.tprint('-'.repeat(24));
    
    stockInfo(ns, target, symbol);
    
    ns.buyStock(symbol, 1);
    
    while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        if (ns.getServerSecurityLevel(target) > thresh) {
            await ns.weaken(target);
        } else {
            await ns.grow(target);
        }
    }
    
    ns.tprint('-'.repeat(24));
    ns.tprint('Selling stock...');
    ns.tprint('-'.repeat(24));
    
    stockInfo(ns, target, symbol);
    
    //ns.sellStock(symbol, 1);
    
    function stockInfo(ns, target, symbol) {
        ns.tprint(`⨷ : ${ns.nFormat(ns.getServerMoneyAvailable(target), '$0.000a')} | ${ns.nFormat(ns.getServerMaxMoney(target), '$0.000a')}`);
        ns.tprint(`Stock Price: ${ns.nFormat(ns.getStockPrice(symbol), '$0.000a')}`);
        ns.tprint(`Stock Cost: ${ns.nFormat(ns.getStockPurchaseCost(symbol, 1, 'L'), '$0.000a')}`);
        ns.tprint(`Stock Gain: ${ns.nFormat(ns.getStockSaleGain(symbol, 1, 'L'), '$0.000a')}`);
    }
};