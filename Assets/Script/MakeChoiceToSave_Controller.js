#pragma strict
public var originList:GameObject;

public var orderList:GameObject;
public var itemPrefab:GameObject;
private var m_dataList:List.<Question>;
private var m_score:int = 0;
private var m_putCount:int = 0;

// public var first:GameObject;
// public var second:GameObject;
// public var third:GameObject;
// public var forth:GameObject;

function Start () {

}

function Update () {

}
function onLoadDataComplete():void{
	Debug.Log("I got the load data complete event!");
	var dialogData:Dialog = DataManager.getInstance().getDialog("classification_1");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

}

function setData(data:List.<Question>):void{
	m_dataList = data;
	initDialogList();
}

function initDialogList():void{
	var index:int = 0;
	var count:int = m_dataList.Count;
	
	var childCount:int = orderList.transform.childCount;
	var isNew:boolean = false;
	
	Debug.Log("MakeChoiceToSave_Controller::initDialogList::count = "+count +",childCount = "+ childCount);
	
	for(index =0; index<count; index++){
		Debug.Log("MakeChoiceToSave_Controller::initDialogList::index = "+index);
		var itemDisplay:GameObject = null;
		itemDisplay = Instantiate(itemPrefab);
		itemDisplay.transform.parent = orderList.transform;		
		itemDisplay.transform.localScale = new Vector3(1,1,1);
		itemDisplay.name = "order_item_"+ index;
		//Debug.Log("initDialogList::itemDisplay = "+ itemDisplay +",index = "+ index);
		
		
		var displayComponent: UISprite = itemDisplay.GetComponent( UISprite) as  UISprite;
		var itemData:Question = m_dataList[index];
		if(itemData){
			displayComponent.spriteName = itemData.image;		
		}
		var dataComponent:DataItem_Controller = itemDisplay.GetComponent(DataItem_Controller) as DataItem_Controller;
		if(null == dataComponent){
			dataComponent = itemDisplay.AddComponent(DataItem_Controller);
			dataComponent.id = itemData.id;
			dataComponent.image = itemData.image;
			dataComponent.tag = "estimate_item_1_tag";
		}
		
	}

	// for(var itemData:Question in m_dataList){
	// 	Debug.Log(itemData);
		
	// 	var itemDisplay:GameObject = Instantiate(itemPrefab);
	// 	var displayComponent: UISprite = itemDisplay.GetComponent( UISprite) as  UISprite;
	// 	if(itemData){
	// 		displayComponent.spriteName = itemData.image;		
	// 	}
	// 	index ++;
	// 	itemDisplay.transform.parent = orderList.transform;		
		
	// 	itemDisplay.transform.localScale = new Vector3(1,1,1);
	// 	itemDisplay.name = "order_item_"+ index;

	// 	var dataComponent:DataItem_Controller = itemDisplay.GetComponent(DataItem_Controller) as DataItem_Controller;
	// 	if(null == dataComponent){
	// 		dataComponent = itemDisplay.AddComponent(DataItem_Controller);
	// 	}
	// 	dataComponent.id = itemData.id;
	// 	dataComponent.image = itemData.image;
	// 	dataComponent.tag = "estimate_item_1_tag";
	// }

	var orderList:UITable = orderList.GetComponent("UITable") as UITable;
	orderList.Reposition();
}

function onDropToChangeDisplay(){
	// var orderList:UITable = originList.GetComponent("UITable") as UITable;
	// orderList.Reposition();	
	m_putCount++;
}

function onCancle():void{
	Debug.Log("MakeChoiceToSave_Controller::onCancle");
	var childCount:int = originList.transform.childCount;
	Debug.Log("childCount = "+ childCount);
	for(var index:int = 0; index<childCount; index++){
		var child:Transform = originList.transform.GetChild(index);
		var containerTransform:Transform = child.Find("container");
		Debug.Log("containerTransform = " + containerTransform+",containerTransform.gameObject = "+containerTransform.gameObject);
		if(containerTransform){
			var container:UISprite = containerTransform.gameObject.GetComponent(UISprite) as UISprite;
			Debug.Log("container = "+ container);
			if(container){
				container.spriteName = "shuzi_"+(index+1);
			}
		}
	}
	childCount = orderList.transform.childCount;
	for(index = 0 ;index<childCount; index++){
		child = orderList.transform.GetChild(index);
		if(child ){
			Destroy(child.gameObject);
		}
	}
	orderList.transform.DetachChildren();
	initDialogList();
	m_putCount = 0;

}


function onConfirm():void{
	
	
	Debug.Log("estimate dialog 1 :: onConfim :: answer = "+ m_putCount);
	if(m_putCount !=4) {
		Debug.Log("MakeChoiceToSave_Controller::onConfim::error::please make a complete answer");
		return;
	}
	var items:GameObject[] = GameObject.FindGameObjectsWithTag("estimate_item_1_tag") ;
	for(var item:GameObject in items){		
		var dataComponent:DataItem_Controller = item.GetComponent(DataItem_Controller) as DataItem_Controller;
		var questData:Question = getQuestionById(dataComponent.id);
		if(item.name == "order_"+questData.answer){
			m_score+=questData.score;
		}
	}
	Debug.Log(m_score+"= m_score");
	UIManager.getInstance().addScore(m_score);
	UIManager.getInstance().showDialog(UIManager.UI_CLASSFICATE_2);
}

function getQuestionById(id:String):Question{
	for(var data:Question in m_dataList){
		if(data.id == id){
			return data;
		}
	}
	return null;
}