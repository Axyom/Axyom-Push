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

var api;

// initialisations
function bang() {
    api = new LiveAPI("live_app control_surfaces 0");
    //log('push path:', api.path);
    // do stuff with the Device object...
    //log(api.call("get_control_names"));
    Track_State_Buttons = api.call("get_control", "Track_State_Buttons");
    api.call("grab_control", Track_State_Buttons);
    Track_Select_Buttons = api.call("get_control", "Track_Select_Buttons");
    api.call("grab_control", Track_Select_Buttons);
    
    Track_Select_Buttons_Object = new LiveAPI("live_app control_surfaces 0 controls 45");
    log(Track_Select_Buttons_Object.info);
    Track_Select_Buttons_Object.call("set_light", "25");
    
    
    //api.call("release_control", Track_State_Buttons);
    //api.call("release_control", Track_Select_Buttons);
    var foo = new LiveAPI(callback);
	foo.path = "live_set tracks 2 mixer_device volume"
	foo.property = "value";
}

// notes:
// 52 : track selection


function callback(args)
{
	outlet(0,args);
    log(args);
}

