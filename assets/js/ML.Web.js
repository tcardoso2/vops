/*Ajax support functions*/

/*Loaders*/
function OnShowBackLayer() {
    jQuery('body').append('<div class="ml-ui-loading-bg"></div>');
}

function OnShowLoader() {
    jQuery('body').append('<div class="ml-ui-loading-bg coverall"><div class="ml-ui-box ml-ui-loader">loading...</div></div>');
    var _loader = jQuery('.ml-ui-loader:hidden').length == 0 ? jQuery('.ml-ui-loader') : jQuery('.ml-ui-loader:hidden');
    _loader.css({ left: $(document).width() / 2 - 30 }).show();
}

function OnRemoveLoader() {
    jQuery('.ml-ui-loading-bg').remove();
}

function OnShowMessage(message) {
    if (message != '') {
        var _mbox = $('<div class="ml-ui-box ml-ui-warning">' + message + '</div>');
        jQuery('body').append(_mbox);
        _mbox.css({ width: message.length * 4, top: -100 }).css({ left: $(document).width() / 2 - (message.length * 2) }).show();
        _mbox.animate({ opacity: 1, top: 0 }, function () {
            jQuery(this).delay(2000).fadeOut(5000, function () {
                jQuery(this).remove();
            });
        });
    }
}

function OnShowValidationMessage(message, field) {
    var _vbox = $('.ml-ui-validation-box');
    if (message != '' && _vbox.length == 0) {
        _vbox = $('<div class="ml-ui-box warning ml-ui-validation-box">' + message + '</div>');
        jQuery('body').append(_vbox);
        _vbox.css({ width: message.length * 4, top: -100 }).css({ left: $(document).width() / 2 - (message.length * 2) }).show();
        var _fofs = jQuery(field).offset();
        _vbox.animate({ opacity: 1, top: _fofs.top, left: (_fofs.left-120) }, function () {
        });
    }
}

function ValidateRegex(el, onSuccess, onError, type) {
    //Default is alphanumeric + spaces and dots and underscore of 40 characters long (for user names)
    var rege = new RegExp(/^[a-zA-Z0-9_.\s]{1,40}$/);
    if(type != undefined)
    {
        switch (type) {
            case 0:
                //Used normaly for text
                rege = new RegExp(/^[a-zA-Z0-9_.\, \: \; \? \- \! \s]{1,256}$/);
                break;
            case 1:
                //WIP...
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                break;
        }
    }
    if (el.value.match(rege)) {
        $('.ml-ui-validation-box').remove();
        $(el).toggleClass('ml-ui-field-validation', false);
        if (typeof (onSuccess) == 'function')
            onSuccess();
    }
    else {
        if (typeof (onError) == 'function')
            onError();
        else {
            $(el).toggleClass('ml-ui-field-validation', true);
            OnShowValidationMessage("Invalid input", event.target);
            return false;
        }
    }
    return true;
}

function OnQuestSendSuccess(response, status, xhr, wait) {
    wait = wait ? wait : 2000;
    if (response.e == true && status == 'success')
        alert(response.m);
    else {
        response = response[0];
        setTimeout('try{jQuery("#qi-' + response.Id + '").fadeOut(' + wait + ',function(){jQuery(this).remove();});}catch(e){alert("Erro:" + e);}', wait);
        jQuery("#qi-" + response.Id).html(response.contextMessage);
        //setTimeout('try{alert("#qi-' + response.m.i + '");jQuery("#qi-");}catch(e){alert(e);}', wait);
        //alert(JSON.stringify(response));
    }
    OnRemoveLoader();
}

function OnCheerSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'Cheer') == true) {
        jQuery('[id^="' + response.data[0].Id.toString() + '"] .ml-ui-action-cheer:first').html(response.data[0].Result == true ? 'Uncheer' : 'Cheer');
        jQuery('[id^="' + response.data[0].Id.toString() + '"] .ml-ui-noofcheers:first').html(response.data[0].Result == true ? 'You cheered!' : 'Removed').addClass('ml-ui-cheered-uncheeredaction').animate({}, 5000, function () { $(this).removeClass('ml-ui-cheered-uncheeredaction'); });
    }
}

function OnDiscardQuestSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'DiscardQuest') == true) {
        OnShowLoader();
        window.location.reload();
    }
    else
        CreateFeedbackBox('Oooops, an error ocurred while attempting to discard this quest, we are working on the problem.');
}

function OnCheckinSuccess(response, status, xhr) {
    //alert(JSON.stringify(response));
    window.location.reload();
    if (ValidateServerResponse(response, status, 'RespondToCheckin') == true) {
        window.location.reload();
    }
}

function OnRequestFollowRequestSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'RequestFollowRequest') == true) {
        $("#ml-ui-friend-request").html("Request sent!");
    }
    else {
        $("#ml-ui-friend-request").fadeOut(3000).click(function (event) {
            $(this).html("Request already sent!");
            event.stopPropagation();
            event.preventDefault();
            return false;
        });
        $("#ml-ui-friend-request").html(response.error);
    }
}

function OnAcceptFollowRequestSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'AcceptFollowRequest') == true) {
        //To-do: jQuery plugin
        $(".ml-ui-feedbackbox").find('.ml-ui-closebutton').click();
        CreateFeedbackBox('Request Accepted!');
        UpdateFollowerRequests();
        UpdateFollowers();
    }
    else {
        $(".ml-ui-feedbackbox span").html(response.error);
    }
}

function OnRemoveFollowerSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'RemoveFollower') == true) {
        CreateFeedbackBox('User Removed.');
        //Refresh the Friends list
        UpdateFollowers();
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function OnGetFollowersResponseSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'GetFollowersResponse') == true) {
        if (response.data.length == 0) { 
        }
        else { 
        }
    }
}

