//Core Library
var Core = {
	//CANVAS
	Canvas: {
		/*	Attributtes - should be created with lowercase first letter */
		canvasDOM: new Array(),
		context: new Array(),
		libraryName: 'Core.Canvas',
		quality: 1.5,

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
				//Creates the root canvas element and the top canvas
				for(var cv = 0; cv < 2; cv++)
				{
					this.canvasDOM[cv] = document.createElement("canvas");
					this.canvasDOM[cv].width = Math.floor(window.innerWidth / this.quality);
					this.canvasDOM[cv].height = Math.floor(window.innerHeight / this.quality);
					this.canvasDOM[cv].style.width = window.innerWidth + "px";
					this.canvasDOM[cv].style.height = window.innerHeight + "px";
					//Appends the DOM canvas element into the specified container
					c.appendChild(this.canvasDOM[cv]);
					//push a value into the context array;
					this.context.push({});
				}
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
		GetContext: function(layer, type)
		{
			if(!layer) layer = 0;
			try{
				if(!type)
					type = "2d";
		        this.context[layer] = this.canvasDOM[layer].getContext(type);
		        this.context[layer].fillStyle = "rgb(0, 0, 0)";
		        this.context[layer].fillRect(0, 0, this.canvasDOM[layer].width, this.canvasDOM[layer].height);
			}catch(ex)
			{
	            alert(this.libraryName + '.GetContext error: ' + (ex.message || ex));
			}
			//returns the context;
			return this.context[layer];
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
					        jQuery(this.controlPanelDOM).find('#' + arg).bind(this.AllowsTouch()?'touchstart':'mousedown', { object: this, fn: args[arg][0] }, this.OnTouchStart);
				        else
				        	throw 'the 1st arg is not a valid function.'
						if(typeof(args[arg][1]) == 'function')
					        jQuery(this.controlPanelDOM).find('#' + arg).bind(this.AllowsTouch()?'touchend':'mouseup', { object: this, fn: args[arg][1] }, this.OnTouchEnd);
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
	//SCENETOOLS 
	SceneTools: {
		//FPSView (object needs to be instantiated)
		FPSView: {
			/*	Initialization and attributtes */
			fps: 0,
			fpsDOMHTML: undefined,
	
			/*	Methods - should be created with uppercase first letter */
			Create: function()
			{
				this.fpsDOMHTML = document.getElementById('fps');
			},
			Increase: function()
			{
				this.fps++;
			},
			Loop: function()
			{
			   	this.fpsDOMHTML.innerHTML = Core.SceneTools.FPSView.fps + ' fps';
				Core.SceneTools.FPSView.fps = 0;
			}
		}
	},
	//SPRITESHEETS
	SpriteSheets: {
		Isometric: {
			Nature: {
				src: "sprites/Nature.png",
				frameWidth: 64,
				frameHeight: 64,
				FloorTiles: [
					[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
					[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],
					[0,2],[1,2],[2,2],[3,2]
				],
				AboveFloorTiles: [
					[0,3,64,64],[1,3,64,64],[2,3,64,64],[3,3,64,64],[4,3,64,64],[5,3,64,64],[6,3,64,64],[7,3,64,64],[8,3,64,64],
					[0,4,64,64],[1,4,64,64],[2,4,64,64],[3,4,64,64],
					[0,5,64,64],[1,5,64,64],[2,5,64,64],[3,5,64,64],[4,5,64,64],[5,5,64,64],[6,5,64,64],[7,5,64,64],[8,5,64,64],[9,5,64,64],
					[0,6,64,64],[1,6,64,64],[2,6,64,64],[3,6,64,64],[4,6,64,64],[5,6,64,64],[6,6,64,64],[7,6,64,64],[8,6,64,64],[9,6,64,64],
					[0,7,64,64],[1,7,64,64],[2,7,64,64],[3,7,64,64],[4,7,64,64],[5,7,64,64],[6,7,64,64],[7,7,64,64],[8,7,64,64],[9,7,64,64],
					[0,8,64,64],[1,8,64,64],[2,8,64,64],[3,8,64,64],[4,8,64,64],[5,8,64,64],[6,8,64,64],[7,8,64,64],[8,8,64,64],[9,8,64,64],
					[0,9,64,64],[1,9,64,64],[2,9,64,64],[3,9,64,64],[4,9,64,64],[5,9,64,64],[6,9,64,64],[7,9,64,64],[8,9,64,64],[9,9,64,64],
					[0,10,64,64],[1,10,64,64],[2,10,64,64],
					[0,11,64,64],[1,11,64,64],[2,11,64,64],[3,11,64,64],[4,11,64,64],[5,11,64,64],[6,11,64,64],[7,11,64,64],[8,11,64,64],[9,11,64,64],
					[0,12,64,64],[1,12,64,64],[2,12,64,128],[3,12,64,128],[4,12,64,64],[5,12,64,64],[6,12,64,64],[7,12,64,64],[8,12,64,64],[9,12,64,64],
					[0,13,64,192],[1,13,64,192],[2,14,64,128],[3,14,64,128],[4,14,192,128],[7,13,192,192]
				]
			}
		}
	}
};