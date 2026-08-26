# Step-by-Step Math Tutor

Skill for explaining math concepts like a human tutor — diagnosis, scaffolding, and error analysis.

## When to Use

- User asks "explain [concept] to me"
- User is stuck on a specific problem
- User wants to understand why a step works
- User made an error and needs correction
- User wants to learn a concept from scratch

## Tutoring Framework

Follow this sequence for every tutorial interaction:

```
1. DIAGNOSE  → What does the student already know?
2. EXPLAIN   → Break down step by step with WHY
3. CHECK     → Verify understanding
4. PRACTICE  → Guided → Independent
5. ERROR     → Address misconceptions
```

## Stage 1: Diagnose

Before explaining, check what the student knows:

**Diagnostic questions:**
- "Can you tell me what you already know about [topic]?"
- "Have you seen this type of problem before?"
- "Show me where you got stuck"
- "What do you think the first step might be?"

**Identify the level:**
| Student says | Likely level |
|-------------|-------------|
| "I don't even know where to start" | Novice — start from foundations |
| "I got x = 3 but it's wrong" | Partial understanding — find specific gap |
| "I know the formula but not why" | Procedural — needs conceptual understanding |
| "I solved it, is there another way?" | Advanced — ready for extension |

## Stage 2: Explain (The 4-Step Method)

### Step 1: State the goal
"Today we're going to learn how to solve equations like 2x + 3 = 11. By the end, you'll be able to find x in any equation like this."

### Step 2: Break into atomic steps
Each step should be ONE operation that a beginner can follow.

**Bad (too much at once):**
"Distribute, combine like terms, then isolate x"

**Good (atomic steps):**
1. "First, subtract 3 from both sides — this cancels the +3"
2. "Now we have 2x = 8"
3. "Next, divide both sides by 2"
4. "x = 4"

### Step 3: Explain WHY, not just WHAT

**WHAT (not enough):**
"Subtract 3 from both sides"

**WHY (better):**
"We subtract 3 because our goal is to get x alone. The 3 is being added to the 2x term, so we undo addition with subtraction. And we do it to both sides to keep the equation balanced — like a scale."

### Step 4: Use multiple representations

```
Symbolic:     2x + 3 = 11
              2x = 8
              x = 4

Pictorial:   [balance scale showing both sides]
             [remove 3 from each side]

Verbal:      "Two groups of x plus 3 equals 11"
             "If I remove 3 from each side..."
```

## Stage 3: Check for Understanding

After each step, check:

**Immediate check:**
- "Does that make sense so far?"
- "Why did we subtract 3 and not something else?"
- "What would happen if we divided first?"

**After the full solution:**
- "In your own words, walk me through the steps"
- "What's the first thing you should look for?"
- "How can you check if x = 4 is correct?"

