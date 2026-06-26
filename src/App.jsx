import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:           '#F7F3EE',   // warm cream — replaces clinical cool gray
  card:         '#FFFFFF',   // pure white — maximum contrast against warm bg
  primary:      '#1A2744',   // deep indigo
  interactive:  '#3D5FC8',   // vibrant periwinkle
  calm:         '#2A9D8F',   // rich teal
  activated:    '#E07B39',   // warm amber
  overwhelmed:  '#C23B59',   // clear rose
  secondary:    '#7A8699',   // neutral gray
  border:       '#E8E2D9',   // warm border
  green:        '#2A9D6E',
  amber:        '#E07B39',
  red:          '#C23B59',
  greenBg:      '#E6F6F3',
  amberBg:      '#FEF2E7',
  redBg:        '#FCEDF1',
  white:        '#FFFFFF',
};

const FONT_SIZES = { standard: 15, large: 18, xlarge: 21 };

// Regulation state → bar color
const regColor = (state) => {
  if (state === 'calm') return C.calm;
  if (state === 'activated') return C.activated;
  if (state === 'overwhelmed') return C.overwhelmed;
  return C.interactive;
};

// ─── CHECKLIST DATA ───────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    full: 'Am I naming my need directly?',
    sub: 'Can I say what I need in one short sentence — just the need, nothing added around it?',
    symbol: '🎯',
    short: 'Name it\ndirectly?',
    yesLabel: 'Yes — one clear sentence',
    noLabel: 'No — it needs work',
    noAction: 'Rewrite your communication until you can state your need in one clear sentence. Come back when ready.',
    noType: 'amber',
  },
  {
    id: 2,
    full: 'Is the information I am sharing complete?',
    sub: 'Am I sharing the full picture — including the parts that might make them say no?',
    symbol: '✅',
    short: 'Full picture\nshared?',
    yesLabel: 'Yes — all context included',
    noLabel: 'No — I left something out',
    noAction: 'Add the missing context before communicating. Both parts of the picture — even the inconvenient part — need to be present.',
    noType: 'amber',
  },
  {
    id: 3,
    full: 'Am I prepared to accept any response — including no?',
    sub: 'If they say no or give me something I did not want, can I accept that without arguing, pushing back, or falling apart?',
    symbol: '🤝',
    short: 'Accept\nany answer?',
    yesLabel: 'Yes — I can accept any response',
    noLabel: 'No — a refusal feels unacceptable',
    noAction: 'Stop here. Do not communicate yet. Bring this need to your trusted adult first. A refusal that feels unacceptable is a signal to pause.',
    noType: 'red',
  },
  {
    id: 4,
    full: 'What will the other person feel?',
    sub: 'Will they feel free to say whatever they really think? Or will they feel pressured or responsible for how I feel?',
    symbol: '🫶',
    short: 'Free to\nchoose?',
    yesLabel: 'Informed and free to choose',
    noLabel: 'Obligated or guilty',
    noAction: 'Restructure your communication before delivering it. The goal is a free response — not a pressured one.',
    noType: 'amber',
  },
  {
    id: 5,
    full: 'What is my actual goal?',
    sub: 'Am I trying to say my need clearly and let them choose freely? Or am I trying to get a specific answer?',
    symbol: '🏁',
    short: 'Clear comm\nor outcome?',
    yesLabel: 'Clear communication — free response',
    noLabel: 'A specific outcome',
    noAction: 'Stop here. This is the signal that the communication is structured as manipulation. Restructure before proceeding. Bring it to your trusted adult if needed.',
    noType: 'red',
  },
];

// ─── UTILITY: TRAFFIC LIGHT LOGIC ─────────────────────────────────────────────
function calcTrafficLight(answers) {
  if (!answers[3] || !answers[5]) return 'red';
  const allYes = Object.values(answers).every(Boolean);
  if (allYes) return 'green';
  return 'amber';
}

// ─── DOMAIN COLORS ────────────────────────────────────────────────────────────
const DC = {
  1: '#2E6DA4',
  2: '#6B7FA8',
  3: '#4E8A6B',
  4: '#C4781A',
  5: '#8B5E8A',
};

const DOMAIN_LABELS = {
  1: 'Relationship',
  2: 'Social Signals',
  3: 'Communication',
  4: 'Self-Management',
  5: 'Evaluation',
};

// ─── ALL 17 TERMS ─────────────────────────────────────────────────────────────
const TERMS = [
  {
    id: 1, domainNum: 1, linkedRule: 2,
    name: 'Friendship',
    plain: 'A mutual, voluntary relationship where both people consistently invest in each other over time.',
    definition: 'A friendship is a voluntary, mutual relationship where two people consistently choose to spend time together, share personal information at a comfortable level for both, offer emotional support, and demonstrate care for each other\'s wellbeing over time. Friendship requires reciprocity — both people contribute, not just one.',
    boundary: 'Friendship is not defined by proximity alone. Seeing someone regularly does not make them a friend. Friendliness is not friendship. A person can be kind and enjoyable to talk to without being a friend.',
    ruleAnchor: 'A person qualifies as a friend only when both parties demonstrate mutual, consistent, and voluntary investment over time.',
    metaphor: { symbol: '🌱', concept: 'A seedling watered from both sides', explanation: 'Like a plant that grows only when both soil and sun consistently contribute, friendship requires investment from both people — not just one.' },
    audioText: 'Friendship is a voluntary, mutual relationship where both people consistently choose each other over time. Both people invest. Both people show up. One-sided effort is not friendship yet.',
    activationPrompt: 'Think of someone you genuinely call a friend. What do they do — specifically — that makes them different from just someone you know?',
  },
  {
    id: 2, domainNum: 1, linkedRule: 1,
    name: 'Acquaintance',
    plain: 'Someone you recognize and greet but have not yet established trust, shared vulnerability, or consistent investment with.',
    definition: 'An acquaintance is a person you recognize, greet, and may engage in brief surface-level conversation with, but with whom you have not yet established mutual trust, shared vulnerability, or consistent social investment. Acquaintances occupy the outer ring of the relational proximity continuum.',
    boundary: 'An acquaintance is not an enemy, a stranger, or a friend. Treating an acquaintance with the same level of personal disclosure as a trusted friend is a relational boundary violation — even when the intent is positive.',
    ruleAnchor: 'The level of personal information shared must match the category of the relationship — not the level of personal comfort felt in the moment.',
    metaphor: { symbol: '👋', concept: 'A wave across a crowded room', explanation: 'You acknowledge each other with warmth, but neither of you has crossed the room yet. Warmth is not closeness.' },
    audioText: 'An acquaintance is someone you recognize and can greet. The key is what is not there yet — no deep trust, no consistent investment, no personal disclosure. Friendly does not mean friend.',
    activationPrompt: 'Think of someone whose name you know but who you have never told anything personal. Where do they sit in your life?',
  },
  {
    id: 3, domainNum: 1, linkedRule: 1,
    name: 'Relational Proximity Continuum',
    plain: 'A five-ring map showing how close a relationship is — based on observable behavior, not feelings.',
    definition: 'The relational proximity continuum is a structured way of understanding how close — emotionally, socially, and informationally — a relationship is. It organizes from Ring 1 (Strangers) outward to Ring 5 (Trusted Friends). Each ring requires specific observable behavioral evidence to assign.',
    boundary: 'A person does not move inward on the continuum simply because you want them to. Movement inward is always mutual, gradual, and evidenced by the other person\'s behavior — not your feelings about them.',
    ruleAnchor: 'Before sharing personal information, identify where the other person currently sits on the continuum. Match your behavior to their ring — not the ring you want them to occupy.',
    metaphor: { symbol: '🎯', concept: 'Concentric circles — each inner ring requires a specific invitation', explanation: 'You cannot move someone inward by wanting them there. They have to demonstrate, through behavior, that they belong there.' },
    audioText: 'The relational proximity continuum is a map of relationship closeness. Five rings. Ring 1 is strangers. Ring 5 is trusted friends. The critical rule: people move inward only based on what they actually do — not what you want them to do.',
    activationPrompt: 'Picture five circles inside each other. Where would you put your closest person? Where would you put someone you see at the store sometimes?',
  },
  {
    id: 4, domainNum: 1, linkedRule: 3,
    name: 'Mutual Friendship',
    plain: 'A friendship where both people independently initiate contact and consistently invest — not just one person.',
    definition: 'Mutual friendship exists when both individuals independently and consistently initiate contact, express interest in each other\'s wellbeing, invest time, and reciprocate emotional support. Both people experience the relationship as meaningful and valuable.',
    boundary: 'A friendship is not mutual simply because one person is friendly in return. Responding to contact is not the same as initiating it. Tolerance is not affection.',
    ruleAnchor: 'Evaluate the directionality of all social investment. If contact is consistently self-initiated and the other party rarely initiates, the relationship may not yet be mutual.',
    metaphor: { symbol: '⚖️', concept: 'A balance scale where both sides carry weight', explanation: 'If only one side adds weight, the scale tips. Mutual means both sides keep contributing — not just one.' },
    audioText: 'Mutual friendship requires both people to choose each other independently. Not just responding when reached out to — actually reaching out first. If only one person initiates, the friendship is not yet mutual.',
    activationPrompt: 'In your closest relationships, who usually initiates contact? Does it go both ways?',
  },
  {
    id: 5, domainNum: 1, linkedRule: 3,
    name: 'One-Directional Social Interest',
    plain: 'When one person invests significantly more contact, energy, or time into a relationship than the other person does.',
    definition: 'One-directional social interest occurs when one person invests significantly more time, attention, emotional energy, or contact attempts into a relationship than the other person does. This imbalance creates an unequal relational dynamic that is not sustainable as friendship.',
    boundary: 'One-directional interest is not inherently harmful in early stages. It becomes problematic when the pattern persists over time without movement toward mutuality, or when the other person has communicated — directly or behaviorally — that they do not share the same level of interest.',
    ruleAnchor: 'If you have initiated contact three or more consecutive times without the other person initiating in return, pause and reassess before continuing.',
    metaphor: { symbol: '🧲', concept: 'A magnet reaching toward something that does not pull back', explanation: 'The pull is real. The magnetic force is genuine. But when it only flows one direction, the connection cannot hold on its own.' },
    audioText: 'One-directional social interest is when you are investing significantly more than the other person. More texts, more effort, more emotional energy. It is not wrong — but it is information. Three consecutive contacts without a return initiation is the signal to pause.',
    activationPrompt: 'Have you ever felt like you were working harder to keep a connection than the other person was? What did that feel like?',
  },
  {
    id: 6, domainNum: 2, linkedRule: 4,
    name: 'Explicit Social Signal',
    plain: 'A direct, verbal message stating clearly what the other person needs or feels — no interpretation required.',
    definition: 'An explicit social signal is a direct, verbal communication of a social message. Examples include: "I am busy right now," "I am not comfortable with that topic," or "I would like to talk later." Explicit signals require no interpretation — the meaning is stated outright.',
    boundary: 'Not all social messages arrive explicitly. Waiting for an explicit signal before adjusting behavior can result in missed cues and relational rupture.',
    ruleAnchor: 'When an explicit social signal is received, respond to it directly and immediately. Do not negotiate, redirect, or continue the prior behavior.',
    metaphor: { symbol: '🚦', concept: 'A traffic light — the instruction is unmissable and requires immediate action', explanation: 'When the light is red, you do not negotiate. You do not explain why you need to keep going. You stop.' },
    audioText: 'An explicit social signal is a direct verbal statement. "I do not want to talk about that." "I am busy." No guessing needed. The message is the message. When you receive one, your only response is to act on it immediately.',
    activationPrompt: 'Has someone ever told you directly that they did not want to talk about something? That direct statement was an explicit signal.',
  },
  {
    id: 7, domainNum: 2, linkedRule: 5,
    name: 'Implicit Social Signal',
    plain: 'An unspoken message communicated through behavior, tone, or body language — standard communication for most neurotypical people.',
    definition: 'An implicit social signal is an unspoken, behavioral, or tonal communication that conveys a social message without stating it directly. Common implicit signals include: shortened responses, increased response latency, reduced eye contact, body turning away, monosyllabic replies, or subject-changing.',
    boundary: 'Implicit signals are not ambiguous by intent — they are the standard communication mode for many neurotypical individuals. Difficulty reading them is recognized and valid; however, building a strategy for reading them remains an important relational skill.',
    ruleAnchor: 'When two or more implicit signals appear in a single interaction, treat them as a collective message and adjust behavior — slow down, pause the topic, or check in directly.',
    metaphor: { symbol: '🌡️', concept: 'A thermometer reading the temperature of the room without anyone announcing it', explanation: 'The temperature is real even if no one has said a word. The reading is information that requires a response.' },
    audioText: 'An implicit signal is a message sent without words. Shorter replies. A body that turns away. A topic that gets changed. Two or more of these together means something. Treat them as a collective message and adjust.',
    activationPrompt: 'Has someone ever gotten quieter during a conversation without explaining why? That shift was an implicit signal.',
  },
  {
    id: 8, domainNum: 2, linkedRule: 6,
    name: 'Response Latency',
    plain: 'The time between your message and the other person\'s reply — a meaningful signal when it changes from their normal pattern.',
    definition: 'Response latency is the amount of time that passes between a conversational prompt or message and the other person\'s reply. A significant or unusual delay — especially relative to that person\'s normal response pattern — is a meaningful implicit signal that the person may be disengaged, uncomfortable, or unavailable.',
    boundary: 'Response latency must be interpreted relative to individual baseline. Some people respond slowly by habit. The meaningful signal is a change from their typical pattern — not a slow response in isolation.',
    ruleAnchor: 'Do not send follow-up messages or escalate contact when response latency increases. Allow space and revisit the conversation at a later time.',
    metaphor: { symbol: '⏱️', concept: 'A clock measuring the space between a question and its answer', explanation: 'A longer pause than usual is data, not silence. The space itself is communicating something worth noticing.' },
    audioText: 'Response latency is how long it takes someone to reply. What matters is not slow replies — it is a change from their usual pattern. If someone who normally texts back quickly goes quiet, that change is a signal. Do not fill it with more messages.',
    activationPrompt: 'Think of someone who normally responds quickly. If they suddenly took two days to reply, would you notice the difference? That change is response latency.',
  },
  {
    id: 9, domainNum: 3, linkedRule: 7,
    name: 'Reciprocal Communication',
    plain: 'A conversation where both people take turns speaking and listening — you acknowledge what was said before introducing something new.',
    definition: 'Reciprocal communication is a conversational structure in which both participants alternate roles as speaker and listener in a balanced, cooperative exchange. It includes taking turns speaking, acknowledging what the other person has said before introducing a new topic, and asking questions that demonstrate genuine interest in the other person\'s perspective.',
    boundary: 'Reciprocal communication is not simply waiting for the other person to finish speaking. Active listening — processing, acknowledging, and responding to the content of what was said — is required.',
    ruleAnchor: 'For every three statements made about yourself or your interests, ask at least one genuine question about the other person. Monitor for conversational balance.',
    metaphor: { symbol: '🏸', concept: 'A shuttlecock rally — the point stays alive only when both players return the shot', explanation: 'One player cannot carry the game. The rally requires both people to send and receive. A conversation where only one person speaks is not a rally — it is a solo.' },
    audioText: 'Reciprocal communication means both people take turns. You speak, they speak. You listen, they listen. The rule of three: every three things you say about yourself, ask one genuine question about them. Balance is not automatic — it requires monitoring.',
    activationPrompt: 'Think about the last real conversation you had. Did both people get approximately equal time? Did you ask about the other person?',
  },
  {
    id: 10, domainNum: 3, linkedRule: 8,
    name: 'Topic Appropriateness',
    plain: 'Whether a topic fits the relationship category and setting it is introduced in — based on the other person\'s signals, not your comfort level.',
    definition: 'Topic appropriateness refers to the alignment between a chosen conversational subject and the relational context in which it is introduced — including the relationship category, the setting, and the other person\'s demonstrated comfort level. Topics appropriate with a close friend may be inappropriate with a casual acquaintance.',
    boundary: 'A topic is not appropriate simply because you are comfortable discussing it. Appropriateness is determined by the relationship category and the other person\'s signals — not personal interest level.',
    ruleAnchor: 'Before introducing a personal, sensitive, or high-intensity topic, identify the relationship category and confirm the setting is appropriate. When uncertain, default to a neutral topic and follow the other person\'s lead.',
    metaphor: { symbol: '🗺️', concept: 'A map where different roads lead to different destinations — not every road is open yet', explanation: 'Some topics require a relationship category you have not reached yet. The road exists — it simply has not been cleared for this pairing.' },
    audioText: 'Topic appropriateness is about matching what you discuss to where the relationship actually is. Health concerns belong with trusted friends. General opinions can go to casual friends. The test is not your comfort — it is the relationship category and the other person\'s signals.',
    activationPrompt: 'Is there something you would only tell your closest friend? That sense of "this is not for everyone" is topic appropriateness in action.',
  },
  {
    id: 11, domainNum: 3, linkedRule: 9,
    name: 'Social Interaction Structure',
    plain: 'Every social interaction has three stages: an opening, a reciprocal middle, and a deliberate verbal close.',
    definition: 'A social interaction has three distinct stages: Opening (deliberate initiation using a contextually appropriate greeting), Maintenance (sustained reciprocal exchange of information, questions, and responses), and Closing (deliberate, signaled conclusion that communicates respect and leaves the relationship intact).',
    boundary: 'An interaction that ends abruptly — without a closing — communicates disinterest or dismissal to the other person, regardless of intent. All interactions require an intentional close.',
    ruleAnchor: 'Before ending any interaction, deliver a verbal closing that includes acknowledgment of the exchange and a forward-looking statement. Never exit an interaction without a signal.',
    metaphor: { symbol: '🎭', concept: 'A play with three acts — entrance, story, and curtain call', explanation: 'A play that ends mid-scene leaves the audience confused. An interaction without a close does the same thing to the other person.' },
    audioText: 'Every interaction has three parts. Opening: greet deliberately and establish purpose. Middle: take turns, monitor signals, pace the conversation. Closing: acknowledge the exchange, add a forward-looking statement. Never leave without a close.',
    activationPrompt: 'Think of an interaction that ended abruptly — someone just walked away or stopped responding. How did it feel? That feeling shows why the close matters.',
  },
  {
    id: 12, domainNum: 4, linkedRule: 10,
    name: 'Social Trigger',
    plain: 'A specific stimulus — a word, behavior, or situation — that activates a heightened emotional or physical response during an interaction.',
    definition: 'A social trigger is a specific stimulus — a word, behavior, topic, sensory input, or social dynamic — that activates a heightened emotional or physiological response during a social interaction, potentially disrupting the quality of the exchange. Triggers are individual, context-dependent, and learnable.',
    boundary: 'Identifying a trigger does not excuse the behavior it produces. Trigger awareness is the precondition for self-regulation — not a justification for unmanaged responses.',
    ruleAnchor: 'Maintain a personal trigger inventory. When a known trigger activates, deploy the assigned self-regulation strategy before continuing the interaction.',
    metaphor: { symbol: '⚡', concept: 'A circuit breaker that trips when the current gets too high', explanation: 'The breaker does not choose to trip. The overload trips it. Knowing your triggers means knowing what overloads your circuit — and managing the current before it gets there.' },
    audioText: 'A social trigger is something specific that reliably activates a heightened state — a particular word, tone, topic, or situation. Triggers are individual. Knowing yours means you can prepare for them. Trigger awareness is not an excuse — it is a preparation tool.',
    activationPrompt: 'Is there a specific word, tone of voice, or type of situation that reliably affects your state? That is a trigger.',
  },
  {
    id: 13, domainNum: 4, linkedRule: 11,
    name: 'Social Boundary',
    plain: 'A personal limit that governs what is acceptable in an interaction — communicated clearly and respected mutually.',
    definition: 'A social boundary is a personally defined limit that governs what is acceptable in an interaction — including physical space, communication frequency, topic content, and emotional disclosure. Healthy boundaries are communicated clearly and respected mutually.',
    boundary: 'A boundary is not a punishment or rejection. Communicating a boundary is a sign of relational health, not hostility. Receiving a boundary means adjusting behavior — not negotiating or explaining why the boundary is unnecessary.',
    ruleAnchor: 'When a boundary is communicated — explicitly or implicitly — accept it without argument, adjust behavior immediately, and do not revisit the restricted behavior in the same interaction.',
    metaphor: { symbol: '🚪', concept: 'A door with a lock — who receives a key is a decision only you can make', explanation: 'The door being locked is not unfriendliness. It is ownership. Being handed a key is a significant act of trust.' },
    audioText: 'A social boundary is a personal limit. It is not a rejection — it is a definition of what is acceptable. When someone communicates a boundary to you, your only response is to accept it and adjust immediately. No argument. No explanation of why the boundary is unnecessary.',
    activationPrompt: 'Is there something in conversations that consistently makes you uncomfortable? That discomfort is telling you where your boundary is.',
  },
  {
    id: 14, domainNum: 5, linkedRule: 12,
    name: 'Healthy Friendship Pattern',
    plain: 'A relationship where both people feel valued, heard, and free — characterized by mutuality, safety, and honest communication.',
    definition: 'A healthy friendship pattern is characterized by consistent mutuality, respect for boundaries, emotional safety, honest communication, and shared investment in each other\'s wellbeing over time. Both parties feel valued, heard, and free to be themselves without fear of judgment or consequence.',
    boundary: 'The healthy friendship standard applies to both parties simultaneously. Evaluating the other person\'s behavior without applying the same standard to your own conduct produces a distorted picture of the relationship\'s health.',
    ruleAnchor: 'Use the healthy friendship pattern as the evaluative standard when assessing any developing or existing relationship — including your own conduct within it.',
    metaphor: { symbol: '🧩', concept: 'Puzzle pieces that fit without being forced', explanation: 'Healthy relationships do not require either person to reshape themselves to fit. The connection is natural, mutual, and does not leave either person feeling diminished.' },
    audioText: 'A healthy friendship has five qualities: consistent mutuality, boundary respect from both sides, emotional safety, honest communication, and shared investment. Both people experience this. And critically — you evaluate your own conduct against this standard, not only the other person\'s.',
    activationPrompt: 'Think of a relationship where you feel the most like yourself. What makes that possible? Those qualities are the healthy pattern.',
  },
  {
    id: 15, domainNum: 5, linkedRule: 13,
    name: 'Exploitative or Unsafe Pattern',
    plain: 'A relational pattern where one person consistently uses or disregards the other person\'s boundaries or wellbeing for personal benefit.',
    definition: 'An exploitative or unsafe relational pattern exists when one person consistently uses, manipulates, or disregards the other person\'s boundaries, emotional needs, or wellbeing for personal gain or comfort. Indicators include: persistent boundary violations after correction, conditional affection, social isolation pressure, and emotional manipulation.',
    boundary: 'Unsafe patterns are not always intentional or malicious. Harm is evaluated by impact and pattern — not by the other person\'s intent. This applies to your own conduct as much as to others\'.',
    ruleAnchor: 'If two or more unsafe pattern indicators appear in a relationship — in your own conduct or in another person\'s — bring the concern to a trusted adult before continuing to invest.',
    metaphor: { symbol: '🕸️', concept: 'A web — some connections hold you in place without your consent', explanation: 'A web looks like connection from a distance. The difference between a healthy relationship and a web is whether you can leave freely.' },
    audioText: 'An exploitative pattern has specific indicators: persistent boundary violations after correction, conditional affection, pressure to isolate from other relationships, emotional manipulation, and consistent one-sided taking. Two or more of these in one relationship is the threshold to bring to a trusted adult — and to check your own behavior against as well.',
    activationPrompt: 'Think of a relationship where you often felt drained, guilty, or unsure of yourself. Those feelings are data worth examining.',
  },
  {
    id: 16, domainNum: 5, linkedRule: 13,
    name: 'Manipulation vs Self-Advocacy',
    plain: 'Manipulation influences behavior without the other person\'s free consent. Self-advocacy states a need directly and allows a free response.',
    definition: 'Manipulation is the deliberate or habitual use of indirect, deceptive, or emotionally leveraged strategies to influence another person\'s behavior without their full awareness or genuine consent. Self-advocacy is the direct, honest, transparent communication of your own needs — delivered in a way that gives the other person genuine freedom to respond, including the freedom to say no.',
    boundary: 'A need can be real and still be communicated manipulatively. The legitimacy of the need does not determine whether the communication method is ethical. Evaluate the method independently of the need.',
    ruleAnchor: 'Ask before every significant communication: "Does this give the other person genuine freedom to respond — including the freedom to say no — without guilt, fear, or emotional pressure from me?"',
    metaphor: { symbol: '⚖️', concept: 'A scale measuring who carries the weight of the decision', explanation: 'Self-advocacy places the decision on the scale and steps back. Manipulation tips the scale before the other person can weigh in.' },
    audioText: 'The single question that separates self-advocacy from manipulation: does this communication give the other person genuine freedom to say no without guilt, fear, or pressure? If yes — self-advocacy. If no — manipulation, regardless of how legitimate the underlying need is.',
    activationPrompt: 'Think of a time you wanted something from someone. Did you ask directly — or did you find a way to make it harder for them to say no?',
  },
  {
    id: 17, domainNum: 5, linkedRule: 13,
    name: 'The Withdrawal-Chase Cycle',
    plain: 'When one person withdraws, the other person pursues — driven by four automatic psychological mechanisms, not a free choice.',
    definition: 'The withdrawal-chase cycle occurs when one person withdraws from a relationship and the other person pursues — driven simultaneously by intermittent reinforcement (Skinner), attachment alarm activation (Bowlby), the scarcity response (Cialdini), and cognitive dissonance (Festinger). Withdrawal can be strategic, neurological (PTSD/autism shutdown), or mixed-origin.',
    boundary: 'Neurologically-driven withdrawal — PTSD shutdown or autistic shutdown — is not manipulative because it is not a strategy. However, its impact on the other person is identical to strategic withdrawal. Responsibility lives in Zone 3: proactive disclosure before, minimal signal during, and return acknowledgment after.',
    ruleAnchor: 'The other person experiences all three types of withdrawal identically. Responsibility for managing that impact does not depend on the cause — it depends on your capacity to give the other person enough information to interpret the experience accurately.',
    metaphor: { symbol: '🌊', concept: 'A wave pulling back from shore — and the shore rushing toward it', explanation: 'The shore does not choose to rush. The retreat triggers the response automatically. Understanding this cycle is the first step to interrupting it.' },
    audioText: 'When someone withdraws, four things activate in the other person simultaneously: the attachment alarm, the scarcity response, the self-concept threat, and the pressure to justify prior investment. The chase is not a choice — it is a conditioned response. Neurological shutdown is not manipulative. But it produces the same impact. The responsibility zone is disclosure: before, during when possible, and after.',
    activationPrompt: 'Have you ever texted someone more after they went quiet? That response is the chase. Understanding why it happens is how you start to manage it.',
  },
];

