	/****************************************************
	*	USE CASE ENGINE - ZCanvas
	* 	ZCanvas v.0.0.1.0.a
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
	//defining the Model constructor
	function MZCanvas(){};
	//defining the object prototype	
	MZCanvas.prototype = {
	    canvas: undefined,
        width: 320,
        height: 460,
        bgColor: "rgb(0,0,0)",
        context: undefined,
        imageData: undefined,
        data: undefined,
        //loop animation
        loopInterval: 50, /*Interval in ms*/
        looping: false,
        loopCallBack: undefined,

        init: function(){
		}
	};

	//defining the View constructor
	function VZCanvas(){};
	//defining the object prototype	
	VZCanvas.prototype = {
		init: function(){
		}
	};

	//defining the Controller constructor
	function CZCanvas(){};
	//defining the object prototype
	CZCanvas.prototype = {
	    init: function () {
	        //this.m().setTimeStarted();
	        //this.v().showStartUpScreen();
	        //this.v().showOnlineStatus();
	    },
	    createCanvas: function (elementId, clearContainer) {
	        //Appends a new canvas element
	        if (!elementId)
	            elementId = 'canvas';
	        var container = uce('zmvc').getViewer().getContainer();
	        //Empties the container if argument is provided for that
	        if (clearContainer)
	            container.empty();
	        this.m().canvas = jQuery('<canvas id="' + elementId + '"></canvas>');
	        container.append(this.m().canvas);
	        this.m().canvas.css({ width: this.m().width, height: this.m().height });

	        //setup the canvas and get it's image data
	        this.m().context = this.m().canvas[0].getContext("2d");
	        this.m().context.fillStyle = this.m().bgColor;
	        this.m().context.fillRect(0, 0, this.m().width, this.m().height);
	        this.m().imageData = this.m().context.getImageData(0, 0, this.m().width, this.m().height);
	        this.m().data = this.m().imageData.data;
	        return this;
	    },
	    startLooping: function () {
	        this.m().looping == true;
	        this.m().loopCallback = setInterval("uce('zcanvas').raise('loop')", this.m().loopInterval);
	        return this;
	    },
	    stopLooping: function () {
	        this.m().looping == false;
	        clearInterval(this.m().loopCallback);
	        return this;
	    }
	};

	/****************************************************
	*	USE-CASES - Use case runs immediately after creation
	****************************************************/
	Core.Canvas = uce('zcanvas').ready(function (e) {

	    //Sets the MVC structure
	    uce('zcanvas').setModel(new MZCanvas()).setViewer(new VZCanvas()).setController(new CZCanvas())

	    //1-Init
	            .addusecase('init', undefined, function (e) {
	                e.data.usecase.log("Initializing ZCanvas.", e);
                    //Creates the canvas
	                e.data.usecase.getController()
                        .createCanvas('canvas', true)
                        .startLooping();
	            })
	    //2-Loop
	            .addusecase('loop', undefined, function (e) {
	            })

	    //3-Exit
	            .addusecase('exit', undefined, function (e) {
	                e.data.usecase.log("Exiting ZCanvas...", e);
	            }).raise('init')
	});