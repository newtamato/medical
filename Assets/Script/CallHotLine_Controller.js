#pragma strict

public var showNumber:GameObject;
public var questionList:GameObject;
public var itemPrefab:GameObject;

public var hotlinePanel:GameObject;
public var phonePanel:GameObject;


private var mQuestions:List.<Question>;

//private var mCurrentIndex:int = 0;

// private var mFirstPhaseQuestionNumber:int = 5;
private var m_score:int = 0;
public static var PHONE_PANEL:String = "phone";
public static var HOT_LINE_PANEL:String = "hotline";


function Start () {
	m_score = 0;
	initPhone();
	initHotLinePanel();
	
}
function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}
public function init():void{
	m_score = 0;
	initPhone();
	initHotLinePanel();
	setData();
}
function initPhone():void{
	if(showNumber){
		var label:UILabel = showNumber.GetComponent("UILabel");
		label.text = "";	
	}
	phonePanel.active = false;
	phonePanel.SetActiveRecursively(false);
	phonePanel.transform.localPosition = new Vector3(0,0,0);
}

function initHotLinePanel():void{
	if(hotlinePanel){
		// hotlinePanel.transform.localPosition.x = 10000;
		hotlinePanel.active = false;
		hotlinePanel.SetActiveRecursively(false);	
		hotlinePanel.transform.localPosition = new Vector3(0,0,0);
	}
}

function show(name:String):void{
	hotlinePanel.active = false;
	hotlinePanel.SetActiveRecursively(false);	
	phonePanel.active = false;
	phonePanel.SetActiveRecursively(false);
	if(PHONE_PANEL == name){
		phonePanel.active = true;
		phonePanel.SetActiveRecursively(true);
	}else{
		hotlinePanel.active = true;
		hotlinePanel.SetActiveRecursively(true);
	}
}

function onLoadDataComplete () {
	Debug.Log("callHotLine::onLoadDataComplete");
	var dialogData:Dialog = DataManager.getInstance().getDialog("callHotLine");
	var questions:List.<Question> = dialogData.Questions;
	mQuestions = questions;	
	
	setData();
//	onUpPage();
}

function setData():void{
	
	DataManager.getInstance().RandomizeBuiltinArray(mQuestions);

	var grid:UIGrid = questionList.GetComponent("UIGrid") as UIGrid;

	// UIManager.getInstance().clearnChildren(questionList.transform);
	var childCount :int = questionList.transform.childCount;
	if(childCount >= mQuestions.Count){
		for(var i:int = 0;i< childCount;i++){
			var childTrans:Transform = questionList.transform.GetChild(i);
			if(childTrans){
				var cbx:UICheckbox = childTrans.GetComponent(UICheckbox);
				cbx.isChecked = false;
			}
		}
	}else{
		var index:int = mQuestions.Count;
		for(var itemData:Question in mQuestions){
			var item:GameObject = Instantiate(itemPrefab);
			item.transform.parent = questionList.transform;
			item.name = "question_"+index--;
			item.transform.localScale = new Vector3(1,1,1);
			item.transform.localPosition = new Vector3(0,0,0);
			item.AddComponent(UIDragPanelContents);
			var label:UILabel =item.GetComponent(UILabel);
			var itemDataComponent:HotLineQuestionItem_Controller = item.GetComponent(HotLineQuestionItem_Controller) as HotLineQuestionItem_Controller;
			itemDataComponent.questionData = itemData;
			itemDataComponent.label.text = itemData.text;
		}
		grid.Reposition();
		
		UIManager.getInstance().ChangeLayersRecursively(gameObject.transform,"uilayer");
	}
}

function pressKey_0():void{
	pressKey("0");
}
function pressKey_1():void{
	pressKey("1");
}
function pressKey_2():void{
	pressKey("2");
}
function pressKey_3():void{
	pressKey("3");
}
function pressKey_4():void{
	pressKey("4");
}
function pressKey_5():void{
	pressKey("5");
}
function pressKey_6():void{
	pressKey("6");
}
function pressKey_7():void{
	pressKey("7");
}
function pressKey_8():void{
	pressKey("8");
}
function pressKey_9():void{
	pressKey("9");
}
function pressKey(num:String):void{
	if(null == showNumber){
		return;
	}
	var label:UILabel = showNumber.GetComponent("UILabel");
	var str:String = label.text;
	str = str+num;
	label.text = str;
}

function onDeleteBack():void{
	var label:UILabel = showNumber.GetComponent("UILabel");
	var str:String = label.text ;
	if(str.length == 0){
		return;
	}
	str = str.Substring(0,str.length-1);	
	label.text = str;
}

function onPressCall():void{
	var label:UILabel = showNumber.GetComponent("UILabel");
	var str:String = label.text ;
	if(str == "120"){
		//UIManager.getInstance().addScore(3);
		m_score+=3;
	}
	//hotlinePanel.transform.localPosition.x = -140;
	show(HOT_LINE_PANEL);
}

function onPressQuit():void{
	Debug.Log("press quit");
	// var callBackComponent:SetCallBack = gameObject.GetComponent("SetCallBack");
	// callBackComponent.execute();
}

function onConfim():void{
	var rightNumber:int = 0;
	for(var i:int = 0;i<questionList.transform.childCount;i++){
		var child:Transform = questionList.transform.GetChild(i);		
		var checkbox:UICheckbox = child.gameObject.GetComponent(UICheckbox) as UICheckbox;  
		var itemDataComponent:HotLineQuestionItem_Controller = child.gameObject.GetComponent(HotLineQuestionItem_Controller) as HotLineQuestionItem_Controller;
		
		if(checkbox.isChecked){
			var qData:Question = itemDataComponent.questionData ;
			
			if(qData.answer == "right"){
				m_score += qData.score;
				rightNumber++;
			}	
		}
	}
	UIManager.getInstance().addScore(m_score);
	// Debug.Log("m_score = "+ m_score);
	if(rightNumber == 0){
		Debug.Log("rightNumber = "+ rightNumber);
		UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_2);
	}else if(rightNumber == 4){
		UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_0);
	}else{
		UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_1);
	}

	//UIManager.getInstance().nextDialog();
}
