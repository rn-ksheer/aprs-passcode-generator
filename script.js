/* ==========================================================
   APRS-IS Passcode Generator
   ========================================================== */

const callsignInput = document.getElementById("callsign");
const passcodeOutput = document.getElementById("passcode");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");
const themeToggle = document.getElementById("themeToggle");

/* ==========================================================
   APRS Passcode
   ========================================================== */

function generatePasscode(callsign) {

    callsign = callsign
        .trim()
        .toUpperCase()
        .split("-")[0];

    if (callsign.length === 0)
        return "";

    if (!/^[A-Z0-9]+$/.test(callsign))
        return "";

    let hash = 0x73E2;

    for (let i = 0; i < callsign.length; i += 2) {

        hash ^= callsign.charCodeAt(i) << 8;

        if (i + 1 < callsign.length) {
            hash ^= callsign.charCodeAt(i + 1);
        }

    }

    return hash & 0x7FFF;

}

/* ==========================================================
   Update Result
   ========================================================== */

function updatePasscode() {

    // Automatically convert to uppercase while typing
    callsignInput.value = callsignInput.value.toUpperCase();

    const value = callsignInput.value.trim();

    status.textContent = "";

    if (value === "") {

        passcodeOutput.textContent = "-----";
        return;

    }

    const passcode = generatePasscode(value);

    if (passcode === "") {

        passcodeOutput.textContent = "Invalid Callsign";
        return;

    }

    passcodeOutput.style.transform = "scale(1.08)";

passcodeOutput.textContent = passcode;

setTimeout(() => {

    passcodeOutput.style.transform = "scale(1)";

}, 150);

}

/* ==========================================================
   Copy
   ========================================================== */

copyBtn.addEventListener("click", async () => {

    const value = passcodeOutput.textContent;

    if (
        value === "-----" ||
        value === "Invalid Callsign"
    ) {
        return;
    }

    try {

        await navigator.clipboard.writeText(value);

        status.textContent = "✓ Passcode copied";

        copyBtn.textContent = "✓ Copied";

        setTimeout(() => {

            copyBtn.textContent = "📋 Copy Passcode";
            status.textContent = "";

        }, 1800);

    }

    catch {

        status.textContent = "Unable to copy.";

    }

});

/* ==========================================================
   Live Typing
   ========================================================== */

callsignInput.addEventListener("input", updatePasscode);

callsignInput.addEventListener("keydown", function(e){

    if(e.key==="Enter"){

        updatePasscode();

    }

});

/* ==========================================================
   Theme
   ========================================================== */

function setTheme(mode){

    if(mode==="light"){

        document.body.classList.add("light");
        themeToggle.textContent="☀️";

    }

    else{

        document.body.classList.remove("light");
        themeToggle.textContent="🌙";

    }

    localStorage.setItem("theme",mode);

}

themeToggle.addEventListener("click",()=>{

    const light=document.body.classList.contains("light");

    if(light){

        setTheme("dark");

    }

    else{

        setTheme("light");

    }

});

const savedTheme=localStorage.getItem("theme");

if(savedTheme){

    setTheme(savedTheme);

}

else{

    setTheme("dark");

}

/* ==========================================================
   Initial State
   ========================================================== */

updatePasscode();