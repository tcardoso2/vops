//Core Library
var Core = {
	//CANVAS
	Canvas: {
		/*	Attributtes - should be created with lowercase first letter */
		canvasDOM: undefined,
		context: undefined,
		libraryName: 'Core.Canvas',
		quality: 1,

		/*	Methods - should be created with uppercase first letter */

		/*
		*	Creates a canvas element in the containerId, with canvasId, additionally clears the DOM (boolean), if provided
		*/
		Create: function(containerId, canvasId, clearDOM)
		{
			//If no canvasId is provided, defaults to "canvas"
			if(!canvasId)
				canvasId="canvas";
			//Attempts to get the containerId DOM elemnt
			try{
				var c = document.getElementById(containerId);
				if(c == null)
					throw containerId + ' is not a valid DOM element.';
				//Clears the container if true
				if(clearDOM == true)
					c.innerHTML = '';
				//Creates the canvas element
		        this.canvasDOM = document.createElement("canvas");
		        this.canvasDOM.width = Math.floor(window.innerWidth / this.quality);
		        this.canvasDOM.height = Math.floor(window.innerHeight / this.quality);
		        this.canvasDOM.style.width = window.innerWidth + "px";
		        this.canvasDOM.style.height = window.innerHeight + "px";
		        //Appends the DOM canvas element into the specified container
		        c.appendChild(this.canvasDOM);
			}catch(ex)
			{
	            alert(this.libraryName + '.CreateCanvas error: ' + (ex.message || ex));
			}
			//Allows chaining
			return this;
		},

		/*
		*	Gets a new canvas context
		*/
		GetContext: function(type)
		{
			try{
				if(!type)
					type = "2d";
		        this.context = this.canvasDOM.getContext(type);
		        this.context.fillStyle = "rgb(0, 0, 0)";
		        this.context.fillRect(0, 0, this.canvasDOM.width, this.canvasDOM.height);
			}catch(ex)
			{
	            alert(this.libraryName + '.GetContext error: ' + (ex.message || ex));
			}
			//Allows chaining
			return this;
		}
	},
	//CONTROLPANEL
	ControlPanel: {
		/*	Attributtes - should be created with lowercase first letter */
		controlPanelDOM: undefined,
		isUserInteracting: false,
		libraryName: 'Core.ControlPanel',
		stopPropagation: true,
		touchStart: undefined,
		touchEnd: undefined,
		
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
				this.controlPanelDOM = document.getElementById(containerId);
				if(this.controlPanelDOM == null)
					throw containerId + ' is not a valid DOM element.';
				this.controlPanelDOM.className = 'controlPanel';
			}catch(ex)
			{
	            alert(this.libraryName + '.CreateControlPanel error: ' + (ex.message || ex));
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
					        jQuery(this.controlPanelDOM).find('#' + arg).bind('mousedown', { object: this, fn: args[arg][0] }, this.OnTouchStart);
				        else
				        	throw 'the 1st arg is not a valid function.'
						if(typeof(args[arg][1]) == 'function')
					        jQuery(this.controlPanelDOM).find('#' + arg).bind('mouseup', { object: this, fn: args[arg][1] }, this.OnTouchEnd);
				        else
				        	throw 'the 2nd arg is not a valid function.'
		        	}
		        }else
		        {
		        	throw 'args needs to be of object type';
		        }
			}catch(ex)
			{
	            alert(this.libraryName + '.AddTouchEventserror: ' + (ex.message || ex));
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
	},
	//SCENE
	Scene: {
		/*	Attributtes - should be created with lowercase first letter */
		controlPanelDOM: undefined
	},
	//SCENETOOLS (object needs to be instantiated)
	SceneTools: function(){}
};
try{
/*
*	Prototypes (Objects)
*/
Core.SceneTools.prototype = {
	/*	Attributtes - Non-existing, are greated within the methods */
	/*	Methods - should be created with uppercase first letter */
	init: function()
	{
		alert('test');
		//Attributte used to measure frames per second.
		this.fps = 0;
		//Assumes a DOM element exists with the id 'fps'
		this.fpsDOMHTML = document.getElementById('fps');
	},
	/*
	*	To be used as loop for counting the frames rate
	*/
	FPSLoop: function()
	{
	   	this.fpsDOMHTML.innerHTML = this.fps + ' fps';
		this.fps++;
	},
	/*
	*	To be used as loop for counting the frames rate
	*/
	FPSIncrease: function()
	{
	   	this.fpsDOMHTML.innerHTML = this.fps + ' fps';
		this.fps++;
	}
};
}
catch(e){alert('error');};