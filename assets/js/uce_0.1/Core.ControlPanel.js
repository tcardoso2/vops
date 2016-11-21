	/****************************************************
	*	USE CASE ENGINE - Core.ControlPanel
	* 	v.0.1.0.0.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 26th-Jul-2012
    * 	26-Jul-2012 (0.1.0.0-a):	Creation of first version
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/

//defining the constructor
function MZControlPanel() { };
//defining the object prototype	
MZControlPanel.prototype = {
	/*	Attributtes - should be created with lowercase first letter */
	controlPanelDOM: undefined,
	isUserInteracting: false,
	libraryName: 'Core.ControlPanel',
	stopPropagation: true,
	touchStart: undefined,
	touchEnd: undefined,
	cursorSensitivity: 0.5
};
//defining the constructor
function VZControlPanel(){};
//defining the object prototype	
VZControlPanel.prototype = {
    silentMode: false,
    init: function () {
        //Do anything here
        $('#container').append('<ul id="controlPanel"> \
				<li id="left">left</li> \
				<li id="right">right</li> \
				<li id="up">up</li> \
				<li id="down">down</li> \
				<li id="a">A</li> \
			</ul>');
    },
};
//defining the constructor
function CZControlPanel(){};
//defining the object prototype	
CZControlPanel.prototype = {
    init: function () {
        //Attaches mouse up and mouse down and tap events (internal);
    },
    addkeyboardcontrol: function (domElement) {
		this.Create(domElement).AddTouchEvents({
			left: [function(event){
					uce('zcpanel').raise('cursorleft');
				},
				function(event){
				}
			],
			right: [function(event){
					uce('zcpanel').raise('cursorright');
				},
				function(event){
				}
			],
			up: [function(event){
					uce('zcpanel').raise('cursorup');
				},
				function(event){
				}
			],
			down: [function(event){
					uce('zcpanel').raise('cursordown');
				},
				function(event){
				}
			],
			a: [function(event){
					uce('zcpanel').raise('commanda');
				},
				function(event){
				}
			]
		});
    },
    keydown: function (e) {
       	switch(MZGestures.getKeyDown(e))
       	{
       		case MZGestures.NONE:
       			return;
       		case MZGestures.ENTER:
				break;
       		case MZGestures.F5:
       			alert('Refresh shortcut key disabled.');
			break;
       		case MZGestures.SHIFT:
       			Core.ControlPanel.selectModeOn = true;
       			break;
       		case MZGestures.ESC:
       			if(MZGestures.isSHIFTDown())
       			{
        			var _cntnr = $('#container');
        			if(_cntnr.is(":visible"))
         			_ccntnr.hide();
         		else
         			_cntnr.show();
        		}
				break;
       		case MZGestures.UP:
       			//alert('Transformar libary em UCE? chamar aqui o keyUp?'); Put this in the events above!
       			$('#up').trigger(this.AllowsTouch()?'touchstart':'mousedown');
				break;
       		case MZGestures.DOWN:
       			$('#down').trigger(this.AllowsTouch()?'touchstart':'mousedown');
				break;
       		case MZGestures.LEFT:
       			$('#left').trigger(this.AllowsTouch()?'touchstart':'mousedown');
				break;
       		case MZGestures.RIGHT:
       			$('#right').trigger(this.AllowsTouch()?'touchstart':'mousedown');
				break;
       		case 90: //Z
       			$('#changeSet').trigger(this.AllowsTouch()?'touchstart':'mousedown');
       			break;
       		case 81: //Q
       			$('#plus').trigger(this.AllowsTouch()?'touchstart':'mousedown');
       			break;
       		case 65: //A
       			$('#a').trigger(this.AllowsTouch()?'touchstart':'mousedown');
       			break;
       		case MZGestures.DEL:
       		case MZGestures.BACKSPACE:
				break;
       			$('#delete').trigger(this.AllowsTouch()?'touchstart':'mousedown');
			default:
				break;
		}
    },
    keyup: function (e) {
       	switch(MZGestures.getKeyUp(e))
       	{
       		case MZGestures.NONE:
       			return;
       		case MZGestures.ENTER:
       			$('#edit').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
       		case MZGestures.SHIFT:
       			Core.ControlPanel.selectModeOn = false;
       			break;
       		case MZGestures.ESC:
				break;
       		case MZGestures.UP:
       			$('#up').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
       		case MZGestures.DOWN:
       			$('#down').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
       		case MZGestures.LEFT:
       			$('#left').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
       		case MZGestures.RIGHT:
       			$('#right').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
       		case 90: //Z
       			$('#changeSet').trigger(this.AllowsTouch()?'touchend':'mouseup');
       			break;
       		case 81: //Q
       			$('#plus').trigger(this.AllowsTouch()?'touchend':'mouseup');
       			break;
       		case 65: //A
       			$('#a').trigger(this.AllowsTouch()?'touchend':'mouseup');
       			break;
       		case MZGestures.DEL:
       		case MZGestures.BACKSPACE:
       			$('#delete').trigger(this.AllowsTouch()?'touchend':'mouseup');
				break;
			default:
				break;
		}					
    },
    cursorup: function (e) {
    },
    cursordown: function (e) {
    },
    cursorleft: function (e) {
    },
    cursorright: function (e) {
    },
	/*	Read-Only Properties */ 
	AllowsTouch: function(){
		return 'ontouchstart' in window;
	},
	AllowsOrientationChange: function(){
		return 'onorientationchange' in window;
	},
	/*	Methods - should be created with uppercase first letter */
	
	/*
	*	Creates a reference to a control Panel, assumes it is an existing <ul> element, <li> are the buttons
	*/
	Create: function(containerId)
	{
		//If no containerId provided, defaults to "controlPanel"
		if(!containerId)
			containerId="controlPanel";
		//Attempts to get the containerId DOM elemnt
		try{
			this.m().controlPanelDOM = document.getElementById(containerId);
			if(this.m().controlPanelDOM == null)
				throw containerId + ' is not a valid DOM element.';
			this.m().controlPanelDOM.className = 'controlPanel';
		}catch(ex)
		{
            alert(this.m().libraryName + '.CreateControlPanel error: ' + (ex.message || ex));
		}
		//Allows chaining
		return this;
	},
	
	/*
	*	Adds touch events to the buttons in the control panel
	*	args contains an object with the key/value pair of the ids of the buttons and their touch-start and touch-end events
	*/
	AddTouchEvents: function(args)
	{
		try{
			//Tests if the arguments exist and are functions
	        //jQuery is used here to assure cross-browser capability and that reference to the custom object is passed
	        if(typeof(args) == 'object')
	        {
	        	for(var arg in args)
	        	{
					if(typeof(args[arg][0]) == 'function')
				        jQuery(this.m().controlPanelDOM).find('#' + arg).bind(this.AllowsTouch()?'touchstart':'mousedown', { object: this.m(), fn: args[arg][0] }, this.OnTouchStart);
			        else
			        	throw 'the 1st arg is not a valid function.'
					if(typeof(args[arg][1]) == 'function')
				        jQuery(this.m().controlPanelDOM).find('#' + arg).bind(this.AllowsTouch()?'touchend':'mouseup', { object: this.m(), fn: args[arg][1] }, this.OnTouchEnd);
			        else
			        	throw 'the 2nd arg is not a valid function.'
	        	}
	        }else
	        {
	        	throw 'args needs to be of object type';
	        }
		}catch(ex)
		{
            alert(this.m().libraryName + '.AddTouchEventserror: ' + (ex.message || ex));
		}
		//Allows chaining
		return this;
	},
	
	/*
	*	Events
	*/
			
	OnTouchStart: function(event)
	{
        event.preventDefault();
        if(event.data.object.stopPropagation == true)
        	event.stopPropagation();
        //Changes directly the DOM object - faster
        this.style.margin="4px";
        //Runs the user's function
        event.data.fn(event);
	},
	OnTouchEnd: function(event)
	{
        event.preventDefault();
        if(event.data.object.stopPropagation == true)
        	event.stopPropagation();
        this.style.margin="0px";
        //Runs the user's function
        event.data.fn(event);
	}
};

	/****************************************************
	*	USE-CASES
	****************************************************/
		uce('zcpanel').ready(function(e) {
        	uce('zcpanel').setModel(new MZControlPanel()).setViewer(new VZControlPanel(),false).setController(new CZControlPanel())
        	
        		//USECASE 1-Init
	            .addusecase('init', undefined, function(e){
		        	e.data.usecase.log("Control Panel initialized.");
	            })
	            .addusecase('addkeyboardcontrol', undefined, function(e){
		        	e.data.usecase.object.controller.addkeyboardcontrol('controlPanel');
	            })
        		//USECASE 2-Key Down
	            .addusecase('keydown', 'uc_zgestures_inputkeydown', function(e){
			        e.data.usecase.log("Detected key down.", e);
		        	e.data.usecase.object.controller.keydown(e);
	            })

        		//USECASE 3-Key Up
	            .addusecase('keyup', 'uc_zgestures_inputkeyup', function(e){
			        e.data.usecase.log("Detected key up.", e);
		        	e.data.usecase.object.controller.keyup(e);
	            })

        		//USECASE 4-Up
	            .addusecase('cursorup', undefined, function(e){
			        e.data.usecase.log("Detected cursor up.", e);
	            })

        		//USECASE 5-Down
	            .addusecase('cursordown', undefined, function(e){
			        e.data.usecase.log("Detected cursor down.", e);
	            })

        		//USECASE 6-Left
	            .addusecase('cursorleft', undefined, function(e){
			        e.data.usecase.log("Detected cursor left.", e);
	            })

        		//USECASE 7-Right
	            .addusecase('cursorright', undefined, function(e){
			        e.data.usecase.log("Detected cursor right.", e);
	            })

        		//USECASE 8-A
	            .addusecase('commanda', undefined, function(e){
			        e.data.usecase.log("Detected Command A.", e);
	            })

        		//USECASE 12-Exit
	            .addusecase('exit', 'uc_core_exit');

	        uce('zcpanel').raise('init');

        	uce('zcpanel').log("Leaving core init.", e);
	 	
	 	});