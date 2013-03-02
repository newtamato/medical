private var currentAngle : float = 0;
private var targetAngle : float = 0;
private var buttonSize : Vector2 = Vector2(120,50);
private var buttonRect : Rect;


private var m_start:boolean = false;
function Start(){
	//buttonRect = new Rect((Screen.width/2) - (buttonSize.x/2),(Screen.height/2) - (buttonSize.y/2),buttonSize.x,buttonSize.y);
}


function Update():void{
	return;
	if(gameObject.transform){
		// currentAngle = iTween.FloatUpdate(currentAngle, targetAngle, 3);
		// var result:Number = Mathf.Abs(transform.localRotation.z - currentAngle );
		
		// if(transform.eulerAngles.z >=targetAngle){
		// 	//currentAngle = 0;
		// 	return;
		// }
		
		if(m_start == false){

		}else{
			currentAngle = iTween.FloatUpdate(currentAngle, targetAngle, 3);
			transform.RotateAround(transform.position,Vector3.forward,currentAngle);
		}
	}
  

    //GUI.matrix = matrixBackup;

}
public function StartRotate():void{
	Debug.Log("OnClick.........");
	currentAngle =currentAngle + 1801;
	m_start = true;
	iTween.RotateTo(gameObject,iTween.Hash("z",currentAngle,"name","rotate","time",2,"delay",0.1,"transition","easeInOutCubic"));
	
}

public function StopRotate():void{
	m_start = false;
	iTween.StopByName("rotate");
}