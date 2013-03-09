#pragma strict
private var flagMove:boolean = false;
private var mousePos:Vector3;
private var targetDir:Vector3;

private var walk:AnimationState;

function Start () {
	animation.Stop();

	// By default loop all animations
	animation.wrapMode = WrapMode.Loop;

	walk = animation["walk"];
	//walk.enabled = true;
	walk.wrapMode = WrapMode.Loop;
	// Put the idle animation in a lower layer.
	// This will make it only play if no walk / run cycle is faded in
	
	animation["idle"].layer = 0;
	animation["idle"].enabled = true;
	animation["idle"].weight = 1;
	
	walk.speed = 3;
	
}

function Update ()
{
 	if(Global.getInstance().getCurrentState() == Global.UI){
 		return ;
 	}
 	if(Global.getInstance().getCurrentState() == Global.SCENE){
 		return ;
 	}
 	// if(UIManager.getInstance().getCurrentOperation() == UIManager.OPERATION_DUN){
 	// 	return;
 	// }
 	// if(UIManager.getInstance().getCurrentOperation() == UIManager.OPERATION_LINE){
 	// 	return;
 	// }
	if(Input.GetMouseButtonDown(0))
	{
		
	    RayControl();
	}
	
	if(flagMove)
     {
	    if(Vector3.Distance(transform.position,mousePos)>1)
	    {
	     
	     walk.enabled = true;
	     animation.CrossFade("walk");
		 transform.Translate(transform.worldToLocalMatrix* transform.forward * Time.deltaTime*2);
	    }
	    else
	    {
	     if(walk){
	     	//walk.speed = 0;
	     	//walk.weight = 0;
	     	walk.enabled = false;
		 	flagMove=false;
		 }
		 
	    }
	}else{
		if(walk){
			walk.weight = 0;
			//walk.speed = 0;
		}
	}
}
 
function RayControl()
{
	
	 var ray: Ray =Camera.main.ScreenPointToRay(Input.mousePosition);
	 var hit : RaycastHit;
	 
	 if(Physics.Raycast(ray,hit,200))
	 { 
		
			 		 	
		 mousePos=hit.point;
		 mousePos.y=transform.position.y;
		 
		 targetDir=mousePos-transform.position;//  
		 var tempDir:Vector3=Vector3.Cross(transform.forward,targetDir.normalized);
		 var dotValue:float =Vector3.Dot(transform.forward,targetDir.normalized);
		 var angle:float =Mathf.Acos(dotValue)*Mathf.Rad2Deg;
		 if(tempDir.y<0)
		  {
			angle=angle*(-1);
		  }
		  transform.RotateAround(transform.position,Vector3.up,angle);
		  flagMove=true;
		}else{
			Debug.Log(hit.collider+","+hit.distance+","+hit.point);
		}
	}