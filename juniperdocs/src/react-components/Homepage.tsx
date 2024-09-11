import { useEffect, useState } from 'react'
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
    // const localDevelopmentURL = "http://localhost:8000";
    const productionURL = 'http://18.191.173.196:8000';


    // CHECK LOADS

    if (!localStorage.getItem("username")) {
        window.open('/login', '_self')
    }
    // @ts-ignore

    

    useEffect(() => {
        const s = io(productionURL);
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
                let href = `/documents/${data[i].id}`
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
                let href = `/documents/${data[i].id}`
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

                <div className="container">
                    <div className='header'>
                        <img src={mySvg}></img>
                        <h1>Juniper</h1>
                    </div>
                    <div className='tools'>
                        <button 
                            className='create-new-document-button'
                            onClick={() => {
                                window.open('/','_self');
                            }}
                            >Create new document
                        </button>
                        <div>
                                <input 
                                type="text" 
                                name="search" 
                                placeholder='Search Documents'
                                id={props.id} 
                                value={value} 
                                onChange={(e) => setValue(e.target.value)}/> 
                        </div> 
                    </div>
                </div>
                

                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.open('/login', '_self')
                    }}
                    className='profile-button'
                >Log Out</button>          
            </div>
            <div id='display-container'>

            </div>
        </>
    )
}

export default Homepage
