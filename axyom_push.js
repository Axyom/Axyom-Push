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
// Session Box Class
 
function SessionBox(liveObject) 
{
    this.object = liveObject; // reference to the liveObject
    this.track_offset = 0;
    this.scene_offset = 0;
}
 

//--------------------------------------------------------------------


// variables globales

var push;
var selectButtons;
var stateButtons;
var Track_State_Buttons;
var Track_Select_Buttons;
var rightArrow;
var leftArrow;
var upArrow;
var downArrow;
var ctr_path = "live_app control_surfaces 0";


// initialisations
function bang() 
{
    

    push = new LiveAPI(ctr_path);
    selectButtons = new Array();
    stateButtons = new Array();
    
    // take control of select and state buttons
    Track_State_Buttons = push.call("get_control", "Track_State_Buttons");
    Track_Select_Buttons = push.call("get_control", "Track_Select_Buttons");
    rightArrow = new LiveAPI(callback_rightArrow);
    rightArrow.path = ctr_path + " controls 7";
    rightArrow.property = "value";
    leftArrow = new LiveAPI(callback_leftArrow);
    leftArrow.path = ctr_path + " controls 6";
    leftArrow.property = "value";
    upArrow = new LiveAPI(callback_upArrow);
    upArrow.path = ctr_path + " controls 4"; 
	upArrow.property = "value";
    downArrow = new LiveAPI(callback_downArrow); 
    downArrow.path = ctr_path + " controls 5";
    downArrow.property = "value";

    //push.call("grab_control", push.call("get_control", "Up_Arrow"));
    
    // store de api for the select and state buttons
    for(var i=0; i<8; i++)
    {
        selectButtons.push(new Button(new LiveAPI(ctr_path + " controls "+ (i + 44))));
        stateButtons.push(new Button(new LiveAPI(ctr_path + " controls "+ (i + 44 + 9))));
    }
    
    /*var foo = new LiveAPI(callback);
	foo.path = "live_set tracks 2 mixer_device volume"
	foo.property = "value";*/
}

// Arrow callbacks
function callback_upArrow(args)
{
	outlet(0,args);
    log(args);
}
function callback_downArrow(args)
{
	outlet(0,args);
    log(args);
}
function callback_rightArrow(args)
{
	outlet(0,args);
    log(args);
}
function callback_leftArrow(args)
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

function obs()
{
    for(var i=0; i<256; i++)
    {
        o = new LiveAPI(ctr_path + " controls " + i.toString());
        nam = o.get("name").toString();
        //if (nam.indexOf("Session") !== -1)
            log(i + " " + nam);
    }

    o = new LiveAPI(ctr_path + " 0 components 152");
    log(o.info);
}
