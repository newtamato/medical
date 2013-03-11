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
private var m_score:int = 0;

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
function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}

function setScore(score:int):void{
	m_score = score;
	if(m_score<0){
		m_score = 0;
	}
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
	// initListFromData(resultList);
	initListFromData(dataList);
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
	arrow.transform.position.y = itemGameObject.transform.position.y;

	
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
function initListFromData(questions:List.<Question>):void{
	if(questions ==null ){
		return;
	}
	if(questions.Count == 0){
		return;
	}
	//Debug.Log("questions.length() = "+ questions.get_Length());
	
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
			
			
		}
	}else{
		var index:int = 0;
		for(item in questions){
			p_item = Instantiate(itemPrefab);
			if(p_item){

				p_item.transform.parent = grid.transform;		
				p_item.name = "patient_"+index;
				pItemControl = p_item.GetComponent(PatientItem_Controller) as PatientItem_Controller;
								

				pItemControl.setMouseOverFunction(onMouseOverToPatientItem);
				p_item.transform.localScale = new Vector3(1,1,1);
				p_item.transform.localPosition = new Vector3(0,0,0);		
				
				if(item){
					p_item.active = true;
					p_item.SetActiveRecursively(true);
					var back:String = getColorById(item.id);
					if(back == null || back == ""){
						back = "unselected";
					}
					pItemControl.setData(item.id,item.text,item.image,item,back);
				}else{
			
				}
			}
			index++;

		}
		grid.Reposition();
	}
}
function show():void{
	clearTipArrow();	
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
	//initListFromData(resultList);
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
	//initListFromData(resultList);
}

function onStartRotate():void{
	if(m_currentId == null || m_currentId == ""){
		return ;
	}
	var hasDoneIt:boolean = hasDoneIt(m_currentId);
	if(hasDoneIt){
		return;
	}
	if(rotatePointer){
		m_start = false;
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
	if(m_currentId == null || m_currentId == ""){
		return ;
	}
	if(rotatePointer){
		var rotateComponent:RotatingUnityGUI = rotatePointer.GetComponent(RotatingUnityGUI) as RotatingUnityGUI;
		if(rotateComponent){
			rotateComponent.StopRotate();
		}
		var hasAnswered:boolean = hasDoneIt(m_currentId);
		if(hasAnswered){
			return;
		}
		var color:String = getColorFromRotate();
		var answer:AnswerDataValue = new AnswerDataValue();
		answer.id = m_currentId;
		answer.color = color;
		m_answers.push(answer);
		if(null == m_currentGameObject){
			return;
		}
		var itemController:PatientItem_Controller = m_currentGameObject.GetComponent(PatientItem_Controller) as PatientItem_Controller;
		if(itemController){
			if(null !=itemController.p_back){
				(itemController.p_back as UISprite).spriteName = color+"Back";
			}
		} 
		var questionData:Question = itemController.getData();

		if(questionData.answer == color){
			var score:int = questionData.score;
			m_score+=score;
			
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
	return;
	if(dataList==null){
		return;
	}
	var length:int = m_answers.length;
	var all:int = dataList.Count;
	var infoTrans:Transform = UIManager.getInstance().findTransformByName("info",transform);
	if(infoTrans){
		var info:UILabel = infoTrans.GetComponent(UILabel);
		info.text = length+"/"+all;
	}
	var hasFinished:boolean = hasAllFinish();
	if(hasFinished){
		labelTxt.text = "答题完毕";
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
	if(currentRotation > 90 && currentRotation <=180 ){
		color =  "red";
	}
	if(currentRotation > 180 && currentRotation <=270){
		color = "green";
	}
	if(currentRotation > 270 && currentRotation <=360){
		color = "yellow";
	}
	if(currentRotation > 0 && currentRotation <=90){
		color = "black";
	}
	Debug.Log(currentRotation +", color is "+ color);
	return color;
}


function onConfirm():void{
	var hasFinished:boolean = hasAllFinish();
	if(hasFinished){
		UIManager.getInstance().addScore(m_score);
		UIManager.getInstance().nextDialog();
		UIManager.getInstance().addFinishedDialog(UIManager.UI_CLASSFICATE_2);
	}else{
		if(m_start == true){
			this.onStartRotate();
			m_start = false;
		}else{
			this.onStopRotate();
		}
	
	}
	
	

}
