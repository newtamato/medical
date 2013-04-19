#pragma strict

public var back:UISprite;
public var img:UISprite;
private var m_data:Question;
function Start () {

}

function Update () {

}

function setData(data:Question):void{
	m_data = data;
}

function getToolTipString():String{
	if(m_data){
		return m_data.text;
	}
}


