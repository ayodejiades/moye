"use client";

export type VoiceLanguage = "en" | "pcm" | "yo" | "ha" | "ig" | "sw";

export interface LanguageVoiceInfo {
  id: VoiceLanguage;
  label: string;
  nativeLabel: string;
  bcp47: string;
  sampleGreeting: string;
  region: string;
}

export const SUPPORTED_VOICE_LANGUAGES: LanguageVoiceInfo[] = [
  {
    id: "en",
    label: "English",
    nativeLabel: "English",
    bcp47: "en-US",
    sampleGreeting: "Hello! I am Moyin the honey badger. Let us learn together.",
    region: "Global and West Africa",
  },
  {
    id: "pcm",
    label: "Nigerian Pidgin",
    nativeLabel: "Naija Pidgin",
    bcp47: "en-NG",
    sampleGreeting: "How far! I be Moyin the honey badger. Make we learn together today.",
    region: "Nigeria and West Africa",
  },
  {
    id: "yo",
    label: "Yoruba",
    nativeLabel: "Ede Yoruba",
    bcp47: "yo-NG",
    sampleGreeting: "Bawo ni! Emi ni Moyin omo ooni oyin. E je ki a ko eko papo.",
    region: "Southwest Nigeria and Diaspora",
  },
  {
    id: "ha",
    label: "Hausa",
    nativeLabel: "Harshen Hausa",
    bcp47: "ha-NG",
    sampleGreeting: "Sannu! Ni ne Moyin dabbar zuma. Mu koya tare a yau.",
    region: "Northern Nigeria and West Africa",
  },
  {
    id: "ig",
    label: "Igbo",
    nativeLabel: "Asusu Igbo",
    bcp47: "ig-NG",
    sampleGreeting: "Ndewo! Abum Moyin nwa badger mmanụ aṅụ. Ka anyi mụọ ihe ọnụ.",
    region: "Southeast Nigeria and Diaspora",
  },
  {
    id: "sw",
    label: "Swahili",
    nativeLabel: "Kiswahili",
    bcp47: "sw-KE",
    sampleGreeting: "Hujambo! Mimi ni Moyin kicheche wa asali. Tushirikiane kujifunza pamoja leo.",
    region: "East and Central Africa",
  },
];

/** Encouragement and feedback phrases across languages */
export const LOCALIZED_ENCOURAGEMENTS: Record<
  VoiceLanguage,
  {
    correct: string[];
    retry: string[];
    hintIntro: string;
    companionWelcome: string;
    doneForToday: string;
  }
