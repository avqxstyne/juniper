import { useEffect, useState,  useCallback } from 'react'

import "quill/dist/quill.snow.css"

import Quill from 'quill';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const AUTOSAVE_INTERVAL = 10000;

const TextEditor = () => {

    const {id: documentId} = useParams()
    const [socket, setSocket] = useState() as any;
    const [quill, setQuill] = useState() as any;

    // -- UseEffect for server connection to socket.io server ------------------------------
    useEffect(() => {
      const s = io("http://localhost:8000");
      setSocket(s);
    
      return () => {
        s.disconnect()
      }
    }, [])

    // -- UseEffect for text change handling ------------------------------
    useEffect(() => {
      if (socket == null || quill == null) return
      // @ts-ignore
      const handler = (delta, oldDelta, source) => {
        if (source !== 'user') return
        socket.emit("send-changes", delta) 
      };

      quill.on('text-change', handler)

      return () => {
        quill.off('text-change', handler)
      }

    }, [socket, quill])

    // -- UseEffect for recieving updates ------------------------------
    useEffect(() => {
      if (socket == null || quill == null) return
      // @ts-ignore
      const handler = (delta) => {
        quill.updateContents(delta)
      };

      socket.on('receive-changes', handler)

      return () => {
        socket.off('receive-changes', handler)
      }

    }, [socket, quill])

	// -- UseEffect for rooms and loading documents ------------------------------
    useEffect(() => {
        if (socket == null || quill == null) return

		socket.once('load-document', (document: any) => {
			quill.setContents(document)
			quill.enable()
		})

		socket.emit("get-document", documentId)

    }, [socket, quill, documentId])

	// -- UseEffect for recieving updates ------------------------------
    useEffect(() => {
		if (socket == null || quill == null) return
		
		setInterval(() => {
			socket.emit("save-document", quill.getContents())
		}, AUTOSAVE_INTERVAL)
  
	  }, [socket, quill])

    // -- Quill text editor setting configuration ------------------------------------------
    const modules = {
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
          ],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
    }
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ]
  

    // -- Forming the editor -----------------------------------------------------------
    // @ts-ignore
    const wrapperRef = useCallback(wrapper => {
      if (wrapper == null) return
  
      wrapper.innerHTML = ""
      const editor = document.createElement("div")
      wrapper.append(editor)

      const q = new Quill(editor, {
        theme: "snow",
        modules: modules,
        formats: formats
      })
	  q.disable();
	  q.setText("Loading...")
      setQuill(q)

	
      
    }, [])

    return (


        <div className="quill" ref={wrapperRef}></div>

    )
}

export default TextEditor

