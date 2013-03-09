private var currentAngle : float = 0;
private var targetAngle : float = 0;
private var buttonSize : Vector2 = Vector2(120,50);
private var buttonRect : Rect;


private var m_start:boolean = false;
function Start(){
	//buttonRect = new Rect((Screen.width/2) - (buttonSize.x/2),(Screen.height/2) - (buttonSize.y/2),buttonSize.x,buttonSize.y);
}


function Update():void{
	
	if(m_start){
		currentAngle--;
		transform.localEulerAngles.z = currentAngle;	
	}
	else{
		currentAngle = transform.localEulerAngles.z;
	}

}
public function StartRotate():void{
	currentAngle = transform.localEulerAngles.z;
	m_start = true;
	
}

public function StopRotate():void{
	m_start = false;
	
}