#pragma strict
public var itemPrefab:GameObject;
public var estimateList:GameObject;
public var validList:GameObject;
public var invalidList:GameObject;
public var smallEstimatePrefab:GameObject;
public var toolTip:GameObject;

private var okBtn:GameObject;

private var dataList:List.<Question>;
private var m_score:int = 0;

function Start () {
	
}

function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}

function onOkBtn():void{
	var callBackComponent:SetCallBack = gameObject.GetComponent("SetCallBack");
	if(callBackComponent){
		callBackComponent.execute();	
	}
	
}

function onLoadDataComplete():void{
	var dialogData:Dialog = DataManager.getInstance().getDialog("estimateLive");
	var questions:List.<Question> = dialogData.Questions;
	
	setData(questions);

	UIManager.getInstance().ChangeLayersRecursively(gameObject.transform,"uilayer");
}


function init():void{
	hideToolTip();
	if(null == dataList){
		return;
	}
	DataManager.getInstance().RandomizeBuiltinArray(dataList);
	m_score = 0;
	
	var grid:UIGrid = estimateList.GetComponent("UIGrid") as UIGrid;
	
	UIManager.getInstance().clearnChildren(grid.transform);

	var img:UISprite =null;
	var index:int = 0;
	for (var itemdata:Question in dataList){
		Debug.Log(itemdata);
		var item:GameObject = Instantiate(itemPrefab);
		if(item){
			index++;
			item.AddComponent(UIDragPanelContents); 
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
			displayComponent.setData(itemdata);
			item.transform.localScale = new Vector3(1,1,1);
			item.transform.localPosition = new Vector3(1,1,1);
			
			//add mouse over handle
			var uiMsgComponent:UIButtonMessage = item.GetComponent(UIButtonMessage) as UIButtonMessage;
			if(uiMsgComponent == null){
				uiMsgComponent = item.AddComponent(UIButtonMessage);
			}
			uiMsgComponent.target = this.gameObject;
			uiMsgComponent.trigger = UIButtonMessage.Trigger.OnMouseOver;
			uiMsgComponent.functionName = "OnMouseOverEstimateItemHandle";
			uiMsgComponent.includeChildren = false;

			//add mouse out handle
			var mouseOutComponent:UIButtonMessage = item.AddComponent(UIButtonMessage);
			
			mouseOutComponent.target = this.gameObject;
			mouseOutComponent.trigger = UIButtonMessage.Trigger.OnMouseOut;
			mouseOutComponent.functionName = "onMouseOutEstimateItemHandle";
			mouseOutComponent.includeChildren = false;


		}
	}
	UIManager.getInstance().ChangeLayersRecursively(grid.transform,"uilayer");
	grid.Reposition();
	

	//init valid list

	var validListGrid:UITable = validList.GetComponent("UITable") as UITable;
	var tableTrans:Transform = validListGrid.transform;
	UIManager.getInstance().clearnChildren(tableTrans);


	//init invalid list
	var invalidListTable:UITable = invalidList.GetComponent("UITable") as UITable;
	var invalidListTableTransform:Transform = invalidListTable.transform;
	UIManager.getInstance().clearnChildren(invalidListTableTransform);


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
	var table:UIGrid = estimateList.GetComponent("UIGrid") as UIGrid;
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
	UIManager.getInstance().addFinishedDialog(UIManager.UI_ESTIMATE);
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

function OnMouseOverEstimateItemHandle(go:GameObject):void{
	
	var estimateComponent:EstiamateItem_Controller = go.GetComponent(EstiamateItem_Controller) as EstiamateItem_Controller;
	if(estimateComponent){

		var tipStr:String = estimateComponent.getToolTipString();
		Debug.Log("OnMouseOverEstimateItemHandle::"+ tipStr,this);	
		showToolTip(tipStr);
	}
	
}

function onMouseOutEstimateItemHandle(go:GameObject):void{
	hideToolTip();
}
function showToolTip(str:String):void{
	if(toolTip){
		var tipCtrl:Tip_Controller = toolTip.GetComponent(Tip_Controller) as Tip_Controller;
		toolTip.active = true;
		toolTip.SetActiveRecursively(true);
		tipCtrl.setText(str);
	}
}


function hideToolTip():void{
	if(toolTip){
		toolTip.active = false;
		toolTip.SetActiveRecursively(false);
		
	}	
}