// ─── RULE CARDS DATA ──────────────────────────────────────────────────────────
const RULE_CARDS = [
  {
    cluster: 'Before the Interaction',
    color: DC[1],
    icon: '⏰',
    rules: [
      { num: 1, title: 'Classify before you engage', plain: 'Identify where the other person sits on your continuum before saying or sharing anything.' },
      { num: 2, title: 'Qualify before you name it', plain: 'Do not call a relationship a friendship until at least three of five bilateral criteria are met.' },
      { num: 8, title: 'Screen topics before introducing them', plain: 'Run a two-part check — relationship category and setting — before introducing any sensitive topic.' },
    ],
  },
  {
    cluster: 'During the Interaction',
    color: DC[3],
    icon: '💬',
    rules: [
      { num: 4, title: 'Respond to explicit signals immediately', plain: 'When someone states a limit directly, stop the current behavior and adjust — no negotiation.' },
      { num: 5, title: 'Read implicit signal clusters', plain: 'Two or more implicit signals together are a message. Pause and check in.' },
      { num: 7, title: 'Maintain conversational balance', plain: 'Every three self-referential statements, ask one genuine question about the other person.' },
      { num: 9, title: 'Structure every interaction', plain: 'Every interaction needs a deliberate opening, a reciprocal middle, and a verbal close.' },
    ],
  },
  {
    cluster: 'After the Interaction',
    color: DC[4],
    icon: '🔁',
    rules: [
      { num: 3, title: 'Monitor initiation directionality', plain: 'After three consecutive self-initiated contacts without return initiation, pause all outreach.' },
      { num: 6, title: 'Respect response latency', plain: 'A delayed reply is a message. Do not escalate contact. Allow a minimum 24-hour wait.' },
      { num: 10, title: 'Deploy your trigger inventory', plain: 'At the first sign of a trigger activating, deploy your regulation strategy before continuing.' },
      { num: 11, title: 'Accept boundaries without argument', plain: 'When a boundary is communicated — explicitly or implicitly — accept it immediately and adjust.' },
    ],
  },
  {
    cluster: 'Periodic Evaluation',
    color: DC[5],
    icon: '📋',
    rules: [
      { num: 12, title: 'Evaluate relationships periodically', plain: 'Every four to six weeks, score a relationship against five healthy friendship criteria. Calibrate investment accordingly.' },
      { num: 13, title: 'Bring unsafe patterns to a trusted adult', plain: 'Two or more unsafe indicators — in any relationship, including your own conduct — require a trusted adult before any further investment.' },
    ],
  },
];

// ─── MODULE 3 DATA ────────────────────────────────────────────────────────────

const AUDIT_Q = [
  {
    id: 1, symbol: '🎯',
    full: 'Did I respect the relationship category?',
    sub: 'Did I act the right way for what ring this person is actually in? Or did I push for more than the relationship supports?',
    frame: 'In this interaction, I [respected / did not respect] the relationship category because...',
    words: ['I matched my behavior to their ring', 'I shared too much for this category', 'I expected more than the ring supports', 'I stayed within the continuum correctly'],
    yesLabel: 'Yes — my behavior matched the ring',
    noLabel: 'No — I went beyond the category',
  },
  {
    id: 2, symbol: '📡',
    full: 'Did I respond to signals?',
    sub: 'Did they send signals — quiet or direct — that I ignored, argued with, or talked myself out of noticing?',
    frame: 'I [did / did not] adjust when signals appeared. Specifically...',
    words: ['I noticed and adjusted', 'I missed the signals', 'I noticed but continued anyway', 'I checked in and they confirmed'],
    yesLabel: 'Yes — I adjusted when signals appeared',
    noLabel: 'No — I missed or ignored signals',
  },
  {
    id: 3, symbol: '🔍',
    full: 'Did I use any manipulation strategies?',
    sub: 'Look at the 7 forms below. Did any of them show up in this conversation — on purpose or just out of habit?',
    frame: 'In this interaction, [none / one or more] of the manipulation forms occurred. Specifically...',
    words: ['No manipulation forms occurred', 'Guilt induction', 'Selective disclosure', 'Emotional escalation', 'Reciprocity exploitation', 'Dependency cultivation', 'Boundary testing', 'Reframing accountability'],
    yesLabel: 'No — I communicated directly throughout',
    noLabel: 'Yes — one or more forms occurred',
    isManipCheck: true,
  },
  {
    id: 4, symbol: '🫂',
    full: 'Did I make the other person responsible for my emotional state?',
    sub: 'Did I make them feel responsible for how I was feeling — in a way that was meant to get something from them?',
    frame: 'I [did / did not] place my emotional state on the other person because...',
    words: ['I managed my own state', 'I expressed distress that placed responsibility on them', 'I used my state to redirect the conversation', 'I named my feeling directly without creating obligation'],
    yesLabel: 'No — I managed my own state',
    noLabel: 'Yes — I placed my state on them',
  },
  {
    id: 5, symbol: '🪞',
    full: 'What would this look like from the other person\'s perspective?',
    sub: 'If they were filling this out about you right now, what would they honestly say? Write the hardest version to write.',
    frame: 'If the other person were completing this audit, they would likely report that I...',
    words: ['communicated clearly and respectfully', 'dominated the conversation', 'adjusted well when needed', 'pushed past their signals', 'made them feel heard', 'made them feel responsible for me', 'respected their boundaries'],
    isOpenEnded: true,
  },
];

const MANIP_FORMS = [
  { name: 'Guilt Induction', desc: 'Creating obligation or shame to produce a response' },
  { name: 'Selective Disclosure', desc: 'Withholding context to control the other person\'s decision' },
  { name: 'Emotional Escalation', desc: 'Amplifying distress — real or performed — to redirect or avoid accountability' },
  { name: 'Reciprocity Exploitation', desc: 'Invoking past favors to create a sense of debt' },
  { name: 'Dependency Cultivation', desc: 'Making the other person feel responsible for your wellbeing' },
  { name: 'Boundary Testing', desc: 'Repeatedly pushing against a stated limit in modified forms' },
  { name: 'Reframing Accountability', desc: 'Making the other person\'s reaction the problem rather than your behavior' },
];

const RULES_SIMPLE = [
  { num: 1,  title: 'Classify before you engage',              cluster: 'Before',   color: DC[1] },
  { num: 2,  title: 'Qualify before you name it',              cluster: 'Before',   color: DC[1] },
  { num: 3,  title: 'Monitor initiation directionality',       cluster: 'After',    color: DC[4] },
  { num: 4,  title: 'Respond to explicit signals immediately', cluster: 'During',   color: DC[3] },
  { num: 5,  title: 'Read implicit signal clusters',           cluster: 'During',   color: DC[3] },
  { num: 6,  title: 'Respect response latency',                cluster: 'After',    color: DC[4] },
  { num: 7,  title: 'Maintain conversational balance',         cluster: 'During',   color: DC[3] },
  { num: 8,  title: 'Screen topics before introducing them',   cluster: 'Before',   color: DC[1] },
  { num: 9,  title: 'Structure every interaction',             cluster: 'During',   color: DC[3] },
  { num: 10, title: 'Deploy your trigger inventory',           cluster: 'After',    color: DC[4] },
  { num: 11, title: 'Accept boundaries without argument',      cluster: 'After',    color: DC[4] },
  { num: 12, title: 'Evaluate relationships periodically',     cluster: 'Periodic', color: DC[5] },
  { num: 13, title: 'Bring unsafe patterns to a trusted adult', cluster: 'Periodic', color: DC[5] },
];

const HEALTH_CRITERIA = [
  { id: 1, label: 'Consistent mutuality',        indicator: 'Both of you have initiated contact at least once in the past month.' },
  { id: 2, label: 'Boundary respect — both ways', indicator: 'When either of you sets a limit, the other person accepts it without argument.' },
  { id: 3, label: 'Emotional safety',             indicator: 'You feel free to be yourself without fear of judgment or consequence.' },
  { id: 4, label: 'Honest, clear communication',  indicator: 'You can state disagreements or needs directly without the relationship feeling threatened.' },
  { id: 5, label: 'Shared investment',            indicator: 'Both people have offered and received support — not only one person giving.' },
];

const SKILL_RATINGS = [
  { value: 'internalized', label: 'I do this automatically', color: C.calm },
  { value: 'developing',   label: 'I do this when I remember', color: C.activated },
  { value: 'not-yet',      label: 'I know it but do not do it yet', color: C.secondary },
];

// ─── COMPLETE RULES DATA ──────────────────────────────────────────────────────
const RULES_FULL = [
  {
    num: 1, cluster: 'Before', color: DC[1],
    title: 'Classify Before You Engage',
    theRule: 'Know what ring this person is in before you talk to them. Act the right way for that ring the whole time.',
    defSource: 'Relational Proximity Continuum (Term 3) · Friendship (Term 1) · Acquaintance (Term 2)',
    protocol: [
      'Stop before you say anything.',
      'Ask yourself: What ring is this person in? Use what they do — not how you feel.',
      'Pick the right way to talk and share for that ring.',
      'Do not move someone to a closer ring just because you want to. They have to show you through their actions.',
    ],
    violation: 'Sharing personal things with someone who has not earned that level yet.',
    correction: 'Stop. Change the topic. Put the person back in the right ring. Start again from there.',
    linkedTerms: [1, 2, 3],
  },
  {
    num: 2, cluster: 'Before', color: DC[1],
    title: 'Qualify Before You Name It',
    theRule: 'Do not call someone a friend — even in your head — until you both have shown at least 3 of the 5 signs.',
    defSource: 'Friendship (Term 1) · Mutual Friendship (Term 4)',
    protocol: [
      'When you feel good about someone, wait. Do not say or think "friend" yet.',
      'Check the 5 signs: (1) You both start contact on your own. (2) You both make time — not just by chance. (3) You both share at the same level. (4) You both give and get support. (5) You both show you care about the other person.',
      'Check both sides — not just yours.',
      'If fewer than 3 signs are there from both of you, they are a casual friend for now.',
      'Check again every 4 to 6 weeks.',
    ],
    violation: 'Acting like someone is a friend — or expecting friend-level things — when the signs are not there from both of you yet.',
    correction: 'Check the 5 signs again. Change how you act to match where the relationship really is. Do not tell the person you are doing this.',
    linkedTerms: [1, 4],
  },
  {
    num: 3, cluster: 'After', color: DC[4],
    title: 'Monitor Initiation Directionality',
    theRule: 'Keep track of who reaches out first. If you have reached out 3 times in a row with no return, stop and wait.',
    defSource: 'One-Directional Social Interest (Term 5) · Mutual Friendship (Term 4)',
    protocol: [
      'Keep a simple note of who reaches out first each time — you or them.',
      'If you have reached out 3 times with no return reach-out, stop all contact for at least 1 week.',
      'During that week, see if they reach out on their own.',
      'If they do not, talk to your trusted adult before reaching out again.',
      'If they do reach out, resume and keep tracking.',
    ],
    violation: 'Reaching out more and more when the other person is not reaching back.',
    correction: 'Stop all reach-out right away. Write down what happened. Talk to your trusted adult before you reach out again. Do not bring up the imbalance directly without guidance.',
    linkedTerms: [4, 5],
  },
  {
    num: 4, cluster: 'During', color: DC[3],
    title: 'Respond to Explicit Signals Immediately',
    theRule: 'When someone tells you directly what they need or do not want, stop and change right away. No arguing or explaining.',
    defSource: 'Explicit Social Signal (Term 6)',
    protocol: [
      'Listen for direct words that show discomfort, limits, or that they need space.',
      'Say "Okay" or "No problem" — that is all.',
      'Stop right away. Do not finish the sentence or topic you were on.',
      'Do not ask why.',
      'Do not bring the topic back in this same conversation.',
    ],
    violation: 'Keeping a topic or behavior going after someone has said directly that they do not want it.',
    correction: 'Stop right away. Say a brief "Okay." Move to a new topic or close the conversation. If you missed the signal, name it at the next natural opening.',
    linkedTerms: [6],
  },
  {
    num: 5, cluster: 'During', color: DC[3],
    title: 'Read Implicit Signal Clusters',
    theRule: 'When you see 2 or more quiet signs that someone is pulling back, stop and check in. Do not wait for them to say it out loud.',
    defSource: 'Implicit Social Signal (Term 7) · Response Latency (Term 8)',
    protocol: [
      'Watch for 4 kinds of quiet signs: Word signs (short answers, one-word replies, changing the subject). Tone signs (flat voice, clipped words). Body signs (looking away, turning away). Time signs (longer waits before replying).',
      'If you see 2 or more of these, pause what you are saying.',
      'Ask in a calm, simple way: "Is this a good time?" or "Do you need to go?"',
      'Take whatever answer you get. No arguing.',
      'If they are done, start to close the conversation.',
    ],
    violation: 'Keeping the same topic going after 2 or more quiet signs have shown up.',
    correction: 'Stop right away. Ask the check-in question. Follow where it leads.',
    linkedTerms: [7, 8],
  },
  {
    num: 6, cluster: 'After', color: DC[4],
    title: 'Respect Response Latency',
    theRule: 'If someone takes much longer than usual to reply, do not send more messages. Give them space.',
    defSource: 'Response Latency (Term 8)',
    protocol: [
      'Learn how fast this person usually replies. That is their normal.',
      'When they take much longer than their normal, do not send a second message yet.',
      'Wait at least 24 hours before any follow-up.',
      'If they reply, go back to the conversation normally. Do not mention the wait.',
      'If they have not replied in 72 hours to a low-urgency message, send one short, neutral follow-up. Then stop.',
    ],
    violation: 'Sending many follow-up messages when you have not heard back. Making the tone more urgent when the first message was not urgent.',
    correction: 'Stop all follow-up right away. Wait 24 to 72 hours. Only reach back out after the wait is done — or when they reply.',
    linkedTerms: [8],
  },
  {
    num: 7, cluster: 'During', color: DC[3],
    title: 'Maintain Conversational Balance',
    theRule: 'For every 3 things you say about yourself, ask 1 real question about the other person. Watch the balance as you go.',
    defSource: 'Reciprocal Communication (Term 9)',
    protocol: [
      'Keep a quiet count of how many times you talk about yourself.',
      'At 3, stop and ask a real, open question about them.',
      'Before you ask, say something about what they last said — "That makes sense" or "I did not know that."',
      'After they answer, actually listen. Do not use their answer as a way to go back to talking about yourself.',
      'If you have been going for a long time, say it: "I realize I have been doing most of the talking. What has been going on with you?"',
    ],
    violation: 'Talking about yourself for a long time without asking about the other person. Asking a question and then going right back to talking about yourself.',
    correction: 'Stop talking. Ask a real question. Listen all the way through before you speak again.',
    linkedTerms: [9],
  },
  {
    num: 8, cluster: 'Before', color: DC[1],
    title: 'Screen Topics Before Introducing Them',
    theRule: 'Before you bring up a personal or heavy topic, check two things: Is the relationship close enough? Is this the right place and time?',
    defSource: 'Topic Appropriateness (Term 10)',
    protocol: [
      'Check 1 — How close is the relationship? General topics: Acquaintance or closer. Personal opinions: Casual friend or closer. Personal problems: Friend or closer. Health, family, or money: Trusted friend only. Romantic or sexual topics: Trusted friend only, and only if they started it.',
      'Check 2 — Is this the right setting? Ask: Is the place, the people around us, and the timing okay for this topic?',
      'If both checks pass, go ahead.',
      'If either check fails, pick a neutral topic instead. Come back to this one only when both checks pass.',
    ],
    violation: 'Bringing up sensitive or personal topics in the wrong place, with someone not close enough, or without checking if they are ready.',
    correction: 'If they seem uncomfortable, say simply: "I think I jumped ahead. Let us talk about something else." Move on right away.',
    linkedTerms: [10],
  },
  {
    num: 9, cluster: 'During', color: DC[3],
    title: 'Structure Every Interaction',
    theRule: 'Every conversation needs a clear start, a back-and-forth middle, and a proper close. Never walk away without closing.',
    defSource: 'Social Interaction Structure (Term 11)',
    protocol: [
      'Opening: Use the right greeting for this person and setting. Say something to start the conversation. Check how they seem before you keep going.',
      'Middle: Use Rules 7 and 8. Watch for quiet signs. Do not rush. Do not go longer than they seem comfortable with.',
      'Closing: When you reach a natural stop, close on purpose. Say something about the conversation: "It was good talking to you." Add a look-ahead: "I will talk to you soon." Let them respond before you leave.',
      'Do not open a new topic after you have started to close.',
    ],
    violation: 'Ending a conversation without saying anything. Starting a new topic after the close has begun.',
    correction: 'If you left without closing, bring it up next time: "I realized I left without saying goodbye properly — that was not on purpose."',
    linkedTerms: [11],
  },
  {
    num: 10, cluster: 'After', color: DC[4],
    title: 'Deploy Your Trigger Inventory',
    theRule: 'Know your triggers before they happen. When one shows up, use your plan right away — before the reaction takes over.',
    defSource: 'Social Trigger (Term 12)',
    protocol: [
      'When you are calm, write down your triggers: the specific thing that sets them off, the first feeling or sign that it is coming, and your plan for what to do.',
      'Read the list at least once a month.',
      'During conversations, watch for those first signs.',
      'At the first sign, use your plan before the reaction goes further.',
      'If the plan is not enough, use a calm exit: "Excuse me for a moment" or "I need a minute."',
      'Do not come back until you are fully calm.',
    ],
    violation: 'Letting a triggered reaction happen in the middle of a conversation without using your plan.',
    correction: 'Leave using the calm exit phrase. Calm down on your own. Come back only when you are fully calm. If it fits, say briefly: "I am sorry for stepping away — I needed a moment."',
    linkedTerms: [12],
  },
  {
    num: 11, cluster: 'After', color: DC[4],
    title: 'Accept Boundaries Without Argument',
    theRule: 'When someone sets a limit — by word or by action — accept it right away. No arguing. Do not try the same thing again.',
    defSource: 'Social Boundary (Term 13)',
    protocol: [
      'Notice limits in both forms. Direct words: "I do not want to talk about that." Quiet signs: changing the subject, pulling back, shorter replies.',
      'Stop the behavior right away when you notice.',
      'Say a short, calm "Okay" or "Got it — I will not do that."',
      'Do not ask why the limit is there.',
      'Do not explain or defend what you did.',
      'Do not try the same thing again in this conversation.',
      'In future conversations, remember this limit is there.',
    ],
    violation: 'Keeping the same behavior going after a limit has been given. Coming back to it in the same or a later conversation.',
    correction: 'Stop right away. Say something brief and genuine about the effect — not your intent: "I understand that was uncomfortable. I will not do that again." Do not drag it out.',
    linkedTerms: [13],
  },
  {
    num: 12, cluster: 'Periodic', color: DC[5],
    title: 'Evaluate Relationships Periodically',
    theRule: 'Every 4 to 6 weeks, score a relationship on 5 things. Use the score to decide how much to invest.',
    defSource: 'Healthy Friendship Pattern (Term 14)',
    protocol: [
      'Score these 5 things: (1) Do you both reach out on your own? (2) Do you both respect limits — both ways? (3) Do you feel safe being yourself? (4) Can you both say what you need without a fight? (5) Have you both given and received support?',
      'Give each one a Yes, Partly, or No.',
      'Scoring: All 5 Yes → invest at the closest level. 3 to 4 Yes → invest at the friend level, keep watching. Fewer than 3 → pull back to a farther ring, talk to your trusted adult first.',
      'Check YOUR OWN behavior against the same 5 things — not only the other person\'s.',
    ],
    violation: 'Investing at a closer level than the score supports. Skipping the check when things feel good — which is exactly when the check matters most.',
    correction: 'Do the check. Move your investment to match the score. Do not tell the person you are doing this — just change how you act.',
    linkedTerms: [14],
  },
  {
    num: 13, cluster: 'Periodic', color: DC[5],
    title: 'Bring Unsafe Patterns to a Trusted Adult',
    theRule: 'If you see 2 or more warning signs in a relationship — including your own behavior — do not try to fix it alone. Tell your trusted adult first.',
    defSource: 'Exploitative or Unsafe Pattern (Term 15) · Manipulation (Term 16)',
    protocol: [
      'Watch for these 5 warning signs: (1) They keep crossing limits even after you said something. (2) They are warm only when you do what they want. (3) They push you away from other people in your life. (4) They use guilt, fear, or pressure to get what they want. (5) They take but do not give back.',
      'If you see 2 or more: Do not get closer. Do not confront them on your own. Do not try to fix it by giving more.',
      'A trusted adult is someone you know and trust, who can help you think clearly, and who holds a caring role — like a counselor, therapist, case manager, family member, or mentor.',
      'Tell them what you saw using facts — say what happened, not what you think it means.',
      'Follow their guidance before you do anything else in that relationship.',
      'Use this rule for YOUR OWN behavior too. If you see warning signs in how you are acting, tell your trusted adult before someone else has to.',
    ],
    violation: 'Staying close to a relationship — or a pattern in yourself — when 2 or more warning signs are there, without talking to anyone.',
    correction: 'Stop investing right away. Write down what you saw. Talk to your trusted adult within 48 hours.',
    linkedTerms: [15, 16],
  },
]
];