> = {
  en: {
    correct: [
      "Well done! You solved it calmly.",
      "Nice thinking! That is correct.",
      "Sweet success! You earned golden honey.",
      "Wonderful effort! Your spark is bright.",
    ],
    retry: [
      "Almost there! Let us look again together.",
      "Take your time, zero rush here.",
      "Good try! Here is a helpful hint for you.",
    ],
    hintIntro: "Here is a gentle hint:",
    companionWelcome: "Take all the time you need. I am right here beside you.",
    doneForToday: "Great learning today! Time to rest your warm spark.",
  },
  pcm: {
    correct: [
      "You sharp well well! Correct answer.",
      "Better thinking! You get am right.",
      "Sweet honey don land! You do well.",
      "Correct work! Your spark dey shine.",
    ],
    retry: [
      "Small small! Make we look am again together.",
      "No shaking, take your time calmly.",
      "You try well! Look this small clue.",
    ],
    hintIntro: "Look this gentle clue:",
    companionWelcome: "Take your time well well. I dey right here beside you.",
    doneForToday: "You try today! Make you rest your spark now.",
  },
  yo: {
    correct: [
      "O kare! O ronu daradara.",
      "O gba a wole! Eko re dun pupo.",
      "Oyinsanwo! O gba oyin daradara.",
      "Ise takuntakun! Ina re n tan.",
    ],
    retry: [
      "O feran de be! E je ki a tun wo papo.",
      "Rora se e, ko si iwariri rara.",
      "O gbiyanju! Wo iranlowo kekere yii.",
    ],
    hintIntro: "Wo iranlowo kekere yii:",
    companionWelcome: "Fi ifokanbale ko eko. Emi wa legbee re nibi.",
    doneForToday: "O se ise takuntakun loni! Akoko lati sinmi.",
  },
  ha: {
    correct: [
      "Madalla! Ka yi tunani mai kyau.",
      "Kwarai kuwa! Amsar daidai ce.",
      "Zuma mai dadi! Ka sami lada mai kyau.",
      "Aiki mai kyau! Haskenka yana haskakawa.",
    ],
    retry: [
      "Kusan ka samu! Bari mu sake duba tare.",
      "Bi a hankali, babu gaggawa ko kadan.",
      "Ka yi qoqari! Ga wata shawara mai taimako.",
    ],
    hintIntro: "Ga wata shawara mai taimako:",
    companionWelcome: "Yi lissafi cikin natsuwa. Ina nan tare da kai.",
    doneForToday: "An yi aiki mai kyau yau! Lokaci ya yi da za a huta.",
  },
  ig: {
    correct: [
      "I mere nke oma! I chere echiche nke oma.",
      "O zuru oke! Azịza gi ziri ezi.",
      "Mmanụ aṅụ dị ụtọ! I nwetara ụgwọ ọrụ.",
      "Ezigbo mbọ! Ọkụ gị na enwu nke ọma.",
    ],
    retry: [
      "O fọrọ obere! Ka anyi leba anya ozo.",
      "Jiri nwayọọ, enweghị ọsọ ọ bụla ebe a.",
      "I gbalịrị! Lee obere aka na enyere aka.",
    ],
    hintIntro: "Lee obere ndụmọdụ:",
    companionWelcome: "Jiri nwayọọ mụọ ihe. Anọ m n'akụkụ gị.",
    doneForToday: "I mere nke ọma taa! Oge eruola izu ike.",
  },
  sw: {
    correct: [
      "Umefanya vizuri sana! Umefikiri kwa utulivu.",
      "Jibu sahihi kabisa! Umefaulu vizuri.",
      "Asali tamu imepatikana! Umepata zawadi nzuri.",
      "Kazi nzuri ajabu! Mwanga wako unang'aa.",
    ],
    retry: [
      "Uko karibu sana! Hebu tutazame tena pamoja.",
      "Chukua muda wako, hakuna haraka hapa.",
      "Umejaribu vizuri! Hapa kuna dokezo dogo la kukusaidia.",
    ],
    hintIntro: "Hapa kuna dokezo la upole:",
    companionWelcome: "Chukua muda wote unaohitaji. Nipo hapa kando yako.",
    doneForToday: "Umefanya vizuri sana leo! Ni wakati wa kupumzika.",
  },
};

/** Multilingual translations for question prompts and hints */
export const QUESTION_LOCALIZATIONS: Record<
  string,
  Partial<Record<VoiceLanguage, { prompt: string; hint: string; readAloud: string }>>
