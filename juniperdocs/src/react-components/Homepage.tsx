import { useEffect, useState, useRef } from 'react'
import mySvg from '../assets/juniperfv.svg'
import { io } from 'socket.io-client';
import '../styles/Homepage.scss'
import DocView from './classes/InheritingDocView.js'


type Props = {

    name: "searchDocumentsInput",
  
    id: "searchDocumentsInput",
    
    placeholder: "Search Documents."
  
};


const Homepage = (props: Props) => {

    const [socket, setSocket] = useState() as any;
    const [value, setValue] = useState("");

    if (!localStorage.getItem("username")) {
        window.open('/login', '_self')
    }
    // @ts-ignore

    

    useEffect(() => {
        const s = io("http://localhost:8000");
        setSocket(s);

        return () => {
            s.disconnect()
        }
        
    }, [])
// Initial Load
    useEffect(() => {
        if (socket == null) {
            console.log("socket was null")
            return
        }
        socket.emit('get-all', localStorage.getItem('username'))

        socket.once('display-all', (data: any[]) => {
            console.log("initial load")

            for (let i = 0; i < data.length; i++) {       
                

                // IMPLEMENTING THE CLASS INHERITANCE REQUIREMENT IN APP FUNCTIONALITY
                let href = `http://localhost:5173/documents/${data[i].id}`
                let text = `${data[i].name}`;
                let lastOpened = data[i].lastOpened;
                let date = new Date(lastOpened)

                let docView: DocView = new DocView(href, text, date)
                
                docView.setLastOpened(date)

                docView.delete()

                docView.create()
                
            }
        })
    }, [socket])

// Input searchbar load
    useEffect(() => {
        if (socket == null) return
        socket.emit('get-all', localStorage.getItem('username'))

        socket.once('display-all', (data: any[]) => {
            for (let i = 0; i < data.length; i++) {       
                
                // IMPLEMENTING THE CLASS INHERITANCE REQUIREMENT IN APP FUNCTIONALITY
                let href = `http://localhost:5173/documents/${data[i].id}`
                let text = `${data[i].name}`
                let lastOpened = data[i].lastOpened;
                let date = new Date(lastOpened)

                let docView: DocView = new DocView(href, text, date)
                
                docView.setLastOpened(date)

                docView.delete()

                if (text.includes(value)) {
                    docView.create()
                }
            }
        })
        console.log("reloaded") 
    }, [value])

    return (
        <>
            <div className='homepage-navbar'>
                <img src={mySvg}></img>
                <h1>Juniper</h1>
                <button 
                    className='create-new-document-button'
                    onClick={() => {
                        window.open('/','_self');
                    }}
                >Create new document</button>
                <div>
                <label htmlFor="search">Search Documents</label>
                <input 
                    type="text" 
                    name="search" 
                    id={props.id} 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}/> 
                    </div> 
                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.open('/login', '_self')
                    }}
                >Profile</button>          
            </div>
            <div id='display-container'>

            </div>
        </>
    )
}

export default Homepage