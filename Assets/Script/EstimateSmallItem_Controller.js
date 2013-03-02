#pragma strict

public var img:UISprite;
function Start () {

}

function Update () {

}

function onDropToChangeDisplay():void{
	Debug.Log("estiamte small item drop complete");
	var data:DataItem_Controller = gameObject.GetComponent(DataItem_Controller) as DataItem_Controller;
	if(data.image){
		Debug.Log("data.image = "+data.image);
		img.spriteName = data.image;
	}
	
	
}