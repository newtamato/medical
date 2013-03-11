//----------------------------------------------
//            NGUI: Next-Gen UI kit
// Copyright © 2011-2012 Tasharen Entertainment
//----------------------------------------------

using UnityEngine;

[AddComponentMenu("NGUI/Examples/Drag & Drop Item")]
public class DragDropItem : MonoBehaviour
{
	/// <summary>
	/// Prefab object that will be instantiated on the DragDropSurface if it receives the OnDrop event.
	/// </summary>

	public GameObject prefab;

	Transform mTrans;
	bool mIsDragging = false;
	Transform mParent;

	/// <summary>
	/// Update the table, if there is one.
	/// </summary>

	void UpdateTable ()
	{
		UITable table = NGUITools.FindInParents<UITable>(gameObject);
		Debug.Log("XXXXXXKKKKKKKAKKAKAKAKAKAKAKAK"+table);
		if (table != null) table.repositionNow = true;

		UIGrid grid = NGUITools.FindInParents<UIGrid>(gameObject);
		if (grid!= null) grid.repositionNow = true;
		
	}

	/// <summary>
	/// Drop the dragged object.
	/// </summary>

	void Drop ()
	{
		// Is there a droppable container?
		//Debug.Log("DragDropItem::Drop");
		if(mParent ==null || mParent.gameObject == null){
			return ;
		}
		Collider col = UICamera.lastHit.collider;
		DragDropContainer container = (col != null) ? col.gameObject.GetComponent<DragDropContainer>() : null;
		
		bool valid = false;

		if (container != null)
		{
		//	Debug.Log("DragDropItem::Drop::container exists :: "+col.gameObject.name);
			// Container found -- parent this object to the container
			mTrans.parent = container.transform;
			valid = true;

			
		}
		else
		{
			//Debug.Log("DragDropItem::Drop::"+col.gameObject.name);
			// No valid container under the mouse -- revert the item's parent
			if(mParent && mParent.gameObject){
				mTrans.parent = mParent;
				valid = false;
				//Debug.Log("[DragDropItem::Drop] mParent = "+ mParent.gameObject.name);
			}
		}
		// Notify the table of this change
		UpdateTable();
		// Make all widgets update their parents
		BroadcastMessage("CheckParent", SendMessageOptions.DontRequireReceiver);
		
		UICamera.currentCamera.BroadcastMessage("DropItemComplete",valid,SendMessageOptions.DontRequireReceiver);
	}

	/// <summary>
	/// Cache the transform.
	/// </summary>

	void Awake () { mTrans = transform; }

	/// <summary>
	/// Start the drag event and perform the dragging.
	/// </summary>

	void OnDrag (Vector2 delta)
	{
		if (UICamera.currentTouchID == -1)
		{
			if (!mIsDragging)
			{
				mIsDragging = true;
				mParent = mTrans.parent;
				Debug.Log("[DragDropItem][OnDrag]"+ mParent.gameObject.name);
				mTrans.parent = DragDropRoot.root;
				Vector3 position = new Vector3(0,0,0);
				DragPositonComponent positionComponent = mTrans.GetComponent<DragPositonComponent>();
				if(positionComponent){
					position = positionComponent.positionDelta;
					mTrans.localPosition += position;
					
				}

				if(DragDropRoot.root.gameObject){
				//	Debug.Log("[DragDropItem::OnDrag]drag drop root name is " + DragDropRoot.root.gameObject.name);
				}
				mTrans.BroadcastMessage("CheckParent", SendMessageOptions.DontRequireReceiver);
			}
			else
			{

				mTrans.localPosition += (Vector3)delta ;
				//Debug.Log("[DragDropItem::OnDrag] delta = "+delta +",position = ");

			}
		}
	}

	/// <summary>
	/// Start or stop the drag operation.
	/// </summary>

	void OnPress (bool isPressed)
	{
		mIsDragging = false;
		Collider col = collider;
		if (col != null) col.enabled = !isPressed;
		if (!isPressed) Drop();
	}
}