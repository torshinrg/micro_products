// File: src/sitemapTrainings.js
const absData = require("./trainings/abs.json");
const backStrengthData = require("./trainings/backStrength.json");
const calisthenicsSkillsData = require("./trainings/calisthenicsSkills.json");
const dipsData = require("./trainings/dips.json");
const hipMobilityData = require("./trainings/hipMobility.json");
const jumpData = require("./trainings/jump.json");
const kneeStrengthData = require("./trainings/kneeStrength.json");
const lungesData = require("./trainings/lunges.json");
const neckTrainingData = require("./trainings/neckTraining.json");
const planksData = require("./trainings/planks.json");
const pullUpsData = require("./trainings/pullUps.json");
const pushUpsData = require("./trainings/pushUps.json");
const splitsData = require("./trainings/splits.json");
const sprintSpeedData = require("./trainings/sprintSpeed.json");
const squatsData = require("./trainings/squats.json");
const wristForearmData = require("./trainings/wristForearm.json");

// Merge all training JSON objects into one
const allTrainings = {
  ...absData,
  ...backStrengthData,
  ...calisthenicsSkillsData,
  ...dipsData,
  ...hipMobilityData,
  ...jumpData,
  ...kneeStrengthData,
  ...lungesData,
  ...neckTrainingData,
  ...planksData,
  ...pullUpsData,
  ...pushUpsData,
  ...splitsData,
  ...sprintSpeedData,
  ...squatsData,
  ...wristForearmData,
};

function getTrainingTypes() {
  return Object.keys(allTrainings);
}

module.exports = { getTrainingTypes };
