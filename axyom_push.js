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
 
function Button(path, name, callback, colorOn, colorOff) 
{
    this.liveObject = new LiveAPI(callback); // reference to the liveObject
    this.liveObject.path = path;
    this.liveObject.property = "value";
    this.liveObject.name = name;
    this.state = 0; // On/Off
    this.colorOn = colorOn;
    this.colorOff = colorOff;
}
 
Button.prototype.set_light = function(val) 
{
    this.liveObject.call("set_light", val);
}

Button.prototype.toggle = function() 
{
    if(this.state == 0)
    {
        this.liveObject.call("set_light", this.colorOn);
        this.state = 1;
    }
    else
    {
        this.liveObject.call("set_light", this.colorOff);
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
var sessionBox;
var ctr_path = "live_app control_surfaces 0";
var liveSet;
var liveSetView;


// initialisations
function bang() 
{
    push = new LiveAPI(ctr_path);
    selectButtons = new Array();
    stateButtons = new Array();
    arrows = new Array();
    sessionBox = new SessionBox();
    liveSet = new LiveAPI("live_set");
    liveSetView = new LiveAPI("live_set view");
    
    // take control of select and state buttons
    Track_State_Buttons = push.call("get_control", "Track_State_Buttons");
    Track_Select_Buttons = push.call("get_control", "Track_Select_Buttons");
    
    //Arrows
    for(var i=0; i<4; i++)
    {
        arrows.push(new Button(ctr_path+" controls "+(i+4), i, callback_arrows, 1, 0));
    }

    push.call("release_control", push.call("get_control", "Up_Arrow"));
    
    // select and state buttons
    for(var i=0; i<8; i++)
    {
        selectButtons.push(new Button(ctr_path+" controls "+(i + 44), i, callback_select, 10, 13));
        stateButtons.push(new Button(ctr_path+" controls "+ (i + 44 + 9), i, callback_state, 97, 117));
    }
}

// Arrow callbacks
function callback_arrows(args)
{
    if (args[1] == 127)
    {
        var scenesLen, tracksLen;
        scenesLen = liveSet.get("scenes").length/2;
        tracksLen = liveSet.get("visible_tracks").length/2;

        switch(this.name)
        {
            case 0: //up
            {
                if (sessionBox.scene_offset > 0)
                {
                    sessionBox.scene_offset--;
                    log("scene off " + sessionBox.scene_offset);
                }
            }
            break;
            case 1: //down
            {
                if (sessionBox.scene_offset < scenesLen-1)
                {
                    sessionBox.scene_offset++;
                    log("scene off " + sessionBox.scene_offset);
                }
            }
            break;
            case 2: //left
            {
                if (sessionBox.track_offset > 0)
                {
                    sessionBox.track_offset--;
                    log("track off " + sessionBox.track_offset);
                } 
            }
            break;
            case 3: //right
            {
                if (sessionBox.track_offset < tracksLen-1)
                {
                    sessionBox.track_offset++;
                    log("track off " + sessionBox.track_offset);
                } 
            }
            default:
            break;
        }
    }
}

function callback_select(args)
{
    if (args[1] == 127)
    {
        var visible_tracks = liveSet.get("visible_tracks");
        var index = this.name + sessionBox.track_offset;
        index = 2*index + 1;
        
        if (index < visible_tracks.length)
        {
            //selectButtons[this.name].toggle();
            liveSetView.set("selected_track", "id", visible_tracks[index]);
        }
        
        update(); //not optimal but good enough
    }    
}

function callback_state(args)
{
    if (args[1] == 127)
    {
        var index = this.name + sessionBox.track_offset;
        var visible_tracks = liveSet.get("visible_tracks");
        if (index < visible_tracks.length)
        {
            //stateButtons[this.name].toggle();
            track = new LiveAPI("live_set tracks " + index)
            var muted = track.get("mute");
            track.set("mute", 1-muted);
        }

        update(); //not optimal but good enough
    }
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
    update();
}

function update()
{
    var visible_tracks = liveSet.get("visible_tracks");
    var selected_track = liveSetView.get("selected_track");
    var tracks_to_show = visible_tracks.length/2-sessionBox.track_offset;
    log(selected_track);
    
    //select
    for(var i=0; i<tracks_to_show; i++)
    {   
        track = new LiveAPI("live_set tracks " + (i+sessionBox.track_offset));
        log(track.id);
        
        if (track.id == selected_track[1])
        {
            selectButtons[i].set_light(selectButtons[i].colorOn);
        }
        else
        {
            selectButtons[i].set_light(selectButtons[i].colorOff);
        }
    }

    //mute
    for(var i=0; i<tracks_to_show; i++)
    {
        track = new LiveAPI("live_set tracks " + (i+sessionBox.track_offset))
        var muted = track.get("mute");
        
        if (muted == 1)
        {   
            stateButtons[i].set_light(stateButtons[i].colorOff);
        }
        else
        {
            stateButtons[i].set_light(stateButtons[i].colorOn);
        }    
    }

    // turn off the other pads
    for (var i=tracks_to_show;i<8; i++)
    {
        stateButtons[i].set_light(0);
        selectButtons[i].set_light(0);
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
