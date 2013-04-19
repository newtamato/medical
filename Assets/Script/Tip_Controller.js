#pragma strict

public var tipText:UILabel;


function Start () {

}

function Update () {

}

function setText(msg:String):void{
	tipText.text = msg;
	Debug.Log(msg,this);
}