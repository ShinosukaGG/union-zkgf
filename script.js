const zkgfNames = [
  "Sofia", "Isabella", "Camila", "Valentina", "Gabriela", "Mariana",
  "Daniela", "Lucia", "Ariana", "Selena", "Elena", "Natalia", "Bianca",
  "Carmen", "Lola", "Rosa", "Juliana", "Mia", "Andrea", "Paloma",
  "Ximena", "Luna"
];

let teamData = {};
const assignedZKGFs = {};
let currentUser = "", normalizedUser = "";

// Load team data from JSON in root
fetch('/top_2000_from_network.json')
  .then(res => res.json())
  .then(data => {
    teamData = Object.fromEntries(
      data.map(entry => [entry.username.toLowerCase(), { team: entry.team }])
    );
  })
  .catch(err => console.error("Failed to load team data:", err));

function randStat() {
  return Math.floor(Math.random() * 100) + 1;
}

function getRandomUnassignedIndex() {
  const usage = {};
  Object.values(assignedZKGFs).forEach(val => {
    if (val?.id !== undefined) {
      usage[val.id] = (usage[val.id] || 0) + 1;
    }
  });

  let idx;
  do {
    idx = Math.floor(Math.random() * zkgfNames.length);
  } while (usage[idx] >= 3);
  return idx;
}

function submitUsername() {
  const input = document.getElementById("username");
  if (!input || !input.value.trim()) return;

  let username = input.value.trim();
  if (username.startsWith("@")) username = username.slice(1);

  currentUser = username;
  normalizedUser = username.toLowerCase();

  document.getElementById("input-section").classList.add("hidden");

  if (teamData[normalizedUser]?.team === true) {
    showTeamZKGF();
    return;
  }

  if (assignedZKGFs[normalizedUser]) {
    const data = assignedZKGFs[normalizedUser];
    data.badLuck ? showBadLuck() : showReadyToReveal();
    return;
  }

  if (Math.random() < 0.01) {
    assignedZKGFs[normalizedUser] = { badLuck: true };
    showBadLuck();
    return;
  }

  const idx = getRandomUnassignedIndex();
  const stats = {
    zeroKnowledge: randStat(),
    trustless: randStat(),
    interoperable: randStat()
  };

  assignedZKGFs[normalizedUser] = {
    id: idx,
    name: zkgfNames[idx],
    stats
  };

  showReadyToReveal();
}

function showReadyToReveal() {
  document.getElementById("zkgf-image").src = "hide.png";
  document.getElementById("zkgf-section").classList.remove("hidden");
}

function revealZKGF() {
  const overlay = document.getElementById("overlay");
  overlay.classList.remove("hidden");

  // Fire confetti over 2 seconds
  const duration = 2000;
  const interval = 200;
  let end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 40,
      startVelocity: 25,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (Date.now() < end) {
      setTimeout(frame, interval);
    }
  })();

  setTimeout(() => {
    overlay.classList.add("hidden");

    const data = assignedZKGFs[normalizedUser];
    if (!data) return;

    document.getElementById("zkgf-section").classList.add("hidden");
    document.getElementById("reveal-section").classList.remove("hidden");

    document.getElementById("revealed-img").src = `zkgf${data.id + 1}.png`;
    document.getElementById("zkgf-name").innerText = data.name;

    document.getElementById("zk-bar").style.width = `${data.stats.zeroKnowledge}%`;
    document.getElementById("trustless-bar").style.width = `${data.stats.trustless}%`;
    document.getElementById("interop-bar").style.width = `${data.stats.interoperable}%`;

    document.getElementById("final-message").innerText =
      `Congratulations "${currentUser}" on revealing your ZKGF, now it's your duty to take care of her expenses.`;
  }, 2000);
}

function showBadLuck() {
  document.getElementById("zkgf-section").classList.add("hidden");
  document.getElementById("reveal-section").classList.remove("hidden");
  document.getElementById("revealed-img").src = "badluck.png";
  document.getElementById("zkgf-name").innerText = "No ZKGF for you";
  ["zk-bar", "trustless-bar", "interop-bar"].forEach(id =>
    document.getElementById(id).style.width = "0%")
  ;
  document.getElementById("final-message").innerText = "Bad Luck, No ZKGF for you :(";
}

function showTeamZKGF() {
  document.getElementById("zkgf-section").classList.add("hidden");
  document.getElementById("reveal-section").classList.remove("hidden");
  document.getElementById("revealed-img").src = "team.png";
  document.getElementById("zkgf-name").innerText = "No ZKGF for you";
  ["zk-bar", "trustless-bar", "interop-bar"].forEach(id =>
    document.getElementById(id).style.width = "0%")
  ;
  document.getElementById("final-message").innerText =
    "You are a member of the Union Team, and you've donated your airdrop to the community. Your ZKGF has also been donated.";
    }
