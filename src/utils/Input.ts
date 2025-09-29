export function moveCaretEnd(el: HTMLElement) {
    const selection = document.getSelection();
    const range = document.createRange();

    if (!selection) return;

    range.selectNodeContents(el);

    setTimeout(() => {
        selection.removeAllRanges();
        selection.addRange(range);
    }, 1);

    range.collapse(false);
}