import type Node from "../nodes/models/Node";
import { getConnectorData } from "./Connections";

export default function traverse(seenNodes: Set<string>, executionStack: string[], curNode: Node) {
    const connections = curNode.getConnections()!;
    const curNodeID = curNode.getID();
    
    if (seenNodes.has(curNodeID)) return;
    
    seenNodes.add(curNodeID);

    for (const [ , conn ] of connections.input) {
        if (conn.dataType === "IGNORED") continue;

        for (let i = 0; i < conn.nodes.length; ++i) {
            const nextNode = conn.nodes[i];
            const nextConnector = conn.opositeConnectors[i];
            const nextConnectorType = getConnectorData(nextConnector).connectionType;

            if (nextConnectorType === "IGNORED") continue;

            traverse(seenNodes, executionStack, nextNode);
        }
    }

    executionStack.push(curNodeID); 
    
    for (const [ , conn ] of connections.output) {
        if (conn.dataType === "IGNORED") continue;

        for (let i = 0; i < conn.nodes.length; ++i) {
            const nextNode = conn.nodes[i];
            const nextConnector = conn.opositeConnectors[i];
            const nextConnectorType = getConnectorData(nextConnector).connectionType;

            if (nextConnectorType === "IGNORED") continue;

            traverse(seenNodes, executionStack, nextNode);
        }   
    }
}