import System;
import System.Collections;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;
import System.Collections.Generic;

// Anything we want to store in the XML file, we define it here


class Question{
	@XmlAttribute("id")
	public var id:String;
	@XmlAttribute("answer")
	public var answer:String;
	@XmlAttribute("score")
	public var score:int;
	@XmlAttribute("text")
	public var text:String;
	@XmlAttribute("image")
	public var image:String;
	@XmlAttribute("image_1")
	public var image_1:String;
	
	@XmlArray("Options")
	@XmlArrayItem("Option")
	public var Options:List.<Option> = new List.<Option>();
	
	public function toString():String{
		return id+","+answer+","+score+","+text;
	}
}
class Option{
	@XmlAttribute("id")
	public var id:String;
	@XmlAttribute("answer")
	public var answer:String;
	@XmlAttribute("score")
	public var score:int;
	@XmlAttribute("text")
	public var text:String;
}
class Dialog{
	@XmlAttribute("name")
	public var name:String;
   @XmlAttribute("allscore")
   public var allscore:String;

	@XmlArray("Questions")
	@XmlArrayItem("Question")
	public var Questions:List.<Question> = new List.<Question>();
   public function toString():String{
      var t:String ="";
      for(var q:Question in Questions){
         t += q.toString();
      }
      return name+","+allscore + t;
   }
}
// UserData is our custom class that holds our defined objects we want to store in XML format
@XmlRoot("Game")
 class Game
 {
    // We have to define a default instance of the structure
   @XmlArray("Dialogs")
   @XmlArrayItem("Dialog")
   public var Dialogs:List.<Dialog>;
    // Default constructor doesn't really do anything at the moment
   function Game() { }
}


private var _Save : Rect;
private var _Load : Rect;
private var _SaveMSG : Rect;
private var _LoadMSG : Rect;

private var _FileLocation : String;
private var _FileName : String = "game.xml";

//public GameObject _Player;

private var myData : Game;
private var _data : String;
private var m_allScore:int = 0;
private static var mInstance:DataManager;

//private var VPosition : Vector3;


// When the EGO is instansiated the Start will trigger
// so we setup our initial values for our local members
//function Start () {
function Awake () {

      // Where we want to save and load to and from
      _FileLocation=Application.dataPath;

      // we need soemthing to store the information into
      myData=new Game();
      
      mInstance = this;
}

public static function  getInstance():DataManager{
	return mInstance;
}
function Update () {}

public function startLoadData():void{
   LoadXML();
   Debug.Log("load complete" + _data);
   

}

public function getAllScore():int{
   return m_allScore;
}

function Start()
{

   // ***************************************************
   // Loading The Player...
   // **************************************************
      
      // Load our UserData into myData
      
}

public function getDialog(dialogName:String):Dialog{
	var dialogs:List.<Dialog> = myData.Dialogs;
	for(var dialog:Dialog in dialogs ){
		if(dialog && dialog.name == dialogName){
			return dialog;
		}
	}
	return null;
}

/* The following metods came from the referenced URL */
//string UTF8ByteArrayToString(byte[] characters)
function UTF8ByteArrayToString(characters : byte[] )
{
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var constructedString : String  = encoding.GetString(characters);
   return (constructedString);
}

//byte[] StringToUTF8ByteArray(string pXmlString)
function StringToUTF8ByteArray(pXmlString : String)
{
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var byteArray : byte[]  = encoding.GetBytes(pXmlString);
   return byteArray;
}

   // Here we serialize our UserData object of myData
   //string SerializeObject(object pObject)
function SerializeObject(pObject : Object)
{
   var XmlizedString : String  = null;
   var memoryStream : MemoryStream  = new MemoryStream();
   var xs : XmlSerializer = new XmlSerializer(typeof(Game));
   var xmlTextWriter : System.Xml.XmlTextWriter  = new System.Xml.XmlTextWriter(memoryStream, Encoding.UTF8);
   xs.Serialize(xmlTextWriter, pObject);
   memoryStream = xmlTextWriter.BaseStream; // (MemoryStream)
   XmlizedString = UTF8ByteArrayToString(memoryStream.ToArray());
   return XmlizedString;
}

   // Here we deserialize it back into its original form
   //object DeserializeObject(string pXmlizedString)
function DeserializeObject(pXmlizedString : String)
{
   var xs : XmlSerializer  = new XmlSerializer(typeof(Game));
   var memoryStream : MemoryStream  = new MemoryStream(StringToUTF8ByteArray(pXmlizedString));
   var xmlTextWriter : System.Xml.XmlTextWriter  = new System.Xml.XmlTextWriter(memoryStream, Encoding.UTF8);
   return xs.Deserialize(memoryStream);
}

   // Finally our save and load methods for the file itself
function CreateXML()
{
   var writer : StreamWriter;
   //FileInfo t = new FileInfo(_FileLocation+"\\"+ _FileName);
   var t : FileInfo = new FileInfo(_FileLocation+"/"+ _FileName);
   if(!t.Exists)
   {
      writer = t.CreateText();
   }
   else
   {
      t.Delete();
      writer = t.CreateText();
   }
   writer.Write(_data);
   writer.Close();
   Debug.Log("File written.");
}

function LoadXML()
{
   Debug.Log("_FileLocation = "+_FileLocation);
   
   // var webReq:WWW = new WWW(_FileLocation+"/"+ _FileName);

   // yield  webReq;

   // _data = webReq.text;

   var r : StreamReader = File.OpenText(_FileLocation+"/"+ _FileName);
   var _info : String = r.ReadToEnd();
   r.Close();
   _data=_info;
   if(_data )
   {
      
      myData = DeserializeObject(_data);
      // set the players position to the data we loaded
      
      var dialogs:List.<Dialog> = myData.Dialogs;
      
      for(var dialog:Dialog in dialogs ){
         if(dialog){
            Debug.Log(dialog.toString());
            m_allScore += parseInt(dialog.allscore);
         }
      }
      
      BroadcastMessage("onLoadDataComplete",SendMessageOptions.DontRequireReceiver);
   }
   //Debug.Log("_data = "+ _data);
   //return;
   //  Debug.Log("file path is "+ _FileLocation+"/"+ _FileName);
   //  var r : StreamReader = File.OpenText(_FileLocation+"/"+ _FileName);
   //  var _info : String = r.ReadToEnd();
   //  r.Close();
   // _data=_info;
   
}
static function RandomizeBuiltinArray(arr : List.<Question>)
{
   var count:int = arr.Count;
    for (var i = count - 1; i > 0; i--) {
        var r = UnityEngine.Random.Range(0,i);
        var tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
    }
}