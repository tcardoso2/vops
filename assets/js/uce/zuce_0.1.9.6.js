	/****************************************************
	 UCE v.0.1.9.6
	 Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
    *   30-Dec-2012 (0.2.0.0):		Added forceNotPreventDefaultOn to allow dom default on a certain event type, same for propagation.
    *   08-Oct-2012 (0.1.9.6):		Added attributes to allow force propagation and allow preventdefault.
    *   10-Sep-2012 (0.1.9.5):		Added code to pass event when controller function is ran automatically.
    *   10-Sep-2012 (0.1.9.4-a):	created uce(...).logInConsole property which allows to log using the console as long as it is true.
    *   24-Apr-2012 (0.1.9.3-a):	Settled async ready load.
    *   24-Apr-2012 (0.1.9.2-a):	Created SetRunControllerAutomatically
    *   18-Apr-2012 (0.1.9.1-a):	Added the "Core" reference. Core is the same as uce('core')
    *                           	Added the getModel, getViewer, and getController methods
	****************************************************/
        var Core = {};
        var _zuce;
	    var Zuce = function(k,p)
	    {
	        //Attributes
	        this.forceAllowPropagation = false;
	        this.forceAllowPropagationOn = '';
	        this.forceNotPreventDefault = false;
	        this.forceNotPreventDefaultOn = '';
	        this.name = k;
	        this.logInConsole = false;
	        //runs automatically controller method with same name of event raised.
	        this.runControllerAutomatically = false;
	        this.parent = k == "[root]" ? undefined : p;
	        this.usecases = new Array();
	        this.triggers = {
	        	before: new Array(),
	        	after: new Array()
	        };
			this.SetRunControllerAutomatically = function(flag)
			{
		        this.runControllerAutomatically = flag;
		        return this;
			};
            this.SetDOMDefaults = function(value)
            {
	            this.forceAllowPropagation = value;
	            this.forceNotPreventDefault = value;
                return this;
            };
	        /*
	        *   HasLocalStorage: Returns true if HTML5 localStorage exists
	        */
	        this.hasLocalStorage = function(){
	        	try{
        	    	return (typeof(window.localStorage) == 'object');
		        } catch (e) {
		            alert('Error executing hasLocalStorage on "' + this.name + '" : ' + (e.message || e));
		        }
	            return false;
            };
	        /*
	        *   GetModel (MVC): Gets the model JSON object for this use-case
	        */
	        this.getModel = function(){
	        	try{
	                if(this.object && this.object.model)
	                    return this.object.model;
		        } catch (e) {
		            alert('Error executing getModel on "' + this.name + '" : ' + (e.message || e));
		        }
	            return false;
            };
	        /*
	        *   SetModel (MVC): Sets the model JSON object for this use-case
	        */
	        this.setModel = function(model){
	        	try{
	                if(this.object && this.object.model)
	                {
	                    //this.object.model = new ObjectFromJSON(model);
	                    this.object.model = model;
	                    //Short call
	                    this.m = model;
	                    if(typeof(this.object.model.init) == 'function')
	                    	this.object.model.init();
	                }
	                else
	                    throw 'Model object does not exist';
		        } catch (e) {
		            alert('Error executing setModel on "' + this.name + '" : ' + (e.message || e));
		        }
	            return this;
	        };
	        /*
	        *   GetViewer (MVC): Gets the viewer JSON object for this use-case
	        */
	        this.getViewer = function(){
	        	try{
	                if(this.object && this.object.viewer)
	                    return this.object.viewer;
		        } catch (e) {
		            alert('Error executing getViewer on "' + this.name + '" : ' + (e.message || e));
		        }
	            return false;
            };
	        /*
	        *   SetViewer (MVC): Sets the viewer JSON object for this use-case
	        */
	        this.setViewer = function(viewer, silentMode){
	        	try{
	                if(this.object && this.object.viewer)
	                {
	                    this.object.viewer = viewer;
	                    //Short call
	                    this.v = viewer;
	                    this.object.viewer.silentMode = silentMode;
	                    //The viewer, additionally has a reference to this use-case object
	                    this.object.viewer.uc = this;
	                    //Also has access to the model object
	                    this.object.viewer.m = function(){
	                    	return this.uc.object.model;
	                    };
	                    if(typeof(this.object.viewer.init) == 'function')
	                    	this.object.viewer.init();
	                }
	                else
	                    throw 'Viewer object does not exist';
		        } catch (e) {
		            alert('Error executing setViewer on "' + this.name + '" : ' + (e.message || e));
		        }
	            return this;
	        };
	        /*
	        *   GetController (MVC): Gets the controller JSON object for this use-case
	        */
	        this.getController = function(){
	        	try{
	                if(this.object && this.object.controller)
	                    return this.object.controller;
		        } catch (e) {
		            alert('Error executing getController on "' + this.name + '" : ' + (e.message || e));
		        }
	            return false;
            };
	        /*
	        *   SetController (MVC): Sets the controller JSON object for this use-case
	        */
	        this.setController = function(controller){
	        	try{
	                if(this.object && this.object.controller)
	                {
	                    this.object.controller= controller;
	                    //Short call
	                    this.c = controller;
	                    //The controller, additionally has a reference to this use-case object
	                    this.object.controller.uc = this;
	                    //Also has access to the model and viewer objects
	                    this.object.controller.m = function(){
	                    	return this.uc.object.model;
	                    };
	                    this.object.controller.v = function(){
	                    	return this.uc.object.viewer;
	                    };
	                    if(typeof(this.object.controller.init) == 'function')
	                    	this.object.controller.init();
	                }
	                else
	                    throw 'Controller object does not exist';
		        } catch (e) {
		            alert('Error executing setController on "' + this.name + '" : ' + (e.message || e));
		        }
	            return this;
	        };
	        /*
	        *   Exists: Checks if a use case exists
	        */
	        this.exists = function(name){
	            for(uc in this.usecases)
	                if(this.usecases[uc].name == name)
	                    return true;
	            return false;
	        };
	        /*  
	        *   GetUseCase: Returns an existing use case
	        */
	        this.getusecase = function(name){
                for(uc in this.usecases)
                    if(this.usecases[uc].name == name)
        	            return this.usecases[uc];
	            return null;
	        };
	        /*
	        *   Implement: Implements an existing use case, meaning it binds the eventType, with the function
	        */
	        this.implement = function(eventType, fn){
	        	try{
	        		if(!fn)
	        			if(this.fn == undefined)
	        				throw 'No function to implement was provided.';
	        			else
	        				fn = this.fn;
		            if(this.exists(eventType))
		            {
			        	//First, resets the before and 	triggers of the use case
			        	this.getusecase(eventType).triggers.before = [ 'onbefore' + eventType ];
			        	this.getusecase(eventType).triggers.after = [ 'onafter' + eventType ];
			        	
			            this.bind('uc_' + this.name + '_' + eventType, { usecase: this, fn: fn, eType: eventType }, function(e){
			            	//First, triggers the 'before' handlers
			            	for(var t in e.data.usecase.getusecase(e.data.eType).triggers.before)
				            	e.data.usecase.raise(e.data.usecase.getusecase(e.data.eType).triggers.before[t], e.data.usecase.getusecase(e.data.eType));
		                    //if set to run the controller with the same name, it runs it
		                    if(e.data.usecase.runControllerAutomatically == true)
		                    {
		                    	eval('e.data.usecase.getController().' + e.data.eType + '(e)');
		                    }
			            	//Then, runs the function
			            	if(typeof(e.data.fn) == 'function')
			            		e.data.fn(e);
			            	//At last, triggers the 'after' handlers
			            	for(var t in e.data.usecase.getusecase(e.data.eType).triggers.after)
				            	e.data.usecase.raise(e.data.usecase.getusecase(e.data.eType).triggers.after[t], e.data.usecase.getusecase(e.data.eType));
			            });
		            }
		            else
						throw 'Use-case named "' + eventType + '" does not exist.';
		        } catch (e) {
		            alert('Error executing implement on "' + this.name + '" : ' + (e.message || e));
		        }
	            //chains to the object instance
	            return this;
	        };
	        /*
	        *   AddUseCase: Adds a Use Case. If fn is present, implements it also
	        */
	        this.addusecase = function(name,bindToEventType,fn,preventPropagation,preventDefault){
	        	try{
		            if(!this.exists(name))
		            {
		                var uc = new Zuce(name, this);
		                this.usecases.push(uc);
	                    this.raise('usecaseadded', uc);
	                    //if the second argument is present, it binds to that DOM event Type (e.g. we might want to bind an 'custominit' event to be triggered when a DOM 'load' happens
	                    if(bindToEventType)
	                        this.bind(bindToEventType, { eventtoraise: 'uc_' + this.name + '_' + name, preventPropagation: preventPropagation, preventDefault: preventDefault }, function(e){
	                            if (e.data.preventPropagation == true && uce('core').forceAllowPropagation == false && e.type != uce('core').forceAllowPropagationOn)
	                        		e.stopPropagation();
	                        	if (e.data.preventDefault == true && uce('core').forceNotPreventDefault == false && e.type != uce('core').forceNotPreventDefaultOn)
	                        		e.preventDefault();
	                            //triggers a new event, but always sends the one which originated it also
	                            jQuery('body').trigger({ 
	                                type: e.data.eventtoraise,
	                                parentEvent: e,
				                    eventSuffix: name
	                            });
	                        });
	                    //If contains function defined, it also implements it
		                if(fn)
		                    this.implement(name, fn);
		            }
		        } catch (e) {
		            alert('Error executing addusecase ' + (e.message || e));
		        }
	            //chains to the object instance
	            return this;
	        };
	        /*
	        *   RemoveUseCase: Removes an existing use case
	        */
	        this.removeusecase = function(name){
	            var _uc = this.getusecase(name);
	            if(_uc!=null)
	            {
	            	//To-do: remove the use case?
	            }
	            //chains to the object instance
	            return this;
	        };
	        /*
	        *   Adds an additional trigger to the use case
	        */
	        this.addtrigger = function(name, newEventType, before){
	            try{
					if(!this.exists(name))
						throw 'Use-case "' + name + '" does not exist in "' + this.name + '"';
			        this.bind('uc_' + this.name + (before == true ? '_onbefore' : '_onafter') + name, { eventsrcname: newEventType }, function(e){
			        	jQuery('body').trigger({
			        		type: e.data.eventsrcname,
			        		usecase: e.usecase
			        	});
			        });
	            } catch (e) {
	                alert("Error in executing 'uce.addtrigger' " + (e.message || e));
	            }
	            //chains to the object instance
	            return this;
	        };
	        /*
	        *   Shorthand for binding a handler (will be binded to the DOM 'body' element)
	        */
	        this.bind = function(arg1, arg2, arg3){
	            try{
	                if(!arg3)
	                    jQuery('body').bind(arg1, { usecase: this }, arg2);
	                else
	                {
	                    if(arg2.usecase == undefined)
	                    	arg2.usecase = this;
	                    jQuery('body').bind(arg1, arg2, arg3);
	                }
	            } catch (e) {
	                alert("Error in executing 'uce.bind' " + (e.message || e));
	            }
	            //chains to the object instance
	            return this;
	        };
	        /*  
	        *   Raises an event of type 'eventType' 
	        *   (always associated with the 'body' 
	        *   object, although the original usecase
	        *   can be passed as argument)
	        */
	        this.raise = function(eventType, usecase, originatingEvent, args){
	            try{
	            	this.log("Will trigger: " + 'uc_' + ( this.name == '[root]' ? '' : this.name + '_' ) + eventType + (usecase? "(" + usecase.name + ")" : ""));
	            	//Attempts to trigger event
	                jQuery('body').trigger({
	                    type: 'uc_' + ( this.name == '[root]' ? '' : this.name + '_' ) + eventType,
	                    usecase: usecase?usecase:this,
	                    eventSuffix: eventType,
	                    parentEvent: originatingEvent,
                        args: args
	                });
	                //additionally, if the use case added is the "ready" use case, attempts to run the "load" function
	                if(usecase && usecase.name == 'ready')
	                    if(typeof(usecase.load) == 'function')
	                        usecase.load();
	            } catch (e) {
	                alert("Error in executing 'uce.raise' on '" + 'uc_' + ( this.name == '[root]' ? '' : this.name + '_' ) + eventType + "': "+ (e.message || e));
	            }
	            //chains to the object instance
	            return this;
	        };
	        /* 
	        *   'ready' function runs after the uc is created, second parameter is true for synchronous call, but for better results should be asynchronous. For asynchronous, ready event comes later
	        *   - fn: the 'ready' callback method to execute
	        *   - syncCall: true, for a synchronous call (this acts immediately, but there might be dependency errors (e.g. scripts not loaded fully or object not loaded fully). By default, the asynchronous call happens, later than the synchronous, only when the object is ready
	        *   - timeOut: optional, if exists, executes only after a certain timeout
	        *   Tiago (16-Feb-2012 )Not ready to use yet...*/
	        this.ready = function(fn, syncCall, timeOut){
	            try{
	            	if(typeof(fn) == "function")
	            	{
	            		if(syncCall && syncCall == true)
	            			setTimeout(fn, timeOut? timeOut : 0);//performs immediate call, can be prune to errors
	            		else
	            		{
	            			this.fn = fn;
	            			setTimeout("uce('" + this.name + "').readyFn()", timeOut? timeOut : 0);
	            		}
	            	}
	            	else
	            		'The function provided is not valid.';
	            } catch (e) {
	                alert("Error in executing 'uce.ready' " + (e.message || e));
	            }
	        };
            this.readyFn = function()
            {
                if($('body').data('events')) 
                { 
                    //var _vv = $('body').data('events');
                    //for(var v in _vv){
                    //    if(_vv[v][0].type.indexOf(this.name) > 0)
                    //    {
                    //    };
                    //}  
                    uce(this.name).implement('ready').raise('ready');
                }
                else
                {
                    setTimeout('uce("' + this.name + '").readyFn()', 1000);
                }
            };
	        //Returns true if the uce can log, meaning, if the query string on the url has "log=uce" in it or "log=<name>"
    		this.canlog = function(e){
	            _urlpath = typeof(window.location) == 'string' ? window.location : window.location.href;
            	/*Logs only events if logscope=events url query string exists, otherwise logs all*/
            	/*Logs only if log=uce url query string exists or "log=xxx", where xxx is the name of the use-case*/
	            return (	            	
	            	((e && _urlpath.toLowerCase().indexOf("logscope=events") > 0) || (!e && _urlpath.toLowerCase().indexOf("logscope=events") < 0))
					&&          	
		            ((_urlpath.toLowerCase().indexOf("log=uce") > 0) || (_urlpath.toLowerCase().indexOf("log=" + this.name.toLowerCase()) > 0)));
	   		};
	        /*
	        *   LOG: Use the following log function only for core logging, this log method adds in the body standard log messages, it might not be what you need
	        */
	        this.log = function(msg,e){
	            try{
	            	if(this.canlog(e))
	            	{
			        	jQuery('body').append('<div><i>' + (new Date().getTime()) + '</i> - [' + (e ? e.data.usecase.name : this.name) + ':' + (e ? e.type : '') + '] ' + msg + '</div>');
			        }
                    if(console && this.logInConsole == true)
                        console.log("[" + (e ? e.data.usecase.name : this.name) + ':' + (e ? e.type : '') + '] ' + msg);
	            } catch (e) {
	                alert("Error in executing 'uce.log' " + (e.message || e));
	            }
	            return this;
	        };
	        //initialization, creates always a 'ready' initial state - uncomment if needed asynchronous behaviour
	        if(this.name != 'ready')
		        setTimeout("uce('" + this.name + "').addusecase('ready')",0);
	    }
		//Wrapper function to accept a JSON and convert it to an instace of it
		var ObjectFromJSON = function(JsonObj)
		{
    		for(var o in JsonObj)
    			this[o] = JsonObj[o];
    	}
		var AllowsTouch = function(){
			return 'ontouchstart' in window;
		}
		var AllowsOrientationChange = function(){
			return 'onorientationchange' in window;
		}
	    var _coreUC = function(){
	        //initialization
			window.addEventListener("online", function(e) {alert("online");}) 
	        uce('core')
	            .addusecase('init', 'pageshow', function(e){
	            	//executes init method if exists
	            	e.data.usecase.log("Initializing core...",e);
	            	if(typeof(e.data.usecase.init) == 'function')
	            		e.data.usecase.init(e);
	            })
	            .addusecase('input', 'keyup keydown' 
	            	+ (AllowsTouch() ? ' tap touchstart touchend touchmove touchcancel' : ' dblclick click mousedown mouseup mousemove')
	            	+ (AllowsOrientationChange() ? ' orientationchange' : ' resize')  , function(e){ 
	            	e.data.usecase.log("Received input from user...[" + MKeyUtils.getOriginatingEvent(e).type + "]",e);
	            	//executes input method if exists
	            	if(typeof(e.data.usecase.input) == 'function')
	            		e.data.usecase.input(e);
	            }, true /*This stops propagation*/, true /*This stops the default trigger*/)
	            .addusecase('online', 'online', function(e){
	            	//executes init method if exists
	            	e.data.usecase.log("application is online.",e);
	            	if(typeof(e.data.usecase.online) == 'function')
	            		e.data.usecase.online(e);
	            })
	            .addusecase('offline', 'offline', function(e){
	            	//executes init method if exists
	            	e.data.usecase.log("application is offline.",e);
	            	if(typeof(e.data.usecase.offline) == 'function')
	            		e.data.usecase.offline(e);
	            })
	            .addusecase('exit', 'pagehide', function(e){ 
	            	e.data.usecase.log("Exiting core...",e);
	            	//executes exit method if exists
	            	if(typeof(e.data.usecase.exit) == 'function')
	            		e.data.usecase.exit(e);
	            })
	            .raise('init'); //raises the init
	        //bind main use cases
	    };
	    
	    function uce(k)
	    {
            try{
                //if the Use Case Engine does not exists, creates it
	            if(_zuce == undefined)
	                _zuce = new Zuce('[root]');
	            //adds the new use case, named with key 'k'
                if(_zuce.exists(k) == false)
                {
                    //Adds the main use-case object
    	            _zuce.addusecase(k);
    	            if(uce(k).parent && uce(k).parent.name == "[root]")
    	            {
                        //Creates the object model, view and controller
    	                eval("_zuce.getusecase('" + k + "').object = {model:{},viewer:{},controller:{}};");
                        //Also creates a direct reference as object method
                        eval("uce." + k.replace(/ /g,'_') + "=uce(k);");
    	            }
     	        }
	        } catch (e) {
	            alert('Fatal error. Press "Refresh button, or F5 Key. Error details are: ' + (e.message || e));
	        }
    	    return _zuce.getusecase(k);
	    }
        //jQuery ready
        //http://api.jquery.com/ready/
        jQuery(document).ready(function(){
            try{
                //creates the 'core' use case by default, and adds it's 3 main usecases
                new _coreUC();
                Core = uce('core');
	        } catch (e) {
	            alert('Error in creating the Core Use Case ' + (e.message || e));
	        }
        });