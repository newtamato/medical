class MenuDialog_Controller extends BaseDialog{


public var option_1_img:UISprite;
public var option_2_img:UISprite;
public var option_3_img:UISprite;
public var option_4_img:UISprite;

public var phoneFinished:GameObject;
public var estimateFinished:GameObject;
public var classficatedFinished:GameObject;
public var securityFinished:GameObject;

public var mData:List.<Question>;
private var m_index:int = 0;
private var m_Selection:Array;
private var m_show:boolean = false;

private var m_dialogs:Array ;

private var m_finishedGO:Hashtable;


function Start () {
	//init data
	m_Selection = new Array();

	

	// setVisible(false);
}

function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}

function show():void{
	
	setOptionImgBack();
	m_show = true;
	var count:int = 4;
	m_dialogs = [UIManager.UI_HOT_LINE,
					UIManager.UI_ESTIMATE,
					UIManager.UI_CLASSFICATE_2,
					UIManager.UI_SECURITY
				];

	m_finishedGO = {UIManager.UI_HOT_LINE : phoneFinished,
					UIManager.UI_ESTIMATE : estimateFinished,
					UIManager.UI_CLASSFICATE_2 : classficatedFinished,
					UIManager.UI_SECURITY : securityFinished};					
	Debug.Log("count = "+ count);
	for(var index:int = 0;index< count; index++){
		var key:String = m_dialogs[index];
		var go:GameObject = m_finishedGO[key];

		var isFinished:boolean = UIManager.getInstance().isFinished(key);
		Debug.Log("key = "+key +",isFinished = "+ isFinished);
		if(isFinished){
			go.active = true;
		}else{
			go.active = false;
		}

	}
}




function  hide ():void {
	// body...
	m_show = false;
}

//选择手机
function onSelectPhone():void{
	onSelectOption(UIManager.UI_HOT_LINE,option_1_img);//选择手机的处理
}

//选择“现场分析”
function onSelectEstimate():void{

	onSelectOption(UIManager.UI_ESTIMATE,option_2_img);//选择“现场分析”的处理
		
}
//选择隔离安全带
function onSelectSecurityLine():void{
	onSelectOption(UIManager.UI_SECURITY,option_3_img);//选择隔离安全带的处理
	
}
	
//选择“分类”
function onSelectClassficate():void{
	onSelectOption(UIManager.UI_CLASSFICATE_1,option_4_img);//选择“分类”的处理
}

//判断是否已选择了
function hasSelectIt(name:String):boolean{
	for(var data:DialogOrderDataValue in m_Selection){
		if(data.name == name){
			return true;
		}
	}
	return false;
}


function onLoadDataComplete():void{
	return;
	Debug.Log("I got the load data complete event!");
	var dialogData:Dialog = DataManager.getInstance().getDialog("selectRightOrder");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

}

function setData(questions:List.<Question>):void{
	if(questions){
		mData = questions;	
	}
	show();
}
override function close():void{
	super.close();
}

function onConfim():void{
	
	var dialogNames:Array = new Array();
	Debug.Log("MenuDialog_Controller::onConfim:: m_Selection.length = "+ m_Selection.length);
	for(var dialogOrderData:DialogOrderDataValue in m_Selection){
		
		var isFinished:boolean = UIManager.getInstance().isFinished(dialogOrderData.name);
		if(isFinished){
			continue;
		}
		dialogNames.push(dialogOrderData.name);
		Debug.Log(dialogOrderData.name);
		var answer:String = getAnswer(dialogOrderData.name);
		var score:int = getScore(dialogOrderData.name);
		Debug.Log("MenuDialog_Controller::onConfim::name = "+ dialogOrderData.name+",answer = "+dialogOrderData.order+",right answer = "+answer + ",score = "+ score);
		if(answer && parseInt(answer) == dialogOrderData.order){
			Debug.Log("Your answer is right!!");		
			UIManager.getInstance().addScore(score);	
		}
	}

	if(dialogNames.length>0){
		Debug.Log(dialogNames);
		UIManager.getInstance().setDialogQueue(dialogNames);
		UIManager.getInstance().nextDialog();
	}
	m_Selection =[];
}

function onCancle():void{
	m_Selection = new Array();//清空选择
	setOptionImgBack();	//还原物品
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
	//setVisible(true);//设置物品可见
}

//设置物品的可见性
// function setVisible(visible:boolean):void{
// 	if(visible == false){
// 		setOptionInvisible();
// 	}else{
// 		setOptionVisible();
// 	}
// }
class DialogOrderDataValue{
	public var name:String;
	public var order:int = 0;
}



//还原4件物品
function setOptionImgBack(){
	//复原背景图
	setImgBack(option_1_img,"_selected");
	setImgBack(option_2_img,"_selected");
	setImgBack(option_3_img,"_selected");
	setImgBack(option_4_img,"_selected");
	
	//复原背景图比例
	// setObjScaleXY(option_1_img.gameObject,64,108);
	// setObjScaleXY(option_2_img.gameObject,100,100);
	// setObjScaleXY(option_3_img.gameObject,100,100);
	// setObjScaleXY(option_4_img.gameObject,150,50);
}

//还原物品背景图
function setImgBack(option_img:UISprite,del_endStr:String):void{
	
	var imgName:String =option_img.spriteName;
	Debug.Log("原背景图名称："+imgName);
	
	//查找待删除的结尾字符串的位置
	var delIndex =imgName.IndexOf(del_endStr);
	if (delIndex ==-1){
		Debug.Log("当前显示的为初始背景图，无需更换");
		return;//如果查找不到则不处理，直接返回
	}
	imgName=imgName.Substring(0,delIndex);
	Debug.Log("更新后背景图名称"+imgName);
	option_img.spriteName=imgName;

}


//选择物品时的操作
function onSelectOption(uiName:String,objImg:UISprite):void{
	var hasSelect:boolean = hasSelectIt(uiName);
	if(hasSelect){//如果已选择此物品，直接返回，不再执行选择
		return;
	}
	var name:String = objImg.spriteName;
	objImg.spriteName = name + "_selected";
	
	//Debug.Log("MenuDialog_Controller::onSelectSecurityLine::"+ hasSelect);
	Debug.Log("MenuDialog_Controller::onSelectOption::"+ hasSelect+",name = "+name);
	var dialogOrderData:DialogOrderDataValue = new DialogOrderDataValue();
	dialogOrderData.order = m_index++;
	dialogOrderData.name = uiName;
	m_Selection.push(dialogOrderData);
}


//只变更对象X坐标的位置
function setObjPositionX(obj:GameObject,x:Number):void{
	setObjPositionXY(obj,x,0);	
}

//只变更对象X/Y的位置
function setObjPositionXY(obj:GameObject,x:Number,y:Number):void{
	setObjPositionXYZ(obj,x,y,-1);	
}

//变更对象的X/Y/Z的位置
function setObjPositionXYZ(obj:GameObject,x:Number,y:Number,z:Number):void{
	if(obj){
		obj.transform.localPosition.x = x;
		obj.transform.localPosition.y = y;
		obj.transform.localPosition.z = z;
	}
	
}

//变更对象X的比例
function setObjScaleX(obj:GameObject,x:Number):void{
	setObjScaleXY(obj,x,1);
}

//变更对象X/Y的比例
function setObjScaleXY(obj:GameObject,x:Number,y:Number):void{
	setObjScaleXYZ(obj,x,y,1);
}

//变更对象X/Y/Z的比例
function setObjScaleXYZ(obj:GameObject,x:Number,y:Number,z:Number):void{
	if(obj){
		obj.transform.localScale= new Vector3(x,y,z);
	}
	
}
}