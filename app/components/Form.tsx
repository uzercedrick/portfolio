"use client";
import { useState, useEffect, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheck, MdErrorOutline, MdClose, MdWarningAmber } from "react-icons/md";
import { ArrowUpRight } from "lucide-react";
import emailjs from "@emailjs/browser";
import { zalando, mono } from "../fonts";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TOKENS = {
  bg: "#14141A",
  accent: "rgba(245,246,252,0.75)",
  text: "#F5F6FC",
  textMuted: "rgba(245, 246, 252, 0.65)",
  line: "rgba(245, 246, 252, 0.1)",
  error: "#ef4444",
  warning: "#eab308",
} as const;

const EMAILJS_SERVICE_ID = "service_y5r3fys";
const EMAILJS_TEMPLATE_ID = "template_5nh0po1";
const EMAILJS_PUBLIC_KEY = "Oa41jzssBxnxqW_HT";
const RECIPIENT_EMAIL = "jhoncedrick.fuentes@gmail.com";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_MS = 10 * 60 * 1000;
const submitTimestamps: number[] = [];

const VALIDATION_DATA = {
  profanity: {
    en: ["fuck","fucking","fucked","fucker","fuckers","fucks","fuk","fukk","fck","fcking","shit","shitting","shitted","shitter","bullshit","horseshit","sht","sh1t","shyt","ass","asses","asshole","assholes","bitch","bitches","bitching","b1tch","bich","bastard","bastards","dick","dicks","dickhead","dickheads","dik","cock","cocks","cunt","cunts","pussy","pussies","whore","whores","slut","sluts","motherfucker","motherfuckers","mofo","mf","nigga","nigger","niggers","n1gga","chink","chinks","spic","spics","kike","kikes","retard","retards","retarded","r3tard","damn","damned","dammit","goddamn","goddamned","hell","crap","craps","crappy","douche","douchebag","douchebags","wanker","wankers","prick","pricks","twat","twats","bollocks","arse","arses","arsehole","arseholes","bugger","buggers","sod","sods","tosser","tossers","git","gits","minger","mingers","nonce","nonces","paedo","paedophile","pedo","pedophile","rape","rapist","rapists","kill","killer","killers","murder","murderer","suicide","bomb","terrorist","terrorism","nazi","hitler","kkk","fag","faggot","faggots","fagot","dyke","dykes","tranny","shemale","hoe","hoes","skank","skanks","scumbag","scumbags","scum","lowlife","lowlifes","degenerate","degenerates","pervert","perverts","perv","pervs","creep","creeps","creepy","idiot","idiots","moron","morons","imbecile","imbeciles","stupid","dumb","dumbass","dumbasses","loser","losers","pathetic","worthless","disgusting","vile","filthy","trash","garbage","waste","dipshit","dipshits","dumbshit","dumbshits","jackass","jackasses","smartass","smartasses","wiseass","wiseasses","kissass","kissasses","halfass","halfassed","pieceofshit","sonofabitch","stfu","gtfo","fml","ffs","wtf","holyshit","free money","click here","win now","crypto giveaway","investment scam","easy cash","fast money","urgent action","verify your account","limited time offer"],
    fil: ["putangina","putanginamo","putang ina mo","puta","putaka","putang","tangina","tanginamo","tang ina mo","tngina","tnga","tanga","tangang","tangaka","gago","gagong","gagoka","gagi","gag0","bobo","bobong","boboka","ulol","ulolka","olol","ololka","yawa","yawaka","yawaa","buang","buangka","buanga","ungas","ungaska","engot","engotka","tarantado","tarantadong","tarantadoka","lintik","lintikka","lintek","lintekka","pucha","puchang","puchaka","puchamo","bwisit","bwiset","bwusit","leche","lecheka","lecheng","hinayupak","hinayupakka","hayop","hayopka","salot","salotka","walanghiya","walang hiya","walanghiyaka","walangmodo","walang modo","modoka","basura","basuraka","kadiri","kadirika","kadiring","kupal","kupalka","kupalna","siraulo","sira ulo","sirauloka","baliw","baliwka","punyeta","punyetaka","mamataykana","mamatay ka na","patayinkita","patayin kita","peste","demonyo","demonyoka","walangkwenta","walang kwenta","walangsilbi","walang silbi","manloloko","mandaraya","magnanakaw","kurakot","korap","duwag","walangbayag","walang bayag","bayagmo","supot","bakla","bayot","pokpok","prosti","kabit","manyakis","bastos","malandi","landi","inutil","palpak","mangmang","hangal","ampon","pulubi","abnoy","abnormal","lukaluka","luka luka","gago ka","bobo ka","tanga ka","ulol ka","sira ka","buang ka","yawa ka","pucha ka","puta ka","hayop ka","salot ka","basura ka","walang hiya ka","walang modo ka","bastos ka","manyak ka","inutil ka","palpak ka","mangmang ka","abnoy ka","baliw ka"]
  },
  fakeNames: ["test","testing","tester","testuser","test name","abc","abcd","abcde","none","na","idk","xxx","qwerty","unknown","anonymous","anon","johndoe","john doe","janedoe","jane doe","fake","fake name","placeholder","sample","sample name","trial","demo","hello","user","username","user name","admin","administrator","guest","visitor","temp","temporary","delete","deleteme","spam","spammer","bot","robot","auto","automatic","random","random name","junk","trash","garbage","nobody","no name","noname","someone","anyone","person","human","name","full name","first last","firstname lastname"],
  keyboardRuns: ["qwert","qwerty","asdfg","asdfgh","zxcvb","zxcvbn","qazwsx","qazwsxe","poiuy","poiuyt","lkjhg","lkjhgf","mnbvc","mnbvcx","12345","123456","654321","09876"],
  spamTriggers: ["free money","click here","win now","crypto giveaway","investment","easy cash","fast money","urgent","verify account","limited offer","act now","exclusive deal","make money","get rich","lottery","prize","won","winner","claim your","risk free","guaranteed","no obligation","double your","investment opportunity","earn daily","passive income","work from home","get paid","instant cash","wire transfer","western union","money gram","gift card","itunes card","amazon card","paypal","cash app","gcash","maya","bank details","account info","password","credit card","ssn","otp","verification code","confirm your","security alert","suspicious activity","unauthorized login","reset password","update your info","account suspended","locked account","reactivate","immediately","asap","right now","don't miss","only today","last chance","hurry up","act fast","limited time","expires soon","final notice","official notification","important message","dear customer","dear user","dear friend","hello friend","my dear","beloved","i have a proposal","business proposal","inheritance","lottery win","fund transfer","overseas job","job offer","work visa","immigration","loan offer","low interest","no credit check","guaranteed loan","debt relief","credit repair","weight loss","lose weight fast","diet pill","enhancement","male enhancement","miracle cure","healing","psychic","spell caster","love spell","lottery spell","bring back ex","revenge spell","black magic","voodoo","illuminati","join illuminati","rich and famous","power and wealth","secret society","brotherhood","freemason","get famous","become celebrity","mastercard","visa card","debit card","bank account","routing number","pin code","cvv","expiry date","send money","send load","mobile load","gcash number","maya number","smart padala","pera padala","cebuana lhuillier","palawan express","mlhuillier","western union","moneygram","coinbase","binance","crypto wallet","bitcoin","ethereum","usdt","giveaway","raffle","contest winner","you have won","claim prize","free gift","free sample","free trial","subscribe now","unsubscribe","click link","open attachment","download file","install app","update software","security update","system update","your computer is infected","virus detected","clean your pc","optimize your device","speed up your internet","boost performance","call this number","text this number","whatsapp","telegram","viber","signal","wechat","line","kakaotalk","facebook friend request","instagram dm","twitter dm","tiktok message","private message","pm me","dm me","contact me on","reach me at","alternative email","secondary number","my agent","my lawyer","my accountant","my secretary","my partner","my cousin","my uncle","my father","my mother","late husband","late wife","next of kin","beneficiary","next to kin","fund release","clearance fee","processing fee","delivery fee","customs fee","tax fee","insurance fee","security fee","keep this secret","confidential","don't tell anyone","this is private","top secret","for your eyes only","trust me","i promise you","guaranteed 100%","risk free","no scam","legitimate","official","licensed","registered","authorized","accredited"]
} as const;

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeSoft(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function hasProfanity(text: string): boolean {
  const compact = normalize(text);
  const soft = normalizeSoft(text);
  const words = soft.split(/\s+/);
  if (VALIDATION_DATA.profanity.en.some(w => compact.includes(normalize(w)))) return true;
  if (VALIDATION_DATA.profanity.en.some(w => words.includes(normalize(w)))) return true;
  if (VALIDATION_DATA.profanity.fil.some(w => compact.includes(normalize(w)))) return true;
  if (VALIDATION_DATA.profanity.fil.some(w => words.includes(normalizeSoft(w)))) return true;
  return false;
}

function hasSpamTriggers(text: string): boolean {
  const lower = text.toLowerCase();
  let matches = 0;
  for (const trigger of VALIDATION_DATA.spamTriggers) {
    if (lower.includes(trigger)) matches++;
    if (matches >= 2) return true;
  }
  return false;
}

function isLikelyFakeName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 60) return true;
  const lower = trimmed.toLowerCase();
  const clean = normalize(trimmed);
  const soft = normalizeSoft(trimmed);
  const words = soft.split(/\s+/).filter(Boolean);

  if (/^(.)\1{2,}$/i.test(clean)) return true;
  if (clean.length < 2) return true;
  if ((VALIDATION_DATA.fakeNames as readonly string[]).some(f => lower.includes(f))) return true;
  if ((VALIDATION_DATA.fakeNames as readonly string[]).includes(clean)) return true;
  if (/\d/.test(trimmed)) return true;
  if (/[@#$%^&*()_+=\[\]{};:"\\|,<>\?\/~`]/.test(trimmed)) return true;
  if (VALIDATION_DATA.keyboardRuns.some(run => lower.includes(run))) return true;
  if (clean.length >= 4 && !/[aeiou]/.test(clean)) return true;
  if (words.some(w => w.length === 1 && !/[aeiouAEIOU]/.test(w))) return true;
  if (words.length >= 2 && words.every(w => w.length <= 1)) return true;
  const uniqueChars = new Set(clean.split(""));
  if (clean.length >= 6 && uniqueChars.size <= 2) return true;
  if (/^(.)\1+(.)\2+$/.test(clean)) return true;
  if (lower.includes("http") || lower.includes("www") || lower.includes(".com") || lower.includes("@")) return true;
  if (hasProfanity(trimmed)) return true;
  return false;
}

function isLikelySpamMessage(message: string): boolean {
  const trimmed = message.trim();
  if (trimmed.length < 10) return true;
  if (trimmed.length > 500) return true;

  if (/(.)\1{5,}/.test(trimmed)) return true;
  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  if (words.length >= 4 && uniqueWords.size / words.length < 0.4) return true;

  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 20 && letters === letters.toUpperCase()) return true;

  const links = trimmed.match(/https?:\/\/|www\./gi);
  if (links && links.length >= 1) return true;

  if (letters.length >= 15) {
    const vowels = (letters.match(/[aeiou]/gi) || []).length;
    if (vowels / letters.length < 0.15) return true;
  }

  const specialChars = (trimmed.match(/[^a-zA-Z0-9\s.,!?'"-]/g) || []).length;
  if (trimmed.length > 20 && specialChars / trimmed.length > 0.25) return true;

  const emojiOrSymbol = (trimmed.match(/[^\x00-\x7F]/g) || []).length;
  if (trimmed.length > 20 && emojiOrSymbol / trimmed.length > 0.3) return true;

  const lines = trimmed.split(/\n+/).filter(Boolean);
  const uniqueLines = new Set(lines.map(l => l.trim()));
  if (lines.length >= 3 && uniqueLines.size / lines.length < 0.5) return true;

  const wordCounts: Record<string, number> = {};
  for (const w of words) {
    if (w.length <= 2) continue;
    wordCounts[w] = (wordCounts[w] || 0) + 1;
    if (wordCounts[w] >= 4) return true;
  }

  if (VALIDATION_DATA.keyboardRuns.some(run => trimmed.toLowerCase().includes(run))) return true;

  if (hasProfanity(trimmed)) return true;
  if (hasSpamTriggers(trimmed)) return true;

  const meaningfulWords = words.filter(w => w.length >= 3);
  if (meaningfulWords.length < 2) return true;

  return false;
}

function isRateLimited(): boolean {
  const now = Date.now();
  while (submitTimestamps.length && submitTimestamps[0] < now - RATE_LIMIT_MS) submitTimestamps.shift();
  return submitTimestamps.length >= RATE_LIMIT_MAX;
}

function recordSubmit() { submitTimestamps.push(Date.now()); }

function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/javascript:/gi, "").trim();
}

type ContactFormPopupProps = { isOpen: boolean; onClose: () => void };

function Hi({ children }: { children: React.ReactNode }) {
  return <span style={{ color: TOKENS.text }}>{children}</span>;
}

const STEP_META: { tag: string; eyebrow: string }[] = [
  { tag: "IDENTITY", eyebrow: "01 — WHO ARE YOU" },
  { tag: "CONTACT CHANNEL", eyebrow: "02 — YOUR EMAIL" },
  { tag: "SCOPE", eyebrow: "03 — PROJECT TYPE" },
  { tag: "BRIEF", eyebrow: "04 — YOUR VISION" },
];

export default function ContactFormPopup({ isOpen, onClose }: ContactFormPopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "", email: "", projectType: "", customProject: "", vision: "",
  });
  const [errors, setErrors] = useState({
    fullName: "", email: "", projectType: "", customProject: "", vision: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [blocks, setBlocks] = useState({ fullName: "", vision: "" });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    const t = setTimeout(() => {
      const flagged = formData.fullName.trim() && isLikelyFakeName(formData.fullName);
      setBlocks(b => ({ ...b, fullName: flagged ? "This name looks invalid, fake, or inappropriate. Please enter your real full name." : "" }));
    }, 500);
    return () => clearTimeout(t);
  }, [formData.fullName]);

  useEffect(() => {
    const t = setTimeout(() => {
      const flagged = formData.vision.trim() && isLikelySpamMessage(formData.vision);
      setBlocks(b => ({ ...b, vision: flagged ? "This message looks like spam, gibberish, or inappropriate content. Please write a genuine, clear message." : "" }));
    }, 600);
    return () => clearTimeout(t);
  }, [formData.vision]);

  const getCurrentDateTime = () => new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(new Date());

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) setErrors({ ...errors, [name]: "" });
    setSubmitError("");
  };

  const handleSelect = (type: string) => {
    setFormData({ ...formData, projectType: type, customProject: type === "OTHER" ? formData.customProject : "" });
    if (errors.projectType) setErrors({ ...errors, projectType: "" });
    setSubmitError("");
  };

  const validateStep = () => {
    const newErrors = { ...errors };
    let valid = true;
    if (step === 1) {
      if (!formData.fullName.trim()) { newErrors.fullName = "Please enter your full name"; valid = false; }
      else if (blocks.fullName) { newErrors.fullName = blocks.fullName; valid = false; }
    }
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) { newErrors.email = "Please enter your email address"; valid = false; }
      else if (!emailRegex.test(formData.email)) { newErrors.email = "Please enter a valid email address"; valid = false; }
      else if (hasProfanity(formData.email)) { newErrors.email = "Email contains inappropriate content"; valid = false; }
    }
    if (step === 3) {
      if (!formData.projectType) { newErrors.projectType = "Please select a project type"; valid = false; }
      else if (formData.projectType === "OTHER" && !formData.customProject.trim()) { newErrors.customProject = "Please describe your project type"; valid = false; }
      else if (formData.projectType === "OTHER" && (isLikelyFakeName(formData.customProject) || hasProfanity(formData.customProject))) {
        newErrors.customProject = "Please enter a valid project description"; valid = false;
      }
    }
    if (step === 4) {
      if (!formData.vision.trim()) { newErrors.vision = "Please tell me about your project"; valid = false; }
      else if (formData.vision.trim().length < 10) { newErrors.vision = "Please provide a little more detail (at least 10 characters)"; valid = false; }
      else if (blocks.vision) { newErrors.vision = blocks.vision; valid = false; }
    }
    setErrors(newErrors);
    return valid;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < totalSteps) setStep(prev => prev + 1);
    else handleSubmit();
  };

  const getButtonLabel = () => {
    if (loading) return "SENDING...";
    return step === 4 ? "SEND IT" : "CONTINUE";
  };

  const prevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
    setSubmitError("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !submitted && !loading) { e.preventDefault(); nextStep(); }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!validateStep()) return;
    if (isLikelyFakeName(formData.fullName) || isLikelySpamMessage(formData.vision)) return;
    if (isRateLimited()) {
      setSubmitError("Too many submissions. Please wait a few minutes before trying again.");
      return;
    }
    setLoading(true); setSubmitError("");
    const safeName = sanitize(formData.fullName);
    const safeEmail = sanitize(formData.email);
    const safeProjectType = sanitize(formData.projectType === "OTHER" ? formData.customProject : formData.projectType);
    const safeVision = sanitize(formData.vision);
    const currentDateTime = getCurrentDateTime();
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: safeName, from_email: safeEmail, project_type: safeProjectType,
        message: safeVision.replace(/\n/g, "<br>"), date_time: currentDateTime,
        year: new Date().getFullYear(), to_email: RECIPIENT_EMAIL,
      }, EMAILJS_PUBLIC_KEY);
      recordSubmit(); setSubmitted(true);
    } catch (error) {
      console.error("❌ Email failed:", error);
      setSubmitError("Message could not be sent. Please try again later or email me directly.");
    } finally { setLoading(false); }
  };

  const closeAndReset = () => {
    setStep(1);
    setFormData({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setErrors({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setBlocks({ fullName: "", vision: "" });
    setSubmitted(false); setLoading(false); setSubmitError("");
    onClose();
  };

  const startNewMessage = () => {
    setStep(1);
    setFormData({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setErrors({ fullName: "", email: "", projectType: "", customProject: "", vision: "" });
    setBlocks({ fullName: "", vision: "" });
    setSubmitted(false); setLoading(false); setSubmitError("");
  };

  const pageVariants = {
    initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 },
  };
  const activeMeta = STEP_META[Math.min(step, 4) - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: E }} onClick={closeAndReset}
          style={{
            position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 14 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 14 }} transition={{ duration: 0.28, ease: E }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: TOKENS.bg, width: "100%", maxWidth: "850px", maxHeight: "90vh",
              overflowY: "auto", position: "relative", borderRadius: "2px", border: `1px solid ${TOKENS.line}`,
            }}
            onKeyDown={handleKeyDown} tabIndex={-1}
          >
            <style>{`
              @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
              @keyframes fadeSlide { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none; } }
              @keyframes fadeSlideOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(16px); } }
              .view-enter { animation: fadeSlide .35s cubic-bezier(0.22,1,0.36,1) both; }
              .view-exit { animation: fadeSlideOut .28s cubic-bezier(0.22,1,0.36,1) both; }
              .reveal { opacity: 0; transform: translateY(10px); animation: fadeUp .55s ease forwards; }
              .reveal:nth-of-type(2){animation-delay:.1s}.reveal:nth-of-type(3){animation-delay:.2s}
              .form-inner::before {
                content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
                background-image:
                  linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px);
                background-size: 48px 48px; opacity: 0.55;
              }
              .form-inner::after {
                content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none;
                background-image:
                  linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
                background-size: 192px 192px; opacity: 0.7;
              }
              .reg-mark {
                position: absolute; z-index: 1; pointer-events: none; width: 20px; height: 20px;
                border: 1px solid rgba(245,246,252,0.25);
              }
              .reg-mark.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
              .reg-mark.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
              .reg-mark::before, .reg-mark::after { content: ''; position: absolute; background: rgba(245,246,252,0.45); }
              .reg-mark::before { width: 1px; height: 6px; }
              .reg-mark::after  { width: 6px; height: 1px; }
              .reg-mark.tl::before { top: -1px; left: 50%; transform: translateX(-50%); }
              .reg-mark.tl::after  { top: 50%; left: -1px; transform: translateY(-50%); }
              .reg-mark.tr::before { top: -1px; right: 50%; transform: translateX(50%); }
              .reg-mark.tr::after  { top: 50%; right: -1px; transform: translateY(-50%); }
              .coord-label {
                position: absolute; z-index: 1; pointer-events: none;
                font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
                font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,246,252,0.45);
              }
              .coord-label.tl { top: 10px; left: 40px; }
              .coord-label.tr { top: 10px; right: 40px; }
              .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }
              .form-content { position: relative; z-index: 2; }
              ::selection { background: ${TOKENS.accent}; color: ${TOKENS.bg}; }
              button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid ${TOKENS.accent}; outline-offset: 2px; }
            `}</style>
            <div className="form-inner w-full h-full p-6 sm:p-8">
              <div className="reg-mark tl" aria-hidden="true" />
              <div className="reg-mark tr" aria-hidden="true" />
              <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">02</span></div>
              <div className="coord-label tr" aria-hidden="true">SHEET <span className="val">03</span> / CONTACT</div>
              <div className="form-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "36px" }}>
                  <div>
                    {!submitted ? (
                      <>
                        <p className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.3em", color: TOKENS.textMuted, textTransform: "uppercase", marginBottom: "6px" }}>
                          GET IN TOUCH
                        </p>
                        <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "20px", letterSpacing: "0.12em", textTransform: "uppercase" }}>JCN</h2>
                      </>
                    ) : (
                      <p className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.3em", color: TOKENS.textMuted, textTransform: "uppercase" }}>STATUS · SENT</p>
                    )}
                  </div>
                  <button
                    onClick={closeAndReset} aria-label="Close contact form"
                    style={{
                      width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "50%", background: "transparent", border: `1px solid ${TOKENS.line}`,
                      color: TOKENS.textMuted, cursor: "pointer", transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = TOKENS.text; e.currentTarget.style.color = TOKENS.bg; e.currentTarget.style.borderColor = TOKENS.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TOKENS.textMuted; e.currentTarget.style.borderColor = TOKENS.line; }}
                    onFocus={(e) => { e.currentTarget.style.background = TOKENS.text; e.currentTarget.style.color = TOKENS.bg; }}
                    onBlur={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TOKENS.textMuted; }}
                  >
                    <MdClose size={18} />
                  </button>
                </div>
                {!submitted && (
                  <div style={{ height: "1px", background: TOKENS.line, marginBottom: "32px", position: "relative" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: E }}
                      style={{ height: "100%", background: TOKENS.text }}
                    />
                  </div>
                )}
                {!submitted && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {Array.from({ length: 4 }).map((_, i) => {
                        const num = i + 1;
                        const isDone = num < step;
                        const isActive = num === step;
                        return (
                          <motion.div
                            key={num}
                            animate={{
                              background: isDone ? TOKENS.text : "transparent",
                              borderColor: isDone || isActive ? TOKENS.text : TOKENS.line,
                              color: isDone ? TOKENS.bg : isActive ? TOKENS.text : TOKENS.textMuted,
                            }}
                            style={{
                              width: "26px", height: "26px", borderRadius: "50%", borderWidth: "1px", borderStyle: "solid",
                              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                              fontSize: "11px", fontFamily: mono.style.fontFamily,
                            }}
                          >
                            {isDone ? <MdCheck size={13} /> : num.toString().padStart(2, "0")}
                          </motion.div>
                        );
                      })}
                    </div>
                    <span className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.2em", color: TOKENS.textMuted, textTransform: "uppercase" }}>
                      {activeMeta.tag} · {step}/{totalSteps}
                    </span>
                  </div>
                )}
                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: E }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        background: "rgba(239, 68, 68, 0.08)", border: `1px solid rgba(239, 68, 68, 0.3)`,
                        padding: "12px 14px", marginBottom: "24px", borderRadius: "2px",
                      }}
                    >
                      <MdErrorOutline size={18} color={TOKENS.error} />
                      <p style={{ color: TOKENS.error, fontSize: "13px", fontFamily: mono.style.fontFamily, margin: 0 }}>{submitError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div
                      key={step} variants={pageVariants} initial="initial" animate="animate" exit="exit"
                      transition={{ duration: 0.4, ease: E }}
                    >
                      {step === 1 && (
                        <div>
                          <p className={mono.className} style={{ color: TOKENS.accent, fontSize: "11px", letterSpacing: "0.25em", marginBottom: "10px", textTransform: "uppercase" }}>01 — WHO ARE YOU</p>
                          <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", textTransform: "uppercase" }}>
                            PLEASE STATE YOUR <Hi>NAME.</Hi>
                          </h2>
                          <p style={{ color: TOKENS.textMuted, maxWidth: "500px", marginBottom: "32px", fontFamily: mono.style.fontFamily, fontSize: "14px", lineHeight: 1.75 }}>
                            Hello there! Let&apos;s start with a simple introduction — I&apos;d love to know what I should call you.
                          </p>
                          <div style={{ marginBottom: "12px" }}>
                            <label className={mono.className} style={{ display: "block", color: errors.fullName ? TOKENS.error : TOKENS.accent, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "10px", textTransform: "uppercase" }}>FULL NAME</label>
                            <input
                              type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                              placeholder="First & Last Name"
                              style={{
                                width: "100%", background: "transparent", border: "none",
                                borderBottom: `1px solid ${errors.fullName ? TOKENS.error : TOKENS.line}`,
                                padding: "10px 0", fontSize: "16px", color: TOKENS.text, outline: "none",
                                fontFamily: mono.style.fontFamily, transition: "border-color 0.2s ease",
                              }}
                            />
                            <AnimatePresence>
                              {errors.fullName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ color: TOKENS.error, fontSize: "12px", marginTop: "6px", marginBottom: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  <MdErrorOutline size={13} />{errors.fullName}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            <AnimatePresence>
                              {!errors.fullName && blocks.fullName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ color: TOKENS.warning, fontSize: "12px", marginTop: "6px", marginBottom: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  <MdWarningAmber size={13} />{blocks.fullName}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div>
                          <p className={mono.className} style={{ color: TOKENS.accent, fontSize: "11px", letterSpacing: "0.25em", marginBottom: "10px", textTransform: "uppercase" }}>02 — YOUR EMAIL</p>
                          <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", textTransform: "uppercase" }}>
                            WHERE DO I <Hi>FIND YOU?</Hi>
                          </h2>
                          <p style={{ color: TOKENS.textMuted, maxWidth: "500px", marginBottom: "32px", fontFamily: mono.style.fontFamily, fontSize: "14px", lineHeight: 1.75 }}>
                            Great to meet you! Drop your email so I can reach out and get back to you as soon as possible.
                          </p>
                          <div style={{ marginBottom: "12px" }}>
                            <label className={mono.className} style={{ display: "block", color: errors.email ? TOKENS.error : TOKENS.accent, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "10px", textTransform: "uppercase" }}>EMAIL ADDRESS</label>
                            <input
                              type="email" name="email" value={formData.email} onChange={handleChange}
                              placeholder="your@email.com"
                              style={{
                                width: "100%", background: "transparent", border: "none",
                                borderBottom: `1px solid ${errors.email ? TOKENS.error : TOKENS.line}`,
                                padding: "10px 0", fontSize: "16px", color: TOKENS.text, outline: "none",
                                fontFamily: mono.style.fontFamily, transition: "border-color 0.2s ease",
                              }}
                            />
                            <AnimatePresence>
                              {errors.email && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ color: TOKENS.error, fontSize: "12px", marginTop: "6px", marginBottom: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  <MdErrorOutline size={13} />{errors.email}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div>
                          <p className={mono.className} style={{ color: TOKENS.accent, fontSize: "11px", letterSpacing: "0.25em", marginBottom: "10px", textTransform: "uppercase" }}>03 — PROJECT TYPE</p>
                          <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", textTransform: "uppercase" }}>
                            {formData.fullName.trim() ? <Hi>{formData.fullName}</Hi> : "SO"}, HAVE YOU ALREADY <Hi>DECIDED?</Hi>
                          </h2>
                          <p style={{ color: TOKENS.textMuted, maxWidth: "500px", marginBottom: "32px", fontFamily: mono.style.fontFamily, fontSize: "14px", lineHeight: 1.75 }}>
                            Awesome! What kind of project are you looking to build? Pick the option that fits best.
                          </p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" }}>
                            {["WEB DESIGN", "WEB APP", "BRANDING", "UI/UX", "FREELANCE", "OTHER"].map((type) => (
                              <motion.button
                                key={type} onClick={() => handleSelect(type)}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                style={{
                                  padding: "12px", border: `1px solid ${formData.projectType === type ? TOKENS.text : errors.projectType ? TOKENS.error : TOKENS.line}`,
                                  borderRadius: "2px", background: formData.projectType === type ? TOKENS.text : "transparent",
                                  color: formData.projectType === type ? TOKENS.bg : TOKENS.text, fontWeight: 600, cursor: "pointer",
                                  fontFamily: mono.style.fontFamily, fontSize: "12px", letterSpacing: "0.05em", textTransform: "uppercase",
                                  transition: "border-color 0.2s ease",
                                }}
                              >{type}</motion.button>
                            ))}
                          </div>
                          <AnimatePresence>
                            {errors.projectType && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                style={{ color: TOKENS.error, fontSize: "12px", marginTop: "0", marginBottom: "12px", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                              >
                                <MdErrorOutline size={13} />{errors.projectType}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {formData.projectType === "OTHER" && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }} style={{ marginBottom: "12px", overflow: "hidden" }}
                              >
                                <label className={mono.className} style={{ display: "block", color: errors.customProject ? TOKENS.error : TOKENS.accent, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "10px", textTransform: "uppercase" }}>PLEASE DESCRIBE YOUR PROJECT TYPE</label>
                                <input
                                  type="text" name="customProject" value={formData.customProject} onChange={handleChange}
                                  placeholder="e.g. E-commerce, Mobile App, etc."
                                  style={{
                                    width: "100%", background: "transparent", border: "none",
                                    borderBottom: `1px solid ${errors.customProject ? TOKENS.error : TOKENS.line}`,
                                    padding: "10px 0", fontSize: "16px", color: TOKENS.text, outline: "none",
                                    fontFamily: mono.style.fontFamily, transition: "border-color 0.2s ease",
                                  }}
                                />
                                <AnimatePresence>
                                  {errors.customProject && (
                                    <motion.p
                                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                      transition={{ duration: 0.2 }}
                                      style={{ color: TOKENS.error, fontSize: "12px", marginTop: "6px", marginBottom: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                    >
                                      <MdErrorOutline size={13} />{errors.customProject}
                                    </motion.p>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                      {step === 4 && (
                        <div>
                          <p className={mono.className} style={{ color: TOKENS.accent, fontSize: "11px", letterSpacing: "0.25em", marginBottom: "10px", textTransform: "uppercase" }}>04 — YOUR VISION</p>
                          <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", textTransform: "uppercase" }}>
                            GREAT! CAN YOU PLEASE TELL ME <Hi>ABOUT IT?</Hi>
                          </h2>
                          <p style={{ color: TOKENS.textMuted, maxWidth: "500px", marginBottom: "32px", fontFamily: mono.style.fontFamily, fontSize: "14px", lineHeight: 1.75 }}>
                            This is the fun part! Feel free to share all the details, ideas, and goals you have in mind — no need to hold back.
                          </p>
                          <div style={{ marginBottom: "12px" }}>
                            <label className={mono.className} style={{ display: "block", color: errors.vision ? TOKENS.error : TOKENS.accent, fontSize: "10px", letterSpacing: "0.2em", marginBottom: "10px", textTransform: "uppercase" }}>YOUR VISION</label>
                            <textarea
                              name="vision" value={formData.vision} onChange={handleChange}
                              placeholder="Tell me about your project, timeline, goals, or anything else you'd like to share..."
                              maxLength={500} rows={3}
                              style={{
                                width: "100%", background: "transparent", border: "none",
                                borderBottom: `1px solid ${errors.vision ? TOKENS.error : TOKENS.line}`,
                                padding: "10px 0", fontSize: "16px", color: TOKENS.text, outline: "none",
                                resize: "none", fontFamily: mono.style.fontFamily, transition: "border-color 0.2s ease",
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                              <AnimatePresence>
                                {errors.vision && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ color: TOKENS.error, fontSize: "12px", margin: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                  >
                                    <MdErrorOutline size={13} />{errors.vision}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                              <p className={mono.className} style={{ textAlign: "right", color: TOKENS.textMuted, fontSize: "10px", margin: "0", letterSpacing: "0.1em" }}>
                                {formData.vision.length}/500
                              </p>
                            </div>
                            <AnimatePresence>
                              {!errors.vision && blocks.vision && (
                                <motion.p
                                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ color: TOKENS.warning, fontSize: "12px", marginTop: "6px", marginBottom: "0", fontFamily: mono.style.fontFamily, display: "flex", alignItems: "center", gap: "6px" }}
                                >
                                  <MdWarningAmber size={13} />{blocks.vision}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <button
                          onClick={prevStep} className={mono.className}
                          style={{
                            background: "transparent", border: `1px solid ${TOKENS.line}`, color: TOKENS.textMuted,
                            padding: "10px 20px", borderRadius: "2px", cursor: "pointer",
                            display: step === 1 ? "none" : "block", fontWeight: 700, letterSpacing: "0.14em",
                            textTransform: "uppercase", fontSize: "12px",
                          }}
                          disabled={loading}
                        >← BACK</button>
                        <motion.button
                          onClick={nextStep} className={mono.className}
                          whileHover={!loading ? { scale: 1.03 } : {}} whileTap={!loading ? { scale: 0.97 } : {}}
                          style={{
                            background: loading ? TOKENS.textMuted : TOKENS.text, border: "none", color: TOKENS.bg,
                            padding: "12px 24px", borderRadius: "2px", fontSize: "13px", fontWeight: 700,
                            letterSpacing: "0.14em", cursor: loading ? "not-allowed" : "pointer",
                            marginLeft: "auto", textTransform: "uppercase", transition: "background 0.2s",
                            display: "flex", alignItems: "center", gap: "6px",
                          }}
                          disabled={loading}
                        >
                          {getButtonLabel()}
                          {!loading && <ArrowUpRight size={14} />}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: E }} style={{ textAlign: "center", padding: "32px 0" }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{
                          width: "60px", height: "60px", background: TOKENS.text, margin: "0 auto 24px",
                          display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
                        }}
                      >
                        <MdCheck size={30} color={TOKENS.bg} />
                      </motion.div>
                      <p className={mono.className} style={{ color: TOKENS.accent, fontSize: "11px", letterSpacing: "0.25em", marginBottom: "12px", textTransform: "uppercase" }}>
                        MESSAGE SENT SUCCESSFULLY
                      </p>
                      <h2 style={{ fontFamily: zalando.style.fontFamily, fontWeight: 800, color: TOKENS.text, fontSize: "clamp(24px, 3.2vw, 34px)", lineHeight: 1.15, marginBottom: "20px", textTransform: "uppercase" }}>
                        THANK YOU{formData.fullName.trim() ? <>, <Hi>{formData.fullName}</Hi></> : ""} FOR REACHING OUT! <Hi>I&apos;LL GET BACK TO YOU SOON.</Hi>
                      </h2>
                      <p style={{ color: TOKENS.textMuted, marginBottom: "28px", fontFamily: mono.style.fontFamily, fontSize: "14px", lineHeight: 1.75 }}>
                        I really appreciate you taking the time to share your ideas. Sit tight, and we&apos;ll start turning your vision into reality very soon!
                      </p>
                      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "32px" }}>
                        <a href="mailto:jhoncedrick.fuentes@gmail.com" className={mono.className} style={{ color: TOKENS.text, textDecoration: "none", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.1em" }}>EMAIL</a>
                        <a href="https://github.com/uzercedrick/" target="_blank" rel="noopener noreferrer" className={mono.className} style={{ color: TOKENS.text, textDecoration: "none", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.1em" }}>GITHUB</a>
                        <a href="https://linkedin.com/in/jcnungay" target="_blank" rel="noopener noreferrer" className={mono.className} style={{ color: TOKENS.text, textDecoration: "none", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.1em" }}>LINKEDIN</a>
                      </div>
                      <motion.button
                        onClick={startNewMessage} className={mono.className}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        style={{
                          background: TOKENS.text, border: "none", color: TOKENS.bg, padding: "12px 24px",
                          borderRadius: "2px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.14em",
                          cursor: "pointer", textTransform: "uppercase",
                        }}
                      >SEND ANOTHER MESSAGE</motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}