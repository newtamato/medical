#pragma strict

private static var m_instance:UIManager;

public static var UI_MENU:String="menu_dialog";
public static var UI_HOT_LINE:String="hotline_dialog";
public static var UI_ESTIMATE:String="estimate_dialog";
public static var UI_CLASSFICATE_1:String="classficate_1_dialog";
public static var UI_CLASSFICATE_2:String="classficate_2_dialog";
public static var UI_SCORE:String="score_dialog";
public static var UI_SECURITY:String="security_line";
public static var UI_CALL_HOT_LINE_RESULT:String="callHotLineResult_dialog";
public static var UI_TOOL:String = "tool_dialog";

public static var OPERATION_LINE:String = "add_line";
public static var OPERATION_DUN:String = "add_dun";

public var dialog_menu:GameObject;
public var dialog_hotline:GameObject;
public var dialog_estiamte:GameObject;
public var dialog_classfication_1:GameObject;
public var dialog_classfication_2:GameObject;
public var dialog_score:GameObject;
public var dialog_callHotLineResult:GameObject;
public var dialog_tool:GameObject;

private var mDialogQueue:Array;
private var mDialogIndex:int = 0;
private var m_score:int = 0;
private var m_operation:String="";

private var m_finishedDialog:Array ;

public static function getInstance():UIManager{
	return m_instance;
}


function Start () {

	mDialogQueue = new Array();

	m_finishedDialog = new Array();

	m_instance = this;
	avtiveAllDialogToGetDataCompleteEvent();

	showDialog(UI_MENU);

	Global.getInstance().setCurrentState(Global.UI);

	DataManager.getInstance().startLoadData();	
}

function setDialogQueue(queue:Array):void{
	mDialogIndex = 0;
	mDialogQueue = queue;
}
function nextDialog():void{
	if(mDialogQueue ==null || mDialogQueue.length == 0){
		return;
	}
	Debug.Log("UIManager::nextDialog :: mDialogQueue.length = "+ mDialogQueue.length +",mDialogIndex = "+mDialogIndex);

	if(mDialogQueue.length<=mDialogIndex){

		showDialog(UI_SCORE);
		var scoreComponent:ScoreDialog_Controller = dialog_score.GetComponent(ScoreDialog_Controller) as ScoreDialog_Controller;
		if(scoreComponent){
			var score:int = getScore();
			scoreComponent.show(true,score);
		}
		return;
	}
	Debug.Log("UIManager::nextDialog dialogName is "+ mDialogIndex);
	var dialogName:String = mDialogQueue[mDialogIndex];
	
	showDialog(dialogName);
	mDialogIndex++;
}

function addFinishedDialog(name:String):void{
	
	if(isFinished(name)){
		return ;
	}
	m_finishedDialog.push(name);
}

function isFinished(dialogName:String):boolean{
	var count:int = m_finishedDialog.length;
	for(var index:int = 0; index < count ; index ++){
		if(dialogName == m_finishedDialog[index]){
			return true;
		}
	}
	
	return false;
}
function addScore(score:int):void{
	m_score +=score;
	Debug.Log("UIManager::addScore::"+m_score);
}
function getScore():int{
	return m_score;
}
function avtiveAllDialogToGetDataCompleteEvent():void{
	dialog_menu.active = true;
	dialog_menu.SetActiveRecursively(true);

	dialog_hotline.active = true;
	dialog_hotline.SetActiveRecursively(true);

	dialog_estiamte.active = true;
	dialog_estiamte.SetActiveRecursively(true);

	dialog_classfication_1.active = true;
	dialog_classfication_1.SetActiveRecursively(true);

	dialog_classfication_2.active = true;
	dialog_classfication_2.SetActiveRecursively(true);

	dialog_score.active = true;
	dialog_score.SetActiveRecursively(true);

	dialog_callHotLineResult.active = true;
	dialog_callHotLineResult.SetActiveRecursively(true);

	dialog_tool.active = true;
	dialog_tool.SetActiveRecursively(true);

}
function clearAllDialog():void{
	dialog_menu.transform.localPosition.x = 10000;
	dialog_hotline.transform.localPosition.x = 10000;
	dialog_estiamte.transform.localPosition.x = 10000;
	dialog_classfication_1.transform.localPosition.x = 10000;
	dialog_classfication_2.transform.localPosition.x = 10000;
	dialog_score.transform.localPosition.x = 10000;
	dialog_callHotLineResult.transform.localPosition.x = 10000;
	dialog_tool.transform.localPosition.x = 10000;
}

function showCallHotLineResult(str:String):void{
	clearAllDialog();
	dialog_callHotLineResult.transform.localPosition.x = 0;
	dialog_callHotLineResult.transform.localPosition.y = 0;	

	var callResultComponent:CallHotLineResult_Controller = dialog_callHotLineResult.GetComponent(CallHotLineResult_Controller) as CallHotLineResult_Controller;
	callResultComponent.showMassage(str);
}

public function showDialog(dialigName:String):void{
	clearAllDialog();
	if(dialigName == UI_MENU){
		dialog_menu.transform.localPosition.x = 0;
		dialog_menu.transform.localPosition.y = 0;	
		var menu:MenuDialog_Controller = dialog_menu.GetComponent(MenuDialog_Controller);
		menu.show();
	}
	if(dialigName == UI_HOT_LINE){
		dialog_hotline.transform.localPosition.x = 0;
		dialog_hotline.transform.localPosition.y = 0;	
		var ctrl:CallHotLine_Controller = dialog_hotline.GetComponent(CallHotLine_Controller);
		ctrl.show(CallHotLine_Controller.PHONE_PANEL );
	}
	
	if(dialigName == UI_ESTIMATE){
		dialog_estiamte.transform.localPosition.x = 0;
		dialog_estiamte.transform.localPosition.y = 30;	
	}
	
	if(dialigName == UI_CLASSFICATE_1){
		dialog_classfication_1.transform.localPosition.x = 0;
		dialog_classfication_1.transform.localPosition.y = 30;	
	}

	if(dialigName == UI_CLASSFICATE_2){
		dialog_classfication_2.transform.localPosition.x = 70;
		dialog_classfication_2.transform.localPosition.y = 10;

		var class_ctrl:Classficate_Dialog_Controller = dialog_classfication_2.GetComponent(Classficate_Dialog_Controller);
		class_ctrl.show();	
	}
	if(dialigName == UI_SCORE){
		dialog_score.transform.localPosition.x = 234;
		dialog_score.transform.localPosition.y = 72;	
	}
	if(dialigName == UI_SECURITY){
		dialog_tool.transform.localPosition.x = 370.5782;
		dialog_tool.transform.localPosition.y = -261.0464;
		var controller:Tool_Controller = dialog_tool.GetComponent(Tool_Controller);
		controller.changeTheMainCamera();
	}
}


public function getCurrentOperation():String{
	return m_operation;
}

public function setOperation(str:String):void{
	m_operation = str;
}
public function ChangeLayersRecursively(trans : Transform,name : String)
{
    for (var child : Transform in trans)
    {
        child.gameObject.layer = LayerMask.NameToLayer(name);
        ChangeLayersRecursively(child, name);
    }
}

public  function findTransformByName(name:String,parent:Transform):Transform{
	for(var child:Transform in parent){
		Debug.Log("child.gameObject.name = "+ child.gameObject.name);
		if(child.gameObject.name == name){
			return child;
		}
	}
	return null;
}
