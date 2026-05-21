const ROOT_ID = "__primerPortalRoot__";
const ORIGINAL = "Open with GitHub Desktop";
const TITLE = "Open with Fork";

new MutationObserver(function(ms) {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    for (var i = 0; i < ms.length; i++) {
        var t = ms[i].target as Element;
        if (t === root || root.contains(t)) replace(root);
    }
}).observe(document.body, { childList: true, subtree: true });

function replace(root: Element) {
    var items = root.querySelectorAll("button, a, [role='menuitem']");
    for (var i = 0; i < items.length; i++) {
        var el = items[i];
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
                };
                return;
            }
        }
    }
}

function openFork() {
    var m = document.documentElement.outerHTML.match(/git@github\.com:[\w.-]+\/[\w.-]+\.git/);
    if (!m) return;
    var url = "x-github-client://openRepo/" + m[0];
    try { location.href = url; } catch (e) { window.open(url, "_blank"); }
}
