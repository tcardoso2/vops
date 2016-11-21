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
			currentTileObj : undefined,
			currentImageObj: undefined,
			currentCoords: { x:0, y:0, z:0 },
			easeCoordsD: { x:0, y:0, z:0 },
			easingAmount: { x:4, y:4, z:2 },
			currentTileCoords: { x:0, y:0, z:0 },
			tilesData: { 
				length: {x:10, y:10, z:0},
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
				$('#cursor').text(JSON.stringify(this.m().pointer) + '; tile: ' + JSON.stringify(this.m().currentTileCoords));
				return this;
			},
			
			writeEditMode: function(isEditMode)
			{
				$('#mode').text("Is in edit mode: " + isEditMode);
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
				Core.Canvas.EnableDOMEvents(0, 
					[ 
						{ 
							ev: 'mousemove', fn: function(ev){
								var _rect = ev.srcElement.getBoundingClientRect();
								Core.IsometricMap.m.pointer.x = ev.clientX - _rect.left;
								Core.IsometricMap.m.pointer.y = ev.clientY - _rect.top;
								//convert into normalized iso coordinates
								var _y = parseInt(Core.Math._2DYToIso(
									Core.IsometricMap.m.currentCoords.x,	//pointer to translation x
									Core.IsometricMap.m.currentCoords.y,	//pointer to translation y
									ev.clientX,ev.clientY,
									Core.IsometricMap.m.tilesData.frame.w,
									Core.IsometricMap.m.tilesData.frame.h)
								);
								var _x = parseInt(Core.Math._2DXToIso(
									Core.IsometricMap.m.currentCoords.x,
									Core.IsometricMap.m.currentCoords.y,
									ev.clientX,
									ev.clientY,
									Core.IsometricMap.m.tilesData.frame.w,
									Core.IsometricMap.m.tilesData.frame.h)
								);
								Core.IsometricMap.m.currentTileCoords.x = _x;
								Core.IsometricMap.m.currentTileCoords.y = _y;
        						Core.IsometricMap.v.writeCoordinates();
								Core.Scene.Map.canDraw = Core.Scene.Map.CursorFallsInObject(Core.IsometricMap.m.currentTileCoords,0,0) == false;
								if(Core.Scene.Map.canDraw == false)
									uce('zisomap').raise('object_mouseover');
        					}
						},
						{ 
							ev: 'click', fn: function(ev){
        						Core.IsometricMap.v.writeCoordinates();
        						//Updates the canDraw variable and raises the found event if an object on top exists
								Core.Scene.Map.canDraw = Core.Scene.Map.CursorFallsInObject(Core.IsometricMap.m.currentTileCoords,0,0) == false;
								if(Core.Scene.Map.canDraw == false)
									uce('zisomap').raise('object_found');
        					}
						}
						
					]
				);
			},
			
			initializeVisualResources: function()
			{
				//Loads the images
				for(var i=0;i<6;i++)
					this.m().imageObjs.push(new Image());
				this.m().imageObjs[0].src = Core.SpriteSheets.Isometric.Nature.fileContents;
				this.m().imageObjs[1].src = Core.SpriteSheets.Isometric.Buildings1.fileContents;
				this.m().imageObjs[2].src = Core.SpriteSheets.Isometric.Buildings2.fileContents;
				this.m().imageObjs[3].src = Core.SpriteSheets.Isometric.Wood_single_1.fileContents;
				this.m().imageObjs[4].src = Core.SpriteSheets.Isometric.Scifi.fileContents;
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
				//this.m().currentImageObj = this.m().imageObjs[Core.Scene.Map.imageMapAboveFloorObj[1][3]];
				
				(function animloop(){
					  requestAnimFrame(animloop);
					  Core.IsometricMap.c.loop();
				})();
			},
			/*Directional methods*/			
			up: function()
			{
				var objectFound = !(Core.Scene.Map.CursorFallsInObject(this.m().currentTileCoords,0,-1) == false);
				if(Core.Scene.IsInEditMode())
				{
					Core.Scene.Map.canDraw = !objectFound;
					this.m().currentTileCoords.y--;
				}
				else
				{
					this.m().easeCoordsD.y = this.m().scrollAmount,
					this.m().currentCoords.y+=this.m().easeCoordsD.y;
				}
				this.v().writeCoordinates();
				if(objectFound == true)
				{
					this.uc.raise('object_found');
				}
			},
			
			down: function()
			{
				var objectFound = !(Core.Scene.Map.CursorFallsInObject(this.m().currentTileCoords,0,1) == false);
				if(Core.Scene.IsInEditMode())
				{
					Core.Scene.Map.canDraw = !objectFound;
					this.m().currentTileCoords.y++;
				}
				else
				{
					this.m().easeCoordsD.y = -this.m().scrollAmount,
					this.m().currentCoords.y+=this.m().easeCoordsD.y;
				}
				this.v().writeCoordinates();
				if(objectFound == true)
				{
					this.uc.raise('object_found');
				}
			},

			left: function()
			{
				var objectFound = !(Core.Scene.Map.CursorFallsInObject(this.m().currentTileCoords,-1,0) == false);
				if(Core.Scene.IsInEditMode())
				{
					Core.Scene.Map.canDraw = !objectFound;
					this.m().currentTileCoords.x--;
				}
				else
				{
					this.m().easeCoordsD.x = this.m().scrollAmount,
					this.m().currentCoords.x+=this.m().easeCoordsD.x;
				}
				this.v().writeCoordinates();
				if(objectFound == true)
				{
					this.uc.raise('object_found');
				}
			},
			
			right: function()
			{
				var objectFound = !(Core.Scene.Map.CursorFallsInObject(this.m().currentTileCoords,1,0) == false);
				if(Core.Scene.IsInEditMode())
				{
					Core.Scene.Map.canDraw = !objectFound;
					this.m().currentTileCoords.x++;
				}
				else
				{
					this.m().easeCoordsD.x = -this.m().scrollAmount,
					this.m().currentCoords.x+= this.m().easeCoordsD.x;
				}
				this.v().writeCoordinates();
				if(objectFound == true)
				{
					this.uc.raise('object_found');
				}
			},

			//0.2: Sets the scene into edit mode
			edit: function()
			{
				Core.Scene.SetEditMode(!Core.Scene.IsInEditMode());	
			},

			loop: function()
			{
				//Statistics variables
				var rendered = 0;
				var processed = 0;
				var attemptRendered = 0;
				//Computes easing
				Core.IsometricMap.m.easeCoordsD.y += Core.IsometricMap.m.easeCoordsD.y  > 0 ? -Core.IsometricMap.m.easingAmount.y : Core.IsometricMap.m.easeCoordsD.y < 0 ? Core.IsometricMap.m.easingAmount.y : 0; 
				Core.IsometricMap.m.easeCoordsD.x += Core.IsometricMap.m.easeCoordsD.x  > 0 ? -Core.IsometricMap.m.easingAmount.x : Core.IsometricMap.m.easeCoordsD.x < 0 ? Core.IsometricMap.m.easingAmount.x : 0; 
				Core.SceneTools.FPSView.fps++;
				Core.IsometricMap.v.resetCanvas();
				//Draws in the canvas the floor tiles
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
			    			//Sets the sprite data for the floor tiles
							sprites = Core.SpriteSheets.Isometric.Nature.FloorTiles[Core.Scene.Map.imageMapFloorObj[tx-1][ty+1]];
							if(sprites)
							{
								edx = (screen.width/Core.Canvas.quality)-Core.IsometricMap.m.currentCoords.x-Core.IsometricMap.m.frame.right
				    			if(txd < edx)
				    			{
				    				rendered++;
									Core.IsometricMap.v.rootCanvasObj.drawImage(Core.IsometricMap.m.currentImageObj, /*spritesheet*/
										(sprites[0]*Core.IsometricMap.m.tilesData.frame.w),	/*position x in the spritesheet*/ 
										(sprites[1]*Core.IsometricMap.m.tilesData.frame.h),	/*position y in the spritesheet*/ 
										Core.IsometricMap.m.tilesData.frame.w,
										Core.IsometricMap.m.tilesData.frame.h, 
										Core.IsometricMap.m.currentCoords.x - Core.IsometricMap.m.easeCoordsD.x + txd-/*center in reference map*/Core.IsometricMap.m.tilesData.length.x*Core.IsometricMap.m.tilesData.frame.w/2+(Core.IsometricMap.m.tilesData.length.x%2)*Core.IsometricMap.m.tilesData.frame.w/2,
										Core.IsometricMap.m.currentCoords.y - Core.IsometricMap.m.easeCoordsD.y + tyd-/*center in reference map*/Core.IsometricMap.m.tilesData.frame.h/4,
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
		    	var spriteSheet;
				//0.3: Lays the above floor tiles
                if(Core.Scene.Map.imageMapAboveFloorObj)
                {
	    		    for(ty = 0; ty < Core.Scene.Map.imageMapAboveFloorObj.length; ty++)
	    		    {
	    		    	//Z rotation
			    		var dy = Core.IsometricMap.m.tilesData.frame.h*Math.cos(Math.PI/3);
			    		var dx = Core.IsometricMap.m.tilesData.frame.w*Math.cos(Math.PI/3);
			    		//X rotation
			    		var tzd = Math.cos(Math.PI/3); 

	    			    txd = Core.Scene.Map.imageMapAboveFloorObj[ty].idX*dx+Core.Scene.Map.imageMapAboveFloorObj[ty].idY*dy;
	    			    tyd = (Core.Scene.Map.imageMapAboveFloorObj[ty].idY*dy-Core.Scene.Map.imageMapAboveFloorObj[ty].idX*dx)*tzd-(Core.IsometricMap.m.tilesData.frame.h*tzd)-(Core.Scene.Map.imageMapAboveFloorObj[ty].idZ);

	    			    //Adds a reference to the current AboveMapObject so that it can be used)
	    			    if(this.m().currentTileCoords.x == Core.Scene.Map.imageMapAboveFloorObj[ty].idX && this.m().currentTileCoords.y == Core.Scene.Map.imageMapAboveFloorObj[ty].idY)
	    			    	this.m().currentTileObj = Core.Scene.Map.imageMapAboveFloorObj[ty];

						//Gets the ImageMapObject
						spriteSheet = Core.SpriteSheets.Hash(Core.Scene.Map.imageMapAboveFloorObj[ty].spriteSheet);
					    sprites = spriteSheet.AboveFloorTiles[Core.Scene.Map.imageMapAboveFloorObj[ty].spriteFrameIdx];
					    imageObj = Core.IsometricMap.m.imageObjs[Core.Scene.Map.imageMapAboveFloorObj[ty].spriteSheet];
					    _fmh = sprites.length>3?sprites[3]-Core.IsometricMap.m.tilesData.frame.h:0;
					    _fmw = sprites.length>2?sprites[2]:Core.IsometricMap.m.tilesData.frame.w;
					    //_fmh = sprites.spriteSheet-Core.IsometricMap.m.tilesData.frame.h;
					    //_fmw = sprites.length>2?sprites[2]:Core.IsometricMap.m.tilesData.frame.w;
					    Core.IsometricMap.v.rootCanvasObj.drawImage(imageObj, 
					    	sprites[0]*spriteSheet.frameWidth, 
					    	sprites[1]*spriteSheet.frameHeight, 
					    	sprites.length>3?sprites[2]:Core.IsometricMap.m.tilesData.frame.w, 
					    	sprites.length>3?sprites[3]:Core.IsometricMap.m.tilesData.frame.h, 
						    /*where I draw*/
						    Core.IsometricMap.m.currentCoords.x - Core.IsometricMap.m.easeCoordsD.x + txd - (_fmw/2)+Core.IsometricMap.m.tilesData.frame.w/2,
						    Core.IsometricMap.m.currentCoords.y - Core.IsometricMap.m.easeCoordsD.y + tyd - _fmh -/*center in reference map*/Core.IsometricMap.m.tilesData.frame.h/4,
						    sprites.length>3?sprites[2]:Core.IsometricMap.m.tilesData.frame.w,
						    sprites.length>3?sprites[3]:Core.IsometricMap.m.tilesData.frame.h
						);
				    }
                }
				
				this.v().writeEditMode(Core.Scene.IsInEditMode())
				
				//Shows the edit placeholder, if in edit mode, or if over any object
				if(Core.Scene.IsInEditMode())
				{
					//0.2: draws the Axis reference
					Core.IsometricMap.v.rootCanvasObj.strokeStyle = '#FFFFFF';
					Core.IsometricMap.v.rootCanvasObj.lineWidth = 1;
					Core.IsometricMap.v.rootCanvasObj.beginPath();
					Core.IsometricMap.v.rootCanvasObj.moveTo(this.m().currentCoords.x, this.m().currentCoords.y);
					Core.IsometricMap.v.rootCanvasObj.lineTo(this.m().currentCoords.x,0);
					Core.IsometricMap.v.rootCanvasObj.moveTo(this.m().currentCoords.x, this.m().currentCoords.y);
					Core.IsometricMap.v.rootCanvasObj.lineTo(this.m().currentCoords.x+1000, this.m().currentCoords.y+500);
					Core.IsometricMap.v.rootCanvasObj.moveTo(this.m().currentCoords.x, this.m().currentCoords.y);
					Core.IsometricMap.v.rootCanvasObj.lineTo(this.m().currentCoords.x+1000, this.m().currentCoords.y-500);
					Core.IsometricMap.v.rootCanvasObj.stroke();
				}
				if(Core.Scene.IsInEditMode() || Core.Scene.Map.CursorFallsInObject(Core.IsometricMap.m.currentTileCoords,0,0) != false)
				{
					//Translates the iso coordinates into screen coordinates
					var _x_ = Core.Math.IsoTo2DX(this.m().currentCoords.x, this.m().currentTileCoords.x, this.m().currentTileCoords.y, this.m().tilesData.frame.w, this.m().tilesData.frame.h);//-/*center in reference map*/Core.IsometricMap.m.tilesData.length.x*Core.IsometricMap.m.tilesData.frame.w/2;
					var _y_ = Core.Math.IsoTo2DY(this.m().currentCoords.y, this.m().currentTileCoords.x, this.m().currentTileCoords.y, this.m().tilesData.frame.w, this.m().tilesData.frame.h)-/*center in reference map*/Core.IsometricMap.m.tilesData.frame.h/4;
					//Draws a red placeholder
					Core.Scene.DrawPlaceholder(0,_x_ - Core.IsometricMap.m.easeCoordsD.x ,_y_ - Core.IsometricMap.m.easeCoordsD.y,this.m().tilesData.frame.w,this.m().tilesData.frame.h);
				}
				return;
				//Shows the cursor
				Core.IsometricMap.v.rootCanvasObj.strokeStyle = '#3366DD';
				Core.IsometricMap.v.rootCanvasObj.lineWidth = 2;
				Core.IsometricMap.v.rootCanvasObj.beginPath();
				Core.IsometricMap.v.rootCanvasObj.arc(this.m().pointer.x/Core.Canvas.quality, this.m().pointer.y/Core.Canvas.quality,10,0,2*Math.PI);
				Core.IsometricMap.v.rootCanvasObj.stroke();
			},
			
			object_found: function()
			{
				//Empty by default, don't delete;
			},
			
			object_mouseover: function()
			{
				//Empty by default, don't delete;
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
		            })

	        		//USECASE 5
		            .addusecase('edit', 'uc_zcpanel_commande', function(e){
		            })

					//0.3
	        		//USECASE 6
		            .addusecase('object_found', undefined, function(e){
		            })
		            
		            //0.3
		            //USECASE 7
		            .addusecase('object_mouseover', undefined, function(e){
		            });

		        uce('zcpanel').raise('init');

			});