> = {
  "q-math-1": {
    pcm: {
      prompt: "Rex find 4 fossil stones for morning and 2 more for afternoon. How many stones altogether?",
      hint: "Start from 4, count 2 more: 5, 6!",
      readAloud: "Four plus two na how many stones altogether?",
    },
    yo: {
      prompt: "Rex ri okuta fossil 4 ni aro ati 2 sii ni osan. Eelo ni okuta lapapo?",
      hint: "Bere lati 4, ka meji sii: 5, 6!",
      readAloud: "Merin pelu meji je melo ni lapapo?",
    },
    ha: {
      prompt: "Rex ya sami duwatsu 4 da safe da 2 da rana. Duwatsu nawa gaba daya?",
      hint: "Fara daga 4, qara 2: 5, 6!",
      readAloud: "Hudu da biyu duwatsu nawa ne gaba daya?",
    },
    ig: {
      prompt: "Rex hụrụ okwute 4 n'ụtụtụ na 2 ọzọ n'ehihie. Okwute ole ka ọ bụ na mkpokọta?",
      hint: "Bido na 4, gụọ abụọ ọzọ: 5, 6!",
      readAloud: "Anọ tinyere abụọ bụ okwute ole na mkpokọta?",
    },
    sw: {
      prompt: "Rex amepata mawe 4 ya kisukuku asubuhi na mengine 2 mchana. Je, kuna mawe mangapi kwa ujumla?",
      hint: "Anzia 4, hesabu mengine 2: 5, 6!",
      readAloud: "Nne jumlisha mbili ni mawe mangapi kwa ujumla?",
    },
  },
  "q-math-1-2": {
    pcm: {
      prompt: "Rex get 3 fossil stones inside nest and find 3 more for road. How many stones now?",
      hint: "Double of 3 na 6!",
      readAloud: "Count 3 plus 3 items.",
    },
    yo: {
      prompt: "Rex ni okuta 3 ninu ite, o si tun ri 3 sii lori ona. Eelo ni okuta re nisisiyi?",
      hint: "Imeji 3 je 6!",
      readAloud: "Ka meta pelu meta lapapo.",
    },
    ha: {
      prompt: "Rex yana da duwatsu 3 a cikin sheqa, ya kuma sami 3 a kan hanya. Duwatsu nawa yanzu?",
      hint: "Ninkin 3 shine 6!",
      readAloud: "Qidaya 3 da 3 tare.",
    },
    ig: {
      prompt: "Rex nwere okwute 3 n'akwụkwọ ya, wee chọta 3 ọzọ n'ụzọ. Okwute ole ka o nwere ugbu a?",
      hint: "Abụọ nke 3 bụ 6!",
      readAloud: "Gụọ atọ tinyere atọ.",
    },
    sw: {
      prompt: "Rex ana mawe 3 ya kisukuku ndani ya kiota, kisha akapata mengine 3 njiani. Je, ana mawe mangapi sasa?",
      hint: "Maradufu ya 3 ni 6!",
      readAloud: "Hesabu vitu vitatu jumlisha vitatu.",
    },
  },
  "q-math-1-3": {
    pcm: {
      prompt: "Five fossil stones dey near water and two dey for grass. How many altogether?",
      hint: "Count up from 5: 6, 7!",
      readAloud: "Add 5 and 2.",
    },
    yo: {
      prompt: "Okuta 5 wa legbee odo ati 2 lori koriko. Melo ni lapapo?",
      hint: "Ka lati 5 lo: 6, 7!",
      readAloud: "Se aropo marun ati meji.",
    },
    ha: {
      prompt: "Akwai duwatsu 5 kusa da kogi da 2 a kan ciyawa. Nawa ne jimilla?",
      hint: "Qidaya daga 5: 6, 7!",
      readAloud: "Hada 5 da 2 tare.",
    },
    ig: {
      prompt: "Okwute 5 dị nso na mmiri na 2 n'elu ahịhịa. Ole ka ha dị na mkpokọta?",
      hint: "Gụọ bido na 5: 6, 7!",
      readAloud: "Tinye 5 na 2 ọnụ.",
    },
    sw: {
      prompt: "Mawe matano ya kisukuku yapo karibu na maji na mawili yapo kwenye nyasi. Je, kuna mangapi kwa ujumla?",
      hint: "Hesabu kuanzia 5: 6, 7!",
      readAloud: "Jumlisha 5 na 2.",
    },
  },
  "q-math-1-4": {
    pcm: {
      prompt: "Moyin see 6 fossil stones for line, then 3 more fly come down. How many dey altogether?",
      hint: "Start from 6: 7, 8, 9!",
      readAloud: "Six plus three na how many?",
    },
    yo: {
      prompt: "Moyin ri okuta 6 ni ila kan, 3 sii fo wa si ile. Melo ni gbogbo re lapapo?",
      hint: "Bere lati 6: 7, 8, 9!",
      readAloud: "Melo ni mefa pelu meta?",
    },
    ha: {
      prompt: "Moyin ya ga duwatsu 6 a jere, sannan 3 suka sauko. Nawa ne gaba daya?",
      hint: "Fara daga 6: 7, 8, 9!",
      readAloud: "Shida da uku nawa ne?",
    },
    ig: {
      prompt: "Moyin hụrụ okwute 6 n'ahịrị, mgbe ahụ 3 ọzọ fekwasịrị. Ole ka ha dị ugbu a?",
      hint: "Bido na 6: 7, 8, 9!",
      readAloud: "Isii tinyere atọ bụ ole?",
    },
    sw: {
      prompt: "Moyin ameona mawe 6 ya kisukuku mstarini, kisha mengine 3 yakatua. Je, yako mangapi kwa ujumla sasa?",
      hint: "Anzia 6: 7, 8, 9!",
      readAloud: "Sita jumlisha tatu ni ngapi?",
    },
  },
};

/** Fallback Pidgin wrapper for questions without a hand-written entry.
 *  Only used when QUESTION_LOCALIZATIONS has no row for the question id,
 *  so later Level 1 items and Levels 2-4 still sound like Pidgin instead
 *  of silently dropping back to English. */
const PIDGIN_NUMBER_WORDS: Record<string, string> = {
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "10": "ten",
};