// ─── MODULE 4 DATA ────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1, title: 'The Repeated Text', rules: [6, 3], difficulty: 'foundation',
    tags: ['Response Latency', 'Initiation Directionality'],
    text: 'Alex texts Jordan four times in two hours without a reply. Jordan has not initiated contact in two weeks. Each message asks a variation of the same question. Alex describes the situation as urgent.',
    scaffold: 'This scenario involves Rules 6 (response latency) and 3 (initiation directionality). Jordan\'s silence across multiple contacts is a temporal implicit signal. Three consecutive self-initiated contacts with no return initiation is the pause threshold.',
    clusterHint: 'After the Interaction',
    analysis: ['What specific behavior raises a concern?', 'Which rule applies most directly?', 'What should Alex do right now, and for how long?', 'If this were your behavior — what would the correction pathway be?'],
    generalization: 'Is there a relationship in your life where you have initiated contact three or more times without a return initiation?',
    bilateral: 'Have you ever continued messaging someone who went quiet? What was driving that? Urgency, anxiety, or something else?',
  },
  {
    id: 2, title: 'The Changed Subject', rules: [5, 7], difficulty: 'foundation',
    tags: ['Implicit Signals', 'Conversational Balance'],
    text: 'During a conversation, Alex notices that Morgan consistently redirects away from Alex\'s concerns. Morgan\'s replies have become shorter. Morgan has glanced at their phone three times. Alex keeps returning to the same topic.',
    scaffold: 'This scenario involves Rules 5 (implicit signal clusters) and 7 (conversational balance). Multiple implicit signals — shorter replies, subject changes, phone checks — form a collective message requiring adjustment.',
    clusterHint: 'During the Interaction',
    analysis: ['How many implicit signals appear in this scenario?', 'What type of signals are they?', 'What should Alex do when the second signal appears?', 'If you were Alex — would you have noticed these signals? At which point?'],
    generalization: 'Think of a recent conversation where someone\'s engagement dropped. What signals appeared?',
    bilateral: 'Have you ever continued a topic after the other person gave multiple implicit signals of disengagement?',
  },
  {
    id: 3, title: 'The Overshare', rules: [8, 1], difficulty: 'foundation',
    tags: ['Topic Appropriateness', 'Relationship Classification'],
    text: 'Alex discloses a recent medical diagnosis to Sam, a coworker, during their third conversation. Their prior conversations have been brief and work-related. Sam acknowledges the information politely and then changes the subject.',
    scaffold: 'This scenario involves Rules 8 (topic appropriateness) and 1 (classify before engaging). Health topics belong at Ring 4 or 5 on the continuum. Sam is in Ring 2 or 3 based on available evidence.',
    clusterHint: 'Before the Interaction',
    analysis: ['Where does Sam currently sit on the relational proximity continuum?', 'What ring requires health topics to be appropriate?', 'What does Sam\'s subject change communicate?', 'If this were your behavior — what was the pre-communication screen that should have run?'],
    generalization: 'Is there a relationship where you have disclosed at a level that exceeded the category?',
    bilateral: 'Have you ever shared something personal with someone and then sensed the disclosure was too early? What happened next?',
  },
  {
    id: 4, title: 'The Guilt Message', rules: [13, 16], difficulty: 'application',
    tags: ['Manipulation', 'Self-Advocacy vs Manipulation'],
    text: 'After being declined for plans twice, Alex sends a message to Riley: "I guess I\'m just not someone people want to spend time with." Riley immediately replies asking if Alex is okay and offering to reschedule.',
    scaffold: 'This scenario involves Term 16 (manipulation vs self-advocacy) and Rule 13 (unsafe patterns). The message uses guilt induction — framing a personal disappointment as a statement about worth to generate a specific response.',
    clusterHint: 'Evaluation',
    analysis: ['Which manipulation form does this message use?', 'What was the communication\'s actual effect on Riley?', 'What would direct self-advocacy have looked like instead?', 'If this were your behavior — what was the underlying need, and how could it have been communicated directly?'],
    generalization: 'Think of a time you communicated disappointment in a way that was designed to produce a specific response.',
    bilateral: 'What is the difference between expressing genuine disappointment and framing disappointment as a statement that creates obligation?',
  },
  {
    id: 5, title: 'The Conversation Monopoly', rules: [7, 9], difficulty: 'application',
    tags: ['Conversational Balance', 'Interaction Structure'],
    text: 'During a twenty-minute conversation, Alex speaks for approximately sixteen minutes. When Casey speaks, Alex listens briefly and redirects to their own topic. Casey has not asked a question in the last twelve minutes and is giving monosyllabic replies.',
    scaffold: 'Rules 7 (conversational balance) and 5 (implicit signals) apply. Casey\'s monosyllabic replies and twelve-minute silence in questioning are implicit signals. The rule of three has been violated repeatedly — Alex should have asked a genuine question after every three self-referential statements.',
    clusterHint: 'During the Interaction',
    analysis: ['How many implicit signals has Casey sent in this scenario?', 'At what point should Rule 7 have been applied?', 'What specific action should Alex take right now?', 'If you were Alex — when do you typically notice that a conversation has become one-directional?'],
    generalization: 'Think of a recent conversation. What percentage of the time did you speak? Did you ask at least one genuine question?',
    bilateral: 'What topics or emotional states make it hardest for you to monitor conversational balance?',
  },
  {
    id: 6, title: 'The Abrupt Exit', rules: [9, 5], difficulty: 'foundation',
    tags: ['Interaction Structure', 'Implicit Signals'],
    text: 'Alex is mid-conversation with Taylor when Alex notices it is time to leave. Alex says "I have to go" while Taylor is still speaking and walks away. Taylor stands watching with a confused expression.',
    scaffold: 'Rule 9 (interaction structure) applies directly. Every interaction requires a deliberate verbal close: acknowledgment of the exchange and a forward-looking statement. Exiting mid-sentence violates the closing requirement regardless of time pressure.',
    clusterHint: 'During the Interaction',
    analysis: ['Which stage of the interaction structure was skipped?', 'What did Taylor\'s expression communicate?', 'What would a complete closing have looked like in fifteen seconds or fewer?', 'If this were your behavior — what typically causes you to exit an interaction without a close?'],
    generalization: 'Think of your last few conversation endings. Did you deliver a deliberate verbal close each time?',
    bilateral: 'What makes closing interactions difficult? Time pressure, social anxiety, executive function, or something else?',
  },
  {
    id: 7, title: 'The Pushed Boundary', rules: [4, 11], difficulty: 'application',
    tags: ['Explicit Signals', 'Accepting Boundaries'],
    text: 'Jordan tells Alex directly: "I do not want to talk about my family right now." Alex says "Okay" and waits two minutes. Then asks: "So how are things going with your sister?"',
    scaffold: 'Rules 4 (respond to explicit signals immediately) and 11 (accept boundaries without argument) apply. Jordan delivered an explicit signal. Alex acknowledged it verbally but resumed the restricted topic in a modified form within the same interaction.',
    clusterHint: 'During the Interaction',
    analysis: ['What type of signal did Jordan send?', 'Did Alex violate Rule 4, Rule 11, or both?', 'What makes "asking about the sister" a boundary violation even though the exact word "family" was not used?', 'If this were your behavior — what is the honest answer to why the topic was resumed?'],
    generalization: 'Has someone set a limit in a conversation that you later returned to in a modified form?',
    bilateral: 'What is the difference between forgetting a boundary and testing one?',
  },
  {
    id: 8, title: 'The Three-Ring Problem', rules: [1, 2], difficulty: 'challenge',
    tags: ['Relationship Classification', 'Qualify Before Naming'],
    text: 'Alex has spoken with a new coworker five times over three weeks. All conversations were brief and work-related. The coworker has never initiated contact outside of work. Alex describes this person to a friend as "one of my closest friends at the moment."',
    scaffold: 'Rules 1 (classify before engaging) and 2 (qualify before naming) apply. Five brief work conversations place this person at Ring 2 or 3 at most. None of the five friendship-qualifying criteria have been met bilaterally. Labeling them a close friend sets expectations that do not match the relational evidence.',
    clusterHint: 'Before the Interaction',
    analysis: ['Using the five qualification criteria from Rule 2, how many are met bilaterally?', 'Where does this person currently sit on the continuum?', 'What harm can result from labeling a relationship at a higher ring than the evidence supports?', 'If this were your behavior — which part of this person\'s behavior might you be over-interpreting as closeness?'],
    generalization: 'Is there a relationship you have labeled more closely than the observable behavioral evidence supports?',
    bilateral: 'What need does labeling someone as a close friend serve before the evidence is there?',
  },
];

const TRIVIA_Q = [
  // Foundation
  { id: 1, tier: 'foundation', rule: 3,  q: 'What is the minimum number of consecutive self-initiated contacts — with no return initiation — before Rule 3 requires a pause?', a: '3', explanation: 'After three consecutive self-initiated contacts without a return initiation, Rule 3 requires stopping all outreach and reassessing the relational dynamic for a minimum of one week.' },
  { id: 2, tier: 'foundation', rule: 9,  q: 'Name the three stages of a social interaction as defined in Term 11.', a: 'Opening, Maintenance (reciprocal middle), Closing', explanation: 'Every interaction needs a deliberate opening, a reciprocal middle, and a verbal close. An interaction that ends without a close communicates dismissal regardless of intent.' },
  { id: 3, tier: 'foundation', rule: 7,  q: 'Rule 7 uses a ratio to govern conversational balance. What is it?', a: 'Every 3 self-referential statements → 1 genuine question about the other person', explanation: 'The rule of three: for every three statements you make about yourself or your interests, ask at least one genuine, open-ended question about the other person.' },
  { id: 4, tier: 'foundation', rule: 0,  q: 'How many manipulation forms are identified in Term 16?', a: '7', explanation: 'The seven forms are: guilt induction, selective disclosure, emotional escalation, reciprocity exploitation, dependency cultivation, boundary testing, and reframing accountability.' },
  // Application
  { id: 5, tier: 'application', rule: 8, q: 'Someone wants to discuss a health concern with a coworker they have spoken to three times. What does Rule 8\'s relationship category check require before proceeding?', a: 'Health topics require Ring 4 (Friend) or above. Three conversations = Ring 2-3 at most. The check fails. Default to a neutral topic.', explanation: 'The topic screening has two parts: relationship category check and setting check. Both must pass. If either fails, the topic is not appropriate for that context.' },
  { id: 6, tier: 'application', rule: 5, q: 'A person\'s replies get shorter, they glance at their phone twice, and they start changing the subject. What does Rule 5 require at this point?', a: 'Two or more implicit signals in one category — or across categories — form a collective message. Pause the topic and check in.', explanation: 'Rule 5 does not wait for an explicit signal. When two or more implicit signals appear, treat them as a message and adjust — slow down, pause the topic, or check in directly.' },
  { id: 7, tier: 'application', rule: 6, q: 'Someone usually replies within an hour. Today they have not replied after six hours to a non-urgent message. What does Rule 6 require?', a: 'Allow at least 24 hours before any follow-up. Do not send a second message within the window.', explanation: 'Response latency is interpreted relative to individual baseline. A significant change from the person\'s pattern is a signal. Escalating contact when latency increases violates Rule 6.' },
  { id: 8, tier: 'application', rule: 4, q: 'Someone says "I do not want to talk about that." What are the exact four behavioral requirements of Rule 4?', a: 'Stop the behavior immediately. Acknowledge verbally. Do not ask why. Do not revisit the topic in the same interaction.', explanation: 'Explicit signals require immediate compliance — no negotiation, no explanation, no revisiting the restricted topic. Asking "why" is a form of negotiation.' },
  // Challenge
  { id: 9,  tier: 'challenge', rule: 17, q: 'Name the four psychological mechanisms that drive the chase response when someone withdraws from a relationship.', a: 'Intermittent reinforcement (Skinner), attachment alarm activation (Bowlby), scarcity response (Cialdini), cognitive dissonance (Festinger)', explanation: 'The chase is not a choice — it is a conditioned neurological response. All four mechanisms activate simultaneously, which is why the pull to pursue is so strong even when the relationship evidence does not support it.' },
  { id: 10, tier: 'challenge', rule: 16, q: 'What single question determines whether a communication is self-advocacy or manipulation?', a: 'Does this communication give the other person genuine freedom to respond — including the freedom to say no — without guilt, fear, or emotional pressure from me?', explanation: 'This question evaluates the architecture of the communication — what it does to the other person\'s decision-making freedom — not the content or the legitimacy of the underlying need.' },
  { id: 11, tier: 'challenge', rule: 17, q: 'What makes neurological shutdown different from strategic withdrawal in terms of the student\'s responsibility?', a: 'The shutdown is involuntary and not manipulative. But its impact is identical. Responsibility shifts to three zones: proactive disclosure before, minimal signal during when capacity allows, and return acknowledgment after recovery.', explanation: 'The origin of the withdrawal determines whether it is manipulative — not the impact. But the relational equity principle holds: the other person experiences both types identically.' },
  { id: 12, tier: 'challenge', rule: 0,  q: 'A student completes the pre-communication checklist and answers No to Question 3. What does the framework require them to do next?', a: 'Stop immediately. Do not communicate. Bring the need to a trusted adult first. The checklist produces a Red result — consult before proceeding.', explanation: 'Question 3 — acceptance of any response including no — is a Red threshold question. If refusal feels unacceptable, the communication is not structured as self-advocacy and should not proceed.' },
];

const AI_RULES_SUMMARY = `
Rules 1-13 summary:
1. Classify before engaging (use continuum)
2. Qualify before naming (5 criteria bilateral)
3. Monitor initiation directionality (pause at 3 consecutive)
4. Respond to explicit signals immediately
5. Read implicit signal clusters (2+ = adjust)
6. Respect response latency (24hr wait)
7. Maintain conversational balance (3:1 ratio)
8. Screen topics (category + setting check)
9. Structure every interaction (open/middle/close)
10. Deploy trigger inventory
11. Accept boundaries without argument
12. Evaluate relationships periodically (4-6 weeks)
13. Bring unsafe patterns to trusted adult
`.trim();

// ─── UNIVERSAL COMPONENTS ─────────────────────────────────────────────────────

function RegBar({ state }) {
  return (
    <div style={{
      height: 5,
      backgroundColor: regColor(state),
      transition: 'background-color 0.5s ease',
      flexShrink: 0,
    }} />
  );
}

function Header({ title, onBack, onEmergency, onSettings, state }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
      backgroundColor: C.white, flexShrink: 0,
    }}>
      <button
        onClick={onSettings}
        style={{
          width: 40, height: 40, borderRadius: 20,
          border: `1px solid ${C.border}`,
          backgroundColor: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}
        aria-label="Display settings"
      >⚙️</button>

      <div style={{ flex: 1, textAlign: 'center' }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C.interactive, fontSize: 13, fontWeight: 600,
            letterSpacing: 0.3,
          }}>← Back</button>
        )}
        {title && (
          <span style={{ fontSize: 14, fontWeight: 700, color: C.primary, letterSpacing: 0.3 }}>
            {title}
          </span>
        )}
      </div>

      <button
        onClick={onEmergency}
        style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: C.overwhelmed, border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 18,
        }}
        aria-label="Emergency screen"
      >🆘</button>
    </div>
  );
}

function Footer({ onGrounding, state }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
      padding: '10px 16px', borderTop: `1px solid ${C.border}`,
      backgroundColor: C.white, flexShrink: 0,
    }}>
      <button
        onClick={onGrounding}
        style={{
          padding: '8px 16px', borderRadius: 20,
          backgroundColor: 'transparent',
          border: `1px solid ${C.border}`,
          cursor: 'pointer', fontSize: 12,
          color: C.secondary, fontWeight: 600,
          letterSpacing: 0.3,
        }}
        aria-label="Grounding pause"
      >⏸ Pause &amp; Ground</button>
    </div>
  );
}

function Shell({ children, regState, onEmergency, onSettings, onGrounding, title, onBack, noFooter }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: C.bg, overflow: 'hidden',
    }}>
      <RegBar state={regState} />
      <Header
        title={title} onBack={onBack}
        onEmergency={onEmergency} onSettings={onSettings}
        state={regState}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {children}
      </div>
      {!noFooter && <Footer onGrounding={onGrounding} state={regState} />}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      backgroundColor: C.white, borderRadius: 14,
      border: `1px solid ${C.border}`,
      boxShadow: '0 2px 8px rgba(26,39,68,0.07), 0 1px 2px rgba(26,39,68,0.04)',
      padding: '16px', marginBottom: 12,
      ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ label, onClick, variant = 'primary', fullWidth = true, small = false, style = {} }) {
  const base = {
    width: fullWidth ? '100%' : 'auto',
    minHeight: small ? 44 : 52,
    borderRadius: 10, border: 'none',
    cursor: 'pointer', fontWeight: 700,
    fontSize: small ? 14 : 16,
    letterSpacing: 0.2, transition: 'opacity 0.15s',
    padding: small ? '8px 16px' : '12px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    ...style,
  };
  const variants = {
    primary:     { backgroundColor: C.interactive, color: '#fff', boxShadow: '0 3px 10px rgba(61,95,200,0.30)' },
    secondary:   { backgroundColor: 'transparent', color: C.interactive, border: `1.5px solid ${C.interactive}` },
    calm:        { backgroundColor: C.calm, color: '#fff', boxShadow: '0 3px 10px rgba(42,157,143,0.30)' },
    activated:   { backgroundColor: C.activated, color: '#fff' },
    overwhelmed: { backgroundColor: C.overwhelmed, color: '#fff' },
    green:       { backgroundColor: C.green, color: '#fff', boxShadow: '0 3px 10px rgba(42,157,110,0.30)' },
    ghost:       { backgroundColor: 'transparent', color: C.secondary, border: `1px solid ${C.border}` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick}>
      {label}
    </button>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      borderRadius: 20, fontSize: 11, fontWeight: 700,
      backgroundColor: color + '22', color: color,
      letterSpacing: 0.5, textTransform: 'uppercase',
      border: `1px solid ${color}44`,
    }}>{label}</span>
  );
}

function UDLBadge({ label }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px',
      borderRadius: 12, fontSize: 10, fontWeight: 700,
      backgroundColor: '#EEF2F6', color: C.secondary,
      border: `1px solid ${C.border}`,
      letterSpacing: 0.4, marginRight: 4, marginBottom: 4,
    }}>UDL: {label}</span>
  );
}

// ─── OVERLAYS ─────────────────────────────────────────────────────────────────

