#pragma strict


public var patientList:GameObject;
public var tip:GameObject;
public var itemPrefab:GameObject;
public var rotatePointer:GameObject;
public var arrow:GameObject;
public var labelTxt:UILabel;
public var btn:GameObject;

private var m_currentId:String;
private var m_currentGameObject:GameObject = null;
private var dataList:List.<Question> =null;

private var m_startIndex:int = 0;
private var m_endIndex:int = 4;
private var m_max:int = 0;

private var  m_answers:Array = null;
private var m_start:boolean = false;    


class AnswerDataValue{
	public var id:String;
	public var color:String;
}
function Start () {
	tip.active = false;
	tip.SetActiveRecursively(false);
	m_startIndex = 0;
	m_endIndex = 4;
	if(arrow){
		arrow.active = false;
		arrow.SetActiveRecursively(false);
	}
	m_answers = new Array();
}



function setData(data:List.<Question>):void{
	
	if(null == patientList){
		return;
	}
	dataList = data;
	//return;
	m_startIndex = 0;
	m_max = dataList.Count;
	var resultList :Question[] = getData();
	initListFromData(resultList);
	
}

public function getData():Question[]{
	var resultList:Question[]  = new Question[4];
	var num:int = (m_startIndex+4)>m_max ? (m_max - m_startIndex) : 4; 
	(dataList as List.<Question>).CopyTo(m_startIndex,resultList,0,num);
	//.CopyTo(m_startIndex,resultList,0,4);
	return resultList;
}


function onLoadDataComplete():void{
	Debug.Log("I got the load data complete event!");
	var dialogData:Dialog = DataManager.getInstance().getDialog("classification");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

}

function onMouseOverToPatientItem(id:String,msg:String,gameObject_name:String,itemGameObject:GameObject):void{
	arrow.active = true;
	arrow.SetActiveRecursively(true);
	tip.active = true;
	tip.SetActiveRecursively(true);
	Debug.Log("gameObject_name is "+ gameObject_name);

	if(m_currentId !=id){
		m_currentId = id;
	}
	if(m_currentGameObject != itemGameObject){
		m_currentGameObject = itemGameObject;
	}
	if(gameObject_name == "Patient_1"){
		arrow.transform.localPosition.x = -170;
	}
	if(gameObject_name == "Patient_2"){
		arrow.transform.localPosition.x = -65;
	}
	if(gameObject_name == "Patient_3"){
		arrow.transform.localPosition.x = 46;	
	}
	if(gameObject_name == "Patient_4"){
		arrow.transform.localPosition.x = 157;
	}
	var tipComponent:Tip_Controller = tip.GetComponent(Tip_Controller) as Tip_Controller;
	tipComponent.setText(msg);
	var hasDoneIt:boolean = hasDoneIt(m_currentId);
	if(hasDoneIt){
		btn.active = false;
		btn.SetActiveRecursively(false);
		return;
	}else{
		btn.active = true;
		btn.SetActiveRecursively(true);
		
		m_start = true;
	}

}
function initListFromData(questions:Question[]):void{
	if(questions ==null ){
		return;
	}
	if(questions.get_Length() == 0){
		return;
	}
	Debug.Log("questions.length() = "+ questions.get_Length());
	
	var grid:UIGrid = patientList.GetComponent("UIGrid") as UIGrid;

	var p_item:GameObject = null;
	var gridTransform:Transform = grid.transform;
	var pItemControl:PatientItem_Controller;
	var item:Question = null;
	if(gridTransform.childCount ==4){
		for (var i:int = 0; i < gridTransform.childCount; ++i)
		{
			item = questions[i];
			var childTransform:Transform = gridTransform.GetChild(i);
			p_item = childTransform.gameObject;
			pItemControl = p_item.GetComponent(PatientItem_Controller) as PatientItem_Controller;
			if(null == pItemControl){
				pItemControl = p_item.AddComponent(PatientItem_Controller);
				
			}
			pItemControl.setMouseOverFunction(onMouseOverToPatientItem);
			if(item){
				p_item.active = true;
				p_item.SetActiveRecursively(true);
				var back:String = getColorById(item.id);
				if(back == null || back == ""){
					back = "greenBack";
				}
				pItemControl.setData(item.id,item.text,item.image,item,back);
			}else{
				//p_item.active = false;
				//p_item.SetActiveRecursively(false);
			}
			
		}
	}else{
		for(item in questions){
			p_item = Instantiate(itemPrefab);
			if(p_item){

				p_item.transform.parent = grid.transform;		
				pItemControl = p_item.GetComponent(PatientItem_Controller) as PatientItem_Controller;
				pItemControl.setData(item.id,item.text,item.image,null,null);
				pItemControl.setMouseOverFunction(onMouseOverToPatientItem);
				p_item.transform.localScale = new Vector3(1,1,1);
				p_item.transform.localPosition = new Vector3(0,0,0);		
			}
		}
		grid.Reposition();
	}
}

