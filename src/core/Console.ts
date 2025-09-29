import { moveCaretEnd } from "../utils/Input";

export default class ConsoleView {
    private _consoleContentsContainer: HTMLElement;
    private _inputRequestCallback: ((input: string) => void) | null;

    constructor () {
        this._consoleContentsContainer = document.createElement("div");
        this._consoleContentsContainer.classList.add("console-content");
        
        this._inputRequestCallback = null;
    }

    private insertInput() {
        const input = document.createElement("p");
        
        input.classList.add("user-input");
        input.contentEditable = "plaintext-only";
        input.textContent = "> ";
        
        const handler = this.handleInput.bind(this);
        
        input.addEventListener("focus", () => input.addEventListener("keydown", handler));
        input.addEventListener("focusout", () => input.removeEventListener("keydown", handler));
        
        this._consoleContentsContainer.insertAdjacentElement("beforeend", input);

        input.focus();

        moveCaretEnd(input);
    }

    public handleInput(e: KeyboardEvent) {
        const target = e.target as HTMLElement;

        if (e.key == "Enter") {
            e.preventDefault();
            target.contentEditable = "false";

            if (!this._inputRequestCallback) return;

            this._inputRequestCallback(target.textContent.slice(2));
            this._inputRequestCallback = null;

            return;
        }

        if (e.key == "Backspace" || e.key == "Delete") {
            if (target.textContent.length === 2) { e.preventDefault(); return; }
        }

        const selection = document.getSelection();

        if (selection) {
            const length = selection.toString().length;
            const offset = selection.anchorOffset;
                
            const idx = (selection.direction === "backward") ? offset - length : offset;

            if (length != 0 && idx < 2) {
                const startIdx = idx + (2 - idx);
                const endIdx = idx + length;
                
                e.preventDefault();
                target.textContent = target.textContent.substring(0, startIdx) + target.textContent.substring(endIdx);
                
                const range = document.createRange();
                
                range.selectNodeContents(target);
                range.collapse(false);
                
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    public async requestInput(): Promise<string> {
        setTimeout(() => { this.insertInput() }, 50);

        const inputPromise = new Promise<string>((resolve) => {
            this._inputRequestCallback = (input: string) => resolve(input)
        });
        
        return inputPromise;
    }   

    public clearConsole() {
        this._consoleContentsContainer.innerHTML = "";
    }
    
    public printMessage(message: string) {
        const messageElement = document.createElement("p");

        messageElement.innerHTML = "<span class='info'>PROGRAM ></span> " + message.trim().replace("\n", " ");

        this._consoleContentsContainer.insertAdjacentElement("beforeend", messageElement);
    }

    public getElement() {
        return this._consoleContentsContainer;
    }
}