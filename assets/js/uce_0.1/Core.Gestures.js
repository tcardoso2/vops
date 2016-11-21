	/****************************************************
	*	USE CASE ENGINE - ZGestures
	* 	ZCommand v.0.1.2.0.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 8th-Mar-2012
    * 18-Jul-2012 (0.1.2.0-a):	Added LEFT and RIGHT.
    * 8-Mar-2012 (0.1.1.0-a):	Separated ZGestures UC from the main file.
    * 							To-do: fix the gestures, if I do one very fast, it seems that after that it does not work.
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/


//defining the constructor
function MInputKeyUp() { };
//defining the object prototype	
MInputKeyUp.prototype = {
    _key: undefined,
    setKey: function (ASCIIcode) {
        this._key = ASCIIcode;
    },
    getKeyASCII: function (ASCIIcode) {
        return this._key;
    },
    getKey: function (ASCIIcode) {
        return String.fromCharCode(this._key);
    }
};

/*
* 	Utils - not to be instantiated
*/
var MKeyUtils = {
    getOriginatingEvent: function (e) {
        evt = e;
        //First goes up in the tree as it can;
        while (evt.parentEvent) {
            evt = evt.parentEvent;
        }
        return evt;
    },
    isUCEvent: function (e) {
        return e.type.indexOf('uc_') == 0;
    },
    getCharFromEvent: function (e) {
        ev = this.getOriginatingEvent(e);
        if (ev.which == null)
            char = String.fromCharCode(ev.keyCode);    // old IE
        else if (ev.which != 0 && ev.charCode != 0)
            char = String.fromCharCode(ev.which);   // All others
        else
            char = ev.keyCode;
        return char;
    },
    eventIsClick: function (e) {
        return this.getOriginatingEvent(e).type == "click";
    },
    eventIsTap: function (e) {
        return this.getOriginatingEvent(e).type == "tap";
    },
    eventIsMouseDown: function (e) {
        return this.getOriginatingEvent(e).type == "mousedown";
    },
    eventIsTouchStart: function (e) {
        return this.getOriginatingEvent(e).type == "touchstart";
    },
    eventIsMouseMove: function (e) {
        return this.getOriginatingEvent(e).type == "mousemove";
    },
    eventIsTouchMove: function (e) {
        return this.getOriginatingEvent(e).type == "touchmove";
    },
    eventIsMouseUp: function (e) {
        return this.getOriginatingEvent(e).type == "mouseup";
    },
    eventIsTouchEnd: function (e) {
        return this.getOriginatingEvent(e).type == "touchend";
    },
    eventIsDoubleClick: function (e) {
        return this.getOriginatingEvent(e).type == "dblclick";
    },
    eventIsDoubleTap: function (e) {
        //Note, not implemented so far
        return this.getOriginatingEvent(e).type == "dblclick";
    },
    eventIsKeyUp: function (e) {
        return this.getOriginatingEvent(e).type == "keyup";
    },
    eventIsKeyDown: function (e) {
        return this.getOriginatingEvent(e).type == "keydown";
    }
};


