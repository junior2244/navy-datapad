const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1300040375578398802/Fv-2zDst1ygs3TxBYaPceoVidzAyLEC_Xw6jQFP4bqPOyopt2hev0dZJacZ2zIDBvO8a';

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

document.getElementById('logForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const rank = document.getElementById('rank').value;
    const date = document.getElementById('date').value;
    const log = document.getElementById('log').value;

    const embedData = {
        embeds: [{
            title: "New Navy Log Entry",
            color: 3066993,
            fields: [
                { name: "Name", value: name, inline: true },
                { name: "Rank", value: rank, inline: true },
                { name: "Date", value: date, inline: true },
                { name: "Log Entry", value: log }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(embedData)
        });

        if (response.ok) {
            alert('Log submitted successfully!');
            e.target.reset();
        } else {
            alert('Error submitting log. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting log. Please try again.');
    }
});

// Add some sample data
const missions = [
    { name: "Operation Sea Guard", status: "Active", priority: "High" },
    { name: "Maritime Patrol Delta", status: "Pending", priority: "Medium" }
];

const personnel = [
    { name: "John Smith", rank: "Captain", id: "USN-001" },
    { name: "Sarah Johnson", rank: "Commander", id: "USN-002" }
];

// Initialize the page with the log entry section visible
document.addEventListener('DOMContentLoaded', () => {
    showSection('logEntry');
});

const navyPersonnel = {
    highCommand: [
        { name: "N/A", rank: "Fleet Admiral", id: "HC-001" },
        { name: "N/A", rank: "Admiral", id: "HC-002" },
        { name: "N/A", rank: "Vice Admiral", id: "HC-003" }
    ],
    officers: [
        { name: "N/A", rank: "Captain", id: "OFF-001" },
        { name: "Commander Vandus Silva", rank: "Commander", id: "OFF-002" },
        { name: "N/A", rank: "Lt. Commander", id: "OFF-003" }
    ],
    ncos: [
        { name: "N/A", rank: "Master Chief Petty Officer", id: "NCO-001" },
        { name: "N/A", rank: "Senior Chief Petty Officer", id: "NCO-002" },
        { name: "N/A", rank: "Chief Petty Officer", id: "NCO-005" },
        { name: "N/A", rank: "Petty Officer First Class", id: "NCO-001" },
        { name: "N/A", rank: "Petty Officer Second Class", id: "NCO-002" },
        { name: "Bass", rank: "Petty Officer Third Class", id: "NCO-003" }
    ],
    enlisted: [
        { name: "Junior", rank: "Crewman", id: "E-002" },
        { name: "N/A", rank: "Junior Crewman", id: "E-003" }
    ]
};

// Add this function to display personnel lists
function displayPersonnel() {
    const personnelDiv = document.querySelector('.personnel-list');
    personnelDiv.innerHTML = '';

    const categories = [
        { title: "High Command", data: navyPersonnel.highCommand },
        { title: "Officers", data: navyPersonnel.officers },
        { title: "NCOs", data: navyPersonnel.ncos },
        { title: "Enlisted", data: navyPersonnel.enlisted }
    ];

    categories.forEach(category => {
        const section = document.createElement('div');
        section.className = 'personnel-category';
        section.innerHTML = `
            <h3>${category.title}</h3>
            <div class="personnel-grid">
                ${category.data.map(person => `
                    <div class="personnel-card">
                        <div class="person-name">${person.name}</div>
                        <div class="person-rank">${person.rank}</div>
                        <div class="person-id">ID: ${person.id}</div>
                    </div>
                `).join('')}
            </div>
        `;
        personnelDiv.appendChild(section);
    });
}

// Add communication function
function setupCommunication() {
    const commsDiv = document.getElementById('comms');
    commsDiv.innerHTML = `
        <h2>Communications Center</h2>
        <div class="comms-window" id="commsWindow"></div>
        <form id="commsForm" class="comms-form">
            <input type="text" id="commsMessage" placeholder="Enter your message..." required>
            <button type="submit">Send</button>
        </form>
    `;

    document.getElementById('commsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = document.getElementById('commsMessage').value;
        
        const embedData = {
            embeds: [{
                title: "Navy Communications Message",
                description: message,
                color: 3447003,
                footer: {
                    text: "Sent from Navy Datapad Terminal"
                },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(embedData)
            });

            if (response.ok) {
                document.getElementById('commsMessage').value = '';
                const commsWindow = document.getElementById('commsWindow');
                commsWindow.innerHTML += `<div class="message-sent">Message sent: ${message}</div>`;
                commsWindow.scrollTop = commsWindow.scrollHeight;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('logEntry');
    displayPersonnel();
    setupCommunication();
});

// Add this function to handle mission reports
function setupMissionReports() {
    const missionsDiv = document.getElementById('missions');
    missionsDiv.innerHTML = `
        <h2>Mission Report Submission</h2>
        <form id="missionReportForm" class="mission-form">
            <input type="text" id="reporterName" placeholder="Your Name" required>
            <input type="text" id="reporterRank" placeholder="Your Rank" required>
            <input type="datetime-local" id="missionDate" required>
            <div class="personnel-select">
                <label>Mission Personnel (Navy Only)</label>
                <div id="selectedPersonnel" class="selected-personnel"></div>
                <select id="personnelSelect" multiple>
                    ${generatePersonnelOptions()}
                </select>
            </div>
            <textarea id="missionDetails" placeholder="Detailed mission report..." required></textarea>
            <button type="submit">Submit Mission Report</button>
        </form>
        <div class="mission-history">
            <h3>Recent Mission Reports</h3>
            <div id="missionList"></div>
        </div>
    `;

    document.getElementById('missionReportForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('reporterName').value;
        const rank = document.getElementById('reporterRank').value;
        const date = document.getElementById('missionDate').value;
        const personnel = Array.from(document.getElementById('personnelSelect').selectedOptions)
            .map(option => option.value);
        const details = document.getElementById('missionDetails').value;

        const embedData = {
            embeds: [{
                title: "🎖️ New Mission Report",
                color: 15844367, // Navy blue color
                fields: [
                    { name: "Reporting Officer", value: `${rank} ${name}`, inline: true },
                    { name: "Mission Date", value: new Date(date).toLocaleString(), inline: true },
                    { name: "Mission Personnel", value: personnel.join('\n') || "None specified" },
                    { name: "Mission Details", value: details }
                ],
                footer: {
                    text: "Navy Mission Report System"
                },
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(embedData)
            });

            if (response.ok) {
                alert('Mission report submitted successfully!');
                e.target.reset();
                updateMissionList(name, date);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

function generatePersonnelOptions() {
    let options = '';
    const allPersonnel = [
        ...navyPersonnel.highCommand,
        ...navyPersonnel.officers,
        ...navyPersonnel.ncos,
        ...navyPersonnel.enlisted
    ];

    allPersonnel.forEach(person => {
        options += `<option value="${person.rank} ${person.name}">${person.rank} ${person.name}</option>`;
    });

    return options;
}

function updateMissionList(reporter, date) {
    const missionList = document.getElementById('missionList');
    const missionEntry = document.createElement('div');
    missionEntry.className = 'mission-entry';
    missionEntry.innerHTML = `
        <span class="mission-date">${new Date(date).toLocaleString()}</span>
        <span class="mission-reporter">Reported by: ${reporter}</span>
    `;
    missionList.insertBefore(missionEntry, missionList.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    showSection('logEntry');
    displayPersonnel();
    setupCommunication();
    setupMissionReports();
});

// Add these to your script.js
// Add these to your script.js
const SHIP_SCAN_WEBHOOK = 'https://discord.com/api/webhooks/1300092904521469963/uibJGFAYQhF4_fGqjnZnE-P-PW5kq0XeSNz0pt_sDsEtPGiyFoMw13kVdtpMxWMdqIjh'; // Different webhook for ship scans

function setupShipScanner() {
    // Update range value displays
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = `${e.target.value}%`;
        });
    });

    document.getElementById('scanForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const scannerName = document.getElementById('scannerName').value;
        const shipName = document.getElementById('shipName').value;
        
        const scanData = {
            hull: {
                status: document.getElementById('hullIntegrity').value,
                notes: document.getElementById('hullNotes').value
            },
            shields: {
                status: document.getElementById('shieldStatus').value,
                notes: document.getElementById('shieldNotes').value
            },
            weapons: {
                status: document.getElementById('weaponsStatus').value,
                notes: document.getElementById('weaponsNotes').value
            },
            reactor: {
                status: document.getElementById('reactorStatus').value,
                notes: document.getElementById('reactorNotes').value
            },
            engineering: {
                status: document.getElementById('engineStatus').value,
                notes: document.getElementById('engineNotes').value
            },
            power: {
                status: document.getElementById('powerStatus').value,
                notes: document.getElementById('powerNotes').value
            },
            lifeSupport: {
                status: document.getElementById('lifeSupportStatus').value,
                notes: document.getElementById('lifeSupportNotes').value
            },
            navigation: {
                status: document.getElementById('navStatus').value,
                notes: document.getElementById('navNotes').value
            }
        };

        const embedData = {
            embeds: [{
                title: `🚀 Ship Scan Report: ${shipName}`,
                color: 3447003,
                fields: [
                    { name: "Scanner Officer", value: scannerName, inline: true },
                    { name: "Scan Time", value: new Date().toLocaleString(), inline: true },
                    { name: "\u200B", value: "\u200B" },
                    { name: "Hull Integrity", value: `${scanData.hull.status}% | ${scanData.hull.notes || 'No notes'}` },
                    { name: "Shield Systems", value: `${scanData.shields.status}% | ${scanData.shields.notes || 'No notes'}` },
                    { name: "Weapons Systems", value: `${scanData.weapons.status}% | ${scanData.weapons.notes || 'No notes'}` },
                    { name: "Reactor Core", value: `${scanData.reactor.status}% | ${scanData.reactor.notes || 'No notes'}` },
                    { name: "Engineering", value: `${scanData.engineering.status}% | ${scanData.engineering.notes || 'No notes'}` },
                    { name: "Power Distribution", value: `${scanData.power.status}% | ${scanData.power.notes || 'No notes'}` },
                    { name: "Life Support", value: `${scanData.lifeSupport.status}% | ${scanData.lifeSupport.notes || 'No notes'}` },
                    { name: "Navigation", value: `${scanData.navigation.status}% | ${scanData.navigation.notes || 'No notes'}` }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Star Wars Navy Ship Diagnostic System"
                }
            }]
        };

        try {
            const response = await fetch(SHIP_SCAN_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(embedData)
            });

            if (response.ok) {
                alert('Ship scan report submitted successfully!');
                e.target.reset();
                // Reset all range values to 100%
                document.querySelectorAll('input[type="range"]').forEach(range => {
                    range.value = 100;
                    range.nextElementSibling.textContent = '100%';
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Add to your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    showSection('logEntry');
    displayPersonnel();
    setupCommunication();
    setupMissionReports();
    setupShipScanner();
});