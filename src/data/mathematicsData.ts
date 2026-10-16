import { Category } from '../types';

export const MATHEMATICS_CATEGORIES: Category[] = [
  {
    id: 'math-arithmetic',
    subjectId: 'maths',
    title: 'Arithmetic & Number Systems',
    iconName: 'Calculator',
    topics: [
      {
        id: 'real-numbers',
        subjectId: 'maths',
        categoryId: 'math-arithmetic',
        title: 'Real Numbers & Prime Factorization',
        titleTa: 'மெய் எண்கள் மற்றும் பகா காரணிமயமாக்கல்',
        description: 'Euclid\'s division lemma, fundamental theorem of arithmetic, and irrational proofs.',
        progress: 85,
        overview: 'Real numbers comprise all rational and irrational numbers. The Fundamental Theorem of Arithmetic states every composite number can be uniquely factored into primes.',
        keyConcepts: [
          'Euclid\'s Division Lemma: a = bq + r (0 ≤ r < b)',
          'Fundamental Theorem of Arithmetic: Unique prime factorization',
          'Irrationality Proofs (e.g. √2, √3)'
        ],
        importantFormulas: [
          {
            name: 'HCF & LCM Relationship',
            latex: '\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b',
            explanation: 'Product of two numbers equals product of their Highest Common Factor and Least Common Multiple.'
          }
        ],
        detailedExplanation: 'Every real number corresponds to a unique point on the number line. Rational numbers have terminating or non-terminating repeating decimals, whereas irrational numbers have non-terminating non-repeating decimal expansions.',
        workedExamples: [
          {
            problem: 'Find the HCF and LCM of 96 and 404 using prime factorization.',
            given: ['Number 1: a = 96', 'Number 2: b = 404'],
            formula: 'a = 2^5 \\times 3, \\quad b = 2^2 \\times 101',
            solutionSteps: [
              'Prime factorize 96: 96 = 2^5 × 3',
              'Prime factorize 404: 404 = 2^2 × 101',
              'HCF = lowest power of common prime factors = 2^2 = 4',
              'LCM = (96 × 404) / HCF = 38784 / 4 = 9696'
            ],
            finalAnswer: 'HCF = 4, LCM = 9696'
          }
        ],
        commonMistakes: [
          'Assuming HCF × LCM = a × b × c for THREE numbers (this identity applies only to 2 numbers!).',
          'Confusing prime numbers with odd numbers (2 is an even prime).'
        ],
        practiceQuestions: [
          {
            id: 'rn-q1',
            question: 'If two positive integers p and q can be expressed as p = ab² and q = a³b (a, b are primes), then LCM(p, q) is:',
            options: ['ab', 'a²b²', 'a³b²', 'a³b³'],
            correctIndex: 2,
            explanation: 'LCM takes highest power of each prime factor: max power of a is 3 (a³), max power of b is 2 (b²), so LCM = a³b².'
          }
        ]
      }
    ]
  },
  {
    id: 'math-algebra',
    subjectId: 'maths',
    title: 'Algebra',
    iconName: 'Variables',
    topics: [
      {
        id: 'quadratic-equations',
        subjectId: 'maths',
        categoryId: 'math-algebra',
        title: 'Quadratic Equations & Discriminant',
        titleTa: 'இருபடிச் சமன்பாடுகள்',
        description: 'Solving quadratics by factoring, completing the square, and quadratic formula.',
        progress: 70,
        overview: 'A quadratic equation is a polynomial equation of degree 2 in the standard form ax² + bx + c = 0 where a ≠ 0.',
        keyConcepts: [
          'Standard Form: ax² + bx + c = 0',
          'Discriminant D = b² - 4ac determines nature of roots',
          'Sum of roots α + β = -b/a, Product of roots αβ = c/a'
        ],
        importantFormulas: [
          {
            name: 'Quadratic Formula',
            latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            explanation: 'Solves any quadratic equation ax² + bx + c = 0.'
          },
          {
            name: 'Discriminant',
            latex: 'D = b^2 - 4ac',
            explanation: 'D > 0: two distinct real roots. D = 0: two equal real roots. D < 0: complex/imaginary roots.'
          }
        ],
        detailedExplanation: 'When D > 0, the parabola intersects the x-axis at two distinct points. When D = 0, the vertex touches the x-axis. When D < 0, the curve does not cross the x-axis.',
        workedExamples: [
          {
            problem: 'Solve 2x² - 7x + 3 = 0 using the quadratic formula.',
            given: ['a = 2', 'b = -7', 'c = 3'],
            formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            solutionSteps: [
              'Calculate Discriminant: D = (-7)² - 4(2)(3) = 49 - 24 = 25',
              'Apply quadratic formula: x = (7 ± √25) / (2 × 2) = (7 ± 5) / 4',
              'First root: x₁ = (7 + 5) / 4 = 12 / 4 = 3',
              'Second root: x₂ = (7 - 5) / 4 = 2 / 4 = 1/2'
            ],
            finalAnswer: 'x = 3 or x = 1/2'
          }
        ],
        commonMistakes: [
          'Forgetting to change the sign of b in -b.',
          'Missing the 2a denominator for the entire numerator.'
        ],
        practiceQuestions: [
          {
            id: 'quad-q1',
            question: 'What is the nature of roots for 3x² - 4√3 x + 4 = 0?',
            options: ['Two distinct real roots', 'Two equal real roots', 'No real roots', 'One imaginary & one real root'],
            correctIndex: 1,
            explanation: 'D = (-4√3)² - 4(3)(4) = 48 - 48 = 0. Since D = 0, the roots are real and equal.'
          }
        ]
      }
    ]
  },
  {
    id: 'math-geometry',
    subjectId: 'maths',
    title: 'Geometry',
    iconName: 'Shapes',
    topics: [
      {
        id: 'triangles',
        subjectId: 'maths',
        categoryId: 'math-geometry',
        title: 'Triangles & Pythagoras Theorem',
        titleTa: 'முக்கோணங்கள் மற்றும் பிதாகரஸ் தேற்றம்',
        description: 'Similarity theorems (AAA, SAS, SSS), Basic Proportionality Theorem, and right triangle properties.',
        progress: 60,
        overview: 'Two triangles are similar if their corresponding angles are equal and corresponding sides are in the same ratio.',
        keyConcepts: [
          'Basic Proportionality Theorem (Thales Theorem)',
          'Pythagoras Theorem: In a right triangle, c² = a² + b²',
          'Ratios of areas of two similar triangles equal ratio of squares of corresponding sides'
        ],
        importantFormulas: [
          {
            name: 'Pythagoras Theorem',
            latex: 'a^2 + b^2 = c^2',
            explanation: 'Relates legs a and b to hypotenuse c in a right-angled triangle.'
          }
        ],
        detailedExplanation: 'Thales Theorem states that if a line is drawn parallel to one side of a triangle intersecting the other two sides, it divides the sides in the same ratio.',
        workedExamples: [
          {
            problem: 'A ladder 10 m long reaches a window 8 m above the ground. Find the distance of the foot of the ladder from the base of the wall.',
            given: ['Hypotenuse (ladder c) = 10 m', 'Height (wall a) = 8 m'],
            formula: 'a^2 + b^2 = c^2 \\implies b = \\sqrt{c^2 - a^2}',
            solutionSteps: [
              'Substitute values: b = √(10² - 8²)',
              'Calculate squares: b = √(100 - 64) = √36',
              'Simplify square root: b = 6 m'
            ],
            finalAnswer: 'Distance = 6 m'
          }
        ],
        commonMistakes: [
          'Adding side lengths directly instead of squaring them first in Pythagoras theorem.',
          'Confusing similarity with congruence.'
        ],
        practiceQuestions: [
          {
            id: 'tri-q1',
            question: 'If △ABC ~ △PQR with AB/PQ = 1/3, then Area(△ABC) / Area(△PQR) is:',
            options: ['1/3', '1/6', '1/9', '1/27'],
            correctIndex: 2,
            explanation: 'Ratio of areas of similar triangles equals square of ratio of corresponding sides: (1/3)² = 1/9.'
          }
        ]
      }
    ]
  },
  {
    id: 'math-trig',
    subjectId: 'maths',
    title: 'Trigonometry',
    iconName: 'Compass',
    topics: [
      {
        id: 'trig-identities',
        subjectId: 'maths',
        categoryId: 'math-trig',
        title: 'Trigonometric Ratios & Identities',
        titleTa: 'திரிகோணமிதி மற்றும் முற்றொருமைகள்',
        description: 'Sin, cos, tan definitions, unit circle, pythagorean identities, and height & distance applications.',
        progress: 52,
        overview: 'Trigonometry studies relationships between side lengths and angles of triangles.',
        keyConcepts: [
          'sin θ = Opposite/Hypotenuse, cos θ = Adjacent/Hypotenuse, tan θ = Opposite/Adjacent',
          'Pythagorean Identity: sin²θ + cos²θ = 1',
          'Complementary angle relations: sin(90° - θ) = cos θ'
        ],
        importantFormulas: [
          {
            name: 'Fundamental Identity',
            latex: '\\sin^2 \\theta + \\cos^2 \\theta = 1',
            explanation: 'Core trigonometric identity valid for all real angles θ.'
          },
          {
            name: 'Secant-Tangent Identity',
            latex: '1 + \\tan^2 \\theta = \\sec^2 \\theta',
            explanation: 'Derived by dividing sin²θ + cos²θ = 1 by cos²θ.'
          }
        ],
        detailedExplanation: 'Trigonometric functions extend to all real numbers via the unit circle definition, where cos θ is the x-coordinate and sin θ is the y-coordinate of a point on x² + y² = 1.',
        workedExamples: [
          {
            problem: 'Evaluate (sin 30° + tan 45° - cosec 60°) / (sec 30° + cos 60° + cot 45°)',
            given: ['sin 30° = 1/2', 'tan 45° = 1', 'cosec 60° = 2/√3', 'sec 30° = 2/√3', 'cos 60° = 1/2', 'cot 45° = 1'],
            formula: '\\text{Direct substitution of standard values}',
            solutionSteps: [
              'Numerator = 1/2 + 1 - 2/√3 = (3/2) - (2/√3) = (3√3 - 4) / 2√3',
              'Denominator = 2/√3 + 1/2 + 1 = (2/√3) + (3/2) = (4 + 3√3) / 2√3',
              'Divide Numerator by Denominator: (3√3 - 4) / (3√3 + 4)',
              'Rationalize denominator: multiply top and bottom by (3√3 - 4)',
              'Final simplified expression = (43 - 24√3) / 11'
            ],
            finalAnswer: '(43 - 24√3) / 11'
          }
        ],
        commonMistakes: [
          'Writing sin(A + B) = sin A + sin B (this is mathematically INCORRECT!).',
          'Confusing inverse trig functions (sin⁻¹x) with reciprocal functions (cosec x).'
        ],
        practiceQuestions: [
          {
            id: 'trig-q1',
            question: 'What is the value of 9 sec²A - 9 tan²A?',
            options: ['1', '9', '8', '0'],
            correctIndex: 1,
            explanation: '9(sec²A - tan²A) = 9(1) = 9 using 1 + tan²A = sec²A.'
          }
        ]
      }
    ]
  },
  {
    id: 'math-calculus',
    subjectId: 'maths',
    title: 'Calculus',
    iconName: 'Activity',
    topics: [
      {
        id: 'differentiation',
        subjectId: 'maths',
        categoryId: 'math-calculus',
        title: 'Derivatives & Chain Rule',
        titleTa: 'வகைநுண்கணிதம் மற்றும் தொடர் விதி',
        description: 'Limits, instantaneous rate of change, power rule, product rule, quotient rule, and chain rule.',
        progress: 65,
        overview: 'Differentiation measures the rate at which a quantity changes with respect to another variable.',
        keyConcepts: [
          'Derivative Definition: f\'(x) = lim_{h→0} [f(x+h) - f(x)] / h',
          'Power Rule: d/dx(x^n) = n x^(n-1)',
          'Product Rule: d/dx(u v) = u v\' + v u\'',
          'Chain Rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)'
        ],
        importantFormulas: [
          {
            name: 'Chain Rule',
            latex: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}',
            explanation: 'Used to differentiate composite functions.'
          },
          {
            name: 'Quotient Rule',
            latex: '\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{v u\' - u v\'}{v^2}',
            explanation: 'Derivative of a fraction of two functions.'
          }
        ],
        detailedExplanation: 'The geometric interpretation of derivative dy/dx at x = a is the slope of the tangent line to the graph of y = f(x) at the point (a, f(a)).',
        workedExamples: [
          {
            problem: 'Find dy/dx for y = sin(3x² + 5).',
            given: ['y = sin(u) where u = 3x² + 5'],
            formula: '\\frac{dy}{dx} = \\cos(u) \\cdot \\frac{du}{dx}',
            solutionSteps: [
              'Differentiate outer function: d/du [sin u] = cos u = cos(3x² + 5)',
              'Differentiate inner function: du/dx = d/dx [3x² + 5] = 6x',
              'Multiply using chain rule: dy/dx = cos(3x² + 5) × 6x'
            ],
            finalAnswer: 'dy/dx = 6x \\cos(3x^2 + 5)'
          }
        ],
        commonMistakes: [
          'Forgetting to multiply by the derivative of the inner function when using Chain Rule.',
          'Mixing up the minus sign order in Quotient Rule (it must be v u\' - u v\', NOT u v\' - v u\').'
        ],
        practiceQuestions: [
          {
            id: 'calc-q1',
            question: 'What is the derivative of f(x) = e^(2x) with respect to x?',
            options: ['e^(2x)', '2 e^(2x)', 'x e^(2x)', '2x e^(2x)'],
            correctIndex: 1,
            explanation: 'By chain rule, d/dx[e^(2x)] = e^(2x) × d/dx(2x) = 2 e^(2x).'
          }
        ]
      }
    ]
  },
  {
    id: 'math-vector',
    subjectId: 'maths',
    title: 'Vector Mathematics',
    iconName: 'ArrowUpRight',
    topics: [
      {
        id: 'vector-dot-cross',
        subjectId: 'maths',
        categoryId: 'math-vector',
        title: 'Dot & Cross Products',
        titleTa: 'வெக்டர்களின் புள்ளி மற்றும் குறுக்குப் பெருக்கல்',
        description: 'Scalar product, vector product, magnitude, unit vectors, and angle between vectors.',
        progress: 45,
        overview: 'Vectors possess both magnitude and direction. Dot product yields a scalar, whereas cross product yields a perpendicular vector.',
        keyConcepts: [
          'Dot Product: A · B = |A||B| cos θ = AxBx + AyBy + AzBz',
          'Cross Product: A × B = |A||B| sin θ n̂',
          'Orthogonal condition: A · B = 0'
        ],
        importantFormulas: [
          {
            name: 'Dot Product',
            latex: '\\vec{A} \\cdot \\vec{B} = |\\vec{A}||\\vec{B}| \\cos \\theta',
            explanation: 'Scalar product used to calculate angle between vectors and projections.'
          },
          {
            name: 'Cross Product Magnitude',
            latex: '|\\vec{A} \\times \\vec{B}| = |\\vec{A}||\\vec{B}| \\sin \\theta',
            explanation: 'Gives the area of parallelogram spanned by vectors A and B.'
          }
        ],
        detailedExplanation: 'If two non-zero vectors A and B are perpendicular, their dot product is zero. If they are parallel, their cross product is zero.',
        workedExamples: [
          {
            problem: 'Find the angle between A = 2i + 2j - k and B = 6i - 3j + 2k.',
            given: ['A = (2, 2, -1)', 'B = (6, -3, 2)'],
            formula: '\\cos \\theta = \\frac{\\vec{A} \\cdot \\vec{B}}{|\\vec{A}||\\vec{B}|}',
            solutionSteps: [
              'Dot product: A · B = (2)(6) + (2)(-3) + (-1)(2) = 12 - 6 - 2 = 4',
              'Magnitude |A| = √(2² + 2² + (-1)²) = √(4 + 4 + 1) = √9 = 3',
              'Magnitude |B| = √(6² + (-3)² + 2²) = √(36 + 9 + 4) = √49 = 7',
              'cos θ = 4 / (3 × 7) = 4 / 21',
              'θ = cos⁻¹(4/21)'
            ],
            finalAnswer: '\\theta = \\cos^{-1}\\left(\\frac{4}{21}\\right) \\approx 79.02^\\circ'
          }
        ],
        commonMistakes: [
          'Confusing dot product (scalar) with cross product (vector).',
          'Cross product is non-commutative: A × B = -(B × A).'
        ],
        practiceQuestions: [
          {
            id: 'vec-q1',
            question: 'If vector A · B = 0 and both vectors are non-zero, what is the angle between them?',
            options: ['0°', '45°', '90°', '180°'],
            correctIndex: 2,
            explanation: 'cos θ = 0 when θ = 90°, so the vectors are mutually perpendicular.'
          }
        ]
      }
    ]
  }
];
