// File: src/app/training/[workout]/page.jsx
import WorkoutPageClient from "./WorkoutPageClient";
import { slugify } from "@/utils/slugify";

// File: src/app/training/[workout]/page.jsx
export async function generateStaticParams() {
  await import("@/services/ExerciseService").then(async (mod) => {
    await mod.ExerciseService.loadTrainings();
  });
  const { ExerciseService } = await import("@/services/ExerciseService");
  const workouts = ExerciseService.getTrainingTypes() || [];
  return workouts.map((workout) => ({
    // Encode the workout param so that it matches the URL-encoded version
    workout: encodeURIComponent(slugify(workout)),
  }));
}

export default async function WorkoutPage(props) {
  const params = await props.params;
  const { workout } = params;
  return <WorkoutPageClient workout={workout} />;
}

