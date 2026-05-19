const DocumentIds = {
    menuroot: "__primerPortalRoot__"
};

const Lang = {
    title: "Open with Fork",
    original: "Open with GitHub Desktop"
};

const PROCESSED_ATTR = "data-fork-processed";

startObserveMenuCreate();

function startObserveMenuCreate() {
    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });
}

function handleMutation(mutationsList: MutationRecord[]) {
    for (const mutation of mutationsList) {
        const target = mutation.target as Element;
        if (target.id === DocumentIds.menuroot) {
            handleMenuRoot(target);
        }
    }
}

function handleMenuRoot(portalRoot: Element) {
    if (portalRoot.hasAttribute(PROCESSED_ATTR)) {
        return;
    }

    const allElements = portalRoot.querySelectorAll("*");
    let desktopItem: Element | null = null;

    for (let i = 0; i < allElements.length; i++) {
        if (allElements[i].textContent?.trim() === Lang.original) {
            desktopItem = allElements[i];
            break;
        }
    }

    if (!desktopItem) {
        return;
    }

    const button = desktopItem.closest("button, a, [role='menuitem']");
    if (!button) {
        return;
    }

    portalRoot.setAttribute(PROCESSED_ATTR, "true");

    const forkButton = button.cloneNode(true) as Element;
    forkButton.textContent = Lang.title;
    button.parentNode?.replaceChild(forkButton, button);
    forkButton.addEventListener("click", onFork);
}

function onFork(event: Event) {
    const sshUrl = findSshUrl();
    if (sshUrl) {
        const cloneUrl = `x-github-client://openRepo/${sshUrl}`;
        try {
            window.location.href = cloneUrl;
        } catch (error) {
            window.open(cloneUrl, '_blank');
        }
    }
}

function findSshUrl(): string | null {
    const inputs = document.querySelectorAll("input");
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const match = input.value.match(/^git@github\.com:[^\s]+\.git$/);
        if (match) {
            return input.value;
        }
    }

    const html = document.documentElement.outerHTML;
    const match = html.match(/git@github\.com:[A-Za-z0-9_.\-]+\/[A-Za-z0-9_.\-]+\.git/);
    return match ? match[0] : null;
}