function GroundingOverlay({ onClose, onEmergency, regState }) {
  const [step, setStep] = useState(0);
  const steps = [
    {
      icon: '🫁',
      title: 'Feel your feet on the floor.',
      body: 'Press them down. Notice the pressure. You are here.',
    },
    {
      icon: '👁️',
      title: 'Name one thing you can see.',
      body: 'Look around. Pick one object. Say its name — out loud or in your head.',
    },
    {
      icon: '✋',
      title: 'Notice what your hands feel.',
      body: 'Are they warm or cool? Tight or loose? Just notice.',
    },
  ];
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundColor: 'rgba(27,58,92,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 20,
    }}>
      <div style={{
        backgroundColor: C.white, borderRadius: 16,
        padding: 24, width: '100%', maxWidth: 340,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 12 }}>
          GROUNDING PAUSE
        </div>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>
          {steps[step].icon}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 8, textAlign: 'center' }}>
          {steps[step].title}
        </div>
        <div style={{ fontSize: 15, color: C.secondary, lineHeight: 1.6, textAlign: 'center', marginBottom: 20 }}>
          {steps[step].body}
        </div>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          {step < steps.length - 1 ? (
            <Btn label="Next →" onClick={() => setStep(s => s + 1)} variant="primary" />
          ) : (
            <Btn label="Return to where I was" onClick={onClose} variant="calm" />
          )}
          <Btn label="I need more help →" onClick={onEmergency} variant="ghost" small />
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
          <UDLBadge label="Engagement 9.2" />
          <UDLBadge label="Expression 4.1" />
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, onChange, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundColor: 'rgba(27,58,92,0.7)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',
      zIndex: 100, padding: 0,
    }}>
      <div style={{
        backgroundColor: C.white, width: '80%', maxWidth: 300,
        height: '100%', padding: 24,
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.primary }}>Display Settings</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.secondary }}>✕</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>TEXT SIZE</div>
          {['standard', 'large', 'xlarge'].map(size => (
            <button
              key={size}
              onClick={() => onChange({ ...settings, fontSize: size })}
              style={{
                display: 'block', width: '100%', padding: '10px 12px',
                marginBottom: 6, borderRadius: 8, cursor: 'pointer',
                border: `1.5px solid ${settings.fontSize === size ? C.interactive : C.border}`,
                backgroundColor: settings.fontSize === size ? C.interactive + '11' : 'transparent',
                color: settings.fontSize === size ? C.interactive : C.primary,
                fontWeight: settings.fontSize === size ? 700 : 400,
                textAlign: 'left', fontSize: 14,
              }}
            >
              {size === 'standard' ? 'Standard (Aa)' : size === 'large' ? 'Large (Aa)' : 'Extra Large (Aa)'}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>MODES</div>
          {[
            { key: 'highContrast', label: 'High Contrast Mode', desc: 'Dark background, light text' },
            { key: 'reducedVisual', label: 'Reduced Visual Mode', desc: 'Essential content only' },
            { key: 'activatedMode', label: 'Activated Mode', desc: 'Symbol + 2 words per prompt' },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              onClick={() => onChange({ ...settings, [key]: !settings[key] })}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{label}</div>
                <div style={{ fontSize: 12, color: C.secondary }}>{desc}</div>
              </div>
              <div style={{
                width: 40, height: 22, borderRadius: 11,
                backgroundColor: settings[key] ? C.interactive : C.border,
                position: 'relative', transition: 'background-color 0.2s',
                flexShrink: 0, marginLeft: 12,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9,
                  backgroundColor: '#fff',
                  position: 'absolute', top: 2,
                  left: settings[key] ? 20 : 2,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <UDLBadge label="Representation 1.1" />
            <UDLBadge label="Expression 4.1" />
            <UDLBadge label="Engagement 7.3" />
          </div>
        </div>
      </div>
      <div onClick={onClose} style={{ flex: 1, height: '100%' }} />
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function HomeScreen({ navigate, regState, goal }) {
  const steps = [
    {
      num: 1, icon: '📖', screen: 'module1',
      title: 'My Reference',
      sub: '13 Rules · 17 Definitions',
      purpose: 'Learn the rules and definitions. This is where every session starts.',
      note: 'Start here — every session',
      noteColor: C.calm,
      color: C.interactive,
    },
    {
      num: 2, icon: '🎯', screen: 'module4',
      title: 'Practice',
      sub: 'Scenarios · Flashcards · Trivia',
      purpose: 'See what you know before you use it for real.',
      color: DC[3],
    },
    {
      num: 3, icon: '✉️', screen: 'module2-anchor',
      title: 'Before I Communicate',
      sub: '5-Question Checklist',
      purpose: 'Use the rules before you text or say something to someone.',
      color: DC[5],
    },
    {
      num: 4, icon: '📊', screen: 'module3',
      title: 'My Tracker',
      sub: 'Self-Audit · Journals · Logs',
      purpose: 'Look back at what you did. Track what you notice over time.',
      color: DC[4],
    },
  ];

  return (
    <div>
      {/* Identity banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1A2744 0%, #3D5FC8 100%)',
        borderRadius: 16, padding: '18px 18px 16px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: 4 }}>
          YOUR PERSONAL FRAMEWORK
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
          The Art of Friendship
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
          A structured path for developing relationship skills.
        </div>
      </div>

      {/* ── LEARNING PATH (primary) ── */}
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 4 }}>
          YOUR LEARNING PATH
        </div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5, marginBottom: 14 }}>
          Do these in order. Each step builds on the one before it.
        </div>

        {steps.map((step, i) => (
          <div key={step.num} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            {/* Step indicator + connector line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                backgroundColor: step.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff',
                boxShadow: `0 3px 10px ${step.color}40`,
              }}>{step.num}</div>
              {i < steps.length - 1 && (
                <div style={{ width: 2, flex: 1, backgroundColor: C.border, marginTop: 4, minHeight: 16 }} />
              )}
            </div>

            {/* Step card */}
            <button
              onClick={() => navigate(step.screen)}
              style={{
                flex: 1, textAlign: 'left', backgroundColor: C.white,
                border: `1px solid ${C.border}`, borderLeft: `3px solid ${step.color}`,
                borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                marginBottom: i < steps.length - 1 ? 0 : 0,
                boxShadow: '0 1px 4px rgba(26,39,68,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{step.icon} {step.title}</span>
                <span style={{ fontSize: 16, color: C.border, marginLeft: 6 }}>›</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: step.color, marginBottom: 4 }}>{step.sub}</div>
              <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{step.purpose}</div>
              {step.note && (
                <div style={{ marginTop: 6, display: 'inline-block', backgroundColor: step.noteColor + '18', border: `1px solid ${step.noteColor}40`, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, color: step.noteColor }}>
                  {step.note}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* ── QUICK ACCESS (secondary) ── */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 4 }}>
          QUICK ACCESS
        </div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5, marginBottom: 12 }}>
          Know the rules already? Use them now.
        </div>
        {[
          { label: '💬 I want to text or say something to someone', screen: 'module2-anchor', color: C.interactive },
          { label: '🗣 I am talking to someone right now',   screen: 'module2-anchor', color: C.calm },
          { label: '🔁 I just finished talking to someone',     screen: 'navigator',       color: DC[4] },
          { label: '❓ I am not sure',                    screen: 'regulation',      color: C.secondary },
        ].map(({ label, screen, color }, i) => (
          <button key={i} onClick={() => navigate(screen)} style={{
            display: 'block', width: '100%', minHeight: 48,
            backgroundColor: C.white, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${color}`, borderRadius: 10,
            padding: '11px 14px', cursor: 'pointer', textAlign: 'left',
            fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 8,
          }}>{label}</button>
        ))}
      </div>

      {/* Weekly goal */}
      {goal && (
        <Card style={{ borderLeft: `4px solid ${C.calm}`, marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.5, marginBottom: 6 }}>THIS WEEK'S GOAL</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.5 }}>{goal}</div>
        </Card>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.1" />
        <UDLBadge label="Rep 3.2" />
        <UDLBadge label="Engagement 8.1" />
      </div>

      {/* Legal footer */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: C.secondary }}>CC BY-NC 4.0 · Catrina Wright · 2026</div>
        <button onClick={() => navigate('legal')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive, textDecoration: 'underline' }}>About &amp; Legal</button>
      </div>
    </div>
  );
}

function NavigatorScreen({ navigate, setDest }) {
  const goToTool = (dest) => { setDest(dest); navigate('module3-gate'); };
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>
        Post-Interaction
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        You just finished an interaction. Choose where you want to go.
      </div>
      {[
        { label: '🔍 Self-Audit — Review the interaction',       dest: 'module3-audit'      },
        { label: '📓 Bilateral Journal — Record what I noticed', dest: 'module3-journal'    },
        { label: '📋 Rule I Applied Today — Log one application', dest: 'module3-applied'  },
        { label: '💡 Something else',                            dest: null                 },
      ].map(({ label, dest }, i) => (
        <button
          key={i}
          onClick={() => dest ? goToTool(dest) : navigate('home')}
          style={{
            display: 'block', width: '100%', minHeight: 56,
            backgroundColor: C.white, border: `1.5px solid ${C.border}`,
            borderRadius: 10, padding: '14px 16px',
            cursor: 'pointer', textAlign: 'left',
            fontSize: 15, fontWeight: 600, color: C.primary,
            marginBottom: 10,
          }}
        >
          {label}
        </button>
      ))}
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.1" />
        <UDLBadge label="Expression 5.1" />
      </div>
    </div>
  );
}

function RegulationScreen({ navigate, onSetReg, regState }) {
  const states = [
    {
      key: 'calm',
      color: C.calm,
      icon: '🟢',
      label: 'Calm',
      desc: 'I can read and think clearly. My thoughts feel steady.',
      proceed: true,
    },
    {
      key: 'activated',
      color: C.activated,
      icon: '🟡',
      label: 'Activated',
      desc: 'My thoughts feel fast or stuck. I can keep going but it takes more work.',
      proceed: true,
    },
    {
      key: 'overwhelmed',
      color: C.overwhelmed,
      icon: '🔴',
      label: 'Overwhelmed',
      desc: 'I cannot process right now. Reading and thinking feel out of reach.',
      proceed: false,
    },
  ];

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>
        Before you continue
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Check in with yourself. Pick the one that fits right now.
      </div>

      {states.map(({ key, color, icon, label, desc, proceed }) => (
        <button
          key={key}
          onClick={() => {
            onSetReg(key);
            if (proceed) navigate('home');
            else navigate('overwhelmed-stop');
          }}
          style={{
            display: 'block', width: '100%',
            backgroundColor: C.white,
            border: `2px solid ${regState === key ? color : C.border}`,
            borderRadius: 12, padding: '16px',
            cursor: 'pointer', textAlign: 'left', marginBottom: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color }}>{label}</span>
          </div>
          <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.5, paddingLeft: 32 }}>
            {desc}
          </div>
        </button>
      ))}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 9.1" />
        <UDLBadge label="Engagement 9.2" />
        <UDLBadge label="Representation 1.3" />
      </div>
    </div>
  );
}

function OverwhelmedStop({ navigate, onEmergency }) {
  return (
    <div style={{ paddingTop: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🛑</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.overwhelmed, marginBottom: 12 }}>
        Stop here.
      </div>
      <Card style={{ textAlign: 'left', borderLeft: `4px solid ${C.overwhelmed}` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 8 }}>
          You do not have to do anything right now.
        </div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
          Close this app. Find a safe, quiet place. Do one thing that feels comfortable.
          Come back when you are ready.
        </div>
      </Card>
      <Card style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.secondary, marginBottom: 10, letterSpacing: 0.4 }}>
          WHEN YOU ARE READY, YOU CAN:
        </div>
        <Btn label="Use the Grounding Pause" onClick={() => navigate('grounding')} variant="secondary" style={{ marginBottom: 8 }} />
        <Btn label="Go to Emergency Screen" onClick={onEmergency} variant="ghost" small />
      </Card>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <UDLBadge label="Engagement 9.1" />
        <UDLBadge label="Engagement 9.2" />
      </div>
    </div>
  );
}

function EmergencyScreen({ navigate }) {
  return (
    <div style={{
      backgroundColor: C.overwhelmed,
      minHeight: '100%',
      padding: 24,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 20 }}>
        ANCHOR SCREEN
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12, padding: 20, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 8 }}>
          STEP 1 — GROUND YOURSELF
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
          Press your feet into the floor. Feel the pressure. You are here.
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12, padding: 20, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 8 }}>
          STEP 2 — PERMISSION
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
          You do not have to do anything right now. You are allowed to be still.
        </div>
      </div>

      <div style={{
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 12, padding: 20, marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 8 }}>
          STEP 3 — WHEN READY
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', lineHeight: 1.5, marginBottom: 12 }}>
          Text your trusted adult one word:
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 8, padding: '10px 16px',
          fontSize: 24, fontWeight: 800, color: '#fff',
          textAlign: 'center', letterSpacing: 2,
        }}>
          "SHUTDOWN"
        </div>
      </div>

      <button
        onClick={() => navigate('home')}
        style={{
          backgroundColor: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)',
          borderRadius: 10, padding: '14px', color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 'auto',
        }}
      >
        Return when you are ready
      </button>

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 0.4 }}>
          UDL: Engagement 9.1 · 9.2 · Expression 4.1
        </span>
      </div>
    </div>
  );
}

// ─── MODULE 2 SCREENS ─────────────────────────────────────────────────────────

function Module2Anchor({ navigate, settings }) {
  const isActivated = settings.activatedMode;
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>
        Before I Communicate
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 14 }}>
        Five questions before you send or say anything.
      </div>

      {/* Rule prerequisite prompt */}
      <div style={{
        backgroundColor: C.interactive + '0C', border: `1px solid ${C.interactive}40`,
        borderRadius: 10, padding: '10px 14px', marginBottom: 16,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.interactive, marginBottom: 2 }}>STEP 2 OF 4</div>
          <div style={{ fontSize: 13, color: C.primary }}>This checklist uses the rules. Know the rules before you start.</div>
        </div>
        <button onClick={() => navigate('module1')} style={{
          flexShrink: 0, marginLeft: 12, padding: '6px 12px', borderRadius: 8,
          border: `1px solid ${C.interactive}60`, backgroundColor: C.interactive + '18',
          cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive,
        }}>Rules →</button>
      </div>

      {/* Physical anchor reminder */}
      <div style={{
        backgroundColor: C.calm + '18',
        border: `1.5px solid ${C.calm}`,
        borderRadius: 12, padding: 16, marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>
          ANCHOR REMINDER
        </div>
        <div style={{ fontSize: 15, color: C.primary, fontWeight: 600 }}>
          Touch your anchor object now — before you begin.
        </div>
        <div style={{ fontSize: 13, color: C.secondary, marginTop: 4 }}>
          The physical object. Hold it for a moment.
        </div>
      </div>

      {/* Format selection */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>
          CHOOSE YOUR FORMAT FOR TODAY
        </div>
        <Btn
          label={isActivated ? '⚡ Activated Mode (symbol + 2 words)' : '⚡ Switch to Activated Mode'}
          onClick={() => {}}
          variant={isActivated ? 'activated' : 'secondary'}
          style={{ marginBottom: 8 }}
        />
        {isActivated && (
          <div style={{ fontSize: 13, color: C.secondary, padding: '8px 0' }}>
            Activated mode is on. Each question shows a symbol and two words. Large buttons only.
          </div>
        )}
      </div>

      <Btn
        label="Start the checklist →"
        onClick={() => navigate('module2-q1')}
        variant="primary"
      />

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Representation 2.4" />
        <UDLBadge label="Expression 4.1" />
        <UDLBadge label="Engagement 7.3" />
      </div>
    </div>
  );
}

function Module2Question({ qNum, navigate, answers, onAnswer, settings }) {
  const q = QUESTIONS[qNum - 1];
  const isActivated = settings.activatedMode;
  const [showNo, setShowNo] = useState(false);

  const handleYes = () => {
    onAnswer(qNum, true);
    if (qNum < 5) navigate(`module2-q${qNum + 1}`);
    else navigate('module2-result');
  };

  const handleNo = () => {
    onAnswer(qNum, false);
    setShowNo(true);
  };

  const handleContinue = () => {
    if (q.noType === 'red') navigate('module2-result');
    else if (qNum < 5) navigate(`module2-q${qNum + 1}`);
    else navigate('module2-result');
  };

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: `${(qNum / 5) * 100}%`, height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>
          Question {qNum} of 5
        </span>
      </div>

      {showNo ? (
        // No response screen
        <div>
          <div style={{
            backgroundColor: q.noType === 'red' ? C.redBg : C.amberBg,
            border: `1.5px solid ${q.noType === 'red' ? C.red : C.amber}`,
            borderRadius: 12, padding: 20, marginBottom: 20,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: q.noType === 'red' ? C.red : C.amber, letterSpacing: 0.4, marginBottom: 8 }}>
              {q.noType === 'red' ? '🛑 STOP' : '⚠️ RESTRUCTURE FIRST'}
            </div>
            <div style={{ fontSize: 15, color: C.primary, lineHeight: 1.6 }}>
              {q.noAction}
            </div>
          </div>
          {q.noType === 'red' ? (
            <Btn label="See my result" onClick={handleContinue} variant="overwhelmed" />
          ) : (
            <>
              <Btn label="I have restructured — continue →" onClick={handleContinue} variant="activated" style={{ marginBottom: 8 }} />
              <Btn label="Go back to this question" onClick={() => setShowNo(false)} variant="ghost" small />
            </>
          )}
        </div>
      ) : isActivated ? (
        // Activated mode
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{q.symbol}</div>
          <div style={{
            fontSize: 24, fontWeight: 800, color: C.primary,
            lineHeight: 1.3, marginBottom: 24,
            whiteSpace: 'pre-line',
          }}>
            {q.short}
          </div>
          <Btn label="✓  Yes" onClick={handleYes} variant="calm" style={{ marginBottom: 12, fontSize: 20, minHeight: 64 }} />
          <Btn label="✗  No" onClick={handleNo} variant="ghost" style={{ fontSize: 20, minHeight: 64 }} />
        </div>
      ) : (
        // Standard mode
        <div>
          <Card>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.primary, lineHeight: 1.3, marginBottom: 12 }}>
              {q.full}
            </div>
            <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
              {q.sub}
            </div>
          </Card>
          <Btn label={`✓  ${q.yesLabel}`} onClick={handleYes} variant="calm" style={{ marginBottom: 10 }} />
          <Btn label={`✗  ${q.noLabel}`} onClick={handleNo} variant="secondary" />
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 1.1" />
        <UDLBadge label="Expr 5.1" />
        <UDLBadge label="Engagement 7.3" />
      </div>
    </div>
  );
}

function Module2Result({ navigate, answers }) {
  const light = calcTrafficLight(answers);

  const config = {
    green: {
      color: C.green, bg: C.greenBg, icon: '🟢',
      title: 'Proceed',
      body: 'Your checklist is clear. This communication is structured as self-advocacy.',
      mastery: 'You ran every check before communicating — that is the framework working exactly as designed.',
    },
    amber: {
      color: C.amber, bg: C.amberBg, icon: '🟡',
      title: 'Restructure First',
      body: 'One or more questions showed something to address. Restructure your communication before delivering it.',
      mastery: 'You caught a pattern before it reached the other person. That is what this checklist is for.',
    },
    red: {
      color: C.red, bg: C.redBg, icon: '🔴',
      title: 'Consult Your Trusted Adult First',
      body: 'This communication is not ready. Bring your need to your trusted adult before proceeding. Do not communicate until you do.',
      mastery: 'Stopping here required honesty about a difficult answer. That honesty is the most important skill in this framework.',
    },
  }[light];

  return (
    <div style={{ paddingTop: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 12 }}>{config.icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: config.color, marginBottom: 8 }}>
        {config.title}
      </div>

      <Card style={{ textAlign: 'left', borderLeft: `4px solid ${config.color}`, marginBottom: 16 }}>
        <div style={{ fontSize: 15, color: C.primary, lineHeight: 1.6 }}>{config.body}</div>
      </Card>

      <Card style={{ backgroundColor: config.bg, borderColor: config.color + '44', textAlign: 'left' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: config.color, letterSpacing: 0.5, marginBottom: 6 }}>
          WHAT THIS MEANS
        </div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6, fontStyle: 'italic' }}>
          "{config.mastery}"
        </div>
      </Card>

      {/* Checklist summary */}
      <div style={{ textAlign: 'left', marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>
          YOUR ANSWERS
        </div>
        {QUESTIONS.map(q => (
          <div key={q.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 0', borderBottom: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: 16 }}>{answers[q.id] ? '✅' : '❌'}</span>
            <span style={{ fontSize: 13, color: C.primary, flex: 1 }}>Q{q.id}: {q.full}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <Btn label="Return home" onClick={() => navigate('home')} variant="primary" style={{ marginBottom: 8 }} />
        <Btn label="Prepare for This (upcoming situation)" onClick={() => navigate('module2-prepare')} variant="secondary" small />
      </div>

      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        <UDLBadge label="Engagement 8.4" />
        <UDLBadge label="Engagement 9.3" />
      </div>
    </div>
  );
}

function Module2Prepare({ navigate }) {
  const [situation, setSituation] = useState('');
  const [category, setCategory] = useState('');
  const [showPrep, setShowPrep] = useState(false);

  const categories = [
    'Acquaintance (Ring 2)',
    'Casual Friend (Ring 3)',
    'Friend (Ring 4)',
    'Trusted Friend (Ring 5)',
  ];

  const prepItems = situation && category ? [
    `Rule cluster: During the Interaction (Rules 4, 5, 7, 9)`,
    `Match disclosure to: ${category}`,
    `Watch for: shortened responses, body turning, response latency`,
    `Closing sequence: acknowledge + forward-looking statement`,
    `Trigger strategy: have your regulation plan ready before you begin`,
  ] : [];

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>
        Prepare for This
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Describe an upcoming social situation. I will generate a preparation checklist for you.
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>
          DESCRIBE THE SITUATION
        </div>
        <textarea
          value={situation}
          onChange={e => setSituation(e.target.value)}
          placeholder="e.g. I want to text someone I met last week to ask if they want to get coffee..."
          style={{
            width: '100%', border: `1.5px solid ${C.border}`,
            borderRadius: 8, padding: '10px 12px', fontSize: 14,
            color: C.primary, lineHeight: 1.5, resize: 'none',
            fontFamily: 'system-ui', minHeight: 80,
            boxSizing: 'border-box',
          }}
        />
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>
          RELATIONSHIP CATEGORY
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              display: 'block', width: '100%', padding: '10px 12px',
              marginBottom: 6, borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${category === cat ? C.interactive : C.border}`,
              backgroundColor: category === cat ? C.interactive + '11' : 'transparent',
              color: category === cat ? C.interactive : C.primary,
              fontWeight: category === cat ? 700 : 400,
              textAlign: 'left', fontSize: 14,
            }}
          >{cat}</button>
        ))}
      </Card>

      <Btn
        label="Generate preparation checklist →"
        onClick={() => situation && category && setShowPrep(true)}
        variant={situation && category ? 'primary' : 'ghost'}
        style={{ marginBottom: 12 }}
      />

      {showPrep && prepItems.length > 0 && (
        <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 12 }}>
            YOUR PREPARATION CHECKLIST
          </div>
          {prepItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{ color: C.calm, fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 14, color: C.primary, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 12, color: C.secondary, fontStyle: 'italic' }}>
            AI-powered preparation based on your framework rules. Powered by Anthropic API.
          </div>
        </Card>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Expression 6.2" />
        <UDLBadge label="Rep 3.4" />
        <UDLBadge label="Engagement 7.2" />
      </div>
    </div>
  );
}

function PlaceholderScreen({ title, description, navigate }) {
  return (
    <div style={{ paddingTop: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 24 }}>
        {description}
      </div>
      <Card style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>
          WIREFRAME NOTE
        </div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6 }}>
          This screen is part of the complete app architecture. Its UDL specifications are fully documented in the wireframe map. It will be built in the next development phase.
        </div>
      </Card>
      <Btn label="← Return home" onClick={() => navigate('home')} variant="secondary" style={{ marginTop: 16 }} />
    </div>
  );
}

// ─── MODULE 1 SCREENS ────────────────────────────────────────────────────────

function Module1Home({ navigate, setSelectedTerm, settings }) {
  const [tab, setTab] = useState('rules');
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState(0);
  const [activeCluster, setActiveCluster] = useState('All');

  const filteredTerms = TERMS.filter(t => {
    const matchDomain = activeDomain === 0 || t.domainNum === activeDomain;
    const matchQuery = !query || t.name.toLowerCase().includes(query.toLowerCase()) || t.plain.toLowerCase().includes(query.toLowerCase());
    return matchDomain && matchQuery;
  });

  const filteredRules = RULES_FULL.filter(r => {
    const matchCluster = activeCluster === 'All' || r.cluster === activeCluster;
    const matchQuery = !query || r.title.toLowerCase().includes(query.toLowerCase()) || r.theRule.toLowerCase().includes(query.toLowerCase()) || r.protocol.some(s => s.toLowerCase().includes(query.toLowerCase()));
    return matchCluster && matchQuery;
  });

  const clusterLabel = { Before: 'Before the Interaction', During: 'During the Interaction', After: 'After the Interaction', Periodic: 'Periodic Evaluation' };

  return (
    <div style={{ paddingTop: 4 }}>
      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, backgroundColor: C.border + '60', borderRadius: 12, padding: 4 }}>
        {[['definitions', '📖 Definitions', 17], ['rules', '📋 Rules', 13]].map(([id, label, count]) => (
          <button key={id} onClick={() => { setTab(id); setQuery(''); }} style={{
            flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', border: 'none',
            backgroundColor: tab === id ? C.white : 'transparent',
            color: tab === id ? C.primary : C.secondary,
            fontWeight: tab === id ? 700 : 500, fontSize: 13,
            boxShadow: tab === id ? '0 1px 4px rgba(26,39,68,0.10)' : 'none',
            transition: 'all 0.15s',
          }}>
            {label} <span style={{ fontSize: 10, opacity: 0.55 }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Shared search */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
        <input type="text"
          placeholder={tab === 'definitions' ? 'Search definitions...' : 'Search rules by title or keyword...'}
          value={query} onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: '11px 12px 11px 36px', border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box', backgroundColor: C.white, outline: 'none' }}
        />
      </div>

      {/* ── DEFINITIONS TAB ── */}
      {tab === 'definitions' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {[{ id: 0, label: 'All' }, ...Object.entries(DOMAIN_LABELS).map(([k, v]) => ({ id: Number(k), label: v }))].map(({ id, label }) => (
              <button key={id} onClick={() => setActiveDomain(id)} style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 20,
                border: `1.5px solid ${activeDomain === id ? (id === 0 ? C.interactive : DC[id]) : C.border}`,
                backgroundColor: activeDomain === id ? (id === 0 ? C.interactive : DC[id]) + '18' : 'transparent',
                color: activeDomain === id ? (id === 0 ? C.interactive : DC[id]) : C.secondary,
                cursor: 'pointer', fontSize: 12, fontWeight: activeDomain === id ? 700 : 500, whiteSpace: 'nowrap',
              }}>{label}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>
            {filteredTerms.length} {filteredTerms.length === 1 ? 'DEFINITION' : 'DEFINITIONS'}
          </div>
          {filteredTerms.map(term => (
            <button key={term.id} onClick={() => { setSelectedTerm(term.id); navigate('module1-term'); }} style={{
              display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white,
              border: `1px solid ${C.border}`, borderLeft: `4px solid ${DC[term.domainNum]}`,
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
              boxShadow: '0 1px 4px rgba(26,39,68,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{term.metaphor.symbol} {term.name}</span>
                <span style={{ fontSize: 18, color: C.border, marginLeft: 8 }}>›</span>
              </div>
              <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{term.plain}</div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: DC[term.domainNum], backgroundColor: DC[term.domainNum] + '18', padding: '2px 8px', borderRadius: 10 }}>{DOMAIN_LABELS[term.domainNum]}</span>
              </div>
            </button>
          ))}
          {filteredTerms.length === 0 && <Card><div style={{ textAlign: 'center', color: C.secondary, fontSize: 14, padding: '16px 0' }}>No definitions match your search.</div></Card>}
        </>
      )}

      {/* ── RULES TAB ── */}
      {tab === 'rules' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'All', color: C.interactive },
              { id: 'Before', color: DC[1] },
              { id: 'During', color: DC[3] },
              { id: 'After', color: DC[4] },
              { id: 'Periodic', color: DC[5] },
            ].map(({ id, color }) => (
              <button key={id} onClick={() => setActiveCluster(id)} style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 20,
                border: `1.5px solid ${activeCluster === id ? color : C.border}`,
                backgroundColor: activeCluster === id ? color + '18' : 'transparent',
                color: activeCluster === id ? color : C.secondary,
                cursor: 'pointer', fontSize: 12, fontWeight: activeCluster === id ? 700 : 500, whiteSpace: 'nowrap',
              }}>{id}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>
            {filteredRules.length} {filteredRules.length === 1 ? 'RULE' : 'RULES'}
          </div>
          {filteredRules.map(rule => (
            <button key={rule.num} onClick={() => navigate('module1-rule-' + rule.num)} style={{
              display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white,
              border: `1px solid ${C.border}`, borderLeft: `4px solid ${rule.color}`,
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
              boxShadow: '0 1px 4px rgba(26,39,68,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: rule.color, backgroundColor: rule.color + '18', padding: '2px 7px', borderRadius: 8, flexShrink: 0 }}>Rule {rule.num}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{rule.title}</span>
                </div>
                <span style={{ fontSize: 18, color: C.border, marginLeft: 8, flexShrink: 0 }}>›</span>
              </div>
              <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>
                {rule.theRule.length > 110 ? rule.theRule.substring(0, 110) + '...' : rule.theRule}
              </div>
              <div style={{ marginTop: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: rule.color, backgroundColor: rule.color + '18', padding: '2px 8px', borderRadius: 10 }}>
                  {clusterLabel[rule.cluster]}
                </span>
              </div>
            </button>
          ))}
          {filteredRules.length === 0 && <Card><div style={{ textAlign: 'center', color: C.secondary, fontSize: 14, padding: '16px 0' }}>No rules match your search.</div></Card>}
          <button onClick={() => navigate('module1-map')} style={{ display: 'block', width: '100%', padding: '11px', borderRadius: 10, border: `1px solid ${C.border}`, backgroundColor: C.white, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.secondary, marginTop: 4 }}>
            🗺 Framework Map →
          </button>
        </>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 2.5" />
        <UDLBadge label="Rep 2.1" />
        <UDLBadge label="Expr 6.3" />
        <UDLBadge label="Engagement 7.2" />
      </div>
    </div>
  );
}

function Module1TermDetail({ navigate, termId, settings }) {
  const [activeTab, setActiveTab] = useState('text');
  const [audioState, setAudioState] = useState('idle'); // idle | playing | done
  const [showActivation, setShowActivation] = useState(true);
  const term = TERMS.find(t => t.id === termId) || TERMS[0];

  const handleAudio = () => {
    setAudioState('playing');
    setTimeout(() => setAudioState('done'), 1800);
  };

  const tabs = [
    { id: 'text', label: '📖 Define' },
    { id: 'visual', label: '🎨 See' },
    { id: 'audio', label: '🔊 Hear' },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      {/* Term header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{term.metaphor.symbol}</span>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>{term.name}</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], backgroundColor: DC[term.domainNum] + '18', padding: '2px 8px', borderRadius: 10 }}>
              {DOMAIN_LABELS[term.domainNum]}
            </span>
          </div>
        </div>
      </div>

      {/* Activation prompt */}
      {showActivation && (
        <div style={{
          backgroundColor: DC[term.domainNum] + '14',
          border: `1.5px solid ${DC[term.domainNum]}44`,
          borderRadius: 12, padding: 14, marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], letterSpacing: 0.4, marginBottom: 6 }}>
            BEFORE YOU READ — CONNECT WHAT YOU KNOW
          </div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6, marginBottom: 12 }}>
            {term.activationPrompt}
          </div>
          <button onClick={() => setShowActivation(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, color: DC[term.domainNum],
          }}>
            I reflected on this — show me the definition ›
          </button>
        </div>
      )}

      {/* Three representation layer tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: '9px 4px',
              border: 'none', borderBottom: `2.5px solid ${activeTab === tab.id ? DC[term.domainNum] : 'transparent'}`,
              backgroundColor: 'transparent', cursor: 'pointer',
              fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? DC[term.domainNum] : C.secondary,
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* TEXT layer */}
      {activeTab === 'text' && (
        <div>
          <Card style={{ borderLeft: `4px solid ${DC[term.domainNum]}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], letterSpacing: 0.4, marginBottom: 6 }}>PLAIN LANGUAGE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.5 }}>{term.plain}</div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>WORKING DEFINITION</div>
            <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{term.definition}</div>
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.activated, letterSpacing: 0.4, marginBottom: 6 }}>BOUNDARY CLAUSE — WHAT THIS IS NOT</div>
            <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{term.boundary}</div>
          </Card>
          <Card style={{ backgroundColor: C.primary + '08', borderColor: C.primary + '30' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 0.4, marginBottom: 6 }}>RULE ANCHOR</div>
            <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, fontStyle: 'italic' }}>"{term.ruleAnchor}"</div>
          </Card>
        </div>
      )}

      {/* VISUAL layer */}
      {activeTab === 'visual' && (
        <div>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 12 }}>{term.metaphor.symbol}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginBottom: 8 }}>{term.metaphor.concept}</div>
            <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>{term.metaphor.explanation}</div>
          </Card>
          <Card style={{ backgroundColor: DC[term.domainNum] + '08', borderColor: DC[term.domainNum] + '30' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], letterSpacing: 0.4, marginBottom: 6 }}>
              WHAT THIS METAPHOR DOES NOT MEAN
            </div>
            <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>
              {term.boundary.split('.')[0] + '.'}
            </div>
          </Card>
          <Card>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.secondary, lineHeight: 1.6 }}>
              💡 Metaphors are a starting point — not the full definition. Use the 📖 Define tab for the complete working definition and boundary clause.
            </div>
          </Card>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <UDLBadge label="Rep 1.3" />
            <UDLBadge label="Rep 2.5" />
          </div>
        </div>
      )}

      {/* AUDIO layer */}
      {activeTab === 'audio' && (
        <div>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: C.secondary, marginBottom: 16, lineHeight: 1.6 }}>
              Audio available when you cannot process text. Under 90 seconds. Plain language only.
            </div>
            {audioState === 'idle' && (
              <button onClick={handleAudio} style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: DC[term.domainNum], border: 'none',
                cursor: 'pointer', fontSize: 32, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>▶</button>
            )}
            {audioState === 'playing' && (
              <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.calm + '22', border: `2px solid ${C.calm}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
                🎵
              </div>
            )}
            {audioState === 'done' && (
              <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.calm + '22', border: `2px solid ${C.calm}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
                ✓
              </div>
            )}
            <div style={{ fontSize: 12, color: C.secondary }}>
              {audioState === 'idle' ? 'Tap to play' : audioState === 'playing' ? 'Playing...' : 'Complete'}
            </div>
          </Card>

          {audioState !== 'idle' && (
            <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 8 }}>TRANSCRIPT</div>
              <div style={{ fontSize: 15, color: C.primary, lineHeight: 1.8 }}>{term.audioText}</div>
            </Card>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <UDLBadge label="Rep 1.2" />
            <UDLBadge label="Expr 5.1" />
          </div>
        </div>
      )}

      {/* Rule link */}
      <button onClick={() => navigate('module1-rules')} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '12px 14px', marginTop: 8,
        backgroundColor: C.white, border: `1px solid ${C.border}`,
        borderTop: `3px solid ${DC[term.domainNum]}`, borderRadius: 10,
        cursor: 'pointer',
      }}>
        <span style={{ fontSize: 13, color: C.secondary }}>Connected Rule</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: DC[term.domainNum] }}>Rule {term.linkedRule} →</span>
      </button>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 2.5" />
        <UDLBadge label="Rep 3.2" />
        <UDLBadge label="Engagement 7.2" />
      </div>
    </div>
  );
}

function Module1RuleCards({ navigate }) {
  const [openCard, setOpenCard] = useState(null);

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        The 13 rules organized into four clusters. Tap any rule to read the full protocol.
      </div>

      {RULE_CARDS.map((cluster, ci) => (
        <div key={ci} style={{ marginBottom: 12 }}>
          <button
            onClick={() => setOpenCard(openCard === ci ? null : ci)}
            style={{
              display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: C.white, border: `1px solid ${C.border}`,
              borderLeft: `5px solid ${cluster.color}`, borderRadius: 10,
              padding: '14px 14px', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{cluster.icon} <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{cluster.cluster}</span></div>
              <div style={{ fontSize: 12, color: C.secondary }}>{cluster.rules.length} rules</div>
            </div>
            <span style={{ fontSize: 20, color: C.border, transform: openCard === ci ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
          </button>

          {openCard === ci && (
            <div style={{ backgroundColor: cluster.color + '08', borderRadius: '0 0 10px 10px', border: `1px solid ${C.border}`, borderTop: 'none', padding: '4px 0 8px' }}>
              {cluster.rules.map(rule => (
                <div key={rule.num} style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border + '80'}` }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: cluster.color, backgroundColor: cluster.color + '18', padding: '2px 7px', borderRadius: 8, flexShrink: 0 }}>Rule {rule.num}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{rule.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, paddingLeft: 4, marginBottom: 8 }}>{rule.plain}</div>
                  <button onClick={() => navigate('module1-rule-' + rule.num)} style={{
                    background: 'none', border: `1px solid ${cluster.color}60`,
                    borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
                    fontSize: 12, fontWeight: 700, color: cluster.color,
                    backgroundColor: cluster.color + '0C',
                  }}>Read full rule →</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 1.1" />
        <UDLBadge label="Expr 6.3" />
        <UDLBadge label="Engagement 8.1" />
      </div>
    </div>
  );
}

function Module1RuleDetail({ navigate, ruleNum, setSelectedTerm }) {
  const rule = RULES_FULL.find(r => r.num === ruleNum) || RULES_FULL[0];
  const clusterLabels = { Before: 'Before the Interaction', During: 'During the Interaction', After: 'After the Interaction', Periodic: 'Periodic Evaluation' };

  return (
    <div style={{ paddingTop: 4 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          backgroundColor: rule.color + '18', border: `1.5px solid ${rule.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: rule.color,
        }}>R{rule.num}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, lineHeight: 1.2 }}>{rule.title}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: rule.color, backgroundColor: rule.color + '18', padding: '2px 8px', borderRadius: 10 }}>
            {clusterLabels[rule.cluster]}
          </span>
        </div>
      </div>

      {/* The Rule */}
      <div style={{ backgroundColor: rule.color + '0E', borderRadius: 12, borderLeft: `4px solid ${rule.color}`, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: rule.color, letterSpacing: 0.4, marginBottom: 6 }}>THE RULE</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.6 }}>{rule.theRule}</div>
      </div>

      {/* Definition Source */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>DERIVED FROM</div>
        <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{rule.defSource}</div>
        {rule.linkedTerms.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {rule.linkedTerms.map(id => {
              const term = TERMS.find(t => t.id === id);
              return term ? (
                <button key={id} onClick={() => { setSelectedTerm(id); navigate('module1-term'); }} style={{
                  padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${DC[term.domainNum]}60`,
                  backgroundColor: DC[term.domainNum] + '12',
                  fontSize: 12, fontWeight: 600, color: DC[term.domainNum],
                }}>{term.metaphor.symbol} {term.name} →</button>
              ) : null;
            })}
          </div>
        )}
      </Card>

      {/* Behavioral Protocol */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>BEHAVIORAL PROTOCOL</div>
        {rule.protocol.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 11, flexShrink: 0,
              backgroundColor: rule.color + '18', border: `1px solid ${rule.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: rule.color, marginTop: 1,
            }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65, flex: 1 }}>{step}</div>
          </div>
        ))}
      </Card>

      {/* Violation Indicator */}
      <Card style={{ borderLeft: `4px solid ${C.activated}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.activated, letterSpacing: 0.4, marginBottom: 6 }}>VIOLATION INDICATOR</div>
        <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65 }}>{rule.violation}</div>
      </Card>

      {/* Correction Pathway */}
      <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>CORRECTION PATHWAY</div>
        <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65 }}>{rule.correction}</div>
      </Card>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {rule.num > 1 && (
          <button onClick={() => navigate('module1-rule-' + (rule.num - 1))} style={{
            flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${C.border}`, backgroundColor: C.white,
            fontSize: 13, fontWeight: 600, color: C.secondary,
          }}>← Rule {rule.num - 1}</button>
        )}
        {rule.num < 13 && (
          <button onClick={() => navigate('module1-rule-' + (rule.num + 1))} style={{
            flex: 1, padding: '12px', borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${C.border}`, backgroundColor: C.white,
            fontSize: 13, fontWeight: 600, color: C.secondary,
          }}>Rule {rule.num + 1} →</button>
        )}
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 2.5" />
        <UDLBadge label="Rep 3.2" />
        <UDLBadge label="Expr 6.3" />
      </div>
    </div>
  );
}