//This is a WIP function
function CreateFeedbackBox(message, type, events, data, parent) {
    //Create an object instead?
    OnRemoveLoader();
    OnShowBackLayer();
    var _center = !parent;
    if (!parent) parent = $('.ml-ui-loading-bg');
    if (!message) message = '';
    var _fb = $("<div class='ml-ui-feedbackbox'><span>" + message + "</span><div class='ml-ui-button-white ml-ui-closebutton'>[x]</div></div>").hide();
    if (!type) type = 0;
    switch (type) {
        //OK Button
        case 0:
            _fb.append("<div id='ch_ok'class='ml-ui-button-white smallbutton'>ok</div>");
            if (events && typeof events[0] == 'function') {
                _fb.find('#ch_ok').bind('click', { 'uid': data.uid }, events[0]);
            }
            else {
                _fb.find('#ch_ok').click(function (event) {
                    $(this).parent().find('.ml-ui-closebutton').click();
                });
            }
            break;
        case 1:
            //ACCEPT/DENY buttons
            _fb.append("<div id='ch_accept'class='ml-ui-button-white smallbutton'>accept</div><div id='ch_deny'class='ml-ui-button-white smallbutton'>deny</div>");
            if (events && typeof events[0] == 'function') {
                _fb.find('#ch_accept').bind('click', { 'uid': data.uid, evData: data }, events[0]);
            }
            if (typeof events[1] == 'function') {
                _fb.find('#ch_deny').bind('click', { 'uid': data.uid, evData: data }, events[1]);
            }
            else {
                _fb.find('#ch_deny').click(function (event) {
                    $(this).parent().find('.ml-ui-closebutton').click();
                });
            }
            break;
        case 2:
            //TextArea with send button
            _fb.append("<textarea cols=50 rows=2></textarea><div id='ch_send'class='ml-ui-button-white smallbutton'>send</div>");
            break;
        case 11:
            //Specific case which falls into the OK/Cancel case, but shows a (hard-coded, change this to a service in the backend in the future) template with a dropdown with the user groups valid for a user
            var _fb = $("<div class='ml-ui-feedbackbox'><span>The user " + data.Username + " is in the following group:"
                + "<select>"
                    + "<option value='1'>(No Access)</option>"
                    + "<option value='3'>Friends</option>"
                    + "<option value='2'>Close Friends</option>"
                + "</select>"
                + "</span><div class='ml-ui-button-white ml-ui-closebutton'>[x]</div></div>").hide();
            //In this case the message must be an integer
            var _selOption = parseInt(message);
            _fb.find('select').val(_selOption);
            //No break;
        case 3:
            //OK/CANCEL buttons
            _fb.append("<div id='ch_ok2'class='ml-ui-button-white smallbutton'>ok</div><div id='ch_cancel'class='ml-ui-button-white smallbutton'>cancel</div>");
            if (events && typeof events[0] == 'function') {
                _fb.find('#ch_ok2').bind('click', { 'uid': data.uid, evData: data }, events[0]);
            }
            _fb.find('#ch_cancel').click(function (event) {
                $(this).parent().find('.ml-ui-closebutton').click();
            });
            break;
        default:
            break;
    }
    _fb.find('.ml-ui-closebutton').click(function (event) { OnRemoveLoader(); $(this).parent().removeClass('ml-ui-highlight-item-whitebg'); $(this).parent().parent().fadeOut(300, function (event) { $(this).remove(); }); });
    parent.append(_fb);
    var _hwidth = $('body').width() / 2;
    if (_center) {
        _fb.css({ left: _hwidth - _fb.width() / 2, top: '50%' });
    }
    _fb.fadeIn(500);
    var _fbwidth = 300;
    _fb.animate({ width: _fbwidth, left: _hwidth - _fbwidth / 2 }, 500);
    //Add the click handle to the Message box
}

var _lSId;
function OnRequestSaySomethingSuccess(response, status, xhr) {
    if (ValidateServerResponse(response, status, 'RequestSaySomething') == true) {
        var _elR = $('#' + response.data[0].Id.toString());
        if (_elR.find('.ml-ui-feedbackbox').length == 0) {
            _lSId = response.data[0].aId;
            //Removes all other feedbackboxes in the screen,
            jQuery('.ml-ui-feedbackbox').remove();
            //and all other formating on posts;
            jQuery('.ml-ui-posts').removeClass('ml-ui-highlight-item');
            var _fb = $("<li class='ml-ui-feedbackbox'><div class='ml-ui-button-white ml-ui-closebutton'>[x]</div><textarea cols=50 rows=2></textarea><div id='ch_send'class='ml-ui-button-white smallbutton'>send</div></li>");
            _fb.find('.ml-ui-closebutton').click(function (event) { OnRemoveLoader(); $(this).parent().parent().removeClass('ml-ui-highlight-item'); $(this).parent().fadeOut(300, function (event) { $(this).remove(); }); });

            _elR.append(_fb);
            _fb.animate({ left: '0px' }, 500);
            _fb.parent().addClass('ml-ui-highlight-item');
            OnShowBackLayer();
            //Add the click handle to the Message box
            _fb.find('#ch_send').click(function (event) {
                $(this).html('wait...');
                OnShowLoader();
                OnAjaxPost('/Home/RespondToCheckin', { text: $(this).parent().find('textarea').val(), id: _lSId, uId: $('.ml-ui-owner>span').text() }, OnCheckinSuccess);
            });
            _fb.find('textarea').keydown(function (event) {
                IgnoreEnter(event);
            }).keyup(function (event) {
                HandleUserInput(event, $(this).parent());
                //HandleEnterAsClick(event, $(this).parent().find('#ch_send'));
            });
        }
        _elR.find('.ml-ui-action-comment').html('Say Something...');
    }
}

