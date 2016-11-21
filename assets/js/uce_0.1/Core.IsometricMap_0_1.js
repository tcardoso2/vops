		/****************************************************
		*	MVC
		****************************************************/
		//defining the constructor Model
		function MZisomap() { };
		//defining the object prototype	
		MZisomap.prototype = {
			libraryName: 'Core.IsometricMap',
			property: 500,	//500 pixels per second
			imageObjs: new Array(),
			currentImageObj: undefined,
			currentCoords: { x:0, y:0, z:0 },
			easeCoordsD: { x:0, y:0, z:0 },
			easingAmount: { x:4, y:4, z:2 },
			tilesData: { 
				length: {x:5, y:5, z:0},
				frame: {w:64, h:64},
				transformations: {
					dx: 0,
					dy: 0,
					dz: Math.cos(Math.PI/3)
				},
				rendered: 0,
				processed: 0,
				attemptedProcess: 0
			},
			frame: {
				top: -100,
				bottom: 0,
				left: -64,
				right: -32
			},
			pointer: { x:0, y:0 },
			defaultMapSize: 32,
			init: function(distance){
				if(!distance)
					distance = this.xstep;
				return parseInt(1000*distance/this.speed);
			},
			scrollAmount: 20
		};

		//defining the constructor View
		function VZisomap() { };
		//defining the object prototype	
		var canvas;
		VZisomap.prototype = {
		
			init: function(){
			},
			
			createCanvas: function()
			{
				canvas = this.rootCanvasObj = Core.Canvas.Create('container', 'canvas').GetContext(0);
				return this;
			},
			
			resetCanvas: function()
			{
				this.rootCanvasObj.putImageData(this.m().blank, 0, 0);
				return this;
			},
			
			writeCoordinates: function()
			{
				$('#cursor').text(JSON.stringify(this.m().pointer));
				return this;
			}
		};

		//defining the constructor Controller
		function CZisomap() { };
		//defining the object prototype	
		CZisomap.prototype = {
			
			init: function(){
			},
			
			create: function(){
				//The init should have as less code as possible
				//This initializes all the Core components.
				//this.uc.log('Initializing Core Library... - Push it to other side?')
				//__initCoreLibrary__();
				this.uc.log('Creating canvas...')
				this.v().createCanvas();
				this.resetBlankCanvas();
				this.uc.log('Enabling DOM events...')
				this.enableCanvasDOMEvents();
				this.uc.log('Initializing visual resources...')
				this.initializeVisualResources();
				this.uc.log('Initializing floor map...')
				Core.Scene.Map.InitializeMapFloor(this.m().tilesData.length.x, this.m().tilesData.length.y);
				this.uc.log('Positioning into center of map...')
				this.resetCurrentCoords();
				this.uc.log('Computing model transformation parameters...')
				this.m().tilesData.transformations.dx = this.m().tilesData.frame.w*Math.cos(Math.PI/3);
				this.m().tilesData.transformations.dy = this.m().tilesData.frame.h*Math.cos(Math.PI/3);
				this.m().tilesData.transformations.dz = Math.cos(Math.PI/3);
				this.uc.log('Initializing Frame counter...')
				Core.SceneTools.FPSView.Create();
			    setInterval(Core.SceneTools.FPSView.Loop, 1000);
			    setInterval( function(){
					$('#renderState').text(Core.IsometricMap.m.tilesData.rendered+'/'+Core.IsometricMap.m.tilesData.processed+'/'+Core.IsometricMap.m.tilesData.attemptedProcess+ ' cycles per second (rendered/processed/attemptedRender).');
					$('#renderEfficiency').text('Render efficiency:' + parseInt((Core.IsometricMap.m.tilesData.rendered/Core.IsometricMap.m.tilesData.processed)*100) + '%');
				}, 1000);
				this.uc.log('Initializing loop...')
				this.initializeloop();
			},
			
			resetCurrentCoords: function()
			{
				this.m().currentCoords.x -= parseInt(this.m().tilesData.length.x*this.m().tilesData.frame.w/2-(screen.width/(2*Core.Canvas.quality)));
				this.m().currentCoords.y += screen.height/3;
			},
			
			resetBlankCanvas: function()
			{
				this.m().blank = this.v().rootCanvasObj.getImageData(0, 0, Math.floor(window.innerWidth), Math.floor(window.innerHeight));
			},
			
			enableCanvasDOMEvents: function()
			{
				Core.Canvas.EnableDOMEvents(0, function(ev){
					var _rect = ev.srcElement.getBoundingClientRect();
					Core.IsometricMap.m.pointer.x = ev.clientX - _rect.left;
					Core.IsometricMap.m.pointer.y = ev.clientY - _rect.top;
        			Core.IsometricMap.v.writeCoordinates();
				});
			},
			
			initializeVisualResources: function()
			{
				//Loads the images
				for(var i=0;i<4;i++)
					this.m().imageObjs.push(new Image());
				this.m().imageObjs[0].src = Core.SpriteSheets.Isometric.Nature.fileContents;
				this.m().imageObjs[1].src = Core.SpriteSheets.Isometric.Buildings1.fileContents;
				this.m().imageObjs[2].src = Core.SpriteSheets.Isometric.Buildings2.fileContents;
				this.m().imageObjs[3].src = Core.SpriteSheets.Isometric.Wood_single_1.fileContents;
			},
			
			initializeloop: function()
			{
			    //setInterval(this.loop, 1000);
				// shim layer with setTimeout fallback
				window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame       || 
					  window.webkitRequestAnimationFrame || 
					  window.mozRequestAnimationFrame    || 
					  window.oRequestAnimationFrame      || 
					  window.msRequestAnimationFrame     || 
					  function( callback ){
						window.setTimeout(callback, 1000 / 60);
					  };
				})();
                this.m().currentImageObj = this.m().imageObjs[0];
				//this.m().currentImageObj = this.m().imageObjs[Core.Scene.Map.imageMapAboveFoorObj[1][3]];
				
				(function animloop(){
					  requestAnimFrame(animloop);
					  Core.IsometricMap.c.loop();
				})();
			},
			/*Directional methods*/			
			up: function()
			{
				this.m().easeCoordsD.y = this.m().scrollAmount,
				this.m().currentCoords.y+=this.m().easeCoordsD.y;
			},
			
			down: function()
			{
				this.m().easeCoordsD.y = -this.m().scrollAmount,
				this.m().currentCoords.y+=this.m().easeCoordsD.y;
			},

			left: function()
			{
				this.m().easeCoordsD.x = this.m().scrollAmount,
				this.m().currentCoords.x+=this.m().easeCoordsD.x;
			},

			right: function()
			{
				this.m().easeCoordsD.x = -this.m().scrollAmount,
				this.m().currentCoords.x+= this.m().easeCoordsD.x;
			},

			loop: function()
			{
				var rendered = 0;
				var processed = 0;
				var attemptRendered = 0;
				//Computes easing
				Core.IsometricMap.m.easeCoordsD.y += Core.IsometricMap.m.easeCoordsD.y  > 0 ? -Core.IsometricMap.m.easingAmount.y : Core.IsometricMap.m.easeCoordsD.y < 0 ? Core.IsometricMap.m.easingAmount.y : 0; 
				Core.IsometricMap.m.easeCoordsD.x += Core.IsometricMap.m.easeCoordsD.x  > 0 ? -Core.IsometricMap.m.easingAmount.x : Core.IsometricMap.m.easeCoordsD.x < 0 ? Core.IsometricMap.m.easingAmount.x : 0; 
				Core.SceneTools.FPSView.fps++;
				Core.IsometricMap.v.resetCanvas();
				//Draws in the canvas
				var tx, ty, txd, tyd, sprites, edx;
	    		for(ty = -1; ty < Core.IsometricMap.m.tilesData.length.y; ty++)
	    		{
	    			var broke = false;
		    		for(tx = Core.IsometricMap.m.tilesData.length.x; tx > 0; tx--)
		    		{
						attemptRendered++;
		    			tyd = (ty*Core.IsometricMap.m.tilesData.transformations.dy-tx*Core.IsometricMap.m.tilesData.transformations.dx)*Core.IsometricMap.m.tilesData.transformations.dz;
    					if(tyd > (screen.height/Core.Canvas.quality)-Core.IsometricMap.m.currentCoords.y-Core.IsometricMap.m.frame.bottom)
    						break;
    					if(Core.IsometricMap.m.currentCoords.y+tyd > Core.IsometricMap.m.frame.top)
    					{
			    			txd = tx*Core.IsometricMap.m.tilesData.transformations.dx+ty*Core.IsometricMap.m.tilesData.transformations.dy;
			    			if((txd+Core.IsometricMap.m.currentCoords.x) < Core.IsometricMap.m.frame.left)
			    				break;
							sprites = Core.SpriteSheets.Isometric.Nature.FloorTiles[Core.Scene.Map.imageMapFloorObj[tx-1][ty+1]];
							if(sprites)
							{
								edx = (screen.width/Core.Canvas.quality)-Core.IsometricMap.m.currentCoords.x-Core.IsometricMap.m.frame.right
				    			if(txd < edx)
				    			{
				    				rendered++;
									Core.IsometricMap.v.rootCanvasObj.drawImage(Core.IsometricMap.m.currentImageObj, 
										(sprites[0]*Core.IsometricMap.m.tilesData.frame.w), 
										(sprites[1]*Core.IsometricMap.m.tilesData.frame.h),
										Core.IsometricMap.m.tilesData.frame.w,
										Core.IsometricMap.m.tilesData.frame.h, 
										Core.IsometricMap.m.currentCoords.x - Core.IsometricMap.m.easeCoordsD.x + txd,
										Core.IsometricMap.m.currentCoords.y - Core.IsometricMap.m.easeCoordsD.y + tyd,
										Core.IsometricMap.m.tilesData.frame.w,
										Core.IsometricMap.m.tilesData.frame.h
									);
								}
								else
								{
									if(broke == false)
									{
			    						broke = true;
			    						//Index calculation is too far, recalculate x again to improve performance
			    						tx-=parseInt(0.5+(txd - edx)/(Core.IsometricMap.m.tilesData.frame.w/2));
		    						}
					    			//if(txd > ((screen.width/Core.Canvas.quality)-Core.IsometricMap.m.currentCoords.x-Core.IsometricMap.m.frame.right)*2)
					    			//	break;
								}
							}
						}
						else
						{
							if(broke == false)
							{
	    						broke = true;
	    						//Index calculation is too far, recalculate x to improve performance
	    						tx+=parseInt(((Core.IsometricMap.m.currentCoords.y + tyd + Core.IsometricMap.m.frame.top)/16+(screen.height/Core.IsometricMap.m.tilesData.frame.h)));
    						}
    					}
	    				processed++;
		    		}
		    	}
		    	Core.IsometricMap.m.tilesData.rendered = rendered;
		    	Core.IsometricMap.m.tilesData.processed = processed;
		    	Core.IsometricMap.m.tilesData.attemptedProcess = attemptRendered;
			}
		};


		/****************************************************
		*	USE-CASES
		****************************************************/
			uce('zisomap').ready(function(e) {
				
				uce('zisomap').logInConsole = true;

				uce('zisomap').log('Adding reference to Core.IsometricMap...');
					Core.IsometricMap = uce('zisomap');

				uce('zisomap').log('Creating MVC structure...')
					.setModel(new MZisomap())
					.setViewer(new VZisomap())
					.setController(new CZisomap())
					
				uce('zisomap').log('Done. Adding main control panel...');
				
				uce('zcpanel').raise('addkeyboardcontrol');

				uce('zisomap')
				
					.log('Adding use-cases...')
				
	        		//USECASE 0
		            .addusecase('create', undefined, function(e){
		            })

					.SetRunControllerAutomatically(true)
	        		//USECASE 1
		            .addusecase('up', 'uc_zcpanel_cursorup', function(e){
		            })

	        		//USECASE 2
		            .addusecase('down', 'uc_zcpanel_cursordown', function(e){
		            })

	        		//USECASE 3
		            .addusecase('left', 'uc_zcpanel_cursorleft', function(e){
		            })

	        		//USECASE 4
		            .addusecase('right', 'uc_zcpanel_cursorright', function(e){
		            });

		        uce('zcpanel').raise('init');

			});