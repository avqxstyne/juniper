class Doc {
    // Create a document with name and a link to it
    constructor(link, name) {
        // The constructor properties will be passed down to the extended class
        this.link = link;
        this.name = name;
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

        // Make a link
        const subChildLink = document.createElement('a')

        // Give the link an href and a name
        subChildLink.href = this.link;  
        subChildLink.innerText = this.name

        // Put it in the div
        newChild.appendChild(subChildLink)

        // Put the div on the visible homescreen
        displayContainer?.appendChild(newChild)
    }
}