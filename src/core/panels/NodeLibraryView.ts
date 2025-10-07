import ViewportManager from "../viewport/ViewportManager";

export default class NodeLibraryView {
    private _viewport: ViewportManager;
    private _container: HTMLDivElement;

    private _searchedText: string;
    
    constructor (viewport: ViewportManager) {
        this._viewport = viewport;
        this._container = this.buildElement();

        this._searchedText = "";
    }

    private filterNodes(): void {
        
    }

    private buildCategories(): HTMLElement[] {
        return [];
    }

    private buildNodeGridElements(): HTMLElement[] {
        return [];
    }

    private buildElement(): HTMLDivElement {
        // Create main popup containers
        const libraryContainer = document.createElement("div");
        const innerLibraryContainer = document.createElement("div");

        // Create search bar
        const searchContainer = document.createElement("div");
        searchContainer.classList.add("search-container");

        // Create inner containers
        const selectorContainer = document.createElement("div");
        const categoriesContainer = document.createElement("div");
        const nodesContainer = document.createElement("div");

        // Create Categories list
        const categoriesList = document.createElement("ul");
        const categories = this.buildCategories();
        categoriesList.classList.add("categories");
        categories.forEach(category => nodesGrid.insertAdjacentElement("beforeend", category));
        
        categoriesContainer.classList.add("categories-container");
        categoriesContainer.insertAdjacentHTML("beforeend", "<h3>Categories</h3>");
        categoriesContainer.insertAdjacentElement("beforeend", categoriesList)

        // Create the node grid
        const nodesGrid = document.createElement("div");
        const nodes = this.buildNodeGridElements();
        nodesGrid.classList.add("node-grid");
        nodes.forEach(node => nodesGrid.insertAdjacentElement("beforeend", node));

        nodesContainer.classList.add("nodes-container");
        nodesContainer.insertAdjacentHTML("beforeend", "<h3>Nodes</h3>");
        nodesContainer.insertAdjacentElement("beforeend", nodesGrid);

        // Insert the containers
        selectorContainer.classList.add("selector-container");
        selectorContainer.insertAdjacentElement("beforeend", categoriesContainer);
        selectorContainer.insertAdjacentElement("beforeend", nodesContainer);
        
        innerLibraryContainer.classList.add("node-library-container_inner");
        innerLibraryContainer.insertAdjacentElement("beforeend", categoriesContainer);
        innerLibraryContainer.insertAdjacentElement("beforeend", nodesContainer);

        libraryContainer.classList.add("node-library-container");
        libraryContainer.insertAdjacentElement("beforeend", innerLibraryContainer);

        return libraryContainer;
    }

    public show(): void {
        this._container.classList.remove("hidden");
    }

    public hide(): void {
        this._container.classList.add("hidden");
    }

    public getElement(): HTMLDivElement {
        return this._container;
    }
}