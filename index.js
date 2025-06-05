let stats = {
  level: 1,
  xp: 0,
  nextXp: 10,
  energy: 100,
  health: 100,
  stamina: 100,
  oxygen: 100,
  food: 100,
  gumNuts: 0
};

let location = "Bunker";

const jobs = {
  cleanFacilities: {
    name: "Clean the Facilities",
    energyCost: 3.5,
    foodCost: 0.45,
    staminaCost: 3.5,
    xpReward: 4,
    gnReward: 2,
    unlockLevel: 1
  },
  sortScrap: {
    name: "Sort Scrap Metal",
    energyCost: 5,
    foodCost: 0.7,
    staminaCost: 4,
    xpReward: 6,
    gnReward: 4,
    unlockLevel: 1
  },
  incineratorDuty: {
    name: "Incinerator Duty",
    energyCost: 8,
    foodCost: 1.2,
    staminaCost: 7,
    xpReward: 10,
    gnReward: 8,
    unlockLevel: 2
  }
};

function updateStats() {
  for (const key in stats) {
    const el = document.getElementById(key);
    if (el) el.innerText = Math.round(stats[key] * 100) / 100;
  }

  document.getElementById("location").innerText = location;
  document.getElementById("nextXp").innerText = stats.nextXp;

  // Unlock incinerator duty at level 2
  const incBtn = document.getElementById("incineratorBtn");
  if (stats.level >= 2) incBtn.disabled = false;
}

function gainXP(amount) {
  stats.xp += amount;
  while (stats.xp >= stats.nextXp) {
    stats.xp -= stats.nextXp;
    stats.level++;
    stats.nextXp = Math.floor(stats.nextXp * 1.5);
  }
}

function performJob(job, buttonElement) {
  if (stats.level < job.unlockLevel) {
    alert(`Unlocks at level ${job.unlockLevel}`);
    return;
  }

  const { name, energyCost, foodCost, staminaCost, xpReward, gnReward } = job;

  if (
    stats.energy >= energyCost &&
    stats.food >= foodCost &&
    stats.stamina >= staminaCost
  ) {
    stats.energy -= energyCost;
    stats.food -= foodCost;
    stats.stamina -= staminaCost;
    gainXP(xpReward);
    stats.gumNuts += gnReward;

    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.innerText = `${name} (Cooldown...)`;
      setTimeout(() => {
        buttonElement.disabled = false;
        buttonElement.innerText = name;
      }, 5000);
    }
  } else {
    alert("Not enough resources!");
  }

  updateStats();
}

function toggleLocation() {
  location = location === "Bunker" ? "Wasteland" : "Bunker";
  updateStats();
}

function train() {
  if (stats.energy >= 10 && stats.food >= 5) {
    stats.energy -= 10;
    stats.food -= 5;
    gainXP(5);
    stats.stamina += 2;
  } else {
    alert("Not enough energy or food!");
  }
  updateStats();
}

function explore() {
  if (location !== "Wasteland") {
    alert("You need to be in the Wasteland to explore!");
    return;
  }
  if (stats.oxygen >= 10 && stats.energy >= 15) {
    stats.energy -= 15;
    stats.oxygen -= 10;
    stats.health -= Math.floor(Math.random() * 10);
    gainXP(10);
    stats.gumNuts += 3;
  } else {
    alert("Not enough oxygen or energy!");
  }
  updateStats();
}

function saveGame() {
  localStorage.setItem("outbreakSave", JSON.stringify(stats));
  alert("Game saved!");
}

function loadGame() {
  const save = localStorage.getItem("outbreakSave");
  if (save) {
    stats = JSON.parse(save);
    updateStats();
    alert("Game loaded!");
  } else {
    alert("No save found.");
  }
}

// Stat regeneration every 5 seconds
setInterval(() => {
  stats.energy = Math.min(stats.energy + 1, 100);
  stats.stamina = Math.min(stats.stamina + 1, 100);
  stats.food = Math.min(stats.food + 0.5, 100);
  stats.oxygen = Math.min(stats.oxygen + 0.5, 100);
  updateStats();
}, 5000);

updateStats();
