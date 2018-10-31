function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
        splits = s.split(",");
        
        for (var j=0,len=splits.length; i<len; i++)
        {
            post(splits[i]);
            post("\n");
        }
      
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}

var push;
var selectButtons;
var stateButtons;

// initialisations
function bang() {
    push = new LiveAPI("live_app control_surfaces 0");
    selectButtons = new Array();
    stateButtons = new Array();
    
    // take control of select and state buttons
    Track_State_Buttons = push.call("get_control", "Track_State_Buttons");
    Track_Select_Buttons = push.call("get_control", "Track_Select_Buttons");
    
    // store de api for the select and state buttons
    for(var i=0; i<8; i++)
    {
        selectButtons.push(new LiveAPI("live_app control_surfaces 0 controls "+ (i + 44)));
        stateButtons.push(new LiveAPI("live_app control_surfaces 0 controls "+ (i + 44 + 9)));
    }
    
    var foo = new LiveAPI(callback);
	foo.path = "live_set tracks 2 mixer_device volume"
	foo.property = "value";
}


function callback(args)
{
	outlet(0,args);
    log(args);
}

function release()
{
    push.call("release_control", Track_State_Buttons);
    push.call("release_control", Track_Select_Buttons);
}

function grab()
{
    push.call("grab_control", Track_State_Buttons);
    push.call("grab_control", Track_Select_Buttons);

    // default light
    for(var i=0; i<8; i++)
    {
        selectButtons[i].call("set_light", "99");
        stateButtons[i].call("set_light", "99");
    }
}

