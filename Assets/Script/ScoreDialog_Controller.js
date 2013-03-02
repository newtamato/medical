#pragma strict
public var stars:UIGrid;
public var award:UISprite;
public var starPrefab:GameObject;


function Start () {

}

function Update () {

}
function setScore(score:int):void{
	var allScore:int = DataManager.getInstance().getAllScore();
	Debug.Log("ScoreDialog::setScore::"+ score);

	var starNumber:int = 0;
	
	if(score>0 && score <=20){
		starNumber =1;
	}else if(score <=40){
		starNumber =2;
	}else if(score <=60){
		starNumber =3;
	}else if(score <=80){
		starNumber =4;
	}else if(score <=200){
		starNumber =5;
	}
	addStar(starNumber);
	award.spriteName = "award_"+ starNumber;
}
function returnBackHome():void{
	UIManager.getInstance().showDialog(UIManager.UI_MENU);
}
function addStar(count:int):void{
	var starTrans:Transform=stars.transform;
	var index:int = 0;
	stars.transform.DetachChildren();
	for(index =0; index<count;index++){
		var star:GameObject = Instantiate(starPrefab);
		star.transform.parent = starTrans;
		star.transform.localScale = new Vector3(72,72,1);
	}
	stars.Reposition();
}

