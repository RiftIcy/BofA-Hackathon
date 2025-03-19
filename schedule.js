const cron = require('node-cron');

class Class {
    // Stores all the data for the classes  
    constructor(className, building, startTime, days, reminder, reminderTime) {
        this.className = className;
        this.building = building;
        this.startTime = startTime; // Format: HH:MM (AM/PM)
        
        const [time,timeofDay] = startTime.split(" "); // Format: AM/PM
        const [hour,min] = time.split(":"); // Split into HH, MM

        this.timeofDay = timeofDay;
        this.startTimeHour = parseInt(hour);
        this.startTimeMinute = parseInt(min);
        this.days = days; // Format: [Sun,Mon,Tue,Wed,Thu,Fri,Sat]
        this.reminderTriggered = false; // Flag to track if the reminder has been triggered
        this.reminder = reminder; // Format: true/false

        // If reminder is true, set reminderTime, otherwise set it to null
        this.reminderTime = reminder ? reminderTime : null; //Format: 0, 5, 10, 15, 30, 1hr (in MINUTES)

        //Adjust 24-hour period
        if(this.timeofDay === "PM" && this.startTimeHour !== 12) {
            this.startTimeHour +=12;
        }
        if(this.timeofDay === "AM" && this.startTimeHour === 12) {
            this.startTimeHour = 0;
        }
    }
}

let schedules = [
    new Class("Math 101", "CKB", "8:30 AM", ["Mon", "Wed", "Fri"], false),
    new Class("Physics 101", "Building B", "5:00 PM", ["Tue", "Thu"], true, 3),
    new Class("CS 101", "Building C", "9:35 PM", ["Tue", "Thu"], true, 8)
];

function checkReminders() {
    //If the user does not want a reminder
    for(let schedule of schedules) {
        //If the reminder was turned off or the reminder already happened ignore
        if(schedule.reminder === false || schedule.reminderTriggered) {
            continue;
        }
        // Get day of the week and time
        const currentTime = new Date();
        const currentDay = currentTime.toLocaleString('en-US', { weekday : 'short' });
        
        //If its not the day of the week ignore it
        if(!schedule.days.includes(currentDay)) {
            continue;
        }

        // Extract the current time and compare it with stored time
        const classStartTime = new Date(currentTime);
        classStartTime.setHours(schedule.startTimeHour);
        classStartTime.setMinutes(schedule.startTimeMinute);
        classStartTime.setSeconds(0);

        // If the current time has already passed skip the check
        if(currentTime > classStartTime) {
            schedule.reminderTriggered = true;
            continue;
        }

        const reminderTime = schedule.reminderTime;
        const reminderDate = new Date(classStartTime);
        reminderDate.setMinutes(classStartTime.getMinutes() - reminderTime); // Sets the reminder time by taking the class Start time and subtracting by reminder time
        
        // If reminder time is the reminder time distance or less than the class start time then give the reminder
        if(currentTime >= reminderDate) {
            const timeBeforeClass = classStartTime - currentTime;
            const minutesBeforeClass = Math.floor(timeBeforeClass / 60000);
            giveReminder(schedule, minutesBeforeClass);

            //Set it to true so that the notification only gets triggered once
            schedule.reminderTriggered = true;
        }
    }
}

function giveReminder(schedule, minutesBeforeClass) {
    //If the check for reminder works then send the reminder
    console.log(`Reminder for class ${schedule.className}: Class starts in ${minutesBeforeClass} minutes at ${schedule.startTime}`);
}

// Runs the code every 5 minutes
cron.schedule('0/5 * * * 1-6', () => {
    checkReminders();
}, 
{
    timezone: "America/New_York"
});

// Reset the flag everyday
cron.schedule('0 0 * * *', () => {
    schedules.forEach(schedule => {
        schedule.reminderTriggered = false;
    })
});