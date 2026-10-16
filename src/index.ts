const ROOT_ID = "__primerPortalRoot__";
const ORIGINAL = "Open with GitHub Desktop";
const TITLE = "Open with Fork";
const HIDDEN = "Open in GitHub Copilot app";

var PORTAL_OBSERVER = new MutationObserver(function(ms) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    for (var i = 0; i < ms.length; i++) {
        var t = ms[i].target as Element;
        if (t === root || root.contains(t)) replace(root);
    }
});
PORTAL_OBSERVER.observe(document.body, { childList: true, subtree: true });
replace(document.getElementById(ROOT_ID) || document.body);

function replace(root: Element) {
    var items = root.querySelectorAll("button, a, [role='menuitem']");
    for (var i = 0; i < items.length; i++) {
        var el = items[i];
        if (el.textContent && el.textContent.indexOf(HIDDEN) !== -1) {
            hideMenuItem(el);
            continue;
        }
        if (el.textContent && el.textContent.indexOf(TITLE) !== -1) {
            promoteOpenItem(el);
            continue;
        }
        if (!el.textContent || el.textContent.indexOf(ORIGINAL) === -1) continue;
        var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        var n: Text | null;
        while (n = w.nextNode() as Text) {
            if (n.nodeValue && n.nodeValue.indexOf(ORIGINAL) > -1) {
                n.nodeValue = n.nodeValue.replace(ORIGINAL, TITLE);
                (el as HTMLElement).onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openFork();
                    return false;
                };
                promoteOpenItem(el);
                break;
            }
        }
    }
}

function hideMenuItem(el: Element) {
    var item = findMenuItem(el);
    (item as HTMLElement).style.display = "none";
    item.setAttribute("aria-hidden", "true");
}

function promoteOpenItem(el: Element) {
    var item = findMenuItem(el);
    var parent = item.parentElement;
    if (!parent) return;

    var firstOpenItem = findFirstOpenItem(parent);
    if (firstOpenItem && firstOpenItem !== item) {
        parent.insertBefore(item, firstOpenItem);
    }
}

function findMenuItem(el: Element) {
    var item = el.closest("li") || el;
    while (item.parentElement &&
        item.parentElement.id !== ROOT_ID &&
        item.parentElement.children.length === 1) {
        item = item.parentElement;
    }
    return item;
}

function findFirstOpenItem(parent: Element): Element | null {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (!child.textContent || child.textContent.indexOf("Open ") === -1) continue;
        if (isMenuItem(child)) return child;
    }
    return null;
}

function isMenuItem(el: Element) {
    return el.matches("button, a, [role='menuitem']") ||
        !!el.querySelector("button, a, [role='menuitem']");
}

function openFork() {
    var ssh = findSshUrl();
    if (!ssh) return true;
    var url = "x-github-client://openRepo/" + ssh;
    try { location.href = url; } catch (e) { window.open(url, "_blank"); }
    return true;
}

function findSshUrl(): string | null {
    var m = document.documentElement.outerHTML.match(/git@github\.com:[\w.-]+\/[\w.-]+\.git/);
    if (m) return m[0];
    // Fallback: derive the SSH URL from the current page path when GitHub only
    // renders the HTTPS clone URL (user switched protocol to HTTPS).
    var parts = location.pathname.match(/^\/([\w.-]+)\/([\w.-]+)/);
    if (parts) return "git@github.com:" + parts[1] + "/" + parts[2] + ".git";
    return null;
}
