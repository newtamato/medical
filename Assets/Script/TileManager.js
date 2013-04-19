#pragma strict

private var COL:int = 44;
private var ROW:int = 60;//48;
public var tilePrefab:GameObject;
public var tileDangerous:GameObject;
public var warningGameObject:GameObject;
public var dun:GameObject;
public var mapContainer:GameObject;

//public var tileItemBack:GameObject;

private static var DIRECT_TOP:String = "top";
private static var DIRECT_LEFT:String = "left";
private static var DIRECT_RIGHT:String = "right";
private static var DIRECT_BOTTOM:String = "bottom";


private var validTileMap:Array;
public var dangerousArea:Array = [new Vector2(14,22),
									new Vector2(24,22),
									new Vector2(14,29),
									new Vector2(24,29)		
										];


private var startCol:int =24;//22 ;
private var startRow:int = 24;//14;
private var endCol:int = 29;//29;
private var endRow:int = 35;//24;	
private var minDistnace:int = 9;
private var maxDistance:int = 19;

// private var top_score_rule:
private var top_score_map:Hashtable = new Hashtable();
private var left_score_map:Hashtable = new Hashtable();
private var right_score_map:Hashtable = new Hashtable();
private var bottom_score_map:Hashtable = new Hashtable();


private var m_score:int = 0;
private var m_dun:Array =[];

function Start () {
	top_score_map = {};
	validTileMap =new Array();
	init();
}
function clearMap():void{
	top_score_map = new Hashtable();
	left_score_map =new Hashtable();
	right_score_map =new Hashtable();
	bottom_score_map =new Hashtable();
	for(var go:GameObject in m_dun){
		Destroy(go);
	}
	//validTileMap =new Array();
}

function init():void{
	for(var col:int = 0;col<COL;col++){
		var temp:Array =[];
		//mBarrierArray[col] = [];
		for(var row:int = 0; row<ROW;row++){
			var color:String ="";
			if(row>=startRow && row<=endRow || col>=30){
				if(null == tilePrefab){
					continue;
				}
				var tile:GameObject ;
				var tileName:String;
				Debug.Log(row+","+col +"startRow = "+ startRow +",endRow = "+ endRow+",startCol = "+ startCol+",endCol = "+ endCol);
				if(row  >=startRow && row <= endRow && col>=(startCol) && col<=endCol){
					//tile = Instantiate(tileDangerous);		
					color = "red";
					tileName="dangerous_"+row+"_"+col;
				}else{
					if(row  >= (startRow-minDistnace) && row <= (endRow+minDistnace) && col>=(startCol-minDistnace) && col<=(endCol+minDistnace)){
						//tile = Instantiate(warningGameObject);	
						color = "yellow";
						tileName="warning_"+row+"_"+col;
					}else if(row<=(startRow -maxDistance) || row> (endRow+maxDistance) || col< (startCol-maxDistance) || col> (endCol+maxDistance)){
						// tile = Instantiate(warningGameObject);	
						color = "yellow";
						tileName="warning_"+row+"_"+col;
					}else {
						// tile = Instantiate(tilePrefab);	
						color = "green";
						tileName = "tile_"+row+"_"+col;
						validTileMap.push(tileName);

					}
					
				}
				
				//mBarrierArray[col].push(tile);
				// temp.push(tile);
				createItem(color,col,row,tileName);
				// tile.transform.parent = transform;
				// tile.transform.position = new Vector3(col,0,row);
				// tile.active = true;
				// tile.SetActiveRecursively(true);
				// tile.transform.localScale = new Vector3(1,0,1);
				// tile.name=tileName;
			}else{
				// tile = Instantiate(warningGameObject);	
				color = "yellow";
				tileName="warning_"+row+"_"+col;
				//createItem(color,col,row,tileName);
				temp.push(null);
				//mBarrierArray[col].push(null);
			}
		}
		//mBarrierArray[col] = temp;
	}
	transform.localPosition = new Vector3(-33.72162,2.023206,-38.00631);
	transform.localEulerAngles = new Vector3(0,1.480264,0);
	transform.localScale = new Vector3(2,1,2);
	if(mapContainer){
		mapContainer.transform.localPosition = new Vector3(-28.85179,-30,180);
		mapContainer.transform.localEulerAngles = new Vector3(270,0,0);
	}
	// var table:UITable = transform.GetComponent(UITable);
	// table.Reposition();
}

