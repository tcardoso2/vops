	/****************************************************
	*	USE CASE ENGINE - ZCONSOLE
	* 	ZCommand v.0.2.3.1.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 27th-Feb-2010
    * 2-Mar-2011 (0.2.3.2-a):	To-do: include the cursor
    * 1-Mar-2011 (0.2.3.1-a):	Included the MVC Objects here
    * 27-Feb-2011 (0.2.3.0-a):	Added use cases
    *							Separated ZConsole UC from the main file.
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor
	function MZConsole(){};
	//defining the object prototype	
	MZConsole.prototype = {
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
	function VZConsole(){};
	//defining the object prototype	
	VZConsole.prototype = {
		init: function(){
		},
	    getContainer: function(){ 
	    	return (this.container && this.container.length == 1)?this.container:jQuery('body'); 
	    },
	    showStartUpScreen: function(){
			_lp = jQuery('<div id="uni_main">Zeavus console, at ' + this.m().getTimeStarted() + ", <br>browser version: " + navigator.appVersion + '<br><br></div>').addClass('loadPanel');
			this.getContainer().append(_lp);
			this.container = _lp;
		},
	    showOnlineStatus: function(){
			this.getContainer().append(jQuery("<div>Currently online: " + this.m().isOnline() + "</div>"));
		}
	};

	//defining the constructor
	function CZConsole(){};
	//defining the object prototype	
	CZConsole.prototype = {
	    init: function(){
	    	this.m().setTimeStarted();
	        this.v().showStartUpScreen();
	        this.v().showOnlineStatus();
	    },
	    hasLocalStorage: function(){
	    	return (typeof(window.localStorage) == 'object');
	    }
	};


	/****************************************************
	*	USE-CASES
	****************************************************/
		uce('zconsole').ready(function(e) {

			//Sets the MVC structure
        	uce('zconsole').setModel(new MZConsole()).setViewer(new VZConsole()).setController(new CZConsole())
            
	            //1-Init
	            .addusecase('init', undefined, function(e){
		        	e.data.usecase.log("Initializing ZEAVUS console II.", e);
	            })

	            //2-ParseCommand
	            .addusecase('parsecommand', 'uc_zcommand_push', function(e){
	            })

	            //3-ParseGesture
	            .addusecase('parsegesture', 'uc_zgestures_finishgesture', function(e){
	            })

	            //4- Write
	            .addusecase('write', undefined)

	            //5-Read
	            .addusecase('read', undefined)

	            //5-Executing
	            .addusecase('executing', undefined)

	            //6-FinishExecuting
	            .addusecase('finishexecuting', undefined)

	            //7-InstallLocally
	            .addusecase('installlocally', undefined)

	            //8-Push
	            .addusecase('push', undefined)

	            //9-Pop
	            .addusecase('pop', undefined)

	            //10-ServerUpdateStatus
	            .addusecase('serverupdatestatus', undefined)

	            //11-ServerUpdate
	            .addusecase('serverupdate', undefined)

	            //12-ServerFinishUpdate
	            .addusecase('serverfinishupdate', undefined)

	            //13-Idle
	            .addusecase('idle', undefined)

	            //14-Error
	            .addusecase('error', undefined)

	            //15-ServerRead
	            .addusecase('serverread', undefined)

	            //16-ToggleLocalMode
	            .addusecase('togglelocalmode', undefined)

	            //17-Exit
	            .addusecase('exit', undefined, function(e){
		        	e.data.usecase.log("Exiting ZEAVUS console II...", e);
	            }).raise('init')
        });