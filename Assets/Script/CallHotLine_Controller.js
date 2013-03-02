#pragma strict

public var showNumber:GameObject;
public var questionList:GameObject;
public var itemPrefab:GameObject;
public var hotlinePanel:GameObject;

private var mQuestions:List.<Question>;

private var mCurrentIndex:int = 0;

private var mFirstPhaseQuestionNumber:int = 5;
private var m_score:int = 0;



function Start () {
	if(showNumber){
		var label:UILabel = showNumber.GetComponent("UILabel");
		label.text = "";	
	}
	if(hotlinePanel){
		hotlinePanel.transform.localPosition.x = 10000;
		
	}
}

function onLoadDataComplete () {
	Debug.Log("callHotLine::onLoadDataComplete");
	var dialogData:Dialog = DataManager.getInstance().getDialog("callHotLine");
	var questions:List.<Question> = dialogData.Questions;
	mQuestions = questions;	
	setData(mQuestions);
//	onUpPage();
}

function setData(questionDataList:List.<Question>):void{
	var grid:UITable = questionList.GetComponent("UITable") as UITable;

	var gridTransform:Transform = grid.transform;
	for(var i:int = 0;i<gridTransform.childCount;i++){
		var child:Transform = gridTransform.GetChild(i);
		Destroy(child.gameObject);
	}
	//var index:int = 0;
	for(var itemData:Question in questionDataList){
		var item:GameObject = Instantiate(itemPrefab);
		item.transform.parent = questionList.transform;
		//item.name = "question_"+index++;
		item.transform.localScale = new Vector3(1,1,1);
		item.transform.localPosition = new Vector3(0,0,0);
		var itemDataComponent:HotLineQuestionItem_Controller = item.GetComponent(HotLineQuestionItem_Controller) as HotLineQuestionItem_Controller;
		itemDataComponent.questionData = itemData;
		// itemDataComponent.SetCheckBox(setCheckbox);
		itemDataComponent.label.text = itemData.text;
	}
	grid.Reposition();
	
	UIManager.getInstance().ChangeLayersRecursively(gameObject.transform,"uilayer");
}


public function getFirstPhaseQuestionsData():Question[]{
	var resultList:Question[]  = new Question[mFirstPhaseQuestionNumber];
	
	(mQuestions as List.<Question>).CopyTo(0,resultList,0,mFirstPhaseQuestionNumber);
	//.CopyTo(m_startIndex,resultList,0,4);
	return resultList;
}

public function getSecondPhaseQuestionsData():Question[]{
	var resultList:Question[]  = new Question[3];
	
	(mQuestions as List.<Question>).CopyTo(5,resultList,0,3);
	//.CopyTo(m_startIndex,resultList,0,4);
	return resultList;
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
		
		UIManager.getInstance().addScore(3);
	}
	hotlinePanel.transform.localPosition.x = -140;
	// hotlinePanel.active = true;
	// hotlinePanel.SetActiveRecursively(true);
}

function onPressQuit():void{
	Debug.Log("press quit");
	// var callBackComponent:SetCallBack = gameObject.GetComponent("SetCallBack");
	// callBackComponent.execute();
}

function onDownPage():void{
	// var secondQuestionDatas:Question[] = getSecondPhaseQuestionsData();
	// setData(secondQuestionDatas);
	// questionList.transform.localPosition.y+=50;
	/*
	mCurrentIndex++;
	if(mCurrentIndex>7){
		mCurrentIndex = 7;
	}
	showQuestion(mCurrentIndex);
	*/
	if(questionList.transform.localPosition.y >=220){
		return;
	}
	questionList.transform.localPosition.y +=20;


}
function onUpPage():void{
	
	
	// mCurrentIndex--;
	// if(mCurrentIndex<0){
	// 	mCurrentIndex = 0;
	// }
	// showQuestion(mCurrentIndex);
	if(questionList.transform.localPosition.y <40){
		return;
	}
	questionList.transform.localPosition.y -=20;
}

function showQuestion(index:int):void{
	Debug.Log("callHotLine::showQuestion = " + index+",questionList.transform.childCount = "+questionList.transform.childCount);
	for(var i:int = 0;i<questionList.transform.childCount;i++){
		var child:Transform = questionList.transform.GetChild(i);		
		child.localPosition.y = 0;	
		if(index == i){
			child.localPosition.x = 0;	
		}else{
			child.localPosition.x = 10000;	
		}	
	}

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
		UIManager.getInstance().showCallHotLineResult("基本不明白");
	}else if(rightNumber == 4){
		UIManager.getInstance().showCallHotLineResult("完全明白");
	}else{
		UIManager.getInstance().showCallHotLineResult("基本明白");
	}

	//UIManager.getInstance().nextDialog();
}
