#pragma strict
private var mCallBack:Function;
function Start () {

}

function setCallBack(callback:Function):void{
	Debug.Log("setCallBack............");
	mCallBack = callback;
}

function execute():void{
	if(null != mCallBack){
		Debug.Log("execute............");
		mCallBack();
	}
}