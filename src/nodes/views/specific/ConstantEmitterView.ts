import ConstantEmitterNode from "../../models/special/ConstantEmitterNode";
import NodeView from "../NodeView";

export default class ConstantEmitterView extends NodeView<ConstantEmitterNode> {
    private _availableTypes = [ "Boolean", "String", "Number" ];

    constructor(model: ConstantEmitterNode, styleClass: string) {
        super(model, styleClass);
    }

    protected onElementParsed(): void {
        const typeSelect = this.getNodeContainer().querySelector<HTMLSelectElement>(".type-select");
        let valueInput = this.getNodeContainer().querySelector<HTMLInputElement | HTMLSelectElement>(".value-input")!;

        valueInput.addEventListener("change", () => this._model.setCurrentValue(valueInput.value));
        this._model.setCurrentValue(valueInput.value);
        
        typeSelect?.addEventListener("change", () => {
            this._model.setCurrentType(typeSelect.value);

            valueInput.replaceWith(this.generateValueInput());
            valueInput = this.getNodeContainer().querySelector<HTMLInputElement | HTMLSelectElement>(".value-input")!;

            this._model.setCurrentValue(valueInput.value);

            valueInput.addEventListener("change", () => this._model.setCurrentValue(valueInput.value));
        });
    }

    private generateTypeSelect(): string {
        const select = document.createElement("select");

        select.classList.add("node-select");
        select.classList.add("type-select");
        select.name = "data-type";

        this._availableTypes.forEach(type => {
            const option = document.createElement("option");

            option.value = type.toLocaleLowerCase();
            option.textContent = type;

            select.insertAdjacentElement("beforeend", option);
        });

        return select.outerHTML;
    }

    private generateValueInput() {
        let valueInput: HTMLSelectElement | HTMLInputElement;

        if (this._model.getCurrentType() === "boolean") {
            valueInput = document.createElement("select");
            valueInput.classList.add("node-select");

            valueInput.insertAdjacentHTML("afterbegin", `
                <option value="true">True</option>
                <option value="false">False</option>
            `);
        } else {
            valueInput = document.createElement("input");
            valueInput.classList.add("node-input");
        }

        valueInput.classList.add("value-input");

        return valueInput;
    }

    public generateTemplate(): string {
        return `
            <div class="node__standard node_constant_emitter ${ this._styleClass }">
                <div class="node_header">${ this._model.getTitle() }</div>
                <div class="node_body">
                    <div class="row">
                        <div class="node-inputs">
                            <span>Type:</span>
                            ${ this.generateTypeSelect() }
                        </div>
                        <div></div>
                    </div>
                    <div class="row">
                        <div class="node-inputs">
                            <span>Value:</span>
                            ${ this.generateValueInput().outerHTML }
                        </div>
                        ${ this.getConnectorMarkup("A") }
                    </div>
                </div>
            </div>
        `;
    }
}