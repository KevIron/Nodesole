import Procedure from "./Procedure";

// this class is supposed to be a model for the program the user is editing 
// when the program is run it executes all the existing procedures if they
// are connected in the graph, it also emits events so that other pieces of ui
// can update accordingly to the changes in the model 

export default class Program {
    private _procedures: Procedure[]
    private _currentProcedure: number;

    constructor () {
        this._procedures = new Array<Procedure>();
        this._currentProcedure = 0;

        // this._procedures.push();
    }

    public async execute() { throw new Error("Function not implemented!") }   
}