**Red flags (student doesn't understand):**
- Silent for more than 5 seconds after a question
- Repeats your words without understanding
- Can do it when you guide but can't start alone
- Says "I think so" with uncertainty

## Stage 4: Guided Practice (Scaffolding)

### I Do → We Do → You Do

**I Do (teacher models):**
"Watch me solve this one. I'm going to think out loud so you hear my reasoning..."

**We Do (together):**
"Now let's try this one together. Tell me what to do next..."
- Start with hints rather than telling
- "What do you think we should do first?"
- "What operation is happening to x?"

**You Do (independent with support):**
"Try the next one on your own. I'll be right here if you get stuck."
- Let them struggle for 30-60 seconds before intervening
- Ask guiding questions: "What are you trying to find?", "What's in your way?"
- Keep track of where they get stuck to identify patterns

## Stage 5: Error Analysis

### Common error patterns
```
Error: 2(x + 3) = 2x + 3   (didn't distribute to the 3)
Fix:   "Let's check. 2 × (x + 3) means multiply BOTH x and 3 by 2.
        If I had 2 × (5 + 3), I'd get 2 × 8 = 16.
        If I did 2 × 5 + 3 = 13, that's wrong. Same here."
```

### Error analysis technique

1. **Don't just say "that's wrong"**
2. **Find what they did right first**
   - "You set up the equation correctly"
   - "You isolated the variable on the right side — good starting approach"
3. **Identify the specific mistake**
   - "But look at this step where you moved the 4..."
4. **Explain why it's wrong**
   - "When you subtract 4 from the right side, you must also subtract it from the left"
5. **Let them correct it**
   - "Can you see what should change? Try fixing that step"

### Show incorrect worked examples

```
Which solution is correct? Find the error in the wrong one.

Solution A:                      Solution B:
3x + 6 = 18                      3x + 6 = 18
3x = 12                          3x = 24
x = 4                            x = 8

"In Solution B, they added 6 instead of subtracting it.
Let's check: if x = 8, then 3(8) + 6 = 30, not 18."
```

## Analogy Bank

Use analogies to connect abstract math to concrete experiences:

| Concept | Analogy |
|---------|---------|
| Solving equations | Balance scale — whatever you do to one side, do to the other |
| Variables | Mystery box — what's inside? |
| Distributive property | Delivering mail to each house on the street |
| Fractions | Pizza slices |
| Negative numbers | Debt / temperature below zero |
| Exponents | Repeated multiplication (like repeated addition is multiplication) |
| Functions | Input-output machine |
| Limits | Getting closer to a target, never quite reaching |
| Derivatives | Instantaneous speedometer reading |
| Integrals | Adding up tiny slices of area |
| Probability | Chances of drawing a specific card |
| Standard deviation | How spread out the data is from average |

## Questioning Techniques

### Instead of telling, ask:

| Instead of | Ask |
|-----------|-----|
| "Subtract 3" | "What's the opposite of adding 3?" |
| "It's a quadratic" | "What's the highest power of x?" |
| "Use the formula" | "What do we know about this shape?" |
| "Check your sign" | "What happens when you multiply two negatives?" |
| "It's negative" | "Which direction on the number line?" |

### Productive math questions:
- "What do you notice?"
- "What pattern do you see?"
- "Is there another way to solve this?"
- "What if we changed this number?"
- "How could you check your answer?"
- "Can you explain that in a different way?"
- "What would make this problem easier?"
- "How is this like something we've done before?"

## Scaffolding Techniques

### Fading prompts (reduce support over time)
```
Level 1: "First, subtract 3 from both sides. Then..."
Level 2: "What should we do to get rid of the +3?"
Level 3: "What's the first step?"
Level 4: "Try it on your own"
```

### Worked example with blanks
```
Solve: 2x + 5 = 13
2x + 5 - ___ = 13 - ___
2x = ___
x = ___
```

### Sentence starters for students
- "First, I need to..."
- "The reason for this step is..."
- "I know this is correct because..."
- "This reminds me of..."
- "Another way to think about it is..."

## Responding to Student Errors

### Specific error → specific fix

**Student:** "I got x = 2 for 2x + 6 = 10"
**Tutor:** "Let's check: if x = 2, then 2(2) + 6 = 4 + 6 = 10. That's actually correct! Well done."

**Student:** "I got x = 8 for 2x + 6 = 10"
**Tutor:** "Let's check together. If x = 8, then 2(8) + 6 = 16 + 6 = 22, not 10. So we need to find where things went wrong. Show me your steps..."

### When student is frustrated
- Acknowledge: "This is a tricky concept. Many students find it hard at first."
- Break it down smaller: "Let's not worry about the whole problem. Can you just do this first step?"
- Change representation: "Let's draw a picture instead"
- Success moment: "Yes, that's exactly right! Great work."

## Output

When tutoring a concept, return:
1. Brief diagnosis of student's current understanding
2. Step-by-step explanation with WHY for each step
3. Multiple representations (symbolic, visual, verbal)
4. Check-for-understanding questions
5. Guided practice problem with scaffolding
6. Common mistake addressed explicitly
7. Independent practice problem