function clearTipArrow(){
	arrow.active = false;
	tip.active = false;
	arrow.SetActiveRecursively(false);
	tip.SetActiveRecursively(false);
}
function onLeftBtn():void{
	clearTipArrow();
	// patientList.transform.localPosition.x -= 200;
	Debug.Log("m_startIndex = "+m_startIndex);

	if(m_startIndex == 0){
		return;
	}
	m_startIndex-=4;
	if(m_startIndex <0){
		m_startIndex = 0;
	}
	var resultList:Question[] = getData();
	initListFromData(resultList);
}
function onRgihtBtn ():void {
	// body...
	// patientList.transform.localPosition.x += 200;
	clearTipArrow();
	if(m_startIndex == m_max){
		return;
	}

	m_startIndex+=4;
	if(m_startIndex>m_max){
		m_startIndex = m_max;
	}
	
	
	var resultList:Question[] = getData();
	initListFromData(resultList);
}

function onStartRotate():void{
	var hasDoneIt:boolean = hasDoneIt(m_currentId);
	if(hasDoneIt){
		return;
	}
	if(rotatePointer){
		var rotateComponent:RotatingUnityGUI = rotatePointer.GetComponent(RotatingUnityGUI) as RotatingUnityGUI;
		if(rotateComponent){
			rotateComponent.StartRotate();
		}
	}
}

function getColorById(id:String):String{
	if(m_answers && m_answers.length >0){
		var count : int = m_answers.length;
		for(var index:int = 0; index<count; index ++){
			var answer:AnswerDataValue = m_answers[index];
			if(answer && answer.id == id){
				return answer.color +"Back";
			}
		}
	}
	return "";
}
function onStopRotate():void{
	if(rotatePointer){
		var rotateComponent:RotatingUnityGUI = rotatePointer.GetComponent(RotatingUnityGUI) as RotatingUnityGUI;
		if(rotateComponent){
			rotateComponent.StopRotate();
		}

		var color:String = getColorFromRotate();
		var answer:AnswerDataValue = new AnswerDataValue();
		answer.id = m_currentId;
		answer.color = color;
		m_answers.push(answer);

		var itemController:PatientItem_Controller = m_currentGameObject.GetComponent(PatientItem_Controller) as PatientItem_Controller;
		if(itemController){
			if(null !=itemController.p_back){
				(itemController.p_back as UISprite).spriteName = color+"Back";
			}
		} 
		var questionData:Question = itemController.getData();

		if(questionData.answer == color){
			var score:int = questionData.score;
			UIManager.getInstance().addScore(score);
		}

	}
}

function hasAllFinish():boolean{
	if(m_answers && dataList){
		Debug.Log("classficate_dialog_controller::hasAllFinish::dataList.Count = "+dataList.Count);
		Debug.Log("classficate_dialog_controller::hasFinished::m_answers.length = "+ m_answers.length);
		return m_answers.length == dataList.Count;	
	}else{
		return false;
	}
	
}

function Update():void{
	var hasFinished:boolean = hasAllFinish();
	if(hasFinished){
		labelTxt.text = "下一题";
		btn.active = true;
		btn.SetActiveRecursively(true);

	}else{
		if(m_start){
			labelTxt.text = "开始";
		}else{
			labelTxt.text = "结束";
		}
	}
}

function hasDoneIt(id:String):boolean{
	for(var obj:AnswerDataValue in m_answers){
		if(obj.id == id){
			return true;
		}
	}
	return false;
}
function getColorFromRotate():String{
	var currentRotation:float = rotatePointer.transform.localEulerAngles.z;
	Debug.Log("currentRotation = "+ currentRotation);
	currentRotation = currentRotation%360;
	var color:String = "";
	if(currentRotation > 316 && currentRotation <360 || (currentRotation>0 && currentRotation<40)){
		color =  "red";
	}
	if(currentRotation > 41 && currentRotation <130){
		color = "green";
	}
	if(currentRotation > 131 && currentRotation <225){
		color = "yellow";
	}
	if(currentRotation > 225 && currentRotation <315){
		color = "black";
	}
	Debug.Log(currentRotation +", color is "+ color);
	return color;
}


function onConfirm():void{
	var hasFinished:boolean = hasAllFinish();
	if(hasFinished){
		UIManager.getInstance().nextDialog();
	}else{
		if(m_start == true){
			this.onStartRotate();
			m_start = false;
		}else{
			this.onStopRotate();
		}
	
	}
	
	

}
