import fs from "fs";
import path from "path";

/**
 * Loads all training JSON files dynamically.
 * This ensures that adding new training categories requires no manual imports.
 */
export function loadTrainings() {
  const trainingsDir = path.join(process.cwd(), "src/trainings");
  const trainingFiles = fs.readdirSync(trainingsDir);

  const trainings = trainingFiles.reduce((acc, file) => {
    if (file.endsWith(".json")) {
      const filePath = path.join(trainingsDir, file);
      const trainingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return { ...acc, ...trainingData };
    }
    return acc;
  }, {});

  return trainings;
}