function Module1FrameworkMap({ navigate, setSelectedTerm }) {
  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        How the framework connects. Tap any term to open its definition.
      </div>

      {[1, 2, 3, 4, 5].map(domainNum => {
        const domainTerms = TERMS.filter(t => t.domainNum === domainNum);
        return (
          <div key={domainNum} style={{ marginBottom: 12 }}>
            <div style={{
              backgroundColor: DC[domainNum] + '18',
              borderLeft: `4px solid ${DC[domainNum]}`,
              borderRadius: '8px 8px 0 0', padding: '8px 14px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: DC[domainNum], letterSpacing: 0.5 }}>
                DOMAIN {domainNum} — {DOMAIN_LABELS[domainNum].toUpperCase()}
              </div>
            </div>
            <div style={{ border: `1px solid ${DC[domainNum] + '40'}`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '8px 6px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {domainTerms.map(term => (
                  <button
                    key={term.id}
                    onClick={() => { setSelectedTerm(term.id); navigate('module1-term'); }}
                    style={{
                      padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${DC[domainNum] + '60'}`,
                      backgroundColor: DC[domainNum] + '10',
                      fontSize: 12, fontWeight: 600, color: DC[domainNum],
                    }}
                  >
                    {term.metaphor.symbol} {term.name}
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 8, paddingLeft: 4 }}>
                <div style={{ fontSize: 11, color: C.secondary, marginBottom: 4 }}>↓ Generates</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[...new Set(domainTerms.map(t => t.linkedRule))].sort((a,b) => a-b).map(ruleNum => (
                    <span key={ruleNum} style={{
                      padding: '4px 8px', borderRadius: 8,
                      backgroundColor: '#F0F4F8',
                      border: `1px solid ${C.border}`,
                      fontSize: 11, fontWeight: 700, color: C.secondary,
                    }}>Rule {ruleNum}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <Card>
        <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
          Rules generate protocols: the Self-Audit (5Q), the Pre-Communication Checklist (5Q), and the Bilateral Mirror.
        </div>
      </Card>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 3.2" />
        <UDLBadge label="Expr 6.3" />
      </div>
    </div>
  );
}

// ─── MODULE 3 SCREENS ────────────────────────────────────────────────────────

function Module3Home({ navigate, setDest, goal }) {
  const tools = [
    { id: 'module3-audit',      icon: '🔍', title: 'Self-Audit',             desc: 'Review an interaction across five questions. Three formats available.', badge: 'After interaction' },
    { id: 'module3-applied',    icon: '✅', title: 'Rule I Applied Today',    desc: 'Log one moment you deliberately used a framework rule.', badge: 'Daily' },
    { id: 'module3-skill',      icon: '📊', title: 'Skill Tracker',           desc: 'Self-rate all 13 rules — where you are today, not where you should be.', badge: 'Weekly' },
    { id: 'module3-initiation', icon: '📨', title: 'Initiation Tracker',      desc: 'Track who initiates contact in each relationship. Alerts at three consecutive.', badge: 'Ongoing' },
    { id: 'module3-journal',    icon: '📓', title: 'Bilateral Journal',        desc: 'What I observed in others. What I observed in myself.', badge: 'Weekly' },
    { id: 'module3-health',     icon: '💚', title: 'Relationship Health Check', desc: 'Score a relationship against five criteria. Calibrate investment.', badge: 'Monthly' },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      {goal && (
        <div style={{ backgroundColor: C.calm + '14', border: `1.5px solid ${C.calm}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 4 }}>THIS WEEK'S GOAL</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>{goal}</div>
        </div>
      )}

      <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 12 }}>
        YOU WILL CHECK IN BEFORE EACH TOOL
      </div>

      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => { setDest(tool.id); navigate('module3-gate'); }}
          style={{
            display: 'block', width: '100%', textAlign: 'left',
            backgroundColor: C.white, border: `1px solid ${C.border}`,
            borderLeft: `4px solid ${C.interactive}`,
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{tool.icon} {tool.title}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '14', padding: '2px 8px', borderRadius: 10 }}>{tool.badge}</span>
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{tool.desc}</div>
        </button>
      ))}

      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 9.1" />
        <UDLBadge label="Expr 6.1" />
        <UDLBadge label="Rep 3.3" />
      </div>
    </div>
  );
}

function Module3Gate({ navigate, dest, onSetReg, regState }) {
  const states = [
    { key: 'calm',        color: C.calm,        icon: '🟢', label: 'Calm',        desc: 'I can read and process clearly. This tool is accessible right now.', action: () => { onSetReg('calm'); navigate(dest); } },
    { key: 'activated',   color: C.activated,   icon: '🟡', label: 'Activated',   desc: 'I am functioning but it takes effort. I will proceed with the activated format if available.', action: () => { onSetReg('activated'); navigate(dest); } },
    { key: 'overwhelmed', color: C.overwhelmed, icon: '🔴', label: 'Overwhelmed', desc: 'I cannot process right now. This tool is not accessible in this state.', action: () => { onSetReg('overwhelmed'); navigate('overwhelmed-stop'); } },
  ];

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Before you open this tool</div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Check in with yourself. This tool needs some thinking. Pick the one that fits right now.
      </div>
      {states.map(({ key, color, icon, label, desc, action }) => (
        <button key={key} onClick={action} style={{
          display: 'block', width: '100%',
          backgroundColor: C.white, border: `2px solid ${regState === key ? color : C.border}`,
          borderRadius: 12, padding: 16, cursor: 'pointer', textAlign: 'left', marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 17, fontWeight: 700, color }}>{label}</span>
          </div>
          <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.5, paddingLeft: 32 }}>{desc}</div>
        </button>
      ))}
      <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 9.1" />
        <UDLBadge label="Engagement 9.2" />
      </div>
    </div>
  );
}