function pidginizeSentence(sentence: string): string {
  let out = sentence;
  // "How many X altogether / in total / now / in all ..." -> Pidgin tail
  out = out.replace(/How many (.+?) (altogether|in total|now|in all)\?/i, "How many $1 dey altogether?");
  // "What is the sum / total count ..." -> Pidgin tail
  out = out.replace(/What is the (sum|total count)\?/i, "Wetin be di total?");
  // "How many ... does X have?" -> Pidgin tail
  out = out.replace(/How many (.+?) does (.+?) have\?/i, "How many $1 $2 get?");
  return out;
}

function buildPidginFallback(defaults: { prompt: string; hint: string; readAloud: string }): {
  prompt: string;
  hint: string;
  readAloud: string;
} {
  const prompt = pidginizeSentence(defaults.prompt);
  const hint = defaults.hint
    .replace(/^Start (with|at|from) /i, "Start from ")
    .replace(/Count up from/i, "Count from");
  const numbers = Array.from(defaults.readAloud.matchAll(/\d+/g)).map((m) => m[0]);
  const readAloud =
    numbers.length >= 2
      ? `${PIDGIN_NUMBER_WORDS[numbers[0]] ?? numbers[0]} plus ${PIDGIN_NUMBER_WORDS[numbers[1]] ?? numbers[1]} na how many?`
      : defaults.readAloud;
  return { prompt, hint, readAloud };
}

/** Get localized prompt, hint, and read aloud text for a question */
export function getLocalizedQuestionContent(
  questionId: string,
  language: VoiceLanguage,
  defaults: { prompt: string; hint: string; readAloud: string }
): { prompt: string; hint: string; readAloud: string } {
  if (language === "en") return defaults;
  const qMap = QUESTION_LOCALIZATIONS[questionId];
  if (qMap && qMap[language]) {
    const loc = qMap[language]!;
    return {
      prompt: loc.prompt || defaults.prompt,
      hint: loc.hint || defaults.hint,
      readAloud: loc.readAloud || defaults.readAloud,
    };
  }
  // Deterministic Pidgin fallback: hand-written rows only cover q-math-1
  // through q-math-1-4, so anything else still gets a Pidgin flavour.
  if (language === "pcm") return buildPidginFallback(defaults);
  return defaults;
}

/** Get random encouraging phrase in the selected language */
export function getEncouragementPhrase(
  type: "correct" | "retry",
  language: VoiceLanguage,
  seedIndex: number = 0
): string {
  const list = LOCALIZED_ENCOURAGEMENTS[language]?.[type] || LOCALIZED_ENCOURAGEMENTS.en[type];
  const idx = Math.abs(seedIndex) % list.length;
  return list[idx];
}

/** Resolves the best available voice in the browser for the target language */
export function resolveSpeechVoice(
  language: VoiceLanguage,
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const info = SUPPORTED_VOICE_LANGUAGES.find((l) => l.id === language);
  if (!info) return null;

  // Exact BCP47 match
  const exact = voices.find((v) => v.lang.toLowerCase() === info.bcp47.toLowerCase());
  if (exact) return exact;

  // For Nigerian Pidgin, match en-NG or African English voice FIRST, because
  // the generic "pcm" prefix below would never match any real browser
  // voice, so an en-NG voice must win before falling to plain English.
  if (language === "pcm") {
    const naijaVoice = voices.find(
      (v) => v.lang.toLowerCase() === "en-ng" || v.name.toLowerCase().includes("nigeria")
    );
    if (naijaVoice) return naijaVoice;
  }

  // Language prefix match (e.g. yo, ha, ig, sw, en).
  // NOTE: pcm deliberately has no prefix branch because no browser ships a
  // "pcm-*" voice, so it must fall through to the en-NG lookup above
  // or the English fallback below instead of matching garbage.
  if (language !== "pcm") {
    const prefix = voices.find((v) => v.lang.toLowerCase().startsWith(info.id));
    if (prefix) return prefix;
  }

  // Fallback to high quality English voice
  return (
    voices.find((v) => v.lang.startsWith("en") && !v.name.includes("Bad")) ||
    voices[0] ||
    null
  );
}

export function getVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }
  const synth = window.speechSynthesis;
  const current = synth.getVoices();
  if (current && current.length > 0) return Promise.resolve(current);
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(synth.getVoices());
    };
    // voiceschanged fires once the OS voices finish loading (Chrome/Safari).
    synth.onvoiceschanged = finish;
    // Safety net: never hang longer than ~1.2s.
    window.setTimeout(finish, 1200);
  });
}
/**
 * Chrome can garbage collect an utterance that nothing references while it is still being
 * spoken. The speech stops partway through a sentence and onend never fires. Holding the
 * utterance here until it finishes keeps read aloud from cutting off.
 */
