/**
 * Reading and phonics skills (features.md B1, SPEC.md 6.3 priority 2).
 *
 * Read aloud is the whole point here, so every question carries real read aloud text and
 * a hint a child can act on. Each skill has at least three questions across the three
 * tiers, and the same five question types the maths bank uses.
 *
 * Never ship an empty subject (SPEC 6.3): these are full skills with content, not
 * placeholders. tests/content.test.mjs proves every skill has enough to teach.
 */

import { type Question, type Skill } from "./content-schema";

/** Slot names the reading questions use, all filled by renderQuestion. */
export const READING_THEME_ID = "reading";

interface Seed {
  id: string;
  skillId: string;
  tier: 1 | 2 | 3;
  prompt: string;
  readAloud: string;
  hint: string;
  options: [string, string, string];
  answer: 0 | 1 | 2;
  type?: Question["type"];
}

function make(seed: Seed): Question {
  return {
    id: seed.id,
    skillId: seed.skillId,
    tier: seed.tier,
    promptTemplate: seed.prompt,
    readAloudText: seed.readAloud,
    hint: seed.hint,
    options: seed.options.map((text, i) => ({
      id: `${seed.id}-o${i + 1}`,
      text,
      isCorrect: i === seed.answer,
      ...(i === seed.answer ? {} : { misconceptionTag: seed.tier === 1 ? "sound-matching" : "blend-error" }),
    })),
    type: seed.type ?? "multiple-choice",
  };
}

