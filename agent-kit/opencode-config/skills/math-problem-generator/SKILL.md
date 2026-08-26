# Math Problem Generator

Skill for generating math problems with complete step-by-step solutions.

## When to Use

- User asks "generate practice problems for [topic]"
- User needs a worksheet or problem set
- User wants a problem with full solution for teaching
- User needs problem variants (different numbers/conditions)
- User wants to create an assessment or quiz

## Problem Categories

| Category | Topics |
|----------|--------|
| Arithmetic | Operations, fractions, decimals, percentages, ratios, proportions |
| Algebra | Linear equations, quadratics, systems, polynomials, functions, inequalities |
| Geometry | Triangles, circles, area, volume, proofs, transformations, coordinate geometry |
| Trigonometry | Right triangles, unit circle, identities, inverse trig, law of sines/cosines |
| Calculus | Limits, derivatives, integrals, series, differential equations |
| Statistics | Mean/median/mode, probability, distributions, hypothesis testing, regression |
| Number Theory | Prime numbers, modular arithmetic, GCD/LCM, diophantine equations |

## Difficulty Levels

### Beginner
- One concept per problem
- Small integers, simple arithmetic
- Direct application of a single formula
- Example: "Solve 2x + 3 = 7"

### Intermediate
- Multiple concepts combined
- Larger numbers, fractions, decimals
- Requires 2-3 steps to solve
- Example: "Solve 3(x - 2) + 4 = 2x + 7"

### Advanced
- Multi-step reasoning required
- Non-standard problems
- Requires strategy selection
- Example: "Find all real x such that sqrt(x+3) - sqrt(x-1) = 1"

### Olympiad
- Contest-level difficulty
- Requires insight or clever manipulation
- Multi-step proofs
- Example: "Find all triples (a,b,c) of positive integers such that a^2 + b^2 + c^2 = 3abc"

## Problem Types

### Multiple Choice
```
Question: What is the value of x in 2(x - 3) + 5 = 13?
A) 5
B) 7
C) 9
D) 11

Answer: B) 7
```

### Open-Ended
```
Question: Find all real solutions to x^2 - 5x + 6 = 0.
Answer: x = 2, x = 3
```

### Proof-Based
```
Question: Prove that the sum of the squares of any two consecutive positive integers is odd.
```

### Word Problems
```
Question: A rectangular garden has a length that is 3 meters longer than its width.
If the area is 40 square meters, find the dimensions.
Answer: width = 5 m, length = 8 m
```

## Solution Format

Use this structure for every solution:

```
## Problem
[problem statement]

## Solution

### Step 1: [Step title]
[Explanation of what we're doing]
[Mathematical work]
[Key insight or why this step is necessary]

### Step 2: [Step title]
[Continue step-by-step...]

### Final Answer
[Boxed or clearly marked answer]

## Common Mistakes
❌ [Mistake 1]: [Why it's wrong]
❌ [Mistake 2]: [Why it's wrong]

## Check Your Work
[Verification strategy — plug answer back in, alternate method, etc.]
```

## Step-by-Step Solution Example

```
## Problem
Solve the equation: 3(x - 2) + 2x = 4x + 1

## Solution

### Step 1: Distribute
3(x - 2) = 3x - 6
So: 3x - 6 + 2x = 4x + 1

### Step 2: Combine like terms
3x + 2x = 5x
So: 5x - 6 = 4x + 1

### Step 3: Move variables to one side
Subtract 4x from both sides:
5x - 6 - 4x = 4x + 1 - 4x
x - 6 = 1

### Step 4: Isolate the variable
Add 6 to both sides:
x - 6 + 6 = 1 + 6
x = 7

### Final Answer
x = 7

## Common Mistakes
❌ Forgetting to distribute the 3 to both terms: 3(x - 2) = 3x - 2 (wrong!)
❌ Combining unlike terms: 5x - 6 = 4x + 1 then subtracting 5x instead of 4x

## Check Your Work
Plug x = 7 back in: 3(7 - 2) + 2(7) = 3(5) + 14 = 15 + 14 = 29
Right side: 4(7) + 1 = 28 + 1 = 29 ✓
```

## Generating Variants

Change one or more of these to create variants:

```
Original:  2x + 3 = 11
Variant 1: 2x - 3 = 11      (change sign)
Variant 2: 3x + 2 = 11      (swap coefficients)
Variant 3: 2x + 3 = -11     (change right side)
Variant 4: 2x + 3 = 11 + x  (increase complexity)
```

**Parameter variation strategies:**
- Change numbers while keeping structure identical (easy)
- Change signs (+ to -) 
- Change the operation (addition to multiplication)
- Add an extra step or combine two concepts
- Change context of word problems (keep math, change story)

## Problem Set Templates

### Worksheet (10 problems)
```
Topic: [topic]
Grade: [level]
Instructions: Show all work.

Problems 1-4: Basic (beginner)
Problems 5-7: Medium (intermediate)
Problems 8-9: Hard (advanced)
Problem 10: Challenge (extension)
```

### Quiz (5 problems)
```
Topic: [topic]
Time: 15 minutes  
Total points: 20

Problems 1-3: Core concept (4 pts each)
Problem 4: Application (5 pts)
Problem 5: Extension (7 pts)
```

### Test (15-20 problems)
```
Topic: [topic]
Time: 45 minutes
Total points: 100

Section A: Multiple choice (5 @ 4 pts = 20)
Section B: Short answer (5 @ 6 pts = 30)
Section C: Open-ended (3 @ 10 pts = 30)
Section D: Extended response (1 @ 20 pts = 20)
```

## Common Mistakes by Topic

### Algebra
- Forgetting to distribute negative signs
- Combining unlike terms
- Losing solutions when dividing by a variable
- Sign errors when moving terms across equals

### Geometry
- Using wrong formula (area vs perimeter)
- Forgetting units
- Assuming triangles are right-angled
- Confusing complementary vs supplementary

### Calculus
- Forgetting +C in indefinite integrals
- Chain rule errors (forgetting to multiply by derivative of inner)
- Sign errors in integration by parts
- Confusing derivatives and integrals

### Statistics
- Confusing mean, median, mode
- Using standard deviation when variance is asked
- Misreading probability questions (and/or confusion)
- Forgetting to account for sample vs population

## Answer Key Format

```
## Answer Key

Problem 1: x = 4
Problem 2: x = -2
Problem 3: x = 7, y = 3
...
```

For open-ended or proof-based problems, provide a rubric:

```
Problem 5: Prove that the sum of two even numbers is even.

Rubric:
- States definition of even (2 pts)
- Let a = 2m, b = 2n (2 pts)
- Shows a + b = 2m + 2n = 2(m + n) (3 pts)
- Concludes 2(m+n) is even by definition (3 pts)
Total: 10 points
```

## Output

When generating a problem, return:
1. Problem statement with clear instructions
2. Complete step-by-step solution
3. Final answer clearly marked
4. Common mistakes section
5. Variants (if requested)
6. Answer key (for problem sets)
