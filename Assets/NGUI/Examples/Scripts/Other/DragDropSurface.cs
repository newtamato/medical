//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2012 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;

/// <summary>
/// Simple example of an OnDrop event accepting a game object. In this case we check to see if there is a DragDropObject present,
/// and if so -- create its prefab on the surface, then destroy the object.
/// </summary>

[AddComponentMenu("NGUI/Examples/Drag & Drop Surface")]
public class DragDropSurface : MonoBehaviour
{
	public bool rotatePlacedObject = false;
	
	public UISprite container = null;
	void OnDrop (GameObject go)
	{
		Debug.Log("OnDrop...............");
		DragDropItem ddo = go.GetComponent<DragDropItem>();
		if(null == ddo){
			return;
		}
		DataItem_Controller data= ddo.GetComponent<DataItem_Controller>() ;
		if (ddo != null)
		{
			Transform containerTran =  gameObject.transform.Find("container");
			//UISprite container = (UISprite) containerTran.gameObject;
			//container.spriteName = data.image;
			//ChangeDisplayComponent cd= go.GetComponent<ChangeDisplayComponent>();
			//cd.changeImage(data.image);
			DataItem_Controller dataComponent = null;
			if(container){
				container.spriteName = data.image;
				dataComponent = gameObject.AddComponent<DataItem_Controller>();
				if(dataComponent && data){
					dataComponent.id = data.id;
					dataComponent.image = data.image;
					if(data.tag!=null){
						gameObject.tag = data.tag;
					}
					SendMessageUpwards("onDropToChangeDisplay",SendMessageOptions.DontRequireReceiver);
				}	
			}else{
				GameObject child = NGUITools.AddChild(gameObject, ddo.prefab);
			
				dataComponent = child.AddComponent<DataItem_Controller>();
				if(dataComponent && data){
					dataComponent.id = data.id;
					dataComponent.image = data.image;
					if(data.tag!=null){
						child.tag = data.tag;
					}
					
					Debug.Log(data.id +","+ data.image);
				}	
				//modify by mary
				child.SendMessageUpwards("onDropToChangeDisplay",SendMessageOptions.DontRequireReceiver);
				child.BroadcastMessage("onDropToChangeDisplay",SendMessageOptions.DontRequireReceiver);
				//child.transform.localScale = new Vector3(0.5f,0.5f,0.5f);
				Transform trans = child.transform;
				if (rotatePlacedObject) trans.rotation = Quaternion.LookRotation(UICamera.lastHit.normal) * Quaternion.Euler(90f, 0f, 0f);			
			}

			
			//trans.position = UICamera.lastHit.point;
			
			Destroy(go);
		}
	}
}