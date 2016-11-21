	/****************************************************
	*	USE CASE ENGINE - ZSecurity
	* 	ZSecurity v.0.1.2.0.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 16th-Mar-2012
    * 21-Mar-2011 (0.1.2.0-a):	Integrated login, created loginsuccess event, islogged in and logout. Do Registrationlater (using another example) - example B is over.
    * 20-Mar-2011 (0.1.1.0-a):	Managed to get the key from the server.
    * 17-Mar-2011 (0.1.0.0-a):	Added the zg framework methods. 
    *                           Managed to get response from WCF services with callback jsonP
    *                           Still missing the correct format, see how jQuery sends the ajax request (in the query string)
    *                           also need to change "hitClientReceiver" to true, to disable error message.
    * 16-Mar-2011 (0.0.1.0-a):	First version
	****************************************************/

	/****************************************************
	*	MVC
	****************************************************/
	//defining the constructor
	function MZSecurity(){};
	//defining the object prototype	
	MZSecurity.prototype = {
        librarySource: '_System/_JS/security/aess.js',
        libraryObj: undefined,
        lastError: {
            message: '',
            timeStamp: undefined
        },
		security:
    	/*This should be removed later, in production, but for test purposes it's fine*/
		{
		    k: 'BC122F43FE767A456990789AB3454F29',
		    v: '879FFFE098DE089923424AB4564A4566',
		    /*HTML5 apps cannot access the UDID, so this is a hard-coded example - fine again as long as for test purposes only*/
		    id: 'db5232451a40dc7bff808e29298062a9eef188f8',
		    sessionKey: '',
		    sessionToken: '',
		    serverKey: '',
		    timeDiff: 0,
		    policies: {
		        userDataMinLength: 10
		    },
            lastLoginAttempt: undefined,
            lastLoginTime: undefined
		},
	    communications: {
	        hitClientReceiver: false
	    },
		configuration: {
		    //serverEndPoint: "http://t3dent.com/mlrouter/router/Default.aspx"
		    serverEndPoint: "http://localhost:8222/AuthService.svc/json"
		},
		init: function(){
		},
	    setTimeStarted: function(){
	        this._timeStarted = new Date();
	    },
	    getTimeStarted: function(){
	        return this._timeStarted != undefined ? this._timeStarted : '';
	    },
	    getErrorMessage: function(){
	        return this.lastError.message;
	        if (!keep && keep != true)
	            this.clearErrorMessage();
	    },
	    setErrorMessage: function(message, keep){
	        this.lastError.timeStamp = new Date();
	        this.lastError.message = message;
	    },
	    clearErrorMessage: function(){
	        this.lastError.timeStamp = undefined;
	        this.lastError.message = '';
	    }
	};

	//defining the constructor
	function VZSecurity(){};
	//defining the object prototype	
	VZSecurity.prototype = {
		init: function(){
		},
	    getContainer: function(){ 
	    	return (this.container && this.container.length == 1)?this.container:jQuery('body'); 
	    },
	    showStartUpScreen: function(){
		}
	};

	//defining the constructor
	function CZSecurity(){};
	//defining the object prototype
	CZSecurity.prototype = {
	    init: function () {
	        this.m().setTimeStarted();
	        this.v().showStartUpScreen();
	        this.loadFramework();
	        this.uc.log("Finished loading framework");
	    },
	    hasLocalStorage: function () {
	        return (typeof (window.localStorage) == 'object');
	    },
	    loadFramework: function (which, callback) {
	        //not working;
	        try {
	            if ($LAB) {
	                this.uc.log("Loading framework '" + (which ? which : this.m().librarySource) + "'...");
	                $LAB.script('_System/_JS/utils/Convert.js')
                        .script(which ? which : this.m().librarySource)
                        .wait(callback ? callback : this.callbackLoadFramework());
	            }
	            else
	                throw "$LAB is not present. It was not possible to load security framework.";
	        } catch (ex) {
	            this.uc.log("Error Initializing ZSECURITY: " + (ex.message || ex));
	        }
	    },
	    callbackLoadFramework: function () {
	        try {
	            this.uc.log("Verifying if security framework was properly loaded by encrypting random test data...");
	            //this.uc.log("Result is: " + this.encrypt("This is just some random data...", true));
	            this.uc.log("Result is: " + aes_chain_encrypt(
                    this.m().security.v, this.m().security.k,
                    "This is just some random data...", 1, true, false));
	            this.uc.log("Verification succeeded.");
	            //raises automatically the frameworkReady use-case
	            this.uc.raise('frameworkReady');
	        } catch (ex) {
	            _ms_retry = 200;
	            this.uc.log("Error verifying security framework: " + (ex.message || ex) + ". Retrying in " + _ms_retry + " mseconds...");
	            setTimeout("uce('zsecurity').object.controller.callbackLoadFramework();", _ms_retry);
	        }
	    },
	    prepareDataForEncryption: function (data, isASCII) {
	        try {
	            //Needs to be padded
	            var _g = isASCII == true ? 1 : 2;
	            {
	                while ((data.length % (16 * _g)) != 0) {
	                    data += isASCII == true ? ' ' : '20';
	                }
	            }
	            return data;
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.prepareDataForEncryption: ' + (e.message || e));
	        }
	    },
	    encrypt: function (data, isASCII, key) {
	        try {
	            //Needs to be padded
	            var preparedData = this.prepareDataForEncryption(data, isASCII);
	            return aes_chain_encrypt(
                    this.m().security.v, key ? key : this.m().security.k,
                    preparedData, 1, isASCII, false);
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.encrypt: ' + (ex.message || ex));
	        }
	    },
	    decrypt: function (data, isASCII, key) {
	        try {
	            return aes_chain_decrypt(
                    this.m().security.v, key ? key : this.m().security.k,
                    data, 1, isASCII, true);
	        } catch (e) {
	            this.uc.log('Error executing ZSecurity.decrypt: ' + (e.message || e));
	        }
	    },
	    //Methods to be used by the controller
	    //Request generators
	    generateToken: function () {
	        token = this.m().security.id + ';' + 'asdasda' + ';' + (new Date()).toUTCString();
	        this.getKey(DoAsciiHex(token, 'A2H'), false);
	    },
	    generateLoginRequest: function (username, password, confirmationCode) {
	        if (!username)
	            username = prompt("Username", "tcardoso");
	        if (!password)
	            password = prompt("Password", "");
	        try {
	            this.m().security.lastLoginAttempt = new Date();
	            this.login(DoAsciiHex(username + "|" + password + "|" + (confirmationCode ? confirmationCode : ''), 'A2H'), false);
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.generateLoginRequest: ' + (ex.message || ex));
	        }
	    },
	    generateLogoutRequest: function () {
	        try {
	            this.logout();
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.generateLogoutRequest: ' + (ex.message || ex));
	        }
	    },
	    generateIsLoggedInRequest: function () {
	        try {
	            this.isLoggedIn();
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.generateIsLoggedInRequest: ' + (ex.message || ex));
	        }
	    },
	    //Response handlers
	    loginResponse: function (data, isASCII) {
	        try {
	            this.m().communications.hitClientReceiver = true;

	            this.uc.log("<br/><br/>" + JSON.stringify(data) + "<br/><br/>");
	            if (data._error) {
	                if (data._error.errorCode == 0 && data._objects.length > 0) {
	                    if (data._objects[0] == true) {
	                        this.m().security.lastLoginTime = new Date();
	                        this.uc.raise('loginsuccess');
	                    }
	                }
	                else {
	                    this.m().setErrorMessage(data._error.errorMessage);
	                    this.uc.raise('error', this.uc);
	                }
	            }
	            else {
	                this.m().setErrorMessage('Unknown error');
	                this.uc.raise('error', this.uc);
	            }

	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.loginResponse: ' + (e.message || e));
	        }
	    },
	    logoutResponse: function (data) {
	        this.response(data, 'logoutsuccess');
	    },
	    isLoggedInResponse: function (data) {
	        this.response(data)
	    },
	    response: function (data, onsuccess) {
	        try {
	            this.m().communications.hitClientReceiver = true;

	            this.uc.log("<br/><br/>" + JSON.stringify(data) + "<br/><br/>");
	            if (data._error) {
	                if (data._error.errorCode == 0 && data._objects.length > 0) {
	                    if (data._objects[0] == true && onsuccess) {
	                        this.uc.raise(onsuccess);
	                    }
	                }
	                else {
	                    this.m().setErrorMessage(data._error.errorMessage);
	                    this.uc.raise('error', this.uc);
	                }
	            }
	            else {
	                this.m().setErrorMessage('Unknown error');
	                this.uc.raise('error', this.uc);
	            }

	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.response for: ' + onsuccess + '. ' + (e.message || e));
	        }
	    },
	    getKeyResponse: function (data, isASCII) {
	        try {
	            //signals reception of response
	            this.m().communications.hitClientReceiver = true;

	            this.uc.log("<br/><br/>" + JSON.stringify(data) + "<br/><br/>");
	            if (data._error && data._error.errorCode == 0 && data._objects.length > 0) {
	                data = data._objects[0];
	                var rA = this.decrypt(data, isASCII).split(";");
	                this.m().security.serverKey = rA[0];
	                this.m().security.sessionKey = rA[1];
	                //Processes the session key:
	                //1) Finds the UDID first 4 digits location
	                var _idxid = this.m().security.sessionKey.indexOf(this.m().security.id.substring(0, 4)) + 4;
	                var _tk = this.m().security.sessionKey.substring(_idxid, 32 + _idxid);
	                //Reconstructs the token:
	                this.m().security.sessionToken = _tk.substring(0, 8) + "-" + _tk.substring(8, 12) + "-" + _tk.substring(12, 16) + "-" + _tk.substring(16, 20) + "-" + _tk.substring(20, 32) + "-" + this.m().security.id.substring(36);
	                this.m().security.sessionKey = this.m().security.sessionKey.substring(_idxid + 32);
	                this.m().security.timeDiff = parseInt(rA[2]);
	                this.uc.log('SessionToken successfully created');
	                //raises sessionReady
	                this.uc.raise('sessionReady');
	            }
	            else
	                throw 'Invalid response.';
	            //this.logServerResponseObject(data);
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.getKeyResponse: ' + (e.message || e));
	        }
	    },
	    createRequestToken: function () {
	        try {
	            if (this.m().security.sessionKey && this.m().security.sessionKey.length > 0) {
	                var _dNow = new Date();
	                return this.m().security.sessionToken
			            + ";c3f29ab9230ffb02;" + (new Date(_dNow.valueOf() + this.m().security.timeDiff)).toUTCString();
	            }
	            else {
	                throw "Cannot create request token because there is no valid session.";
	            }
	        } catch (ex) {
	            this.uc.log('Error initializing ZSecurity.createRequestToken: ' + (ex.message || ex));
	            //on this case, re-throws the exception, to make sure this is not used during encryption
	            throw ex;
	        }
	    },
	    //Requests
	    getKey: function (data, isASCII) {
	        try {
	            var _encData = this.encrypt(data, isASCII).replace(/\s/g, "");
	            this.sendRequest({
	                "method": "GetKeyHEX",
	                "encData": _encData
	            }, 'uce.zsecurity.object.controller.getKeyResponse', '/getkey/' + _encData);
	        } catch (e) {
	            this.uc.log('Error executing ZSecurity.getKey: ' + (e.message || e));
	        }
	    },
	    login: function (data, isASCII) {
	        try {
	            var datalength = this.m().security.policies.userDataMinLength * (isASCII === true ? 1 : 2);
	            if (!data || (data.length < datalength)) {
	                throw "User data does not meet minimum size criteria.";
	            }
	            var _encData = this.encrypt(data, isASCII, this.m().security.sessionKey).replace(/\s/g, "");
	            var _encT = this.encrypt(this.createRequestToken(), true).replace(/\s/g, "");
	            this.sendRequest({
	                "method": "Login",
	                "encData": _encData,
	                "encT": _encT
	            }, 'uce.zsecurity.object.controller.loginResponse', '/login/' + _encT + '/' + _encData);
	        } catch (ex) {
	            this.uc.log('Error executing ZSecurity.login: ' + (ex.message || ex));
	        }
	    },
	    logout: function (data, isASCII) {
	        try {
	            var _encData = this.encrypt(this.createRequestToken(), true).replace(/\s/g, "");
	            this.sendRequest({
	                "method": "Logout",
	                "encData": _encData
	            }, 'uce.zsecurity.object.controller.logoutResponse', '/logout/' + _encData);
	        } catch (e) {
	            this.uc.log('Error executing ZSecurity.logout: ' + (e.message || e));
	        }
	    },
	    isLoggedIn: function (data, isASCII) {
	        try {
	            var _encData = this.encrypt(this.createRequestToken(), true).replace(/\s/g, "");
	            this.sendRequest({
	                "method": "IsLoggedIn",
	                "encData": _encData
	            }, 'uce.zsecurity.object.controller.isLoggedInResponse', '/isloggedin/' + _encData);
	        } catch (e) {
	            this.uc.log('Error executing ZSecurity.isLoggedIn: ' + (e.message || e));
	        }
	    },
	    sendRequest: function (dataRequest, callback, uriFormat) {
	        try {
	            //shows the loader
	            //jQuery.mobile.pageLoading();
	            //resets the client receiver flag;
	            this.m().communications.hitClientReceiver = false;
	            uce('zsecurity').log('Sending request: ' + JSON.stringify(dataRequest) + ' to: ' + this.m().configuration.serverEndPoint + (uriFormat ? uriFormat : ''));
	            jQuery.ajax({
	                url: this.m().configuration.serverEndPoint + (uriFormat ? uriFormat : ''),
	                data: dataRequest,
	                statusCode: {
	                    404: function () {
	                        uce('zsecurity').log('page not found');
	                    },
	                    500: function () {
	                        uce('zsecurity').log('error');
	                    }
	                },
	                dataType: 'jsonp',
	                jsonp: 'callback',
	                jsonpCallback: callback == undefined ? 'zgt.processResponse' : callback
	            })
            .success(function () { })
            .error(function (jqXHR, textStatus, errorThrown) {
                //alert("error: " + textStatus + " " + errorThrown); 
                //jQuery.mobile.pageLoading(true);
            })
            .complete(function (jqXHR, textStatus) {
                if (uce('zsecurity').object.model.communications.hitClientReceiver != true) {
                    uce('zsecurity').log("Error in response. Completed with status:" + textStatus);
                }
                //jQuery.mobile.pageLoading(true);
            });
	        } catch (ex) {
	            this.uc.log('Error initializing ZSecurity.sendRequest: ' + (ex.message || ex));
	        }
	    }
	};


	/****************************************************
	*	USE-CASES
	****************************************************/
	uce('zsecurity').ready(function (e) {

	    //Sets the MVC structure
	    uce('zsecurity').setModel(new MZSecurity()).setViewer(new VZSecurity()).setController(new CZSecurity())

	    //1-Init
	            .addusecase('init', undefined, function (e) {
	                e.data.usecase.log("Initializing ZSECURITY.", e);
	            })

	    //2-Framework Loaded - triggers internally by the controller once the security framework ends loading asynchronously
	            .addusecase('frameworkReady', undefined, function (e) {
	            })

	    //3-GetKey
	            .addusecase('getkey', 'uc_zsecurity_frameworkReady', function (e) {
	                e.data.usecase.object.controller.generateToken();
	            })

	    //4-GetKey
	            .addusecase('sessionReady', undefined, function (e) {
	                e.data.usecase.raise('login', undefined, e);
	            })
	    //5-Login
	            .addusecase('login', undefined, function (e) {
	                e.data.usecase.object.controller.generateLoginRequest();
	            })

	    //6-Logout
	            .addusecase('logout', undefined, function (e) {
	                e.data.usecase.object.controller.generateLogoutRequest();
	            })

	    //7-IsLoggedIn
	            .addusecase('isloggedin', undefined, function (e) {
	                e.data.usecase.object.controller.generateIsLoggedInRequest();
	            })

	    //8-Register
	            .addusecase('register', undefined)

	    //9-LoginSuccess
	            .addusecase('loginsuccess', undefined, function (e) {
	                alert('Login Successful!');
	            })

        //10-LogoutSuccess
	            .addusecase('logoutsuccess', undefined, function (e) {
	                alert('Logout Successful!');
	            })

	    //11-Error
                .addusecase('error', undefined, function(e){
	                alert('Error: ' + e.data.usecase.object.model.getErrorMessage());
                })

                .raise('init')
	});