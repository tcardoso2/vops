/****************************************************
Attention: Leave the code within this <script> element unchanged!
*   DISCLAIMER OF WARRANTY
*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
*	Author: Tiago Cardoso
****************************************************/

//defining the constructor
function MCommand() { };
//defining the object prototype	
MCommand.prototype = {
    _commands: new Array(),
    _command: '',
    index: function (v) {
        this._index = function () {
            return this._i == undefined ? (this._i = this._commands.length) : this._i;
        };
        this.isInsideLowerBoundary = function (v) {
            //Gets the current index
            var i = this._index();
            //Checks if it is inside boundaries
            return (i + v) >= 0;
        };
        this.isInsideUpperBoundary = function (v) {
            //Gets the current index
            var i = this._index();
            //Checks if it is inside boundaries
            return (i + v) <= this._commands.length;
        };
        this.isInsideBoundaries = function (v) {
            //Gets the current index
            var i = this._index();
            //alert("requested: " + (i + v) + " capacity: " + this._commands.length);
            //Checks if it is inside boundaries
            return ((i + v) <= this._commands.length) && ((i + v) >= 0);
        };
        this.add = function (v) {
            if (this.isInsideBoundaries(v) == true)
                this._i += v;
            //allow chaining
            return this;
        }
        //Runs this code
        if (typeof (v) == 'number');
        {
            this.add(v);
        }
        result = this._index();
        //alert("Added " + v + "=" + result);
        return result;
    },
    push: function () {
        this.index(1);
        this._commands.push(this._command);
        //also saves
        this.save();
    },
    pop: function () {
        this.index(-1);
        return this._commands.pop();
    },
    peek: function () {
        return this._commands[this._commands.length - 1];
    },
    deleteInput: function () {
        this._command = '';
    },
    addInput: function (c) {
        this._command = this._command + c;
    },
    removeLastChar: function (c) {
        this._command = this._command.slice(0, this._command.length - 1);
    },
    getInput: function () {
        return this._command;
    },
    getCommand: function (i) {
        return (i < 0 || i >= this._commands.length) ? this._command : this._commands[i];
    },
    getPrevious: function () {
        this._command = this.getCommand(this.index(-1));
        return this._command;
    },
    getNext: function () {
        this._command = this.getCommand(this.index(1));
        return this._command;
    },
    toString: function () {
        return JSON.stringify(this._commands);
    },
    /*
    * Saves to local storage
    */
    save: function () {
        if (typeof (localStorage) != 'undefined')
            localStorage.setItem('zcommands', JSON.stringify(this._commands));
        return this;
    },
    /*
    * Loads from local storage
    */
    load: function () {
        if (typeof (localStorage) != 'undefined') {
            var zc = localStorage.getItem('zcommands', JSON.stringify(this._commands));
            if (typeof (zc) == 'string') {
                eval("this._commands = " + zc);
            }
        }
        return this;
    }
};

/****************************************************
ZCommand v.0.0.2.0.a
Attention: Leave the code within this <script> element unchanged!
*   DISCLAIMER OF WARRANTY
*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
*	Author: Tiago Cardoso
****************************************************/

//Zconsole starts upon the "init" of the 'core' use case. The below overrides the init method
//It could be also the load (which is added for each use-case)
uce('zcommand').ready(function (e) {
    uce('zcommand').setModel(new MCommand())

    /*loads contents from the local storage*/
	        	.object.model.load();

    uce('zcommand').addusecase('push', 'uc_zgestures_inputcommand', function (e) {
        e.data.usecase.log("Pushing command.", e);
        e.data.usecase.object.model.push();
        e.data.usecase.object.model.deleteInput();
        e.data.usecase.log("Current stack is: " + e.data.usecase.object.model.toString(), e);
    })

	            .addusecase('pop', undefined, function (e) {
	                e.data.usecase.log("Poping command.", e);
	                e.data.usecase.object.model.pop();
	                e.data.usecase.log("Current stack is: " + e.data.usecase.object.model.toString(), e);
	            })
	            .addusecase('addinput', undefined, function (e) {
	                e.data.usecase.log("adding input '" + e.usecase.object.model.getKey() + "' from '" + e.usecase.name + "' to current command.", e);
	                e.data.usecase.object.model.addInput(e.usecase.object.model.getKey());
	                e.data.usecase.log("Current Command is now: " + e.data.usecase.object.model.getInput());
	            })

	            .addusecase('getprevious', undefined, function (e) {
	                e.data.usecase.object.model.getPrevious();
	                e.data.usecase.log("Current Command is now: " + e.data.usecase.object.model.getInput());
	            })

	            .addusecase('getnext', undefined, function (e) {
	                e.data.usecase.object.model.getNext();
	                e.data.usecase.log("Current Command is now: " + e.data.usecase.object.model.getInput());
	            })

	            .addusecase('removechar', undefined, function (e) {
	                e.data.usecase.log("removing char of current command '" + e.usecase.object.model.getInput() + "' from '" + e.usecase.name + "'", e);
	                e.data.usecase.object.model.removeLastChar();
	                e.data.usecase.log("Current Command is now: " + e.data.usecase.object.model.getInput());
	            })

	            .addusecase('delete', undefined, function (e) {
	                e.data.usecase.log("deleting current command...", e);
	                e.data.usecase.object.model.deleteInput();
	                e.data.usecase.log("Current Command is now: " + e.data.usecase.object.model.getInput());
	            })
})
