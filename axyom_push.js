inlets = 1;
outlets = 1;

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

// classes
//--------------------------------------------------------------------
// Note class
 
function Button(liveObject) 
{
    this.object = liveObject; // reference to the liveObject
    this.state = 0; // On/Off
}
 
Button.prototype.set_light = function(val) 
{
    this.object.call("set_light", val);
}

Button.prototype.toggle = function() 
{
    if(this.state == 0)
    {
        this.object.call("set_light", 1);
        this.state = 1;
    }
    else
    {
        this.object.call("set_light", 0);
        this.state = 0;
    }
}
//--------------------------------------------------------------------

// variables globales

var push;
var selectButtons;
var stateButtons;

// initialisations
function bang() 
{
    push = new LiveAPI("live_app control_surfaces 0");
    selectButtons = new Array();
    stateButtons = new Array();
    
    // take control of select and state buttons
    Track_State_Buttons = push.call("get_control", "Track_State_Buttons");
    Track_Select_Buttons = push.call("get_control", "Track_Select_Buttons");
    
    // store de api for the select and state buttons
    for(var i=0; i<8; i++)
    {
        selectButtons.push(new Button(new LiveAPI("live_app control_surfaces 0 controls "+ (i + 44))));
        stateButtons.push(new Button(new LiveAPI("live_app control_surfaces 0 controls "+ (i + 44 + 9))));
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
        selectButtons[i].set_light("99");
        stateButtons[i].set_light("99");
    }
}

function list() // midi cc to buttons
{
    log(arguments[0] + " " + arguments[1]);

    if (arguments[1] == 127) // toggle button
    {
        var i
        
        if (arguments[0] < 100) // select buttons
        {
            var i = arguments[0]-20;
            selectButtons[i].toggle();
        }
        else // state buttons
        {
            var i = arguments[0]-102;
            stateButtons[i].toggle();
        }
    }
}