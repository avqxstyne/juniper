import { useEffect, useState, useRef } from 'react'
import mySvg from '../assets/juniperfv.svg'
import { io } from 'socket.io-client';
import '../styles/Homepage.scss'
import DocView from './classes/DocView.js'


type Props = {

    name: "searchDocumentsInput",
  
    id: "searchDocumentsInput",
    
    placeholder: "Search Documents."
  
  };


const Homepage = (props: Props) => {

    const [socket, setSocket] = useState() as any;
    const [value, setValue] = useState("");
    // @ts-ignore

    

    useEffect(() => {
        const s = io("http://localhost:8000");
            setSocket(s);
        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket == null) return
        socket.emit('get-all')

        socket.once('display-all', (data: any[]) => {
            for (let i = 0; i < data.length; i++) {       
                

                // IMPLEMENTING THE CLASS INHERITANCE REQUIREMENT IN APP FUNCTIONALITY
                let href = `http://localhost:5173/document/${data[i].id}`
                let text = `${data[i].name}`

                let docView: DocView = new DocView(href, text)
                docView.delete()

                if (text.includes(value)) {
                    docView.create()
                }

                
            }
        })
        console.log("relooaded") 
    }, [value])

    return (
        <>
            <div className='homepage-navbar'>
                <img src={mySvg}></img>
                <h1>Juniper</h1>
                <button 
                    className='create-new-document-button'
                    onClick={() => {
                        window.open('/','_blank');
                    }}
                >Create new document</button>
                <input 
                    type="text" 
                    name={props.name} 
                    id={props.id} 
                    value={value} 
                    placeholder={props.placeholder} 
                    onChange={(e) => setValue(e.target.value)}/>            
            </div>
            <div id='display-container'>

            </div>
        </>
    )
}

export default Homepage