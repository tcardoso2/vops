	/****************************************************
	*	USE CASE ENGINE - Examples.A
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 27th-Feb-2010
    * 8-Mar-2011 (0.0.0.1-a):	To-do: include the cursor
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor
	function MExampleA(){};
	//defining the object prototype	
	MExampleA.prototype = {
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
	function VExampleA(){};
	//defining the object prototype	
	VExampleA.prototype = {
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
	function CExampleA(){};
	//defining the object prototype	
	CExampleA.prototype = {
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
		uce('zexamplea').ready(function(e) {

			//Sets the MVC structure
        	uce('zexamplea').setModel(new MExampleA()).setViewer(new VExampleA()).setController(new CExampleA())
            
	            //1-Init
	            .addusecase('init', undefined, function(e){
		        	e.data.usecase.log("Initializing Example A.", e);
	            })

	            //2-ShowFinger
	            .addusecase('showfinger', 'uc_zgestures_swipemove', function(e){
	            	_sme = MKeyUtils.getOriginatingEvent(e);
	            	if(_sme.originalEvent.touches)
		            	for(var i=0;i<_sme.originalEvent.touches.length;i++)
		            	{
				        	_te = _sme.originalEvent.touches[i];
				        	fgr = jQuery("#touch__" + i);
				        	if(fgr.length == 0)
				        	{
				        		fgr = jQuery("<div class='swipe_finger' id='touch__" + i + "'></div>");
				        		jQuery('body').append(fgr);
				        	}
    			        	fgr.css({top: _te.pageY-20 + 'px', left: _te.pageX-20 + 'px'});
				        	//e.data.usecase.log("Example A, detected swipemove! " + _sme.originalEvent.type, e);
		            	}
		            else
		            {
			        	_te = _sme.originalEvent;
			        	fgr = jQuery("#touch__" + i);
			        	if(fgr.length == 0)
			        	{
			        		fgr = jQuery("<div class='swipe_finger' id='touch__" + i + "'></div>");
			        		jQuery('body').append(fgr);
			        	}
			        	fgr.css({top: _te.pageY-20 + 'px', left: _te.pageX-20 + 'px'});
		            }
	            })

	            //3-Exit
	            .addusecase('exit', undefined, function(e){
		        	e.data.usecase.log("Exiting ZEAVUS console II...", e);
	            }).raise('init')
        });