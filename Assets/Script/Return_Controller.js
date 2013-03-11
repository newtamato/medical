#pragma strict

function Start () {

}

function returnBack () {
	UIManager.getInstance().clearAll();
	UIManager.getInstance().showDialog(UIManager.UI_MENU,0);
}