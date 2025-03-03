// File: src/services/ExerciseService.js
export class ExerciseService {
  static trainings = {};

  static async loadTrainings() {
    try {
      const response = await fetch("/api/trainings");
      const data = await response.json();
      this.trainings = data;
      console.log("🔹 Loaded Trainings:", this.trainings);
    } catch (error) {
      console.error("❌ Failed to fetch trainings:", error);
    }
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
   * excluding any groups (by comparing the first exercise name & note) already used.
   */
  static getAlternativeGroup(type, excludeGroups) {
    // Get a larger pool
    const groups = this.getGroupedExercises(type, 20);
    const filtered = groups.filter((group) => {
      return !excludeGroups.some((exGroup) => {
        // Compare first exercise name and note
        return (
          exGroup[0].name === group[0].name &&
          exGroup[0].note === group[0].note
        );
      });
    });
    if (filtered.length > 0) {
      return filtered[Math.floor(Math.random() * filtered.length)];
    }
    return null;
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
