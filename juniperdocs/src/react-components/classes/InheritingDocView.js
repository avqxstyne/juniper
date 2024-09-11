class Doc {
    // Create a document with name and a link to it
    constructor(link, name, id, lastOpened) {
        // The constructor properties will be passed down to the extended class
        this.link = link;
        this.name = name;
        this.id = id;
        this.lastOpened = lastOpened;
    }

    getLastOpened() {
        return this.lastOpened
    }
    setLastOpened(date) {
        this.lastOpened = date
    }

    formatDate(date) {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        };
      
        return `Last edited ${new Intl.DateTimeFormat('en-US', options).format(date)}`;
      }
      
 
}

// Create a class that uses "inheritance" of properties.
export default class DocView extends Doc {
    create() {
        // Find the homepage container
        const displayContainer = document.getElementById("display-container");

        // Make a div to hold a link
        const newChild = document.createElement('div')
        newChild.classList.add("homepage-document-list-item")

        // Make a link and a date
        const subChildLink = document.createElement('a')
        const lastOpened = document.createElement('div')

        // Give the link an href and a name
        subChildLink.href = this.link;  
        subChildLink.innerText = this.name;


             // Example usage:
        let formattedString = this.formatDate(this.lastOpened);
        console.log("DocView, new date: " + formattedString); // Output: Last edited December 6th, 2024 at 6:15 pm
        lastOpened.innerText = formattedString;
       

        // Put it in the div
        newChild.appendChild(subChildLink)
        newChild.appendChild(lastOpened)

        // Put the div on the visible homescreen
        displayContainer?.appendChild(newChild)

        newChild.addEventListener('click', () => {
            window.open(this.link, '_self');
        })
    }

    delete() {
        const displayContainer = document.getElementById("display-container");

        const displayElements = document.getElementsByClassName("homepage-document-list-item")
        for (let i = 0; i < displayElements.length; i++) {

      

            if (displayElements[i].children[0].href == "http://ec2-18-191-173-196.us-east-2.compute.amazonaws.com:5173" + this.link) {
    
                displayContainer.removeChild(displayElements[i])
            }
        }
    }
}
