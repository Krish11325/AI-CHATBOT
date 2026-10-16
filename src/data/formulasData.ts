import { Formula } from '../types';

export const FORMULA_LIBRARY: Formula[] = [
  // Mathematics
  {
    id: 'f-quadratic',
    subjectId: 'maths',
    title: 'Quadratic Formula',
    category: 'Algebra',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    variables: [
      { name: 'Root x', symbol: 'x', unit: 'Dimensionless / real number' },
      { name: 'Coefficient of x²', symbol: 'a', unit: 'Real constant (a ≠ 0)' },
      { name: 'Coefficient of x', symbol: 'b', unit: 'Real constant' },
      { name: 'Constant term', symbol: 'c', unit: 'Real constant' }
    ],
    whenToUse: 'When solving polynomial equations of degree 2 ax² + bx + c = 0 where factoring is difficult.',
    exampleProblem: 'Solve x² - 5x + 6 = 0: a=1, b=-5, c=6 ⇒ x = (5 ± √(25 - 24))/2 = (5 ± 1)/2 ⇒ x = 3 or 2.'
  },
  {
    id: 'f-pythagoras',
    subjectId: 'maths',
    title: 'Pythagoras Theorem',
    category: 'Geometry',
    latex: 'a^2 + b^2 = c^2',
    variables: [
      { name: 'Leg a', symbol: 'a', unit: 'Length (m, cm)' },
      { name: 'Leg b', symbol: 'b', unit: 'Length (m, cm)' },
      { name: 'Hypotenuse c', symbol: 'c', unit: 'Length (m, cm)' }
    ],
    whenToUse: 'To find the unknown side of any right-angled triangle given the other two sides.',
    exampleProblem: 'Right triangle with legs 3 cm and 4 cm: c = √(3² + 4²) = √25 = 5 cm.'
  },
  {
    id: 'f-trig-pyth',
    subjectId: 'maths',
    title: 'Pythagorean Trig Identity',
    category: 'Trigonometry',
    latex: '\\sin^2 \\theta + \\cos^2 \\theta = 1',
    variables: [
      { name: 'Angle', symbol: '\\theta', unit: 'Radians or Degrees' },
      { name: 'Sine ratio', symbol: '\\sin \\theta', unit: 'Ratio' },
      { name: 'Cosine ratio', symbol: '\\cos \\theta', unit: 'Ratio' }
    ],
    whenToUse: 'To convert between sin θ and cos θ or simplify trigonometric equations.',
    exampleProblem: 'If cos θ = 3/5, then sin²θ = 1 - (3/5)² = 16/25 ⇒ sin θ = 4/5.'
  },
  {
    id: 'f-power-rule',
    subjectId: 'maths',
    title: 'Derivative Power Rule',
    category: 'Calculus',
    latex: '\\frac{d}{dx}\\left(x^n\\right) = n x^{n-1}',
    variables: [
      { name: 'Exponent', symbol: 'n', unit: 'Real exponent' },
      { name: 'Independent variable', symbol: 'x', unit: 'Variable' }
    ],
    whenToUse: 'Differentiating polynomial terms x^n with constant exponents.',
    exampleProblem: 'd/dx (x³) = 3 x².'
  },
  {
    id: 'f-dot-product',
    subjectId: 'maths',
    title: 'Vector Dot Product',
    category: 'Vector Mathematics',
    latex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}| \\cos \\theta = A_x B_x + A_y B_y + A_z B_z',
    variables: [
      { name: 'Vector A magnitude', symbol: '|\\vec{A}|', unit: 'Magnitude' },
      { name: 'Vector B magnitude', symbol: '|\\vec{B}|', unit: 'Magnitude' },
      { name: 'Angle between vectors', symbol: '\\theta', unit: 'Degrees / Radians' }
    ],
    whenToUse: 'To calculate the angle between two vectors or project one vector onto another.',
    exampleProblem: 'If A = (1, 2) and B = (3, 4), A · B = (1)(3) + (2)(4) = 11.'
  },

  // Physics
  {
    id: 'f-newton2',
    subjectId: 'physics',
    title: 'Newton\'s Second Law',
    category: 'Laws of Motion',
    latex: '\\vec{F}_{net} = m \\vec{a}',
    variables: [
      { name: 'Net Force', symbol: 'F', unit: 'Newton (N = kg·m/s²)' },
      { name: 'Mass', symbol: 'm', unit: 'Kilogram (kg)' },
      { name: 'Acceleration', symbol: 'a', unit: 'Meters per second squared (m/s²)' }
    ],
    whenToUse: 'To calculate acceleration caused by net external force or determine required force for desired acceleration.',
    exampleProblem: 'Force to accelerate 1200 kg car at 3 m/s²: F = 1200 × 3 = 3600 N.'
  },
  {
    id: 'f-kinematic2',
    subjectId: 'physics',
    title: 'Displacement Kinematic Equation',
    category: 'Kinematics',
    latex: 's = ut + \\frac{1}{2}a t^2',
    variables: [
      { name: 'Displacement', symbol: 's', unit: 'Meters (m)' },
      { name: 'Initial Velocity', symbol: 'u', unit: 'Meters per second (m/s)' },
      { name: 'Acceleration', symbol: 'a', unit: 'm/s²' },
      { name: 'Time elapsed', symbol: 't', unit: 'Seconds (s)' }
    ],
    whenToUse: 'Calculating distance traveled under constant acceleration given initial velocity and time.',
    exampleProblem: 'Distance covered in 4s with u=0 and a=5 m/s²: s = 0 + 0.5(5)(16) = 40 m.'
  },
  {
    id: 'f-ohms-law',
    subjectId: 'physics',
    title: 'Ohm\'s Law',
    category: 'Current Electricity',
    latex: 'V = I R',
    variables: [
      { name: 'Potential Difference / Voltage', symbol: 'V', unit: 'Volt (V)' },
      { name: 'Electric Current', symbol: 'I', unit: 'Ampere (A)' },
      { name: 'Resistance', symbol: 'R', unit: 'Ohm (Ω)' }
    ],
    whenToUse: 'Analyzing DC circuit voltage drops, current flow, and resistance.',
    exampleProblem: 'Voltage across 10 Ω resistor passing 2 A current: V = 2 × 10 = 20 V.'
  },
  {
    id: 'f-kinetic-energy',
    subjectId: 'physics',
    title: 'Kinetic Energy',
    category: 'Work, Energy & Power',
    latex: 'K = \\frac{1}{2}m v^2',
    variables: [
      { name: 'Kinetic Energy', symbol: 'K', unit: 'Joule (J)' },
      { name: 'Mass', symbol: 'm', unit: 'Kilogram (kg)' },
      { name: 'Speed / Velocity', symbol: 'v', unit: 'm/s' }
    ],
    whenToUse: 'Calculating mechanical energy of a moving object.',
    exampleProblem: 'KE of a 2 kg projectile at 10 m/s: K = 0.5 × 2 × 10² = 100 J.'
  },
  {
    id: 'f-lens-formula',
    subjectId: 'physics',
    title: 'Thin Lens Formula',
    category: 'Optics',
    latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}',
    variables: [
      { name: 'Focal length', symbol: 'f', unit: 'Meters / Centimeters' },
      { name: 'Image distance', symbol: 'v', unit: 'Meters / Centimeters' },
      { name: 'Object distance', symbol: 'u', unit: 'Meters / Centimeters' }
    ],
    whenToUse: 'Determining image position or focal length of concave and convex lenses.',
    exampleProblem: 'Object at u = -20 cm, lens f = +10 cm: 1/v = 1/10 - 1/20 = 1/20 ⇒ v = +20 cm.'
  }
];
