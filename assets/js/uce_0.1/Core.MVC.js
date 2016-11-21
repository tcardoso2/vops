	/****************************************************
	*	USE CASE ENGINE - ZMVC
	* 	ZMVC v.0.0.1.0.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 18th-Apr-2012
    *   18-Apr-2012 (0.0.1.0-a):	First draft version
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor
	function MZMVC(){};
	//defining the object prototype	
	MZMVC.prototype = {
        init: function(){
		}
	};

	//defining the constructor
	function VZMVC(){};
	//defining the object prototype	
	VZMVC.prototype = {
		init: function(){
		},
	    getContainer: function(){ 
	    	return (this.container && this.container.length == 1)?this.container:jQuery('body'); 
	    }
	};

	//defining the constructor
	function CZMVC(){};
	//defining the object prototype	
	CZMVC.prototype = {
	    init: function(){
	    }
	};


	/****************************************************
	*	USE-CASES
	****************************************************/
		uce('zmvc').ready(function(e) {

			//Sets the MVC structure
		    uce('zmvc').setModel(new MZMVC()).setViewer(new VZMVC()).setController(new CZMVC())
            
	            //1-Init
	            .addusecase('init', undefined, function(e){
		        	e.data.usecase.log("Initializing ZMVC.", e);
	            })

	            //2-ParseCommand
	            .addusecase('test', undefined, function(e){
	            })

	            //3-Exit
	            .addusecase('exit', undefined, function(e){
		        	e.data.usecase.log("Exiting ZMVC...", e);
	            }).raise('init')
        });