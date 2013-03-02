#pragma strict

public var avator_atlas_prefab:GameObject;

private static var m_instance:AtlasManager;
private var m_avator_atlas:UIAtlas;

public static var TYPE_AVATORS:String="avators";
function Start () {
	m_instance = this;
	
}

function Update () {

}
public static function  getInstance():AtlasManager{
	return m_instance;
}

public function getAtlas(type:String):UIAtlas{
	if(type == "avators"){
		if(null !=m_avator_atlas){
			m_avator_atlas = Instantiate(avator_atlas_prefab) as UIAtlas;
		}
		return m_avator_atlas ;	
	}
	return null;
}
