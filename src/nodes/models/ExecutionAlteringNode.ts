import Procedure from "../../core/Procedure";
import Node from "./Node";

export default abstract class ExecutionAlteringNode extends Node {
    protected _procedure: Procedure;

    constructor (procedure: Procedure) {
        super();
        this._procedure = procedure;
    } 

    public getConnectedNode(connectorName: string) {
        const connector = this.getConnectors().has(connectorName);
        if (!connector) throw new Error(`Connector ${connectorName} doesn't exist!`);

        const connectedNodes = this._procedure.getConnectedNodes(this.getID());
        let connectionInfo = null;

        if (connectedNodes.input.has(connectorName)) connectionInfo = connectedNodes.input.get(connectorName);
        else connectionInfo = connectedNodes.output.get(connectorName);

        if (!connectionInfo) return null;

        return this._procedure.getNodeFromId(connectionInfo.node);
    }
}