function ValidateServerResponse(response, status, source) {
    if (status == 'success') {
        if (response) {
            console.log(JSON.stringify(response), 'source: ' + source);
            if (response.error != undefined && response.source == source + 'Response') {
                console.log('Response validated.');
                /*Ver aqui forma de obter a configuracao, se calhar por em local storage? ou em variavel*/
                if (response.error.length > 0) {
                    console.log('Response validated, but has error: ' + response.error);
                    OnShowMessage(response.error);
                } else {
                    console.log('Response has no error.');
                    if (typeof (response.data) == 'object') {
                        if (response.data.length > 0) {
                            try {
                                if (response.owner) {
                                    console.log('Response has owner.');
                                    $('#___' + response.source).remove();
                                    $('body').append('<div id="___' + response.source + '" class="ml-ui-owner">You are seeing data from: <span>' + response.owner + '</span></div>');
                                }
                                else {
                                    console.log('Response does not have owner.');
                                    if ($('.ml-ui-owner>span').length == 0) {
                                        $('.ml-ui-owner>span').remove();
                                        $('body').append('<div id="_no_owner" class="ml-ui-owner">You are seeing data from: yourself</div>');
                                    }
                                }
                            } catch (e) {
                                //console.log('No owner assigned to response. Inner exception: ' + e);
                            }
                            console.log('Returning true on ValidateServerResponse.');
                            return true;
                        }
                        else {
                            //response is not an array, but is considered to be valid.
                            return true;
                        }
                    }
                    else
                        return false;
                }
            }
            else {
                if (typeof (response) == 'string' && typeof (source) == 'string' && response.indexOf('<html>') > 0) {
                    if (__MLUserIsAuthenticated == false)
                            OnShowMessage("Please login or register a new account.");
                    else
                        OnShowMessage("Unknown error occured.");
                }
                else
                    OnShowMessage("Malformatted response: " + JSON.stringify(response));
            }
        }
        else {
            OnShowMessage("It was not possible to cheer this checkin at the moment, please try again later.");
        }
    }
    return false;
}

