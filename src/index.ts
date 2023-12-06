const DocumnetIds = {
    menuroot: "__primerPortalRoot__"
};

const Lang = {
    title: "Open with Fork"
};

function onWebPageLoadComplete() {
    startObserveMenuCreate();
}

function startObserveMenuCreate() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(handleMutation);
    observer.observe(targetNode, config);
}

function handleMutation(mutationsList: MutationRecord[], observer: MutationObserver) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // @ts-ignore
            const id = mutation.target['id'];
            if (id === DocumnetIds.menuroot) {
                let child = mutation.target.lastChild;
                if (child) {
                    parseMenuPanel(child);
                }
            }
        }
    }
}

function parseMenuPanel(menuPanel: Node) {
    let child = menuPanel.lastChild;
    if (child) {
        let menuChild: Node | null = null;
        child.childNodes.forEach(node => {
            if (!menuChild && node.nodeName == "DIV") {
                menuChild = node.lastChild;
            }
        });
        let innerMenu = menuChild?.lastChild?.lastChild;
        let cloneNode = innerMenu?.firstChild;
        if (cloneNode) {
            let forkNode = cloneNode.cloneNode(true);
            innerMenu.insertBefore(forkNode, cloneNode);
            const titleNode = forkNode.lastChild?.lastChild;
            if (titleNode) {
                titleNode.textContent = Lang.title;
            }
            forkNode.addEventListener("click", onFork);
        }
    }
}

function onFork(event: Event) {
    const urlScheme = "github-mac://openRepo/";
    const entireHtml = document.documentElement.outerHTML;
    let matches = entireHtml.match(/git@github\.com:[A-Za-z0-9_.-]+\/([A-Za-z0-9_.-]+)\.git/gm);
    if (matches && matches.length > 0) {
        const sshUrl = matches[0];
        const cloneUrl = `${urlScheme}${sshUrl}`;
        window.location.href = cloneUrl;
    }
}

const handler = setInterval(() => {
    if (document.readyState !== 'complete') {
        return;
    }
    clearInterval(handler);
    onWebPageLoadComplete();
}, 1000);