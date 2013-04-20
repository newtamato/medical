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
		return itemGameObjectPreix;
	}

	override public function onConfirm():void{
		super.onConfirm();
		var dialogNames:Array = new Array();
		
		dialogNames= [UIManager.UI_ESTIMATE,UIManager.UI_HOT_LINE,UIManager.UI_SECURITY,UIManager.UI_CLASSFICATE_1];
		if(dialogNames.length>0){
			
			UIManager.getInstance().setDialogQueue(dialogNames);
			UIManager.getInstance().nextDialog();
		}
		
	}
}

