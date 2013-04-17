class MakeChoiceToSave_Controller extends BaseDialog{ 

public var originList:GameObject;
public var itemGameObjectPreix:String ="shuzi_";
public var orderList:GameObject;
public var itemPrefab:GameObject;
public var atlas:UIAtlas;
protected var m_dataList:List.<Question>;
// private var m_score:int = 0;
// private var m_putCount:int = 0;




function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}


function onLoadDataComplete():void{
	Debug.Log("I got the load data complete event!");
	var dialogData:Dialog = DataManager.getInstance().getDialog("classification_1");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

}

function setData(data:List.<Question>):void{
	m_dataList = data;

	init();
}

override public function init():void{
	m_score = 0;
	
	DataManager.getInstance().RandomizeBuiltinArray(m_dataList);

	var index:int = 0;
	var count:int = m_dataList.Count;
	
	var childCount:int = orderList.transform.childCount;
	

	UIManager.getInstance().clearnChildren(orderList.transform);

	for(index =0; index<count; index++){
		
		var itemData:Question = m_dataList[index];

		createItemForQuestionList(itemData);
		
	}
	var orderList:UITable = orderList.GetComponent("UITable") as UITable;
	orderList.Reposition();



	childCount = originList.transform.childCount;
	
	for(index = 0; index<childCount; index++){
		var child:Transform = originList.transform.GetChild(index);
		var containerTransform:Transform = child.Find("container");
		var datactrl:DataItem_Controller = child.GetComponent(DataItem_Controller);
		if(datactrl){
			Destroy(datactrl);
		}
		if(containerTransform){
			var container:UISprite = containerTransform.gameObject.GetComponent(UISprite) as UISprite;
			
			if(container){
				container.spriteName = getItemInstanceUISpriteName(index);
			}
		}
	}
	

}

protected function getItemInstanceUISpriteName(index:int):String{
	return itemGameObjectPreix+(index+1);
}



function updateOriginListPresent(data : List.<Question>):void{
	for(var q:Question in data){
		createItemForQuestionList(q);
	}
	var orderList:UITable = orderList.GetComponent("UITable") as UITable;
	orderList.Reposition();
}
// create item 
function createItemForQuestionList(itemData:Question):void{
	var itemDisplay:GameObject = null;
	itemDisplay = Instantiate(itemPrefab);

	itemDisplay.transform.parent = orderList.transform;		
	itemDisplay.transform.localScale = new Vector3(1,1,1);
	itemDisplay.transform.localPosition = new Vector3(0,0,0);
	itemDisplay.name = itemData.id;
	

	var displayComponent: UISprite = itemDisplay.GetComponent( UISprite) as  UISprite;
	if(itemData){
		displayComponent.atlas = atlas;
		displayComponent.spriteName = itemData.image;
		Debug.Log( itemData.image,this);		
	}
	var dataComponent:DataItem_Controller = itemDisplay.GetComponent(DataItem_Controller) as DataItem_Controller;
	if(null == dataComponent){
		dataComponent = itemDisplay.AddComponent(DataItem_Controller);
		dataComponent.id = itemData.id;
		dataComponent.image = itemData.image;
		dataComponent.tag = "estimate_item_1_tag";
	}
}
// tool function
function getDataCtrlComponentCount(parent:Transform):Array{
		var index:int = 0;
		var ctrl_array:Array=[];
		for(var child:Transform in parent){
			var ctrl:DataItem_Controller = child.GetComponent(DataItem_Controller);
			if(ctrl){
				ctrl_array.push(ctrl);
			}
		}
		return ctrl_array;
}
function onDropToChangeDisplay(){
	// var orderList:UITable = originList.GetComponent("UITable") as UITable;
	// orderList.Reposition();	
	if(null == orderList){
		return;
	}
	
	// Debug.Log("XX@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ = "+ index);

	var originList_children:Array = getDataCtrlComponentCount(originList.transform);
	var improve_originList_children:Array =  [];
	
	for(var child:DataItem_Controller in originList_children){

		if(child.gameObject.name.IndexOf("op_")!=-1){
			continue;
		}else{
			improve_originList_children.push(child);
		}
	}
	if(improve_originList_children.length == 0){
		return ;
	}
	var orderList_children:Array= getDataCtrlComponentCount (orderList.transform );
	
	
	if((originList_children.length +  orderList_children.length) == m_dataList.Count){
		return ;
	}
	
	clearnChildren(orderList.transform);
	
	var destination:List.<Question> = new List.<Question>();
	//m_dataList.CopyTo(destination);
	destination.AddRange(m_dataList);
	var excludeData:Array = [];
	for(var child:DataItem_Controller in originList_children){
		
		var data:Question = getQuestionById(child.id,destination);
		if(data!=null){
			
			destination.Remove(data);
			continue;
		}else{
			excludeData.push(child.id);
		}
	}
	
	// originList.transform.DetachChildren();
	Debug.Log(destination);
	updateOriginListPresent(destination);
	
	
	
	//m_putCount++;
}

function onCancle():void{
	Debug.Log("MakeChoiceToSave_Controller::onCancle");
	
	

	init();
	//m_putCount = 0;

}
function clearnChildren(parent:Transform):void{
	var childCount:int = parent.childCount;
	childCount = orderList.transform.childCount;
	for(var index:int = 0 ;index<childCount; index++){
		var child:Transform = parent.GetChild(index);
		if(child ){
			Destroy(child.gameObject);
		}
	}
	parent.DetachChildren();
}

public function onConfirm():void{
	
	
	var originList_children:Array = getDataCtrlComponentCount(originList.transform);
	if(originList_children.length !=4) {
		Debug.Log("MakeChoiceToSave_Controller::onConfim::error::please make a complete answer");
		return;
	}
	//var items:GameObject[] = GameObject.FindGameObjectsWithTag("estimate_item_1_tag") ;
	var child_count :int = originList_children.length;
	for(var index:int = 1; index<=child_count ;index++){
		var child:Transform = UIManager.getInstance().findTransformByName("order_"+index,originList.transform);
		var dataComponent:DataItem_Controller = child.GetComponent(DataItem_Controller);
		var questData:Question = getQuestionById(dataComponent.id,null);
		Debug.Log(dataComponent.id+",questData.answer  = " +questData.answer +",index = "+index);
		if(parseInt(questData.answer) == index){
			m_score+=questData.score;
		}
	}
	
	Debug.Log(m_score+"= m_score");
	// UIManager.getInstance().addScore();
	UIManager.getInstance().showDialog(UIManager.UI_CLASSFICATE_2,m_score);
}

function getQuestionById(id:String,data:List.<Question>):Question{
	if(data ==null){
		data = m_dataList;
	}
	for(var itemData:Question in data){
		if(itemData.id == id){
			return itemData;
		}
	}
	return null;
}
}