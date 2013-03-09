#pragma strict

public var road:GameObject;
public var barrier:GameObject;
public var line_prefab:GameObject;
public var ganZi:GameObject;

private var mBarrierArray:Array = [];
public var tilePrefab:GameObject;

private var COL:int = 40;
private var ROW:int = 48;

private var currentTile:String="";

private var mLines:Array = null;
private var m_startGanzi:GameObject = null;
private var m_lastGanzi:GameObject = null;


private var m_positions:Array;
private var index:int = 0;
private var m_startGameObject:GameObject;

public var dangerousArea:Array = [new Vector2(14,22),
									new Vector2(24,22),
									new Vector2(14,29),
									new Vector2(24,29)		
										];

/**
*	0000000000111111111110000000000
*/
function Start () {

	m_positions = [];
	mBarrierArray = [];
	for(var col:int = 0;col<COL;col++){
		var temp:Array =[];
		//mBarrierArray[col] = [];
		for(var row:int = 0; row<ROW;row++){
			if(row>=14 && row<25 || col>=30){
				if(null == tilePrefab){
					continue;
				}
				var tile:GameObject = Instantiate(tilePrefab);
				//mBarrierArray[col].push(tile);
				temp.push(tile);
				tile.transform.parent = transform;
				tile.transform.position = new Vector3(col*2,0,row*2);
				// tile.transform.localScale = new Vector3(1,0,1);
				tile.name="tile_"+row+"_"+col;
			}else{
				temp.push(null);
				//mBarrierArray[col].push(null);
			}
		}
		mBarrierArray[col] = temp;
	}
	
	this.transform.position = new Vector3(34,-0.2,-2);
	this.transform.Rotate(new Vector3(0,270,0));

	mLines = new Array();
}

function Update () {
	if(Global.getInstance().getCurrentState() == Global.UI){
		return ;
	}
	if(GUIUtility.hotControl!=0){
		return;
	}
	

	if(Input.GetMouseButtonDown(0))
	{
		var op:String = UIManager.getInstance().getCurrentOperation();	
	 	if(op == UIManager.OPERATION_DUN){
	 		setBarrier();	

	 	}else if(op == UIManager.OPERATION_LINE){
	 		setBarrier();		
	 	}
	}

}

function connect():void{
	
}

function setBarrier():void{
	
	 var ray: Ray =Camera.main.ScreenPointToRay(Input.mousePosition);
	 var hit : RaycastHit;
	 var layerMask = 1<<8;
	 if(Physics.Raycast(ray,hit, 200,layerMask))
	 {
	 	var str:String = hit.collider.name;
	 	str = str.Substring(5);
	 	Debug.Log(str + "receives the click event");
	 	if(str.IndexOf("_")==-1){
	 		return;
	 	}
	 	var tempArray:Array = str.Split('_'[0]);
	 	
	 	var mousePos:Vector3 = hit.point;
	 	var cube:GameObject = null;
	 	var op:String = UIManager.getInstance().getCurrentOperation();
	 	
	 	var row:int = int.Parse(tempArray[0]);
		var col:int= int.Parse(tempArray[1]);
		var rowArray:Array = null;
	 	if(op == UIManager.OPERATION_DUN){
	 		cube =  Instantiate(barrier);
	 		cube.name = "barrier_"+str;
		 	rowArray = mBarrierArray[row] as Array;
		 	rowArray[col] = 2;// it is barrier;

		 	cube.transform.position = mousePos;//Camera.mainCamera.ScreenToViewportPoint(mousePos);
		 	cube.transform.localPosition.y=0.2;
		 	cube.transform.parent = transform;
		 	if(null == m_startGameObject){
		 		m_startGameObject = cube;
		 	}
		 	else{
		 		createLine(m_startGameObject.transform.position ,cube.transform.position);
		 		m_startGameObject = cube;
		 	}
		 	m_positions[index] = str;
		 	index++;

	 	}
	 	if(op == UIManager.OPERATION_LINE){
	 		if(line_prefab){
	 			cube =  Instantiate(ganZi);
	 		}
	 		cube.transform.position = mousePos;//Camera.mainCamera.ScreenToViewportPoint(mousePos);
		 	cube.transform.localPosition.y=0.2;
		 	cube.transform.parent = transform;
	 		cube.name = "ganzi_"+str;
	 		rowArray = mBarrierArray[row] as Array;
		 	rowArray[col] = 3;// it is ganzi;

		 	

		 	if(null == m_startGanzi){
		 		m_startGanzi = cube;
		 	}
		 	// if(null == m_lastGanzi){
		 	// 	m_lastGanzi = cube;
		 	// }
		 	if(m_startGanzi!=null && m_lastGanzi!=null){
		 		m_startGanzi = m_lastGanzi;
		 	}
		 	m_lastGanzi = cube;

		 	if(m_lastGanzi && m_startGanzi && m_startGanzi!=m_lastGanzi){

			 	var endPosition:Vector3 = m_lastGanzi.transform.position;
			 	var startPosition:Vector3 = m_startGanzi.transform.position;
			 	var targetDir = endPosition - startPosition;
			 	var forward = cube.transform.forward;
			 	endPosition.y = 0;
			 	startPosition.y = 0;
			 	var angle = CardinalAngles(endPosition,startPosition);
			 	
			 	var distance = Vector3.Distance	(endPosition,startPosition);
			 	var line:GameObject = Instantiate(line_prefab);
			 	line.transform.parent = transform;
			 	
			 	Debug.Log("distance = "+ distance +",angle = "+angle);
			 	

			 	var position:Vector3 = (endPosition + startPosition)/2;
			 	line.transform.position = position;
			 	var scale:int = distance/32;

			 	
			 	line.transform.localEulerAngles.x = angle.x ;
				line.transform.localEulerAngles.y = angle.y ;
				line.transform.localEulerAngles.z = angle.z ;
			 	line.transform.localScale += new Vector3(scale,0,0);
			 	line.transform.localPosition.y = 1.5;
		 	}
	 	}
	 	
	 	
	 	
	 	//mousePos.y = transform.position.y;
	 	
	 	
	 }

}

