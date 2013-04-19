#pragma strict

private var m_id:String;
private var m_msg:String;
private var m_data:Question;

public var p_back:UISprite;
public var patient_item:UISprite;


private var m_callBack:Function=null;
function Start () {

}

function setData (id:String,msg:String,imageURL:String,data:Question,back:String) {
	m_id = id;	
	m_msg = msg;
	m_data = data;

	if(null!=imageURL){
		patient_item.spriteName = imageURL;
	}
	p_back.spriteName = back;
}

function getData():Question{
	return m_data;
}
function setMouseOverFunction(callBack:Function):void{

	m_callBack = callBack;
}

function onMouseOverHandle():void{
	if(null!= m_callBack){
		m_callBack(m_id,m_msg,gameObject.name,gameObject);
	}
	BroadcastMessage("onMouseOverToPatientItem","@@@@@@@@",SendMessageOptions.DontRequireReceiver);
}