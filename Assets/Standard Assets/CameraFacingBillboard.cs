using UnityEngine;
using System.Collections;
 
public class CameraFacingBillboard : MonoBehaviour
{
     public Camera m_Camera;
 
    void Update()
    {
        transform.LookAt(transform.position + m_Camera.transform.rotation * Vector3.back,
            m_Camera.transform.rotation * Vector3.up);
    }

    void  Awake ()
	{
		// if no camera referenced, grab the main camera
		if (!m_Camera)
			m_Camera = Camera.main; 
	}
}