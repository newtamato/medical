#pragma strict

function Start () {

}

function Update () {

}


function CheckParentPos():void{
	
	SendMessageUpwards("makeAChoice",SendMessageOptions.DontRequireReceiver);
	Debug.Log("finish one!!!!!!");
	
}