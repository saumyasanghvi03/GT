const vscode = require('vscode');
const { telemetry, eventTypes } = require('./tlm');

const extensionId = 'Blackboxapp.blackboxagent';

function install_agent_extension_if_not_installed(context){
    try {
    
        console.log(`Checking for extension ${extensionId} installation...`);
        const extension = vscode.extensions.getExtension(extensionId);
        if (extension) {
            console.log(`Extension ${extensionId} is installed.`);
            // console.log(`Extension ${extensionId} version: ${extension.isActive ? extension.active : extension.packageJSON.version}`);
            // You can perform actions if the extension is installed
        } else {
            start_install_cybercoder()
        }
    } catch (error) {
        console.log(error)
    }
}

function start_install_cybercoder() {
    try {
        console.log(`Extension ${extensionId} is not installed.`);
        console.log(`Installing extension ${extensionId}...`);
        vscode.commands.executeCommand('workbench.extensions.installExtension', extensionId);
        telemetry(eventTypes.other, '', { tag: 'installing-blackbox-agent' })
    } catch (error) {
        console.log(error)
    }
}

vscode.commands.registerCommand('blackbox.openCybercoder', async () => {
    const extensionId = 'Blackboxapp.blackboxagent';
    console.log(`Checking for extension ${extensionId} installation...`);
    const extension = vscode.extensions.getExtension(extensionId);
    if (extension) {
        telemetry(eventTypes.other, '', { tag: 'installing-blackbox-agent', status: 'existing' })
        // trigger the opening of the extension activity bar
        await vscode.commands.executeCommand('workbench.view.extension.blackboxai-dev-ActivityBar');
    } else {
        telemetry(eventTypes.other, '', { tag: 'open-blackbox-agent', status: 'existing' })
        start_install_cybercoder()
    }
})

module.exports = {
    install_agent_extension_if_not_installed,
    start_install_cybercoder
}