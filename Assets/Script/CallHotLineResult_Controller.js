#pragma strict

public var label:UILabel;
public static var RESULT_ANSWER_0:String = "answer_0";
public static var RESULT_ANSWER_1:String = "answer_1";
public static var RESULT_ANSWER_2:String = "answer_2";
function Start () {

}

function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}

function onConfirm():void{
	UIManager.getInstance().nextDialog();

	UIManager.getInstance().addFinishedDialog(UIManager.UI_HOT_LINE);
}
public function init():void{

}
function showMassage(str:String):void{
	var uiTrans:Transform = UIManager.getInstance().findTransformByName("result",transform);
	var uiSprite:UISprite = uiTrans.GetComponent(UISprite);
	if(uiSprite){
		uiSprite.spriteName = str;
	}
}

