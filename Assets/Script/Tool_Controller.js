#pragma strict

private var m_current:String;
public var layer:GameObject;

function Start () {

}

function Update () {

}

public function onSelectLine():void{
	// var opt:String = UIManager.OPERATION_LINE;
	// UIManager.getInstance().setOperation(opt);
	// Global.getInstance().setCurrentState(Global.SCENE);

	// Global.getInstance().test ="";	
}

public function onSelectDun():void{
	// Global.getInstance().test = "debug";
	// var opt:String = UIManager.OPERATION_DUN;
	// UIManager.getInstance().setOperation(opt);
	// Global.getInstance().setCurrentState(Global.SCENE);
	// Global.getInstance().test ="";
}

public function onComplete():void{
	// if(layer){
	// 	var barrier:setRoadBarrier = layer.GetComponent(setRoadBarrier);
	// 	barrier.computerScore();
	// }
	
	Global.getInstance().setCurrentState(Global.UI);
	UIManager.getInstance().activeSceneAndDeactiveMap(true);
	UIManager.getInstance().nextDialog();	
	UIManager.getInstance().addFinishedDialog(UIManager.UI_SECURITY);	
	
	
}

public function changeTheMainCamera():void{
	return;
	Camera.main.fieldOfView = 43;
	Camera.main.transform.localPosition = new Vector3(30,38,0);
	Camera.main.transform.localEulerAngles = new Vector3(34,326,357);
}