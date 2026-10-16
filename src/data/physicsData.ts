import { Category } from '../types';

export const PHYSICS_CATEGORIES: Category[] = [
  {
    id: 'phys-kinematics',
    subjectId: 'physics',
    title: 'Kinematics & Motion',
    iconName: 'Zap',
    topics: [
      {
        id: 'motion-1d',
        subjectId: 'physics',
        categoryId: 'phys-kinematics',
        title: 'Motion in 1D & Equations of Motion',
        titleTa: 'நேர்க்கோட்டு இயக்கம்',
        description: 'Displacement, velocity, acceleration, and uniformly accelerated motion formulas.',
        progress: 80,
        overview: 'Kinematics describes the motion of points, bodies, and systems of bodies without considering the forces that cause the motion.',
        keyConcepts: [
          'Speed (scalar) vs Velocity (vector)',
          'Average Velocity v_avg = Total Displacement / Total Time',
          'Acceleration a = dv/dt'
        ],
        importantFormulas: [
          {
            name: '1st Kinematic Equation',
            latex: 'v = u + at',
            explanation: 'Final velocity with initial velocity u, acceleration a, and time t.'
          },
          {
            name: '2nd Kinematic Equation',
            latex: 's = ut + \\frac{1}{2}at^2',
            explanation: 'Displacement s under constant acceleration.'
          },
          {
            name: '3rd Kinematic Equation',
            latex: 'v^2 = u^2 + 2as',
            explanation: 'Velocity-displacement relation independent of time.'
          }
        ],
        detailedExplanation: 'For motion under uniform gravity near Earth\'s surface, replace acceleration a with -g (-9.8 m/s² or -10 m/s²) depending on coordinate orientation.',
        workedExamples: [
          {
            problem: 'A car accelerates uniformly from rest at 2.5 m/s² for 8 seconds. Calculate its final velocity and total displacement.',
            given: ['Initial velocity u = 0 m/s', 'Acceleration a = 2.5 m/s²', 'Time t = 8 s'],
            formula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2',
            solutionSteps: [
              '1. Final Velocity: v = 0 + (2.5 × 8) = 20 m/s',
              '2. Displacement: s = (0)(8) + 0.5 × (2.5) × (8²)',
              '3. s = 0.5 × 2.5 × 64 = 80 m'
            ],
            finalAnswer: 'v = 20 m/s, s = 80 m'
          }
        ],
        commonMistakes: [
          'Confusing distance (always positive scalar) with displacement (vector with direction).',
          'Forgetting negative sign for deceleration or motion opposing gravity.'
        ],
        practiceQuestions: [
          {
            id: 'm1d-q1',
            question: 'A stone dropped from a cliff hits the ground in 4 s. Taking g = 10 m/s², height of the cliff is:',
            options: ['40 m', '80 m', '100 m', '160 m'],
            correctIndex: 1,
            explanation: 's = ut + 0.5 g t² = 0 + 0.5 × 10 × (4²) = 5 × 16 = 80 m.'
          }
        ]
      }
    ]
  },
  {
    id: 'phys-dynamics',
    subjectId: 'physics',
    title: 'Laws of Motion & Friction',
    iconName: 'ShieldAlert',
    topics: [
      {
        id: 'newtons-laws',
        subjectId: 'physics',
        categoryId: 'phys-dynamics',
        title: 'Newton\'s Laws of Motion',
        titleTa: 'நியூட்டனின் இயக்க விதிகள்',
        description: 'Inertia, force definition, momentum, action-reaction pairs, and free-body diagrams.',
        progress: 75,
        overview: 'Newton\'s laws govern the relationship between a physical object and the forces acting upon it.',
        keyConcepts: [
          '1st Law: Law of Inertia (no net force → constant velocity)',
          '2nd Law: F_net = dp/dt = ma (Force equals rate of change of linear momentum)',
          '3rd Law: Action and Reaction are equal and opposite (act on different bodies)'
        ],
        importantFormulas: [
          {
            name: 'Newton\'s Second Law',
            latex: '\\vec{F}_{net} = m\\vec{a}',
            explanation: 'Net force F in Newtons (N) = mass m (kg) × acceleration a (m/s²).'
          },
          {
            name: 'Linear Momentum',
            latex: '\\vec{p} = m\\vec{v}',
            explanation: 'Momentum p in kg·m/s.'
          }
        ],
        detailedExplanation: 'Free-body diagrams (FBD) isolate an object and display all external forces acting on it: Gravity (mg), Normal force (N), Tension (T), and Friction (f).',
        workedExamples: [
          {
            problem: 'A force of 50 N acts on a mass of 10 kg resting on a frictionless table. Find the acceleration.',
            given: ['Net Force F = 50 N', 'Mass m = 10 kg'],
            formula: 'F = ma \\implies a = \\frac{F}{m}',
            solutionSteps: [
              'Substitute values: a = 50 / 10',
              'a = 5 m/s²'
            ],
            finalAnswer: 'a = 5 m/s²'
          }
        ],
        commonMistakes: [
          'Believing action and reaction forces cancel each other out on a single object (they act on DIFFERENT objects!).',
          'Omitting gravity or normal force in free-body diagrams.'
        ],
        practiceQuestions: [
          {
            id: 'nlm-q1',
            question: 'An elevator of mass 1000 kg accelerates upward at 2 m/s². What is the tension in the cable? (g = 10 m/s²)',
            options: ['8000 N', '10000 N', '12000 N', '14000 N'],
            correctIndex: 2,
            explanation: 'T - mg = ma ⇒ T = m(g + a) = 1000 × (10 + 2) = 12000 N.'
          }
        ]
      }
    ]
  },
  {
    id: 'phys-energy',
    subjectId: 'physics',
    title: 'Work, Energy & Power',
    iconName: 'Flame',
    topics: [
      {
        id: 'work-energy-theorem',
        subjectId: 'physics',
        categoryId: 'phys-energy',
        title: 'Work-Energy Theorem & Conservation',
        titleTa: 'வேலை-ஆற்றல் தேற்றம்',
        description: 'Work done by constant & variable forces, Kinetic energy, Potential energy, and Power.',
        progress: 68,
        overview: 'Work is scalar product of force and displacement. Energy is the capacity to do work.',
        keyConcepts: [
          'Work W = F · s = F s cos θ',
          'Kinetic Energy KE = ½ m v²',
          'Gravitational Potential Energy PE = m g h',
          'Work-Energy Theorem: W_net = ΔKE = KE_final - KE_initial'
        ],
        importantFormulas: [
          {
            name: 'Work Done',
            latex: 'W = \\vec{F} \\cdot \\vec{s} = F s \\cos \\theta',
            explanation: 'Work in Joules (J). θ is angle between force and displacement.'
          },
          {
            name: 'Kinetic Energy',
            latex: 'K = \\frac{1}{2}m v^2',
            explanation: 'Energy possessed by virtue of motion.'
          },
          {
            name: 'Power',
            latex: 'P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}',
            explanation: 'Rate of doing work in Watts (W).'
          }
        ],
        detailedExplanation: 'Conservative forces (e.g. gravity, electrostatic) have work independent of path taken, allowing definition of potential energy U.',
        workedExamples: [
          {
            problem: 'A ball of mass 0.5 kg is dropped from a height of 20 m. Calculate its kinetic energy right before hitting the ground (g = 10 m/s²).',
            given: ['m = 0.5 kg', 'h = 20 m', 'g = 10 m/s²'],
            formula: 'E_{total} = PE_{initial} = m g h = KE_{final}',
            solutionSteps: [
              'By conservation of mechanical energy: KE_final = PE_initial',
              'PE = 0.5 kg × 10 m/s² × 20 m',
              'PE = 100 Joules'
            ],
            finalAnswer: 'KE = 100 J'
          }
        ],
        commonMistakes: [
          'Treating work as a vector (it is a scalar!).',
          'Using PE = mgh when displacement is horizontal or when g changes significantly.'
        ],
        practiceQuestions: [
          {
            id: 'wep-q1',
            question: 'An engine lifts 100 kg of water to a height of 10 m in 5 seconds. What is its power output? (g = 10 m/s²)',
            options: ['1000 W', '2000 W', '500 W', '4000 W'],
            correctIndex: 1,
            explanation: 'Work = mgh = 100 × 10 × 10 = 10000 J. Power = Work/time = 10000 / 5 = 2000 W.'
          }
        ]
      }
    ]
  },
  {
    id: 'phys-electricity',
    subjectId: 'physics',
    title: 'Current Electricity & Circuits',
    iconName: 'Cpu',
    topics: [
      {
        id: 'ohms-law-circuits',
        subjectId: 'physics',
        categoryId: 'phys-electricity',
        title: 'Ohm\'s Law & Kirchhoff\'s Rules',
        titleTa: 'ஓம் விதி மற்றும் கெர்ச்சஃப்பின் விதிகள்',
        description: 'Electric current, drift velocity, resistance, combination of resistors, and Kirchhoff laws.',
        progress: 60,
        overview: 'Electric current is the rate of flow of electric charge through a conductor.',
        keyConcepts: [
          'Current I = Q / t',
          'Ohm\'s Law V = I R',
          'Resistors in series: R_eq = R1 + R2 + ...',
          'Resistors in parallel: 1/R_eq = 1/R1 + 1/R2 + ...',
          'Kirchhoff\'s Junction Rule (KCL): Σ I = 0',
          'Kirchhoff\'s Loop Rule (KVL): Σ V = 0'
        ],
        importantFormulas: [
          {
            name: 'Ohm\'s Law',
            latex: 'V = I R',
            explanation: 'Voltage drop across a resistor equals current times resistance.'
          },
          {
            name: 'Electrical Power',
            latex: 'P = V I = I^2 R = \\frac{V^2}{R}',
            explanation: 'Power dissipated in a resistor in Watts (W).'
          }
        ],
        detailedExplanation: 'Drift velocity v_d is the average velocity attained by free electrons in a material due to an electric field: I = n A e v_d.',
        workedExamples: [
          {
            problem: 'Two resistors of 6 Ω and 12 Ω are connected in parallel across a 12V battery. Find equivalent resistance and total current.',
            given: ['R1 = 6 Ω', 'R2 = 12 Ω', 'V = 12 V'],
            formula: '\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}, \\quad I = \\frac{V}{R_{eq}}',
            solutionSteps: [
              '1/R_eq = 1/6 + 1/12 = 2/12 + 1/12 = 3/12 = 1/4',
              'R_eq = 4 Ω',
              'Total current I = 12V / 4Ω = 3 A'
            ],
            finalAnswer: 'R_eq = 4 Ω, Total Current = 3 A'
          }
        ],
        commonMistakes: [
          'Applying series formula for parallel combinations.',
          'Forgetting internal resistance of batteries in real circuit loops.'
        ],
        practiceQuestions: [
          {
            id: 'elec-q1',
            question: 'What happens to the power dissipated in a wire if the current flowing through it is doubled while resistance stays constant?',
            options: ['Doubles', 'Halves', 'Quadruples (4x)', 'Stays same'],
            correctIndex: 2,
            explanation: 'P = I² R. If I is multiplied by 2, I² becomes 4x, so Power quadruples.'
          }
        ]
      }
    ]
  },
  {
    id: 'phys-optics',
    subjectId: 'physics',
    title: 'Optics & Wave Motion',
    iconName: 'Sun',
    topics: [
      {
        id: 'refraction-lenses',
        subjectId: 'physics',
        categoryId: 'phys-optics',
        title: 'Ray Optics: Refraction & Lenses',
        titleTa: 'ஒளியியல் மற்றும் லென்ஸ்கள்',
        description: 'Snell\'s Law, total internal reflection, lens formula, magnification, and power of lenses.',
        progress: 50,
        overview: 'Optics studies the behavior and properties of light, including its interactions with matter.',
        keyConcepts: [
          'Snell\'s Law: n1 sin θ1 = n2 sin θ2',
          'Critical Angle θ_c = sin⁻¹(n2 / n1) for n1 > n2',
          'Lens Formula: 1/f = 1/v - 1/u',
          'Power of Lens P = 1 / f(in meters) in Dioptres (D)'
        ],
        importantFormulas: [
          {
            name: 'Lens Formula',
            latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}',
            explanation: 'Relates focal length f, image distance v, and object distance u with sign convention.'
          },
          {
            name: 'Magnification',
            latex: 'm = \\frac{h_i}{h_o} = \\frac{v}{u}',
            explanation: 'Ratio of image height to object height.'
          }
        ],
        detailedExplanation: 'According to Cartesian sign convention: light travels from left to right. Distances measured against incident light are negative; in direction of light are positive.',
        workedExamples: [
          {
            problem: 'A convex lens has a focal length of +15 cm. An object is placed 30 cm in front of the lens. Find image position and nature.',
            given: ['f = +15 cm', 'u = -30 cm (by sign convention)'],
            formula: '\\frac{1}{v} = \\frac{1}{f} + \\frac{1}{u}',
            solutionSteps: [
              '1/v = 1/15 + 1/(-30) = 1/15 - 1/30 = (2 - 1)/30 = 1/30',
              'v = +30 cm',
              'Magnification m = v / u = +30 / -30 = -1'
            ],
            finalAnswer: 'v = +30 cm (Real, Inverted, same size at 2F)'
          }
        ],
        commonMistakes: [
          'Forgetting Cartesian sign convention (- for real objects in front of lens).',
          'Confusing mirror formula (1/f = 1/v + 1/u) with lens formula (1/f = 1/v - 1/u).'
        ],
        practiceQuestions: [
          {
            id: 'opt-q1',
            question: 'What is the focal length of a lens with power +2.5 Dioptres?',
            options: ['25 cm', '40 cm', '50 cm', '100 cm'],
            correctIndex: 1,
            explanation: 'f = 1 / P = 1 / 2.5 m = 0.4 m = 40 cm.'
          }
        ]
      }
    ]
  }
];
