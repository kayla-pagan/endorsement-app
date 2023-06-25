import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://sales-data-1281b-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")
const endorsementForm = document.getElementById('endorsement-form')
const endorsementList = document.getElementById('endorsement-list')

document.addEventListener('click', (e) => {
    if(e.target.id === 'publish-btn'){
        handlePublishClick()
    }
})

function handlePublishClick(){
    
    endorsementForm.addEventListener('submit', function(e){
        const endorsementFormData = new FormData(endorsementForm)
        const senderName = endorsementFormData.get('sender')
        const receiverName = endorsementFormData.get('receiver')
        const endorsementValue = endorsementFormData.get('endorsement-input')
        
        preventFormDefault(e)
        
        push(ref(database, "endorsements"), {
            sender: senderName,
            receiver: receiverName,
            input: endorsementValue
        })
        
        endorsementForm.reset()
    })  
}



onValue(endorsementsInDB, function(snapshot){
    
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val())
    
        endorsementList.innerHTML = ''
    
        itemsArray.forEach(function(item){
            let currentItem = item
            let currentItemID = item[0]
            let currentItemInfo = item[1]
            let currentItemValue = currentItemInfo.input
            let currentItemSender = currentItemInfo.sender
            let currentItemReceiver = currentItemInfo.receiver
            
            appendToEndorsementList(currentItemValue, currentItemID, currentItemReceiver, currentItemSender)
        })
    } else {
        endorsementList.innerHTML = `<p class="nothing">Nothing here yet...<p>`
    }
    

})

function appendToEndorsementList(itemValue, itemID, itemReceiver, itemSender){
    
    let newEl = document.createElement('li')
    
    newEl.innerHTML = 
    `<div>
        <h2>To ${itemReceiver}</h2> 
        <p>${itemValue}</p>
        <h2>From ${itemSender}</h2> 
    </div>`
    
    newEl.addEventListener('click', function(e){
        let exactLocationOfItemInDatabase = ref(database, `endorsements/${itemID}`)
        remove(exactLocationOfItemInDatabase)
    })
    
    endorsementList.append(newEl)    
}

function preventFormDefault(evt){
    evt.preventDefault()
    evt.stopImmediatePropagation()
}
