let config = {
    folder: 'scripts',
    rootUrl: 'https://raw.githubusercontent.com/NeonCarbide/BitBurner/main/',
    serverPrefix: 'xenon'
};

export async function main(ns) {
    let filesImported = await importFiles(ns);

    ns.tprint('-'.repeat(24))

    if (filesImported) {
        ns.tprint(`Installed scripts to ${config.folder}`);
    } else {
        ns.tprint('Error: One or more scripts failed to import');
    }
}

async function importFiles(ns) {
    let filesImported = true;
    let files = [
        'autoHack.js',
        'autoRemoteHack.js',
        'buyHackNet.js',
        'dash.js',
        'hack.js',
        'purchaseServers.js',
        'remoteHack.js'
    ];

    for (let file of files) {
        let remoteFileName = `${config.rootUrl}scripts/${file}`;
        let result = await ns.wget(remoteFileName, `/${getFolder()}/${file}`);

        filesImported = filesImported && result;

        ns.tprint(`${file} ${result ? 'successfully imported' : 'failed to import'}`);
    }

    return filesImported;
}

export function getFolder() {
    return config.folder;
}
  
export function getServerPrefix() {
    return config.serverPrefix;
}
  
export function getHackScript() {
    return `/${getFolder()}/hack.js`;
}