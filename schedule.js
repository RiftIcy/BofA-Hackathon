const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

const SCHEDULES_FILE = path.join(__dirname, "schedules.json");

class Class {
  constructor(className, building, startTime, days, reminder, reminderTime) {
    this.className = className;
    this.building = building;
    this.startTime = startTime;

    const [time, timeofDay] = startTime.split(" ");
    const [hour, min] = time.split(":");

    this.timeofDay = timeofDay;
    this.startTimeHour = parseInt(hour);
    this.startTimeMinute = parseInt(min);
    this.days = days;
    this.reminderTriggered = false;
    this.reminder = reminder;
    this.reminderTime = reminder ? reminderTime : null;

    if (this.timeofDay === "PM" && this.startTimeHour !== 12) {
      this.startTimeHour += 12;
    }
    if (this.timeofDay === "AM" && this.startTimeHour === 12) {
      this.startTimeHour = 0;
    }
  }
}

let schedules = [];

// Load existing schedules from JSON file
function loadSchedules() {
  if (fs.existsSync(SCHEDULES_FILE)) {
    const data = fs.readFileSync(SCHEDULES_FILE, "utf8");
    const json = JSON.parse(data);
    schedules = json.map(
      (item) =>
        new Class(
          item.className,
          item.building,
          item.startTime,
          item.days,
          item.reminder,
          item.reminderTime
        )
    );
  }
}

// Save current schedules to JSON file
function saveSchedules() {
  fs.writeFileSync(SCHEDULES_FILE, JSON.stringify(schedules, null, 2), "utf8");
}

function checkReminders() {
  for (let schedule of schedules) {
    if (schedule.reminder === false || schedule.reminderTriggered) {
      continue;
    }

    const currentTime = new Date();
    const currentDay = currentTime.toLocaleString("en-US", { weekday: "short" });

    if (!schedule.days.includes(currentDay)) {
      continue;
    }

    const classStartTime = new Date(currentTime);
    classStartTime.setHours(schedule.startTimeHour);
    classStartTime.setMinutes(schedule.startTimeMinute);
    classStartTime.setSeconds(0);

    if (currentTime > classStartTime) {
      schedule.reminderTriggered = true;
      continue;
    }

    const reminderDate = new Date(classStartTime);
    reminderDate.setMinutes(classStartTime.getMinutes() - schedule.reminderTime);

    if (currentTime >= reminderDate) {
      const timeBeforeClass = classStartTime - currentTime;
      const minutesBeforeClass = Math.floor(timeBeforeClass / 60000);
      giveReminder(schedule, minutesBeforeClass);
      schedule.reminderTriggered = true;
    }
  }
}

function giveReminder(schedule, minutesBeforeClass) {
  console.log(
    `⏰ Reminder: '${schedule.className}' starts in ${minutesBeforeClass} minutes at ${schedule.building} (${schedule.startTime})`
  );
}

// Cron job: run check every 5 minutes (Mon–Sat)
cron.schedule("*/5 * * * 1-6", () => {
  checkReminders();
}, {
  timezone: "America/New_York"
});

// Cron job: reset reminders every night at midnight
cron.schedule("0 0 * * *", () => {
  schedules.forEach((schedule) => {
    schedule.reminderTriggered = false;
  });
});

loadSchedules();

module.exports = {
  Class,
  schedules,
  saveSchedules,
};
 