function Module3SelfAudit({ navigate, settings }) {
  const [step, setStep] = useState('format');
  const [format, setFormat] = useState('written');
  const [mode, setMode] = useState('full');
  const [answers, setAnswers] = useState({});
  const [writtenText, setWrittenText] = useState({});
  const [wordSelections, setWordSelections] = useState({});
  const [manipChecks, setManipChecks] = useState({});
  const [audioState, setAudioState] = useState('idle');

  const questions = mode === 'short' ? AUDIT_Q.filter(q => q.id === 1 || q.id === 3) : AUDIT_Q;
  const currentQIdx = step.startsWith('q') ? parseInt(step.slice(1)) - 1 : 0;
  const currentQ = AUDIT_Q[currentQIdx];
  const activeQIds = questions.map(q => q.id);
  const currentQPos = activeQIds.indexOf(currentQ?.id) + 1;

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    const next = activeQIds[currentQPos];
    if (next) setStep(`q${next}`);
    else setStep('result');
  };

  const handleWordToggle = (qId, word) => {
    setWordSelections(prev => {
      const curr = prev[qId] || [];
      return { ...prev, [qId]: curr.includes(word) ? curr.filter(w => w !== word) : [...curr, word] };
    });
  };

  const getMastery = () => {
    const noManip = answers[3] === true;
    const bilateral = !!writtenText[5] || (wordSelections[5] || []).length > 0;
    if (noManip && Object.values(answers).filter(Boolean).length >= 3) return { text: 'You demonstrated alignment between your values and your behavior in this interaction. That alignment is the goal of the entire framework.', color: C.calm };
    if (!noManip) return { text: 'You identified a pattern worth examining. Naming a manipulation form accurately is the most important first step — and this audit is evidence that your self-awareness is developing.', color: C.activated };
    return { text: 'You completed a bilateral self-assessment. That capacity — turning the mirror on your own behavior — is the hardest skill in this framework to build.', color: C.interactive };
  };

  if (step === 'format') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Self-Audit</div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Five questions about a recent interaction. Choose your format and length for today.
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>FORMAT</div>
      {[
        { id: 'written', icon: '✍️', label: 'Written', desc: 'Sentence frames + fill-in. Best for full processing capacity.' },
        { id: 'visual',  icon: '🔘', label: 'Visual',  desc: 'Click or color-code responses. Good for activated days.' },
        { id: 'audio',   icon: '🎙️', label: 'Voice Memo', desc: 'Speak your responses. Best when writing feels inaccessible.' },
      ].map(f => (
        <button key={f.id} onClick={() => setFormat(f.id)} style={{
          display: 'block', width: '100%', padding: '12px 14px', marginBottom: 8,
          borderRadius: 10, cursor: 'pointer', textAlign: 'left',
          border: `1.5px solid ${format === f.id ? C.interactive : C.border}`,
          backgroundColor: format === f.id ? C.interactive + '10' : C.white,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: format === f.id ? C.interactive : C.primary }}>{f.icon} {f.label}</span>
          <div style={{ fontSize: 12, color: C.secondary, marginTop: 3 }}>{f.desc}</div>
        </button>
      ))}

      <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginTop: 16, marginBottom: 10 }}>LENGTH</div>
      {[
        { id: 'full',  label: 'Full audit — 5 questions', desc: 'Complete review of the interaction.' },
        { id: 'short', label: 'Short form — 2 questions', desc: 'Questions 1 and 3 only. For lower-capacity days.' },
      ].map(m => (
        <button key={m.id} onClick={() => setMode(m.id)} style={{
          display: 'block', width: '100%', padding: '12px 14px', marginBottom: 8,
          borderRadius: 10, cursor: 'pointer', textAlign: 'left',
          border: `1.5px solid ${mode === m.id ? C.interactive : C.border}`,
          backgroundColor: mode === m.id ? C.interactive + '10' : C.white,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: mode === m.id ? C.interactive : C.primary }}>{m.label}</span>
          <div style={{ fontSize: 12, color: C.secondary, marginTop: 3 }}>{m.desc}</div>
        </button>
      ))}

      <Btn label={`Start ${mode === 'short' ? '2-question' : '5-question'} audit →`} onClick={() => setStep(`q${activeQIds[0]}`)} variant="primary" style={{ marginTop: 8 }} />

      <div style={{ marginTop: 12, padding: 12, backgroundColor: C.calm + '10', borderRadius: 10, border: `1px solid ${C.calm + '40'}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.calm, lineHeight: 1.6 }}>
          This audit is for your own growth. No one grades it. No response is wrong. Noticing any pattern means the framework is working.
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Expr 5.1" />
        <UDLBadge label="Engagement 8.2" />
        <UDLBadge label="Engagement 8.4" />
      </div>
    </div>
  );

  if (step.startsWith('q') && currentQ) {
    const qTotal = activeQIds.length;
    return (
      <div style={{ paddingTop: 8 }}>
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
            <div style={{ width: `${(currentQPos / qTotal) * 100}%`, height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>Q{currentQPos} of {qTotal}</span>
        </div>

        <div style={{ fontSize: 24, marginBottom: 8 }}>{currentQ.symbol}</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, lineHeight: 1.3, marginBottom: 8 }}>{currentQ.full}</div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>{currentQ.sub}</div>

        {/* Written format */}
        {format === 'written' && !currentQ.isOpenEnded && !currentQ.isManipCheck && (
          <div>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>SENTENCE FRAME</div>
              <div style={{ fontSize: 14, color: C.secondary, marginBottom: 8, fontStyle: 'italic' }}>{currentQ.frame}</div>
              <textarea value={writtenText[currentQ.id] || ''} onChange={e => setWrittenText(p => ({...p, [currentQ.id]: e.target.value}))}
                placeholder="Continue the sentence..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 72, boxSizing: 'border-box' }} />
            </Card>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>OR SELECT FROM WORD BANK</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {currentQ.words.map(w => {
                const sel = (wordSelections[currentQ.id] || []).includes(w);
                return <button key={w} onClick={() => handleWordToggle(currentQ.id, w)} style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${sel ? C.interactive : C.border}`, backgroundColor: sel ? C.interactive + '14' : 'transparent', color: sel ? C.interactive : C.primary, fontSize: 13, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>;
              })}
            </div>
            <Btn label="Save and continue →" onClick={() => handleAnswer('written')} variant="primary" />
          </div>
        )}

        {/* Open ended (Q5) */}
        {format === 'written' && currentQ.isOpenEnded && (
          <div>
            <Card>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>SENTENCE FRAME</div>
              <div style={{ fontSize: 14, color: C.secondary, marginBottom: 8, fontStyle: 'italic' }}>{currentQ.frame}</div>
              <textarea value={writtenText[currentQ.id] || ''} onChange={e => setWrittenText(p => ({...p, [currentQ.id]: e.target.value}))}
                placeholder="Write the most honest version you can. This stays private." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 90, boxSizing: 'border-box' }} />
            </Card>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {currentQ.words.map(w => {
                const sel = (wordSelections[currentQ.id] || []).includes(w);
                return <button key={w} onClick={() => handleWordToggle(currentQ.id, w)} style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${sel ? C.interactive : C.border}`, backgroundColor: sel ? C.interactive + '14' : 'transparent', color: sel ? C.interactive : C.primary, fontSize: 13, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>;
              })}
            </div>
            <Btn label="Complete audit →" onClick={() => handleAnswer('open')} variant="primary" />
          </div>
        )}

        {/* Manipulation check (Q3) */}
        {format === 'written' && currentQ.isManipCheck && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>CHECK ANY THAT OCCURRED IN THIS INTERACTION</div>
            {MANIP_FORMS.map(f => {
              const checked = !!manipChecks[f.name];
              return (
                <button key={f.name} onClick={() => setManipChecks(p => ({...p, [f.name]: !p[f.name]}))} style={{
                  display: 'flex', width: '100%', alignItems: 'flex-start', gap: 10, padding: '10px 12px', marginBottom: 6,
                  border: `1.5px solid ${checked ? C.overwhelmed : C.border}`, borderRadius: 10,
                  backgroundColor: checked ? C.redBg : C.white, cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{checked ? '☑️' : '⬜'}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: checked ? C.overwhelmed : C.primary }}>{f.name}</div>
                    <div style={{ fontSize: 12, color: C.secondary }}>{f.desc}</div>
                  </div>
                </button>
              );
            })}
            <div style={{ marginTop: 12 }}>
              <Btn label="None occurred — continue →" onClick={() => handleAnswer(true)} variant="calm" style={{ marginBottom: 8 }} />
              {Object.values(manipChecks).some(Boolean) && (
                <Btn label="One or more occurred — continue →" onClick={() => handleAnswer(false)} variant="secondary" />
              )}
            </div>
          </div>
        )}

        {/* Visual format */}
        {format === 'visual' && !currentQ.isManipCheck && (
          <div>
            <Btn label={`✓ ${currentQ.yesLabel || 'Yes'}`} onClick={() => handleAnswer(true)} variant="calm" style={{ marginBottom: 10 }} />
            <Btn label={`✗ ${currentQ.noLabel || 'No'}`} onClick={() => handleAnswer(false)} variant="secondary" />
          </div>
        )}
        {format === 'visual' && currentQ.isManipCheck && (
          <div>
            <Btn label="✓ No — I communicated directly" onClick={() => handleAnswer(true)} variant="calm" style={{ marginBottom: 10 }} />
            <Btn label="✗ Yes — one or more forms occurred" onClick={() => handleAnswer(false)} variant="secondary" />
          </div>
        )}

        {/* Audio format */}
        {format === 'audio' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: C.secondary, marginBottom: 16 }}>Speak your response. Tap record when ready.</div>
            {audioState === 'idle' && <button onClick={() => { setAudioState('recording'); setTimeout(() => setAudioState('done'), 2500); }} style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.overwhelmed, border: 'none', cursor: 'pointer', fontSize: 36, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎙️</button>}
            {audioState === 'recording' && <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.overwhelmed + '44', border: `3px solid ${C.overwhelmed}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>⏺</div>}
            {audioState === 'done' && <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.calm + '22', border: `3px solid ${C.calm}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✓</div>}
            <div style={{ fontSize: 13, color: C.secondary, marginBottom: 20 }}>{audioState === 'idle' ? 'Tap to record' : audioState === 'recording' ? 'Recording...' : 'Recorded'}</div>
            {audioState === 'done' && <Btn label="Save and continue →" onClick={() => { setAudioState('idle'); handleAnswer('audio'); }} variant="primary" />}
          </div>
        )}

        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap' }}>
          <UDLBadge label="Rep 3.3" />
          <UDLBadge label="Expr 5.1" />
          <UDLBadge label="Expr 5.2" />
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const mastery = getMastery();
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 16 }}>Audit Complete</div>

        <Card style={{ borderLeft: `4px solid ${mastery.color}`, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: mastery.color, letterSpacing: 0.4, marginBottom: 6 }}>WHAT THIS MEANS</div>
          <div style={{ fontSize: 15, color: C.primary, lineHeight: 1.7, fontStyle: 'italic' }}>"{mastery.text}"</div>
        </Card>

        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>YOUR RESPONSES</div>
          {activeQIds.map(id => {
            const q = AUDIT_Q.find(x => x.id === id);
            const ans = answers[id];
            return (
              <div key={id} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>{q.symbol}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{q.full}</div>
                  <div style={{ fontSize: 12, color: C.secondary }}>{ans === true ? '✅ Handled well' : ans === false ? '⚠️ Pattern to examine' : '📝 Response recorded'}</div>
                </div>
              </div>
            );
          })}
        </Card>

        <div style={{ padding: 12, backgroundColor: '#F8F4FF', border: `1px solid ${C.secondary + '40'}`, borderRadius: 10, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>FACILITATOR SHARE</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>If you want to review this with your facilitator, tap below to generate a summary.</div>
          <Btn label="Generate summary to share" onClick={() => {}} variant="ghost" small style={{ marginTop: 8 }} />
        </div>

        <Btn label="Return to My Tracker" onClick={() => navigate('module3')} variant="primary" style={{ marginTop: 12 }} />

        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
          <UDLBadge label="Engagement 8.4" />
          <UDLBadge label="Engagement 9.3" />
          <UDLBadge label="Engagement 8.3" />
        </div>
      </div>
    );
  }

  return null;
}

function Module3SkillTracker({ navigate }) {
  const [ratings, setRatings] = useState({});
  const [saved, setSaved] = useState(false);

  const internalized = Object.values(ratings).filter(v => v === 'internalized').length;
  const developing   = Object.values(ratings).filter(v => v === 'developing').length;
  const notYet       = Object.values(ratings).filter(v => v === 'not-yet').length;
  const total = RULES_SIMPLE.length;
  const pct = Math.round(((internalized + developing * 0.5) / total) * 100);

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Skill Tracker</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Rate each rule honestly — where you are today, not where you want to be.
      </div>

      {/* Progress bar */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>OVERALL PROGRESS</div>
        <div style={{ height: 10, backgroundColor: C.border, borderRadius: 5, marginBottom: 8 }}>
          <div style={{ width: `${pct}%`, height: 10, backgroundColor: C.calm, borderRadius: 5, transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
          <span style={{ color: C.calm, fontWeight: 700 }}>✅ {internalized} Internalized</span>
          <span style={{ color: C.activated, fontWeight: 700 }}>🔄 {developing} Developing</span>
          <span style={{ color: C.secondary, fontWeight: 700 }}>📌 {notYet} Not yet</span>
        </div>
      </Card>

      {/* Rules */}
      {RULES_SIMPLE.map(rule => {
        const rating = ratings[rule.num];
        return (
          <div key={rule.num} style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${rule.color}`, borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: rule.color, backgroundColor: rule.color + '18', padding: '2px 7px', borderRadius: 8 }}>Rule {rule.num}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.primary, lineHeight: 1.3 }}>{rule.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {SKILL_RATINGS.map(opt => (
                <button key={opt.value} onClick={() => setRatings(p => ({ ...p, [rule.num]: opt.value }))} style={{
                  flex: 1, padding: '5px 4px', borderRadius: 8, cursor: 'pointer',
                  border: `1.5px solid ${rating === opt.value ? opt.color : C.border}`,
                  backgroundColor: rating === opt.value ? opt.color + '18' : 'transparent',
                  color: rating === opt.value ? opt.color : C.secondary,
                  fontSize: 10, fontWeight: rating === opt.value ? 700 : 400, textAlign: 'center', lineHeight: 1.3,
                }}>{opt.label}</button>
              ))}
            </div>
          </div>
        );
      })}

      {!saved ? (
        <Btn label="Save tracker" onClick={() => setSaved(true)} variant="primary" style={{ marginTop: 4 }} />
      ) : (
        <Card style={{ borderLeft: `4px solid ${C.calm}`, marginTop: 4 }}>
          <div style={{ fontSize: 14, color: C.primary, fontWeight: 700 }}>Saved ✓</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginTop: 4 }}>
            Every skill starts in the "not yet" column. Where you are today is exactly the right starting point.
          </div>
        </Card>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 9.3" />
        <UDLBadge label="Engagement 8.4" />
        <UDLBadge label="Rep 1.1" />
      </div>
    </div>
  );
}

