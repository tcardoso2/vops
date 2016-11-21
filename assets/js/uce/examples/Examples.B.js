	/****************************************************
	*	USE CASE ENGINE - Examples.B
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 16th-Mar-2012
    *   16-Mar-2012 (0.0.0.1-a):	
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor
	function MExampleB(){};
	//defining the object prototype	
	MExampleB.prototype = {
		init: function(){
		},
		isOnline: function(){
			return (navigator && navigator.onLine);
		},
	    setTimeStarted: function(){
	        this._timeStarted = new Date();
	    },
	    getTimeStarted: function(){
	        return this._timeStarted != undefined ? this._timeStarted : '';
	    }
	};

	//defining the constructor
	function VExampleB(){};
	//defining the object prototype	
	VExampleB.prototype = {
		init: function(){
		},
	    getContainer: function(){ 
	    	return (this.container && this.container.length == 1)?this.container:jQuery('body'); 
	    },
	    showOnlineStatus: function(){
			this.getContainer().append(jQuery("<div>Currently online: " + this.m().isOnline() + "</div>"));
		}
	};

	//defining the constructor
	function CExampleB(){};
	//defining the object prototype	
	CExampleB.prototype = {
	    init: function(){
	    	this.m().setTimeStarted();
	    },
	    hasLocalStorage: function(){
	    	return (typeof(window.localStorage) == 'object');
	    }
	};


	/****************************************************
	*	USE-CASES
	****************************************************/
		uce('zexampleb').ready(function(e) {

			//Sets the MVC structure
        	uce('zexampleb').setModel(new MExampleB()).setViewer(new VExampleB()).setController(new CExampleB())
            
	            //1-Init
	            .addusecase('init', undefined, function(e){
		        	e.data.usecase.log("Initializing Example B.", e);
	            })

	            //2-Exit
	            .addusecase('exit', undefined, function(e){
		        	e.data.usecase.log("Exiting Example B...", e);
	            }).raise('init')
        });