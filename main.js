
const eventName = document.querySelector('.event-name')
const eventOrganizer = document.querySelector('.organizer')
const eventDate = document.querySelector('.event-date')
const eventsList = document.querySelector('.events')
const formButton = document.querySelector('.add')
const mostRecentEvent = document.querySelector('.most-recent-event')

let currentOpenedEventIndex = -1;

const minDateValue = function(){  
    // set min date value 
    // get iso full today and split it to get short format of the date
    let today = new Date() 
    // Add one day to the current date
    today.setDate(today.getDate() + 1) 
    today = today.toISOString().split("T")[0] 

    eventDate.min = today

    // prevent user from writing a date before today
    eventDate.addEventListener("input" , function(date) {
        if (eventDate.value < today) {
            eventDate.value = today
        }
    });
}; 

minDateValue() 
setInterval(() => {
    displayEventsList()
}, 1000);


// add event function includes calculate event date in timestamp and get and set the events obj in local storage
function addEditEvent() {
    let dataValid = validateEventData() 
    if (dataValid) { 
        const timestamp = new Date(eventDate.value).getTime()
        const event = {
            name: eventName.value,
            date: eventDate.value,
            organizer: eventOrganizer.value,
            timestamp: timestamp
        };
        // get the current events and convert to js object if exist else return empty array
        const currentEvents = JSON.parse(localStorage.getItem("events")) || [];

        // add case
        if (currentOpenedEventIndex == -1) {
            currentEvents.push(event); 
        }
        // edit case
        else { 
            currentEvents[currentOpenedEventIndex] = event;
            formButton.textContent = "Add Event";
            currentOpenedEventIndex = -1
        }
        currentEvents.sort((a,b) => a.timestamp - b.timestamp)
        // convert the events object to string to add it in local storage 
        localStorage.setItem("events", JSON.stringify(currentEvents))
        resetValues()
        displayEventsList() 
    }
}

// add event validation if not data show alert 
function validateEventData(){
    let eventDataIsValid = true
    if (eventName.value == "" || eventOrganizer.value == "" || eventDate.value == "") {
        eventDataIsValid = false
        alert("Please enter all event data")
    }
    return eventDataIsValid
}
// reset form inputs
function resetValues() {
    const allInputs = document.querySelectorAll('input');
    allInputs.forEach((input) => {
        input.value = ""
    });

}

// display events function get items from local storage and loop through it to add events
function displayEventsList(){
    const currentEvents = JSON.parse(localStorage.getItem("events")) || [];
 
    currentEvents.sort((a,b) => a.timestamp - b.timestamp)
 
    eventsList.innerHTML = ""
    mostRecentEvent.innerHTML = ""
    currentEvents.forEach((currentEvent, index) => {
        let countdown = calculateRemainingTime(currentEvent.timestamp)

        eventsList.innerHTML += `
        <div class="event"> 
          <h3>${currentEvent.name}</h3>
          <p><span>By</span> ${currentEvent.organizer}</p>
          <p><span>On</span> ${currentEvent.date}</p>
          <p><span>Time Left</span> ${countdown}</p>
          <div class="buttons">
                <button class="edit" onclick="updateEvent(${index})" >Edit</button>     
                <button class="delete" onclick="deleteEvent(${index})">Delete</button>
          </div> 
        </div>
      `;
    })


    if (currentEvents.length > 0) {
        displayMostRecent(currentEvents[0])
    }
    
   
}

function displayMostRecent(mostRecentEventData) {
    let countdown = calculateRemainingTime(mostRecentEventData.timestamp)
    mostRecentEvent.innerHTML = `
    <div class="event">
      <h2>Upcoming Event</h2>
      <h3><span>Event Title</span> ${mostRecentEventData.name}</h3>
      <p><span>By</span> ${mostRecentEventData.organizer}</p>
      <p><span>On</span> ${mostRecentEventData.date}</p>
      <p><span>Time Left</span> ${countdown}</p>  
    </div>
  `;
}

// set countdown timer 
function calculateRemainingTime(currentEventTimeStamp) {
    const timestampNow = new Date().getTime();
    let remainingTime = currentEventTimeStamp - timestampNow;
    let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
    // get the % of this days to convert it to hours 
    let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24))/  (1000 * 60 * 60) )
    let mins = Math.floor((remainingTime % (1000 * 60 * 60)) /  (1000 * 60) )
    let secs = Math.floor((remainingTime % (1000 * 60) )/ 1000 )

    return `${days}d ${hours}h ${mins}m ${secs}s`;
}

// delete event with index and save the updated events in local storage again
function deleteEvent(index) {
   
    const currentEvents = JSON.parse(localStorage.getItem("events")) 
    console.log(index, currentEvents)
    currentEvents.splice(index, 1)
    localStorage.setItem("events",JSON.stringify(currentEvents));
    displayEventsList()
}

// update event data by index to show its data in the form again and find this index and save data in local storage again
function updateEvent(index) { 
    const currentEvents = JSON.parse(localStorage.getItem("events")) 
    console.log(index, currentEvents)
    const updatedElement = currentEvents.at(index)
    currentOpenedEventIndex = index;

    console.log(updatedElement)
    fillFormData({...updatedElement});
    formButton.textContent = "Update Event"
}
function fillFormData({name, organizer, date}) {
    eventName.value = name;
    eventOrganizer.value = organizer;
    eventDate.value = date 
}