// ---------------------------------------------------------------------------
// Letter sounds
// ---------------------------------------------------------------------------
const LETTER_SOUNDS: Seed[] = [
  { id: "q-read-1-1", skillId: "letter-s-sound", tier: 1,
    prompt: "Which word begins with the sound you hear: sss like a snake?",
    readAloud: "Which word begins with the sound sss, like a snake?",
    hint: "The snake sound is sss. Find the word that starts with s.",
    options: ["sun", "moon", "hat"], answer: 0 },
  { id: "q-read-1-2", skillId: "letter-s-sound", tier: 2,
    prompt: "Listen for the sh sound. Which word has sh at the start?",
    readAloud: "Listen for the sh sound. Which word has sh at the start?",
    hint: "Sh is two letters together: s and h.",
    options: ["ship", "sip", "hip"], answer: 0 },
  { id: "q-read-1-3", skillId: "letter-s-sound", tier: 3,
    prompt: "Which word has the sh sound in the middle?",
    readAloud: "Which word has the sh sound in the middle?",
    hint: "Look inside the word, not at the beginning.",
    options: ["fishing", "finsing", "fissing"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Blending two sounds
// ---------------------------------------------------------------------------
const BLENDING: Seed[] = [
  { id: "q-read-2-1", skillId: "blend-two-sounds", tier: 1,
    prompt: "Blend the sounds: a, t, at. Which word did you make?",
    readAloud: "Blend the sounds a, t, at. Which word did you make?",
    hint: "Say a, then t, then run them together fast.",
    options: ["at", "ta", "it"], answer: 0 },
  { id: "q-read-2-2", skillId: "blend-two-sounds", tier: 2,
    prompt: "Blend the sounds: sh, op, shop.",
    readAloud: "Blend the sounds sh, op, shop.",
    hint: "Keep the sh sound together and add op.",
    options: ["shop", "shap", "sop"], answer: 0 },
  { id: "q-read-2-3", skillId: "blend-two-sounds", tier: 3,
    prompt: "Blend three sounds: c, a, t. Which word is it?",
    readAloud: "Blend three sounds: c, a, t. Which word is it?",
    hint: "Three sounds, blended without a gap.",
    options: ["cat", "act", "cut"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Segmenting a word back into sounds
// ---------------------------------------------------------------------------
const SEGMENTING: Seed[] = [
  { id: "q-read-3-1", skillId: "segment-a-word", tier: 1,
    prompt: "How many sounds are in the word sun?",
    readAloud: "How many sounds are in the word sun?",
    hint: "Stretch it slowly: s, u, n.",
    options: ["3", "2", "4"], answer: 0 },
  { id: "q-read-3-2", skillId: "segment-a-word", tier: 2,
    prompt: "Which word has three sounds?",
    readAloud: "Which word has three sounds?",
    hint: "Say each sound on its own and count them.",
    options: ["ship", "hi", "you"], answer: 0 },
  { id: "q-read-3-3", skillId: "segment-a-word", tier: 3,
    prompt: "How many sounds are in the word fish?",
    readAloud: "How many sounds are in the word fish?",
    hint: "Remember that sh is one sound, not two.",
    options: ["3", "4", "2"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Sight words a child should know without sounding out
// ---------------------------------------------------------------------------
const SIGHT_WORDS: Seed[] = [
  { id: "q-read-4-1", skillId: "sight-word-the", tier: 1,
    prompt: "Which word is the, the word we use all the time?",
    readAloud: "Which word is the, the word we use all the time?",
    hint: "It is only three letters and starts with th.",
    options: ["the", "they", "then"], answer: 0 },
  { id: "q-read-4-2", skillId: "sight-word-the", tier: 2,
    prompt: "Read the word you already know: was",
    readAloud: "Read the word you already know: was",
    hint: "Say it straight through without breaking it.",
    options: ["was", "waz", "wa"], answer: 0 },
  { id: "q-read-4-3", skillId: "sight-word-the", tier: 3,
    prompt: "Which sentence uses the sight word correctly?",
    readAloud: "Which sentence uses the sight word correctly?",
    hint: "The word goes in the gap, and it says the.",
    options: ["I can see the bird.", "I can see bird the.", "I can the see bird."], answer: 0 },
];

// ---------------------------------------------------------------------------
// Rhyme
// ---------------------------------------------------------------------------
const RHYME: Seed[] = [
  { id: "q-read-5-1", skillId: "rhyming-words", tier: 1,
    prompt: "Which word rhymes with cat?",
    readAloud: "Which word rhymes with cat?",
    hint: "The last sound is the same.",
    options: ["hat", "dog", "sun"], answer: 0 },
  { id: "q-read-5-2", skillId: "rhyming-words", tier: 2,
    prompt: "Which word rhymes with ship?",
    readAloud: "Which word rhymes with ship?",
    hint: "It ends in the same ip sound.",
    options: ["lip", "log", "hat"], answer: 0 },
  { id: "q-read-5-3", skillId: "rhyming-words", tier: 3,
    prompt: "Which pair of words rhymes?",
    readAloud: "Which pair of words rhymes?",
    hint: "Check the very end of both words.",
    options: ["moon and soon", "moon and dog", "moon and cat"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Syllables
// ---------------------------------------------------------------------------
const SYLLABLES: Seed[] = [
  { id: "q-read-6-1", skillId: "syllables", tier: 1,
    prompt: "How many syllables are in cat?",
    readAloud: "How many syllables are in cat?",
    hint: "Clap once for each beat.",
    options: ["1", "2", "3"], answer: 0 },
  { id: "q-read-6-2", skillId: "syllables", tier: 2,
    prompt: "How many syllables are in banana?",
    readAloud: "How many syllables are in banana?",
    hint: "ba, na, na. Count them.",
    options: ["3", "2", "4"], answer: 0 },
  { id: "q-read-6-3", skillId: "syllables", tier: 3,
    prompt: "Which word has two syllables?",
    readAloud: "Which word has two syllables?",
    hint: "Clap as you read it.",
    options: ["happy", "cat", "sun"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Vocabulary in context
// ---------------------------------------------------------------------------
const VOCABULARY: Seed[] = [
  { id: "q-read-7-1", skillId: "word-meaning", tier: 1,
    prompt: "Moyin was thirsty. What should Moyin drink?",
    readAloud: "Moyin was thirsty. What should Moyin drink?",
    hint: "Thirsty means you want a drink.",
    options: ["water", "a chair", "a book"], answer: 0 },
  { id: "q-read-7-2", skillId: "word-meaning", tier: 2,
    prompt: "The opposite of fast is what?",
    readAloud: "The opposite of fast is what?",
    hint: "Think of a slow animal.",
    options: ["slow", "quick", "bouncy"], answer: 0 },
  { id: "q-read-7-3", skillId: "word-meaning", tier: 3,
    prompt: "Which word means something you can eat?",
    readAloud: "Which word means something you can eat?",
    hint: "One of these is food.",
    options: ["bread", "stone", "cloud"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Reading a short sentence for meaning
// ---------------------------------------------------------------------------
const COMPREHENSION: Seed[] = [
  { id: "q-read-8-1", skillId: "read-a-sentence", tier: 1,
    prompt: "Read it: The cat sat on the mat. What was sitting?",
    readAloud: "Read it: The cat sat on the mat. What was sitting?",
    hint: "Look for the word that names an animal.",
    options: ["the cat", "the mat", "the sat"], answer: 0 },
  { id: "q-read-8-2", skillId: "read-a-sentence", tier: 2,
    prompt: "Read it: Amina has two red balls. How many balls?",
    readAloud: "Read it: Amina has two red balls. How many balls?",
    hint: "The sentence tells you how many.",
    options: ["2", "1", "3"], answer: 0 },
  { id: "q-read-8-3", skillId: "read-a-sentence", tier: 3,
    prompt: "Read it: Moyin was cold, so he put on his scarf. Why did he put it on?",
    readAloud: "Read it: Moyin was cold, so he put on his scarf. Why did he put it on?",
    hint: "The first word explains the reason.",
    options: ["Because he was cold", "Because he was hungry", "Because it was fun"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Alphabet order
// ---------------------------------------------------------------------------
const ALPHABET: Seed[] = [
  { id: "q-read-9-1", skillId: "alphabet-order", tier: 1,
    prompt: "Which letter comes after b?",
    readAloud: "Which letter comes after b?",
    hint: "Say the alphabet slowly and listen.",
    options: ["c", "a", "d"], answer: 0 },
  { id: "q-read-9-2", skillId: "alphabet-order", tier: 2,
    prompt: "Which letter comes before m?",
    readAloud: "Which letter comes before m?",
    hint: "It is the one just before m.",
    options: ["l", "n", "k"], answer: 0 },
  { id: "q-read-9-3", skillId: "alphabet-order", tier: 3,
    prompt: "Which letter is in the middle of the word cat?",
    readAloud: "Which letter is in the middle of the word cat?",
    hint: "c, a, t. The middle one is the answer.",
    options: ["a", "c", "t"], answer: 0 },
];

// ---------------------------------------------------------------------------
// Reading fluency with a familiar pattern
// ---------------------------------------------------------------------------
const FLUENCY: Seed[] = [
  { id: "q-read-10-1", skillId: "reading-fluency", tier: 1,
    prompt: "Read the pattern out loud: a, a, a, a, ?",
    readAloud: "Read the pattern out loud: a, a, a, a, what comes next?",
    hint: "The pattern repeats.",
    options: ["a", "b", "c"], answer: 0 },
  { id: "q-read-10-2", skillId: "reading-fluency", tier: 2,
    prompt: "Read the pattern: cat, cat, dog, cat, cat, ?",
    readAloud: "Read the pattern: cat, cat, dog, cat, cat, what comes next?",
    hint: "Every third word is the odd one.",
    options: ["dog", "cat", "sun"], answer: 0 },
  { id: "q-read-10-3", skillId: "reading-fluency", tier: 3,
    prompt: "Read it smoothly: The little bird sang a happy song.",
    readAloud: "Read it smoothly: The little bird sang a happy song.",
    hint: "Read the whole sentence in one breath.",
    options: ["The little bird sang a happy song.", "Little the sang bird happy song.", "Song happy a sang bird little the."], answer: 0 },
];

export const READING_QUESTIONS: Question[] = [
  ...LETTER_SOUNDS, ...BLENDING, ...SEGMENTING, ...SIGHT_WORDS, ...RHYME,
  ...SYLLABLES, ...VOCABULARY, ...COMPREHENSION, ...ALPHABET, ...FLUENCY,
].map(make);

/** Reading levels, mirroring the maths s1 to s4 shape so /learn needs no new branch. */
export const READING_BANKS: Record<string, Question[]> = {
  r1: READING_QUESTIONS.filter((q) => LETTER_SOUNDS.some((s) => s.id === q.id)),
  r2: READING_QUESTIONS.filter((q) => BLENDING.some((s) => s.id === q.id) || SEGMENTING.some((s) => s.id === q.id)),
  r3: READING_QUESTIONS.filter((q) => SIGHT_WORDS.some((s) => s.id === q.id) || RHYME.some((s) => s.id === q.id)),
  r4: READING_QUESTIONS.filter((q) =>
    SYLLABLES.some((s) => s.id === q.id) || VOCABULARY.some((s) => s.id === q.id) ||
    COMPREHENSION.some((s) => s.id === q.id) || ALPHABET.some((s) => s.id === q.id) ||
    FLUENCY.some((s) => s.id === q.id)),
};

export const READING_SKILLS: Skill[] = [
  { id: "letter-s-sound", subject: "reading", title: "Letter Sounds", description: "Hear a sound and find the word that starts with it.", gradeBand: "A", prerequisites: [], pInit: 0.15, pLearn: 0.25, pSlip: 0.10, pGuess: 0.22, questions: LETTER_SOUNDS.map(make) },
  { id: "blend-two-sounds", subject: "reading", title: "Blending Sounds", description: "Put two or three sounds together to make a word.", gradeBand: "A", prerequisites: ["letter-s-sound"], pInit: 0.15, pLearn: 0.25, pSlip: 0.10, pGuess: 0.22, questions: BLENDING.map(make) },
  { id: "segment-a-word", subject: "reading", title: "Hearing Sounds in Words", description: "Take a word apart into its sounds.", gradeBand: "A", prerequisites: ["blend-two-sounds"], pInit: 0.15, pLearn: 0.25, pSlip: 0.10, pGuess: 0.22, questions: SEGMENTING.map(make) },
  { id: "sight-word-the", subject: "reading", title: "First Sight Words", description: "Know common words without sounding them out.", gradeBand: "A", prerequisites: ["blend-two-sounds"], pInit: 0.18, pLearn: 0.25, pSlip: 0.10, pGuess: 0.25, questions: SIGHT_WORDS.map(make) },
  { id: "rhyming-words", subject: "reading", title: "Rhyming Words", description: "Spot words that end with the same sound.", gradeBand: "A", prerequisites: ["letter-s-sound"], pInit: 0.15, pLearn: 0.25, pSlip: 0.10, pGuess: 0.22, questions: RHYME.map(make) },
  { id: "syllables", subject: "reading", title: "Syllables", description: "Hear the beats inside a word.", gradeBand: "B", prerequisites: ["segment-a-word"], pInit: 0.15, pLearn: 0.22, pSlip: 0.10, pGuess: 0.22, questions: SYLLABLES.map(make) },
  { id: "word-meaning", subject: "reading", title: "Words and What They Mean", description: "Work out what a word means from the sentence.", gradeBand: "B", prerequisites: ["sight-word-the"], pInit: 0.15, pLearn: 0.22, pSlip: 0.10, pGuess: 0.22, questions: VOCABULARY.map(make) },
  { id: "read-a-sentence", subject: "reading", title: "Reading a Sentence", description: "Read a short sentence and answer about it.", gradeBand: "B", prerequisites: ["sight-word-the", "word-meaning"], pInit: 0.15, pLearn: 0.22, pSlip: 0.10, pGuess: 0.25, questions: COMPREHENSION.map(make) },
  { id: "alphabet-order", subject: "reading", title: "Alphabet Order", description: "Know which letter comes next and before.", gradeBand: "A", prerequisites: [], pInit: 0.18, pLearn: 0.25, pSlip: 0.08, pGuess: 0.25, questions: ALPHABET.map(make) },
  { id: "reading-fluency", subject: "reading", title: "Reading Smoothly", description: "Read patterns and sentences in one go.", gradeBand: "B", prerequisites: ["read-a-sentence", "syllables"], pInit: 0.12, pLearn: 0.22, pSlip: 0.10, pGuess: 0.25, questions: FLUENCY.map(make) },
];

/** Every reading question in one flat list, for validation and the content report. */
export const ALL_READING_QUESTIONS: Question[] = READING_SKILLS.flatMap((skill) => skill.questions);
