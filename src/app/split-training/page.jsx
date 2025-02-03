// File: src/app/split-training/page.jsx
import Head from "next/head";
import SplitTrainingClient from "./SplitTrainingClient";


// Define exercise lists
const warmUpExercises = [
  {
    name: "Leg Swings (Front-to-Back)",
    description:
      "Stand near a wall for balance and swing each leg forward and backward in a controlled motion to increase blood flow in your hamstrings and hip flexors.",
    time: 30,
  },
  {
    name: "Leg Swings (Side-to-Side)",
    description:
      "Face the wall and swing each leg laterally to warm up the adductors and abductors, opening your hips for deeper stretches.",
    time: 30,
  },
  {
    name: "Hip Circles",
    description:
      "Place your hands on your hips and rotate them in circles in both directions, loosening the hip joints and surrounding muscles.",
    time: 30,
  },
  {
    name: "High Knees",
    description:
      "Jog in place, lifting your knees high to warm up the legs and activate the hip flexors and core.",
    time: 30,
  },
  {
    name: "Butt Kicks",
    description:
      "Jog in place while trying to kick your glutes with your heels to increase circulation in the hamstrings.",
    time: 30,
  },
  {
    name: "Walking Lunges",
    description:
      "Step forward into dynamic lunges, alternating legs with each step, to gently activate the quadriceps, glutes, and hip flexors.",
    time: 30,
  },
  {
    name: "Lateral Lunges",
    description:
      "Step sideways into a lunge, keeping the other leg straight, to dynamically stretch and warm up the inner thighs.",
    time: 30,
  },
  {
    name: "Arm Circles",
    description:
      "Perform large and small circles with your arms to warm up the shoulders and upper back, ensuring a full-body activation.",
    time: 30,
  },
  {
    name: "Bodyweight Squats",
    description:
      "Do a series of squats to stimulate the leg muscles and improve joint mobility in the hips and knees.",
    time: 30,
  },
  {
    name: "Dynamic Hamstring Reach",
    description:
      "Alternate reaching down toward your toes while walking slowly to actively stretch the hamstrings.",
    time: 30,
  },
];

