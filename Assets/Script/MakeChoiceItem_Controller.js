#pragma strict

public var container:GameObject;
function Start () {

}

function Update () {

}
function onDropToChangeDisplay(){
	if(container){
		container.transform.position.z = 0;
	}
	
}