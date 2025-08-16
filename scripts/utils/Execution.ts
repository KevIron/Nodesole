import type Node from "../nodes/Node.ts";

export default function traverse(seenNodes: Set<string>, executionStack: string[], curNode: Node) {
    const connections = curNode.getConnections()!;
    const curNodeID = curNode.getID();
    
    if (seenNodes.has(curNodeID)) return;
    
    seenNodes.add(curNodeID);

    for (const [ , conn ] of connections.input) {
        if (conn.dataType === "IGNORED") continue;

        for (const nextNode of conn.nodes) {
            traverse(seenNodes, executionStack, nextNode);
        }
    }

    executionStack.push(curNodeID); 
    
    for (const [ , conn ] of connections.output) {
        if (conn.dataType === "IGNORED") continue;

        for (const nextNode of conn.nodes) {
            traverse(seenNodes, executionStack, nextNode);
        }
    }
}