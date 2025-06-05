let stats = {
  energy: 100,
  health: 100,
  xp: 0,
  stamina: 100,
  oxygen: 100,
  food: 100
};

let location = "Bunker";

const jobs = {
  cleanFacilities: {
    name: "Clean the Facilities",
    energyCost: 3.5,
    foodCost: 0.45,
    staminaCost: 3.5,
    xpReward: 4
  },
  sortScrap: {
    name: "Sort Scrap Metal",
    energyCost: 5,
    foodCost: 0.7,
    staminaCost: 4,
    xpReward: 6
  },
  incineratorDuty: {
    name: "Incinerator Duty",
    energyCost: 8,
    foodCost: 1.2,
    staminaCost: 7,
    xpReward: 10
  }
};

function updateStats() {
  for (const key in stats) {
    document.getElementById(key).innerText = Math.round(stats[key] * 100) / 100;
  }
  document.getElementById("location").innerText = location;
}

function toggleLocation() {
  location = location === "Bunker" ? "Wasteland" : "Bunker";
  updateStats();
}

function train() {
  if (stats.energy >= 10 && stats.food >= 5) {
    stats.energy -= 10;
    stats.food -= 5;
    stats.xp += 5;
    stats.stamina += 2;
  } else {
    alert("Not enough energy or food to train!");
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
    stats.xp += 10;
  } else {
    alert("Not enough oxygen or energy!");
  }
  updateStats();
}

function performJob(job, buttonElement) {
  const { name, energyCost, foodCost, staminaCost, xpReward } = job;

  if (
    stats.energy >= energyCost &&
    stats.food >= foodCost &&
    stats.stamina >= staminaCost
  ) {
    stats.energy -= energyCost;
    stats.food -= foodCost;
    stats.stamina -= staminaCost;
    stats.xp += xpReward;
    updateStats();

    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.innerText = `${name} (Cooldown...)`;
      setTimeout(() => {
        buttonElement.disabled = false;
        buttonElement.innerText = name;
      }, 5000); // 5s cooldown
    }

  } else {
    alert(`Not enough resources to ${name.toLowerCase()}!`);
  }
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

updateStats();
