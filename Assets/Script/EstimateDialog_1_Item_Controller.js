#pragma strict

public var img:UISprite;
function Start () {

}

function Update () {

}
function CheckParent():void{
	this.transform.localPosition.z = DragDropRoot.root.localPosition.z;
	Debug.Log("[EstimateDialog_item_1_Controller::CheckParent::]"+DragDropRoot.root.localPosition.z);
}