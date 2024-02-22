let ld = JSON.parse(data) 

function find_events() {
    let time = new Date().getTime()/1000;

    let event_now = undefined;
    let event_prev = undefined;
    let event_next = undefined;
    
    for (const e of ld.events) {
        if (e.start <= time && e.end > time) {
            event_now = e;
        } else if (e.start <= time && (!event_prev || event_prev.start <= e.start)) {
            event_prev = e;
        } else if (e.start > time && (!event_next || e.start <= event_next.start)) {
            event_next = e;
        }
    }

    if (event_next && event_next.start - time > 60*60*6)
        event_next = undefined;
    if (event_prev && time - event_prev.end > 60*60*6)
        event_prev = undefined;
    return [event_prev, event_now, event_next];
}

function format_time(time) {
    let res = "";
    if (time.getHours()-1) {
        res += (time.getHours()-1)+":";
    }
    res += String(time.getMinutes()).padStart(2, '0')+":";
    res += String(time.getSeconds()).padStart(2, '0');
    
    return res;
}

function refresh_time() {
    let [prev, now, next] = find_events()
    let time = new Date().getTime();
    
    if (now !== undefined) {
        document.getElementById("timer-break").style.display = "none";     
        document.getElementById("timer-event").style.display = "inherit";     
        let diff = new Date(now.end*1000-time); 
        document.getElementById("timer-event").innerText = format_time(diff);
        let progress = (time-now.start*1000)/((now.end-now.start)*1000);
        document.getElementById("bar").value = progress;
        
        let color = "white";
        if (!(diff.getHours()-1)) {
            if (diff.getMinutes() < 1)
                color = "red";
            else if (diff.getMinutes() < 5)
                color = "orange";
            else if (diff.getMinutes() < 10)
                color = "yellow";
        }
        
        document.getElementById("timer-event").style.color = color;
        document.getElementById("bar").classList.remove("green");
        document.getElementById("bar").classList.remove("red");
        document.getElementById("bar").classList.remove("yellow");
        document.getElementById("bar").classList.remove("orange");
        document.getElementById("bar").classList.add(color === "white" ? "green" : color);

        document.getElementById("footer").innerText = "ZOSIA - " + now.title + " - " + now.author;

    } else {            
        document.getElementById("timer-break").style.display = "inherit";     
        document.getElementById("timer-event").style.display = "none";   
       
        let prev_diff = prev ? new Date(time-prev.end*1000) : NaN;
        let next_diff = next ? new Date(next.start*1000-time) : NaN; 

        document.getElementById("timer-break-up").innerText = prev_diff ? "-"+format_time(prev_diff) : "N/A";
        document.getElementById("timer-break-down-text").innerText = next_diff ? format_time(next_diff) : "END";
        
        let progress = (next && prev) ? 1-((time-next.start*1000)/((prev.end-next.start)*1000)) : 1;
        
        document.getElementById("bar").value = progress;
        
        let color = "white";
        if (next_diff && !(next_diff.getHours()-1)) {
            if (next_diff.getMinutes() < 1)
                color = "orange";
            else if (next_diff.getMinutes() < 3)
                color = "yellow";
        }
        
        document.getElementById("timer-break-down").style.color = color;
        document.getElementById("bar").classList.remove("green");
        document.getElementById("bar").classList.remove("red");
        document.getElementById("bar").classList.remove("yellow");
        document.getElementById("bar").classList.remove("orange");
        document.getElementById("bar").classList.add(color === "white" ? "green" : color);

        if (next)
            document.getElementById("footer").innerText = "~BREAK~ Next: " + next.title + " - " + next.author;
        else
           document.getElementById("footer").innerText = "~BREAK~ Day finished";
    }
}

function init() {
    window.setInterval(refresh_time, 100);
}

window.addEventListener('DOMContentLoaded', init, false);
