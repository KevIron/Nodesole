import type Node from "../nodes/Node.ts";

export default function traverse(nodeList: Map<string, Node>, seenNodes: Set<string>, executionStack: string[], curNode: string) {
    const connections = nodeList.get(curNode)?.getConnections()!;
    
    if (seenNodes.has(curNode)) return;
    seenNodes.add(curNode);

    for (const [ , conn ] of connections.input) {
        for (const nextNode of conn.nodes) {
            traverse(nodeList, seenNodes, executionStack, nextNode.getID());
        }
    }

    executionStack.push(curNode); 
    
    for (const [ , conn ] of connections.output) {
        for (const nextNode of conn.nodes) {
            traverse(nodeList, seenNodes, executionStack, nextNode.getID());
        }
    }
}