#pragma strict


public var dun_prefab:GameObject;

private var ROW:int = 5;

private var top_score_map:Array = [];
private var left_score_map:Array = [];
private var right_score_map:Array = [];
private var bottom_score_map:Array = [];

private var m_score:int = 0;
private var m_duns:Array =[];
// x* ROw +y;
function Start () {

}

function init(){
	top_score_map = [];
	left_score_map = [];
	right_score_map =[ ];
	bottom_score_map = [];

	for(var go:GameObject in m_duns){
		Destroy(go);
	}
	m_duns =[];
	m_score = 0;
}

function Update () {
	if(Input.GetMouseButtonDown(0))
	{
		var ray: Ray =Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		 
		 if(Physics.Raycast(ray,hit))
		 {
		 	
		 	var str:String = hit.collider.name;
		 	if(str.IndexOf("valid")){
		 		getPositionAndDistanceAndScore(str);
		 		// m_score +=score;
		 	}
		 	
		 	addDun(hit.point,str);
		 }
	}
}

public function addDun (mousePos:Vector3,str) {
	var dun:GameObject = Instantiate(dun_prefab);
	dun.transform.parent = transform;
	dun.transform.position = mousePos;
	dun.transform.localScale = new Vector3(50,50,50);
	dun.name = "dun_"+str;
	m_duns.push(dun);
}

function getPositionAndDistanceAndScore(str:String):int{
	//str = str.Substring(5);

 	if(str.IndexOf("valid")==-1){
 		return 0;
 	}
 	Debug.Log("getPositionAndDistanceAndScore::str = "+ str);
 	var tempArray:Array = str.Split('_'[0]);
 	
 	var direction:String = tempArray[0];

	var row_col:int= int.Parse(tempArray[2]);
	
	var col:int = row_col/ROW;
	var row:int = row_col % ROW;
	Debug.Log("getPositionAndDistanceAndScore::str = "+ str+",direction = "+direction+",row_col = "+ row_col+",row = "+row);
	var result:int = -1;
	if(direction == "top"){
		// result = ArrayUtility.IndexOf(top_score_map,row);
		result = findValueInArray(top_score_map,row);
		if(result ==-1){
			top_score_map.push(row);	
			// ArrayUtility.Add(top_score_map,row);
		}
		
		return 2;
	}
	if(direction == "left"){
		// result = ArrayUtility.IndexOf(left_score_map,row);
		result = findValueInArray(left_score_map,row);
		if(result ==-1){
			left_score_map.push(row);	
		}
		return 2;
	}
	if(direction == "right"){
		
		// result = ArrayUtility.IndexOf(right_score_map,row);
		result = findValueInArray(right_score_map,row);
		if(result ==-1){
			right_score_map.push(row);	
		}
		
		return 2;
	}

	return 0;
}

public function findValueInArray(source:Array,value:int):int{
	for(var index:int = 0;index < source.length; index++){
		if(source[index] == value){
			return index;
		}
	}
	return -1;
}

public function onComplete():void{
	var count:int  = 0;
	if(top_score_map!=null){
		for(var key:int in top_score_map){
			Debug.Log("key = "+key );
		}
		count +=top_score_map.length;
	}
	if(left_score_map!=null){
		count+=left_score_map.length;
	}
	if(right_score_map!=null){
		count+=right_score_map.length;
	}
	m_score = count*2;
	Debug.Log("onConfirm........................................count = "+ count);
	UIManager.getInstance().addScore(m_score);
	
	Global.getInstance().setCurrentState(Global.UI);
	UIManager.getInstance().activeSceneAndDeactiveMap(true);
	
	UIManager.getInstance().nextDialog();	
	UIManager.getInstance().addFinishedDialog(UIManager.UI_SECURITY);	
	
	
}