function Module3Applied({ navigate }) {
  const [ruleNum, setRuleNum] = useState(null);
  const [mode, setMode] = useState('frame');
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [entries, setEntries] = useState([]);
  const [saved, setSaved] = useState(false);

  const wordBank = ['listened carefully', 'adjusted when I noticed signals', 'gave the other person space', 'checked in before continuing', 'used a closing statement', 'paused before responding', 'respected the ring', 'asked a question about them'];

  const handleSave = () => {
    if (!ruleNum) return;
    const entry = { rule: ruleNum, text: text || words.join(', '), date: 'Today' };
    setEntries(p => [entry, ...p]);
    setSaved(true);
    setText(''); setWords([]); setRuleNum(null);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Rule I Applied Today</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Record one moment you deliberately used a framework rule. Noticing competence is the practice.
      </div>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHICH RULE?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {RULES_SIMPLE.map(r => (
            <button key={r.num} onClick={() => setRuleNum(r.num)} style={{ padding: '5px 10px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${ruleNum === r.num ? r.color : C.border}`, backgroundColor: ruleNum === r.num ? r.color + '14' : 'transparent', color: ruleNum === r.num ? r.color : C.secondary, fontSize: 12, fontWeight: ruleNum === r.num ? 700 : 400 }}>R{r.num}</button>
          ))}
        </div>
        {ruleNum && <div style={{ fontSize: 12, color: C.secondary, marginTop: 4 }}>Rule {ruleNum}: {RULES_SIMPLE.find(r => r.num === ruleNum)?.title}</div>}
      </Card>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[['frame', '✍️ Sentence frame'], ['words', '🔘 Word bank'], ['free', '📝 Free entry']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${mode === id ? C.interactive : C.border}`, backgroundColor: mode === id ? C.interactive + '10' : 'transparent', color: mode === id ? C.interactive : C.secondary, fontSize: 11, fontWeight: mode === id ? 700 : 400, textAlign: 'center' }}>{label}</button>
        ))}
      </div>

      {mode === 'frame' && (
        <Card>
          <div style={{ fontSize: 13, color: C.secondary, marginBottom: 6, fontStyle: 'italic' }}>Today I applied Rule {ruleNum || '___'} when I...</div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="describe the situation briefly..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 64, boxSizing: 'border-box' }} />
        </Card>
      )}
      {mode === 'words' && (
        <Card>
          <div style={{ fontSize: 12, color: C.secondary, marginBottom: 8 }}>Today I applied Rule {ruleNum || '___'} when I...</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {wordBank.map(w => { const sel = words.includes(w); return <button key={w} onClick={() => setWords(p => sel ? p.filter(x => x !== w) : [...p, w])} style={{ padding: '6px 10px', borderRadius: 20, border: `1.5px solid ${sel ? C.interactive : C.border}`, backgroundColor: sel ? C.interactive + '14' : 'transparent', color: sel ? C.interactive : C.primary, fontSize: 12, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>; })}
          </div>
        </Card>
      )}
      {mode === 'free' && (
        <Card>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write freely about the moment..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 80, boxSizing: 'border-box' }} />
        </Card>
      )}

      <Btn label="Log this moment ✓" onClick={handleSave} variant={ruleNum ? 'calm' : 'ghost'} style={{ marginBottom: 12 }} />

      {saved && (
        <div style={{ padding: 12, backgroundColor: C.greenBg, border: `1px solid ${C.calm + '60'}`, borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.calm }}>Logged ✓</div>
          <div style={{ fontSize: 13, color: C.primary, marginTop: 4, lineHeight: 1.5 }}>Noticing this means the framework is working.</div>
        </div>
      )}

      {entries.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>RECENT LOG</div>
          {entries.slice(0, 5).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: RULES_SIMPLE.find(r => r.num === e.rule)?.color || C.interactive, backgroundColor: C.border + '60', padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>R{e.rule}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.primary }}>{e.text || '(word bank selection)'}</div>
                <div style={{ fontSize: 11, color: C.secondary }}>{e.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 8.4" />
        <UDLBadge label="Expr 5.2" />
        <UDLBadge label="Engagement 9.3" />
      </div>
    </div>
  );
}

function Module3InitiationTracker({ navigate }) {
  const [relName, setRelName] = useState('');
  const [entries, setEntries] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const grouped = entries.reduce((acc, e) => { acc[e.rel] = acc[e.rel] || []; acc[e.rel].push(e); return acc; }, {});

  const getAlert = (relEntries) => {
    let consecutive = 0;
    for (let i = relEntries.length - 1; i >= 0; i--) {
      if (relEntries[i].who === 'me') consecutive++;
      else break;
    }
    return consecutive >= 3;
  };

  const addEntry = (who) => {
    if (!relName.trim()) return;
    setEntries(p => [...p, { rel: relName.trim(), who, date: new Date().toLocaleDateString() }]);
    setShowAdd(false);
    setRelName('');
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Initiation Tracker</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Track who initiates contact in each relationship. Three consecutive self-initiations triggers an alert to pause and assess.
      </div>

      <Btn label="+ Log a contact" onClick={() => setShowAdd(true)} variant="primary" style={{ marginBottom: 16 }} />

      {showAdd && (
        <Card style={{ borderLeft: `4px solid ${C.interactive}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>RELATIONSHIP NAME OR INITIALS</div>
          <input value={relName} onChange={e => setRelName(e.target.value)} placeholder="e.g. A.M. or 'work friend'" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box', marginBottom: 12 }} />
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHO INITIATED THIS CONTACT?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn label="I initiated" onClick={() => addEntry('me')} variant="primary" />
            <Btn label="They initiated" onClick={() => addEntry('them')} variant="calm" />
          </div>
        </Card>
      )}

      {Object.keys(grouped).length === 0 && !showAdd && (
        <Card>
          <div style={{ textAlign: 'center', color: C.secondary, fontSize: 14, padding: '12px 0' }}>No entries yet. Log your first contact above.</div>
        </Card>
      )}

      {Object.entries(grouped).map(([rel, relEntries]) => {
        const alert = getAlert(relEntries);
        return (
          <div key={rel} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{rel}</span>
              {alert && <span style={{ fontSize: 11, fontWeight: 700, color: C.overwhelmed, backgroundColor: C.redBg, padding: '3px 8px', borderRadius: 10, border: `1px solid ${C.overwhelmed + '60'}` }}>⚠️ Pause — 3 consecutive</span>}
            </div>
            {alert && (
              <div style={{ padding: 10, backgroundColor: C.amberBg, border: `1px solid ${C.amber + '60'}`, borderRadius: 8, marginBottom: 8, fontSize: 13, color: C.primary, lineHeight: 1.5 }}>
                You have initiated three or more consecutive contacts without a return initiation. Pause outreach and assess before continuing.
              </div>
            )}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {relEntries.map((e, i) => (
                <div key={i} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, backgroundColor: e.who === 'me' ? C.interactive + '14' : C.calm + '14', color: e.who === 'me' ? C.interactive : C.calm, border: `1px solid ${e.who === 'me' ? C.interactive + '40' : C.calm + '40'}` }}>
                  {e.who === 'me' ? '→ Me' : '← Them'} <span style={{ fontWeight: 400, fontSize: 11 }}>{e.date}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Expr 6.4" />
        <UDLBadge label="Engagement 8.1" />
        <UDLBadge label="ADHD: Time externalization" />
      </div>
    </div>
  );
}

function Module3Journal({ navigate }) {
  const [phase, setPhase] = useState(1);
  const [compMode, setCompMode] = useState('frame');
  const [outward, setOutward] = useState('');
  const [inward, setInward] = useState('');
  const [outWords, setOutWords] = useState([]);
  const [inWords, setInWords] = useState([]);
  const [saved, setSaved] = useState(false);

  const outWordBank = ['showed genuine interest', 'changed the subject abruptly', 'responded to my signals', 'crossed a boundary after being told', 'initiated contact first', 'used a deliberate closing', 'disclosed at the right level'];
  const inWordBank  = ['responded well to signals', 'pushed past a signal I noticed', 'maintained balance in conversation', 'introduced a topic too early', 'used a closing statement', 'noticed but did not act on a trigger', 'adjusted when I felt a boundary'];

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Bilateral Journal</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        What did I observe in others? What did I observe in myself?
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setPhase(1)} style={{ flex: 1, padding: '9px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${phase === 1 ? C.interactive : C.border}`, backgroundColor: phase === 1 ? C.interactive + '10' : 'transparent', color: phase === 1 ? C.interactive : C.secondary, fontSize: 12, fontWeight: phase === 1 ? 700 : 400 }}>Phase 1: Outward only</button>
        <button onClick={() => setPhase(2)} style={{ flex: 1, padding: '9px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${phase === 2 ? C.interactive : C.border}`, backgroundColor: phase === 2 ? C.interactive + '10' : 'transparent', color: phase === 2 ? C.interactive : C.secondary, fontSize: 12, fontWeight: phase === 2 ? 700 : 400 }}>Phase 2: Both columns</button>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {[['frame', '✍️ Frame'], ['words', '🔘 Words'], ['free', '📝 Free']].map(([id, label]) => (
          <button key={id} onClick={() => setCompMode(id)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${compMode === id ? C.interactive : C.border}`, backgroundColor: compMode === id ? C.interactive + '10' : 'transparent', color: compMode === id ? C.interactive : C.secondary, fontSize: 11, fontWeight: compMode === id ? 700 : 400, textAlign: 'center' }}>{label}</button>
        ))}
      </div>

      {/* Outward column */}
      <Card style={{ borderLeft: `4px solid ${DC[1]}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: DC[1], letterSpacing: 0.4, marginBottom: 8 }}>WHAT I OBSERVED IN OTHERS</div>
        {compMode === 'frame' && (
          <><div style={{ fontSize: 13, color: C.secondary, marginBottom: 6, fontStyle: 'italic' }}>Today I observed [person] doing/saying... which connects to Rule...</div>
          <textarea value={outward} onChange={e => setOutward(e.target.value)} placeholder="Write one specific observation..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 56, boxSizing: 'border-box' }} /></>
        )}
        {compMode === 'words' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {outWordBank.map(w => { const sel = outWords.includes(w); return <button key={w} onClick={() => setOutWords(p => sel ? p.filter(x => x !== w) : [...p, w])} style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${sel ? DC[1] : C.border}`, backgroundColor: sel ? DC[1] + '14' : 'transparent', color: sel ? DC[1] : C.primary, fontSize: 12, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>; })}
          </div>
        )}
        {compMode === 'free' && (
          <textarea value={outward} onChange={e => setOutward(e.target.value)} placeholder="Write freely..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 56, boxSizing: 'border-box' }} />
        )}
        <div style={{ fontSize: 11, color: C.secondary, marginTop: 8 }}>Minimum entry: one word. That counts.</div>
      </Card>

      {/* Inward column — Phase 2 only */}
      {phase === 2 && (
        <Card style={{ borderLeft: `4px solid ${DC[4]}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[4], letterSpacing: 0.4 }}>WHAT I OBSERVED IN MYSELF</div>
            <span style={{ fontSize: 10, backgroundColor: DC[4] + '18', color: DC[4], padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>Phase 2</span>
          </div>
          {compMode === 'frame' && (
            <><div style={{ fontSize: 13, color: C.secondary, marginBottom: 6, fontStyle: 'italic' }}>Today I noticed myself... which connects to Rule...</div>
            <textarea value={inward} onChange={e => setInward(e.target.value)} placeholder="Write one honest observation about your own behavior..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 56, boxSizing: 'border-box' }} /></>
          )}
          {compMode === 'words' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {inWordBank.map(w => { const sel = inWords.includes(w); return <button key={w} onClick={() => setInWords(p => sel ? p.filter(x => x !== w) : [...p, w])} style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${sel ? DC[4] : C.border}`, backgroundColor: sel ? DC[4] + '14' : 'transparent', color: sel ? DC[4] : C.primary, fontSize: 12, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>; })}
            </div>
          )}
          {compMode === 'free' && (
            <textarea value={inward} onChange={e => setInward(e.target.value)} placeholder="Write freely..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 56, boxSizing: 'border-box' }} />
          )}
          <div style={{ fontSize: 11, color: C.secondary, marginTop: 8 }}>Minimum entry: one word. That counts.</div>
        </Card>
      )}

      <Btn label="Save this entry" onClick={handleSave} variant="primary" style={{ marginTop: 4 }} />
      {saved && <div style={{ padding: 10, backgroundColor: C.greenBg, border: `1px solid ${C.calm + '60'}`, borderRadius: 10, marginTop: 8, fontSize: 13, color: C.calm, fontWeight: 700 }}>Entry saved ✓</div>}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Expr 5.2" />
        <UDLBadge label="Engagement 9.3" />
        <UDLBadge label="Engagement 8.2" />
      </div>
    </div>
  );
}

function Module3HealthCheck({ navigate }) {
  const [step, setStep] = useState('setup');
  const [relName, setRelName] = useState('');
  const [answers, setAnswers] = useState({});

  const handleAnswer = (id, val) => {
    setAnswers(p => ({ ...p, [id]: val }));
    if (id < 5) setStep(`c${id + 1}`);
    else setStep('result');
  };

  const score = () => {
    const yes = Object.values(answers).filter(v => v === 'yes').length;
    const partial = Object.values(answers).filter(v => v === 'partial').length;
    const effective = yes + partial * 0.5;
    if (effective >= 4.5) return { level: 'Trusted Friend', color: C.calm, action: 'Invest at the trusted friend level. Continue monitoring.', icon: '💚' };
    if (effective >= 2.5) return { level: 'Friend', color: C.interactive, action: 'Invest at the friend level. Continue monitoring over the next four to six weeks.', icon: '🔵' };
    return { level: 'Recalibrate', color: C.activated, action: 'Recalibrate to a lower ring on the continuum. Do not change any relationship behavior based on this form alone — bring it to your facilitator first.', icon: '🟡' };
  };

  if (step === 'setup') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Relationship Health Check</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Score a specific relationship against five healthy friendship criteria. Complete this every four to six weeks.
      </div>
      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHICH RELATIONSHIP?</div>
        <input value={relName} onChange={e => setRelName(e.target.value)} placeholder="Name or initials of the person..." style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
      </Card>
      <div style={{ padding: 12, backgroundColor: C.calm + '10', border: `1px solid ${C.calm + '40'}`, borderRadius: 10, marginBottom: 16, fontSize: 13, color: C.primary, lineHeight: 1.6 }}>
        This form produces information, not verdicts. There are no wrong answers. Do not change any relationship behavior based on this form alone — bring it to your next facilitator session first.
      </div>
      <Btn label="Start evaluation →" onClick={() => relName.trim() && setStep('c1')} variant={relName.trim() ? 'primary' : 'ghost'} />
    </div>
  );

  if (step.startsWith('c')) {
    const cId = parseInt(step.slice(1));
    const criterion = HEALTH_CRITERIA[cId - 1];
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}><div style={{ width: `${(cId / 5) * 100}%`, height: 4, backgroundColor: C.interactive, borderRadius: 2 }} /></div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>Criterion {cId} of 5</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, marginBottom: 6 }}>EVALUATING: {relName.toUpperCase()}</div>
        <div style={{ fontSize: 19, fontWeight: 800, color: C.primary, marginBottom: 8 }}>{criterion.label}</div>
        <Card style={{ borderLeft: `4px solid ${C.interactive}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>WHAT THIS LOOKS LIKE IN PRACTICE</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{criterion.indicator}</div>
        </Card>
        <div style={{ marginTop: 8 }}>
          {[['yes', C.calm, '✅ Yes — this is present'], ['partial', C.activated, '⚡ Partially — sometimes but not consistently'], ['no', C.secondary, '✗ No — this is not present']].map(([val, color, label]) => (
            <button key={val} onClick={() => handleAnswer(cId, val)} style={{ display: 'block', width: '100%', padding: '13px 14px', marginBottom: 8, borderRadius: 10, cursor: 'pointer', textAlign: 'left', border: `1.5px solid ${C.border}`, backgroundColor: C.white, fontSize: 14, fontWeight: 600, color: C.primary }}>
              <span style={{ color }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const result = score();
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 16 }}>Health Check Complete</div>
        <div style={{ textAlign: 'center', fontSize: 48, marginBottom: 8 }}>{result.icon}</div>
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, color: result.color, marginBottom: 16 }}>{result.level}</div>
        <Card style={{ borderLeft: `4px solid ${result.color}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: result.color, letterSpacing: 0.4, marginBottom: 6 }}>RECOMMENDED ACTION</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{result.action}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>CRITERIA SUMMARY — {relName}</div>
          {HEALTH_CRITERIA.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15 }}>{answers[c.id] === 'yes' ? '✅' : answers[c.id] === 'partial' ? '⚡' : '✗'}</span>
              <span style={{ fontSize: 13, color: C.primary }}>{c.label}</span>
            </div>
          ))}
        </Card>
        <div style={{ padding: 12, backgroundColor: C.amberBg, border: `1px solid ${C.amber + '60'}`, borderRadius: 10, fontSize: 13, color: C.primary, lineHeight: 1.6 }}>
          <strong>Important:</strong> Do not change any relationship behavior based on this form alone. Bring your completed form to your next facilitator session before acting.
        </div>
        <Btn label="Return to My Tracker" onClick={() => navigate('module3')} variant="primary" style={{ marginTop: 12 }} />
      </div>
    );
  }
  return null;
}

// ─── MODULE 4 SCREENS ────────────────────────────────────────────────────────

function Module4Home({ navigate }) {
  const tools = [
    { id: 'module4-scenarios',  icon: '🃏', title: 'Scenario Cards',       desc: '8 pre-built scenarios with bilateral analysis. Three support levels.', badge: 'Bilateral practice' },
    { id: 'module4-trivia',     icon: '🧠', title: 'Rule Trivia',           desc: '12 questions across Foundation, Application, and Challenge tiers.', badge: 'Knowledge check' },
    { id: 'module4-flashcards', icon: '📚', title: 'Flashcard Deck',        desc: 'All 17 definitions. Flip, review, rate. Spaced repetition.', badge: 'Definition review' },
    { id: 'module4-generator',  icon: '✨', title: 'AI Scenario Generator', desc: 'Describe a real situation. Get a personalized practice scenario.', badge: 'Powered by AI' },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Apply the framework through practice. Choose a tool based on what you need today.
      </div>
      {tools.map(t => (
        <button key={t.id} onClick={() => navigate(t.id)} style={{
          display: 'block', width: '100%', textAlign: 'left',
          backgroundColor: C.white, border: `1px solid ${C.border}`,
          borderLeft: `4px solid ${C.interactive}`, borderRadius: 10,
          padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{t.icon} {t.title}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: DC[3], backgroundColor: DC[3] + '14', padding: '2px 8px', borderRadius: 10 }}>{t.badge}</span>
          </div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{t.desc}</div>
        </button>
      ))}
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.1" />
        <UDLBadge label="Expr 5.3" />
        <UDLBadge label="Rep 3.4" />
      </div>
    </div>
  );
}

function Module4Scenarios({ navigate }) {
  const [level, setLevel] = useState('scaffolded');
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [pausing, setPausing] = useState(false);

  const selectScenario = (s) => {
    setPausing(true);
    setTimeout(() => { setSelected(s); setRevealed(false); setPausing(false); }, 1200);
  };

  const diffColor = { foundation: DC[3], application: DC[1], challenge: DC[5] };

  if (selected) return (
    <div style={{ paddingTop: 4 }}>
      {/* Support level */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {[['scaffolded', 'Scaffolded'], ['supported', 'Supported'], ['independent', 'Independent']].map(([v, l]) => (
          <button key={v} onClick={() => setLevel(v)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${level === v ? C.interactive : C.border}`, backgroundColor: level === v ? C.interactive + '10' : 'transparent', color: level === v ? C.interactive : C.secondary, fontSize: 11, fontWeight: level === v ? 700 : 400, textAlign: 'center' }}>{l}</button>
        ))}
      </div>

      {/* Scenario */}
      <Card style={{ borderLeft: `4px solid ${diffColor[selected.difficulty] || C.interactive}` }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {selected.tags.map(t => <span key={t} style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '14', padding: '2px 8px', borderRadius: 10 }}>{t}</span>)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, marginBottom: 10 }}>{selected.title}</div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{selected.text}</div>
      </Card>

      {/* Scaffolded hint */}
      {level === 'scaffolded' && (
        <Card style={{ backgroundColor: DC[1] + '08', borderColor: DC[1] + '40' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[1], letterSpacing: 0.4, marginBottom: 6 }}>SCAFFOLD — Rules {selected.rules.join(' + ')}</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{selected.scaffold}</div>
        </Card>
      )}
      {level === 'supported' && (
        <Card style={{ backgroundColor: DC[3] + '08', borderColor: DC[3] + '40' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[3], letterSpacing: 0.4, marginBottom: 6 }}>CLUSTER HINT</div>
          <div style={{ fontSize: 13, color: C.primary }}>This scenario involves a rule from the <strong>{selected.clusterHint}</strong> cluster. Identify the specific rule(s).</div>
        </Card>
      )}

      {/* Analysis questions */}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>BILATERAL ANALYSIS</div>
      {selected.analysis.map((q, i) => (
        <div key={i} style={{ padding: '10px 12px', borderLeft: `3px solid ${i === 3 ? DC[4] : C.border}`, backgroundColor: i === 3 ? DC[4] + '08' : 'transparent', borderRadius: '0 8px 8px 0', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: i === 3 ? DC[4] : C.primary, fontWeight: i === 3 ? 700 : 400, lineHeight: 1.5 }}>
            {i === 3 ? '↩ Bilateral: ' : `${i + 1}. `}{q}
          </div>
        </div>
      ))}

      {/* Reveal answer */}
      {!revealed ? (
        <Btn label="Reveal framework answer" onClick={() => setRevealed(true)} variant="secondary" style={{ marginBottom: 8 }} />
      ) : (
        <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>FRAMEWORK ANSWER</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{selected.scaffold}</div>
          <div style={{ marginTop: 10, padding: '8px 10px', backgroundColor: DC[4] + '10', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[4], letterSpacing: 0.4, marginBottom: 4 }}>BILATERAL REFLECTION</div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>{selected.bilateral}</div>
          </div>
        </Card>
      )}

      {/* Generalization bridge */}
      <div style={{ padding: 12, backgroundColor: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>GENERALIZATION BRIDGE</div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6, fontStyle: 'italic' }}>{selected.generalization}</div>
        <div style={{ fontSize: 12, color: C.secondary, marginTop: 6 }}>You do not have to write an answer. Just notice.</div>
      </div>

      <Btn label="← Back to scenario library" onClick={() => setSelected(null)} variant="ghost" small style={{ marginTop: 12 }} />
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Expr 5.3" />
        <UDLBadge label="Rep 3.4" />
        <UDLBadge label="Engagement 7.3" />
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 12 }}>
        Select a scenario. Choose your support level before you read it.
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[['scaffolded', 'Scaffolded'], ['supported', 'Supported'], ['independent', 'Independent']].map(([v, l]) => (
          <button key={v} onClick={() => setLevel(v)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${level === v ? C.interactive : C.border}`, backgroundColor: level === v ? C.interactive + '10' : 'transparent', color: level === v ? C.interactive : C.secondary, fontSize: 12, fontWeight: level === v ? 700 : 400, textAlign: 'center' }}>{l}</button>
        ))}
      </div>

      {pausing && (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 14, color: C.secondary, marginBottom: 8 }}>Pause before you begin.</div>
          <div style={{ fontSize: 13, color: C.secondary }}>Take one breath. Load the scenario in a moment.</div>
        </div>
      )}

      {!pausing && SCENARIOS.map(s => (
        <button key={s.id} onClick={() => selectScenario(s)} style={{
          display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white,
          border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{s.title}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: diffColor[s.difficulty], backgroundColor: diffColor[s.difficulty] + '14', padding: '2px 8px', borderRadius: 10, textTransform: 'capitalize' }}>{s.difficulty}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {s.tags.map(t => <span key={t} style={{ fontSize: 10, color: C.secondary, backgroundColor: C.border + '80', padding: '2px 7px', borderRadius: 8 }}>{t}</span>)}
            {s.rules.map(r => <span key={r} style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '14', padding: '2px 7px', borderRadius: 8 }}>R{r}</span>)}
          </div>
        </button>
      ))}
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.2" />
        <UDLBadge label="Engagement 8.2" />
        <UDLBadge label="ADHD: Pause gate" />
      </div>
    </div>
  );
}

function Module4Trivia({ navigate }) {
  const [tier, setTier] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const tierColors = { foundation: DC[3], application: DC[1], challenge: DC[5] };
  const questions = tier ? TRIVIA_Q.filter(q => q.tier === tier) : [];
  const current = questions[qIdx];

  const next = () => {
    if (qIdx < questions.length - 1) { setQIdx(i => i + 1); setRevealed(false); }
    else setDone(true);
  };

  if (!tier) return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Rule Trivia</div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Choose a tier. Start where you feel ready today — not where you think you should be.
      </div>
      {[
        { id: 'foundation', label: 'Foundation', desc: 'Definitional recall. What does the term or rule mean?', qs: 4 },
        { id: 'application', label: 'Application', desc: 'Scenario identification. Which rule applies and what does it require?', qs: 4 },
        { id: 'challenge', label: 'Challenge', desc: 'Complex analysis. Bilateral reasoning and framework synthesis.', qs: 4 },
      ].map(t => (
        <button key={t.id} onClick={() => setTier(t.id)} style={{
          display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white,
          border: `2px solid ${C.border}`, borderLeft: `5px solid ${tierColors[t.id]}`,
          borderRadius: 10, padding: '14px', cursor: 'pointer', marginBottom: 10,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: tierColors[t.id], marginBottom: 4 }}>{t.label}</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5, marginBottom: 4 }}>{t.desc}</div>
          <div style={{ fontSize: 11, color: C.secondary }}>{t.qs} questions</div>
        </button>
      ))}
      <div style={{ padding: 12, backgroundColor: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginTop: 4, fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>
        When a question surprises you, that question is the one to keep. An unexpected answer is the most valuable moment in this deck.
      </div>
    </div>
  );

  if (done) return (
    <div style={{ paddingTop: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 12 }}>Deck Complete</div>
      <Card style={{ textAlign: 'left', borderLeft: `4px solid ${tierColors[tier]}` }}>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>
          The questions that surprised you are the ones most worth revisiting. Save them for your next session.
        </div>
      </Card>
      <Btn label="Try another tier" onClick={() => { setTier(null); setQIdx(0); setRevealed(false); setDone(false); }} variant="secondary" style={{ marginTop: 12 }} />
      <Btn label="← Back to Practice" onClick={() => navigate('module4')} variant="ghost" small style={{ marginTop: 8 }} />
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: `${((qIdx + 1) / questions.length) * 100}%`, height: 4, backgroundColor: tierColors[tier], borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary }}>{qIdx + 1}/{questions.length}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: tierColors[tier], backgroundColor: tierColors[tier] + '14', padding: '2px 8px', borderRadius: 10, textTransform: 'capitalize' }}>{tier}</span>
      </div>

      <Card style={{ borderLeft: `4px solid ${tierColors[tier]}` }}>
        {current.rule > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>Rule {current.rule}</div>}
        <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.5 }}>{current.q}</div>
      </Card>

      {!revealed ? (
        <Btn label="Reveal answer" onClick={() => setRevealed(true)} variant="secondary" style={{ marginBottom: 8 }} />
      ) : (
        <div>
          <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>ANSWER</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.6, marginBottom: 10 }}>{current.a}</div>
            <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>{current.explanation}</div>
          </Card>
          <div style={{ padding: 10, backgroundColor: DC[4] + '08', borderRadius: 10, border: `1px solid ${DC[4] + '40'}`, marginBottom: 12, fontSize: 13, color: C.primary, lineHeight: 1.6 }}>
            If this answer surprised you — mark this question. Surprising answers are the most valuable ones.
          </div>
          <Btn label={qIdx < questions.length - 1 ? 'Next question →' : 'Complete deck →'} onClick={next} variant="primary" />
        </div>
      )}
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.3" />
        <UDLBadge label="Engagement 8.2" />
        <UDLBadge label="Expr 5.3" />
      </div>
    </div>
  );
}

function Module4Flashcards({ navigate }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] = useState({});
  const [done, setDone] = useState(false);

  const term = TERMS[idx];
  const rated = Object.keys(ratings).length;
  const pct = Math.round((rated / TERMS.length) * 100);

  const rate = (val) => {
    setRatings(p => ({ ...p, [term.id]: val }));
    setFlipped(false);
    if (idx < TERMS.length - 1) setTimeout(() => setIdx(i => i + 1), 300);
    else setDone(true);
  };

  if (done) return (
    <div style={{ paddingTop: 8, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 12 }}>Deck Complete</div>
      <Card style={{ textAlign: 'left' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>YOUR RATINGS</div>
        {[['not-yet', '📌 Not yet', C.secondary], ['almost', '🔄 Almost', C.activated], ['know-it', '✅ Know it', C.calm]].map(([v, l, c]) => {
          const count = Object.values(ratings).filter(r => r === v).length;
          return count > 0 ? <div key={v} style={{ fontSize: 13, color: c, fontWeight: 700, marginBottom: 4 }}>{l}: {count} terms</div> : null;
        })}
      </Card>
      <Btn label="Restart deck" onClick={() => { setIdx(0); setFlipped(false); setRatings({}); setDone(false); }} variant="secondary" style={{ marginTop: 12 }} />
      <Btn label="← Back to Practice" onClick={() => navigate('module4')} variant="ghost" small style={{ marginTop: 8 }} />
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: 4, backgroundColor: C.calm, borderRadius: 2, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary }}>{rated}/{TERMS.length}</span>
      </div>

      {/* Card with flip */}
      <div style={{ perspective: 1000, marginBottom: 16, minHeight: 240 }} onClick={() => setFlipped(f => !f)}>
        <div style={{ position: 'relative', width: '100%', minHeight: 240, transition: 'transform 0.5s', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          {/* Front */}
          <div style={{ position: 'absolute', width: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', backgroundColor: C.white, borderRadius: 16, border: `2px solid ${DC[term.domainNum]}`, padding: 24, minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxSizing: 'border-box' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{term.metaphor.symbol}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.primary, marginBottom: 8 }}>{term.name}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], backgroundColor: DC[term.domainNum] + '18', padding: '3px 10px', borderRadius: 12 }}>{DOMAIN_LABELS[term.domainNum]}</div>
            <div style={{ fontSize: 12, color: C.secondary, marginTop: 16 }}>Tap to flip</div>
          </div>
          {/* Back */}
          <div style={{ position: 'absolute', width: '100%', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: DC[term.domainNum] + '08', borderRadius: 16, border: `2px solid ${DC[term.domainNum]}`, padding: 20, minHeight: 240, boxSizing: 'border-box' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], letterSpacing: 0.4, marginBottom: 8 }}>PLAIN LANGUAGE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.5, marginBottom: 12 }}>{term.plain}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.activated, letterSpacing: 0.4, marginBottom: 4 }}>WHAT IT IS NOT</div>
            <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{term.boundary.split('.')[0]}.</div>
          </div>
        </div>
      </div>

      {/* Rating buttons — only after flip */}
      {flipped && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, textAlign: 'center', marginBottom: 10 }}>HOW DID THAT FEEL?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['not-yet', '📌 Not yet', C.secondary], ['almost', '🔄 Almost', C.activated], ['know-it', '✅ Know it', C.calm]].map(([v, l, c]) => (
              <button key={v} onClick={(e) => { e.stopPropagation(); rate(v); }} style={{ flex: 1, padding: '10px 4px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${c}`, backgroundColor: c + '12', color: c, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>{l}</button>
            ))}
          </div>
        </div>
      )}

      {!flipped && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: C.secondary }}>Read the front. Recall the definition. Then tap to check.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
            {idx > 0 && <button onClick={() => { setIdx(i => i - 1); setFlipped(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.interactive, fontWeight: 700 }}>← Previous</button>}
            <button onClick={() => { if (idx < TERMS.length - 1) { setIdx(i => i + 1); setFlipped(false); } else setDone(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.interactive, fontWeight: 700 }}>Skip →</button>
          </div>
        </div>
      )}
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Rep 2.5" />
        <UDLBadge label="Expr 5.3" />
        <UDLBadge label="Engagement 7.3" />
      </div>
    </div>
  );
}

function Module4Generator({ navigate }) {
  const [situation, setSituation] = useState('');
  const [category, setCategory] = useState('');
  const [cluster, setCluster] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const categories = ['Acquaintance (Ring 2)', 'Casual Friend (Ring 3)', 'Friend (Ring 4)', 'Trusted Friend (Ring 5)', 'Professional Contact'];
  const clusters = ['Before the Interaction', 'During the Interaction', 'After the Interaction', 'Periodic Evaluation'];

  const generate = async () => {
    if (!situation.trim() || !category || !cluster) return;
    setLoading(true);
    setError('');
    setResult(null);

    // Template fallback when no API key is configured
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      const ruleMap = { 'Before the Interaction': [1, 2, 8], 'During the Interaction': [4, 5, 7, 9], 'After the Interaction': [3, 6, 10, 11], 'Periodic Evaluation': [12, 13] };
      const rules = ruleMap[cluster] || [1];
      const templateResult = {
        title: 'Practice Scenario: ' + cluster,
        scenario: 'Alex navigates a situation involving ' + category.split('(')[0].trim() + '. A decision point arises that connects to the ' + cluster + ' rules.',
        rules: rules.slice(0, 2),
        ruleNames: rules.slice(0, 2).map(function(r) { var f = RULES_SIMPLE.find(function(x) { return x.num === r; }); return f ? f.title : 'Rule ' + r; }),
        analysisQuestions: [
          'What specific behavior in this scenario raises a concern?',
          'Which rule from the ' + cluster + ' cluster applies most directly?',
          'What is the correct next action according to the framework?',
          'Bilateral: If this were your behavior in a recent interaction, what would the correction pathway be?'
        ]
      };
      setResult(templateResult);
      setLoading(false);
      return;
    }

    const prompt = `Generate a practice scenario card for a social-emotional learning framework.

Student's real situation: "${situation}"
Relationship category: ${category}
Most relevant rule cluster: ${cluster}

Framework rules: ${AI_RULES_SUMMARY}

Requirements:
- Rewrite entirely in third person. Use "Alex" for the student.
- Make ALL social information explicit — state every behavior, tone, and signal as observable fact. No implied subtext. The learner has ASD and benefits from full behavioral description.
- Keep scenario under 90 words.
- Identify 1-2 most relevant rule numbers.
- Generate 4 bilateral analysis questions. Question 4 must be the inward/bilateral question ("If this were your behavior...").

Respond with ONLY valid JSON, no markdown, no explanation:
{"title":"short title","scenario":"the scenario text","rules":[1,2],"ruleNames":["Rule name 1","Rule name 2"],"analysisQuestions":["q1","q2","q3","q4 bilateral"]}`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
            'anthropic-version': '2023-06-01',
          },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('');
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError('Unable to generate the scenario right now. Check your connection and try again.');
    }
    setLoading(false);
  };

  if (result) return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.calm, marginBottom: 4 }}>✨ Generated from your situation</div>

      <Card style={{ borderLeft: `4px solid ${C.interactive}` }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {(result.ruleNames || []).map(n => <span key={n} style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '14', padding: '2px 8px', borderRadius: 10 }}>{n}</span>)}
          {(result.rules || []).map(r => <span key={r} style={{ fontSize: 10, fontWeight: 700, color: C.secondary, backgroundColor: C.border + '80', padding: '2px 7px', borderRadius: 8 }}>Rule {r}</span>)}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.primary, marginBottom: 10 }}>{result.title}</div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{result.scenario}</div>
      </Card>

      <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>BILATERAL ANALYSIS</div>
      {(result.analysisQuestions || []).map((q, i) => (
        <div key={i} style={{ padding: '10px 12px', borderLeft: `3px solid ${i === 3 ? DC[4] : C.border}`, backgroundColor: i === 3 ? DC[4] + '08' : 'transparent', borderRadius: '0 8px 8px 0', marginBottom: 8 }}>
          <div style={{ fontSize: 13, color: i === 3 ? DC[4] : C.primary, fontWeight: i === 3 ? 700 : 400, lineHeight: 1.5 }}>
            {i === 3 ? '↩ Bilateral: ' : `${i + 1}. `}{q}
          </div>
        </div>
      ))}

      <div style={{ padding: 12, backgroundColor: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginTop: 4, fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
        This scenario was generated from your real situation. The third-person framing is intentional — it creates enough distance to examine the pattern objectively.
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Btn label="Generate another" onClick={() => setResult(null)} variant="secondary" />
        <Btn label="← Practice" onClick={() => navigate('module4')} variant="ghost" small />
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.2" />
        <UDLBadge label="Rep 3.4" />
        <UDLBadge label="PTSD: 3rd-person framing" />
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>AI Scenario Generator</div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Describe a real situation. The generator will rewrite it as a third-person practice scenario — enough distance to examine it clearly.
      </div>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>DESCRIBE THE SITUATION</div>
        <textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="What happened, or what are you anticipating? Be specific about what was said and done." style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 90, boxSizing: 'border-box' }} />
      </Card>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>RELATIONSHIP CATEGORY</div>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ display: 'block', width: '100%', padding: '9px 12px', marginBottom: 5, borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${category === c ? C.interactive : C.border}`, backgroundColor: category === c ? C.interactive + '10' : 'transparent', color: category === c ? C.interactive : C.primary, fontWeight: category === c ? 700 : 400, textAlign: 'left', fontSize: 13 }}>{c}</button>
        ))}
      </Card>

      <Card>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHICH RULE CLUSTER SEEMS MOST RELEVANT?</div>
        {clusters.map(cl => (
          <button key={cl} onClick={() => setCluster(cl)} style={{ display: 'block', width: '100%', padding: '9px 12px', marginBottom: 5, borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${cluster === cl ? C.interactive : C.border}`, backgroundColor: cluster === cl ? C.interactive + '10' : 'transparent', color: cluster === cl ? C.interactive : C.primary, fontWeight: cluster === cl ? 700 : 400, textAlign: 'left', fontSize: 13 }}>{cl}</button>
        ))}
      </Card>

      {error && <div style={{ padding: 12, backgroundColor: C.redBg, border: `1px solid ${C.red + '60'}`, borderRadius: 10, marginBottom: 12, fontSize: 13, color: C.red }}>{error}</div>}

      <Btn
        label={loading ? 'Generating your scenario...' : 'Generate scenario →'}
        onClick={generate}
        variant={situation.trim() && category && cluster && !loading ? 'primary' : 'ghost'}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: 20, color: C.secondary, fontSize: 13 }}>
          Rewriting your situation into a practice scenario...
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap' }}>
        <UDLBadge label="Engagement 7.2" />
        <UDLBadge label="Rep 3.4" />
        <UDLBadge label="PTSD: 3rd-person framing" />
      </div>
    </div>
  );
}



// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 300,
      background: 'linear-gradient(160deg, #1A2744 0%, #243672 55%, #3D5FC8 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 28px', textAlign: 'center',
    }}>
      {/* Icon */}
      <div style={{ fontSize: 72, marginBottom: 20, filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}>🌱</div>

      {/* Identity */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginBottom: 8 }}>
        YOUR PERSONAL FRAMEWORK
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
        The Art of Friendship
      </div>
      <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 6, maxWidth: 290 }}>
        A set of rules and tools to help you build and protect your relationships.
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>
        Developed by Catrina Wright, MAT
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          backgroundColor: '#fff', color: '#1A2744',
          border: 'none', borderRadius: 14,
          padding: '17px 48px',
          fontSize: 16, fontWeight: 800,
          cursor: 'pointer', letterSpacing: 0.2,
          boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
          width: '100%', maxWidth: 280,
        }}
      >
        Get Started
      </button>

      {/* Module preview */}
      <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '📖', label: 'My Reference' },
          { icon: '✉️', label: 'Before I Communicate' },
          { icon: '📊', label: 'My Tracker' },
          { icon: '🎯', label: 'Practice' },
        ].map(m => (
          <div key={m.label} style={{
            backgroundColor: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 12, color: 'rgba(255,255,255,0.65)',
          }}>
            {m.icon} {m.label}
          </div>
        ))}
      </div>

      {/* Legal */}
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>
        Educational tool · Not a clinical service · CC BY-NC 4.0
      </div>
    </div>
  );
}

// ─── LEGAL SCREEN ─────────────────────────────────────────────────────────────

function LegalScreen({ navigate }) {
  const sections = [
    {
      label: 'Educational Purpose',
      color: DC[1],
      content: 'This application is an educational tool developed as part of the Chicago Public Schools Teacher Residency Program. It presents a structured social-emotional learning framework for developing relationship skills and self-awareness. It is not a clinical intervention, therapeutic program, or mental health treatment of any kind.',
    },
    {
      label: 'Not a Substitute for Professional Services',
      color: DC[2],
      content: 'This application does not replace the services of a licensed mental health professional. Users with clinical diagnoses — including autism spectrum disorder, PTSD, or ADHD — should receive clinical care from licensed professionals. This app is designed to support a professional facilitation relationship, not replace it.',
    },
    {
      label: 'Crisis Situations',
      color: C.overwhelmed,
      content: 'This app is not a crisis intervention tool. If you are experiencing a mental health crisis or immediate danger, call or text 988 (Suicide and Crisis Lifeline) or call 911. The in-app emergency screen provides grounding support only — it does not connect to clinical services.',
    },
    {
      label: 'Scope of Practice',
      color: DC[3],
      content: 'This framework was developed by Catrina Wright, a licensed special education teacher (LBS1). She is not a licensed psychologist, psychiatrist, therapist, or clinical social worker. Nothing in this application constitutes clinical advice, diagnostic information, or a clinical recommendation.',
    },
    {
      label: 'AI-Generated Content',
      color: DC[4],
      content: 'The AI Scenario Generator uses Anthropic\'s Claude API. Generated scenarios are educational examples only — not clinical assessments or professional advice. When used, your situation description is transmitted to Anthropic\'s servers. All other app data stays in your browser session only.',
    },
    {
      label: 'Privacy',
      color: DC[5],
      content: 'This application does not collect, store, or transmit personal data — except when the AI generator is used (see above). All entries — self-audit responses, journal entries, tracker logs — exist only in the current browser session and are permanently deleted when you close the browser tab.',
    },
    {
      label: 'No Warranty',
      color: C.secondary,
      content: 'This application is provided as is, without warranty of any kind. The developer makes no representations about its accuracy, completeness, or suitability for any specific individual without professional adaptation.',
    },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>
        About & Legal
      </div>

      {/* Identity block */}
      <div style={{ backgroundColor: C.primary + '08', borderRadius: 12, padding: 14, marginBottom: 16, border: `1px solid ${C.primary + '20'}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 2 }}>The Art of Friendship</div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>
          A Social-Emotional Learning Framework
        </div>
        <div style={{ fontSize: 12, color: C.secondary, marginTop: 6 }}>
          Developed by Catrina Wright, MAT · LBS1
        </div>
        <div style={{ fontSize: 12, color: C.interactive, marginTop: 2 }}>
          catrinawright.github.io · June 2026
        </div>
        <div style={{ marginTop: 8, padding: '6px 10px', backgroundColor: C.calm + '18', borderRadius: 8, border: `1px solid ${C.calm + '40'}`, display: 'inline-block' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.calm }}>CC BY-NC 4.0 Licensed</span>
        </div>
      </div>

      {/* Disclaimer sections */}
      {sections.map((s, i) => (
        <div key={i} style={{
          backgroundColor: C.white, borderRadius: 10,
          borderLeft: `4px solid ${s.color}`,
          border: `1px solid ${C.border}`,
          borderLeftWidth: 4, borderLeftColor: s.color,
          padding: '12px 14px', marginBottom: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: s.color, letterSpacing: 0.3, marginBottom: 6 }}>
            {s.label.toUpperCase()}
          </div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.7 }}>{s.content}</div>
        </div>
      ))}

      {/* Crisis resources — always visible at bottom */}
      <div style={{
        backgroundColor: C.overwhelmed + '12', borderRadius: 12,
        border: `1.5px solid ${C.overwhelmed + '60'}`, padding: 14, marginTop: 8, marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.overwhelmed, letterSpacing: 0.3, marginBottom: 8 }}>
          CRISIS RESOURCES
        </div>
        {[
          { label: '988 Suicide & Crisis Lifeline', detail: 'Call or text 988 (United States)' },
          { label: 'Crisis Text Line', detail: 'Text HOME to 741741' },
          { label: 'Emergency Services', detail: 'Call 911 for immediate danger' },
        ].map(r => (
          <div key={r.label} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{r.label}</div>
            <div style={{ fontSize: 12, color: C.secondary }}>{r.detail}</div>
          </div>
        ))}
      </div>

      <Btn label="Return home" onClick={() => navigate('home')} variant="secondary" />

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: C.secondary, lineHeight: 1.6 }}>
        Full license and disclaimer available in the project repository.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('home');
  const [prevScreen, setPrevScreen] = useState(null);
  const [regState, setRegState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [settings, setSettings] = useState({
    fontSize: 'standard',
    highContrast: false,
    reducedVisual: false,
    activatedMode: false,
  });
  const [answers, setAnswers] = useState({});
  const [selectedTermId, setSelectedTermId] = useState(1);
  const [selectedRule, setSelectedRule] = useState(1);
  const [module3Dest, setModule3Dest] = useState('module3-audit');

  const weekly_goal = "This week I will practice Rule 4 when I notice someone changing the subject.";

  const navigate = (to) => {
    setPrevScreen(screen);
    setScreen(to);
  };

  const goBack = () => {
    if (prevScreen) {
      setScreen(prevScreen);
      setPrevScreen(null);
    } else {
      setScreen('home');
    }
  };

  const handleEmergency = () => {
    setShowGrounding(false);
    setShowSettings(false);
    navigate('emergency');
  };

  const handleAnswer = (q, val) => {
    setAnswers(prev => ({ ...prev, [q]: val }));
  };

  const fontSize = FONT_SIZES[settings.fontSize];

  const screenTitles = {
    home: null,
    legal: 'About & Legal',
    navigator: 'After an Interaction',
    regulation: 'Check In',
    'overwhelmed-stop': 'Stop Here',
    emergency: null,
    module1: 'My Reference',
    'module1-term': 'Term Detail',
    'module1-rules': 'Rule Cards',
    'module1-map': 'Framework Map',
    'module1-rule': 'Rule Detail',
    module4: 'Practice',
    'module4-scenarios': 'Scenario Cards',
    'module4-trivia': 'Rule Trivia',
    'module4-flashcards': 'Flashcard Deck',
    'module4-generator': 'AI Generator',
    module3: 'My Tracker',
    'module3-gate': 'Check In First',
    'module3-audit': 'Self-Audit',
    'module3-skill': 'Skill Tracker',
    'module3-applied': 'Rule Applied',
    'module3-initiation': 'Initiation Tracker',
    'module3-journal': 'Bilateral Journal',
    'module3-health': 'Health Check',
    'module2-anchor': 'Module 2',
    'module2-q1': 'Pre-Comm Checklist',
    'module2-q2': 'Pre-Comm Checklist',
    'module2-q3': 'Pre-Comm Checklist',
    'module2-q4': 'Pre-Comm Checklist',
    'module2-q5': 'Pre-Comm Checklist',
    'module2-result': 'Your Result',
    'module2-prepare': 'Prepare for This',
    'module1': 'My Reference',
    'module3': 'My Tracker',
    'module4': 'Practice',
  };

  const showBack = screen !== 'home' && screen !== 'emergency';
  const screenTitle = screen.startsWith('module1-rule-')
    ? 'Rule ' + screen.replace('module1-rule-', '')
    : screenTitles[screen];

  const renderScreen = () => {
    if (screen === 'home') return <HomeScreen navigate={navigate} regState={regState} goal={weekly_goal} />;
    if (screen === 'navigator') return <NavigatorScreen navigate={navigate} setDest={setModule3Dest} />;
    if (screen === 'regulation') return <RegulationScreen navigate={navigate} onSetReg={setRegState} regState={regState} />;
    if (screen === 'overwhelmed-stop') return <OverwhelmedStop navigate={navigate} onEmergency={handleEmergency} />;
    if (screen === 'emergency') return <EmergencyScreen navigate={navigate} />;
    if (screen === 'module2-anchor') return <Module2Anchor navigate={navigate} settings={settings} />;
    if (screen === 'module2-q1') return <Module2Question qNum={1} navigate={navigate} answers={answers} onAnswer={handleAnswer} settings={settings} />;
    if (screen === 'module2-q2') return <Module2Question qNum={2} navigate={navigate} answers={answers} onAnswer={handleAnswer} settings={settings} />;
    if (screen === 'module2-q3') return <Module2Question qNum={3} navigate={navigate} answers={answers} onAnswer={handleAnswer} settings={settings} />;
    if (screen === 'module2-q4') return <Module2Question qNum={4} navigate={navigate} answers={answers} onAnswer={handleAnswer} settings={settings} />;
    if (screen === 'module2-q5') return <Module2Question qNum={5} navigate={navigate} answers={answers} onAnswer={handleAnswer} settings={settings} />;
    if (screen === 'module2-result') return <Module2Result navigate={navigate} answers={answers} />;
    if (screen === 'module2-prepare') return <Module2Prepare navigate={navigate} />;
    if (screen === 'module1') return <Module1Home navigate={navigate} setSelectedTerm={setSelectedTermId} settings={settings} />;
    if (screen === 'module1-term') return <Module1TermDetail navigate={navigate} termId={selectedTermId} settings={settings} />;
    if (screen === 'module1-rules') return <Module1RuleCards navigate={navigate} />;
    if (screen === 'module1-map') return <Module1FrameworkMap navigate={navigate} setSelectedTerm={setSelectedTermId} />;
    // Rule detail — handles module1-rule-1 through module1-rule-13
    if (screen.startsWith('module1-rule-')) {
      const num = parseInt(screen.replace('module1-rule-', ''));
      return <Module1RuleDetail navigate={navigate} ruleNum={num} setSelectedTerm={setSelectedTermId} />;
    }
    if (screen === 'module3') return <Module3Home navigate={navigate} setDest={setModule3Dest} goal={weekly_goal} />;
    if (screen === 'module3-gate') return <Module3Gate navigate={navigate} dest={module3Dest} onSetReg={setRegState} regState={regState} />;
    if (screen === 'module3-audit') return <Module3SelfAudit navigate={navigate} settings={settings} />;
    if (screen === 'module3-skill') return <Module3SkillTracker navigate={navigate} />;
    if (screen === 'module3-applied') return <Module3Applied navigate={navigate} />;
    if (screen === 'module3-initiation') return <Module3InitiationTracker navigate={navigate} />;
    if (screen === 'module3-journal') return <Module3Journal navigate={navigate} />;
    if (screen === 'module3-health') return <Module3HealthCheck navigate={navigate} />;
    if (screen === 'module4') return <Module4Home navigate={navigate} />;
    if (screen === 'module4-scenarios') return <Module4Scenarios navigate={navigate} />;
    if (screen === 'module4-trivia') return <Module4Trivia navigate={navigate} />;
    if (screen === 'module4-flashcards') return <Module4Flashcards navigate={navigate} />;
    if (screen === 'module4-generator') return <Module4Generator navigate={navigate} />;
    if (screen === 'legal') return <LegalScreen navigate={navigate} />;
    return <HomeScreen navigate={navigate} regState={regState} goal={weekly_goal} />;
  };

  const isEmergency = screen === 'emergency';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A2744',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: fontSize,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        height: '100svh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.bg,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 80px rgba(0,0,0,0.5)',
      }}>
        {showWelcome && <WelcomeScreen onStart={() => { setShowWelcome(false); navigate('module1'); }} />}

        {isEmergency ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <RegBar state="overwhelmed" />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <EmergencyScreen navigate={navigate} />
            </div>
          </div>
        ) : (
          <Shell
            regState={regState}
            title={screenTitle}
            onBack={showBack ? goBack : null}
            onEmergency={handleEmergency}
            onSettings={() => setShowSettings(true)}
            onGrounding={() => setShowGrounding(true)}
          >
            {renderScreen()}
          </Shell>
        )}

        {showGrounding && (
          <GroundingOverlay
            onClose={() => setShowGrounding(false)}
            onEmergency={handleEmergency}
            regState={regState}
          />
        )}
        {showSettings && (
          <SettingsPanel
            settings={settings}
            onChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
}
