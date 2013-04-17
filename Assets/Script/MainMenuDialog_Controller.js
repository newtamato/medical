class MainMenuDialog_Controller extends MakeChoiceToSave_Controller{

	override public function init () {
		// body...
		super.init();

	}
	override public function close(){

	}

	public function onLoadDataComplete():void{
		var dialogData:Dialog = DataManager.getInstance().getDialog("selectRightOrder");
		var questions:List.<Question> = dialogData.Questions;
		m_dataList = questions;
		init();
		
	}

	override public function show():void{
		
		
	}

	override protected function getItemInstanceUISpriteName(index:int):String{
		return "binggu";
	}

	override public function onConfirm():void{
		super.onConfirm();
		var dialogNames:Array = new Array();
		var originList_children:Array = getDataCtrlComponentCount(originList.transform);
		var child_count :int = originList_children.length;
		for(var index:int = 1; index<=child_count ;index++){
			var child:Transform = UIManager.getInstance().findTransformByName("order_"+index,originList.transform);
			var dataComponent:DataItem_Controller = child.GetComponent(DataItem_Controller);
			dialogNames.push(dataComponent.id);
			
		}
		if(dialogNames.length>0){
			Debug.Log(dialogNames);
			UIManager.getInstance().setDialogQueue(dialogNames);
			UIManager.getInstance().nextDialog();
		}
		
	}
}

