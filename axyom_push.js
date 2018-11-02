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
 
function Button(path, name, callback) 
{
    this.liveObject = new LiveAPI(callback); // reference to the liveObject
    this.liveObject.path = path;
    this.liveObject.property = "value";
    this.liveObject.name = name;
    this.state = 0; // On/Off
}
 
Button.prototype.set_light = function(val) 
{
    this.liveObject.call("set_light", val);
}

Button.prototype.toggle = function() 
{
    if(this.state == 0)
    {
        this.liveObject.call("set_light", 1);
        this.state = 1;
    }
    else
    {
        this.liveObject.call("set_light", 0);
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
var arrows;
var ctr_path = "live_app control_surfaces 0";


// initialisations
function bang() 
{
    push = new LiveAPI(ctr_path);
    selectButtons = new Array();
    stateButtons = new Array();
    arrows = new Array();
    
    // take control of select and state buttons
    Track_State_Buttons = push.call("get_control", "Track_State_Buttons");
    Track_Select_Buttons = push.call("get_control", "Track_Select_Buttons");
    
    //Arrows
    for(var i=0; i<4; i++)
    {
        arrows.push(new Button(ctr_path+" controls "+(i+4), i, callback_arrows));
    }

    push.call("release_control", push.call("get_control", "Up_Arrow"));
    
    // select and state buttons
    for(var i=0; i<8; i++)
    {
        selectButtons.push(new Button(ctr_path+" controls "+(i + 44), i, callback_select));
        stateButtons.push(new Button(ctr_path + " controls "+ (i + 44 + 9), i, callback_state));
    }
}

// Arrow callbacks
function callback_arrows(args)
{
    log(args);
    switch(this.name)
    {
        case 0:
        {
            
        }
        break;
        case 1:
        {
            
        }
        break;
        case 2:
        {
            
        }
        break;
        case 3:
        {
            
        }
        default:
        break;
    };
}

function callback_select(args)
{
    if (args[1] == 127)
        selectButtons[this.name].toggle();
}

function callback_state(args)
{
    if (args[1] == 127)
        stateButtons[this.name].toggle();
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
