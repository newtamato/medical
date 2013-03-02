#pragma strict
public var itemPrefab:GameObject;
public var estimateList:GameObject;
public var validList:GameObject;
public var invalidList:GameObject;
public var smallEstimatePrefab:GameObject;

private var okBtn:GameObject;

private var dataList:List.<Question>;
private var m_score:int = 0;
function Start () {
	
}

function Update () {

}

function onOkBtn():void{
	var callBackComponent:SetCallBack = gameObject.GetComponent("SetCallBack");
	if(callBackComponent){
		callBackComponent.execute();	
	}
	
}

function onDoRight():void{

}

function onDoWrong():void{

}


function onLoadDataComplete():void{
	var dialogData:Dialog = DataManager.getInstance().getDialog("estimateLive");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

	UIManager.getInstance().ChangeLayersRecursively(gameObject.transform,"uilayer");
}


function init():void{
	if(null == dataList){
		return;
	}
	var grid:UITable = estimateList.GetComponent("UITable") as UITable;
	var img:UISprite =null;
	var index:int = 0;
	for (var itemdata:Question in dataList){
		Debug.Log(itemdata);
		var item:GameObject = Instantiate(itemPrefab);
		if(item){
			index++;
			 
			var dataComponent:DataItem_Controller = item.GetComponent(DataItem_Controller) as DataItem_Controller;
			dataComponent.id = itemdata.id;
			dataComponent.image = itemdata.image_1;
			
			item.transform.parent = grid.transform;		
			item.name = "estimate_item_"+ index;
			var displayComponent:EstiamateItem_Controller = item.GetComponent(EstiamateItem_Controller) as EstiamateItem_Controller;
		 	img=displayComponent.img;
			if(img){
				Debug.Log(itemdata.id + "item has img gameobject");
				img.spriteName = itemdata.image;
			}else{
				Debug.Log(itemdata.id +"i can not find img gameobject");
			}
			item.transform.localScale = new Vector3(1,1,1);
			item.transform.localPosition = new Vector3(1,1,1);
		}
	}
	
	grid.Reposition();
	//estimateList.transform.localPosition.z = -1;

	//init valid list
	var validListGrid:UITable = validList.GetComponent("UITable") as UITable;
	var tableTrans:Transform = validListGrid.transform;
	var i:int = 0;
	var child:Transform =null;
	for (i = 0; i < tableTrans.childCount; ++i)
	{
		child= tableTrans.GetChild(i);

		Destroy(child.gameObject);
		
	}


	//init invalid list
	var invalidListTable:UITable = invalidList.GetComponent("UITable") as UITable;
	var invalidListTableTransform:Transform = invalidListTable.transform;
	for (i = 0; i < invalidListTableTransform.childCount; ++i)
	{
		child = invalidListTableTransform.GetChild(i);

		Destroy(child.gameObject);
		
	}

}
function setData(data:List.<Question>):void{
	if(null == data){
		return;
	}
	dataList = data;
	//return;
	
	init();
	
	
}

function DropItemComplete(valid:boolean):void{
	if(valid == false){
		return;
	}
	Debug.Log("estimateDialog :: CheckParentPos...................");
	var table:UITable = estimateList.GetComponent("UITable") as UITable;
	table.Reposition();
	var tableTrans:Transform = table.transform;
	var child:Transform =null;
	for (var i:int = 0; i < tableTrans.childCount; ++i)
	{
		child= tableTrans.GetChild(i);
		child.localPosition.z = -3;	
	}
	
}


function onConfim():void{
	
	var validListGrid:UITable = validList.GetComponent("UITable") as UITable;
	var tableTrans:Transform = validListGrid.transform;
	var i:int = 0;
	var child:Transform =null;
	var go:GameObject = null;
	var itemComponent:DataItem_Controller = null;
	var id:String = null;
	var isRight:boolean = false;
	var score:int = 0;
	for (i = 0; i < tableTrans.childCount; ++i)
	{
		child= tableTrans.GetChild(i);

		go = child.gameObject;
		itemComponent = go.GetComponent(DataItem_Controller) as DataItem_Controller;
		id = itemComponent.id;
		isRight = checkAnswer(id,"right");
		Debug.Log("EstimateStiuation::onConfim::id = "+id+",isRight is "+ isRight);

		if(isRight){
			score = getScoreById(id);
			m_score +=score;
		}
	}


	var invalidListTable:UITable = invalidList.GetComponent("UITable") as UITable;
	var invalidTableTrans:Transform = invalidListTable.transform;
	
	
	for (i = 0; i < invalidTableTrans.childCount; ++i)
	{
		child= invalidTableTrans.GetChild(i);

		go = child.gameObject;
		itemComponent = go.GetComponent(DataItem_Controller) as DataItem_Controller;
		id = itemComponent.id;
		isRight = checkAnswer(id,"wrong");
		Debug.Log("EstimateStiuation::onConfim::id = "+id+",isRight is "+ isRight);
		if(isRight){
			score = getScoreById(id);
			m_score += score;
		}
	}

	Debug.Log("score = "+ m_score);
	UIManager.getInstance().addScore(m_score);
	UIManager.getInstance().nextDialog();
}

function onCancel():void{
	init();
}

function checkAnswer(id:String,rightAnswer:String):Boolean{
	for (var itemdata:Question in dataList){
		if(itemdata.id == id ){
			return itemdata.answer == rightAnswer ? true:false;
		}
	}
	return false;
}

function getScoreById(id:String):int{
	for (var itemdata:Question in dataList){
		if(itemdata.id == id ){
			return itemdata.score ;
		}
	}
	return 0;

}


function onLeftBtn():void{
	estimateList.transform.localPosition.x -=150;
}
function onRightBtn():void{
	estimateList.transform.localPosition.x +=150;
}