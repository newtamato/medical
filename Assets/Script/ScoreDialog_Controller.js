#pragma strict
public var stars:UIGrid;
public var award:UISprite;
public var starPrefab:GameObject;
public var smallScore:GameObject;
public var bigScore:GameObject;

function Start () {

}

function Awake():void{
	DontDestroyOnLoad(transform.gameObject);
}

public function show(smallDialog:boolean,score:int):void{
	smallScore.active = false;
	smallScore.SetActiveRecursively(false);
	bigScore.active = false;
	bigScore.SetActiveRecursively(false);

	var container:Transform = null;
	if(smallDialog){
		smallScore.active = true;
		smallScore.SetActiveRecursively(true);
		smallScore.transform.localPosition = new Vector3(0,0,0);
		container = smallScore.transform;
	}else{
		bigScore.active = true;
		bigScore.SetActiveRecursively(true);
		bigScore.transform.localPosition = new Vector3(0,0,0);
		container = bigScore.transform;
	}
	initStarForContainer(container);

	setScore(score,container);
	var scoreLabelTrans:Transform = findTransformByName("scoreText",container);
	if(scoreLabelTrans){
		var label:UILabel = scoreLabelTrans.GetComponent(UILabel);
		label.text = score+"";
	}
	
}

function setScore(score:int,container:Transform):void{
	var allScore:int = DataManager.getInstance().getAllScore();
	Debug.Log("ScoreDialog::setScore::"+ score);

	var starNumber:int = 0;
	
	if(score>0 && score <=20){
		starNumber =1;
	}else if(score >20 && score <=40){
		starNumber =2;
	}else if(score >40 && score <=60){
		starNumber =3;
	}else if(score >60 && score <=80){
		starNumber =4;
	}else if(score >80 && score <=200){
		starNumber =5;
	}
	addStar(starNumber,container);
	// award.spriteName = "award_"+ starNumber;
}

function findTransformByName(name:String,parent:Transform):Transform{
	for(var child:Transform in parent){
		Debug.Log("child.gameObject.name = "+ child.gameObject.name);
		if(child.gameObject.name == name){
			return child;
		}
	}
	return null;
}

function initStarForContainer(container:Transform):void{
	var starTrans:Transform = findTransformByName("starContainer",container.transform);
	starTrans.DetachChildren();
	for(var index =0; index<5;index++){
		var star:GameObject = Instantiate(starPrefab);
		var img:UISprite = star.GetComponent(UISprite);
		if(img){
			img.spriteName = "star_black";
		}
		star.transform.parent = starTrans;
		star.transform.localScale = new Vector3(72,72,1);
	}
	var stars:UIGrid = starTrans.GetComponent("UIGrid");
	stars.Reposition();
}

function addStar(count:int,container:Transform):void{
	var starTrans:Transform = findTransformByName("starContainer",container.transform);
	// var starTrans:Transform=stars.transform;
	if(starTrans == null){
		return;
	}
	var index:int = 0;
	//stars.transform.DetachChildren();

	for(index =0; index<count;index++){
		var child:Transform = starTrans.GetChild(index);
		var img:UISprite = child.GetComponent(UISprite);
		if(img){
			img.spriteName = "star";
		}
	}
	
}



/***********************ok button handle*************************************/
function onSmallScorePanelOK():void{
	UIManager.getInstance().showDialog(UIManager.UI_MENU,0);	
}
function returnBackHome():void{
	UIManager.getInstance().showDialog(UIManager.UI_MENU,0);
}
