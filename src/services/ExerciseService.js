// File: src/services/ExerciseService.js
export class ExerciseService {
  static trainings = {}; // Store all loaded training data

  /**
   * Fetch training data from API and store it.
   */
  static async loadTrainings() {
    try {
      const response = await fetch("/api/trainings");
      const data = await response.json();
      this.trainings = data;
      console.log("🔹 Loaded Trainings:", this.trainings); // Debugging
    } catch (error) {
      console.error("❌ Failed to fetch trainings:", error);
    }
  }

  /**
   * Get list of training types dynamically.
   */
  static getTrainingTypes() {
    return Object.keys(this.trainings);
  }

  /**
   * Get a random subset of exercises for a given training type.
   * Filters out warming up exercises.
   * If an exercise has the "double" flag, duplicates it with additional note.
   * Finally, groups duplicate pairs and returns at most `maxCount` items (ensuring pairs are not split).
   *
   * @param {string} type - Training type (e.g., "ABS training").
   * @param {number} maxCount - Maximum allowed exercises in the final list.
   */
  static getRandomExercises(type, maxCount) {
    if (!this.trainings[type]) {
      console.warn(`⚠️ Training type "${type}" not found.`);
      return [];
    }
    // Filter out warm‑up exercises
    const mainExercises = this.trainings[type].filter((ex) => !ex.warming_up);

    // Shuffle main exercises
    const shuffled = [...mainExercises].sort(() => 0.5 - Math.random());

    // Duplicate double exercises
    let duplicated = [];
    for (const ex of shuffled) {
      if (ex.double) {
        duplicated.push({ ...ex, note: "first side" });
        duplicated.push({ ...ex, note: "second side" });
      } else {
        duplicated.push(ex);
      }
    }

    // Group exercises into units so that duplicated exercises are kept as a pair.
    const groups = [];
    for (let i = 0; i < duplicated.length; ) {
      if (
        duplicated[i].note === "first side" &&
        i + 1 < duplicated.length &&
        duplicated[i + 1].note === "second side" &&
        duplicated[i].name === duplicated[i + 1].name
      ) {
        groups.push([duplicated[i], duplicated[i + 1]]);
        i += 2;
      } else {
        groups.push([duplicated[i]]);
        i++;
      }
    }

    // Greedily add groups until adding the next group would exceed maxCount.
    const result = [];
    let total = 0;
    for (const group of groups) {
      if (total + group.length <= maxCount) {
        result.push(...group);
        total += group.length;
      } else {
        break;
      }
    }

    return result;
  }

  /**
   * Get a random subset of warm-up exercises for a given training type.
   * Returns between `minCount` and `maxCount` exercises (after duplication and grouping, if needed).
   *
   * @param {string} type - Training type.
   * @param {number} minCount - Minimum warm‑up exercises.
   * @param {number} maxCount - Maximum warm‑up exercises.
   */
  static getRandomWarmUpExercises(type, minCount = 5, maxCount = 10) {
    if (!this.trainings[type]) {
      console.warn(`⚠️ Training type "${type}" not found.`);
      return [];
    }
    // Filter for warming up exercises
    const warmUps = this.trainings[type].filter((ex) => ex.warming_up);
    const shuffled = [...warmUps].sort(() => 0.5 - Math.random());

    // Duplicate double exercises if needed
    let duplicated = [];
    for (const ex of shuffled) {
      if (ex.double) {
        duplicated.push({ ...ex, note: "first side" });
        duplicated.push({ ...ex, note: "second side" });
      } else {
        duplicated.push(ex);
      }
    }

    // Group as before
    const groups = [];
    for (let i = 0; i < duplicated.length; ) {
      if (
        duplicated[i].note === "first side" &&
        i + 1 < duplicated.length &&
        duplicated[i + 1].note === "second side" &&
        duplicated[i].name === duplicated[i + 1].name
      ) {
        groups.push([duplicated[i], duplicated[i + 1]]);
        i += 2;
      } else {
        groups.push([duplicated[i]]);
        i++;
      }
    }

    // Determine a random count between minCount and maxCount (for warm-ups)
    const targetCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

    const result = [];
    let total = 0;
    for (const group of groups) {
      if (total + group.length <= targetCount) {
        result.push(...group);
        total += group.length;
      } else {
        break;
      }
    }

    return result;
  }
}
