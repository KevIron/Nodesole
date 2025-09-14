import ConsoleWriterNode from "../../models/console/ConsoleWriterNode";
import StandardNodeView from "../StandardNodeView";

export default class ConsoleWriterNodeView extends StandardNodeView<ConsoleWriterNode> {
    private _formatInput: HTMLElement | null = null;

    protected onElementParsed(): void {
        this._formatInput = this.getNodeContainer().querySelector<HTMLInputElement>("#outputFormat");
 
        if (!this._formatInput) return;
        this._formatInput.addEventListener("focus", () => {
            if (!this._formatInput) return;
            this._formatInput.addEventListener("input", () => {
                if (!this._formatInput) return;
                this._model.setFormatString(this._formatInput.textContent)
            });
        })
    }

    public generateBodyMarkup() {
        const connectors = Array.from(this._model.getConnectors().entries());

        const inputConnectors = connectors.filter((conn) => conn[1].type == "input").map((conn) => this.getConnectorMarkup(conn[0]));
        const outputConnectors = connectors.filter((conn) => conn[1].type == "output").map((conn) => this.getConnectorMarkup(conn[0]));

        const rows = new Array<string>();

        for (let i = 0; i < Math.max(inputConnectors.length, outputConnectors.length); ++i) {
            rows.push(`
                <div class="row">
                    ${inputConnectors[i] || "<div></div>"}
                    ${outputConnectors[i] || "<div></div>"}
                </div>
            `);
        }

        const inputMarkup = `
            <div class="input-wrapper">
                <div class="row">
                    <span>Output format:</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.52022 11.7778C7.67983 11.7778 7.81453 11.7226 7.92431 11.6124C8.03408 11.5021 8.08897 11.3672 8.08897 11.2076C8.08897 11.0478 8.03384 10.9131 7.92358 10.8035C7.81332 10.6937 7.67833 10.6388 7.5186 10.6388C7.35899 10.6388 7.22429 10.6939 7.11451 10.8042C7.00486 10.9145 6.95003 11.0495 6.95003 11.2092C6.95003 11.3688 7.00516 11.5035 7.11542 11.6133C7.22568 11.7229 7.36061 11.7778 7.52022 11.7778ZM7.14719 9.38612H7.8445C7.86304 9.0722 7.92202 8.81707 8.02144 8.62075C8.12099 8.42455 8.32586 8.17412 8.63606 7.86946C8.95829 7.54723 9.19812 7.25858 9.35557 7.00351C9.51301 6.74845 9.59174 6.45318 9.59174 6.11771C9.59174 5.54848 9.39174 5.09486 8.99175 4.75686C8.59176 4.41898 8.11858 4.25004 7.57222 4.25004C7.05282 4.25004 6.61185 4.39124 6.24929 4.67363C5.88686 4.95601 5.62138 5.28053 5.45286 5.64718L6.11658 5.92217C6.23238 5.65928 6.39789 5.4269 6.61311 5.22504C6.82845 5.02318 7.13889 4.92225 7.54442 4.92225C8.0129 4.92225 8.35505 5.05069 8.57087 5.30756C8.78658 5.56455 8.89443 5.84724 8.89443 6.15562C8.89443 6.40563 8.82684 6.62898 8.69167 6.82567C8.55649 7.02247 8.38057 7.22042 8.1639 7.41951C7.74538 7.80554 7.47129 8.13283 7.34165 8.40138C7.21201 8.66992 7.14719 8.99817 7.14719 9.38612ZM7.50235 14.5C6.60354 14.5 5.75848 14.3294 4.96717 13.9883C4.17597 13.6472 3.48769 13.1842 2.90233 12.5995C2.31697 12.0147 1.85361 11.327 1.51224 10.5364C1.17075 9.74597 1 8.90127 1 8.00235C1 7.10354 1.17056 6.25848 1.51169 5.46717C1.85282 4.67597 2.31577 3.98769 2.90053 3.40233C3.48529 2.81697 4.17296 2.35361 4.96356 2.01224C5.75403 1.67075 6.59873 1.5 7.49765 1.5C8.39646 1.5 9.24152 1.67057 10.0328 2.01169C10.824 2.35282 11.5123 2.81577 12.0977 3.40053C12.683 3.98529 13.1464 4.67296 13.4878 5.46356C13.8293 6.25403 14 7.09873 14 7.99765C14 8.89646 13.8294 9.74152 13.4883 10.5328C13.1472 11.324 12.6842 12.0123 12.0995 12.5977C11.5147 13.183 10.827 13.6464 10.0364 13.9878C9.24597 14.3293 8.40127 14.5 7.50235 14.5ZM7.5 13.7778C9.11296 13.7778 10.4792 13.2181 11.5986 12.0986C12.7181 10.9792 13.2778 9.61296 13.2778 8C13.2778 6.38704 12.7181 5.02083 11.5986 3.90139C10.4792 2.78194 9.11296 2.22222 7.5 2.22222C5.88704 2.22222 4.52083 2.78194 3.40139 3.90139C2.28194 5.02083 1.72222 6.38704 1.72222 8C1.72222 9.61296 2.28194 10.9792 3.40139 12.0986C4.52083 13.2181 5.88704 13.7778 7.5 13.7778Z" fill="#CCCCCC"/>
                    </svg>
                </div>
                <div id="outputFormat" class="node-input" contentEditable="true">
            </div>
        `;

        return rows.join("\n") + inputMarkup;
    }
}