import Vec2 from "./Vector";

export type Connection = { svg: SVGSVGElement, path: SVGPathElement };

export type CONNECTION_TYPES =
    "CONTROL_FLOW" |
    "IGNORED" |
    "DATA";

export function createConnectionElement(): Connection {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", "M 0 0 C 0 0, 0 0, 0 0");

    svg.classList.add("connection");
    svg.insertAdjacentElement("beforeend", path);

    return { svg, path };
}

export function setConnectionPosition(conn: Connection, pos: Vec2) {
    const connectionStyle = conn.svg.style;
    const newTransform = `translate(${pos.x}px, ${pos.y}px)`;

    connectionStyle.transform = newTransform;
}

export function renderConnection(conn: Connection, pos1: Vec2, pos2: Vec2) {
    // Adjust the width and height
    const connectionStyle = conn.svg.style;
    
    const distance = new Vec2(
        Math.abs(pos1.x - pos2.x),
        Math.abs(pos1.y - pos2.y)
    );

    if (distance.x < 6) distance.x = 6;
    if (distance.y < 6) distance.y = 6;

    connectionStyle.width = `${2 * distance.x}px`;
    connectionStyle.height = `${2 * distance.y}px`;
        
    // Position the SVG
    const svgPos = new Vec2(
        (pos1.x < pos2.x ? pos1.x : pos2.x) - distance.x / 2,
        (pos1.y < pos2.y ? pos1.y : pos2.y) - distance.y / 2
    );
    
    setConnectionPosition(conn, svgPos);

    // Render the path
    const start = new Vec2(pos1.x - svgPos.x, pos1.y - svgPos.y);
    const end = new Vec2(pos2.x - svgPos.x, pos2.y - svgPos.y);

    const dst = distance.x / (start.x > end.x ? 1 : 2);

    const ct1 = new Vec2(start.x + dst, start.y);
    const ct2 = new Vec2(end.x - dst, end.y);
    
    conn.path.setAttribute("d", `M ${start.x} ${start.y} C ${ct1.x} ${ct1.y}, ${ct2.x} ${ct2.y}, ${end.x} ${end.y}`);
}

export function findConnectorCenter(connector: Element) {
    const rect = connector.getBoundingClientRect();
    const center = new Vec2(rect.x + (rect.width / 2), rect.y + (rect.height / 2));

    return center;
}

export function getConnectorData(connector: SVGSVGElement): { name: string, type: "input" | "output", connectionType: CONNECTION_TYPES} {
    const dataset = connector.dataset;
    const connectorData = {
        name: dataset.name!,
        type: dataset.type! as "input" | "output",
        connectionType: dataset.connectionType! as CONNECTION_TYPES
    };

    return connectorData;
}