#pragma strict

public var test:String="";
private var currentState:String = "UI";

public static var UI:String = "UI";
public static var SCENE:String = "scene";

private static var m_instance:Global;

function Start():void{
	m_instance = this;
}
public static function getInstance():Global{
	return m_instance;
}
public function setCurrentState(str:String):void{
	currentState = str;
}

public function getCurrentState():String{
	return currentState;
}