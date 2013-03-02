#pragma strict

public var btn:GameObject;
public var option_1:GameObject;
public var option_2:GameObject;
public var option_3:GameObject;
public var option_4:GameObject;
public var boxAnimation:UISpriteAnimation;

public var option_1_img:UISprite;
public var option_2_img:UISprite;
public var option_3_img:UISprite;
public var option_4_img:UISprite;


public var mData:List.<Question>;
private var m_index:int = 0;
private var m_Selection:Array;



function Start () {
	//init data
	m_Selection = new Array();
	
	setVisible(false);
}


function onSelectPhone():void{
	var hasSelect:boolean = hasSelectIt(UIManager.UI_HOT_LINE);
	
	if(hasSelect){
		return;
	}
	var name:String = option_1_img.spriteName;
	option_1_img.spriteName = name + "_selected";
	if(option_1_img.gameObject){
		option_1_img.gameObject.transform.localScale= new Vector3(80,138);
	}
	var dialogOrderData:DialogOrderDataValue = new DialogOrderDataValue();
	dialogOrderData.order = m_index++;
	dialogOrderData.name = UIManager.UI_HOT_LINE;
	m_Selection.push(dialogOrderData);
	
}
function onSelectEstimate():void{

	var hasSelect:boolean = hasSelectIt(UIManager.UI_ESTIMATE);
	if(hasSelect){
		return;
	}
	var name:String = option_2_img.spriteName;
	option_2_img.spriteName = name + "_selected";
	if(option_2_img.gameObject){
		option_2_img.gameObject.transform.localScale= new Vector3(194*0.8,188*0.8);
	}
	Debug.Log("MenuDialog_Controller::onSelectEstimate::"+ hasSelect);
	var dialogOrderData:DialogOrderDataValue = new DialogOrderDataValue();
	dialogOrderData.order = m_index++;
	dialogOrderData.name = UIManager.UI_ESTIMATE;
	m_Selection.push(dialogOrderData);
	
}
function onSelectSecurityLine():void{
	var hasSelect:boolean = hasSelectIt(UIManager.UI_SECURITY);
	if(hasSelect){
		return;
	}
	var name:String = option_3_img.spriteName;
	option_3_img.spriteName = name + "_selected";
	
	if(option_3_img.gameObject){
		option_3_img.gameObject.transform.localScale= new Vector3(250*0.8,154*0.8);
	}

	Debug.Log("MenuDialog_Controller::onSelectSecurityLine::"+ hasSelect);
	var dialogOrderData:DialogOrderDataValue = new DialogOrderDataValue();
	dialogOrderData.order = m_index++;
	dialogOrderData.name = UIManager.UI_SECURITY;
	m_Selection.push(dialogOrderData);
}
function onSelectClassficate():void{
	var hasSelect:boolean = hasSelectIt(UIManager.UI_CLASSFICATE_1);
	if(hasSelect){
		return;
	}
	var name:String = option_4_img.spriteName;
	option_4_img.spriteName = name + "_selected";
	if(option_4_img.gameObject){
		option_4_img.gameObject.transform.localScale= new Vector3(220*0.8,150*0.8);
	}

	Debug.Log("MenuDialog_Controller::onSelectClassficate::"+ hasSelect);
	var dialogOrderData:DialogOrderDataValue = new DialogOrderDataValue();
	dialogOrderData.order = m_index++;
	dialogOrderData.name = UIManager.UI_CLASSFICATE_1;
	m_Selection.push(dialogOrderData);
}
function hasSelectIt(name:String):boolean{
	for(var data:DialogOrderDataValue in m_Selection){
		if(data.name == name){
			return true;
		}
	}
	return false;
}

function onLoadDataComplete():void{
	Debug.Log("I got the load data complete event!");
	var dialogData:Dialog = DataManager.getInstance().getDialog("selectRightOrder");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

}
function setData(questions:List.<Question>):void{
	if(questions){
		mData = questions;	
	}
	
}

function onConfim():void{
	
	var dialogNames:Array = new Array();
	Debug.Log("MenuDialog_Controller::onConfim:: m_Selection.length = "+ m_Selection.length);
	for(var dialogOrderData:DialogOrderDataValue in m_Selection){
		

		dialogNames.push(dialogOrderData.name);
		var answer:String = getAnswer(dialogOrderData.name);
		var score:int = getScore(dialogOrderData.name);
		Debug.Log("MenuDialog_Controller::onConfim::name = "+ dialogOrderData.name+",answer = "+dialogOrderData.order+",right answer = "+answer + ",score = "+ score);
		if(answer && parseInt(answer) == dialogOrderData.order){
			Debug.Log("Your answer is right!!");		
			UIManager.getInstance().addScore(score);	
		}
		
	}


	UIManager.getInstance().setDialogQueue(dialogNames);
	UIManager.getInstance().nextDialog();
}

function onCancle():void{
	m_Selection = new Array();
}

function getScore(id:String):int{
	for(var q:Question in mData){
		if(q.id == id){
			return q.score;
		}
	}
	return 0;
}

function getAnswer(id:String):String{
	for(var q:Question in mData){
		if(q.id == id){
			return q.answer;
		}
	}
	return null;
}
function PlayAnimationComplete():void{
	
	// setVisible(true);
	option_1.transform.localPosition.x = -60;
	option_1.transform.localPosition.y = 48;
	option_2.transform.localPosition.x = 57;
	option_2.transform.localPosition.y = 53;
	option_3.transform.localPosition.x = -35;
	option_3.transform.localPosition.y = -46;
	option_4.transform.localPosition.x = -64;
	option_4.transform.localPosition.x = 54;
}

function setVisible(visible:boolean):void{
	if(visible == false){
		option_1.transform.localPosition.x = 10000;
		option_2.transform.localPosition.x = 10000;
		option_3.transform.localPosition.x = 10000;
		option_4.transform.localPosition.x = 10000;
	}else{
		option_1.transform.localPosition.x = -60;
		option_1.transform.localPosition.y = 48;
		option_2.transform.localPosition.x = 57;
		option_2.transform.localPosition.y = 53;
		option_3.transform.localPosition.x = -35;
		option_3.transform.localPosition.y = -46;
		option_4.transform.localPosition.x = -64;
		option_4.transform.localPosition.x = 54;
	}
	return;
	option_1.active = visible ;
	option_1.SetActiveRecursively(visible);

	option_2.active = visible ;
	option_2.SetActiveRecursively(visible);

	option_3.active = visible ;
	option_3.SetActiveRecursively(visible);

	option_4.active = visible ;
	option_4.SetActiveRecursively(visible);
}
class DialogOrderDataValue{
	public var name:String;
	public var order:int = 0;
}