/*
*	High-Level Models
*/
//defining the constructor
//function MZGestures (){};
//defining the object prototype	
var MZGestures = {
    /*
    *	Does all-in-one. Checks if the event is a key down event and extracts the key, 
    *	into a code (pseudo-enumerador) which can be used in a switch
    */
    NONE: -1,
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAUSE: 19,
    CAPSLK: 20,
    ESC: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    INS: 45,
    DEL: 46,
    WINDOW: 91,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    NUMLK: 144,
    keystates: {
        SHIFTDOWN: false,
        CTRLDOWN: false,
        ALTDOWN: false,
        FINGERDOWN: [ /*Let's assume a max of 10 fingers can be used*/
				false, false, false, false, false, false, false, false, false, false
			]
    },
    lastSwipe: [],
    //consecutive events which must exist before a touchmove can be considered a swipe, for swipeStart and swipeEnd
    swipeTresholds: {
        start: {
            minEvents: 4,
            minTimeMs: 0,
            minDistPx: 0
        },
        end: {
            minEvents: 5,
            maxEvents: 500,
            minTimeMs: 50,
            maxTimeMs: 20000,
            minDistPx: 20,
            maxDistPx: 50000
        }
    },
    swipeEnable: true,
    isIndexed: function (ASCIIcode) {
        for (var ac in this)
            if (typeof (this[ac]) == 'number' && ASCIIcode == this[ac])
                return true;
        return false;
    },
    isValid: function (ASCIIcode) {
        //for now returns the opposite of isIndexed, but this should be changed in the future
        return !this.isIndexed(ASCIIcode);
    },
    isSHIFTDown: function () {
        return this.keystates.SHIFTDOWN == true;
    },
    isCTRLDown: function () {
        return this.keystates.CTRLDOWN == true;
    },
    isALTDown: function () {
        return this.keystates.ALTDOWN == true;
    },
    isTap: function (e) {
        return MKeyUtils.eventIsClick(e) || MKeyUtils.eventIsTap(e);
    },
    isDoubleTap: function (e) {
        return MKeyUtils.eventIsDoubleClick(e) || MKeyUtils.eventIsDoubleTap(e);
    },
    isFingerDown: function (e) {
        result = MKeyUtils.eventIsMouseDown(e) || MKeyUtils.eventIsTouchStart(e);
        if (result) { ++this.keystates.FINGERDOWN[0] };
        return result;
    },
    isFingerUp: function (e) {
        result = MKeyUtils.eventIsMouseUp(e) || MKeyUtils.eventIsTouchEnd(e);
        if (result) { --this.keystates.FINGERDOWN[0] };
        return result;
    },
    isFingerMove: function (e) {
        return MKeyUtils.eventIsMouseMove(e) || MKeyUtils.eventIsTouchMove(e);
    },
    isSwipe: function (e) {
        return this.keystates.FINGERDOWN[0] && this.isFingerMove(e) && this.swipeEnable == true;
    },
    isSwipeMove: function (e) {
        return this.isSwipe(e) && (this.lastSwipe.length >= this.swipeTresholds.start.minEvents);
    },
    isSwipeEnd: function (e) {
        return !this.keystates.FINGERDOWN[0] && this.swipeEnable == true && (this.lastSwipe.length >= this.swipeTresholds.end.minEvents);
    },
    push2Swipe: function (e) {
        if (this.swipeEnable == true)
            this.lastSwipe.push(e);
    },
    clearSwipe: function (e) {
        this.lastSwipe = [];
        this.swipeEnable = true;
        return this;
    },
    getKeyDown: function (e) {
        if (MKeyUtils.eventIsKeyDown(e)) {

            //Identifies which key was this
            var k = MKeyUtils.getCharFromEvent(e);
            //If it is a state key, changes state
            switch (k) {
                case this.SHIFT:
                    this.keystates.SHIFTDOWN = true;
                    break;
                case this.CTRL:
                    this.keystates.CTRLDOWN = true;
                    break;
                case this.ALT:
                    this.keystates.ALTDOWN = true;
                    break;
                default:
                    break;
            }
            return k;

        }
        else

            return -1;
    },
    getKeyUp: function (e) {

        if (MKeyUtils.eventIsKeyUp(e)) {

            //Identifies which key was this
            //Identifies which key was this
            var k = MKeyUtils.getCharFromEvent(e);
            //If it is a state key, changes state
            switch (k) {
                case this.SHIFT:
                    this.keystates.SHIFTDOWN = false;
                    break;
                case this.CTRL:
                    this.keystates.CTRLDOWN = false;
                    break;
                case this.ALT:
                    this.keystates.ALTDOWN = false;
                    break;
                default:
                    break;
            }
            return k;

        }
        else

            return -1;
    }
};
//defining the constructor
//function VZGestures (){};
//defining the object prototype	
var VZGestures = {
    silentMode: false,
    init: function () {
        //Do anything here
    },
    deletePoints: function () {
        if (this.lastInterval) {
            clearInterval(this.lastInterval);
            this.Interval = undefined;
            jQuery('.swipe_point').remove();
        }
    },
    showPoints: function (arraySwipe, deleteTS) {
        //first, deletes any existing points
        this.deletePoints();
        if (!this.silentMode) {
            for (var swpt in arraySwipe) {
                _oe = MKeyUtils.getOriginatingEvent(arraySwipe[swpt]);
                bgcolor = (arraySwipe[swpt].type == 'uc_zgestures_swipe' ? 'red' :
						(arraySwipe[swpt].type == 'uc_zgestures_swipemove' ? 'green' :
							(arraySwipe[swpt].type == 'uc_zgestures_swipeend' ? 'orange' : 'red')
						)
					);
                jQuery("<div class='swipe_point'></div>").css({ left: _oe.pageX, top: _oe.pageY, 'background-color': bgcolor }).appendTo(jQuery('body'));
            }
        }
    },
    showMultiPoints: function (arraySwipe, deleteTS) {
        //first, deletes any existing points
        this.deletePoints();
        if (!this.silentMode) {
            for (var swpt in arraySwipe) {
                _oe = MKeyUtils.getOriginatingEvent(arraySwipe[swpt]);
                bgcolor = (arraySwipe[swpt].type == 'uc_zgestures_swipe' ? 'red' :
						(arraySwipe[swpt].type == 'uc_zgestures_swipemove' ? 'green' :
							(arraySwipe[swpt].type == 'uc_zgestures_swipeend' ? 'orange' : 'red')
						)
					);
                //"targetTouches" would show just the fingers on the same target
                //"changedTouches" a list of fingers which changed in the current event, e.g. the finger removed
                //Use the .original event for iphone:
                //metaKey: bool
                //shiftKey: bool
                //targetTouches: Object TouchList
                //scale: (defined int)
                //ctrlKey: bool
                //changedTouches: Object TouchList
                //rotation: 0
                //touches: Object TouchList
                //altKey: bool
                //PageY, PageX, layerX, layerY
                //charCode:0
                //view: Object DOMWindow
                //which: 0
                //keyCode: 0
                //detail: ?0
                //returnValue: bool
                //timeStamp:
                //eventPhase: int
                //target: DIV
                //defaultPrevented: bool
                //srcElement: DIV
                //type:
                //clipboardData: undefined;
                //cancelable: bool
                //currentTarget: null
                //bubbles: bool
                //cancelBubble: bool
                //initTouchEvent
                //initUIEventfunction: initUIEvent
                //stopPropatation
                //preventDefault;
                //MOUSEOUT: 8
                //FOCUS: 4096
                //CHANGE: 32768
                //initEventfunction
                //MOUSEMOVE: 16
                //AT_TARGET: 2
                //SELECT: 16384
                //BLUR: 8192
                //KEYUP: 512
                //MOUSEDOWN: 1
                //MOUSEDRAG: 32
                //BUBBLING_PHASE: 3
                //MOUSEUP: 2
                //CAPTURING_PHASE: 1
                //MOUSEOVER: 4
                //CLICK: 64
                //DBLCLICK: 128;
                //KEYDOWN: 256
                //KEYPRESS: 1024
                //DRAGDROP: 2048
                //stopImmediatePropagation
                var touch;
                if (_oe.originalEvent && _oe.originalEvent.touches && _oe.originalEvent.touches.length > 1) {
                    for (var i = 0; i < _oe.originalEvent.touches.length; i++) {
                        touch = _oe.originalEvent.touches[i] || _oe.originalEvent.changedTouches[i];
                        jQuery("<div class='swipe_point'></div>").css({ left: touch.pageX, top: touch.pageY, 'background-color': bgcolor }).appendTo(jQuery('body'));
                        //Processes the multi touches
                        //Might want to use standard Javascript for performance issues
                    }
                }
                else {
                    //Simply processes as one single touch
                    //Might want to use standard Javascript for performance issues
                    jQuery("<div class='swipe_point'></div>").css({ left: _oe.pageX, top: _oe.pageY, 'background-color': bgcolor }).appendTo(jQuery('body'));
                }
            }
        }
    },
    showPointsAndHide: function (arraySwipe, deleteTS) {
        this.showMultiPoints(arraySwipe);
        if (typeof (deleteTS) == 'number')
            this.lastInterval = setTimeout('VZGestures.deletePoints()', deleteTS);
    }
};
//defining the constructor
//function CZGestures (){};
//defining the object prototype	
var CZGestures = {
    init: function () {
        //Attaches mouse up and mouse down and tap events (internal);
    },
    input: function (e) {
        //Should use the object instance instead!
        var _oe = MKeyUtils.getOriginatingEvent(e);
        if (MZGestures.isFingerDown(e)) {
            MZGestures.clearSwipe();
            MZGestures.lastSwipe = new Array();
            MZGestures.swipeEnable = true;
        }
        else if (MZGestures.isFingerUp(e)) {
        }
        if (MZGestures.isSwipe(e)) {
            e.data.usecase.log(_oe.type + '-' + _oe.pageX + 'x' + _oe.pageY);
            if (MZGestures.isSwipeMove(e))
                e.data.usecase.raise('swipemove', undefined, e);
            else
                e.data.usecase.raise('swipe', undefined, e);
        }
        if (MZGestures.isSwipeEnd(e)) {
            e.data.usecase.raise('swipeend', undefined, e);
            MZGestures.swipeEnable = false;
        }
        else if (MZGestures.isDoubleTap(e)) {
            //raises the event, but as the parent, information on the original event must be passed
            //all the events below behave the same way
            e.data.usecase.raise('dbltap', undefined, e);
        }
        else if (MZGestures.isTap(e))
            e.data.usecase.raise('tap', undefined, e);
        else if (MKeyUtils.eventIsKeyDown(e))
            e.data.usecase.raise('inputkeydown', undefined, e);
        else if (MKeyUtils.eventIsKeyUp(e))
            e.data.usecase.raise('inputkeyup', undefined, e);
    }
};






