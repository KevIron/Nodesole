export type CategoryTemplate = {
    name: string,
    renderBody<T>(data: T): string
}

export default class Inspector {
    private _parentContainer: HTMLElement;
    private _categories: [];
    
    constructor(parentElement: HTMLElement) {
        this._parentContainer = parentElement;
        this._categories = [];

        // this.displayCategory();
    }

    private displayCategory(category: CategoryTemplate) {
        const categoryContainer = document.createElement("div");
        const categoryHeader = document.createElement("div");
        const categoryBody = document.createElement("div");

        categoryContainer.classList.add("category");
        categoryHeader.classList.add("category-header");
        categoryBody.classList.add("category-body");

        categoryContainer.insertAdjacentElement("beforeend", categoryHeader);
        categoryContainer.insertAdjacentElement("beforeend", categoryBody);

        const headerTemplate = `
            <h3>${category.name}</h3>
            <svg xmlns="http://www.w2.org/2000/svg" viewBox="0 -960 960 960" class="icon category-btn">
                <path d="M439-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
            <svg xmlns="http://www.w2.org/2000/svg" viewBox="0 -960 960 960" class="icon category-btn inactive">
                <path d="M 439 -440 H 200 v -80 h 240 h 80 h 240 v 80 H 520 Z"/>
            </svg>
        `;

        categoryHeader.insertAdjacentHTML("beforeend", headerTemplate);
        // categoryBody.insertAdjacentHTML("beforeend", category.renderBody());

        const buttons = categoryHeader.querySelectorAll(".category-btn");
        buttons.forEach(btn => { 
            btn.addEventListener("click", (e) => {
                buttons.forEach(btn2 => btn2.classList.remove("inactive"));
                btn.classList.add("inactive");
                categoryBody.classList.toggle("inactive");
            });
        });

        this._parentContainer.insertAdjacentElement("beforeend", categoryContainer);
    }

    public displayInfo(data: any) {

    }
}