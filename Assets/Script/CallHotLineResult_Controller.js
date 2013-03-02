#pragma strict

public var label:UILabel;
function Start () {

}

function Update () {

}

function onConfirm():void{
	UIManager.getInstance().nextDialog();
}

function showMassage(str:String):void{
	label.text = str;
}