const liveUtterances = new Set<SpeechSynthesisUtterance>();
export function retainUtterance(u: SpeechSynthesisUtterance): void {
  liveUtterances.add(u);
  const release = () => { liveUtterances.delete(u); };
  u.addEventListener("end", release);
  u.addEventListener("error", release);
}

/** Executes SpeechSynthesis with language tags, pitch, and voice matching */
export function speakMultilingualText(
  text: string,
  language: VoiceLanguage = "en",
  speed: number = 1.0,
  callbacks?: {
    onWordBoundary?: (charIndex: number, charLength: number) => void;
    onEnd?: () => void;
    onError?: (info?: { retriedWithEnglish: boolean }) => void;
  }
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    callbacks?.onError?.();
    return;
  }

  const synth = window.speechSynthesis;

  const queueUtterance = (voices: SpeechSynthesisVoice[], retryingAsEnglish: boolean): void => {
    synth.cancel();
    const info = SUPPORTED_VOICE_LANGUAGES.find((l) => l.id === language) || SUPPORTED_VOICE_LANGUAGES[0];
    const speakable = text.replace(/₦/g, "Naira ");
    const utterance = new SpeechSynthesisUtterance(speakable);

    // Bind the utterance language to the voice that was actually picked.
    // Before this fix, utterance.lang stayed "en-NG" for Pidgin while
    // utterance.voice was an en-US voice, and Chrome resolves that mismatch
    // by silently dropping or mis-pronouncing the utterance, which is why
    // Pidgin read-aloud sounded broken even though the text was correct.
    const matchedVoice = resolveSpeechVoice(language, voices);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang || info.bcp47;
    } else {
      utterance.lang = info.bcp47;
    }
    utterance.rate = Math.max(0.7, Math.min(1.4, speed));

    // Natural warm pitch adjustment per dialect
    if (language === "yo") {
      utterance.pitch = 1.05;
    } else if (language === "pcm") {
      utterance.pitch = 1.0;
    } else if (language === "ha") {
      utterance.pitch = 0.98;
    } else if (language === "ig") {
      utterance.pitch = 1.02;
    } else {
      utterance.pitch = 1.0;
    }

    if (callbacks?.onWordBoundary) {
      utterance.onboundary = (e) => {
        if (e.name === "word") {
          const start = e.charIndex;
          const sub = speakable.slice(start);
          const m = sub.match(/\w+/);
          const len = m ? m[0].length : e.charLength || 5;
          callbacks.onWordBoundary!(start, len);
        }
      };
    }

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      const err = (e as SpeechSynthesisErrorEvent | undefined)?.error;
      // Chrome fires "language-unavailable" / "voice-unavailable" when the
      // chosen voice cannot speak the utterance locale. Fall back once to a
      // plain English voice so the kid still hears the question instead of
      // silence, but the text on screen is already localized.
      const unavailable = err === "language-unavailable" || err === "voice-unavailable";
      if (unavailable && !retryingAsEnglish && language !== "en") {
        const englishVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith("en") && !v.name.includes("Bad")) ||
          voices[0];
        if (englishVoice) {
          try {
            const retry = new SpeechSynthesisUtterance(speakable);
            retry.voice = englishVoice;
            retry.lang = englishVoice.lang || "en-US";
            retry.rate = utterance.rate;
            retry.pitch = utterance.pitch;
            retry.onend = () => callbacks?.onEnd?.();
            retry.onerror = () => callbacks?.onError?.({ retriedWithEnglish: true });
            if (callbacks?.onWordBoundary) {
              retry.onboundary = (ev) => {
                if (ev.name === "word") callbacks.onWordBoundary!(ev.charIndex, ev.charLength || 5);
              };
            }
            synth.cancel();
            retainUtterance(retry);
            synth.speak(retry);
            return;
          } catch {
            // fall through to the error callback below
          }
        }
      }
      callbacks?.onError?.({ retriedWithEnglish: retryingAsEnglish });
    };

    retainUtterance(utterance);
    synth.speak(utterance);
  };

  // getVoices() returns [] on first load in Chrome until voiceschanged fires;
  // resolving through getVoicesReady() guarantees we match against real OS voices.
  void getVoicesReady().then((voices) => queueUtterance(voices, false));
}
