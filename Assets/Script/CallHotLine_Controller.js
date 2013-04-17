class CallHotLine_Controller extends BaseDialog{
public var showNumber:GameObject;
public var questionList:GameObject;
public var itemPrefab:GameObject;

public var hotlinePanel:GameObject;
public var phonePanel:GameObject;


private var mQuestions:List.<Question>;
private var mAllQuestions:List.<Question>;
//private var mCurrentIndex:int = 0;

// private var mFirstPhaseQuestionNumber:int = 5;

public static var PHONE_PANEL:String = "phone";
public static var HOT_LINE_PANEL:String = "hotline";
private var m_firstPage:Boolean = true;
private var mRightNumber:int = 0;
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
	m_firstPage = true;
	mRightNumber = 0;
	initPhone();
	initHotLinePanel();
	setData();

	
	Debug.Log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
}

function makeButtonAppearance(nextBtnVisible:Boolean ):void
{
	Debug.Log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	var nextBtn:Transform = UIManager.getInstance().findTransformByName("nextBtn",hotlinePanel.transform);
	if(nextBtn){
		nextBtn.gameObject.SetActiveRecursively(nextBtnVisible);
		nextBtn.gameObject.active = nextBtnVisible;	
	}
	

	var okConfirm:Transform = UIManager.getInstance().findTransformByName("okBtn",hotlinePanel.transform);
	if(okConfirm){
		nextBtnVisible = !nextBtnVisible;
		Debug.Log("!nextBtnVisible = " +nextBtnVisible);
		okConfirm.gameObject.SetActiveRecursively(nextBtnVisible);
		okConfirm.gameObject.active = nextBtnVisible;		
	}
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
		makeButtonAppearance(true);
	}
}

function onLoadDataComplete () {
	Debug.Log("callHotLine::onLoadDataComplete");
	var dialogData:Dialog = DataManager.getInstance().getDialog("callHotLine");
	var questions:List.<Question> = dialogData.Questions;
	mAllQuestions = questions;	
	if(m_firstPage == true){
		mQuestions = questions.GetRange(0,4);
	}
	setData();
//	onUpPage();
}
override public function close():void{

}
override public function setData():void{
	
	DataManager.getInstance().RandomizeBuiltinArray(mQuestions);

	var grid:UIGrid = questionList.GetComponent("UIGrid") as UIGrid;

	UIManager.getInstance().clearnChildren(questionList.transform);
	// var childCount :int = questionList.transform.childCount;
	// if(childCount >= mQuestions.Count){
	// 	for(var i:int = 0;i< childCount;i++){
	// 		var childTrans:Transform = questionList.transform.GetChild(i);
	// 		if(childTrans){
	// 			var cbx:UICheckbox = childTrans.GetComponent(UICheckbox);
	// 			cbx.isChecked = false;
	// 		}
	// 	}
	// }else{
		
	// }

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

function onConfim():void {
	// caculate all the score
	
	for(var i:int = 0;i<questionList.transform.childCount;i++){
		var child:Transform = questionList.transform.GetChild(i);		
		var checkbox:UICheckbox = child.gameObject.GetComponent(UICheckbox) as UICheckbox;  
		var itemDataComponent:HotLineQuestionItem_Controller = child.gameObject.GetComponent(HotLineQuestionItem_Controller) as HotLineQuestionItem_Controller;
		
		if(checkbox.isChecked){
			var qData:Question = itemDataComponent.questionData ;
			
			if(qData.answer == "right"){
				m_score += qData.score;
				mRightNumber++;
			}	
		}
	}

	if(m_firstPage == true){
		makeButtonAppearance(false);
		m_firstPage = false;
		var num:int = mAllQuestions.Count;
		mQuestions = mAllQuestions.GetRange(5,num-5);
		setData();
	}else{
		// finish this dialgo and all score 	
		UIManager.getInstance().addScore(m_score);
		
		if(mRightNumber == 0){
			Debug.Log("rightNumber = "+ mRightNumber);
			UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_2);
		}else if(mRightNumber == 4){
			UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_0);
		}else{
			UIManager.getInstance().showCallHotLineResult(CallHotLineResult_Controller.RESULT_ANSWER_1);
		}
	}
	//UIManager.getInstance().nextDialog();
}
}