const trainingExercises = [
  {
    name: "Seated Forward Fold",
    description:
      "Sit with your legs extended and hinge at the hips to reach for your feet, stretching your hamstrings and lower back.",
    time: 60,
  },
  {
    name: "Kneeling Hamstring Stretch",
    description:
      "Kneel on one knee with the other leg extended forward; lean into the stretch to lengthen the hamstrings.",
    time: 60,
  },
  {
    name: "Deep Runner’s Lunge",
    description:
      "From a lunge position, drop the back knee and press your hips forward to stretch the hip flexors.",
    time: 60,
  },
  {
    name: "Lunging Quad Stretch",
    description:
      "In a lunge, grab your back foot and pull it toward your buttocks to stretch the quadriceps and hip flexors.",
    time: 60,
  },
  {
    name: "Butterfly Stretch",
    description:
      "Sit with the soles of your feet together and gently press your knees toward the floor to stretch the inner thighs.",
    time: 60,
  },
  {
    name: "Half Split Stretch",
    description:
      "From a lunge, shift your weight back while straightening the front leg and leaning forward to deeply stretch the hamstrings.",
    time: 60,
  },
  {
    name: "Full Split Stretch (Assisted)",
    description:
      "Using yoga blocks or cushions for support, slide your front heel forward and back leg backward to gradually approach a full split.",
    time: 60,
  },
  {
    name: "Pigeon Pose",
    description:
      "From a plank or downward dog position, bring one knee forward and extend the opposite leg back to stretch the hip and glute muscles.",
    time: 60,
  },
  {
    name: "Upward Facing Pigeon Pose",
    description:
      "Lie on your back, bring one knee out to the side and use your hands to gently pull it closer to your chest, emphasizing hip and glute stretch.",
    time: 60,
  },
  {
    name: "Standing Straddle Stretch",
    description:
      "Stand with legs wide apart and bend forward, reaching toward the ground to stretch the hamstrings and inner thighs.",
    time: 60,
  },
  {
    name: "Seated Straddle Stretch",
    description:
      "Sit on the floor with legs spread wide and lean forward, aiming to bring your chest toward your thighs for a deep stretch.",
    time: 60,
  },
  {
    name: "Side Stretch from Seated Straddle",
    description:
      "From a seated straddle, tuck one leg in and raise the opposite arm to stretch the side of your torso and the adductors.",
    time: 60,
  },
  {
    name: "Single Leg Extension (Lying)",
    description:
      "Lie on your back and extend one leg upward; use a strap if needed to increase the hamstring stretch.",
    time: 60,
  },
  {
    name: "Seated Pike Stretch",
    description:
      "Sit with legs together and extended; reach forward to touch your toes, deeply stretching the hamstrings.",
    time: 60,
  },
  {
    name: "Frog Stretch",
    description:
      "Start on all fours and spread your knees wide while keeping your feet together; lean forward to stretch the groin and inner thighs.",
    time: 60,
  },
  {
    name: "Double Quad Stretch (Lying)",
    description:
      "Lie on your stomach and simultaneously pull both feet toward your buttocks to stretch the quadriceps.",
    time: 60,
  },
  {
    name: "Single Quad Stretch (Lying)",
    description:
      "Lie on your stomach and pull one foot toward your buttocks at a time, isolating each quadriceps for a deeper stretch.",
    time: 60,
  },
  {
    name: "Up-Facing Quad Stretch",
    description:
      "Lie on your back and pull one leg up toward your chest while tucking it underneath slightly to stretch the front thigh.",
    time: 60,
  },
  {
    name: "Lizard Lunge",
    description:
      "Begin in a low lunge and lower your forearms to the ground beside your front leg to intensify the hip and groin stretch.",
    time: 60,
  },
  {
    name: "Low Lunge with Hip Flexor Emphasis",
    description:
      "Maintain a low lunge and gently push your hips downward to further activate the hip flexors.",
    time: 60,
  },
  {
    name: "Hip Flexor Stretch with Raised Back Foot",
    description:
      "While in a lunge, lift your back toes off the ground slightly and pull the heel toward your butt for an advanced hip flexor stretch.",
    time: 60,
  },
  {
    name: "Ankle Dorsiflexion Stretch",
    description:
      "Stand facing a wall and lean forward with one foot on the ground to stretch the front of the lower leg.",
    time: 60,
  },
  {
    name: "Ankle Plantar Flexion Stretch",
    description:
      "Perform step-up heel drops to stretch the calf muscles and improve ankle flexibility.",
    time: 60,
  },
  {
    name: "Dynamic Hamstring Reach",
    description:
      "While walking slowly, alternate reaching down to touch your toes to actively stretch the hamstrings.",
    time: 60,
  },
  {
    name: "Dynamic Leg Kick Stretch",
    description:
      "Stand and swing each leg upward in a controlled manner, reaching with the opposite hand to engage the hamstrings dynamically.",
    time: 60,
  },
  {
    name: "Wide Leg Standing Forward Bend",
    description:
      "Stand with legs wide apart and bend forward at the waist, aiming to touch the ground between your legs for a full-body hamstring and back stretch.",
    time: 60,
  },
  {
    name: "Standing Side Lunge Stretch",
    description:
      "Step out to the side into a lunge while keeping the opposite leg straight to stretch the inner thigh and groin muscles.",
    time: 60,
  },
  {
    name: "Cossack Squat Stretch",
    description:
      "Shift your weight laterally into a deep squat on one side while keeping the other leg straight, stretching the adductors and hip flexors.",
    time: 60,
  },
  {
    name: "Modified Side Split on Chair",
    description:
      "Sit sideways on a chair and extend one leg out to the side; lean gently to increase the inner thigh stretch.",
    time: 60,
  },
  {
    name: "Static Lateral Lunge Hold",
    description:
      "Perform a lateral lunge and hold the position isometrically to deepen the stretch in the groin and outer thigh muscles.",
    time: 60,
  },
  {
    name: "Groin Stretch (Seated Butterfly Forward Fold)",
    description:
      "Sit with the soles of your feet together and lean forward to intensify the stretch in the inner thighs.",
    time: 60,
  },
  {
    name: "Supine Hamstring Stretch with Strap",
    description:
      "Lie on your back, loop a strap around one foot, and gently pull the leg upward to stretch the hamstring.",
    time: 60,
  },
  {
    name: "Supine Hip Stretch",
    description:
      "Lie on your back and draw one knee toward your chest to stretch the lower back and hip muscles.",
    time: 60,
  },
  {
    name: "Standing Hamstring Stretch on a Step",
    description:
      "Place one foot on a low step, keep the leg straight, and lean forward to stretch the hamstring.",
    time: 60,
  },
  {
    name: "Elevated Leg Hamstring Stretch",
    description:
      "Using a bench or sturdy surface, place your foot on the edge and lean forward to deepen the hamstring stretch.",
    time: 60,
  },
  {
    name: "Dynamic Toe Touch Stretch",
    description:
      "Alternate reaching down to touch your toes while marching in place, actively stretching the hamstrings.",
    time: 60,
  },
  {
    name: "Yoga: Downward-Facing Dog",
    description:
      "Assume the downward dog position to stretch the calves, hamstrings, and spine while engaging the entire back of the body.",
    time: 60,
  },
  {
    name: "Yoga: Half Lord of the Fishes Pose",
    description:
      "Sit and gently twist to stretch the back and hips, aiding overall mobility and balance.",
    time: 60,
  },
  {
    name: "Yoga: Cow Face Pose",
    description:
      "Bring one arm overhead and the other behind your back to stretch the shoulders, arms, and improve posture.",
    time: 60,
  },
  {
    name: "Yoga: Extended Child’s Pose",
    description:
      "Kneel and sit back onto your heels while reaching your arms forward to stretch the lower back and hips.",
    time: 60,
  },
  {
    name: "Yoga: Cat-Cow Flow",
    description:
      "Alternate arching and rounding your back to mobilize the spine and warm up the back muscles.",
    time: 60,
  },
  {
    name: "Yoga: Warrior I",
    description:
      "Step into a lunge with your arms raised overhead to open up the hips and strengthen the legs.",
    time: 60,
  },
  {
    name: "Yoga: Warrior II",
    description:
      "With a wide stance and arms extended, hold the position to build hip stability and stretch the inner thighs.",
    time: 60,
  },
  {
    name: "Yoga: Triangle Pose",
    description:
      "From a wide stance, reach one hand toward your foot while the other arm extends upward, stretching the hamstrings and side body.",
    time: 60,
  },
  {
    name: "Yoga: Standing Forward Bend with Twist",
    description:
      "Bend forward from a standing position and add a gentle twist to target both the hamstrings and obliques.",
    time: 60,
  },
  {
    name: "Pilates: Leg Circles (Lying)",
    description:
      "Lie on your back and perform controlled circular motions with one leg at a time to warm up the hip joint and improve range of motion.",
    time: 60,
  },
  {
    name: "Pilates: Scissor Kicks",
    description:
      "Alternate lifting each leg while lying on your back to dynamically engage the inner thighs and hip flexors.",
    time: 60,
  },
  {
    name: "PNF Hamstring Stretch",
    description:
      "Contract your hamstrings briefly, then relax into a deeper stretch using the contract-relax technique.",
    time: 60,
  },
  {
    name: "PNF Hip Flexor Stretch",
    description:
      "Apply the contract-relax method on your hip flexors, either with a partner or a strap, to extend the stretch further.",
    time: 60,
  },
  {
    name: "Dynamic Split Walk",
    description:
      "Alternate stepping into a split-like position while moving forward to actively work on flexibility in the legs and hips.",
    time: 60,
  },
  {
    name: "Isometric Split Hold (with Wall Support)",
    description:
      "Lean against a wall in a partial split position and hold isometrically to build endurance in the muscles required for a full split.",
    time: 60,
  },
  {
    name: "Floor Glute Bridge",
    description:
      "Perform a glute bridge to activate and strengthen the hips and lower back, complementing your stretching routine.",
    time: 60,
  },
];

// Utility function to select random exercises
function getRandomExercises(list, count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  export default function SplitTrainingPage() {
    // Compute initial routines on the server
    const initialWarmUp = getRandomExercises(warmUpExercises, 3);
    const initialTraining = getRandomExercises(trainingExercises, 5);
  
    return (
      <>
        <Head>
          <title>Split Training - Improve Your Flexibility</title>
          <meta
            name="description"
            content="Generate a random split training routine to enhance flexibility and mobility."
          />
          <link rel="canonical" href="https://yourdomain.com/split-training" />
          {/* Open Graph, Twitter, and JSON-LD meta tags can be added here as needed */}
        </Head>
        <SplitTrainingClient
          initialWarmUp={initialWarmUp}
          initialTraining={initialTraining}
        />
      </>
    );
  }