function createItem(color:String,col:int,row:int,name:String):void{
	
	//var table:UITable = transform.GetComponent(UITable);

	// var tile:GameObject = Instantiate(tileItemBack);
	// var back:UISprite = tile.GetComponent(UISprite);
	// back.spriteName = color+"Back";
	var tile:GameObject ;
	if(color == "red"){
		tile = Instantiate(tileDangerous);
	}
	if(color == "yellow"){
		tile = Instantiate(warningGameObject);
	}
	if(color == "green"){
		tile = Instantiate(tilePrefab);
	}
	tile.name = name;
	tile.transform.parent = transform;
	var size:int = 1;
	tile.transform.position = new Vector3(col*size,0,row*size);
	tile.transform.localScale = new Vector3(size,size,size);
	tile.transform.localEulerAngles = new Vector3(0,0,0);
	Debug.Log("OOOOOOOOO " + tile.renderer.material.color.a);
	tile.renderer.material.color.a = 0.1;
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
				getScoreByPositionAndDirection(pos,dir);
				// m_score+=score;
			}
			
		}
	}
}
public function addDun (mousePos:Vector3) {

	var dun:GameObject = Instantiate(dun);
	dun.transform.parent = transform;
	

	dun.transform.localScale = new Vector3(20,20,20);
	dun.transform.position = mousePos;
	dun.transform.localPosition.y = 22;
	Debug.Log(mousePos,this);
	m_dun.push(dun);
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
	row =  position.y;
	col =  position.x;
	if(direct == DIRECT_TOP){
		if(top_score_map == null){
			top_score_map = new Hashtable();
		}
		
		// Debug.Log("row = "+ row+",col = "+ col);
		colDistance = startCol - col;
		rowDistance = row - endRow;
		Debug.Log("endRow ="+endRow+",startCol = "+startCol+",row = "+ row+",col = "+ col+",rowDistance = "+ rowDistance +",colDistance = "+colDistance);
		var newrow:int =  row/2;
		if(top_score_map[newrow] == null ){
			top_score_map[newrow] = 2;
			Debug.Log("endRow ="+endRow+",startCol = "+startCol+",row = "+ row+",col = "+ col+",rowDistance = "+ rowDistance +",colDistance = "+colDistance+",score = 2");
			return 2;
		}	
		// if( colDistance >=minDistnace && colDistance <=15 || rowDistance >=minDistnace && rowDistance<=15){
		// 	var newrow:int =  row/2;
			
		// }
		
		
	}
	if(direct == DIRECT_RIGHT){
		
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

	if(direct == DIRECT_BOTTOM){
		row =  row/2;
		if(bottom_score_map[row] == null){
			bottom_score_map[row] = 2;
			return 2;
		}

	}

	return 0;
}

function onConfirm():void{
	var count:int  = 0;
	if(top_score_map!=null){
		count +=top_score_map.Count;
	}
	if(left_score_map!=null){
		count+=left_score_map.Count;
	}
	if(right_score_map!=null){
		count+=right_score_map.Count;
	}
	Debug.Log("onConfirm........................................count = "+ count);

	UIManager.getInstance().addScore(count*2);
	Global.getInstance().setCurrentState(Global.UI);
	UIManager.getInstance().activeSceneAndDeactiveMap(true);
	
	UIManager.getInstance().addFinishedDialog(UIManager.UI_SECURITY);	
	UIManager.getInstance().nextDialog();	
}


