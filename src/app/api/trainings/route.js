import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const trainingsDir = path.join(process.cwd(), "src/trainings");
    const trainingFiles = fs.readdirSync(trainingsDir);

    console.log("Training files found:", trainingFiles); // Debug log

    const trainings = trainingFiles.reduce((acc, file) => {
      if (file.endsWith(".json")) {
        const filePath = path.join(trainingsDir, file);
        const trainingData = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return { ...acc, ...trainingData };
      }
      return acc;
    }, {});

    console.log("Trainings loaded:", trainings); // Debug log
    return NextResponse.json(trainings);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to load training data" }, { status: 500 });
  }
}
