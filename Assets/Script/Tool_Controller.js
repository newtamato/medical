#pragma strict

private var m_current:String;


function Start () {

}

function Update () {

}

public function onSelectLine():void{
	var opt:String = UIManager.OPERATION_LINE;
	UIManager.getInstance().setOperation(opt);
	Global.getInstance().setCurrentState(Global.SCENE);

	Global.getInstance().test ="";	
}

public function onSelectDun():void{
	Global.getInstance().test = "debug";
	var opt:String = UIManager.OPERATION_DUN;
	UIManager.getInstance().setOperation(opt);
	Global.getInstance().setCurrentState(Global.SCENE);
	Global.getInstance().test ="";
}

public function onComplete():void{
	Global.getInstance().setCurrentState(Global.UI);
	UIManager.getInstance().nextDialog();	
}