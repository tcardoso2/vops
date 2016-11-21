	/****************************************************
	*	USE CASE ENGINE - Examples.D
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
    *   Credits: Mr. Doob: mrdoob.com/lab/javascript/effects/water/00/
	*	Creation date: 18th-Apr-2012
    *   16-Mar-2012 (0.0.0.1-a):	
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor for the Model
	function MExampleD(){};
	//defining the object prototype
	MExampleD.prototype = {
	    buffer1: [],
	    buffer2: [],
        tempbuffer: [],
	    width: 320,
	    height: 460,
	    pointers: {},
	    quality: 4,
        canvasModel: undefined,
        isUserInteracting: false,
	    size: this.width * this.height,
	    init: function () {
	    }
	};

	//defining the constructor for the View
	function VExampleD(){};
	//defining the object prototype	
	VExampleD.prototype = {
		init: function(){
		}
	};

	//defining the constructor for the controller
	function CExampleD(){};
	//defining the object prototype
	CExampleD.prototype = {
	    init: function () {
	        WIDTH = this.m().width;
	        HEIGHT = this.m().height;
	        SIZE = this.m().size;
	        for (var i = 0; i < SIZE; i++) {
	            buffer1[i] = 0;
	            buffer2[i] = i > WIDTH && i < SIZE - WIDTH && Math.random() > 0.995 ? 255 : 0;
	        }
	    },
	    onDocumentMouseDown: function (event) {
	        var m = uce('zexampled').getModel();
	        event.preventDefault();
	        m.isUserInteracting = true;
	        m.pointers = [[event.clientX / m.quality, event.clientY / m.quality]];
	    },
	    onDocumentMouseMove: function (event) {
	        var m = uce('zexampled').getModel();
	        m.pointers = [[event.clientX / m.quality, event.clientY / m.quality]];
	    },
	    onDocumentMouseUp: function (event) {
	        var m = uce('zexampled').getModel();
	        m.isUserInteracting = false;
	    },
	    onDocumentMouseOut: function (event) {
	        var m = uce('zexampled').getModel();
	        m.isUserInteracting = false;
	    },
	    onDocumentTouchStart: function (event) {
	        var m = uce('zexampled').getModel();
	        m.isUserInteracting = true;
	        event.preventDefault();
	        m.pointers = [];
	        for (var i = 0; i < event.touches.length; i++) {
	            m.pointers.push([event.touches[i].pageX / m.quality, event.touches[i].pageY / m.quality]);
	        }
	    },
	    onDocumentTouchMove: function (event) {
	        var m = uce('zexampled').getModel();
	        event.preventDefault();
	        m.pointers = [];
	        for (var i = 0; i < event.touches.length; i++) {
	            m.pointers.push([event.touches[i].pageX / m.quality, event.touches[i].pageY / m.quality]);
	        }
	    },
	    onDocumentTouchEnd: function (event) {
	        var m = uce('zexampled').getModel();
	        event.preventDefault();
	        m.isUserInteracting = false;
	    },
	    setAlternativeEvents: function () {
	        document.addEventListener('mousedown', this.onDocumentMouseDown, true);
	        document.addEventListener('mousemove', this.onDocumentMouseMove, true);
	        document.addEventListener('mouseup', this.onDocumentMouseUp, true);
	        document.addEventListener('mouseout', this.onDocumentMouseOut, true);

	        document.addEventListener('touchstart', this.onDocumentTouchStart, true);
	        document.addEventListener('touchmove', this.onDocumentTouchMove, true);
	        document.addEventListener('touchend', this.onDocumentTouchEnd, true);
	    },
	    emit: function (x, y) {
	        this.m().buffer1[Math.floor(x) + (Math.floor(y) * this.m().width)] = 255;
	    },
	    loop: function () {
	        if (this.m().canvasModel == undefined)
	            this.m().canvasModel = uce('zcanvas').getModel();

	        if (this.m().isUserInteracting) {
	            var pointers = this.m().pointers;
	            for (var i = 0; i < pointers.length; i++) {
	                this.emit(pointers[i][0], pointers[i][1]);
	            }
	        }
	        var pixel;
	        //var buffer1 = this.m().buffer1;
	        //var buffer2 = this.m().buffer2;
	        WIDTH = this.m().width;
	        HEIGHT = this.m().height;
	        var image = this.m().canvasModel.imageData;
	        var data = image.data;
	        var iMax = (WIDTH * HEIGHT) - WIDTH;
	        for (var i = WIDTH; i < iMax; i++) {
	            pixel = ((this.m().buffer1[i - 1] + this.m().buffer1[i + 1] + this.m().buffer1[i - WIDTH] + this.m().buffer1[i + WIDTH]) >> 1) - this.m().buffer2[i];
	            pixel -= pixel >> 20;
	            this.m().buffer2[i] = pixel;
	            pixel = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;
	            data[(i * 4) + 1] = pixel;
	            data[((i + 1) * 4) + 2] = pixel;
	        }
	        this.m().tempbuffer = this.m().buffer1;
	        this.m().buffer1 = this.m().buffer2;
	        this.m().buffer2 = this.m().tempbuffer;
	        this.m().canvasModel.context.putImageData(image, 0, 0);
	    }
	};


	/****************************************************
	*	USE-CASES
	****************************************************/
	uce('zexampled').ready(function (e) {

	    //Sets the MVC structure
	    uce('zexampled').setModel(new MExampleD()).setViewer(new VExampleD()).setController(new CExampleD())

	    //1-Init
	            .addusecase('init', undefined, function (e) {
	                e.data.usecase.log("Initializing Example D.", e);
	                e.data.usecase.getController().setAlternativeEvents();
	            })

	    //2-Loop
	            .addusecase('loop', 'uc_zcanvas_loop', function (e) {
	                e.data.usecase.log("Looping Example D...", e);
	                e.data.usecase.getController().loop();
	            })

	    //3-Exit
	            .addusecase('exit', undefined, function (e) {
	                e.data.usecase.log("Exiting Example D...", e);
	            }).raise('init');
	        });