function createLine(startPosition:Vector3,endPosition:Vector3):void{
	var targetDir = endPosition - startPosition;
 	//var forward = cube.transform.forward;
 	endPosition.y = 0;
 	startPosition.y = 0;
 	var angle = CardinalAngles(endPosition,startPosition);
 	
 	var distance = Vector3.Distance	(endPosition,startPosition);
 	var line:GameObject = Instantiate(line_prefab);
 	line.transform.parent = transform;
 	
	
 	Debug.Log("distance = "+ distance +",angle = "+angle);
 	

 	var position:Vector3 = (endPosition + startPosition)/2;
 	line.transform.position = position;
 	var scale:int = distance/32;

 	
 	line.transform.localEulerAngles.x = angle.x;
	line.transform.localEulerAngles.y = angle.y ;
	line.transform.localEulerAngles.z = angle.z ;
 	//line.transform.localScale += new Vector3(scale,0,0);
 	line.transform.localPosition.y = 1.5;
 	
}

function CardinalAngles( pos1 : Vector3, pos2 : Vector3 ) {

  // Adjust both positions to be relative to our origin point (pos1)

  pos2 -= pos1;

  pos1 -= pos1;

 

  var angles : Vector3;

  

  // Rotation to get from World +Z to pos2, rotated around World X (degrees up from Z axis)

  angles.x = Vector3.Angle( Vector3.forward, pos2 - Vector3.right * pos2.x );

  // Rotation to get from World +Z to pos2, rotated around World Y (degrees right? from Z axis)

  angles.y = Vector3.Angle( Vector3.forward, pos2 - Vector3.up * pos2.y );

  // Rotation to get from World +X to pos2, rotated around World Z (degrees up from X axis)

  angles.z = Vector3.Angle( Vector3.right, pos2 - Vector3.forward * pos2.z );

 

  return angles;

}

function judgeLeftArea(row:int,col:int):boolean{
	if(row < 14 && col >29){
		return true;
	}
	return false;
}
function isValidLeftPosition(row:int,col:int):boolean{
	return true;
}

function getScoreFromLeftPosition(row:int,col:int):int{
	var t:int = row - 14;
	var score :int = t/2;
	if(row > 35){
		score = (10 - (row - 35));
	}else{
		score = (10 - (35 - row));
	}
	Debug.Log("getScoreFromLeftPosition::row::col"+ row +","+ col+",score = "+ score +",t = "+ t);
	return score;
}

function judgeRightArea(row:int,col:int):boolean{
	if(row > 24 && col >29){
			return true;
		}
		return false;
}
function isValidRightPosition(row:int,col:int):boolean{
	return true;	
}


function getScoreFromRightPosition(row:int,col:int):int{
	var t:int = row - 14;
	var score :int= t/2;
	if(row > 35){
		score = (10 - (row - 35));
	}else{
		score = (10 - (35 - row));
	}
	Debug.Log("getScoreFromRightPosition::row::col"+ row +","+ col+",score = "+ score);
	return score;
}

function judgeTopArea(row:int,col:int):boolean{
	if(row >=14  && row <=24 && col <=29){
			return true;
		}
		return false;
}
function isValidTopPosition(row:int,col:int):boolean{
	return true;
}


function getScoreFromTopPosition(row:int,col:int):int{
	var t:int = col;
	var score :int = t/2;
	if(col > 18){
		score = (10 - (col - 18));
	}else{
		score = (10 - (18 - col));
	}
	Debug.Log("getScoreFromTopPosition::row::col"+ row +","+ col+",score = "+ score);
	return score;
}

function computerScore():void{
	Debug.Log("[computerScore][score]????????????????????????????????????");
	var lens:int = m_positions.length;
	var score:int = 0;
	for(var index:int  = 0;  index < lens; index ++ ){
		var str:String = m_positions[index];
		if(str.IndexOf("_") ==-1){
			continue;
		}
		var tempArray:Array = str.Split('_'[0]);
		var row:int = int.Parse(tempArray[0]);
		var col:int = int.Parse(tempArray[1]);

		var valid:boolean = false;
		var isLeft:boolean = judgeLeftArea(row,col);
		if(isLeft){
			valid = isValidLeftPosition(row,col);
			if(valid){
				score +=getScoreFromLeftPosition(row,col);
			}
		}


		var isRight:boolean = judgeRightArea(row,col);
		if(isRight){
			valid = isValidRightPosition(row,col);
			if(valid){
				score +=getScoreFromRightPosition(row,col);
			}
		}

		var isTop:boolean = judgeTopArea(row,col);
		if(isTop){
			valid = isValidTopPosition(row,col);
			if(valid){
				score +=getScoreFromTopPosition(row,col);
			}
		}
	}
	UIManager.getInstance().addScore(score );
	Debug.Log("[computerScore][score]"+score);
}


