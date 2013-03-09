#pragma strict

private var COL:int = 40;
private var ROW:int = 48;
public var tilePrefab:GameObject;
public var tileDangerous:GameObject;
public var warningGameObject:GameObject;
public var dun:GameObject;

private static var DIRECT_TOP:String = "top";
private static var DIRECT_LEFT:String = "left";
private static var DIRECT_RIGHT:String = "right";

private var validTileMap:Array;
public var dangerousArea:Array = [new Vector2(14,22),
									new Vector2(24,22),
									new Vector2(14,29),
									new Vector2(24,29)		
										];


private var startCol:int =22 ;
private var startRow:int = 14;
private var endCol:int = 29;
private var endRow:int = 24;	


// private var top_score_rule:
private var top_score_map:Hashtable = new Hashtable();
private var left_score_map:Hashtable = new Hashtable();
private var right_score_map:Hashtable = new Hashtable();

function Start () {
	top_score_map = {};
	validTileMap =new Array();
	init();
}


function init():void{
	for(var col:int = 0;col<COL;col++){
		var temp:Array =[];
		//mBarrierArray[col] = [];
		for(var row:int = 0; row<ROW;row++){
			if(row>=14 && row<=25 || col>=30){
				if(null == tilePrefab){
					continue;
				}
				var tile:GameObject ;
				var tileName:String;
				Debug.Log(row+","+col +"startRow = "+ startRow +",endRow = "+ endRow+",startCol = "+ startCol+",endCol = "+ endCol);
				if(row  >=startRow && row <= endRow && col>=startCol && col<=endCol){
					tile = Instantiate(tileDangerous);		
					tileName="dangerous_"+row+"_"+col;
				}else{
					if(row  >= (startRow-5) && row <= (endRow+5) && col>=(startCol-5) && col<=(endCol+5)){
						tile = Instantiate(warningGameObject);	
						tileName="warning_"+row+"_"+col;
					}else if(row<=(startRow -15) || row> (endRow+15) || col< (startCol-15) || col> (endCol+15)){
						tile = Instantiate(warningGameObject);	
						tileName="warning_"+row+"_"+col;
					}else {
						tile = Instantiate(tilePrefab);	
						tileName = "tile_"+row+"_"+col;
						validTileMap.push(tileName);

					}
					
				}
				
				//mBarrierArray[col].push(tile);
				temp.push(tile);
				tile.transform.parent = transform;
				tile.transform.position = new Vector3(col,0,row);
				tile.active = true;
				tile.SetActiveRecursively(true);
				// tile.transform.localScale = new Vector3(1,0,1);
				tile.name=tileName;
			}else{
				temp.push(null);
				//mBarrierArray[col].push(null);
			}
		}
		//mBarrierArray[col] = temp;
	}

	transform.localPosition = new Vector3(63.74886,21.31554,34.12717);
	transform.localEulerAngles = new Vector3(2.413025,275.5127,267.3887);

}

function Update () {
	if(Input.GetMouseButtonDown(0))
	{
		var ray: Ray =Camera.main.ScreenPointToRay(Input.mousePosition);
		var hit : RaycastHit;
		 
		 if(Physics.Raycast(ray,hit, 200))
		 {
		 	var str:String = hit.collider.name;
		 	var mousePos:Vector3 = hit.point;
			addDun(mousePos); 	
		
		
			var name:String= str;
			var count:int = validTileMap.length;
			var isValid:boolean = false;
			for(var index:int = 0;index < count ;index++){
				if(validTileMap[index] == name){
					Debug.Log( name +" is a valid tile!");
					isValid = true;
					break;
				}
			}
			var score:int = 0;
			if(isValid){
				var pos:Vector2 = getPosition(name);
				var dir:String = getDirection(pos);
				score = getScoreByPositionAndDirection(pos,dir);

			}
			Debug.Log(name +", score = "+score);
		}
	}
}
public function addDun (mousePos:Vector3) {
	var dun:GameObject = Instantiate(dun);
	dun.transform.parent = transform;
	dun.transform.position = mousePos;
	dun.transform.localScale = new Vector3(10,10,10);
}
public function getTileByGlobalPosition():String{
	
}

function getPosition(str:String):Vector2{
	str = str.Substring(5);

 	if(str.IndexOf("_")==-1){
 		return;
 	}
 	var tempArray:Array = str.Split('_'[0]);
 	
 	var row:int = int.Parse(tempArray[0]);
	var col:int= int.Parse(tempArray[1]);

	return new Vector2(col,row);
}

function getDirection(pos:Vector2):String{
	if(pos.x < startCol){
		return "top";
	}
	if(pos.y < startRow ){
		return "left";
	}
	if(pos.y > endRow){
		return "right";
	}
	if(pos.x > endCol){
		return "bottom";
	}
}

public function getScoreByPositionAndDirection(position:Vector2,direct:String):int{
	var row:int ; 
	var col:int ;
	var colDistance:int ;
	var rowDistance:int ;
	if(direct == DIRECT_TOP){
		if(top_score_map == null){
			top_score_map = new Hashtable();
		}
		row =  position.y;
		col =  position.x;
		// Debug.Log("row = "+ row+",col = "+ col);
		colDistance = startCol - col;
		rowDistance = row - endRow;
		Debug.Log("endRow ="+endRow+",startCol = "+startCol+",row = "+ row+",col = "+ col+",rowDistance = "+ rowDistance +",colDistance = "+colDistance);
		

		if( colDistance >=5 && colDistance <=15 || rowDistance >=5 && rowDistance<=15){
			var newrow:int =  row/2;
			if(top_score_map[newrow] == null ){
				top_score_map[newrow] = 2;
				Debug.Log("endRow ="+endRow+",startCol = "+startCol+",row = "+ row+",col = "+ col+",rowDistance = "+ rowDistance +",colDistance = "+colDistance+",score = 2");
				return 2;
			}	
		}
		
		
	}
	if(direct == DIRECT_RIGHT){
		col =  position.x;
		colDistance = col - endCol;
		rowDistance = row - endRow;
		if(colDistance>=5 && colDistance<=15|| rowDistance>=5 && rowDistance<=15){
			col =  col/2;
			if(right_score_map[col] == null){
				right_score_map[col] = 2;
				return 2;
			}
		}
	}
	if(direct == DIRECT_LEFT){
		col =  position.x;
		colDistance = col - endCol;
		rowDistance = endRow - row;
		if(colDistance>=5 && colDistance<=15 || rowDistance>=5 && rowDistance<=15){
			col = col/2;
			if(left_score_map[col] == null){
				left_score_map[col] = 2;
				return 2;
			}
		}
	}

	return 0;
}


