import { Application } from "./types";

import { alertFromNumber } from "./alerts";

const windows: Array<Application> = [
    {
        title: "Queeg",
        icon: "icon.png",
        items: [
            { name: "gmail_work", icon: "gmail.png", color: "#8aca3a", url: "https://mail.google.com/mail/u/0/#inbox", partition: "persist:work", alert: alertFromNumber },
            { name: "calendar_work", icon: "calendar.png", color: "#8aca3a", url: "https://calendar.google.com/calendar/b/0/", partition: "persist:work" },
            { name: "chat_work", icon: "chat.png", color: "#8aca3a", url: "https://chat.google.com/u/0/", partition: "persist:work" },
            { name: "toggl_work", icon: "toggl.png", color: "#8aca3a", url: "https://toggl.com/app/timer", partition: "persist:work" },
            { name: "trello_work", icon: "trello.png", color: "#8aca3a", url: "https://trello.com/", partition: "persist:work" }, 
            
            { name: "gmail_personal", icon: "gmail.png", color: "#4286f4", url: "https://mail.google.com/mail/u/0/#inbox", partition: "persist:personal", alert: alertFromNumber },
            { name: "spotify_personal", icon: "spotify.png", color: "#4286f4", url: "https://open.spotify.com/browse/featured", partition: "persist:personal" },
            { name: "drive_personal", icon: "drive.png", color: "#4286f4", url: "https://drive.google.com/drive/u/0/my-drive", partition: "persist:personal" },
            { name: "keep_personal", icon: "keep.png", color: "#4286f4", url: "https://keep.google.com/u/0/", partition: "persist:personal" },
            { name: "messages_personal", icon: "messages.png", color: "#4286f4", url: "https://messages.android.com/", partition: "persist:personal" },
            { name: "mess_personal", icon: "messenger.png", color: "#4286f4", url: "https://www.messenger.com/", partition: "persist:personal" },
        ]
    }
];

export default windows;
