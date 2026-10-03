import { type Question, type Skill } from "./content-schema";
import { READING_BANKS } from "./reading-bank";

export const LEVEL_1_QUESTIONS: Question[] = [
  {
    id: "q-math-1",
    skillId: "count-within-10",
    tier: 1,
    promptTemplate: "{theme_hero} found 4 {theme_items} in the morning and 2 more in the afternoon. How many {theme_items} altogether?",
    readAloudText: "{theme_hero} found 4 {theme_items} in the morning and 2 more in the afternoon. How many {theme_items} altogether?",
    hint: "Start with 4, then count up two more: 5, 6!",
    options: [
      { id: "opt-1", text: "5 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2", text: "6 {theme_items}", isCorrect: true },
      { id: "opt-3", text: "7 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-2",
    skillId: "count-within-10",
    tier: 1,
    promptTemplate: "{theme_hero} has 3 {theme_items} in a nest and finds 3 more on the path. How many {theme_items} now?",
    readAloudText: "Count 3 plus 3 items.",
    hint: "Double 3 is 6!",
    options: [
      { id: "opt-1-2a", text: "6 {theme_items}", isCorrect: true },
      { id: "opt-1-2b", text: "5 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-2c", text: "7 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-3",
    skillId: "count-within-10",
    tier: 1,
    promptTemplate: "There are 5 {theme_items} near the river and 2 {theme_items} on the grass. How many in total?",
    readAloudText: "Add 5 and 2.",
    hint: "Count up from 5: 6, 7!",
    options: [
      { id: "opt-1-3a", text: "6 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-3b", text: "7 {theme_items}", isCorrect: true },
      { id: "opt-1-3c", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-4",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "Moyin spotted 6 {theme_items} in a row, then 3 more flew down. How many are there altogether?",
    readAloudText: "What is 6 plus 3?",
    hint: "Start at 6: 7, 8, 9!",
    options: [
      { id: "opt-1-4a", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
      { id: "opt-1-4b", text: "9 {theme_items}", isCorrect: true },
      { id: "opt-1-4c", text: "10 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-5",
    skillId: "count-within-10",
    tier: 1,
    promptTemplate: "{kid} gathered 7 {theme_items} and was gifted 1 more. How many {theme_items} does {kid} have?",
    readAloudText: "What is 7 plus 1?",
    hint: "One more than 7 is 8.",
    options: [
      { id: "opt-1-5a", text: "8 {theme_items}", isCorrect: true },
      { id: "opt-1-5b", text: "7 {theme_items}", isCorrect: false, misconceptionTag: "identity-confusion" },
      { id: "opt-1-5c", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-6",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "Two friends shared: {kid} brought 2 {theme_items} and Moyin brought 5 {theme_items}. How many do they have combined?",
    readAloudText: "Combine 2 and 5 items.",
    hint: "Adding 2 to 5 gives 7.",
    options: [
      { id: "opt-1-6a", text: "6 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-6b", text: "7 {theme_items}", isCorrect: true },
      { id: "opt-1-6c", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-7",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "Look closely: 4 {theme_items} on the left branch and 4 {theme_items} on the right branch. How many in total?",
    readAloudText: "Count 4 plus 4 items.",
    hint: "4 plus 4 equals 8.",
    options: [
      { id: "opt-1-7a", text: "8 {theme_items}", isCorrect: true },
      { id: "opt-1-7b", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-7c", text: "7 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-8",
    skillId: "count-within-10",
    tier: 1,
    promptTemplate: "{theme_hero} had 1 {theme_items} in a pouch and found 8 more in the valley. What is the total count?",
    readAloudText: "What is 1 plus 8?",
    hint: "Start at 8 and add 1 more: 9!",
    options: [
      { id: "opt-1-8a", text: "9 {theme_items}", isCorrect: true },
      { id: "opt-1-8b", text: "10 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-8c", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "identity-confusion" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-9",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "During morning exploration, 5 {theme_items} were counted. In the afternoon, 4 more were seen. How many altogether?",
    readAloudText: "Calculate 5 plus 4 items.",
    hint: "Think: 5 plus 5 would be 10, so 5 plus 4 is 9.",
    options: [
      { id: "opt-1-9a", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-9b", text: "9 {theme_items}", isCorrect: true },
      { id: "opt-1-9c", text: "10 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-10",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "There were 3 green {theme_items} and 6 gold {theme_items}. How many {theme_items} are there in all?",
    readAloudText: "Count 3 plus 6.",
    hint: "Start with 6: 7, 8, 9!",
    options: [
      { id: "opt-1-10a", text: "9 {theme_items}", isCorrect: true },
      { id: "opt-1-10b", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-10c", text: "7 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-11",
    skillId: "count-within-10",
    tier: 2,
    promptTemplate: "Moyin discovered 2 shiny {theme_items} under a rock and 7 more by the stream. What is the sum?",
    readAloudText: "Calculate 2 plus 7.",
    hint: "Count 2 up from 7: 8, 9!",
    options: [
      { id: "opt-1-11a", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-11b", text: "9 {theme_items}", isCorrect: true },
      { id: "opt-1-11c", text: "10 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-12",
    skillId: "count-within-10",
    tier: 3,
    promptTemplate: "8 {theme_items} were already in the basket. Moyin added 2 more. How many {theme_items} are in the basket now?",
    readAloudText: "What is 8 plus 2?",
    hint: "8 and 2 make a friendly 10!",
    options: [
      { id: "opt-1-12a", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-12b", text: "10 {theme_items}", isCorrect: true },
      { id: "opt-1-12c", text: "11 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-13",
    skillId: "count-within-10",
    tier: 3,
    promptTemplate: "{kid} lined up 6 {theme_items} and a friend placed 4 more alongside them. What is the total count?",
    readAloudText: "Count 6 plus 4.",
    hint: "6 plus 4 makes 10.",
    options: [
      { id: "opt-1-13a", text: "10 {theme_items}", isCorrect: true },
      { id: "opt-1-13b", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-13c", text: "8 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-14",
    skillId: "count-within-10",
    tier: 3,
    promptTemplate: "A classic pair: 5 {theme_items} on one stone plate and 5 {theme_items} on the second plate. How many total?",
    readAloudText: "Add 5 and 5.",
    hint: "Two hands of 5 make 10!",
    options: [
      { id: "opt-1-14a", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-14b", text: "10 {theme_items}", isCorrect: true },
      { id: "opt-1-14c", text: "11 {theme_items}", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-1-15",
    skillId: "count-within-10",
    tier: 3,
    promptTemplate: "Final challenge for Level 1: {kid} has 9 {theme_items} and finds 1 special {theme_items}. How many now?",
    readAloudText: "Count 9 plus 1.",
    hint: "One more than 9 gives 10!",
    options: [
      { id: "opt-1-15a", text: "10 {theme_items}", isCorrect: true },
      { id: "opt-1-15b", text: "11 {theme_items}", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-1-15c", text: "9 {theme_items}", isCorrect: false, misconceptionTag: "identity-confusion" },
    ],
    type: "multiple-choice",
  },
];

export const LEVEL_2_QUESTIONS: Question[] = [
  {
    id: "q-math-2",
    skillId: "money-simple",
    tier: 1,
    promptTemplate: "Moyin bought a snack for {currency}5 and a drink for {currency}3. How much did Moyin spend in total?",
    readAloudText: "Moyin bought a snack and a drink. How much did Moyin spend in total?",
    hint: "Add 5 and 3 together.",
    options: [
      { id: "opt-2-1a", text: "{currency}7", isCorrect: false, misconceptionTag: "arithmetic-slip" },
      { id: "opt-2-1b", text: "{currency}8", isCorrect: true },
      { id: "opt-2-1c", text: "{currency}9", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-2",
    skillId: "money-simple",
    tier: 1,
    promptTemplate: "{kid} bought fresh fruit for {currency}4 and biscuits for {currency}4. What was the total price?",
    readAloudText: "Add 4 and 4 currency units.",
    hint: "4 plus 4 equals 8.",
    options: [
      { id: "opt-2-2a", text: "{currency}8", isCorrect: true },
      { id: "opt-2-2b", text: "{currency}7", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-2c", text: "{currency}9", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-3",
    skillId: "money-simple",
    tier: 1,
    promptTemplate: "A small notebook costs {currency}6 and a pencil costs {currency}2. How much for both items?",
    readAloudText: "What is 6 plus 2?",
    hint: "6 plus 2 equals 8.",
    options: [
      { id: "opt-2-3a", text: "{currency}7", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-3b", text: "{currency}8", isCorrect: true },
      { id: "opt-2-3c", text: "{currency}10", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-4",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "Moyin bought a meatpie for {currency}7 and a chilled water for {currency}3. How much did Moyin pay?",
    readAloudText: "Calculate 7 plus 3.",
    hint: "7 plus 3 makes 10.",
    options: [
      { id: "opt-2-4a", text: "{currency}9", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-4b", text: "{currency}10", isCorrect: true },
      { id: "opt-2-4c", text: "{currency}11", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-5",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "{kid} had a {currency}10 note. {kid} spent {currency}4 on plantain chips. How much change was left?",
    readAloudText: "Take 4 away from 10.",
    hint: "10 minus 4 equals 6.",
    options: [
      { id: "opt-2-5a", text: "{currency}6", isCorrect: true },
      { id: "opt-2-5b", text: "{currency}5", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-5c", text: "{currency}7", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-6",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "Two snack items cost {currency}5 each. What is the total cost for both?",
    readAloudText: "What is 5 plus 5?",
    hint: "5 plus 5 is 10.",
    options: [
      { id: "opt-2-6a", text: "{currency}10", isCorrect: true },
      { id: "opt-2-6b", text: "{currency}9", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-6c", text: "{currency}12", isCorrect: false, misconceptionTag: "arithmetic-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-7",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "A fruit snack costs {currency}8 and honey candy costs {currency}4. How much total did Moyin spend?",
    readAloudText: "Add 8 and 4.",
    hint: "8 plus 2 is 10, plus 2 more is 12.",
    options: [
      { id: "opt-2-7a", text: "{currency}11", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-7b", text: "{currency}12", isCorrect: true },
      { id: "opt-2-7c", text: "{currency}13", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-8",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "Lunch cost {currency}9 and a hibiscus juice was {currency}6. What is the combined bill?",
    readAloudText: "What is 9 plus 6?",
    hint: "9 plus 1 is 10, plus 5 more is 15.",
    options: [
      { id: "opt-2-8a", text: "{currency}14", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-8b", text: "{currency}15", isCorrect: true },
      { id: "opt-2-8c", text: "{currency}16", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-9",
    skillId: "money-simple",
    tier: 2,
    promptTemplate: "You hand the shopkeeper a {currency}15 voucher and buy an item for {currency}5. What is your change?",
    readAloudText: "Subtract 5 from 15.",
    hint: "15 minus 5 leaves 10.",
    options: [
      { id: "opt-2-9a", text: "{currency}10", isCorrect: true },
      { id: "opt-2-9b", text: "{currency}8", isCorrect: false, misconceptionTag: "arithmetic-slip" },
      { id: "opt-2-9c", text: "{currency}9", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-10",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "{kid} picked a hive scarf treat for {currency}10 and honey candy for {currency}8. How much in all?",
    readAloudText: "Add 10 and 8.",
    hint: "10 and 8 make 18.",
    options: [
      { id: "opt-2-10a", text: "{currency}17", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-10b", text: "{currency}18", isCorrect: true },
      { id: "opt-2-10c", text: "{currency}19", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-11",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "{kid} has a {currency}20 bill. {kid} purchases a storybook for {currency}12. How much money remains?",
    readAloudText: "Subtract 12 from 20.",
    hint: "20 minus 10 is 10, minus 2 is 8.",
    options: [
      { id: "opt-2-11a", text: "{currency}8", isCorrect: true },
      { id: "opt-2-11b", text: "{currency}7", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-11c", text: "{currency}9", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-12",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "Chin-chin snacks cost {currency}6 and puff-puff treats cost {currency}7. How much do both cost together?",
    readAloudText: "Calculate 6 plus 7.",
    hint: "6 plus 6 is 12, plus 1 more is 13.",
    options: [
      { id: "opt-2-12a", text: "{currency}12", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-12b", text: "{currency}13", isCorrect: true },
      { id: "opt-2-12c", text: "{currency}14", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-13",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "A special meal is {currency}14 and a natural juice is {currency}6. What is the total sum?",
    readAloudText: "What is 14 plus 6?",
    hint: "14 plus 6 equals 20.",
    options: [
      { id: "opt-2-13a", text: "{currency}20", isCorrect: true },
      { id: "opt-2-2b", text: "{currency}19", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-13c", text: "{currency}21", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-14",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "Moyin held a {currency}20 note and spent {currency}15 on sweet honey bread. How much change returned?",
    readAloudText: "Take 15 from 20.",
    hint: "20 minus 15 leaves 5.",
    options: [
      { id: "opt-2-14a", text: "{currency}5", isCorrect: true },
      { id: "opt-2-14b", text: "{currency}4", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-14c", text: "{currency}6", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-2-15",
    skillId: "money-simple",
    tier: 3,
    promptTemplate: "Final challenge for Level 2: A snack is {currency}11 and a drink is {currency}9. How much in total?",
    readAloudText: "What is 11 plus 9?",
    hint: "11 plus 9 makes an exact 20!",
    options: [
      { id: "opt-2-15a", text: "{currency}20", isCorrect: true },
      { id: "opt-2-15b", text: "{currency}19", isCorrect: false, misconceptionTag: "off-by-one" },
      { id: "opt-2-15c", text: "{currency}21", isCorrect: false, misconceptionTag: "off-by-one" },
    ],
    type: "multiple-choice",
  },
];

export const LEVEL_3_QUESTIONS: Question[] = [
  {
    id: "q-math-3",
    skillId: "place-value-tens",
    tier: 1,
    promptTemplate: "If you have 3 bundles of 10 {theme_items} and 4 single {theme_items}, what number is that?",
    readAloudText: "If you have 3 tens and 4 ones, what number is that?",
    hint: "3 tens is 30, plus 4 more is 34.",
    options: [
      { id: "opt-3-1a", text: "34", isCorrect: true },
      { id: "opt-3-1b", text: "43", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-1c", text: "7", isCorrect: false, misconceptionTag: "added-digits" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-2",
    skillId: "place-value-tens",
    tier: 1,
    promptTemplate: "{kid} counts 2 bundles of 10 twigs and 5 loose twigs. What is the total count?",
    readAloudText: "What number has 2 tens and 5 ones?",
    hint: "2 tens is 20, plus 5 is 25.",
    options: [
      { id: "opt-3-2a", text: "25", isCorrect: true },
      { id: "opt-3-2b", text: "52", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-2c", text: "20", isCorrect: false, misconceptionTag: "omitted-ones" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-3",
    skillId: "place-value-tens",
    tier: 1,
    promptTemplate: "In a discovery bag, there are 4 bundles of 10 {theme_items} and 2 singles. What number is that?",
    readAloudText: "4 tens and 2 ones make what number?",
    hint: "40 plus 2 gives 42.",
    options: [
      { id: "opt-3-3a", text: "42", isCorrect: true },
      { id: "opt-3-3b", text: "24", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-3c", text: "40", isCorrect: false, misconceptionTag: "omitted-ones" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-4",
    skillId: "place-value-tens",
    tier: 2,
    promptTemplate: "There are 5 bundles of 10 {theme_items} and zero loose single items. What number is this?",
    readAloudText: "What is 5 tens and 0 ones?",
    hint: "5 tens with 0 ones is 50.",
    options: [
      { id: "opt-3-4a", text: "50", isCorrect: true },
      { id: "opt-3-4b", text: "5", isCorrect: false, misconceptionTag: "place-value-loss" },
      { id: "opt-3-4c", text: "55", isCorrect: false, misconceptionTag: "digit-repetition" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-5",
    skillId: "place-value-tens",
    tier: 2,
    promptTemplate: "You tie 1 bundle of 10 stones and have 9 loose stones beside it. What is the total?",
    readAloudText: "What is 1 ten and 9 ones?",
    hint: "10 plus 9 is 19.",
    options: [
      { id: "opt-3-5a", text: "19", isCorrect: true },
      { id: "opt-3-5b", text: "91", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-5c", text: "10", isCorrect: false, misconceptionTag: "omitted-ones" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-6",
    skillId: "place-value-tens",
    tier: 2,
    promptTemplate: "6 bundles of 10 {theme_items} and 3 single items represent which number?",
    readAloudText: "6 tens and 3 ones.",
    hint: "60 plus 3 is 63.",
    options: [
      { id: "opt-3-6a", text: "63", isCorrect: true },
      { id: "opt-3-6b", text: "36", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-6c", text: "9", isCorrect: false, misconceptionTag: "added-digits" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-7",
    skillId: "place-value-tens",
    tier: 2,
    promptTemplate: "{kid} asks: in the number 47, how many full bundles of 10 are there?",
    readAloudText: "How many tens are in 47?",
    hint: "The tens digit is the first number: 4.",
    options: [
      { id: "opt-3-7a", text: "4 tens", isCorrect: true },
      { id: "opt-3-7b", text: "7 tens", isCorrect: false, misconceptionTag: "ones-tens-swap" },
      { id: "opt-3-7c", text: "40 tens", isCorrect: false, misconceptionTag: "value-vs-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-8",
    skillId: "place-value-tens",
    tier: 2,
    promptTemplate: "{kid} wonders: in the number 28, what digit represents the single loose ones?",
    readAloudText: "What is the ones digit in 28?",
    hint: "The ones digit is at the right: 8.",
    options: [
      { id: "opt-3-8a", text: "8 ones", isCorrect: true },
      { id: "opt-3-8b", text: "2 ones", isCorrect: false, misconceptionTag: "ones-tens-swap" },
      { id: "opt-3-8c", text: "10 ones", isCorrect: false, misconceptionTag: "random-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-9",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "7 bundles of 10 {theme_items} and 5 singles are placed on a table. What number is that?",
    readAloudText: "7 tens and 5 ones.",
    hint: "70 plus 5 is 75.",
    options: [
      { id: "opt-3-9a", text: "75", isCorrect: true },
      { id: "opt-3-9b", text: "57", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-9c", text: "70", isCorrect: false, misconceptionTag: "omitted-ones" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-10",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "{kid} packed 3 bundles of 10 items and 8 loose items. Which two-digit number is that?",
    readAloudText: "3 tens and 8 ones.",
    hint: "30 plus 8 equals 38.",
    options: [
      { id: "opt-3-10a", text: "38", isCorrect: true },
      { id: "opt-3-10b", text: "83", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-10c", text: "11", isCorrect: false, misconceptionTag: "added-digits" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-11",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "{kid} compares collections. Which is greater: 5 bundles of 10 (50) or 2 bundles of 10 (20)?",
    readAloudText: "Which is greater, 50 or 20?",
    hint: "5 tens is more than 2 tens.",
    options: [
      { id: "opt-3-11a", text: "50 is greater", isCorrect: true },
      { id: "opt-3-11b", text: "20 is greater", isCorrect: false, misconceptionTag: "comparison-error" },
      { id: "opt-3-11c", text: "They are equal", isCorrect: false, misconceptionTag: "equality-error" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-12",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "8 bundles of 10 {theme_items} and 1 single item make what number?",
    readAloudText: "8 tens and 1 one.",
    hint: "80 plus 1 is 81.",
    options: [
      { id: "opt-3-12a", text: "81", isCorrect: true },
      { id: "opt-3-12b", text: "18", isCorrect: false, misconceptionTag: "reversed-digits" },
      { id: "opt-3-12c", text: "80", isCorrect: false, misconceptionTag: "omitted-ones" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-13",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "{kid} counts: the number 64 is made of 6 tens and how many ones?",
    readAloudText: "64 is 6 tens and how many ones?",
    hint: "Look at the second digit: 4.",
    options: [
      { id: "opt-3-13a", text: "4 ones", isCorrect: true },
      { id: "opt-3-13b", text: "6 ones", isCorrect: false, misconceptionTag: "tens-swap" },
      { id: "opt-3-13c", text: "10 ones", isCorrect: false, misconceptionTag: "random-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-14",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "{kid} stacked 9 bundles of 10 and 9 single loose items. What number is that?",
    readAloudText: "9 tens and 9 ones.",
    hint: "90 plus 9 is 99.",
    options: [
      { id: "opt-3-14a", text: "99", isCorrect: true },
      { id: "opt-3-14b", text: "90", isCorrect: false, misconceptionTag: "omitted-ones" },
      { id: "opt-3-14c", text: "18", isCorrect: false, misconceptionTag: "added-digits" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-3-15",
    skillId: "place-value-tens",
    tier: 3,
    promptTemplate: "Final challenge for Level 3: 10 full bundles of 10 {theme_items} combine to make what number?",
    readAloudText: "What is 10 tens?",
    hint: "10 bundles of 10 make 100!",
    options: [
      { id: "opt-3-15a", text: "100", isCorrect: true },
      { id: "opt-3-15b", text: "10", isCorrect: false, misconceptionTag: "zero-drop" },
      { id: "opt-3-15c", text: "90", isCorrect: false, misconceptionTag: "under-count" },
    ],
    type: "multiple-choice",
  },
];

export const LEVEL_4_QUESTIONS: Question[] = [
  {
    id: "q-math-4-1",
    skillId: "shapes-geometry",
    tier: 1,
    promptTemplate: "{kid} builds with blocks. How many straight sides does a triangle block have?",
    readAloudText: "How many sides on a triangle?",
    hint: "Tri means three! A triangle has 3 sides.",
    options: [
      { id: "opt-4-1a", text: "3 sides", isCorrect: true },
      { id: "opt-4-1b", text: "4 sides", isCorrect: false, misconceptionTag: "shape-side-slip" },
      { id: "opt-4-1c", text: "2 sides", isCorrect: false, misconceptionTag: "under-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-2",
    skillId: "shapes-geometry",
    tier: 1,
    promptTemplate: "{kid} asks: how many corners does a square tile have?",
    readAloudText: "Count the corners on a square.",
    hint: "A square has 4 corners and 4 equal sides.",
    options: [
      { id: "opt-4-2a", text: "4 corners", isCorrect: true },
      { id: "opt-4-2b", text: "3 corners", isCorrect: false, misconceptionTag: "triangle-confusion" },
      { id: "opt-4-2c", text: "5 corners", isCorrect: false, misconceptionTag: "over-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-3",
    skillId: "shapes-geometry",
    tier: 1,
    promptTemplate: "{kid} wonders: which friendly shape has 0 straight sides and 0 sharp corners?",
    readAloudText: "Which shape has no straight sides?",
    hint: "A circle is perfectly curved and round.",
    options: [
      { id: "opt-4-3a", text: "Circle", isCorrect: true },
      { id: "opt-4-3b", text: "Square", isCorrect: false, misconceptionTag: "straight-side-error" },
      { id: "opt-4-3c", text: "Triangle", isCorrect: false, misconceptionTag: "straight-side-error" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-4",
    skillId: "shapes-geometry",
    tier: 1,
    promptTemplate: "{kid} draws a door-shaped rectangle with 4 straight sides. How many corners does it have?",
    readAloudText: "How many corners on a rectangle?",
    hint: "Every 4-sided box has 4 corners.",
    options: [
      { id: "opt-4-4a", text: "4 corners", isCorrect: true },
      { id: "opt-4-4b", text: "3 corners", isCorrect: false, misconceptionTag: "triangle-confusion" },
      { id: "opt-4-4c", text: "6 corners", isCorrect: false, misconceptionTag: "over-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-5",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} stacks a pentagon building block. How many sides does it have?",
    readAloudText: "How many sides on a pentagon?",
    hint: "Penta means 5 sides.",
    options: [
      { id: "opt-4-5a", text: "5 sides", isCorrect: true },
      { id: "opt-4-5b", text: "6 sides", isCorrect: false, misconceptionTag: "hexagon-confusion" },
      { id: "opt-4-5c", text: "4 sides", isCorrect: false, misconceptionTag: "square-confusion" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-6",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} counts the faces. How many square faces make up a clean wooden cube box?",
    readAloudText: "Count the faces on a cube.",
    hint: "Think of playing dice: 1 through 6!",
    options: [
      { id: "opt-4-6a", text: "6 faces", isCorrect: true },
      { id: "opt-4-6b", text: "4 faces", isCorrect: false, misconceptionTag: "under-count" },
      { id: "opt-4-6c", text: "8 faces", isCorrect: false, misconceptionTag: "corners-vs-faces" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-7",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} inspects a honeycomb cell with 6 equal straight edges. What shape is it?",
    readAloudText: "A 6-sided shape is called what?",
    hint: "Hex means 6: it is a hexagon!",
    options: [
      { id: "opt-4-7a", text: "Hexagon", isCorrect: true },
      { id: "opt-4-7b", text: "Pentagon", isCorrect: false, misconceptionTag: "5-sides-slip" },
      { id: "opt-4-7c", text: "Octagon", isCorrect: false, misconceptionTag: "8-sides-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-8",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} asks: which curved shape looks like an unpeeled fossil egg or stretched circle?",
    readAloudText: "An egg-like shape is called an oval.",
    hint: "An oval is an elongated circle.",
    options: [
      { id: "opt-4-8a", text: "Oval", isCorrect: true },
      { id: "opt-4-8b", text: "Cylinder", isCorrect: false, misconceptionTag: "3d-confusion" },
      { id: "opt-4-8c", text: "Cube", isCorrect: false, misconceptionTag: "flat-vs-solid" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-9",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} folds a paper butterfly down the middle and both sides match perfectly. It has:",
    readAloudText: "When both sides match, what is that called?",
    hint: "Both sides mirror each other: symmetry!",
    options: [
      { id: "opt-4-9a", text: "Symmetry", isCorrect: true },
      { id: "opt-4-9b", text: "Angles", isCorrect: false, misconceptionTag: "term-slip" },
      { id: "opt-4-9c", text: "Fractions", isCorrect: false, misconceptionTag: "term-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-10",
    skillId: "shapes-geometry",
    tier: 2,
    promptTemplate: "{kid} reads a stop sign with 8 straight sides. What geometric shape is this?",
    readAloudText: "What shape has 8 sides?",
    hint: "Octo means 8 (like an octopus!): an octagon.",
    options: [
      { id: "opt-4-10a", text: "Octagon", isCorrect: true },
      { id: "opt-4-10b", text: "Hexagon", isCorrect: false, misconceptionTag: "6-sides-slip" },
      { id: "opt-4-10c", text: "Decagon", isCorrect: false, misconceptionTag: "10-sides-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-11",
    skillId: "shapes-geometry",
    tier: 3,
    promptTemplate: "{kid} measures a shape with 3 sharp corners and 3 straight sides. It is a:",
    readAloudText: "3 corners and 3 sides.",
    hint: "Any 3-sided shape is a triangle.",
    options: [
      { id: "opt-4-11a", text: "Triangle", isCorrect: true },
      { id: "opt-4-11b", text: "Square", isCorrect: false, misconceptionTag: "4-sides-confusion" },
      { id: "opt-4-11c", text: "Circle", isCorrect: false, misconceptionTag: "curves-confusion" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-12",
    skillId: "shapes-geometry",
    tier: 3,
    promptTemplate: "{kid} asks: how many right-angle (square) corners are inside a rectangle?",
    readAloudText: "Count the square corners in a rectangle.",
    hint: "All 4 corners of a rectangle are right angles.",
    options: [
      { id: "opt-4-12a", text: "4 square corners", isCorrect: true },
      { id: "opt-4-12b", text: "2 square corners", isCorrect: false, misconceptionTag: "under-count" },
      { id: "opt-4-12c", text: "6 square corners", isCorrect: false, misconceptionTag: "over-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-13",
    skillId: "shapes-geometry",
    tier: 3,
    promptTemplate: "{kid} examines a fossil cylinder tube. How many flat circular ends does it have?",
    readAloudText: "How many circle ends on a cylinder?",
    hint: "One circle at the top, one at the bottom: 2 ends.",
    options: [
      { id: "opt-4-13a", text: "2 circular ends", isCorrect: true },
      { id: "opt-4-13b", text: "1 circular end", isCorrect: false, misconceptionTag: "cone-confusion" },
      { id: "opt-4-13c", text: "3 circular ends", isCorrect: false, misconceptionTag: "over-count" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-14",
    skillId: "shapes-geometry",
    tier: 3,
    promptTemplate: "{kid} checks a rhombus (diamond shape). How many equal straight sides does it have?",
    readAloudText: "How many sides on a rhombus?",
    hint: "A diamond rhombus has 4 equal sides.",
    options: [
      { id: "opt-4-14a", text: "4 equal sides", isCorrect: true },
      { id: "opt-4-14b", text: "3 equal sides", isCorrect: false, misconceptionTag: "triangle-slip" },
      { id: "opt-4-14c", text: "5 equal sides", isCorrect: false, misconceptionTag: "pentagon-slip" },
    ],
    type: "multiple-choice",
  },
  {
    id: "q-math-4-15",
    skillId: "shapes-geometry",
    tier: 3,
    promptTemplate: "Final challenge for Level 4: {kid} puts two identical right-angled triangles together along their longest diagonal. What shape do they make?",
    readAloudText: "Two triangles joined together can make a rectangle.",
    hint: "Two triangles form a 4-sided rectangle or square!",
    options: [
      { id: "opt-4-15a", text: "A Rectangle", isCorrect: true },
      { id: "opt-4-15b", text: "A Circle", isCorrect: false, misconceptionTag: "curves-confusion" },
      { id: "opt-4-15c", text: "A Pentagon", isCorrect: false, misconceptionTag: "sides-confusion" },
    ],
    type: "multiple-choice",
  },
];

export const LEVEL_BANKS: Record<string, Question[]> = {
  s1: LEVEL_1_QUESTIONS,
  s2: LEVEL_2_QUESTIONS,
  s3: LEVEL_3_QUESTIONS,
  s4: LEVEL_4_QUESTIONS,
};

/**
 * Fingerprint of the committed lesson bank, reported by /api/health so a demo can
 * assert it is running the questions in this repo rather than a stale cache.
 * Derived from the content, so it changes whenever the bank does.
 */
export const LESSON_BANK_VERSION: string = (() => {
  const material = Object.entries(LEVEL_BANKS)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([level, qs]) => `${level}:${qs.length}:${qs.map((q) => q.id).join(",")}`)
    .join("|");
  // FNV-1a: short, stable, and dependency free.
  let hash = 0x811c9dc5;
  for (let i = 0; i < material.length; i++) {
    hash ^= material.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  const total = Object.values(LEVEL_BANKS).reduce((n, qs) => n + qs.length, 0);
  return `${total}-${hash.toString(16).padStart(8, "0")}`;
})();

/**
 * Human titles for each level, in one place so /learn, /start and the placement
 * summary all name a level the same way.
 */


/** Skill id behind each level, so a level can seed or schedule its own mastery. */
export const LEVEL_SKILL_IDS: Record<string, string> = {
  s1: "count-within-10",
  s2: "money-simple",
  s3: "place-value-tens",
  s4: "shapes-geometry",
};

/**
 * Skill id to title, for every skill in the bank. Used wherever a skill is named in
 * front of a child, so a skill is never shown as a raw id.
 */
export const SKILL_TITLES: Record<string, string> = {
  "count-within-10": "Counting to 10",
  "money-simple": "Money and Snacks",
  "place-value-tens": "Bundles of Ten",
  "shapes-geometry": "Shapes and Patterns",
};

/** Level id to title. Placement names a level, the learning path names the same levels. */
export const LEVEL_TITLES: Record<string, string> = {
  s1: "Counting and Stories",
  s2: "Money and Snacks",
  s3: "Bundles of Ten",
  s4: "Shapes and Patterns",
  r1: "First Sounds",
  r2: "Blending and Hearing Sounds",
  r3: "Sight Words and Rhyme",
  r4: "Syllables and Sentences",
};

/**
 * Questions for a level, maths or reading. Reading levels (r1 to r4) live in their own
 * bank so a child who moves from counting to reading keeps the same lesson player.
 */
export function getQuestionsForLevel(levelId: string): Question[] {
  return LEVEL_BANKS[levelId] || READING_BANKS[levelId] || LEVEL_1_QUESTIONS;
}

/** True when the level is a reading level rather than a maths one. */
export function isReadingLevel(levelId: string): boolean {
  return Boolean(READING_BANKS[levelId]);
}

export const SAMPLE_MATH_QUESTIONS: Question[] = LEVEL_1_QUESTIONS;

export const SAMPLE_SKILL: Skill = {
  id: "addition-foundations",
  subject: "maths",
  title: "Addition & Number Stories",
  description: "Count, combine and discover sums with friendly story themes.",
  gradeBand: "A",
  prerequisites: [],
  pInit: 0.20,
  pLearn: 0.25,
  pSlip: 0.10,
  pGuess: 0.20,
  questions: LEVEL_1_QUESTIONS,
};
