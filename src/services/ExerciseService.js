// File: src/services/ExerciseService.js

import absData from "../trainings/abs.json" assert { type: "json" };
import backStrengthData from "../trainings/backStrength.json" assert { type: "json" };
import calisthenicsSkillsData from "../trainings/calisthenicsSkills.json" assert { type: "json" };
import dipsData from "../trainings/dips.json" assert { type: "json" };
import hipMobilityData from "../trainings/hipMobility.json" assert { type: "json" };
import jumpData from "../trainings/jump.json" assert { type: "json" };
import kneeStrengthData from "../trainings/kneeStrength.json" assert { type: "json" };
import lungesData from "../trainings/lunges.json" assert { type: "json" };
import neckTrainingData from "../trainings/neckTraining.json" assert { type: "json" };
import planksData from "../trainings/planks.json" assert { type: "json" };
import pullUpsData from "../trainings/pullUps.json" assert { type: "json" };
import pushUpsData from "../trainings/pushUps.json" assert { type: "json" };
import splitsData from "../trainings/splits.json" assert { type: "json" };
import sprintSpeedData from "../trainings/sprintSpeed.json" assert { type: "json" };
import squatsData from "../trainings/squats.json" assert { type: "json" };
import wristForearmData from "../trainings/wristForearm.json" assert { type: "json" };
import legMobilityData from "../trainings/legMobility.json" assert { type: "json" };
import { slugify } from "../utils/slugify";

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
  ...legMobilityData,
};

export class ExerciseService {
  static trainings = {};

  // Instead of fetching from an API, we load the trainings from static imports.
  static async loadTrainings() {
    // In a frontend-only approach, we already have the data.
    // If needed, you can wrap this in a promise for consistency.
    this.trainings = allTrainings;

  }

  static getTrainingTypes() {
    return Object.keys(this.trainings);
  }

  /**
   * Returns grouped main exercises (ignoring warming up).
   * Each group is an array of one (or two if doubled) exercises.
   */
  static getGroupedExercises(type, maxCount) {
    if (!this.trainings[type]) {
      console.warn(`Training type "${type}" not found.`);
      return [];
    }
    const mainExercises = this.trainings[type].filter((ex) => !ex.warming_up);
    const shuffled = [...mainExercises].sort(() => 0.5 - Math.random());
    const groups = [];
    for (const ex of shuffled) {
      if (ex.double) {
        groups.push([
          { ...ex, note: "first side" },
          { ...ex, note: "second side" },
        ]);
      } else {
        groups.push([ex]);
      }
    }
    // Greedily collect groups until total count ≤ maxCount
    const result = [];
    let total = 0;
    for (const group of groups) {
      if (total + group.length <= maxCount) {
        result.push(group);
        total += group.length;
      } else {
        break;
      }
    }
    return result;
  }

  /**
   * Returns a random alternative group for a given training type,
   * excluding any groups already used.
   */
  static getAlternativeGroup(type, currentGroup) {
    const groups = this.getGroupedExercises(type, 20);
    const filtered = groups.filter(
      (group) => group[0].name !== currentGroup[0].name
    );
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    return null;
  }

  /**
   * Returns a random alternative warm-up group for a given training type,
   * excluding the provided current group (based on exercise name).
   */
  static getAlternativeWarmUpGroup(type, currentGroup, minCount = 5, maxCount = 10) {
    if (!this.trainings[type]) {
      console.warn(`Training type "${type}" not found.`);
      return null;
    }
    const warmUpGroups = this.getGroupedWarmUpExercises(type, minCount, maxCount);
    const filtered = warmUpGroups.filter(
      (group) => group[0].name !== currentGroup[0].name
    );
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    return null;
  }

  static getTrainingBySlug(slug) {
    const types = this.getTrainingTypes();
    return types.find((type) => slugify(type) === slug);
  }

  /**
   * Similarly for warm-up exercises.
   */
  static getGroupedWarmUpExercises(type, minCount = 5, maxCount = 10) {
    if (!this.trainings[type]) {
      console.warn(`Training type "${type}" not found.`);
      return [];
    }
    const warmUps = this.trainings[type].filter((ex) => ex.warming_up);
    const shuffled = [...warmUps].sort(() => 0.5 - Math.random());
    const groups = [];
    for (const ex of shuffled) {
      if (ex.double) {
        groups.push([
          { ...ex, note: "first side" },
          { ...ex, note: "second side" },
        ]);
      } else {
        groups.push([ex]);
      }
    }
    const target = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
    const result = [];
    let total = 0;
    for (const group of groups) {
      if (total + group.length <= target) {
        result.push(group);
        total += group.length;
      } else {
        break;
      }
    }
    return result;
  }
}