//Improve this!!!!!!!!!!!!!!!!!


	//defining the constructor
	function MZGestures2 (){};
	//defining the object prototype	
	MZGestures2.prototype = {
		/*
		*	Does all-in-one. Checks if the event is a key down event and extracts the key, 
		*	into a code (pseudo-enumerador) which can be used in a switch
		*/
		NONE: -1,
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		PAUSE: 19,
		CAPSLK: 20,
		ESC: 27,
		PAGEUP: 33,
		PAGEDOWN: 34,
		END: 35,
		HOME: 36,
		UP: 38,
		DOWN: 40,
		INS: 45,
		DEL: 46,
		WINDOW: 91,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		NUMLK: 144,
		keystates: {
			SHIFTDOWN: false,
			CTRLDOWN: false,
			ALTDOWN: false,
			FINGERDOWN: [ /*Let's assume a max of 10 fingers can be used*/
				false,false,false,false,false,false,false,false,false,false
			]
		},
		lastSwipe: [],
		//consecutive events which must exist before a touchmove can be considered a swipe, for swipeStart and swipeEnd
		swipeTresholds: {
			start: {
				minEvents: 4,
				minTimeMs: 0,
				minDistPx: 0
			},
			end: {
				minEvents: 5,
				maxEvents: 500,
				minTimeMs: 50,
				maxTimeMs: 20000,
				minDistPx: 20,
				maxDistPx: 50000
			}
		},
		swipeEnable: true,
		isIndexed: function(ASCIIcode)
		{
			for(var ac in this)
				if(typeof(this[ac]) == 'number' && ASCIIcode == this[ac])
					return true;
			return false;
		},
		isValid: function(ASCIIcode)
		{
			//for now returns the opposite of isIndexed, but this should be changed in the future
			return !this.isIndexed(ASCIIcode);
		},
		isSHIFTDown: function()
		{
			return this.keystates.SHIFTDOWN == true;
		},
		isCTRLDown: function()
		{
			return this.keystates.CTRLDOWN == true;
		},
		isALTDown: function()
		{
			return this.keystates.ALTDOWN == true;
		},
		isTap: function(e){
			return MKeyUtils.eventIsClick(e) || MKeyUtils.eventIsTap(e);
		},
		isDoubleTap: function(e){
			return MKeyUtils.eventIsDoubleClick(e) || MKeyUtils.eventIsDoubleTap(e);
		},
		isFingerDown: function(e){
			result = MKeyUtils.eventIsMouseDown(e) || MKeyUtils.eventIsTouchStart(e);
			if(result) { ++this.keystates.FINGERDOWN[0]};
			return result;
		},
		isFingerUp: function(e){
			result = MKeyUtils.eventIsMouseUp(e) || MKeyUtils.eventIsTouchEnd(e);
			if(result) { --this.keystates.FINGERDOWN[0]};
			return result;
		},
		isFingerMove: function(e){
			return MKeyUtils.eventIsMouseMove(e) || MKeyUtils.eventIsTouchMove(e);
		},
		isSwipe: function(e){
			return this.keystates.FINGERDOWN[0] && this.isFingerMove(e) && this.swipeEnable == true;
		},
		isSwipeMove: function(e){
			return this.isSwipe(e) && (this.lastSwipe.length >= this.swipeTresholds.start.minEvents);
		},
		isSwipeEnd: function(e){
			return !this.keystates.FINGERDOWN[0] && this.swipeEnable == true && (this.lastSwipe.length >= this.swipeTresholds.end.minEvents);
		},
		push2Swipe: function(e){
			if(this.swipeEnable == true)
				this.lastSwipe.push(e);
		},
		clearSwipe: function(e){
			this.lastSwipe = [];
			this.swipeEnable = true;
			return this;
		},
		getKeyDown: function(e){
			if(MKeyUtils.eventIsKeyDown(e)){

	        	//Identifies which key was this
	        	var k = MKeyUtils.getCharFromEvent(e);
	        	//If it is a state key, changes state
	        	switch(k)
	        	{
	        		case this.SHIFT:
	        			this.keystates.SHIFTDOWN = true;
	        			break;
	        		case this.CTRL:
	        			this.keystates.CTRLDOWN = true;
	        			break;
	        		case this.ALT:
	        			this.keystates.ALTDOWN = true;
	        			break;
	        		default:
	        			break;
	        	}
	        	return k;
	        	
	        }
	        else
	        
	        	return -1;
		},
		getKeyUp: function(e){

			if(MKeyUtils.eventIsKeyUp(e)){

	        	//Identifies which key was this
	        	//Identifies which key was this
	        	var k = MKeyUtils.getCharFromEvent(e);
	        	//If it is a state key, changes state
	        	switch(k)
	        	{
	        		case this.SHIFT:
	        			this.keystates.SHIFTDOWN = false;
	        			break;
	        		case this.CTRL:
	        			this.keystates.CTRLDOWN = false;
	        			break;
	        		case this.ALT:
	        			this.keystates.ALTDOWN = false;
	        			break;
	        		default:
	        			break;
	        	}
	        	return k;
	        	
	        }
	        else
	        
	        	return -1;
		}
	};
	//defining the constructor
	function VZGestures2(){};
	//defining the object prototype	
	VZGestures2.prototype = {
		silentMode: false,
		init: function(){
			//Do anything here
		},
		deletePoints: function()
		{
			if(this.lastInterval)
			{
				clearInterval(this.lastInterval);
				this.Interval = undefined;
				jQuery('.swipe_point').remove();
			}
		},
		showPoints: function(arraySwipe, deleteTS)
		{
			//first, deletes any existing points
			this.deletePoints();
			if(!this.silentMode)
			{
				for(var swpt in arraySwipe)
				{
					_oe = MKeyUtils.getOriginatingEvent(arraySwipe[swpt]);
					bgcolor = (arraySwipe[swpt].type == 'uc_zgestures_swipe'? 'red' : 
						(arraySwipe[swpt].type == 'uc_zgestures_swipemove'? 'green' :
							(arraySwipe[swpt].type == 'uc_zgestures_swipeend'? 'orange' : 'red')
						)
					);
					jQuery("<div class='swipe_point'></div>").css({left: _oe.pageX, top: _oe.pageY, 'background-color': bgcolor}).appendTo(jQuery('body'));
				}
			}
		},
		showMultiPoints: function(arraySwipe, deleteTS)
		{
			//first, deletes any existing points
			this.deletePoints();
			if(!this.silentMode)
			{
				for(var swpt in arraySwipe)
				{
					_oe = MKeyUtils.getOriginatingEvent(arraySwipe[swpt]);
					bgcolor = (arraySwipe[swpt].type == 'uc_zgestures_swipe'? 'red' : 
						(arraySwipe[swpt].type == 'uc_zgestures_swipemove'? 'green' :
							(arraySwipe[swpt].type == 'uc_zgestures_swipeend'? 'orange' : 'red')
						)
					);
					//"targetTouches" would show just the fingers on the same target
					//"changedTouches" a list of fingers which changed in the current event, e.g. the finger removed
					//Use the .original event for iphone:
					//metaKey: bool
					//shiftKey: bool
					//targetTouches: Object TouchList
					//scale: (defined int)
					//ctrlKey: bool
					//changedTouches: Object TouchList
					//rotation: 0
					//touches: Object TouchList
					//altKey: bool
					//PageY, PageX, layerX, layerY
					//charCode:0
					//view: Object DOMWindow
					//which: 0
					//keyCode: 0
					//detail: ?0
					//returnValue: bool
					//timeStamp:
					//eventPhase: int
					//target: DIV
					//defaultPrevented: bool
					//srcElement: DIV
					//type:
					//clipboardData: undefined;
					//cancelable: bool
					//currentTarget: null
					//bubbles: bool
					//cancelBubble: bool
					//initTouchEvent
					//initUIEventfunction: initUIEvent
					//stopPropatation
					//preventDefault;
					//MOUSEOUT: 8
					//FOCUS: 4096
					//CHANGE: 32768
					//initEventfunction
					//MOUSEMOVE: 16
					//AT_TARGET: 2
					//SELECT: 16384
					//BLUR: 8192
					//KEYUP: 512
					//MOUSEDOWN: 1
					//MOUSEDRAG: 32
					//BUBBLING_PHASE: 3
					//MOUSEUP: 2
					//CAPTURING_PHASE: 1
					//MOUSEOVER: 4
					//CLICK: 64
					//DBLCLICK: 128;
					//KEYDOWN: 256
					//KEYPRESS: 1024
					//DRAGDROP: 2048
					//stopImmediatePropagation
					var touch;
					if(_oe.originalEvent && _oe.originalEvent.touches && _oe.originalEvent.touches.length > 1)
					{
						for(var i=0;i<_oe.originalEvent.touches.length;i++)
						{
							touch = _oe.originalEvent.touches[i] || _oe.originalEvent.changedTouches[i];
							jQuery("<div class='swipe_point'></div>").css({left: touch.pageX, top: touch.pageY, 'background-color': bgcolor}).appendTo(jQuery('body'));
							//Processes the multi touches
							//Might want to use standard Javascript for performance issues
						}
					}
					else
					{
						//Simply processes as one single touch
						//Might want to use standard Javascript for performance issues
						jQuery("<div class='swipe_point'></div>").css({left: _oe.pageX, top: _oe.pageY, 'background-color': bgcolor}).appendTo(jQuery('body'));
					}
				}
			}
		},
		showPointsAndHide: function(arraySwipe, deleteTS)
		{
			this.showMultiPoints(arraySwipe);
			if(typeof(deleteTS) == 'number')
				this.lastInterval = setTimeout('VZGestures.deletePoints()',deleteTS);
		}
	};
	//defining the constructor
	function CZGestures (){};
	//defining the object prototype	
	CZGestures.prototype = {
		init: function(){
			//Attaches mouse up and mouse down and tap events (internal);
		},
		input: function(e){
			//Should use the object instance instead!
	  		var _oe = MKeyUtils.getOriginatingEvent(e);
	        if(MZGestures.isFingerDown(e))
	       	{
	        	MZGestures.clearSwipe();
	        	MZGestures.lastSwipe = new Array();
				MZGestures.swipeEnable = true;
	        }
	       	else if(MZGestures.isFingerUp(e))
	       	{
	        }
	       	if(MZGestures.isSwipe(e))
	       	{
	        	e.data.usecase.log(_oe.type + '-' + _oe.pageX + 'x' + _oe.pageY);
	          	if(MZGestures.isSwipeMove(e))
		        	e.data.usecase.raise('swipemove', undefined, e);
	          	else
		        	e.data.usecase.raise('swipe', undefined, e);
	        }
	       	if(MZGestures.isSwipeEnd(e))
	       	{
	        	e.data.usecase.raise('swipeend', undefined, e);
				MZGestures.swipeEnable = false;
	        }
	       	else if(MZGestures.isDoubleTap(e))
	        {
	        	//raises the event, but as the parent, information on the original event must be passed
	        	//all the events below behave the same way
	        	e.data.usecase.raise('dbltap', undefined, e);
	        }
	       	else if(MZGestures.isTap(e))
	        	e.data.usecase.raise('tap', undefined, e);
	        else if(MKeyUtils.eventIsKeyDown(e))
	        	e.data.usecase.raise('inputkeydown', undefined, e);
	        else if(MKeyUtils.eventIsKeyUp(e))
	        	e.data.usecase.raise('inputkeyup', undefined, e);
		}
	};
	/*	//defining the constructor
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
	};*/


	/****************************************************
	*	USE-CASES
	****************************************************/
	uce('zgestures').ready(function (e) {
	    uce('zgestures').setModel(MZGestures).setViewer(VZGestures, false).setController(CZGestures)

	    //.setModel(new MZGestures()).setViewer(new VZGestures(),false).setController(new CZGestures())

	    //USECASE 1-Init
	            .addusecase('init', undefined, function (e) {
	                e.data.usecase.log("Running the init status.", e);
	            })
	    //USECASE 2-Input
	            .addusecase('input', 'uc_core_input', function (e) {
	                //To-do: The following should be under the Gestures controller
	                var _oe = MKeyUtils.getOriginatingEvent(e);
	                if (MZGestures.isFingerDown(e)) {
	                    MZGestures.clearSwipe();
	                    MZGestures.lastSwipe = new Array();
	                    MZGestures.swipeEnable = true;
	                }
	                else if (MZGestures.isFingerUp(e)) {
	                }
	                if (MZGestures.isSwipe(e)) {
	                    e.data.usecase.log(_oe.type + '-' + _oe.pageX + 'x' + _oe.pageY);
	                    if (MZGestures.isSwipeMove(e))
	                        e.data.usecase.raise('swipemove', undefined, e);
	                    else
	                        e.data.usecase.raise('swipe', undefined, e);
	                }
	                if (MZGestures.isSwipeEnd(e)) {
	                    e.data.usecase.raise('swipeend', undefined, e);
	                    MZGestures.swipeEnable = false;
	                }
	                else if (MZGestures.isDoubleTap(e)) {
	                    //raises the event, but as the parent, information on the original event must be passed
	                    //all the events below behave the same way
	                    e.data.usecase.raise('dbltap', undefined, e);
	                }
	                else if (MZGestures.isTap(e))
	                    e.data.usecase.raise('tap', undefined, e);
	                else if (MKeyUtils.eventIsKeyDown(e))
	                    e.data.usecase.raise('inputkeydown', undefined, e);
	                else if (MKeyUtils.eventIsKeyUp(e))
	                    e.data.usecase.raise('inputkeyup', undefined, e);
	            })
	    //USECASE 3-Input Command
	            .addusecase('inputcommand', undefined, function (e) {
	                e.data.usecase.log("Received input command from [" + e.type + "]", e);
	                //in this case should not directly raise the event, 
	                //but rather leave the zcommand to catch the event
	                //so, nothing to do here.
	            })
	    //USECASE 4-Tap
	            .addusecase('tap', undefined, function (e) {
	                e.data.usecase.log("Received tap from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "]", e);
	            })

	    //USECASE 5-Double Tap
	            .addusecase('dbltap', undefined, function (e) {
	                e.data.usecase.log("Received double-tap from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "]", e);
	            })

	    //USECASE 6-Swipe
	            .addusecase('swipe', undefined, function (e) {
	                MZGestures.push2Swipe(e);
	                e.data.usecase.log("Received swipe from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "]", e);
	                //To-do, this must use the model instead!
	            })

	    //USECASE 7-SwipeStart
	            .addusecase('swipemove', undefined, function (e) {
	                MZGestures.push2Swipe(e);
	                e.data.usecase.log("Received swipe move from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "]", e);
	                //To-do, this must use the model instead!
	            })

	    //USECASE 8-SwipeEnd
	            .addusecase('swipeend', undefined, function (e) {
	                MZGestures.push2Swipe(e);
	                e.data.usecase.log("Received swipe end from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "], with a total of " + MZGestures.lastSwipe.length + " points.", e);
	                //To-do, this must use the model instead!
	                this.usecase.object.viewer.showPointsAndHide(MZGestures.lastSwipe, 3000);
	            })

	    //USECASE 9-Key Down
	            .addusecase('inputkeydown', undefined, function (e) {

	                //e.data.usecase.log("Received inputkeydown from [" + e.type + "], original event is [" + MKeyUtils.getOriginatingEvent(e).type + "]", e);
	                //Repeats the test if it is a key because it might be mishandled
	                switch (MZGestures.getKeyDown(e)) {
	                    case MZGestures.NONE:
	                        return;
	                    case MZGestures.ENTER:
	                        //raises the event inputcommand directly, instead of broadcasting because it is a specific case
	                        e.data.usecase.raise('inputcommand');
	                        break;
	                    case MZGestures.ESC:
	                        //raises the zcommand delete directly, instead of broadcasting because it is a specific case
	                        uce("zcommand").raise('delete');
	                        break;
	                    case MZGestures.UP:
	                        //raises the zcommand getprevious directly, instead of broadcasting because it is a specific case
	                        uce("zcommand").raise('getprevious');
	                        break;
	                    case MZGestures.DOWN:
	                        //raises the zcommand getnext directly, instead of broadcasting because it is a specific case
	                        uce("zcommand").raise('getnext');
	                        break;
	                    case MZGestures.DEL:
	                    case MZGestures.BACKSPACE:
	                        //raises the zcommand removechar directly, instead of broadcasting because it is a specific case
	                        uce("zcommand").raise('removechar');
	                        break;
	                    default:
	                        e.data.usecase.log("Received input from [" + e.parentEvent.type + "], which received DOM event from [" + e.parentEvent.parentEvent.type + "]", e);
	                        break;
	                }

	            })

	    //USECASE 10-Key Up
	            .addusecase('inputkeyup', undefined, function (e) {

	                //Use a use-case in the zgestures level instead

	                if (MKeyUtils.eventIsKeyUp(e)) {

	                    //Identifies which key was this

	                    c = MKeyUtils.getCharFromEvent(e);

	                    //Do this as a separate event - as part of the API!
	                    e.data.usecase.log("Received input from [" + e.parentEvent.type + "], which received DOM event from [" + e.parentEvent.parentEvent.type + "]", e);
	                    if (!MZGestures.isIndexed(c)) {
	                        //In any other case stores the character as letter
	                        e.data.usecase.object.model.setKey(c);
	                        e.data.usecase.log("Typed: '" + String.fromCharCode(c) + "' (" + c + ")", e);
	                        //and invokes the zcommand addinput event to also store it in the command stack
	                        uce("zcommand").raise('addinput', e.data.usecase);
	                    }
	                }
	            }).setModel(new MInputKeyUp())

	    //USECASE 11-Finish Gesture
	            .addusecase('finishgesture', undefined)

	    //USECASE 12-Exit
	            .addusecase('exit', 'uc_core_exit');

	    uce('zgestures').raise('init');

	    uce('zgestures').log("Leaving core init.", e);

	});