function OnBlockFollowerSuccess(response, status, xhr, wait) {
    if (ValidateServerResponse(response, status, 'BlockFollower') == true) {
        OnRemoveLoader();
        CreateFeedbackBox('User was blocked.');
        //Refresh the Friends list
        UpdateFollowers();
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function OnIncludeFollowerInGroupSuccess(response, status, xhr, wait) {
    if (ValidateServerResponse(response, status, 'IncludeFollowerInGroup') == true) {
        OnRemoveLoader();
        CreateFeedbackBox('User group changed with success.');
        //Refresh the Friends list
        UpdateFollowers();
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function OnIncreasePolicyValueSuccess(response, status, xhr, wait) {
    if(typeof response == 'string')
        console.log(JSON.stringify(status));
    if (ValidateServerResponse(response, status, 'IncreasePolicyValue') == true) {
        OnRemoveLoader();
        if (response.data[0] != undefined && response.data[0] == true) {
            alert('There was a reaction! Continuar daqui! Chamar next script!');
            UpdateScript();
        }
        else {
            $('.ml-ui-rpg-policyValue#' + response.data.Uid).text(response.data.Value);
        } 
    }
    else {
        CreateFeedbackBox('Some error happened while changing the Policy Value.');
    }
}

function OnDecreasePolicyValueSuccess(response, status, xhr, wait) {
    if (typeof response == 'string')
        console.log(JSON.stringify(status));
    if (ValidateServerResponse(response, status, 'DecreasePolicyValue') == true) {
        OnRemoveLoader();
        $('.ml-ui-rpg-policyValue#' + response.data.Uid).text(response.data.Value);
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function OnGetRegionCalendarSuccess(response, status, xhr, wait) {
    if (typeof response == 'string')
        console.log(JSON.stringify(status));
    if (ValidateServerResponse(response, status, 'GetRegionCalendar') == true) {
        OnRemoveLoader();
        var date = new Date(parseInt(response.data.CurrentTime.substr(6)));
        $('.ml-ui-rpg-currentRegionDate').text(date.toDateString());
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function GoToNextMonthRegionCalendarSuccess(response, status, xhr, wait) {
    if (typeof response == 'string')
        console.log(JSON.stringify(status));
    if (ValidateServerResponse(response, status, 'GoToNextMonthRegionCalendar') == true) {
        OnRemoveLoader();
        var date = new Date(parseInt(response.data.CurrentTime.substr(6)));
        $('.ml-ui-rpg-currentRegionDate').text(date.toDateString());
        alert('(A) Corrigir formula porque nao esta a calcular bem baseado nas policies, parece estar caching the values. (B) Adicionar parentesis? (C) Adicionar action points.');
    }
    else {
        CreateFeedbackBox('Some error happened.');
    }
}

function OnPlayerSimpleDataGetSuccess(response, status, xhr, wait) {
    jQuery("#ml-ui-cxp a").html(response.XP);
    jQuery("#ml-ui-coins a").html(response.Wealth);
    jQuery("#ml-ui-cradius a").html(response.Radius);
}

/*General*/
function OnBeginRequest(ajaxContext) {
    OnShowLoader();
    //alert(ajaxContext);
}

function OnResponseFailure(ajaxContext, status, xhr) {
    OnRemoveLoader();
    try {
        if (!ajaxContext.get_response) {
            //Do nothing, most probably request was canceled.
        }
        else
            OnShowMessage('Oooops... some unknown error happened - ' + ajaxContext.get_response().get_statusCode());
    } catch (e) {
        //Does nothing
    }
}

function OnResponseSuccess() {
    OnRemoveLoader();
}

/*Search*/
var lastUPXhr;
var lastUPvalue = '';
var lastUPvalueIndex = 0;
var lastLoadTime = new Date().getTime();
setInterval(function () { lastLoadTime += 1000; }, 1000);
var _sbr;
function UserProbe(input) {
    if (input && input.length > 0) {
        if (lastUPXhr != undefined) {
            //Aborts last request
            try { lastUPXhr.abort(); } catch (e) { alert(e); }
        }
        lastUPXhr = $.ajax({
            url: "/Home/UserProbe",
            data: "input=" + input,
            //url: '@Url.Action("ActionName", "ControllerName")',
            success: function (data) {
                _sbr = $('#ml-ui-usersimplesearch-results').length == 0 ? $('#ml-ui-usersimplesearch-results:hidden') : $('#ml-ui-usersimplesearch-results');
                if (data instanceof Array && data.length > 0) {
                    var _s = $('#ml-control-usersimplesearch');
                    var _sb = _s.offset();
                    _sbr.empty();
                    for (var u in data) {
                        if (data[u].Name && data[u].Name.trim().length > 0)
                            AddUserToList(_sbr, data[u].Name, data[u].Url);
                    }
                    AddUserToList(_sbr, "Advanced Search...", "Search/Advanced/?v=" + _s.val());
                    _sbr.css({ left: _sb.left - 56, top: _sb.top, width: 200, height: _sbr.children().length * 21, 'background-color': 'white' }).fadeIn(500);
                }
                else {
                    _sbr.hide();
                    OnShowMessage(data);
                }
            }
        });
    }
    else {
        _sbr.empty().hide();
    }
}
function IsUserProbeResultsVisible() {
    return $('#ml-ui-usersimplesearch-results').is(":visible");
}

function DismissUserProbe() {
    $('#ml-ui-usersimplesearch-results').fadeOut(500).empty();
}

function ShowUserProbe() {
    $('#ml-ui-usersimplesearch-results').show();
}

function ShowUserProbe(ifContainsChildren) {
    _sbr = $('#ml-ui-usersimplesearch-results').length == 0 ? $('#ml-ui-usersimplesearch-results:hidden') : $('#ml-ui-usersimplesearch-results');
    if (ifContainsChildren == true && _sbr.children().length > 0)
        _sbr.show();
}

/*Utils*/
function AddUserToList(list, name, url) {
    list.append('<li><a href="/Profile/UserProfileView/?id=' + url + '">' + name + '</a></li>');
}

function GetCharFromEvent(ev) {
    var char;
    if (ev.which == null)
        char = ev.keyCode;    // old IE
    else if (ev.which != 0)
        char = ev.which;   // All others
    return char;
}

function OnClickCheckin(event) {
    ValidateRegex(event.target, function () { });
}

function OnUserSimpleSearch(event) {
    if (lastUPvalue != event.target.value && event.target.value.length > 0) {
        lastUPvalue = event.target.value;
        //Validate
        ValidateRegex(event.target, function (lastUpValue) { UserProbe(lastUPvalue); }, function () { });
        //ValidateRegex(event.target, function (lastUpValue) { UserProbe(lastUPvalue); });
    }
}

function OnUserSimpleSearchKeyDown(event) {
    if (lastUPvalue == event.target.value) {
        if (IsUserProbeResultsVisible() == true) {
            switch (GetCharFromEvent(event)) {
                case 40: //Down
                    lastUPvalueIndex++;
                    break;
                case 38: //Up
                    //Minimum index is 0
                    lastUPvalueIndex -= lastUPvalueIndex == 0 ? 0 : 1;
                    break;
                default:
                    HandleEnter(event);
                    return;
            }
            //If it gets here means the arrows were pressed
            //ERROR JAVASCRIPT 0.2.9.23.E0001: Search might show more results so only visible ones matter.
            _sbr = $('#ml-ui-usersimplesearch-results').length == 0 ? $('#ml-ui-usersimplesearch-results:hidden') : $('#ml-ui-usersimplesearch-results');
            if (lastUPvalueIndex < 0) lastUPvalueIndex = 0;
            else if (lastUPvalueIndex > _sbr.children().length)
                lastUPvalueIndex = _sbr.children().length;
            $("#ml-ui-usersimplesearch-results li").removeClass('UPSelected');
            console.log($("#ml-ui-usersimplesearch-results").html());
            $("#ml-ui-usersimplesearch-results li:nth-child(" + lastUPvalueIndex + ")").addClass('UPSelected');
        }
    }
    HandleEnter(event);
}

_shiftDown = false;
//General key handling
$(document).keyup(function (event) {
    switch (GetCharFromEvent(event)) {
        case 27: //ESC
            OnRemoveLoader();
            break;
        case 16:
            //Shift
            _shiftDown = false;
            break;
        default:
            break;
    }
});
function HandleEnterAsClick(event, actionHandle) {
    if (GetCharFromEvent(event) == 13) {
        if (ValidateRegex(event.target, undefined, undefined, 0) == true) {
            if (_shiftDown == false)
                if (confirm('Do you want to submit? If not, press cancel, to just change line press SHIFT-ENTER.'))
                    actionHandle.click();
        }
        else {
            return;
        }
    }
}

function IgnoreEnter(event) {
    if (_shiftDown == false) {
        HandleEnter(event, function (event) {
            event.stopPropagation();
            event.preventDefault();
        });
    }
}

//WIP: Find a way to unify the 2 next functions, there is some overlap here.
function HandleEnter(event, overrideFn) {
    if (GetCharFromEvent(event) == 13) {
        if (typeof overrideFn == 'function') {
            overrideFn(event);
        }
        else {
            if (ValidateRegex(event.target) == true) {
                if (lastUPvalueIndex > 0 && lastUPvalueIndex < _sbr.children().length) {
                    _sbis = $("#ml-ui-usersimplesearch-results li:nth-child(" + lastUPvalueIndex + ")");
                    event.target.value = _sbis.text();
                    window.location.href = _sbis.find('a').attr('href');
                }
                else {
                    window.location.href = '/Search/?user=' + event.target.value;
                }
            }
            else {
                return;
            } 
        }
    }
}

var _csbx;
function HandleUserInput(event, elementToAlignSuggestions) {
    _csbx = $(event.target).parent().find('ul.ml-ui-suggestions-box');
    switch (GetCharFromEvent(event)) {
        case 40: //Down
            lastUPvalueIndex += lastUPvalueIndex >= _csbx.children().length ? 0 : 1;
            _csbx.children().removeClass('SBSelected');
            _csbx.find("li:nth-child(" + lastUPvalueIndex + ")").addClass('SBSelected');
            $("#ml-ui-usersimplesearch-results li:nth-child(" + lastUPvalueIndex + ")").addClass('UPSelected');
            break;
        case 38: //Up
            lastUPvalueIndex -= lastUPvalueIndex == 0 ? 0 : 1;
            _csbx.children().removeClass('SBSelected');
            _csbx.find("li:nth-child(" + lastUPvalueIndex + ")").addClass('SBSelected');
            break;
        case 13: //ENTER
            if (_csbx.children().length > 0 && lastUPvalueIndex >= 0 && lastUPvalueIndex <= _csbx.children().length) {
                //Populate the text area with the new value, only if the value is not empty
                if (_csbx.find("li:nth-child(" + lastUPvalueIndex + ")").text().length > 0) {
                    event.preventDefault();
                    event.stopPropagation();
                    var _val = event.target.value.split(/[\s,!.?;:]+/);
                    event.target.value = event.target.value.substring(0, event.target.value.length - _val[_val.length - 1].length) + _csbx.find("li:nth-child(" + lastUPvalueIndex + ")").text();
                    _csbx.remove();
                }
            }
            else {
                HandleEnterAsClick(event, $(event.target).parent().find('#ch_send'));
            }
            break;
        default:
            if (event.target.value != lastUPvalue) {
                lastUPvalue = event.target.value;
                //Splits words
                var _val = event.target.value.split(/[\s,!.?;:]+/);
                if (_val[_val.length - 1].length > 0) {
                    var _mi = GetAllMatchingTerms(_val[_val.length - 1]);
                    if (_csbx.length == 0) {
                        _csbx = $("<ul class='ml-ui-suggestions-box'></ul>").hide();
                        $(event.target).parent().append(_csbx);
                        if (elementToAlignSuggestions) {
                            _csbx.css({ left: elementToAlignSuggestions.width() - 40, top: 0 });
                        }
                        lastUPvalueIndex = 0;
                        _csbx.show();
                    }
                    _csbx.empty();
                    for (var i in _mi)
                        _csbx.append('<li>' + _mi[i] + '</li>');
                    _csbx.click(function (event) {
                        var _ta = $(event.target).parent().parent().find('textarea');
                        var _val = _ta.val().split(/[\s,!.?;:]+/);
                        _ta.val(_ta.val().substring(0, _ta.val().length - _val[_val.length - 1].length) + event.target.innerHTML);
                        $(event.target).parent().remove();
                    });
                }
                else {
                    _csbx.remove();
                }
            }
            break;
    }
}
//End General key handling

//General DOM events
$(document).keydown(function (event) {
    switch (GetCharFromEvent(event)) {
        case 16:
            //Shift
            _shiftDown = true;
            break;
        default:
            break;
    }
});
$(function () {
    _ML = new ML();
    //If terms are not in cache, makes sure they are pre-cached, still does not check versioning
    GetAllTerms();
    //
    BindCheckinArea($("#ml-ui-checkinArea"));
});

//End General DOM events

function BindCheckinArea(el) {
    el.keydown(function (event) {
        IgnoreEnter(event);
    }).keyup(function (event) {
        HandleUserInput(event, $(this).parent());
        //HandleEnterAsClick(event, $(this).parent().find('#ch_send'));
    });
}

var _res;
function GetAllMatchingTerms(input) {
    if (typeof input == 'string') {
        var _allTerms = GetAllTerms();
        _res = [];
        for (var s in GetAllTerms()) {
            if (_allTerms[s].substring(0, input.length).toLowerCase() == input.toLowerCase()) {
                _res.push(_allTerms[s]);
            }
            else {
                if (_res.length > 0) break;
            }
        }
        return _res;
    }
    return [];
}

function GetAllTerms() {
    var _allTerms = _ML.getSessionItem('__all_ml_terms_');
    if (_allTerms.hasValue == false) {
        OnAjaxGet('/Home/GetAllTerms', {}, function (response, status, xhr) {
            if (ValidateServerResponse(response, status, 'GetAllTerms') == true) {
                response.data = response.data[0].split("|");
                //Stores in local storage
                _ML.setSessionItem('__all_ml_terms_', response.data);
            }
        });
    } else {
        return _allTerms.data;
    }
    return [];
}

function UpdateFollowers() {
    OnAjaxGet('/Connect/GetFollowers', {}, function (response, status, xhr) {
        var _fcontainer = $("#ml-ui-followers");
        _fcontainer.html('');
        if (ValidateServerResponse(response, status, 'GetFollowers') == true) {
            for (var i = 0; i < response.data.length; i++) {
                _fcontainer.append('<li>You have got ' + response.data.length + ' friends:</li>');
                for (var i = 0; i < response.data.length; i++) {
                    var _f = $('<li id="' + response.data[i].UniqueId + '" class="ml-ui-item"><span>' + response.data[i].Username + '<img class="ml-ui-thumb" src="' + getUserThumbUrl(response.data[i].Username) + '" /></span></li>');
                    var _fdetails = $('<ul class="ml-ui-item ml-ui-hidden"><li>View Profile</li><li>Block user</li><li>Change user group</li><li>Remove from followers</li></ul>');
                    _fdetails.find('li:nth-child(1)').click(function (event) {
                        window.location = '/Profile/UserProfileView/?id=' + $(this).parent().parent().attr('id');
                    });
                    _fdetails.find('li:nth-child(2)').bind('click', { user: response.data[i] }, function (event) {
                        CreateFeedbackBox("Are you sure you want to block the user: " + event.data.user.Username + "? To unblock, you can later use the 'Change user group' option.",
                            1, [function (event) {
                                OnShowLoader();
                                OnAjaxPost('/Connect/BlockFollower', { id: event.data.evData.UniqueId }, OnBlockFollowerSuccess);
                            } ], event.data.user);
                    });
                    _fdetails.find('li:nth-child(3)').bind('click', { user: response.data[i] }, function (event) {
                        CreateFeedbackBox(event.data.user.ContextGroup,
                        //ContextGroup box - 11
                            11, [function (event) {
                                OnShowLoader();
                                OnAjaxPost('/Connect/IncludeFollowerInGroup', { id: event.data.evData.UniqueId, group: $(this).parent().parent().find('select').val() }, OnIncludeFollowerInGroupSuccess);
                            } ], event.data.user);
                    });
                    _fdetails.find('li:nth-child(4)').bind('click', { user: response.data[i] }, function (event) {
                        CreateFeedbackBox("Are you sure you want to remove " + event.data.user.Username + " from your list?",
                            1, [function (event) { OnAjaxPost('/Connect/RemoveFollower', { id: event.data.evData.UniqueId }, OnRemoveFollowerSuccess); } ], event.data.user);
                    });

                    _f.append(_fdetails);
                    _fcontainer.append(_f);
                    _f.find('span').bind('click', { uid: response.data[i].UniqueId }, function (event) {
                        //first closes existing opened
                        var _current = $(this).parent();
                        _current.parent().find('ul.ml-ui-item').hide(500)
                        _current.find(':hidden').show(1000);
                        //alert(event.data.uid);
                    });
                }
            }
        }
        else {
            //If data contains no items, it is also conseidered an error, so needs to be handled
            if (typeof response.data == 'object' && response.data.length == 0)
                _fcontainer.append('<li>You have got 0 friends so far.</li>');
        }
        _fcontainer.animate({ top: '35%' }, 1000);
    });
}

function UpdateFollowerRequests() {
    OnAjaxGet('/Connect/GetRequestsFromFollowers', {}, function (response, status, xhr) {
        var _fcontainer = $("#ml-ui-follower-requests");
        if (ValidateServerResponse(response, status, 'GetRequestsFromFollowers') == true) {
            _fcontainer.append('<li>You have got ' + response.data.length + ' friend requests.</li>');
            for (var i = 0; i < response.data.length; i++) {
                var _reqtf = $('<li id="' + response.data[i].UniqueId + '" class="ml-ui-item">New request from: ' + response.data[i].Username + '<img src="' + response.data[i].PictureUrl + '" /></li>');
                _fcontainer.append(_reqtf);
                _reqtf.bind('click', { uid: response.data[i].UniqueId }, function (event) {
                    CreateFeedbackBox('Accept as friend?', 1, [function (event) {
                        $(this).html('wait...');
                        OnAjaxPost('/Connect/AcceptFollowRequest', { id: event.data.uid }, OnAcceptFollowRequestSuccess)
                    } ], event.data.uid);
                });
            }
            //animates to top
            _fcontainer.animate({ top: '35%' }, 1000, function () {
                $("#ml-ui-followers").css({ top: $("#ml-ui-followers").offset().top });
                $("#ml-ui-followers").animate({ top: _fcontainer.offset().top + _fcontainer.height() }, 1000);
            });

        }
        else {
            //If data contains no items, ignores
            if (typeof response.data == 'object' && response.data.length == 0)
                _fcontainer.append('<li>You have got no new friend requests</li>');
            _fcontainer.remove();
        }
    });
}
var _updateCTo;
function UpdateCheers() {
    if (!_updateCTo) {
        try {
            clearTimeout(_updateCTo);
        } catch (e) { }
    }
    _updateCTo = window.setTimeout(UpdateCheers, 15000);
    OnAjaxGet('/Home/GetAllCheers', {}, function (response, status, xhr) {
        var _cusr = $('#logindisplay a').html();
        if (ValidateServerResponse(response, status, 'GetAllCheers') == true) {
            $("li.ml-ui-noofcheers").html('0');
            var chkId;
            for (var i = 0; i < response.data.length; i++) {
                chkId = $("[id^=" + response.data[i].Id + "]");
                if (response.data[i].Username = _cusr)
                    chkId.find(".ml-ui-action-cheer:first").html('Uncheer');
                chkId.find(" .ml-ui-noofcheers:first").html(parseInt(chkId.find(".ml-ui-noofcheers:first").html()) + 1);
            }
            $("li.ml-ui-action-cheer").css("visibility", "visible");
        }
        //Updates no of cheers
        $("li.ml-ui-noofcheers").each(function () {
            var _val = parseInt($(this).html());
            if (_val > 0)
                $(this).html('+' + _val);
        });
    });
}
function UpdateCheckins(id, errorMessage, height) {
    OnAjaxGet('/Profile/GetUserCheckins', { id: id }, function (response, status, xhr) {
        if (ValidateServerResponse(response, status, 'GetUserCheckins') == true) {
            var _cinner = $('<div id="checkins-inner"></div>').hide();
            $('#checkins').html('');
            $('#checkins').append(_cinner);
            $("li.ml-ui-noofcheers").html('0');
            for (var i = 0; i < response.data.length; i++) {
                UpdateCheckin(response.data[i], _cinner);
            }
            _cinner.fadeIn(500);
            $('#checkins').css("height", height);
        }
        else {
            //It might be that information is restricted. If there is no error message, leave in blank
            $('#checkins').html(errorMessage ? errorMessage : '');
        }
        //In the end, calls updateCheers only once.
        UpdateCheers();
    });
}

function UpdateCheckin(chk, anchor) {
    var _checkin = $('<ul class="ml-ui-posts" id="' + chk.ExternalId.toLowerCase() + '_' + chk.UserId.toLowerCase() + '">');
    _checkin.append('<li><img src="' + getUserThumbUrl(chk.UserId) + '" /></li>');
    _checkin.append('<li>' + chk.OriginalText + '</li>');
    _checkin.append('<li class="ml-ui-button-white ml-ui-noofcheers">0</li>');
    _checkin.append('<li class="ml-ui-button-white ml-ui-action-cheer" onclick="this.innerHTML = \'wait...\'; OnAjaxPost(\'/Home/Cheer\',{checkinId: \'' + chk.ExternalId + '\' }, OnCheerSuccess)">Cheer</li>');
    _checkin.append('<li class="ml-ui-button-white ml-ui-noofcomments">' + chk.Children.length + '</li>');
    _checkin.append('<li class="ml-ui-button-white ml-ui-action-comment" onclick="this.innerHTML = \'wait...\'; OnAjaxPost(\'/Home/RequestSaySomething\',{checkinId: \'' + chk.ExternalId + '_' + chk.UserId + '\' }, OnRequestSaySomethingSuccess)">Say Something...</li>');
    _checkin.append('<li class="ml-ui-date-reference">' + new Date(parseInt(chk.OriginalTimestamp.substr(6))).format("m/dd/yy h:MM:ss TT") + '</li>');
    if (chk.Children.length > 0) {
        var _subposts = $('<div class="ml-ui-subposts hidden">');
        for (var i = 0; i < chk.Children.length; i++) {
            UpdateCheckin(chk.Children[i], _subposts);
        }
        _checkin.append(_subposts);
    }
    anchor.append(_checkin);
}

function UpdateMap(x, y) {
    if (Core.Scene.Map.LoadAboveFloor(true) == false) {
        OnAjaxGet('/RPGMap/GetAllMapItems', { currentX: x, currentY: y }, function (response, status, xhr) {
            if (ValidateServerResponse(response, status, 'GetAllMapItems') == true) {
                Core.ImageMapObjectFactory.Clear();
                for (var i = 0; i < response.data.length; i++) {
                    //alert(JSON.stringify(response.data));
                    Core.ImageMapObjectFactory.Create(
                    response.data[i].Coords.X,
                    response.data[i].Coords.Y,
                    response.data[i].Coords.Z,
                    response.data[i].Properties.SpritesheetId,
                    response.data[i].Properties.SpritesheetGroupId,
                    response.data[i].Name,
                    response.data[i].TId);
                }
                Core.Scene.Map.ClearAboveFloor(true, true);
                Core.ImageMapObjectFactory.ExtractResultToMap(Core.Scene.Map);
                //Saves map to session cache
                Core.Scene.Map.SaveAboveFloor(true);
            }
        });
        return true;
    }
    return false;
}

function UpdateScript() {
    OnAjaxGet('/RPGMap/GetProfileP', {}, function (response, status, xhr) {
        alert('Updating script!');
        var _cusr = $('.ml-ui-actor-dialog');
        if (_cusr.length == 0)
            _cusr = $('.ml-ui-actor-dialog:hidden');
        if (ValidateServerResponse(response, status, 'GetProfileP') == true) {
            if (response.data[0].overlay == false)
                window.location.reload(true);
            _cusr.show().toggleClass('ml-transitions-load');
            $('.ml-ui-actor-dialog .ml-ui-button').toggleClass('ml-transitions-button-load');
            _cusr.find('.runtext-title').text(response.data[0].title)
            _cusr.find('.runtext').html(response.data[0].text)
            if (response.data[0].canSkip == true) {
            }
            var _btLabel = response.data[0].canSkip == true ? 'Skip' : 'Close';
            _cusr.append('<div><span class="ml-ui-button">' + _btLabel + '</span></div>');
            _cusr.find('.ml-ui-button').click(NextScript);
        }
        else {
            _cusr.text('No updates.')
        }
    });
}

function NextScript() {
    OnAjaxPost('/RPGMap/NextScript', {}, function (response, status, xhr) {
        var _cusr = $('.ml-ui-actor-dialog');
        if (ValidateServerResponse(response, status, 'NextScript') == true) {
            if (response.data[0].isEnd == false) {
                if (response.data[0].overlay == false)
                    window.location.reload(true);
                else {
                    _cusr.find('.runtext-title').text(response.data[0].title)
                    _cusr.find('.runtext').html(response.data[0].text)
                    if (response.data[0].canSkip == false) {
                        _cusr.find('.ml-ui-button').text('Close');
                    }
                }
            }
            else {
                _cusr.remove();
            }
        }
        else {
            _cusr.text('No updates.')
        }
    });
}

function CommitMapItem(x, y, z, id, gId, name) {
    OnAjaxPost('/RPGMap/CreateMapItem', { x: x, y: y, z: z, name: name, id: id, gId: gId },
        function (response, status, xhr) {
            if (ValidateServerResponse(response, status, 'CreateMapItem') == true) {
                //Invalidates session
                Core.Scene.Map.ClearAboveFloor(true);
            }
            else {
                alert(response.error);
            }
        });
}

function DeleteMapItem(x, y, z) {
    OnAjaxPost('/RPGMap/DeleteMapItem', { x: x, y: y, z: z },
        function (response, status, xhr) {
            if (ValidateServerResponse(response, status, 'DeleteMapItem') == true) {
                //Invalidates session
                Core.Scene.Map.ClearAboveFloor(true);
            }
            else {
                alert(response.error);
            }
        });
}

//Ajax general methods

function OnAjaxGet(url, data, onSuccess) {
    $.ajaxAntiForgery({
        type: "GET",
        url: url,
        data: data,
        success: function (data, status, xhr) { onSuccess(data, status, xhr); },
        error: function (data, status, xhr) { OnResponseFailure(data, status, xhr); }
    });
}

function OnAjaxPost(url, data, onSuccess) {
    $.ajaxAntiForgery({
        type: "POST",
        url: url,
        data: data,
        success: function (data, status, xhr) { onSuccess(data, status, xhr); },
        error: OnResponseFailure
    });
}

//Anti-forgery jQuery plugin: http://weblogs.asp.net/dixin/archive/2010/05/22/anti-forgery-request-recipes-for-asp-net-mvc-and-ajax.aspx
/// <reference path="jquery-1.4.2.js" />

(function ($) {
    $.getAntiForgeryToken = function (tokenWindow, appPath) {
        // HtmlHelper.AntiForgeryToken() must be invoked to print the token.
        tokenWindow = tokenWindow && typeof tokenWindow === typeof window ? tokenWindow : window;

        appPath = appPath && typeof appPath === "string" ? "_" + appPath.toString() : "";
        // The name attribute is either __RequestVerificationToken,
        // or __RequestVerificationToken_{appPath}.
        var tokenName = "__RequestVerificationToken" + appPath;

        // Finds the <input type="hidden" name={tokenName} value="..." /> from the specified window.
        // var inputElements = tokenWindow.$("input[type='hidden'][name=' + tokenName + "']");
        var inputElements = tokenWindow.document.getElementsByTagName("input");
        for (var i = 0; i < inputElements.length; i++) {
            var inputElement = inputElements[i];
            if (inputElement.type === "hidden" && inputElement.name === tokenName) {
                return {
                    name: tokenName,
                    value: inputElement.value
                };
            }
        }
    };

    $.appendAntiForgeryToken = function (data, token) {
        // Converts data if not already a string.
        if (data && typeof data !== "string") {
            data = $.param(data);
        }

        // Gets token from current window by default.
        token = token ? token : $.getAntiForgeryToken(); // $.getAntiForgeryToken(window).

        data = data ? data + "&" : "";
        // If token exists, appends {token.name}={token.value} to data.
        return token ? data + encodeURIComponent(token.name) + "=" + encodeURIComponent(token.value) : data + ("&_llt=" + encodeURIComponent(lastLoadTime));
    };

    // Wraps $.post(url, data, callback, type) for most common scenarios.
    $.postAntiForgery = function (url, data, callback, type) {
        return $.post(url, $.appendAntiForgeryToken(data), callback, type);
    };

    // Wraps $.ajax(settings).
    $.ajaxAntiForgery = function (settings) {
        // Supports more options than $.ajax(): 
        // settings.token, settings.tokenWindow, settings.appPath.
        var token = settings.token ? settings.token : $.getAntiForgeryToken(settings.tokenWindow, settings.appPath);
        settings.data = $.appendAntiForgeryToken(settings.data, token);
        return $.ajax(settings);
    };
})(jQuery);

	/****************************************************
	*	ML
	* 	ML v.0.0.1.0.a
	* 	Attention: Leave the code within this <script> element unchanged!
	*   DISCLAIMER OF WARRANTY
	*   This source code is provided "as is" and without warranties as to performance or merchantability. The author and/or distributors of this source code may have made statements about this source code. Any such statements do not constitute warranties and shall not be relied on by the user in deciding whether to use this source code.
	*   This source code is provided without any express or implied warranties whatsoever. Because of the diversity of conditions and hardware under which this source code may be used, no warranty of fitness for a particular purpose is offered. The user is advised to test the source code thoroughly before relying on it. The user must assume the entire risk of using the source code.
	*	Author: Tiago Cardoso
	*	Creation date: 25th-Jun-2012
    *   25-Apr-2012 (0.0.1.0-a):	First draft version
	****************************************************/
    var _ML;
	function ML(){};
	//defining the object prototype
	ML.prototype = {
	    //Fallback for local storage
	    localStorage: {},
	    setLocalItem: function (key, item, stringify) {
	        if (window.localStorage)
	            window.localStorage.setItem(key, JSON.stringify(item));
	        else
	            eval("_ML." + key + "=" + JSON.stringify(item));
	    },
	    getLocalItem: function (key) {
	        if (window.localStorage && window.localStorage.getItem(key) != null) {
	            return { hasValue: true, data: JSON.parse(window.localStorage.getItem(key)) };
	        }
	        else {
	            return { hasValue: false };
	        }
	    },
	    setSessionItem: function (key, item, stringify) {
	        if (window.sessionStorage)
	            window.sessionStorage.setItem(key, "" + JSON.stringify(item));
	    },
	    getSessionItem: function (key) {
	        if (window.sessionStorage && window.sessionStorage.getItem(key) != null) {
	            return { hasValue: true, data: JSON.parse(window.sessionStorage.getItem(key)) };
	        }
	        else {
	            return { hasValue: false };
	        }
	    }
	};

	function getUserThumbUrl(user) {
	    return "/UserImageHandler.ashx?s=thumb&u=" + user;
    }