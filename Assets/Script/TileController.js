#pragma strict

public var col:int = 0;
public var row:int = 0;
private var mCallBack:Function=null;
function Start () {

}

function Update () {

}

function setCallBack(cb:Function):void{
	mCallBack = cb;
}

