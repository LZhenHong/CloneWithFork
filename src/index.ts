const DocumnetIds = {
    menuroot: "__primerPortalRoot__"
};

const Lang = {
    title: "Open with Fork"
};

startObserveMenuCreate();

function startObserveMenuCreate() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(handleMutation);
    observer.observe(targetNode, config);
}

function handleMutation(mutationsList: MutationRecord[], observer: MutationObserver) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const id = mutation.target['id'];
            if (id === DocumnetIds.menuroot) {
                handleMenuRoot(mutation.target);
            }
        }
    }
}

function handleMenuRoot(menuRoot: Node) {
    if (!menuRoot) {
        return;
    }

    let child = menuRoot?.lastChild?.lastChild;
    if (child) {
        let menuChild: Node = null;
        child.childNodes.forEach(node => {
            if (!menuChild && node.nodeName == "DIV" && node.lastChild &&
                node.lastChild.textContent.indexOf("Open with GitHub Desktop") > -1) {
                menuChild = node.lastChild;
            }
        });
        let innerMenu = menuChild?.lastChild;
        let cloneNode = innerMenu?.firstChild;
        if (cloneNode) {
            let forkNode = cloneNode.cloneNode(true);
            innerMenu.replaceChild(forkNode, cloneNode);
            const titleNode = forkNode.lastChild?.lastChild;
            if (titleNode) {
                titleNode.textContent = Lang.title;
            }
            forkNode.addEventListener("click", onFork);
        }
    }
}

function onFork(event: Event) {
    const urlScheme = "x-github-client://openRepo/";
    const entireHtml = document.documentElement.outerHTML;
    let matches = entireHtml.match(/git@github\.com:[A-Za-z0-9_.-]+\/([A-Za-z0-9_.-]+)\.git/gm);
    if (matches && matches.length > 0) {
        const sshUrl = matches[0];
        const cloneUrl = `${urlScheme}${sshUrl}`;
        
        // Safari 兼容性：使用 try-catch 处理可能的权限问题
        try {
            window.location.href = cloneUrl;
        } catch (error) {
            // 如果直接跳转失败，尝试在新窗口打开
            window.open(cloneUrl, '_blank');
        }
    }
}
