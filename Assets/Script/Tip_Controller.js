#pragma strict

public var tipText:UILabel;
public var tip_back:UISlicedSprite;

function Start () {

}

function Update () {

}

function setText(msg:String):void{
	tipText.text = msg;
	if(msg){
		var count:int = msg.Length/450;
		if(count>2){
			tip_back.transform.localScale= new Vector3(600,100,1);
		}
	}
}