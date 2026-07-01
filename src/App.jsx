import { useState, useEffect } from "react";

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
    plain: 'A friendship is when two people both choose to be in it. Both people show up. Both people put in effort. Not just one.',
    definition: 'A friendship is something both people choose. Both people put in time. Both people share things. Both people show up when it gets hard. If only one person does all of that, it is not a friendship yet.',
    boundary: 'Seeing someone a lot does not make them a friend. Being kind to you does not make them a friend. A friend is someone who shows up for you over time. Both of you show up for each other.',
    ruleAnchor: 'Someone is a friend when both of you choose to be there for each other. Not just once. Over time.',
    metaphor: { symbol: '🌱', concept: 'A seedling watered from both sides', explanation: 'A plant that only gets water from one side does not grow the same way. Friendship requires both people to keep showing up.' },
    audioText: 'A friendship is when two people both choose to be in it. Both people show up. Both people put in effort. If only one person does all of that, it is not a friendship yet.',
    activationPrompt: 'Think of someone you call a friend. What is one thing they have done that shows they are really your friend?',
  },
  {
    id: 2, domainNum: 1, linkedRule: 1,
    name: 'Acquaintance',
    plain: 'Someone you know by face or name. You might say hi. But you have not built trust with them yet.',
    definition: 'An acquaintance is someone you know but have not built trust with yet. You might see them around. You might say hi. But you have not shared personal things with them. You have not spent time together outside of where you met.',
    boundary: 'An acquaintance is not a friend yet. That is okay. A friendship takes time to build. Just because you know someone does not mean they are in a closer ring.',
    ruleAnchor: 'Keep things light with an acquaintance. Do not share personal things yet. Wait until you know them better.',
    metaphor: { symbol: '👋', concept: 'A wave across a crowded room', explanation: 'You see each other. You acknowledge each other. But neither of you has crossed the room yet.' },
    audioText: 'An acquaintance is someone you know but have not built trust with. You might see them around. You might say hi. But the relationship is still new. That is okay.',
    activationPrompt: 'Think of one person who is an acquaintance right now. What would need to happen before they could move to a closer ring?',
  },
  {
    id: 3, domainNum: 1, linkedRule: 1,
    name: 'Relational Rings',
    plain: 'Right now, based on what they have actually done. Ring 1 is someone you do not know. Ring 2 is someone you know but have not built trust with yet. Ring 3 is someone you like being around. Ring 4 is a real friend. Ring 5 is someone you trust with the hard things. The ring can change. It is where someone is right now — not who they are forever.',
    definition: 'The rings are a way to think about how close someone is to you right now. Ring 1 is a stranger — someone you do not know. Ring 2 is an acquaintance — someone you know but have not built trust with. Ring 3 is a casual friend — someone you enjoy being around. Ring 4 is a friend — someone who shows up for you. Ring 5 is a trusted friend — someone you can share the hard things with. The ring can change. It is where someone is right now based on what they actually do.',
    boundary: 'Someone does not move to a closer ring just because you want them there. They move closer when they show you through what they do that they belong there. What someone does matters more than how they feel to you.',
    ruleAnchor: 'Before you talk to someone, think about which ring they are in. That tells you what is okay to share and what to keep to yourself.',
    metaphor: { symbol: '🎯', concept: 'Concentric circles — each inner ring requires a specific earned invitation', explanation: 'You cannot move someone inward by wanting them there. They move inward by showing you, through what they do, that they belong there.' },
    audioText: 'The rings are five levels of closeness. Ring 1 is a stranger. Ring 2 is an acquaintance. Ring 3 is a casual friend. Ring 4 is a friend. Ring 5 is a trusted friend. The ring can change. It is where someone is right now based on what they actually do.',
    activationPrompt: 'Think of three people in your life. For each one — what have they actually done for you? Not how they feel. What they actually did. That is how you know where they belong.',
  },
  {
    id: 4, domainNum: 1, linkedRule: 3,
    name: 'Mutual Friendship',
    plain: 'A friendship where both people reach out. Both people share. Both people show up. Not just one.',
    definition: 'A mutual friendship is when both people put in effort. You reach out to them. They reach out to you too. You ask how they are doing. They ask how you are doing. Both people show up when something hard happens.',
    boundary: 'A friendship is not mutual just because both of you say you are friends. Mutual means both people actually do the things that make a friendship real. What each person does matters more than what they say.',
    ruleAnchor: 'Check whether the friendship is going both ways. Are they reaching out to you too? Or are you doing all the work?',
    metaphor: { symbol: '⚖️', concept: 'A balance scale where both sides carry weight', explanation: 'If only one side adds weight, the scale tips. Mutual means both sides keep showing up — not just one.' },
    audioText: 'A mutual friendship is when both people show up for each other. Both reach out. Both share. Both show up when things get hard. If only one person is doing all of that, the friendship is one-directional.',
    activationPrompt: 'Think of a friendship in your life. Is it mutual? Do both of you reach out? Do both of you show up?',
  },
  {
    id: 5, domainNum: 1, linkedRule: 3,
    name: 'One-Directional Social Interest',
    plain: 'When one person does all the work. One person always reaches out first. One person always checks in. The other person does not do those things back.',
    definition: 'One-directional social interest is when only one person puts in effort. You are the one reaching out. You are the one checking in. You are the one showing up. The other person receives all of that but does not give it back.',
    boundary: 'This does not always mean the other person does not like you. But it does tell you something. If you stopped reaching out, would they? That answer tells you where things really are.',
    ruleAnchor: 'If you have reached out three times in a row without them reaching out first, pause. Check where things really are before you keep going.',
    metaphor: { symbol: '🧲', concept: 'A magnet reaching toward something that does not pull back', explanation: 'The pull is real. The force is genuine. But when it only flows one direction, the connection cannot hold on its own.' },
    audioText: 'One-directional social interest is when only one person puts in the effort. You reach out. They do not reach out to you. That is information about where the relationship really is right now.',
    activationPrompt: 'Think of someone you talk to often. Who reaches out first most of the time? Who checks in on the other person more?',
  },
  {
    id: 6, domainNum: 2, linkedRule: 4,
    name: 'Explicit Social Signal',
    plain: 'A clear message that says exactly what someone needs or feels. You do not have to guess. They told you directly.',
    definition: 'An explicit signal is when someone says clearly what they need or how they feel. They say it out loud. You do not have to guess. Examples: saying I need a minute, or I am not okay, or I do not want to talk about that right now.',
    boundary: 'An explicit signal is not the same as an implicit one. An explicit signal is said out loud. An implicit signal is shown through behavior without words. Both are real. Both matter.',
    ruleAnchor: 'When someone gives you an explicit signal, respond to it right away. Do not wait. Do not argue with it.',
    metaphor: { symbol: '📢', concept: 'A sign held up in plain view', explanation: 'You do not have to interpret a sign. You read it. An explicit signal works the same way.' },
    audioText: 'An explicit signal is when someone tells you clearly what they need or feel. They said it out loud. You do not have to guess. Respond to it right away.',
    activationPrompt: 'Think of a time someone told you clearly what they needed. What did they say? How did you respond?',
  },
  {
    id: 7, domainNum: 2, linkedRule: 5,
    name: 'Implicit Social Signal',
    plain: 'A quiet message that is not said out loud. You have to notice it in how the person acts — not what they say.',
    definition: 'An implicit signal is when someone shows how they feel without saying it directly. They might go quiet. They might give one-word replies. They might look away or change the subject. The signal is there. You have to look for it in what they do, not what they say.',
    boundary: 'An implicit signal is not the same as nothing happening. When someone goes quiet or gives one-word replies, something has shifted. That shift is the signal.',
    ruleAnchor: 'Look for changes in how someone is acting during a conversation. A change in their behavior is a signal. Notice it and respond.',
    metaphor: { symbol: '🌡️', concept: 'A temperature change you feel before anyone announces it', explanation: 'The room gets colder before anyone says anything. The change itself is the signal.' },
    audioText: 'An implicit signal is when someone shows how they feel without saying it. Going quiet, giving one-word replies, looking away — these are all signals. Look for them.',
    activationPrompt: 'Think of a time someone went quiet during a conversation. What do you think was happening? What were they showing you without saying it?',
  },
  {
    id: 8, domainNum: 2, linkedRule: 6,
    name: 'Response Latency',
    plain: 'How long someone takes to respond to you. When that changes from their normal pattern, it is a signal.',
    definition: 'Response latency is how long someone takes to get back to you. Every person has their own normal speed. What matters is when their speed changes. If someone who usually replies fast suddenly takes much longer, something has shifted.',
    boundary: 'A slow response is not always a bad sign. Some people are naturally slower to reply. The signal is not the speed. The signal is a change from what is normal for that person.',
    ruleAnchor: 'If someone takes longer than usual to reply, do not send more messages. Give them space.',
    metaphor: { symbol: '⏱️', concept: 'A clock measuring the space between a question and its answer', explanation: 'A longer pause than usual is data. The space itself is communicating something worth noticing.' },
    audioText: 'Response latency is how long it takes someone to reply. When their normal speed changes, that is a signal. Pay attention to changes — not just to how fast or slow they usually are.',
    activationPrompt: 'Think of someone you talk to regularly. How fast do they usually respond? Has that ever changed? What did you think the change meant?',
  },
  {
    id: 9, domainNum: 3, linkedRule: 7,
    name: 'Reciprocal Communication',
    plain: 'A conversation where both people talk and both people listen. Both people ask questions. No one does all the talking.',
    definition: 'Reciprocal communication is when both people take turns. One person talks. The other person listens. Then they switch. Both people ask questions. Both people share. No one does all the talking.',
    boundary: 'A conversation is not reciprocal just because two people are both there. Reciprocal means both people are actually engaged. Both are asking. Both are sharing.',
    ruleAnchor: 'For every three things you share about yourself, ask one real question about the other person. That keeps the conversation going in both directions.',
    metaphor: { symbol: '🏸', concept: 'A rally where both players keep returning the shot', explanation: 'One player cannot carry the game. The rally requires both people to send and receive.' },
    audioText: 'Reciprocal communication means both people take turns. One talks, one listens. Then they switch. Both people ask questions. The conversation goes back and forth.',
    activationPrompt: 'Think about a conversation you had recently. Did both people talk? Did both people ask questions? Or did one person do most of the talking?',
  },
  {
    id: 10, domainNum: 3, linkedRule: 8,
    name: 'Topic Appropriateness',
    plain: 'Choosing what to talk about based on which ring the person is in. Some topics are for Ring 4 and Ring 5 only. Not for everyone.',
    definition: 'Topic appropriateness means choosing what to talk about based on which ring the person is in. Some topics are okay with everyone. Other topics are only for Ring 4 and Ring 5 people. Sharing something very personal with someone in Ring 2 can feel uncomfortable for both of you.',
    boundary: 'What is appropriate to share with one person may not be appropriate with another. It is not about the topic itself. It is about which ring the person is in.',
    ruleAnchor: 'Before you bring up something personal or heavy, think about which ring this person is in. If the topic is more personal than that ring allows, save it for someone closer.',
    metaphor: { symbol: '🗺️', concept: 'A map where different roads lead to different destinations', explanation: 'Some topics require a relationship that has not been built yet. The road exists — it just has not opened for this pairing.' },
    audioText: 'Topic appropriateness means sharing what is right for the ring. Personal topics belong with Ring 4 and Ring 5 people. Keep it lighter with Ring 2 and Ring 3 people.',
    activationPrompt: 'Think of something personal you shared recently. Was the person in the right ring for that topic? How did the conversation go?',
  },
  {
    id: 11, domainNum: 3, linkedRule: 9,
    name: 'Social Interaction Structure',
    plain: 'Every conversation has three parts: an opening, a middle where both people take turns, and a close that signals it is ending.',
    definition: 'Every conversation has three parts. It starts with an opening — a greeting that fits the situation. The middle is where you take turns talking and listening. At the end, there is a close — something that signals the conversation is finishing. All three parts matter.',
    boundary: 'A conversation that ends suddenly — without a close — can feel confusing to the other person. It can feel like you disappeared or stopped caring. All interactions need a close, even a short one.',
    ruleAnchor: 'Before you leave any conversation, say something that lets the other person know you are wrapping up. A brief close matters. Always signal the end.',
    metaphor: { symbol: '🎭', concept: 'A play with three acts — entrance, story, and curtain call', explanation: 'A play that ends mid-scene leaves the audience confused. A conversation without a close does the same thing.' },
    audioText: 'Every conversation has three parts. An opening. A middle where both people take turns. And a close that signals it is ending. Always end with a close. Never just disappear.',
    activationPrompt: 'Think of a conversation that ended with no real goodbye. How did that feel? That feeling is why the close matters.',
  },
  {
    id: 12, domainNum: 4, linkedRule: 10,
    name: 'Social Trigger',
    plain: 'Something specific that causes you to react strongly during a conversation. A word, a tone, a topic, or a situation.',
    definition: 'A social trigger is something specific that causes you to react strongly. It could be a word, a tone of voice, a topic, or a situation. Triggers are different for everyone. Knowing yours helps you prepare before the reaction takes over.',
    boundary: 'Knowing your triggers does not excuse the reaction they cause. Knowing them is how you prepare so the reaction does not take over the interaction.',
    ruleAnchor: 'Know what your triggers are. When one activates, use your plan before you keep going with the interaction.',
    metaphor: { symbol: '⚡', concept: 'A circuit breaker that trips when the current gets too high', explanation: 'The breaker does not choose to trip. The overload trips it. Knowing your triggers means knowing what overloads your circuit.' },
    audioText: 'A social trigger is something specific that reliably causes a strong reaction in you. Knowing your triggers is how you prepare for them. It is not an excuse. It is preparation.',
    activationPrompt: 'Is there a word, a tone of voice, or a type of situation that always causes a strong reaction in you? That is a trigger.',
  },
  {
    id: 13, domainNum: 4, linkedRule: 11,
    name: 'Social Boundary',
    plain: 'A personal limit about what is okay in an interaction. Said clearly. Respected on both sides.',
    definition: 'A social boundary is a personal limit. It is about what is okay and what is not okay in an interaction. Healthy boundaries are said clearly. They are respected on both sides.',
    boundary: 'A boundary is not a punishment. It is not a rejection. Saying what your boundary is shows that you know what you need. When someone shares their boundary with you, the only right response is to accept it and adjust.',
    ruleAnchor: 'When someone tells you their boundary, stop what you were doing and adjust right away. Do not argue. Do not ask them to explain it.',
    metaphor: { symbol: '🚪', concept: 'A door with a lock — only you decide who gets a key', explanation: 'The door being locked is not unfriendliness. It is ownership. Being handed a key is a significant act of trust.' },
    audioText: 'A social boundary is a personal limit about what is okay in an interaction. It is not a rejection. When someone shares their boundary with you, accept it and adjust right away. No argument.',
    activationPrompt: 'Is there something in conversations that consistently makes you uncomfortable? That discomfort is telling you where your boundary is.',
  },
  {
    id: 14, domainNum: 5, linkedRule: 12,
    name: 'Healthy Friendship Pattern',
    plain: 'A friendship where both people feel heard, valued, and free to be themselves. Both people show up. Both people respect each other.',
    definition: 'A healthy friendship is one where both people feel good about being in it. Both people feel heard. Both people can be themselves without being judged. Both people show up for each other. Both people respect what the other person needs.',
    boundary: 'A healthy friendship pattern applies to both people. You check the other person and you check yourself. Both sides of the friendship need to meet the standard.',
    ruleAnchor: 'Use the healthy friendship pattern as a checklist for any relationship you are in. Check both what the other person does and what you do.',
    metaphor: { symbol: '🧩', concept: 'Puzzle pieces that fit without being forced', explanation: 'Healthy relationships do not require either person to reshape themselves to fit. The connection is natural and mutual.' },
    audioText: 'A healthy friendship is one where both people feel heard, valued, and free to be themselves. Both people show up. Both people respect each other. Check both sides — theirs and yours.',
    activationPrompt: 'Think of a relationship where you feel the most like yourself. What makes that possible? Those things are the healthy pattern.',
  },
  {
    id: 15, domainNum: 5, linkedRule: 13,
    name: 'Exploitative or Unsafe Pattern',
    plain: 'When one person keeps crossing the other person and using them for their own benefit. There are specific signs to look for.',
    definition: 'An unsafe pattern is when one person keeps crossing the other person and using them for their own benefit. Signs include: crossing a boundary even after being told about it, showing warmth only when they want something from you, pushing you to stop talking to other people, and using your emotions to get what they want.',
    boundary: 'Unsafe patterns are not always done on purpose. What matters is what keeps happening and what effect it has. Check both the other person and yourself.',
    ruleAnchor: 'If two or more unsafe signs appear in a relationship, talk to your trusted adult before you keep investing in it.',
    metaphor: { symbol: '🕸️', concept: 'A web — some connections hold you in place without your consent', explanation: 'A web looks like connection from a distance. The difference is whether you can leave freely.' },
    audioText: 'An unsafe pattern is when one person keeps crossing the other and using them. Signs include repeated boundary crossing, warmth that appears only when they want something, and pressure to stop seeing other people. Two or more of these means talk to your trusted adult.',
    activationPrompt: 'Think of a relationship where you often felt drained, guilty, or unsure of yourself. Those feelings are worth looking at more closely.',
  },
  {
    id: 16, domainNum: 5, linkedRule: 13,
    name: 'Manipulation vs Self-Advocacy',
    plain: 'Self-advocacy is asking for what you need and letting the other person decide freely. Manipulation takes away their freedom to say no.',
    definition: 'Manipulation is when you try to get what you want in a way that takes away the other person freedom to say no. Self-advocacy is when you say clearly what you need and let the other person decide freely. The difference is whether they have a real choice.',
    boundary: 'A need can be real and still be asked for in a way that puts pressure on the other person. The need being real does not make the method okay. Check the method separately from the need.',
    ruleAnchor: 'Before you ask for something, ask yourself: does this let the other person say no without feeling guilty, scared, or pressured? If yes, it is self-advocacy. If no, it is manipulation.',
    metaphor: { symbol: '⚖️', concept: 'A scale measuring who carries the weight of the decision', explanation: 'Self-advocacy places the decision on the scale and steps back. Manipulation tips the scale before the other person can weigh in.' },
    audioText: 'The difference between self-advocacy and manipulation is one question: does this give the other person a real choice to say no without pressure? If yes, it is self-advocacy. If no, it is manipulation.',
    activationPrompt: 'Think of a time you wanted something from someone. Did you ask directly — or did you find a way to make it harder for them to say no?',
  },
  {
    id: 17, domainNum: 5, linkedRule: 13,
    name: 'The Withdrawal-Chase Cycle',
    plain: 'When one person pulls away and the other person tries harder to get them back. Neither person is fully in control. Both are responding automatically.',
    definition: 'The withdrawal-chase cycle is when one person pulls away and the other person tries harder to get them back. The person pulling away may not be choosing to. They may be overwhelmed. The person chasing is not fully in control either. Their brain is responding automatically to the loss of connection.',
    boundary: 'Pulling away because your system is overwhelmed is not the same as choosing to manipulate. But it still affects the other person in the same way. When you come back, let the person know what happened.',
    ruleAnchor: 'If you know you are someone who shuts down during conflict, tell the people close to you in advance. Give them a signal during. Let them know when you are back.',
    metaphor: { symbol: '🌊', concept: 'A wave pulling back from shore — and the shore rushing toward it', explanation: 'The shore does not choose to rush. The retreat triggers the response automatically.' },
    audioText: 'The withdrawal-chase cycle is when one person pulls away and the other person chases. Neither person is fully in control. It is automatic. Understanding it is the first step to interrupting it.',
    activationPrompt: 'Have you ever texted someone more after they went quiet? That is the chase. Understanding why it happens is how you start to manage it.',
  },
  {
    id: 18, domainNum: 5, linkedRule: 13,
    name: 'Gaslighting',
    plain: 'When someone keeps telling you that what you experienced did not happen the way you know it did. A pattern, not a single disagreement.',
    definition: 'Gaslighting is when someone keeps telling you that what you experienced did not happen the way you know it did. They do not give you evidence. They just insist your memory or your perception is wrong. Over and over.',
    boundary: 'One disagreement about what happened is not gaslighting. Two people remembering something differently is not gaslighting. Gaslighting is a pattern that keeps happening and targets your ability to trust yourself.',
    ruleAnchor: 'If you notice this pattern in a relationship, do not try to handle it on your own. Talk to your trusted adult.',
    metaphor: { symbol: '🌫️', concept: 'Fog that is deliberately made', explanation: 'Natural fog is disorienting but no one caused it. Deliberate fog is disorienting because someone is creating it.' },
    audioText: 'Gaslighting is when someone deliberately and repeatedly tells you that what you experienced did not happen the way you know it did. It is not one disagreement. It is a pattern that targets your ability to trust yourself.',
    activationPrompt: 'Think of a time you were certain about what you experienced, and someone said you were wrong. Did they give you evidence — or did they just keep insisting?',
  },
  {
    id: 19, domainNum: 5, linkedRule: 11,
    name: 'Accountability',
    plain: 'Taking responsibility for what your actions did to another person. Not what you meant. What actually happened.',
    definition: 'Accountability means taking responsibility for what your actions did to another person. Not what you meant to do. What actually happened. You name it. You adjust what you do. It applies to you and to the other person equally.',
    boundary: 'Accountability is not about agreeing you are a bad person. It is not about performing an apology in a specific way. It is about naming what happened and changing what you do. It applies to everyone in the relationship.',
    ruleAnchor: 'When something you did affected another person, name what happened without arguing. Then change what you do.',
    metaphor: { symbol: '⚖️', concept: 'A scale with impact on one side — not intent', explanation: 'Accountability weighs what happened, not what was meant. Intent sits on a different scale entirely.' },
    audioText: 'Accountability means naming what your behavior did to another person. Not what you meant. What actually happened. Name it. Change what you do. This applies to everyone in the relationship — not just you.',
    activationPrompt: 'Think of a time someone asked you to be accountable. Were they asking you to name an impact — or to agree you are a bad person? Those are two different things.',
  },
  {
    id: 20, domainNum: 1, linkedRule: 2,
    name: 'Vulnerability',
    plain: 'Sharing something personal with someone who has earned that access. Not just anyone. Someone who has shown they can hold it with care.',
    definition: 'Vulnerability is when you share something personal with someone. Something that matters to you. Something you would not share with just anyone. The other person needs to have earned that access first — through what they have shown you over time.',
    boundary: 'Vulnerability is not weakness. Sharing something personal with someone who has not earned it yet is not vulnerability. That is a ring mismatch. Vulnerability goes to people who have shown they can hold your information with care.',
    ruleAnchor: 'Vulnerability belongs in Ring 4 and Ring 5. Both people share. Not just one person to the other.',
    metaphor: { symbol: '🔓', concept: 'Unlocking a door for someone who has earned the key', explanation: 'You do not unlock the door for everyone. You unlock it when the other person has shown, over time, that they will not misuse what is inside.' },
    audioText: 'Vulnerability is sharing something personal with someone who has earned that access. The other person must have shown they can hold your information with care. Both people share — not just one.',
    activationPrompt: 'Think of something personal you shared with someone you trust. Did they share something equally personal back? That would be shared vulnerability.',
  },
  {
    id: 21, domainNum: 1, linkedRule: 1,
    name: 'Observable Behavior',
    plain: 'Something a person did that you can point to. You saw it. You heard it. It is not what you think they meant. It is what they actually did.',
    definition: 'Observable behavior is something a person did that you can point to. You saw it. You heard it. You can describe it without guessing. It is not what you think they meant. It is not how they made you feel. It is what they actually did.',
    boundary: 'What someone did is not the same as what you think they meant by it. Observable behavior is the action. Your interpretation of it is separate. The framework works with what happened, not with what you think was behind it.',
    ruleAnchor: 'Every rule in this framework asks you to look at what actually happened. Not what you think was meant. What was done or said that you can point to.',
    metaphor: { symbol: '📷', concept: 'A photograph — it captures what happened, not what you felt about it', explanation: 'A photograph shows exactly what occurred. It does not show intent or meaning. Observable behavior is the photograph.' },
    audioText: 'Observable behavior is what a person actually did or said. You can point to it. It is not what you think they meant. It is not how they made you feel. It is what they did.',
    activationPrompt: 'Think of something someone did that bothered you. Can you describe exactly what they did — without interpreting what it meant? That separation is what observable behavior asks for.',
  },
  {
    id: 22, domainNum: 3, linkedRule: 7,
    name: 'Reciprocity',
    plain: 'Giving back what is given to you. In a friendship, both people put in. Both people receive. Not perfectly every day — but consistently over time.',
    definition: 'Reciprocity means giving back what is given to you. In a friendship, both people put in time. Both people share. Both people show care. Not perfectly every single day. But consistently over time.',
    boundary: 'Reciprocity is not keeping score. It is a pattern. A person can need more support for a while and that is okay. What matters is whether it evens out over time.',
    ruleAnchor: 'For every three things you share about yourself, ask one real question about the other person. That is reciprocity in a conversation.',
    metaphor: { symbol: '🔄', concept: 'A current that flows both ways', explanation: 'A river that flows only one direction eventually runs dry on one end. Reciprocity keeps the current moving in both directions.' },
    audioText: 'Reciprocity means giving back what is given to you. In relationships, both people put in. Both people receive. Not equally every day — but consistently in both directions over time.',
    activationPrompt: 'Think of a relationship in your life. If you stopped reaching out, would the other person notice and reach out to you? That tells you something about reciprocity.',
  },
  {
    id: 23, domainNum: 5, linkedRule: 4,
    name: 'Relational Rupture',
    plain: 'When something happens and things feel different between two people after. Ruptures can be repaired. But they do not fix themselves.',
    definition: 'A relational rupture is when something happens and things feel different between two people after. It can be small or big. It can come from a missed signal or something that was done. Ruptures can be repaired. But they do not fix themselves.',
    boundary: 'A rupture is not always the end of a relationship. It is a sign that something needs to be addressed. Whether it ends or strengthens the relationship depends on whether both people work on the repair.',
    ruleAnchor: 'Following the rules in this framework reduces how often ruptures happen. When one does happen, use the repair sequence.',
    metaphor: { symbol: '🪡', concept: 'A thread that has frayed — it still connects, but needs to be re-threaded deliberately', explanation: 'A frayed thread is not a broken thread. But it will break if left unattended. Repair is the act of re-threading carefully.' },
    audioText: 'A relational rupture is when something happens and the connection between two people breaks or weakens. It can be repaired. But it will not repair on its own. Ignoring it makes it worse.',
    activationPrompt: 'Think of a time when something happened between you and someone else and things felt different after — even if nothing was said. Was it ever directly addressed?',
  },
  {
    id: 24, domainNum: 5, linkedRule: 11,
    name: 'Bilateral',
    plain: 'The same rules apply to you and to the other person. You do not hold them to a standard you are not willing to hold yourself to.',
    definition: 'Bilateral means both sides. A bilateral standard means the same rules apply to you and to the other person. You do not hold them to a standard you are not willing to hold yourself to.',
    boundary: 'Bilateral does not mean identical. Both people do not have to do exactly the same things. But the standard is the same for both.',
    ruleAnchor: 'This whole framework is bilateral. When you use it to look at another person, use it to look at yourself too.',
    metaphor: { symbol: '🪞', concept: 'A mirror held up to both sides of the interaction at the same time', explanation: 'A mirror does not judge. It reflects. A bilateral evaluation reflects your conduct and the other person with the same clarity.' },
    audioText: 'Bilateral means both sides. The same standard that applies to the other person applies to you. You cannot hold someone to a rule you are not following yourself.',
    activationPrompt: 'Think of a recent interaction where you noticed what the other person did. Did you apply the same standard to your own behavior? That is the bilateral question.',
  },
];;

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

const GOAL_SUGGESTIONS = [
  { ruleNum: 1,  cluster: 'Before',   text: 'I want to check what ring someone is in before I start talking to them.' },
  { ruleNum: 2,  cluster: 'Before',   text: 'I want to check the 5 signs before I call someone a friend this week.' },
  { ruleNum: 8,  cluster: 'Before',   text: 'I want to check the relationship and the setting before I bring up a personal topic.' },
  { ruleNum: 4,  cluster: 'During',   text: 'I want to stop right away the next time someone gives me a direct signal.' },
  { ruleNum: 5,  cluster: 'During',   text: 'I want to notice quiet signs and check in before they have to say it out loud.' },
  { ruleNum: 7,  cluster: 'During',   text: 'I want to ask one real question about the other person for every 3 things I say.' },
  { ruleNum: 9,  cluster: 'During',   text: 'I want to close every conversation on purpose this week — say goodbye before I leave.' },
  { ruleNum: 3,  cluster: 'After',    text: 'I want to notice who reaches out first in one relationship I am tracking.' },
  { ruleNum: 6,  cluster: 'After',    text: 'I want to wait at least 24 hours before sending a second message this week.' },
  { ruleNum: 10, cluster: 'After',    text: 'I want to use my trigger plan before the reaction takes over — at least once.' },
  { ruleNum: 11, cluster: 'After',    text: 'I want to accept one limit without arguing or coming back to it later.' },
  { ruleNum: 12, cluster: 'Periodic', text: 'I want to check one relationship against the 5 healthy friendship criteria.' },
  { ruleNum: 13, cluster: 'Periodic', text: 'I want to name one warning sign I have noticed and bring it to my trusted adult.' },
  { ruleNum: 0, cluster: 'Checklist', text: 'I want to name my need in one clear sentence before I send any message this week.' },
  { ruleNum: 0, cluster: 'Checklist', text: 'I want to include the inconvenient parts of the picture in what I share this week.' },
  { ruleNum: 0, cluster: 'Checklist', text: 'I want to practice accepting a no without arguing or returning to the topic.' },
  { ruleNum: 0, cluster: 'Checklist', text: 'I want to check whether the other person feels free to say what they really think before I communicate.' },
  { ruleNum: 0, cluster: 'Checklist', text: 'I want to check my own goal before I communicate — am I seeking clarity or a specific outcome?' },
];

const SKILL_RATINGS = [
  { value: 'internalized', label: 'I do this automatically', color: C.calm },
  { value: 'developing',   label: 'I do this when I remember', color: C.activated },
  { value: 'not-yet',      label: 'I know it but do not do it yet', color: C.secondary },
];

// ─── COMPLETE RULES DATA ──────────────────────────────────────────────────────
const MAJOR_TITLES = {
  module1: 'The Framework',
  'ring-mismatch': 'Understanding Rings',
  'module2-anchor': 'Before I Communicate',
  module3: 'My Tracker',
  module4: 'Practice',
};
const MAJOR_SCREENS = Object.keys(MAJOR_TITLES);

function fallbackTitle(id) {
  if (MAJOR_TITLES[id]) return MAJOR_TITLES[id];
  const cleaned = id.replace(/^module\d-?/, '').replace(/-/g, ' ').trim();
  if (!cleaned) return 'where you left off';
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

const RULES_FULL = [
  {
    num: 1, cluster: 'Before', color: DC[1],
    title: 'Classify Before You Engage',
    theRule: 'Know what ring this person is in before you talk to them. Act the right way for that ring the whole time.',
    defSource: 'Relational Rings (Term 3) · Friendship (Term 1) · Acquaintance (Term 2)',
    protocol: [
      'Stop before you say anything.',
      'Ask yourself: What ring is this person in? Use what they do — not how you feel.',
      'Pick the right way to talk and share for that ring.',
      'Do not move someone to a closer ring just because you want to. They have to show you through their actions.',
    ],
    violation: 'Sharing personal things with someone who has not earned that level yet.',
    example: 'You just met someone at work. They ask how you are doing. You keep it light and talk about your day. That matches Ring 2.',
    nonExample: 'You just met someone at work. They ask how you are doing. You tell them about a fight with your family. That is Ring 4 or 5 information going to a Ring 2 person.',
    correction: 'Stop. Change the topic. Put the person back in the right ring. Start again from there.',
    activationPrompt: 'Think of one person you talked to recently. How close are they really? Not how close they feel — what have they actually done that tells you where they belong?',
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
    example: 'You have talked to someone five times. They have also reached out to you twice on their own. You think, "Maybe this is becoming a friendship," and you keep checking.',
    nonExample: 'You have talked to someone twice. You already call them your best friend and expect them to drop everything for you.',
    correction: 'Check the 5 signs again. Change how you act to match where the relationship really is. Do not tell the person you are doing this.',
    activationPrompt: 'Think of someone you call a friend. Have you both reached out on your own at least once? Have you both shared at the same level?',
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
    example: 'You notice you have texted someone three times in a row with no reply. You stop reaching out and wait a week.',
    nonExample: 'You have texted someone three times in a row with no reply. You send a fourth message, then a fifth, each one more urgent.',
    correction: 'Stop all reach-out right away. Write down what happened. Talk to your trusted adult before you reach out again. Do not bring up the imbalance directly without guidance.',
    activationPrompt: 'Think about your last few messages to one person. Who sent the first one each time — you or them?',
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
    example: 'Someone says, "I need space right now." You say "Okay" and change the subject immediately.',
    nonExample: 'Someone says, "I need space right now." You ask "Why though?" and keep talking about the same thing.',
    correction: 'Stop right away. Say a brief "Okay." Move to a new topic or close the conversation. If you missed the signal, name it at the next natural opening.',
    activationPrompt: 'Think of a time someone changed the subject or said they were busy. What did you do right after that?',
    linkedTerms: [6],
  },
  {
    num: 5, cluster: 'During', color: DC[3],
    title: 'Read Implicit Signal Clusters',
    theRule: 'When you see 2 or more quiet signs that someone is pulling back, stop and check in. Do not wait for them to say it out loud.',
    defSource: 'Implicit Social Signal (Term 7) · Response Latency (Term 8)',
    protocol: [
      'Watch for 4 kinds of quiet signs: Word signs (short answers, one-word replies, changing the subject). Tone signs (flat voice, clipped words). Body signs (looking away, turning away). Time signs (longer waits before replying).',
      'If you are not sure whether a quiet sign is about you or about something else — do not decide yet. Pause and ask first. Not every quiet moment is about you.',
      'If you see 2 or more clear signals, pause what you are saying.',
      'Ask in a calm, simple way: "Is this a good time?" or "Do you need to go?"',
      'Take whatever answer you get. No arguing.',
      'If they are done, start to close the conversation.',
    ],
    violation: 'Keeping the same topic going after 2 or more quiet signs have shown up.',
    example: 'Someone gives short replies and checks their phone twice. You say, "Want to talk about something else, or take a break?"',
    nonExample: 'Someone gives short replies and checks their phone twice. You keep talking about the same topic without noticing.',
    correction: 'Stop right away. Ask the check-in question. Follow where it leads.',
    activationPrompt: 'In your last conversation, did the other person give short answers or look away? What did you do when that happened?',
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
    example: 'Someone who usually replies fast has not answered in two days. You wait and do not send another message.',
    nonExample: 'Someone who usually replies fast has not answered in two days. You send three more messages, each one more urgent than the last.',
    correction: 'Stop all follow-up right away. Wait 24 to 72 hours. Only reach back out after the wait is done — or when they reply.',
    activationPrompt: 'Think of a time you sent a message and waited for a reply. How long before you sent another one?',
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
    example: 'After talking about your day for a few minutes, you ask, "What about you — how was your day?" and you listen to the answer.',
    nonExample: 'You ask, "How was your day?" and then keep talking about your own day before they finish answering.',
    correction: 'Stop talking. Ask a real question. Listen all the way through before you speak again.',
    activationPrompt: 'In your last conversation, did you ask the other person a question about them — not the topic — even once?',
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
    example: 'You want to talk about a health issue. You check: this person is Ring 4. You go ahead.',
    nonExample: 'You want to talk about a health issue with someone you met last week. You bring it up anyway.',
    correction: 'If they seem uncomfortable, say simply: "I think I jumped ahead. Let us talk about something else." Move on right away.',
    activationPrompt: 'Think of a sensitive topic you brought up recently. Did you check first whether the setting and the relationship were ready for it?',
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
    example: 'The conversation is winding down. You say, "I have to go, talk soon," before you leave.',
    nonExample: 'You just stop responding in the middle of a conversation with no goodbye.',
    correction: 'If you left without closing, bring it up next time: "I realized I left without saying goodbye properly — that was not on purpose."',
    activationPrompt: 'How did your last conversation end? Did you say goodbye — or did it just stop?',
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
    example: 'Someone raises their voice, which is one of your triggers. You use your plan: step back, breathe, and speak calmly.',
    nonExample: 'Someone raises their voice. You react right away without pausing, matching their volume.',
    correction: 'Leave using the calm exit phrase. Calm down on your own. Come back only when you are fully calm. If it fits, say briefly: "I am sorry for stepping away — I needed a moment."',
    activationPrompt: 'What is one thing that has thrown off a conversation for you before? Did you have a plan for it before it happened?',
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
    example: 'Someone says, "Please do not ask me about that again." You say, "Got it," and you do not bring it up again.',
    nonExample: 'Someone says, "Please do not ask me about that again." You bring it up again a few minutes later in a different way.',
    correction: 'Stop right away. Say something brief and genuine about the effect — not your intent: "I understand that was uncomfortable. I will not do that again." Do not drag it out.',
    activationPrompt: 'Think of the last time someone said they did not want to continue something. What did you do right after?',
    linkedTerms: [13, 19],
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
    example: 'Every few weeks, you check: are we both still reaching out? Still sharing? You adjust how close you act based on the answer.',
    nonExample: 'You decide someone is your best friend once, and you never check again — even as the signs change.',
    correction: 'Do the check. Move your investment to match the score. Do not tell the person you are doing this — just change how you act.',
    activationPrompt: 'Think of your closest relationship. When did you last check whether the effort is actually going both ways?',
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
    example: 'You notice two warning signs in a relationship. You tell your trusted adult before deciding what to do next.',
    nonExample: 'You notice two or more warning signs in a relationship. You decide to handle it completely on your own.',
    correction: 'Stop investing right away. Write down what you saw. Talk to your trusted adult within 48 hours.',
    activationPrompt: 'Think of a relationship that has felt off lately. Have you talked to anyone about it yet?',
    linkedTerms: [15, 16, 18],
  },
];

// ─── MODULE 4 DATA ────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 1, title: 'The Repeated Text', rules: [6, 3], difficulty: 'foundation',
    tags: ['Response Latency', 'Initiation Directionality'],
    text: 'Alex texts Jordan four times in two hours without a reply. Jordan has not initiated contact in two weeks. Each message asks a variation of the same question. Alex describes the situation as urgent.',
    scaffold: 'This scenario is about Rules 6 and 3. Jordan has not replied and has not reached out first in two weeks. Three reach-outs in a row without a return means stop and wait.',
    clusterHint: 'After the Interaction',
    analysis: ['What specific behavior raises a concern?', 'Which rule applies most directly?', 'What should Alex do right now, and for how long?', 'If this were your behavior — what would you do right now to correct it?'],
    generalization: 'Is there a relationship in your life where you have initiated contact three or more times without a return initiation?',
    bilateral: 'Have you ever continued messaging someone who went quiet? What was driving that? Urgency, anxiety, or something else?',
  },
  {
    id: 2, title: 'The Changed Subject', rules: [5, 7], difficulty: 'foundation',
    tags: ['Implicit Signals', 'Conversational Balance'],
    text: 'During a conversation, Alex notices that Morgan consistently redirects away from Alex\'s concerns. Morgan\'s replies have become shorter. Morgan has glanced at their phone three times. Alex keeps returning to the same topic.',
    scaffold: 'This scenario is about Rules 5 and 7. Morgan has given multiple quiet signs — shorter replies, changing the subject, checking their phone. Two or more quiet signs together mean stop and check in.',
    clusterHint: 'During the Interaction',
    analysis: ['How many implicit signals appear in this scenario?', 'What type of signals are they?', 'What should Alex do when the second signal appears?', 'If you were Alex — would you have noticed these signals? At which point?'],
    generalization: 'Think of a recent conversation where someone\'s engagement dropped. What signals appeared?',
    bilateral: 'Have you ever continued a topic after the other person gave multiple implicit signals of disengagement?',
  },
  {
    id: 3, title: 'The Overshare', rules: [8, 1], difficulty: 'foundation',
    tags: ['Topic Appropriateness', 'Relationship Classification'],
    text: 'Alex discloses a recent medical diagnosis to Sam, a coworker, during their third conversation. Their prior conversations have been brief and work-related. Sam acknowledges the information politely and then changes the subject.',
    scaffold: 'This scenario is about Rules 8 and 1. Health topics belong with Ring 4 and Ring 5 people. Sam is in Ring 2 or Ring 3 based on what has happened so far.',
    clusterHint: 'Before the Interaction',
    analysis: ['Where does Sam currently sit in the relational rings?', 'What ring requires health topics to be appropriate?', 'What does Sam\'s subject change communicate?', 'If this were your behavior — what question should you have asked yourself before sharing?'],
    generalization: 'Is there a relationship where you have disclosed at a level that exceeded the category?',
    bilateral: 'Have you ever shared something personal with someone and then sensed the disclosure was too early? What happened next?',
  },
  {
    id: 4, title: 'The Guilt Message', rules: [13, 16], difficulty: 'application',
    tags: ['Manipulation', 'Self-Advocacy vs Manipulation'],
    text: 'After being declined for plans twice, Alex sends a message to Riley: "I guess I\'m just not someone people want to spend time with." Riley immediately replies asking if Alex is okay and offering to reschedule.',
    scaffold: 'This scenario is about Term 16 and Rule 13. The message uses guilt — it turns a personal disappointment into a statement about worth to make Riley feel responsible and respond.',
    clusterHint: 'Evaluation',
    analysis: ['Which manipulation form does this message use?', 'What was the communication\'s actual effect on Riley?', 'What would direct self-advocacy have looked like instead?', 'If this were your behavior — what was the underlying need, and how could it have been communicated directly?'],
    generalization: 'Think of a time you communicated disappointment in a way that was designed to produce a specific response.',
    bilateral: 'What is the difference between expressing genuine disappointment and framing disappointment as a statement that creates obligation?',
  },
  {
    id: 5, title: 'The Conversation Monopoly', rules: [7, 9], difficulty: 'application',
    tags: ['Conversational Balance', 'Interaction Structure'],
    text: 'During a twenty-minute conversation, Alex speaks for approximately sixteen minutes. When Casey speaks, Alex listens briefly and redirects to their own topic. Casey has not asked a question in the last twelve minutes and is giving one-word replies.',
    scaffold: 'This scenario is about Rules 7 and 5. Casey is giving one-word replies and has not asked a question in twelve minutes. Those are quiet signs. The rule of three: after every three things you say about yourself, ask one real question.',
    clusterHint: 'During the Interaction',
    analysis: ['How many implicit signals has Casey sent in this scenario?', 'At what point should Rule 7 have been applied?', 'What specific action should Alex take right now?', 'If you were Alex — when do you usually notice that a conversation has shifted to mostly you talking?'],
    generalization: 'Think of a recent conversation. What percentage of the time did you speak? Did you ask at least one genuine question?',
    bilateral: 'What topics or emotional states make it hardest for you to monitor conversational balance?',
  },
  {
    id: 6, title: 'The Abrupt Exit', rules: [9, 5], difficulty: 'foundation',
    tags: ['Interaction Structure', 'Implicit Signals'],
    text: 'Alex is mid-conversation with Taylor when Alex notices it is time to leave. Alex says "I have to go" while Taylor is still speaking and walks away. Taylor stands watching with a confused expression.',
    scaffold: 'This scenario is about Rule 9. Every conversation needs a real close. Walking away while someone is still talking skips the close, even if you are out of time.',
    clusterHint: 'During the Interaction',
    analysis: ['Which stage of the interaction structure was skipped?', 'What did Taylor\'s expression communicate?', 'What would a complete closing have looked like in fifteen seconds or fewer?', 'If this were your behavior — what typically causes you to exit an interaction without a close?'],
    generalization: 'Think of your last few conversation endings. Did you deliver a deliberate verbal close each time?',
    bilateral: 'What makes closing interactions difficult? Time pressure, social anxiety, executive function, or something else?',
  },
  {
    id: 7, title: 'The Pushed Boundary', rules: [4, 11], difficulty: 'application',
    tags: ['Explicit Signals', 'Accepting Boundaries'],
    text: 'Jordan tells Alex directly: "I do not want to talk about my family right now." Alex says "Okay" and waits two minutes. Then asks: "So how are things going with your sister?"',
    scaffold: 'This scenario is about Rules 4 and 11. Jordan said directly that the topic was off limits. Alex said okay — then brought it back in a different form two minutes later. That is still a boundary violation.',
    clusterHint: 'During the Interaction',
    analysis: ['What type of signal did Jordan send?', 'Did Alex violate Rule 4, Rule 11, or both?', 'Why is asking about the sister still a boundary violation, even though Alex did not use the word family?', 'If this were your behavior — what is the honest answer to why the topic was resumed?'],
    generalization: 'Has someone set a limit in a conversation that you later returned to in a modified form?',
    bilateral: 'What is the difference between forgetting a boundary and testing one?',
  },
  {
    id: 8, title: 'The Three-Ring Problem', rules: [1, 2], difficulty: 'challenge',
    tags: ['Relationship Classification', 'Qualify Before Naming'],
    text: 'Alex has spoken with a new coworker five times over three weeks. All conversations were brief and work-related. The coworker has never initiated contact outside of work. Alex describes this person to a friend as "one of my closest friends at the moment."',
    scaffold: 'This scenario is about Rules 1 and 2. Five short work conversations put this person in Ring 2 or Ring 3. None of the five things that qualify a friendship have happened from both sides. Calling them a close friend sets up expectations that the relationship has not earned yet.',
    clusterHint: 'Before the Interaction',
    analysis: ['Using the five signs from Rule 2, how many of them have happened from both sides?', 'Where does this person currently sit on the continuum?', 'What can go wrong when you label someone as closer than the evidence actually shows?', 'If this were your behavior — which part of what they did might you be reading as more than it is?'],
    generalization: 'Is there a relationship you have labeled more closely than the observable behavioral evidence supports?',
    bilateral: 'What need does labeling someone as a close friend serve before the evidence is there?',
  },
];

const TRIVIA_Q = [
  // Foundation
  { id: 1, tier: 'foundation', rule: 3,  q: 'What is the minimum number of consecutive self-initiated contacts — with no return initiation — before Rule 3 requires a pause?', a: '3', explanation: 'After three consecutive self-initiated contacts without a return initiation, Rule 3 requires stopping all outreach and reassessing the relational dynamic for a minimum of one week.' },
  { id: 2, tier: 'foundation', rule: 9,  q: 'Name the three stages of a social interaction as defined in Term 11.', a: 'Opening, Maintenance (reciprocal middle), Closing', explanation: 'Every interaction needs a deliberate opening, a reciprocal middle, and a verbal close. An interaction that ends without a close communicates dismissal regardless of intent.' },
  { id: 3, tier: 'foundation', rule: 7,  q: 'Rule 7 uses a ratio to govern conversational balance. What is it?', a: 'Every 3 self-referential statements → 1 genuine question about the other person', explanation: 'The rule of three: for every three statements you make about yourself or your interests, ask at least one genuine, open-ended question about the other person.' },
  { id: 4, tier: 'foundation', rule: 16, q: 'What is the difference between self-advocacy and manipulation?', a: 'Self-advocacy lets the other person say no freely. Manipulation takes away their freedom to say no.', explanation: 'The key difference is whether the other person has a real choice. Self-advocacy asks clearly and steps back. Manipulation puts pressure on the decision before the other person can weigh in.' },
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

function Header({ title, onEmergency, onSettings, state }) {
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
        {title && (
          <span style={{ fontSize: 14, fontWeight: 700, color: C.primary, letterSpacing: 0.3 }}>
            {title}
          </span>
        )}
      </div>

      <button
        onClick={onEmergency}
        style={{
          width: 40, height: 44, borderRadius: 20,
          backgroundColor: C.overwhelmed, border: 'none',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 1,
        }}
        aria-label="Emergency screen"
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>🆘</span>
        <span style={{ fontSize: 8, fontWeight: 800, color: '#fff', letterSpacing: 0.5 }}>SOS</span>
      </button>
    </div>
  );
}

function Footer({ onGrounding, onBack, state }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 16px', borderTop: `1px solid ${C.border}`,
      backgroundColor: C.white, flexShrink: 0,
    }}>
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px', borderRadius: 20,
            backgroundColor: 'transparent',
            border: `1px solid ${C.border}`,
            cursor: 'pointer', fontSize: 13,
            color: C.interactive, fontWeight: 700,
            letterSpacing: 0.3,
          }}
          aria-label="Go back"
        >← Back</button>
      ) : (
        <div style={{ width: 40 }} />
      )}
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
        aria-label="Take a pause"
      >⏸ Pause</button>
    </div>
  );
}

function Shell({ children, regState, onEmergency, onSettings, onGrounding, title, onBack, noFooter, goal, onGoalEdit, transitionNote }) {
  const [showNote, setShowNote] = useState(!!transitionNote);

  useEffect(() => {
    if (transitionNote) {
      setShowNote(true);
      const t = setTimeout(() => setShowNote(false), 3200);
      return () => clearTimeout(t);
    }
    setShowNote(false);
  }, [transitionNote]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: C.bg, overflow: 'hidden',
    }}>
      <RegBar state={regState} />
      <GoalStrip goal={goal} onEdit={onGoalEdit} />
      <Header
        title={title}
        onEmergency={onEmergency} onSettings={onSettings}
        state={regState}
      />
      {transitionNote && showNote && (
        <div style={{
          padding: '7px 16px', backgroundColor: C.interactive + '0C',
          borderBottom: `1px solid ${C.interactive}20`,
          fontSize: 12, fontWeight: 600, color: C.interactive, textAlign: 'center',
        }}>
          {transitionNote}
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {children}
      </div>
      {!noFooter && <Footer onGrounding={onGrounding} onBack={onBack} state={regState} />}
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


// ─── OVERLAYS ─────────────────────────────────────────────────────────────────

function GroundingOverlay({ onClose, onEmergency, regState }) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState(null);

  const PHASES = {
    during: { label: 'Building', icon: '📡', color: C.activated, steps: [
      { icon: '🛑', title: 'Stop receiving input.', body: 'Stop listening for a moment. You do not have to process what is being said right now.' },
      { icon: '🫁', title: 'Press both feet down. One breath out slowly.', body: 'You are still here. The information has not harmed you yet.' },
      { icon: '⏸', title: 'You do not have to respond yet.', body: 'Say one word if you need to buy time. "Okay." "One moment." Nothing more is required.' },
    ]},
    peak: { label: 'Peak', icon: '⚡', color: C.overwhelmed, steps: [
      { icon: '🛑', title: 'Do nothing.', body: 'You are at the peak. Action will make it worse. This is not a decision point. Wait.' },
      { icon: '🫁', title: 'Stay in your body.', body: 'Feel the floor. Feel the chair. You are a physical thing in a physical place. That is real.' },
      { icon: '⏳', title: 'Wait for the wave to recede.', body: 'The architecture of this experience is that it builds and then recedes. You do not have to end it. Wait for it to end.' },
    ]},
    receding: { label: 'Receding', icon: '🌊', color: C.interactive, steps: [
      { icon: '🌊', title: 'The wave is receding.', body: 'You can feel it. Something in the system is settling. This is the turning point.' },
      { icon: '🧠', title: 'Name one true thing you know right now.', body: 'Say it, even silently. Something factual. "I am in this room." "The other person is still here." "I have handled this before."' },
      { icon: '↩️', title: 'Decide your next step.', body: 'You can return to the conversation. You can ask for a pause. You can name what happened. All of those are available. Choose from a settled place.' },
    ]},
  };

  const standardSteps = [
    { icon: '🫁', title: 'Feel your feet on the floor.', body: 'Press them down. Notice the pressure. You are here.' },
    { icon: '👁️', title: 'Name one thing you can see.', body: 'Look around. Pick one object. Say its name — out loud or in your head.' },
    { icon: '✋', title: 'Notice what your hands feel.', body: 'Are they warm or cool? Tight or loose? Just notice.' },
  ];

  const steps = phase ? PHASES[phase].steps : standardSteps;
  const accentColor = phase ? PHASES[phase].color : C.interactive;

  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(27,58,92,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
      <div style={{ backgroundColor: C.white, borderRadius: 16, padding: 24, width: '100%', maxWidth: 340 }}>

        {/* Phase selector */}
        {step === 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 8 }}>WHERE ARE YOU RIGHT NOW?</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.entries(PHASES).map(([id, p]) => (
                <button key={id} onClick={() => setPhase(phase === id ? null : id)} style={{
                  flex: 1, padding: '6px 4px', borderRadius: 8, cursor: 'pointer', textAlign: 'center', fontSize: 10, fontWeight: 700,
                  border: `1.5px solid ${phase === id ? p.color : C.border}`,
                  backgroundColor: phase === id ? p.color + '14' : 'transparent',
                  color: phase === id ? p.color : C.secondary,
                }}>{p.icon} {p.label}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5 }}>GROUNDING PAUSE</div>
          <SpeakButton text={steps[step].title + ' ' + steps[step].body} />
        </div>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>{steps[step].icon}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.primary, marginBottom: 8, textAlign: 'center' }}>{steps[step].title}</div>
        <div style={{ fontSize: 15, color: C.secondary, lineHeight: 1.6, textAlign: 'center', marginBottom: 20 }}>{steps[step].body}</div>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          {step < steps.length - 1 ? (
            <Btn label="Next →" onClick={() => setStep(s => s + 1)} variant="primary" />
          ) : (
            <Btn label="Return to where I was" onClick={() => { window.speechSynthesis && window.speechSynthesis.cancel(); onClose(); }} variant="calm" />
          )}
          <Btn label="I need more help →" onClick={onEmergency} variant="ghost" small />
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ settings, onChange, onClose, navigate }) {
  const trustedAdult = loadTrustedAdult();
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

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>TRUSTED ADULT</div>
          {trustedAdult ? (
            <div style={{ padding: '10px 12px', backgroundColor: C.calm + '10', border: `1px solid ${C.calm}30`, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{trustedAdult.name}</div>
              <div style={{ fontSize: 12, color: C.secondary, marginBottom: 6 }}>{trustedAdult.relationship}</div>
              <div style={{ fontSize: 12, color: C.calm, fontWeight: 600 }}>Signal word set ✓</div>
            </div>
          ) : (
            <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.5, marginBottom: 8 }}>Not set up yet.</div>
          )}
          <button
            onClick={() => { onClose(); navigate('trusted-adult-setup'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.interactive, padding: 0 }}
          >
            {trustedAdult ? 'Edit →' : 'Set up now →'}
          </button>
        </div>

        <div style={{ marginTop: 'auto' }}>
        </div>
      </div>
      <div onClick={onClose} style={{ flex: 1, height: '100%' }} />
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// ─── RING MISMATCH MODULE ────────────────────────────────────────────────────

const RINGS_DATA = [
  {
    num: 1, name: 'Stranger', color: '#6B7FA8',
    plain: 'Someone you do not know. You have not spoken to them. You do not know their name.',
    subtypes: [
      { name: 'Unknown stranger', desc: 'Someone you have never seen or met before.' },
      { name: 'Regular stranger', desc: 'Someone you see often — at the bus stop, in the hallway, at the store — but have never spoken to. Seeing them often does not make them an acquaintance.' },
    ],
    question: 'Have you ever had a real conversation with this person?',
  },
  {
    num: 2, name: 'Acquaintance', color: '#4E8A6B',
    plain: 'Someone you know but have not built trust with yet.',
    subtypes: [
      { name: 'Social acquaintance', desc: 'Someone you know by name and say hi to. The relationship does not go deeper than that yet.' },
      { name: 'Professional acquaintance', desc: 'Someone whose job gives them access to information about you — a teacher, a counselor, a social worker, a doctor. They may care about you. That can be real. But the access they have comes from their role, not from something you chose to give them. That makes them Ring 2.' },
      { name: 'Authority acquaintance', desc: 'Someone who has power over your situation and is also friendly — a principal, a case manager, a coach. Friendly and Ring 4 are not the same thing.' },
    ],
    question: 'Where does their information about you come from — your choice to share it, or their role?',
  },
  {
    num: 3, name: 'Casual Friend', color: '#C4781A',
    plain: 'Someone you like being around. The connection exists in one place or around one shared thing.',
    subtypes: [
      { name: 'Context friend', desc: 'Someone you connect with in one setting — a class, a team, a job — and the connection does not travel outside of it. That is not a flaw. That is what Ring 3 is.' },
      { name: 'Activity friend', desc: 'The friendship is built around what you do together, not around who you are to each other outside of that activity.' },
    ],
    question: 'Would the connection still exist if the shared place or activity ended?',
  },
  {
    num: 4, name: 'Friend', color: '#2E6DA4',
    plain: 'Someone who shows up for you. The friendship exists in more than one situation.',
    subtypes: [
      { name: 'Consistent friend', desc: 'Both of you show up. Both reach out. Both share. Not perfectly. But consistently, across more than one situation.' },
      { name: 'Conditional friend', desc: 'The friendship is real but something changes it when things get hard or when you disagree. Still Ring 4 — but needs watching.' },
      { name: 'Recovering friend', desc: 'Someone who was Ring 5 and something happened. They may still be Ring 4. They cannot access Ring 5 information right now. Their ring is based on what they do now — not on what they did before.' },
    ],
    question: 'Does this friendship exist outside of one specific situation?',
  },
  {
    num: 5, name: 'Trusted Friend', color: '#8B5E8A',
    plain: 'Someone you trust with the hard things. They earned that access through what they actually did.',
    subtypes: [
      { name: 'Long-term trusted', desc: 'Sustained care across years and multiple hard moments.' },
      { name: 'New trusted', desc: 'Someone who earned Ring 5 access through specific demonstrated behavior, even if the relationship is newer. Time alone does not make Ring 5. Behavior does.' },
    ],
    question: 'Has this person shown up for you in a hard moment and held your information with care?',
  },
];

const MISMATCH_SIGNS = [
  {
    short: 'Information goes one way.',
    detail: 'They know a lot about you. You know almost nothing personal about them. In a real friendship, both people share. If someone knows a lot about your life but you know very little about theirs, information is only flowing one direction.',
    example: 'A counselor knows about your home situation from a report. A teacher knows your diagnosis from your records. This does not mean they are bad people. It means the information came from their access, not from your trust.',
  },
  {
    short: 'The warmth changes.',
    detail: 'They are warmer when they want something from you. When they do not need anything, things get quieter. In a real friendship, care is consistent. Conditional warmth is a sign of Ring 2 behavior, not Ring 4.',
    example: 'Someone is very attentive during a meeting where they need your agreement. Afterward, you barely hear from them.',
  },
  {
    short: 'The connection is tied to a role.',
    detail: 'When the role ends — school ends, the program ends, the job ends — the relationship ends with it. Real friendships exist outside of the context that created them.',
    example: 'A teacher who was very supportive while you were their student. Once you graduated or changed schools, the contact stopped completely.',
  },
  {
    short: 'You did not fully choose what they know.',
    detail: 'The personal information they have about you got to them through their position, through other people, or through a system — not through a conversation where you decided to share it. That is not intimacy. That is access.',
    example: 'A social worker who knows about your family from a case file. A new teacher who read your full records before they ever spoke to you.',
  },
];

function computeRingResult(s1, s2, s3, s4) {
  let score = 0;
  if (s1.includes('proactive')) score += 2;
  if (s1.includes('reciprocal')) score += 2;
  if (s1.includes('hardmoment')) score += 3;
  if (s1.includes('context')) score -= 1;
  if (s1.includes('initiation')) score -= 1;
  if (s2.includes('chose')) score += 2;
  if (s2.includes('role')) score -= 2;
  if (s2.includes('others')) score -= 1;
  const s3map = { yes: 3, probably: 1, dontknow: 0, probablynot: -2, no: -3 };
  score += s3map[s3] || 0;
  let ring = score >= 7 ? 5 : score >= 3 ? 4 : score >= 0 ? 3 : 2;
  let mismatch = (s2.includes('role') && ring >= 3) ||
    (ring <= 3 && (s1.includes('proactive') || s1.includes('hardmoment')));
  let triggered = [];
  if (s2.includes('role') || s2.includes('others')) triggered.push(0);
  if (s1.includes('initiation') && !s1.includes('reciprocal')) triggered.push(1);
  if (s3 === 'probablynot' || s3 === 'no') triggered.push(2);
  if (s2.includes('role') || s2.includes('others')) triggered.push(3);
  triggered = [...new Set(triggered)];
  let mitigating = null;
  const hasProfile = s4.length > 0 && !s4.includes('none');
  if (hasProfile) {
    let parts = ['Some of the patterns we looked for work differently when both people share a neurological profile.'];
    if (s4.includes('autistic')) parts.push('If they are also autistic, initiation patterns and response frequency may not tell the full story.');
    if (s4.includes('adhd')) parts.push('If they also have ADHD, irregular contact may not mean low investment.');
    if (s4.includes('different')) parts.push('If they also process things differently, some signals may take longer to show up.');
    parts.push('Has this person shown up for you in a hard moment? That is the most reliable indicator.');
    mitigating = parts.join(' ');
  }
  return { ring, mismatch, triggered, mitigating, score };
}

// ─── RING MISMATCH HOME ───────────────────────────────────────────────────────
function RingMismatchHome({ navigate }) {
  const sections = [
    { icon: '⭕', title: 'The Five Rings', sub: 'Ring types and sub-categories', desc: 'Learn what each ring means and the different types of people inside each one.', screen: 'ring-mismatch-rings', primary: true },
    { icon: '🔍', title: 'What is a Ring Mismatch?', sub: 'Definition and four signs', desc: 'Learn what it means when someone seems like one ring but acts like another.', screen: 'ring-mismatch-signs', primary: false },
    { icon: '✅', title: 'Ring Check', sub: 'Four-question tool', desc: 'Answer four questions to get a ring placement suggestion for someone in your life.', screen: 'ring-mismatch-check', primary: false },
  ];
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginBottom: 20 }}>
        Use this section to figure out where someone belongs in your rings — and what to do when something feels off.
      </div>
      {sections.map(s => (
        <button key={s.screen} onClick={() => navigate(s.screen)} style={{
          display: 'block', width: '100%', textAlign: 'left',
          backgroundColor: s.primary ? C.interactive + '08' : C.white,
          border: `1px solid ${s.primary ? C.interactive + '40' : C.border}`,
          borderLeft: `4px solid ${C.interactive}`,
          borderRadius: 12, padding: '14px 16px', cursor: 'pointer', marginBottom: 10,
          boxShadow: s.primary ? `0 2px 8px ${C.interactive}14` : '0 1px 4px rgba(26,39,68,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{s.icon} {s.title}</span>
            <span style={{ fontSize: 16, color: C.border, marginLeft: 6 }}>›</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.interactive, marginBottom: 4, marginTop: 2 }}>{s.sub}</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{s.desc}</div>
        </button>
      ))}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
          You can use these in any order. Start wherever you need to.
        </div>
      </div>
    </div>
  );
}

// ─── RING MISMATCH RINGS ─────────────────────────────────────────────────────
function RingMismatchRings({ navigate, showTerm }) {
  const [openRing, setOpenRing] = useState(null);
  const toggle = (num) => setOpenRing(openRing === num ? null : num);
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, marginBottom: 6 }}>
        Each ring has different types of people inside it. Tap a ring to see them.
      </div>
      <button onClick={() => showTerm(3)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive, textDecoration: 'underline', padding: 0, marginBottom: 18, display: 'block' }}>
        See the Relational Rings term definition →
      </button>
      {RINGS_DATA.map(ring => (
        <div key={ring.num} style={{ marginBottom: 10 }}>
          <button onClick={() => toggle(ring.num)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', textAlign: 'left', backgroundColor: C.white,
            border: `1px solid ${openRing === ring.num ? ring.color : C.border}`,
            borderLeft: `4px solid ${ring.color}`,
            borderRadius: openRing === ring.num ? '10px 10px 0 0' : 10,
            padding: '12px 14px', cursor: 'pointer',
          }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 800, color: C.primary }}>Ring {ring.num} — {ring.name}</span>
              <div style={{ fontSize: 12, color: C.secondary, marginTop: 2 }}>{ring.plain}</div>
            </div>
            <span style={{ fontSize: 14, color: ring.color, marginLeft: 8, flexShrink: 0 }}>{openRing === ring.num ? '▲' : '▼'}</span>
          </button>
          {openRing === ring.num && (
            <div style={{ border: `1px solid ${ring.color}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '14px 16px', backgroundColor: ring.color + '06' }}>
              {ring.subtypes.map((sub, i) => (
                <div key={i} style={{ marginBottom: i < ring.subtypes.length - 1 ? 14 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{sub.name}</div>
                  <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{sub.desc}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${ring.color}40` }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: ring.color, marginBottom: 6 }}>Key question</div>
                <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6, fontStyle: 'italic' }}>{ring.question}</div>
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <button onClick={() => navigate('ring-mismatch-check')} style={{ display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.interactive + '08', border: `1px solid ${C.interactive}30`, borderRadius: 10, padding: '11px 14px', cursor: 'pointer' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.interactive }}>Not sure which ring? Use the Ring Check tool →</span>
        </button>
      </div>
    </div>
  );
}

// ─── RING MISMATCH SIGNS ─────────────────────────────────────────────────────
function RingMismatchSigns({ navigate, showTerm }) {
  const [openSign, setOpenSign] = useState(null);
  const toggle = (i) => setOpenSign(openSign === i ? null : i);
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ backgroundColor: C.interactive + '08', border: `1px solid ${C.interactive}30`, borderLeft: `4px solid ${C.interactive}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, marginBottom: 8 }}>What is a Ring Mismatch?</div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
          A Ring Mismatch is when someone seems like they are in a closer ring than they actually are.
        </div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginTop: 8 }}>
          They feel like a Ring 4 friend. But when you look at what they actually do — they are a Ring 2.
        </div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginTop: 8, fontWeight: 600 }}>
          The gap between how they seem and what they do is the mismatch.
        </div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginTop: 10 }}>
          A Ring Mismatch is not a reason to distrust everyone. It is information. It tells you which ring someone actually belongs in right now — so you know what is safe to share with them.
        </div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.secondary, marginBottom: 12 }}>Four signs of a Ring Mismatch</div>
      <div style={{ fontSize: 13, color: C.secondary, marginBottom: 14 }}>Tap each sign to see more.</div>
      {MISMATCH_SIGNS.map((sign, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <button onClick={() => toggle(i)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', textAlign: 'left', backgroundColor: C.white,
            border: `1px solid ${openSign === i ? C.interactive : C.border}`,
            borderLeft: `4px solid ${C.interactive}`,
            borderRadius: openSign === i ? '10px 10px 0 0' : 10,
            padding: '12px 14px', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.interactive, flexShrink: 0 }}>Sign {i + 1}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{sign.short}</span>
            </div>
            <span style={{ fontSize: 14, color: C.interactive, marginLeft: 8, flexShrink: 0 }}>{openSign === i ? '▲' : '▼'}</span>
          </button>
          {openSign === i && (
            <div style={{ border: `1px solid ${C.interactive}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '14px 16px', backgroundColor: C.interactive + '04' }}>
              <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 12 }}>{sign.detail}</div>
              <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: C.secondary, marginBottom: 6 }}>Example</div>
                <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{sign.example}</div>
              </div>
              <button onClick={() => toggle(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive, marginTop: 10, padding: 0 }}>Close ✕</button>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: C.secondary, marginBottom: 4 }}>Related terms</div>
        <button onClick={() => showTerm(15)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.interactive, textDecoration: 'underline', padding: 0, textAlign: 'left' }}>Term 15 — Exploitative or Unsafe Pattern →</button>
        <button onClick={() => showTerm(18)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.interactive, textDecoration: 'underline', padding: 0, textAlign: 'left' }}>Term 18 — Gaslighting →</button>
        <button onClick={() => navigate('ring-mismatch-check')} style={{ display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.interactive + '08', border: `1px solid ${C.interactive}30`, borderRadius: 10, padding: '11px 14px', cursor: 'pointer', marginTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.interactive }}>Check a specific person with the Ring Check tool →</span>
        </button>
      </div>
    </div>
  );
}

// ─── RING CHECK TOOL ─────────────────────────────────────────────────────────
function RingMismatchCheck({ navigate }) {
  const [step, setStep] = useState(0);
  const [s1, setS1] = useState([]);
  const [s2, setS2] = useState([]);
  const [s3, setS3] = useState(null);
  const [s4, setS4] = useState([]);
  const [openSign, setOpenSign] = useState(null);

  const toggleMulti = (key, getter, setter) => {
    setter(getter.includes(key) ? getter.filter(k => k !== key) : [...getter, key]);
  };

  const reset = () => { setStep(0); setS1([]); setS2([]); setS3(null); setS4([]); setOpenSign(null); };

  const S1_OPTS = [
    { key: 'proactive', label: 'They check in on me without me going to them first.' },
    { key: 'reciprocal', label: 'They share personal things with me too — it is not just me sharing with them.' },
    { key: 'hardmoment', label: 'They have shown up when things were hard, not only when things were easy.' },
    { key: 'context', label: 'We only connect when we are in the same place — school, a class, work.' },
    { key: 'initiation', label: 'Most of our contact happens because I start it.' },
    { key: 'noinfo', label: 'I do not have enough information yet.' },
  ];
  const S2_OPTS = [
    { key: 'chose', label: 'I chose to tell them directly.' },
    { key: 'role', label: 'They found out through their job or their role.' },
    { key: 'others', label: 'It got to them through other people.' },
    { key: 'noknow', label: 'They do not know much personal about me yet.' },
  ];
  const S3_OPTS = [
    { key: 'yes', label: 'Yes. I am confident they would.' },
    { key: 'probably', label: 'Probably. But I am not completely sure.' },
    { key: 'dontknow', label: 'I do not know.' },
    { key: 'probablynot', label: 'Probably not.' },
    { key: 'no', label: 'No.' },
  ];
  const S4_OPTS = [
    { key: 'autistic', label: 'They are also autistic.' },
    { key: 'adhd', label: 'They also have ADHD.' },
    { key: 'different', label: 'They also process things differently than most people.' },
    { key: 'notsure', label: 'I am not sure.' },
    { key: 'none', label: 'None of these apply.' },
  ];

  const MultiBtn = ({ opt, getter, setter }) => {
    const sel = getter.includes(opt.key);
    return (
      <button onClick={() => toggleMulti(opt.key, getter, setter)} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', background: sel ? C.interactive + '10' : C.white, border: `1px solid ${sel ? C.interactive : C.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `2px solid ${sel ? C.interactive : C.border}`, background: sel ? C.interactive : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {sel && <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>✓</span>}
        </span>
        <span style={{ fontSize: 14, color: C.primary, lineHeight: 1.5 }}>{opt.label}</span>
      </button>
    );
  };

  const RadioBtn = ({ opt }) => {
    const sel = s3 === opt.key;
    return (
      <button onClick={() => setS3(opt.key)} style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%', background: sel ? C.interactive + '10' : C.white, border: `1px solid ${sel ? C.interactive : C.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, flexShrink: 0, border: `2px solid ${sel ? C.interactive : C.border}`, background: sel ? C.interactive : 'transparent' }} />
        <span style={{ fontSize: 14, color: C.primary, lineHeight: 1.5 }}>{opt.label}</span>
      </button>
    );
  };

  const NavRow = ({ onNext, nextLabel = 'Next →', nextDisabled = false }) => (
    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
      {step > 1 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `1px solid ${C.border}`, background: C.white, cursor: 'pointer', fontSize: 14, fontWeight: 700, color: C.secondary }}>← Back</button>}
      <button onClick={onNext} disabled={nextDisabled} style={{ flex: 2, padding: '12px 0', borderRadius: 10, border: 'none', background: nextDisabled ? C.border : C.interactive, color: '#fff', cursor: nextDisabled ? 'default' : 'pointer', fontSize: 14, fontWeight: 700 }}>{nextLabel}</button>
    </div>
  );

  if (step === 0) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ backgroundColor: C.activated + '12', border: `1px solid ${C.activated}30`, borderLeft: `4px solid ${C.activated}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, marginBottom: 8 }}>Before you start</div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
          The next four questions ask you to think about a real person in your life.
        </div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginTop: 6 }}>
          It is okay to stop and come back. You do not have to finish in one sitting.
        </div>
      </div>
      <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 20 }}>
        Think of a specific person right now — someone whose ring you are not sure about, or someone who feels different from how they seem. Keep them in mind for all four questions.
      </div>
      <button onClick={() => setStep(1)} style={{ display: 'block', width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', background: C.interactive, color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 800 }}>I have someone in mind — Start</button>
    </div>
  );

  if (step === 1) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.secondary, fontWeight: 600, marginBottom: 4 }}>STEP 1 OF 4</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 6 }}>What does this person actually do?</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>Not what they say. Not what you hope. What they actually do right now. Pick all that are true.</div>
      {S1_OPTS.map(opt => <MultiBtn key={opt.key} opt={opt} getter={s1} setter={setS1} />)}
      <NavRow onNext={() => setStep(2)} nextDisabled={s1.length === 0} />
    </div>
  );

  if (step === 2) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.secondary, fontWeight: 600, marginBottom: 4 }}>STEP 2 OF 4</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 6 }}>How did they get to know personal things about you?</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>Pick all that are true.</div>
      {S2_OPTS.map(opt => <MultiBtn key={opt.key} opt={opt} getter={s2} setter={setS2} />)}
      <NavRow onNext={() => setStep(3)} nextDisabled={s2.length === 0} />
    </div>
  );

  if (step === 3) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.secondary, fontWeight: 600, marginBottom: 4 }}>STEP 3 OF 4</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 6 }}>If the thing that brought you together ended tomorrow — would they still reach out?</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>Pick one.</div>
      {S3_OPTS.map(opt => <RadioBtn key={opt.key} opt={opt} />)}
      <NavRow onNext={() => setStep(4)} nextDisabled={!s3} />
    </div>
  );

  if (step === 4) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 11, color: C.secondary, fontWeight: 600, marginBottom: 4 }}>STEP 4 OF 4</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 6 }}>One more question before your result.</div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginBottom: 16 }}>Does this person share your neurological profile? Pick all that apply.</div>
      {S4_OPTS.map(opt => <MultiBtn key={opt.key} opt={opt} getter={s4} setter={setS4} />)}
      <NavRow onNext={() => setStep(5)} nextLabel="See my result →" nextDisabled={s4.length === 0} />
    </div>
  );

  if (step === 5) {
    const { ring, mismatch, triggered, mitigating } = computeRingResult(s1, s2, s3, s4);
    const ringData = RINGS_DATA[ring - 1];
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 11, color: C.secondary, fontWeight: 600, marginBottom: 12 }}>YOUR RESULT</div>
        <div style={{ backgroundColor: ringData.color + '12', border: `2px solid ${ringData.color}`, borderRadius: 14, padding: '16px 18px', marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: ringData.color, fontWeight: 700, marginBottom: 4 }}>Suggested ring placement</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: ringData.color }}>Ring {ring}</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginTop: 2 }}>{ringData.name}</div>
          <div style={{ fontSize: 13, color: C.secondary, marginTop: 6, lineHeight: 1.5 }}>{ringData.plain}</div>
        </div>
        {mismatch && (
          <div style={{ backgroundColor: C.activated + '12', border: `1px solid ${C.activated}40`, borderLeft: `4px solid ${C.activated}`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.activated, marginBottom: 4 }}>Ring Mismatch flag</div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>Some signs suggest this person may present as a closer ring than their behavior shows. See the signs below.</div>
          </div>
        )}
        {mitigating && (
          <div style={{ backgroundColor: C.calm + '10', border: `1px solid ${C.calm}30`, borderLeft: `4px solid ${C.calm}`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.calm, marginBottom: 4 }}>Shared profile note</div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{mitigating}</div>
          </div>
        )}
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: C.secondary, marginBottom: 10, marginTop: 4 }}>Signs to watch for — tap each to learn more</div>
        {MISMATCH_SIGNS.map((sign, i) => {
          const isTriggered = triggered.includes(i);
          const isOpen = openSign === i;
          return (
            <div key={i} style={{ marginBottom: 8 }}>
              <button onClick={() => setOpenSign(isOpen ? null : i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', backgroundColor: isTriggered ? C.interactive + '08' : C.white, border: `1px solid ${isOpen ? C.interactive : isTriggered ? C.interactive + '60' : C.border}`, borderLeft: `4px solid ${isTriggered ? C.interactive : C.border}`, borderRadius: isOpen ? '8px 8px 0 0' : 8, padding: '10px 12px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isTriggered && <span style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '15', borderRadius: 4, padding: '2px 6px', flexShrink: 0 }}>NOTICED</span>}
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{sign.short}</span>
                </div>
                <span style={{ fontSize: 12, color: C.interactive, marginLeft: 8, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div style={{ border: `1px solid ${C.interactive}`, borderTop: 'none', borderRadius: '0 0 8px 8px', padding: '12px 14px', backgroundColor: C.interactive + '04' }}>
                  <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65, marginBottom: 10 }}>{sign.detail}</div>
                  <div style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: C.secondary, marginBottom: 4 }}>Example</div>
                    <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{sign.example}</div>
                  </div>
                  <button onClick={() => setOpenSign(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive, padding: 0 }}>Close ✕</button>
                </div>
              )}
            </div>
          );
        })}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => navigate('ring-mismatch-rings')} style={{ display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.interactive }}>See full ring definitions →</span>
          </button>
          <button onClick={reset} style={{ display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '11px 14px', cursor: 'pointer' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary }}>Start over with a different person</span>
          </button>
        </div>
      </div>
    );
  }
  return null;
}

// ─── TRUSTED ADULT SETUP ──────────────────────────────────────────────────────

function loadTrustedAdult() {
  try { return JSON.parse(localStorage.getItem('aof-trusted-adult') || 'null'); } catch { return null; }
}

function loadLastScreen() {
  try { return JSON.parse(localStorage.getItem('aof-last-screen') || 'null'); } catch { return null; }
}

function hasSeenTeachingNote() {
  try { return localStorage.getItem('aof-seen-teaching-note') === '1'; } catch { return true; }
}
function markTeachingNoteSeen() {
  try { localStorage.setItem('aof-seen-teaching-note', '1'); } catch (e) {}
}

function TeachingCycleNote() {
  const [dismissed, setDismissed] = useState(hasSeenTeachingNote());
  if (dismissed) return null;
  return (
    <div style={{ backgroundColor: C.interactive + '0C', border: `1px solid ${C.interactive}30`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65, marginBottom: 8 }}>
        Read this. Then look at the example. Then try it in Practice.
      </div>
      <button onClick={() => { markTeachingNoteSeen(); setDismissed(true); }} style={{
        background: 'none', border: `1px solid ${C.interactive}50`, borderRadius: 8,
        padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive,
      }}>Got it →</button>
    </div>
  );
}

function TrustedAdultSetup({ navigate }) {
  const existing = loadTrustedAdult();
  const [name, setName] = useState(existing?.name || '');
  const [relationship, setRelationship] = useState(existing?.relationship || '');
  const [customRel, setCustomRel] = useState(existing?.relationship && !['Family member','Counselor','Therapist','Case manager','Mentor'].includes(existing.relationship) ? existing.relationship : '');
  const [signalWord, setSignalWord] = useState(existing?.signalWord || '');
  const [saved, setSaved] = useState(false);

  const RELATIONSHIPS = ['Family member', 'Counselor', 'Therapist', 'Case manager', 'Mentor', 'Someone else'];
  const finalRel = relationship === 'Someone else' ? customRel : relationship;
  const canSave = name.trim().length > 0 && finalRel.trim().length > 0 && signalWord.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const data = { name: name.trim(), relationship: finalRel.trim(), signalWord: signalWord.trim() };
    try { localStorage.setItem('aof-trusted-adult', JSON.stringify(data)); } catch (e) {}
    setSaved(true);
  };

  const briefing = () => {
    const data = { name: name.trim(), relationship: finalRel.trim(), signalWord: signalWord.trim() };
    return [
      'A note about this app and what your signal word means.',
      '',
      `${data.name} — you are set up as a trusted adult inside an app called The Art of Friendship.`,
      '',
      'The app teaches social and friendship skills. It also has an SOS screen for moments that feel too big.',
      '',
      `The signal word is: "${data.signalWord}"`,
      '',
      `If you get a text that just says "${data.signalWord}" — it means the person needs support right now. It does not mean an emergency has already happened. It means they want you to check in, call, or come find them.`,
      '',
      'You do not need to know anything else about the app to help. Just respond like you would to any other check-in.',
      '',
      '— The Art of Friendship',
    ].join('\n');
  };

  if (saved) {
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ backgroundColor: C.calm + '12', border: `1px solid ${C.calm}40`, borderLeft: `4px solid ${C.calm}`, borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Saved ✓</div>
          <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
            {name} is now set up as your trusted adult. Your SOS screen will show this the next time you need it.
          </div>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>SHARE THIS WITH {name.toUpperCase()}</div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 10 }}>
          It helps if {name} knows what the signal word means before you ever need to send it.
        </div>
        <FacilitatorShareButton summary={briefing()} />
        <div style={{ marginTop: 16 }}>
          <button onClick={() => setSaved(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.interactive, padding: 0, marginBottom: 12, display: 'block' }}>
            Edit this →
          </button>
          <Btn label="Done" onClick={() => navigate('home')} variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginBottom: 20 }}>
        A trusted adult is someone you can reach out to when something feels too big. Setting this up now means it is ready before you need it.
      </div>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHAT IS THEIR NAME?</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="First name is enough" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
      </Card>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHO ARE THEY TO YOU?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: relationship === 'Someone else' ? 10 : 0 }}>
          {RELATIONSHIPS.map(r => (
            <button key={r} onClick={() => setRelationship(r)} style={{ padding: '7px 12px', borderRadius: 20, cursor: 'pointer', border: `1.5px solid ${relationship === r ? C.interactive : C.border}`, backgroundColor: relationship === r ? C.interactive + '14' : 'transparent', color: relationship === r ? C.interactive : C.secondary, fontSize: 12, fontWeight: relationship === r ? 700 : 400 }}>{r}</button>
          ))}
        </div>
        {relationship === 'Someone else' && (
          <input value={customRel} onChange={e => setCustomRel(e.target.value)} placeholder="Who are they to you?" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
        )}
      </Card>

      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>PICK A SIGNAL WORD</div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 10 }}>
          A signal word is one word that means "I need support" without you having to explain anything. Pick a word that would not come up in a normal text — something just for this.
        </div>
        <input value={signalWord} onChange={e => setSignalWord(e.target.value)} placeholder="Example: pineapple" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box' }} />
      </Card>

      <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6, marginBottom: 16, marginTop: 4 }}>
        Talk to {name || 'this person'} about the signal word before you save it, if you can. It works best when both of you already know what it means.
      </div>

      <Btn label="Save →" onClick={handleSave} variant={canSave ? 'primary' : 'ghost'} />
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────────────────────

function HomeScreen({ navigate, regState, goal, saveGoal }) {
  const START_HERE = [
    {
      icon: '📖',
      screen: 'module1',
      title: 'The Framework',
      sub: '13 Rules · 24 Definitions',
      desc: 'Start here. Learn the rules and what they mean.',
      accent: C.interactive,
      primary: true,
    },
    {
      icon: '🔵',
      screen: 'ring-mismatch',
      title: 'Understanding Rings',
      sub: 'The Five Rings · Ring Types · Ring Check',
      desc: 'Learn who belongs in which ring — and what it means when something feels off.',
      accent: C.interactive,
      primary: false,
    },
  ];

  const USE_WHEN_NEEDED = [
    { icon: '✉️', screen: 'module2-anchor', title: 'Before I Communicate', sub: 'Check before you text or talk to someone.' },
    { icon: '📊', screen: 'module3',         title: 'My Tracker',           sub: 'Look back. Track what you notice over time.' },
    { icon: '🎮', screen: 'module4',         title: 'Practice',             sub: 'Try out the rules. See what you know.' },
  ];

  return (
    <div>
      {/* Identity banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1A2744 0%, #3D5FC8 100%)',
        borderRadius: 16, padding: '18px 18px 16px', marginBottom: 20,
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>The Art of Friendship</div>
      </div>

      {/* Continue where you left off — the single most likely next action, surfaced first */}
      {(() => {
        const last = loadLastScreen();
        if (!last || !last.screen) return null;
        return (
          <button onClick={() => navigate(last.screen)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
            backgroundColor: C.calm + '0F', border: `1px solid ${C.calm}40`,
            borderRadius: 10, padding: '11px 14px', cursor: 'pointer', marginBottom: 14,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>↻</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.3, marginBottom: 1 }}>CONTINUE WHERE YOU LEFT OFF</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{last.title}</div>
            </div>
            <span style={{ fontSize: 16, color: C.calm }}>›</span>
          </button>
        );
      })()}

      {/* Trusted adult setup prompt — only if not yet configured */}
      {!loadTrustedAdult() && (
        <button onClick={() => navigate('trusted-adult-setup')} style={{
          display: 'block', width: '100%', textAlign: 'left',
          backgroundColor: C.white, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '11px 14px', cursor: 'pointer', marginBottom: 14,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.primary, marginBottom: 2 }}>👤 Set up your trusted adult</div>
          <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.5 }}>Takes a minute. Makes your SOS screen ready before you need it.</div>
        </button>
      )}

      {/* Regulation state response */}
      {regState === 'activated' && (
        <div style={{ padding: '9px 14px', marginBottom: 14, backgroundColor: C.activated + '10', border: `1px solid ${C.activated}30`, borderLeft: `3px solid ${C.activated}`, borderRadius: 8, fontSize: 13, color: C.activated, fontWeight: 600, lineHeight: 1.5 }}>
          You reported activated. Starting with The Framework is a good place to begin.
        </div>
      )}
      {regState === 'overwhelmed' && (
        <div style={{ padding: '9px 14px', marginBottom: 14, backgroundColor: C.overwhelmed + '08', border: `1px solid ${C.overwhelmed}20`, borderLeft: `3px solid ${C.overwhelmed}`, borderRadius: 8, fontSize: 13, color: C.overwhelmed, fontWeight: 600, lineHeight: 1.5 }}>
          Welcome back. There is no rush. Open what feels right.
        </div>
      )}

      {/* START HERE section */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.secondary, marginBottom: 10 }}>Start here</div>

      {START_HERE.map((item) => (
        <button key={item.screen} onClick={() => navigate(item.screen)} style={{
          display: 'block', width: '100%', textAlign: 'left',
          backgroundColor: item.primary ? C.interactive + '08' : C.white,
          border: `1px solid ${item.primary ? C.interactive + '40' : C.border}`,
          borderLeft: `4px solid ${item.accent}`,
          borderRadius: 12, padding: '14px 16px', cursor: 'pointer', marginBottom: 10,
          boxShadow: item.primary ? `0 2px 8px ${C.interactive}14` : '0 1px 4px rgba(26,39,68,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>
              {item.icon} {item.title}
            </span>
            <span style={{ fontSize: 16, color: C.border, marginLeft: 6 }}>›</span>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: item.accent, marginBottom: 4, marginTop: 2 }}>{item.sub}</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{item.desc}</div>
        </button>
      ))}

      {/* USE WHEN NEEDED section */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.secondary, marginBottom: 10, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>Use when you need it</div>

      {USE_WHEN_NEEDED.map((item) => (
        <button key={item.screen} onClick={() => navigate(item.screen)} style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
          backgroundColor: C.white, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
          boxShadow: '0 1px 4px rgba(26,39,68,0.04)',
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 2 }}>{item.title}</div>
            <div style={{ fontSize: 12, color: C.secondary }}>{item.sub}</div>
          </div>
          <span style={{ fontSize: 16, color: C.border }}>›</span>
        </button>
      ))}

      {/* Situational buttons */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.secondary, marginBottom: 10 }}>What is happening right now?</div>
        {[
          { label: '💬 I want to text or say something to someone', screen: 'module2-anchor', color: C.interactive },
          { label: '🗣 I am talking to someone right now',           screen: 'module2-anchor', color: C.calm },
          { label: '🔁 I just finished talking to someone',          screen: 'navigator',       color: DC[4] },
          { label: '❓ I am not sure',                               screen: 'regulation',      color: C.secondary },
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

      <GoalEditor goal={goal} onSave={saveGoal} />

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
        After a Conversation
      </div>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        You just finished a conversation. Where do you want to go?
      </div>
      {[
        { label: '🔍 Self-Audit — Look at what happened',        dest: 'module3-audit'      },
        { label: '📓 Bilateral Journal — Record what I noticed', dest: 'module3-journal'    },
        { label: '📋 Rule I Applied — Log one moment',            dest: 'module3-applied'  },
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

    </div>
  );
}

function OverwhelmedStop({ navigate, onEmergency, onGrounding }) {
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
        <Btn label="Take a Pause" onClick={onGrounding} variant="secondary" style={{ marginBottom: 8 }} />
        <Btn label="Go to Emergency Screen" onClick={onEmergency} variant="ghost" small />
      </Card>
    </div>
  );
}

function EmergencyScreen({ navigate }) {
  const trustedAdult = loadTrustedAdult();
  return (
    <div style={{
      backgroundColor: '#1A2744',
      minHeight: '100%',
      padding: 24,
      display: 'flex', flexDirection: 'column',
    }}>

      {/* What this is */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>
          SOS Screen
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 10 }}>
          You pressed the 🆘 button.
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}>
          This screen is here if you need to slow down or reach out to someone. You do not have to read anything or do anything. Nothing on this screen is required. You can leave right now.
        </div>
      </div>

      {/* EXIT — prominent, at the top */}
      <button
        onClick={() => navigate('home')}
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          borderRadius: 12, padding: '14px 16px',
          color: '#fff', fontSize: 15, fontWeight: 700,
          cursor: 'pointer', marginTop: 20, marginBottom: 28,
          textAlign: 'center',
        }}
      >
        ← Leave this screen — go home
      </button>

      {/* Optional section label */}
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
        Optional — use any of these if they help
      </div>

      {/* Step 1 */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 18, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, marginBottom: 8 }}>
          SLOW DOWN
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>
          Press both feet into the floor. Feel the pressure. Breathe out slowly. You are here.
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 18, marginBottom: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, marginBottom: 8 }}>
          PERMISSION
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>
          You do not have to do anything right now. You are allowed to be still.
        </div>
      </div>

      {/* Step 3 */}
      <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, marginBottom: 8 }}>
          IF YOU NEED SOMEONE
        </div>
        {trustedAdult ? (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: 10 }}>
              Text {trustedAdult.name} one word:
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: 8, padding: '10px 16px',
              fontSize: 22, fontWeight: 800, color: '#fff',
              textAlign: 'center', letterSpacing: 1,
            }}>
              "{trustedAdult.signalWord}"
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.6, marginBottom: 8 }}>
              Text your trusted adult. You can send one word — the signal word you decided on together.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>
              If you have not set up a signal word yet, reach out to them however you normally would.
            </div>
            <button onClick={() => navigate('trusted-adult-setup')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textDecoration: 'underline', padding: 0 }}>
              Set this up for next time →
            </button>
          </>
        )}
      </div>

      {/* EXIT at bottom too */}
      <button
        onClick={() => navigate('home')}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 10, padding: '13px 16px',
          color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', marginTop: 'auto', textAlign: 'center',
        }}
      >
        ← Return to home screen
      </button>

    </div>
  );
}

// ─── MODULE 2 SCREENS ─────────────────────────────────────────────────────────

function Module2Anchor({ navigate, settings, showTerm }) {
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
          <div style={{ fontSize: 13, color: C.primary }}>This checklist uses the rules. Know them before you start.</div>
        </div>
        <button onClick={() => navigate('module1')} style={{
          flexShrink: 0, marginLeft: 12, padding: '6px 12px', borderRadius: 8,
          border: `1px solid ${C.interactive}60`, backgroundColor: C.interactive + '18',
          cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive,
        }}>Rules →</button>
      </div>

      {/* Related terms — tap to preview without leaving */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>
          TERMS USED IN THIS CHECKLIST
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[9, 13, 15, 16, 6, 14].map(id => {
            const term = TERMS.find(t => t.id === id);
            return term ? (
              <button key={id} onClick={() => showTerm(id)} style={{
                padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${DC[term.domainNum]}60`,
                backgroundColor: DC[term.domainNum] + '12',
                fontSize: 12, fontWeight: 600, color: DC[term.domainNum],
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {term.metaphor.symbol} {term.name}
                <span style={{ fontSize: 10, opacity: 0.7 }}>ⓘ</span>
              </button>
            ) : null;
          })}
        </div>
      </div>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 19, fontWeight: 800, color: C.primary, lineHeight: 1.3, flex: 1, marginRight: 10 }}>
                {q.full}
              </div>
              <SpeakButton text={q.full + '. ' + q.sub} />
            </div>
            <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>
              {q.sub}
            </div>
          </Card>
          <Btn label={`✓  ${q.yesLabel}`} onClick={handleYes} variant="calm" style={{ marginBottom: 10 }} />
          <Btn label={`✗  ${q.noLabel}`} onClick={handleNo} variant="secondary" />
        </div>
      )}

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
            Scenario preparation based on your framework rules.
          </div>
        </Card>
      )}

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

  const FOUNDATIONAL = [1, 3, 6, 7];

  return (
    <div style={{ paddingTop: 4 }}>

      {/* Foundational terms — always visible before tabs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.primary, letterSpacing: 0, marginBottom: 8 }}>
          Before the rules
        </div>
        <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6, marginBottom: 12 }}>
          These four terms appear in almost every rule. This is where the framework begins.
        </div>
        {FOUNDATIONAL.map(id => {
          const term = TERMS.find(t => t.id === id);
          if (!term) return null;
          return (
            <button
              key={id}
              onClick={() => { setSelectedTerm(id); navigate('module1-term'); }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px', marginBottom: 8, width: '100%',
                backgroundColor: DC[term.domainNum] + '0A',
                border: `1px solid ${DC[term.domainNum]}30`,
                borderLeft: `3px solid ${DC[term.domainNum]}`,
                borderRadius: 10, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.2 }}>{term.metaphor.symbol}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 3 }}>{term.name}</div>
                <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.55 }}>{term.plain}</div>
              </div>
              <span style={{ fontSize: 14, color: C.secondary, flexShrink: 0, marginTop: 2 }}>›</span>
            </button>
          );
        })}
      </div>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14, backgroundColor: C.border + '60', borderRadius: 12, padding: 4 }}>
        {[['definitions', '📖 Definitions', 24], ['rules', '📋 Rules', 13]].map(([id, label, count]) => (
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

    </div>
  );
}

function Module1TermDetail({ navigate, termId, settings }) {
  const [activeTab, setActiveTab] = useState('text');
  const [audioState, setAudioState] = useState('idle'); // idle | playing | done
  const [showActivation, setShowActivation] = useState(true);
  const term = TERMS.find(t => t.id === termId) || TERMS[0];

  const handleAudio = () => {
    if (!window.speechSynthesis) {
      setAudioState('done');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(term.audioText);
    utterance.rate = 0.88;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.onstart = () => setAudioState('playing');
    utterance.onend = () => setAudioState('done');
    utterance.onerror = () => setAudioState('done');
    setAudioState('playing');
    window.speechSynthesis.speak(utterance);
  };

  const handleAudioStop = () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    setAudioState('idle');
  };

  const tabs = [
    { id: 'text', label: '📖 Define' },
    { id: 'visual', label: '🎨 See' },
    { id: 'audio', label: '🔊 Hear' },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      <TeachingCycleNote />
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
                boxShadow: `0 4px 16px ${DC[term.domainNum]}44`,
              }}>▶</button>
            )}
            {audioState === 'playing' && (
              <button onClick={handleAudioStop} style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: C.overwhelmed, border: 'none',
                cursor: 'pointer', fontSize: 28, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: `0 4px 16px ${C.overwhelmed}44`,
              }}>⏹</button>
            )}
            {audioState === 'done' && (
              <button onClick={handleAudio} style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: C.calm, border: 'none',
                cursor: 'pointer', fontSize: 28, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: `0 4px 16px ${C.calm}44`,
              }}>↺</button>
            )}
            <div style={{ fontSize: 13, color: C.secondary, fontWeight: 600 }}>
              {audioState === 'idle' ? 'Tap to hear the definition' : audioState === 'playing' ? 'Playing — tap ⏹ to stop' : 'Tap ↺ to play again'}
            </div>
          </Card>

          {audioState !== 'idle' && (
            <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 8 }}>TRANSCRIPT</div>
              <div style={{ fontSize: 15, color: C.primary, lineHeight: 1.8 }}>{term.audioText}</div>
            </Card>
          )}

        </div>
      )}

      {/* Rule link */}
      <button onClick={() => navigate('module1-rule-' + term.linkedRule)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '12px 14px', marginTop: 8,
        backgroundColor: C.white, border: `1px solid ${C.border}`,
        borderTop: `3px solid ${DC[term.domainNum]}`, borderRadius: 10,
        cursor: 'pointer',
      }}>
        <span style={{ fontSize: 13, color: C.secondary }}>Connected Rule</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: DC[term.domainNum] }}>Rule {term.linkedRule} →</span>
      </button>

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

    </div>
  );
}

function Module1RuleDetail({ navigate, ruleNum, setSelectedTerm, showTerm }) {
  const rule = RULES_FULL.find(r => r.num === ruleNum) || RULES_FULL[0];
  const [showActivation, setShowActivation] = useState(true);
  const [paused, setPaused] = useState(false);
  const clusterLabels = { Before: 'Before the Interaction', During: 'During the Interaction', After: 'After the Interaction', Periodic: 'Periodic Evaluation' };

  return (
    <div style={{ paddingTop: 4, position: 'relative' }}>
      <TeachingCycleNote />

      {/* Mid-content pause overlay */}
      {paused && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 50,
          backgroundColor: 'rgba(247,243,238,0.97)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32, textAlign: 'center',
          borderRadius: 12,
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⏸</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.primary, marginBottom: 12 }}>
            Take the time you need.
          </div>
          <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginBottom: 28, maxWidth: 260 }}>
            The content is still here. There is no hurry.
          </div>
          <button onClick={() => setPaused(false)} style={{
            padding: '13px 32px', borderRadius: 10, cursor: 'pointer',
            backgroundColor: C.interactive, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 3px 10px rgba(61,95,200,0.3)',
          }}>Continue reading</button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          backgroundColor: rule.color + '18', border: `1.5px solid ${rule.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: rule.color,
        }}>R{rule.num}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, lineHeight: 1.2 }}>{rule.title}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: rule.color, backgroundColor: rule.color + '18', padding: '2px 8px', borderRadius: 10 }}>
            {clusterLabels[rule.cluster]}
          </span>
        </div>
        {/* Pause button */}
        <button onClick={() => setPaused(true)} style={{
          flexShrink: 0, background: 'none', border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '5px 10px', cursor: 'pointer',
          fontSize: 12, color: C.secondary, fontWeight: 600,
        }}>⏸</button>
      </div>

      {/* Activation prompt */}
      {showActivation && rule.activationPrompt && (
        <div style={{
          backgroundColor: C.activated + '0E', borderRadius: 12,
          border: `1.5px solid ${C.activated}40`, padding: '14px 14px 12px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.activated, letterSpacing: 0.5, marginBottom: 8 }}>
            BEFORE YOU READ — Connect to your own experience
          </div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 12 }}>
            {rule.activationPrompt}
          </div>
          <button onClick={() => setShowActivation(false)} style={{
            padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
            backgroundColor: C.activated, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>I thought about it — show the rule →</button>
        </div>
      )}

      {/* The Rule */}
      <div style={{ backgroundColor: rule.color + '0E', borderRadius: 12, borderLeft: `4px solid ${rule.color}`, padding: 14, marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: rule.color, letterSpacing: 0.4 }}>THE RULE</div>
          <SpeakButton text={rule.theRule} />
        </div>
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
                <button key={id} onClick={() => showTerm(id)} style={{
                  padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${DC[term.domainNum]}60`,
                  backgroundColor: DC[term.domainNum] + '12',
                  fontSize: 12, fontWeight: 600, color: DC[term.domainNum],
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {term.metaphor.symbol} {term.name}
                  <span style={{ fontSize: 10, opacity: 0.7 }}>ⓘ</span>
                </button>
              ) : null;
            })}
          </div>
        )}
      </Card>

      {/* Behavioral Protocol */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4 }}>BEHAVIORAL PROTOCOL</div>
          <SpeakButton text={rule.protocol.join('. ')} />
        </div>
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

      {/* What This Looks Like — example / non-example pair */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>WHAT THIS LOOKS LIKE</div>
        <div style={{ backgroundColor: C.calm + '0A', border: `1px solid ${C.calm}30`, borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, marginBottom: 4 }}>✅ LIKE THIS</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{rule.example}</div>
        </div>
        <div style={{ backgroundColor: C.overwhelmed + '08', border: `1px solid ${C.overwhelmed}25`, borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.overwhelmed, marginBottom: 4 }}>❌ NOT LIKE THIS</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{rule.nonExample}</div>
        </div>
      </Card>

      {/* Violation Indicator */}
      <Card style={{ borderLeft: `4px solid ${C.activated}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.activated, letterSpacing: 0.4 }}>VIOLATION INDICATOR</div>
          <SpeakButton text={rule.violation} />
        </div>
        <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.65 }}>{rule.violation}</div>
      </Card>

      {/* Revelation acknowledgment — between violation and correction */}
      <div style={{
        padding: '10px 14px', marginBottom: 8,
        backgroundColor: C.primary + '07',
        border: `1px solid ${C.primary}18`,
        borderRadius: 10,
        display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1, opacity: 0.4 }}>◦</span>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, fontStyle: 'italic' }}>
          If you recognized yourself here — that recognition is the beginning of the work. A behavior can be corrected. A behavior is not who you are.
        </div>
      </div>

      {/* Correction Pathway */}
      <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4 }}>CORRECTION PATHWAY</div>
          <SpeakButton text={rule.correction} />
        </div>
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

      {/* Practice link */}
      <button onClick={() => navigate('module4')} style={{
        display: 'block', width: '100%', padding: '11px 14px', marginTop: 8,
        borderRadius: 10, cursor: 'pointer', textAlign: 'left',
        border: `1px solid ${C.border}`,
        backgroundColor: C.interactive + '07',
        fontSize: 13, fontWeight: 600, color: C.interactive,
      }}>🎯 Practice this rule in scenarios →</button>

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
                    <button
                      key={ruleNum}
                      onClick={() => navigate('module1-rule-' + ruleNum)}
                      style={{
                        padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
                        backgroundColor: C.interactive + '12',
                        border: `1px solid ${C.interactive}50`,
                        fontSize: 11, fontWeight: 700, color: C.interactive,
                      }}
                    >Rule {ruleNum} →</button>
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

    </div>
  );
}

// ─── MODULE 3 SCREENS ────────────────────────────────────────────────────────

function Module3Home({ navigate, setDest, goal }) {
  const tools = [
    { id: 'module3-precorrect', icon: '🎯', title: 'Before It Happens',        desc: 'Flag a person or a moment coming up. See which rules matter before it starts.', badge: 'Before interaction', cluster: 'Before' },
    { id: 'module3-disclosure',icon: '🔐', title: 'Controlled disclosure',       desc: 'Match what you share to which ring the person is in.', badge: 'Disclosure', cluster: 'Before' },

    { id: 'module3-initiation', icon: '📨', title: 'Initiation Tracker',      desc: 'Track who reaches out first in each relationship. Get an alert after three in a row.', badge: 'Ongoing', cluster: 'During' },
    { id: 'module3-feedback',   icon: '🫁', title: 'Receiving Honest Feedback', desc: 'What to do before, during, and after someone tells you something honest and hard.', badge: 'High stakes', cluster: 'During' },
    { id: 'module3-signal',    icon: '📡', title: 'The signal and the source',  desc: 'Four types of response when you are activated. Knowing which one fits helps you ask for the right thing.', badge: 'Foundation', cluster: 'During' },
    { id: 'module3-reality',   icon: '🔍', title: 'Reality testing',            desc: 'Three questions to figure out what this moment actually needs from you.', badge: 'Decision tool', cluster: 'During' },

    { id: 'module3-audit',      icon: '🔍', title: 'Self-Audit',              desc: 'Look at a conversation you just had. Answer five questions. Three ways to answer them.', badge: 'After interaction', cluster: 'After' },
    { id: 'module3-applied',    icon: '✅', title: 'Rule I Applied Today',    desc: 'Write down one time today you used a rule from the framework.', badge: 'Daily', cluster: 'After' },
    { id: 'module3-journal',    icon: '📓', title: 'Bilateral Journal',        desc: 'What I noticed in the other person. What I noticed in myself.', badge: 'Weekly', cluster: 'After' },
    { id: 'module3-repair',    icon: '🔧', title: 'Bilateral repair sequence',   desc: 'What to do after a conversation went wrong — for your side, their side, or both.', badge: 'Repair', cluster: 'After' },
    { id: 'module3-conclude',  icon: '↩',  title: 'Before I conclude',           desc: 'Three questions to ask before you decide what the other person meant.', badge: 'Outgoing', cluster: 'After' },

    { id: 'module3-skill',      icon: '📊', title: 'Skill Tracker',           desc: 'Rate yourself on all 13 rules. Be honest about where you are right now.', badge: 'Weekly', cluster: 'Periodic' },
    { id: 'module3-health',     icon: '💚', title: 'Relationship Health Check', desc: 'Score a relationship on five things. Use the score to decide how much to invest.', badge: 'Monthly', cluster: 'Periodic' },
    { id: 'module3-quarterly',  icon: '🔎', title: 'Quarterly Self-Assessment', desc: 'Three questions. Do this every three months.', badge: 'Quarterly', cluster: 'Periodic' },

    { id: 'module3-progress',   icon: '📈', title: 'Progress Summary',         desc: 'See a summary of what you have logged and noticed over time.', badge: 'Ongoing', cluster: 'Anytime' },
    { id: 'module3-scripts',   icon: '💬', title: 'Advocacy scripts',          desc: 'Words you can use to say what you experienced without putting pressure on the other person.', badge: 'Communication', cluster: 'Anytime' },
  ];

  const CLUSTERS = [
    { key: 'Before',   label: 'Before the Interaction', color: DC[1] },
    { key: 'During',   label: 'During the Interaction', color: DC[3] },
    { key: 'After',    label: 'After the Interaction',  color: DC[4] },
    { key: 'Periodic', label: 'Periodic Evaluation',     color: DC[5] },
    { key: 'Anytime',  label: 'Anytime',                 color: C.secondary },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      {goal && (
        <div style={{ backgroundColor: C.calm + '14', border: `1.5px solid ${C.calm}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 4 }}>THIS WEEK'S GOAL</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>{goal}</div>
        </div>
      )}

      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 4 }}>
        Grouped the same way as the rules — by when you would use them.
      </div>
      <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.5, marginBottom: 16 }}>
        You will check in before each tool opens.
      </div>

      {CLUSTERS.map(c => {
        const group = tools.filter(t => t.cluster === c.key);
        if (group.length === 0) return null;
        return (
          <div key={c.key} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: c.color, letterSpacing: 0.4 }}>{c.label.toUpperCase()}</span>
            </div>
            {group.map(tool => (
              <button
                key={tool.id}
                onClick={() => { setDest(tool.id); navigate('module3-gate'); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  backgroundColor: C.white, border: `1px solid ${C.border}`,
                  borderLeft: `4px solid ${c.color}`,
                  borderRadius: 10, padding: '12px 14px', cursor: 'pointer', marginBottom: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{tool.icon} {tool.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.color, backgroundColor: c.color + '14', padding: '2px 8px', borderRadius: 10 }}>{tool.badge}</span>
                </div>
                <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>{tool.desc}</div>
              </button>
            ))}
          </div>
        );
      })}

    </div>
  );
}

function Module3Gate({ navigate, dest, onSetReg, regState }) {
  const states = [
    { key: 'calm',        color: C.calm,        icon: '🟢', label: 'Calm',        desc: 'I can read and process clearly. This tool is accessible right now.', action: () => { onSetReg('calm'); navigate(dest); } },
    { key: 'activated',   color: C.activated,   icon: '🟡', label: 'Activated',   desc: 'I am managing but it takes effort. I will use the simpler format if the tool has one.', action: () => { onSetReg('activated'); navigate(dest); } },
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
    </div>
  );
}

function Module3SelfAudit({ navigate, settings }) {
  const [step, setStep] = useState('format');
  const [format, setFormat] = useState('written');
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState('full');
  const [answers, setAnswers] = useState({});
  const [writtenText, setWrittenText] = useState({});
  const [wordSelections, setWordSelections] = useState({});
  const [manipChecks, setManipChecks] = useState({});
  const [audioState, setAudioState] = useState('idle');

  const questions = mode === 'short' ? AUDIT_Q.filter(q => q.id === 3 || q.id === 5) : AUDIT_Q;
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
        { id: 'audio',   icon: '🔊', label: 'Hear & respond', desc: 'Hear each question read aloud. Best when reading feels inaccessible.' },
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

    </div>
  );

  if (step.startsWith('q') && currentQ) {
    const qTotal = activeQIds.length;
    return (
      <div style={{ paddingTop: 8, position: 'relative' }}>

        {/* Pause overlay */}
        {paused && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(247,243,238,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 32, textAlign: 'center', borderRadius: 12,
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⏸</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.primary, marginBottom: 12 }}>Take the time you need.</div>
            <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7, marginBottom: 28, maxWidth: 260 }}>The question is still here. There is no hurry.</div>
            <button onClick={() => setPaused(false)} style={{ padding: '13px 32px', borderRadius: 10, cursor: 'pointer', backgroundColor: C.interactive, border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, boxShadow: '0 3px 10px rgba(61,95,200,0.3)' }}>Continue</button>
          </div>
        )}

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
            <div style={{ width: `${(currentQPos / qTotal) * 100}%`, height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>Q{currentQPos} of {qTotal}</span>
          <button onClick={() => setPaused(true)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11, color: C.secondary, fontWeight: 600 }}>⏸</button>
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

        {/* Audio format — hear the question, then respond */}
        {format === 'audio' && (
          <div style={{ textAlign: 'center', paddingBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>
              HEAR THE QUESTION — THEN RESPOND
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <SpeakButton text={currentQ.full + '. ' + currentQ.sub} />
            </div>
            <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6, marginBottom: 4 }}>
              Tap 🔊 to hear the question read aloud. Then select your response below.
            </div>
          </div>
        )}

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
          <FacilitatorShareButton summary={[
            'Self-Audit Completed',
            '',
            ...activeQIds.map(id => {
              const q = AUDIT_Q.find(x => x.id === id);
              const ans = answers[id];
              return `${q.symbol} ${q.full}: ${ans === true ? 'Handled well' : ans === false ? 'Pattern to examine' : 'Response recorded'}`;
            }),
            '',
            `Pattern: ${mastery.text}`,
          ].join('\n')} />
        </div>

        {/* Pattern pathway — shows when 2 or more patterns detected */}
        {activeQIds.filter(id => answers[id] === false).length >= 2 && (
          <Card style={{ borderLeft: `4px solid ${C.activated}`, marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.activated, letterSpacing: 0.4, marginBottom: 8 }}>
              YOU RECOGNIZED A PATTERN
            </div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6, marginBottom: 12 }}>
              Two or more areas showed a pattern to examine. That level of recognition is significant. What would you like to do with it?
            </div>
            <Btn
              label="I want to work on this — set a goal"
              onClick={() => navigate('home')}
              variant="calm"
              style={{ marginBottom: 8 }}
            />
            <FacilitatorShareButton summary={[
              'Self-Audit — Pattern Recognized',
              '',
              'The student identified 2 or more patterns to examine:',
              ...activeQIds
                .filter(id => answers[id] === false)
                .map(id => {
                  const q = AUDIT_Q.find(x => x.id === id);
                  return `  • ${q.symbol} ${q.full}`;
                }),
              '',
              `Pattern summary: ${mastery.text}`,
              '',
              'Student selected: I want to work on this.',
            ].join('\n')} />
          </Card>
        )}

        <Btn label="Return to My Tracker" onClick={() => navigate('module3')} variant="primary" style={{ marginTop: 12 }} />

      </div>
    );
  }

  return null;
}

function Module3SkillTracker({ navigate }) {
  const [ratings, setRatings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aof-skill-ratings') || '{}'); } catch { return {}; }
  });
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
        <Btn label="Save tracker" onClick={() => { try { localStorage.setItem('aof-skill-ratings', JSON.stringify(ratings)); } catch(e) {} setSaved(true); }} variant="primary" style={{ marginTop: 4 }} />
      ) : (
        <Card style={{ borderLeft: `4px solid ${C.calm}`, marginTop: 4 }}>
          <div style={{ fontSize: 14, color: C.primary, fontWeight: 700 }}>Saved ✓</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginTop: 4 }}>
            Every skill starts in the "not yet" column. Where you are today is exactly the right starting point.
          </div>
        </Card>
      )}

    </div>
  );
}

// ─── PRE-CORRECTION: BEFORE IT HAPPENS ────────────────────────────────────────

function relevantRulesForRing(ring) {
  const base = [1, 8];
  if (ring === 1 || ring === 2 || ring === null) return [...base, 13];
  if (ring === 4 || ring === 5) return [...base, 7, 11];
  return [...base, 5];
}

function Module3PreCorrect({ navigate }) {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aof-precorrect-log') || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [person, setPerson] = useState('');
  const [ring, setRing] = useState(null);
  const [situation, setSituation] = useState('');
  const [openId, setOpenId] = useState(null);

  const RING_OPTS = [1, 2, 3, 4, 5];

  const save = () => {
    if (!person.trim() || !situation.trim()) return;
    const entry = { id: Date.now(), person: person.trim(), ring, situation: situation.trim(), date: new Date().toLocaleDateString() };
    const newEntries = [entry, ...entries].slice(0, 20);
    setEntries(newEntries);
    try { localStorage.setItem('aof-precorrect-log', JSON.stringify(newEntries)); } catch (e) {}
    setPerson(''); setRing(null); setSituation('');
    setShowAdd(false);
    setOpenId(entry.id);
  };

  const remove = (id) => {
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    try { localStorage.setItem('aof-precorrect-log', JSON.stringify(newEntries)); } catch (e) {}
  };

  const RelevantRulesCard = ({ forRing }) => (
    <div style={{ backgroundColor: C.interactive + '0A', border: `1px solid ${C.interactive}30`, borderRadius: 10, padding: '12px 14px', marginTop: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.interactive, letterSpacing: 0.4, marginBottom: 10 }}>RULES THAT MATTER HERE</div>
      {relevantRulesForRing(forRing).map(num => {
        const r = RULES_SIMPLE.find(x => x.num === num);
        if (!r) return null;
        return (
          <button key={num} onClick={() => navigate('module1-rule-' + num)} style={{
            display: 'block', width: '100%', textAlign: 'left', backgroundColor: C.white,
            border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', marginBottom: 6, cursor: 'pointer',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: r.color, marginRight: 6 }}>R{num}</span>
            <span style={{ fontSize: 13, color: C.primary }}>{r.title}</span>
          </button>
        );
      })}
      {(forRing === null || forRing === 1 || forRing === 2) && (
        <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.5, marginTop: 4, marginBottom: 8 }}>
          Not sure which ring they are in? The Ring Check tool can help.
        </div>
      )}
      <Btn label="Open Before I Communicate →" onClick={() => navigate('module2-anchor')} variant="secondary" style={{ marginTop: 4 }} />
    </div>
  );

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Before It Happens</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Flag a person or a moment coming up. See which rules matter before it starts — not after.
      </div>

      {!showAdd && <Btn label="+ Flag a person or situation" onClick={() => setShowAdd(true)} variant="primary" style={{ marginBottom: 16 }} />}

      {showAdd && (
        <Card style={{ borderLeft: `4px solid ${C.interactive}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHO IS THIS?</div>
          <input value={person} onChange={e => setPerson(e.target.value)} placeholder="First name is enough" style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, fontFamily: 'system-ui', boxSizing: 'border-box', marginBottom: 14 }} />

          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHICH RING? (IF YOU KNOW)</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {RING_OPTS.map(n => (
              <button key={n} onClick={() => setRing(n)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${ring === n ? C.interactive : C.border}`, backgroundColor: ring === n ? C.interactive + '14' : 'transparent', color: ring === n ? C.interactive : C.secondary, fontSize: 13, fontWeight: ring === n ? 700 : 400 }}>{n}</button>
            ))}
            <button onClick={() => setRing(null)} style={{ padding: '8px 8px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${ring === null ? C.interactive : C.border}`, backgroundColor: ring === null ? C.interactive + '14' : 'transparent', color: ring === null ? C.interactive : C.secondary, fontSize: 12, fontWeight: ring === null ? 700 : 400 }}>Not sure</button>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHAT IS COMING UP?</div>
          <textarea value={situation} onChange={e => setSituation(e.target.value)} placeholder="Example: Meeting Jordan for coffee tomorrow." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 64, boxSizing: 'border-box', marginBottom: 14 }} />

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn label="Cancel" onClick={() => { setShowAdd(false); setPerson(''); setRing(null); setSituation(''); }} variant="ghost" />
            <Btn label="Save →" onClick={save} variant={person.trim() && situation.trim() ? 'primary' : 'ghost'} />
          </div>
        </Card>
      )}

      {entries.length === 0 && !showAdd && (
        <div style={{ textAlign: 'center', color: C.secondary, fontSize: 14, padding: '24px 0', lineHeight: 1.6 }}>
          You have not flagged anything yet. Flag a person or a moment before it happens, and the right rules will be waiting for you.
        </div>
      )}

      {entries.map(e => {
        const open = openId === e.id;
        return (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <button onClick={() => setOpenId(open ? null : e.id)} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              width: '100%', textAlign: 'left', backgroundColor: C.white,
              border: `1px solid ${open ? C.interactive : C.border}`,
              borderRadius: open ? '10px 10px 0 0' : 10, padding: '11px 14px', cursor: 'pointer',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{e.person}{e.ring ? ` · Ring ${e.ring}` : ''}</div>
                <div style={{ fontSize: 13, color: C.secondary, marginTop: 2 }}>{e.situation}</div>
                <div style={{ fontSize: 11, color: C.secondary, marginTop: 4 }}>{e.date}</div>
              </div>
              <span style={{ fontSize: 13, color: C.interactive, marginLeft: 8, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
            </button>
            {open && (
              <div style={{ border: `1px solid ${C.interactive}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '12px 14px', backgroundColor: C.interactive + '04' }}>
                <RelevantRulesCard forRing={e.ring} />
                <button onClick={() => remove(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.secondary, padding: 0, marginTop: 12 }}>
                  Remove this →
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Module3Applied({ navigate }) {
  const [ruleNum, setRuleNum] = useState(null);
  const [context, setContext] = useState('real'); // 'real' | 'practice'
  const [mode, setMode] = useState('frame');
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [outcome, setOutcome] = useState(null);
  const [saved, setSaved] = useState(false);
  const [lastEntry, setLastEntry] = useState(null);
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aof-applied-log') || '[]'); } catch { return []; }
  });

  const wordBank = ['listened carefully', 'adjusted when I noticed signals', 'gave the other person space', 'checked in before continuing', 'used a closing statement', 'paused before responding', 'respected the ring', 'asked a question about them'];
  const realLifeCount = entries.filter(e => e.context === 'real').length;

  const handleSave = () => {
    if (!ruleNum || !outcome) return;
    const ruleName = RULES_SIMPLE.find(r => r.num === ruleNum)?.title || 'Rule ' + ruleNum;
    const entry = { rule: ruleNum, ruleName, context, text: text || words.join(', '), outcome, date: new Date().toLocaleDateString() };
    const newEntries = [entry, ...entries].slice(0, 30);
    setEntries(newEntries);
    setLastEntry(entry);
    try { localStorage.setItem('aof-applied-log', JSON.stringify(newEntries)); } catch(e) {}
    setSaved(true);
    setText(''); setWords([]); setRuleNum(null); setOutcome(null);
    setTimeout(() => setSaved(false), 6000);
  };

  const buildAcknowledgment = (e) => {
    const behavior = e.text && e.text.trim().length > 2 ? e.text.trim() : null;
    const ruleLine = `Rule ${e.rule} — ${e.ruleName}`;
    if (e.context === 'real') {
      const opener = behavior
        ? `You did this yourself, without being asked: "${behavior}."`
        : `You did this yourself, without being asked.`;
      const outcomeLine = e.outcome === 'well'
        ? ' It went well. That is the skill working in real life.'
        : e.outcome === 'partly'
        ? ' It went partly well. Using the rule on purpose is what matters, even when it is not perfect.'
        : ' It did not go the way you wanted. You still noticed and named it. Noticing is the hardest part, and you did it.';
      return `${opener} That is ${ruleLine}.${outcomeLine}`;
    }
    const outcomeLine = e.outcome === 'well'
      ? ' It went well.'
      : e.outcome === 'partly'
      ? ' It went partly well. That still counts.'
      : ' It did not go the way you wanted. Practicing it anyway is how it becomes automatic.';
    return `You practiced ${ruleLine}.${outcomeLine}`;
  };

  const buildSummary = (e) => [
    'Rule Applied Log Entry',
    '',
    `Rule ${e.rule}: ${e.ruleName}`,
    `Setting: ${e.context === 'real' ? 'Real-life situation (natural environment)' : 'Practice session'}`,
    `How it went: ${e.outcome === 'well' ? 'Went well' : e.outcome === 'partly' ? 'Partly successful' : 'Needs more work'}`,
    e.text ? `Notes: ${e.text}` : '',
    '',
    `Session real-life total: ${realLifeCount + (e.context === 'real' ? 1 : 0)}`,
  ].filter(Boolean).join('\n');

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Rule I Applied Today</div>

      {realLifeCount > 0 && (
        <div style={{ backgroundColor: C.calm + '12', border: `1px solid ${C.calm}30`, borderRadius: 10, padding: '7px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🌱</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.calm }}>{realLifeCount} real-life {realLifeCount === 1 ? 'application' : 'applications'} logged this session</span>
        </div>
      )}

      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Record one moment you deliberately used a framework rule. Noticing competence is the practice.
      </div>

      {/* Context — real life vs practice */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHERE DID THIS HAPPEN?</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            ['real', '🌱 Real life', C.calm, 'You applied this without a prompt.'],
            ['practice', '📖 Practice session', C.interactive, 'You applied this in a structured session.'],
          ].map(([val, label, color, note]) => (
            <button key={val} onClick={() => setContext(val)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              border: `1.5px solid ${context === val ? color : C.border}`,
              backgroundColor: context === val ? color + '14' : 'transparent',
              color: context === val ? color : C.secondary,
              fontSize: 13, fontWeight: context === val ? 700 : 400,
            }}>{label}</button>
          ))}
        </div>
        {context === 'real' && <div style={{ fontSize: 11, color: C.calm, marginTop: 6, fontWeight: 600 }}>Natural environment — this is what generalization looks like.</div>}
      </Card>

      {/* Rule selection */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>WHICH RULE?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {RULES_SIMPLE.map(r => (
            <button key={r.num} onClick={() => setRuleNum(r.num)} style={{ padding: '5px 10px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${ruleNum === r.num ? r.color : C.border}`, backgroundColor: ruleNum === r.num ? r.color + '14' : 'transparent', color: ruleNum === r.num ? r.color : C.secondary, fontSize: 12, fontWeight: ruleNum === r.num ? 700 : 400 }}>R{r.num}</button>
          ))}
        </div>
        {ruleNum && <div style={{ fontSize: 12, color: C.secondary, marginTop: 4 }}>Rule {ruleNum}: {RULES_SIMPLE.find(r => r.num === ruleNum)?.title}</div>}
      </Card>

      {/* Composition mode */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[['frame', '✍️ Sentence frame'], ['words', '🔘 Word bank'], ['free', '📝 Free entry']].map(([id, label]) => (
          <button key={id} onClick={() => setMode(id)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${mode === id ? C.interactive : C.border}`, backgroundColor: mode === id ? C.interactive + '10' : 'transparent', color: mode === id ? C.interactive : C.secondary, fontSize: 11, fontWeight: mode === id ? 700 : 400, textAlign: 'center' }}>{label}</button>
        ))}
      </div>
      {mode === 'frame' && <Card><div style={{ fontSize: 13, color: C.secondary, marginBottom: 6, fontStyle: 'italic' }}>Today I applied Rule {ruleNum || '___'} when I...</div><textarea value={text} onChange={e => setText(e.target.value)} placeholder="describe the situation briefly..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 64, boxSizing: 'border-box' }} /></Card>}
      {mode === 'words' && <Card><div style={{ fontSize: 12, color: C.secondary, marginBottom: 8 }}>Today I applied Rule {ruleNum || '___'} when I...</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{wordBank.map(w => { const sel = words.includes(w); return <button key={w} onClick={() => setWords(p => sel ? p.filter(x => x !== w) : [...p, w])} style={{ padding: '6px 10px', borderRadius: 20, border: `1.5px solid ${sel ? C.interactive : C.border}`, backgroundColor: sel ? C.interactive + '14' : 'transparent', color: sel ? C.interactive : C.primary, fontSize: 12, fontWeight: sel ? 700 : 400, cursor: 'pointer' }}>{w}</button>; })}</div></Card>}
      {mode === 'free' && <Card><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write freely about the moment..." style={{ width: '100%', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.primary, lineHeight: 1.5, resize: 'none', fontFamily: 'system-ui', minHeight: 80, boxSizing: 'border-box' }} /></Card>}

      {/* Outcome */}
      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>HOW DID IT GO?</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['well', '✅ Went well', C.calm], ['partly', '⚡ Partly', C.activated], ['needs-work', '📌 Needs work', C.secondary]].map(([val, label, color]) => (
            <button key={val} onClick={() => setOutcome(val)} style={{ flex: 1, padding: '9px 4px', borderRadius: 8, cursor: 'pointer', textAlign: 'center', border: `1.5px solid ${outcome === val ? color : C.border}`, backgroundColor: outcome === val ? color + '14' : 'transparent', color: outcome === val ? color : C.secondary, fontSize: 12, fontWeight: outcome === val ? 700 : 400 }}>{label}</button>
          ))}
        </div>
      </Card>

      <Btn label="Log this moment ✓" onClick={handleSave} variant={ruleNum && outcome ? 'calm' : 'ghost'} style={{ marginBottom: 12 }} />

      {saved && lastEntry && (
        <>
          <div style={{ padding: 12, backgroundColor: C.greenBg, border: `1px solid ${C.calm + '60'}`, borderRadius: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.calm }}>Logged ✓ {lastEntry.context === 'real' ? '🌱 Real-life application' : '📖 Practice session'}</div>
          </div>
          <MasteryCard message={buildAcknowledgment(lastEntry)} />
          <FacilitatorShareButton summary={buildSummary(lastEntry)} />
        </>
      )}

      {entries.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>LOG HISTORY</div>
          {entries.slice(0, 8).map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: RULES_SIMPLE.find(r => r.num === e.rule)?.color || C.interactive, backgroundColor: C.border + '60', padding: '2px 6px', borderRadius: 6 }}>R{e.rule}</span>
                <span style={{ fontSize: 12 }}>{e.context === 'real' ? '🌱' : '📖'}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.4 }}>{e.text || '(word bank)'}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: C.secondary }}>{e.date}</span>
                  {e.outcome && <span style={{ fontSize: 11, fontWeight: 700, color: e.outcome === 'well' ? C.calm : e.outcome === 'partly' ? C.activated : C.secondary }}>
                    {e.outcome === 'well' ? '✅ Well' : e.outcome === 'partly' ? '⚡ Partly' : '📌 Needs work'}
                  </span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function Module3InitiationTracker({ navigate }) {
  const [relName, setRelName] = useState('');
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aof-initiation-log') || '[]'); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [lastLogged, setLastLogged] = useState(false);

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
    const newEntry = { rel: relName.trim(), who, date: new Date().toLocaleDateString() };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    try { localStorage.setItem('aof-initiation-log', JSON.stringify(newEntries)); } catch(e) {}
    setShowAdd(false);
    setRelName('');
    setLastLogged(true);
    setTimeout(() => setLastLogged(false), 4000);
  };

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Initiation Tracker</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Track who initiates contact in each relationship. Three consecutive self-initiations triggers an alert to pause and assess.
      </div>

      <Btn label="+ Log a contact" onClick={() => setShowAdd(true)} variant="primary" style={{ marginBottom: 16 }} />
      {lastLogged && <MasteryCard message="Logged. Tracking this pattern is how you protect yourself and respect others at the same time." />}

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
          <div style={{
            padding: '9px 12px', marginBottom: 12,
            backgroundColor: C.primary + '07', border: `1px solid ${C.primary}18`,
            borderRadius: 8, fontSize: 13, color: C.secondary, lineHeight: 1.7, fontStyle: 'italic',
          }}>
            The next question asks you to turn the same lens inward. This is different from observing someone else. Take your time with it.
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
      {saved && (
        <>
          <div style={{ padding: 10, backgroundColor: C.greenBg, border: `1px solid ${C.calm + '60'}`, borderRadius: 10, marginTop: 8, fontSize: 13, color: C.calm, fontWeight: 700 }}>Entry saved ✓</div>
          <MasteryCard message="You put it on paper. That is the first step in seeing your own patterns." />
        </>
      )}

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
        <MasteryCard message="You completed a bilateral evaluation. That is Level 5 work — the most advanced skill in this framework." />
        <FacilitatorShareButton summary={[
          `Relationship Health Check — ${relName}`,
          '',
          ...HEALTH_CRITERIA.map(c => `${c.label}: ${answers[c.id] === 'yes' ? 'Yes' : answers[c.id] === 'partial' ? 'Partial' : 'No'}`),
          '',
          `Result: ${score().level}`,
          `Recommended action: ${score().action}`,
        ].join('\n')} />
        <Btn label="Return to My Tracker" onClick={() => navigate('module3')} variant="primary" style={{ marginTop: 12 }} />
      </div>
    );
  }
  return null;
}

// ─── MODULE 4 SCREENS ────────────────────────────────────────────────────────

function Module3Progress({ navigate }) {
  const entries = (() => { try { return JSON.parse(localStorage.getItem('aof-applied-log') || '[]'); } catch { return []; } })();
  const goal    = (() => { try { return localStorage.getItem('aof-weekly-goal') || ''; } catch { return ''; } })();

  const realLife = entries.filter(e => e.context === 'real');
  const practice = entries.filter(e => e.context === 'practice');
  const outcomes = {
    well:      entries.filter(e => e.outcome === 'well').length,
    partly:    entries.filter(e => e.outcome === 'partly').length,
    needsWork: entries.filter(e => e.outcome === 'needs-work').length,
  };
  const ruleCounts = {};
  entries.forEach(e => { ruleCounts[e.rule] = (ruleCounts[e.rule] || 0) + 1; });
  const topRules = Object.entries(ruleCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([num, count]) => ({ num: parseInt(num), count, name: RULES_SIMPLE.find(r => r.num === parseInt(num))?.title }));

  const buildSummary = () => [
    'Progress Summary',
    goal ? `Current goal: ${goal}` : '',
    '',
    `Total applications logged: ${entries.length}`,
    `Real-life applications (🌱): ${realLife.length}`,
    `Practice sessions (📖): ${practice.length}`,
    '',
    outcomes.well > 0 ? `Went well: ${outcomes.well}` : '',
    outcomes.partly > 0 ? `Partly successful: ${outcomes.partly}` : '',
    outcomes.needsWork > 0 ? `Needs more work: ${outcomes.needsWork}` : '',
    topRules.length > 0 ? `\nMost practiced: ${topRules.map(r => `Rule ${r.num} (${r.count}x)`).join(', ')}` : '',
  ].filter(Boolean).join('\n');

  if (entries.length === 0 && !goal) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 8 }}>Progress Summary</div>
      <Card>
        <div style={{ textAlign: 'center', color: C.secondary, fontSize: 14, padding: '20px 0', lineHeight: 1.6 }}>
          No data yet. Set a goal and log some rule applications to see your progress here.
        </div>
      </Card>
      <Btn label="Log a rule application →" onClick={() => navigate('module3-applied')} variant="secondary" />
    </div>
  );

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Progress Summary</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        A snapshot of your work across sessions. Based on your log entries.
      </div>

      {goal && (
        <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>CURRENT GOAL</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6 }}>{goal}</div>
        </Card>
      )}

      {entries.length > 0 && (
        <Card style={{ backgroundColor: C.calm + '0A', borderLeft: `4px solid ${C.calm}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 10 }}>WHAT WENT RIGHT</div>
          {entries.slice(0, 3).map((e, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 10 : 0, paddingBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? `1px solid ${C.calm}20` : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.calm, marginBottom: 2 }}>
                Rule {e.rule} — {RULES_SIMPLE.find(r => r.num === e.rule)?.title}
              </div>
              <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>
                {e.text ? `"${e.text}"` : (e.context === 'real' ? 'Applied in a real moment, without a prompt.' : 'Practiced in a structured session.')}
              </div>
            </div>
          ))}
          <div style={{ fontSize: 12, color: C.calm, fontWeight: 600, marginTop: 10 }}>
            {realLife.length > 0 ? `${realLife.length} of these happened in real life, on your own.` : 'Keep logging — real-life moments count the most.'}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 12 }}>APPLICATIONS LOGGED</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[
            [entries.length, 'Total', C.primary, C.bg],
            [realLife.length, '🌱 Real life', C.calm, C.calm + '12'],
            [practice.length, '📖 Practice', C.interactive, C.interactive + '10'],
          ].map(([count, label, color, bg]) => (
            <div key={label} style={{ flex: 1, textAlign: 'center', padding: 12, backgroundColor: bg, borderRadius: 10 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>

      {entries.length > 0 && (
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>OUTCOMES</div>
          {[['✅ Went well', C.calm, outcomes.well], ['⚡ Partly', C.activated, outcomes.partly], ['📌 Needs work', C.secondary, outcomes.needsWork]]
            .filter(([, , count]) => count > 0)
            .map(([label, color, count]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 90, fontSize: 12, color, fontWeight: 600 }}>{label}</div>
                <div style={{ flex: 1, height: 8, backgroundColor: C.bg, borderRadius: 4 }}>
                  <div style={{ width: `${(count / entries.length) * 100}%`, height: 8, backgroundColor: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color, width: 20, textAlign: 'right' }}>{count}</div>
              </div>
          ))}
        </Card>
      )}

      {topRules.length > 0 && (
        <Card>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 10 }}>MOST PRACTICED RULES</div>
          {topRules.map(r => (
            <div key={r.num} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: RULES_SIMPLE.find(rs => rs.num === r.num)?.color, backgroundColor: C.border + '60', padding: '3px 8px', borderRadius: 8, flexShrink: 0 }}>R{r.num}</span>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.primary }}>{r.name}</div>
              <span style={{ fontSize: 12, color: C.secondary, fontWeight: 600 }}>{r.count}×</span>
            </div>
          ))}
        </Card>
      )}

      <Card style={{ backgroundColor: C.primary + '06', borderColor: C.primary + '20' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>NOTICE</div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>
          Look at your log. What do you notice about your own patterns? What shows up most — and what is missing?
        </div>
      </Card>

      <FacilitatorShareButton summary={buildSummary()} />

    </div>
  );
}

function Module3Quarterly({ navigate }) {
  const [responses, setResponses] = useState({ q1: '', q2: '', q3: '' });
  const [saved, setSaved] = useState(false);

  const questions = [
    { id: 'q1', label: 'PATTERNS', prompt: 'What patterns do you notice in your own behavior when you look back at your entries?' },
    { id: 'q2', label: 'SURPRISE',  prompt: 'What surprised you the most when you reviewed your log?' },
    { id: 'q3', label: 'NEXT FOCUS', prompt: 'What do you want to focus on next?' },
  ];

  const handleSave = () => {
    try {
      const entry = { date: new Date().toLocaleDateString(), ...responses };
      const past = JSON.parse(localStorage.getItem('aof-quarterly') || '[]');
      localStorage.setItem('aof-quarterly', JSON.stringify([entry, ...past].slice(0, 4)));
    } catch(e) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 6000);
  };

  const buildSummary = () => [
    'Quarterly Self-Assessment',
    new Date().toLocaleDateString(),
    '',
    'Patterns I notice:',
    responses.q1 || '(no response)',
    '',
    'What surprised me:',
    responses.q2 || '(no response)',
    '',
    'What I want to focus on next:',
    responses.q3 || '(no response)',
  ].join('\n');

  const allAnswered = questions.every(q => responses[q.id].trim());

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Quarterly Self-Assessment</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 6 }}>
        Do this every 3 months. Look back at your entries and answer honestly.
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: C.interactive + '0C', border: `1px solid ${C.interactive}30`, borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.secondary }}>
        Review your Progress Summary before answering. There are no wrong answers.
      </div>

      {questions.map((q, i) => (
        <Card key={q.id} style={{ borderLeft: `4px solid ${[DC[1], DC[3], C.calm][i]}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: [DC[1], DC[3], C.calm][i], letterSpacing: 0.5, marginBottom: 6 }}>{q.label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, lineHeight: 1.5, marginBottom: 10 }}>{q.prompt}</div>
          <textarea
            value={responses[q.id]}
            onChange={e => setResponses(p => ({ ...p, [q.id]: e.target.value }))}
            placeholder="Write your honest answer here..."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px',
              border: `1.5px solid ${responses[q.id] ? [DC[1], DC[3], C.calm][i] : C.border}`,
              borderRadius: 10, fontSize: 14, color: C.primary,
              fontFamily: 'system-ui', resize: 'none', outline: 'none',
              boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s',
            }}
          />
        </Card>
      ))}

      <Btn label="Save assessment" onClick={handleSave} variant={allAnswered ? 'primary' : 'ghost'} style={{ marginBottom: 4 }} />

      {saved && (
        <>
          <MasteryCard message="You looked at yourself honestly and wrote it down. That takes more courage than most people realize." />
          <FacilitatorShareButton summary={buildSummary()} />
        </>
      )}

    </div>
  );
}

// ─── MODULE 3: RECEIVING HONEST FEEDBACK ──────────────────────────────────────

function Module3Feedback({ navigate }) {
  const [phase, setPhase] = useState('before');
  const [beforeChecks, setBeforeChecks] = useState([]);
  const [heard, setHeard] = useState('');
  const [verify, setVerify] = useState('');
  const [choice, setChoice] = useState('');
  const [saved, setSaved] = useState(false);

  const BEFORE_STEPS = [
    { id: 'grounded', text: 'I am in a settled enough state to hear something that might be hard.' },
    { id: 'willing',  text: 'I am willing to stay present even if what I hear activates me.' },
    { id: 'trusted',  text: 'The person offering this feedback holds a caring role — not a punishing one.' },
  ];

  const DURING_STEPS = [
    { icon: '🫁', color: C.calm,        step: 'Press your feet into the floor right now.', body: 'You are still here. The information is not an attack on who you are.' },
    { icon: '⏸',  color: C.interactive, step: 'Say one word to buy yourself time.',        body: '"Okay." "I hear you." One word. You do not have to respond fully yet.' },
    { icon: '👂', color: C.activated,   step: 'Listen for the behavior — not the verdict.', body: 'What specific thing did they say you did? That is the only piece you need right now.' },
    { icon: '🤐', color: C.secondary,   step: 'Do not explain yet.',                        body: 'Explaining before you have fully heard closes the loop before it opens. Let it land first.' },
  ];

  const buildSummary = () => [
    'Receiving Honest Feedback — After Reflection',
    new Date().toLocaleDateString(),
    '',
    'What behavior was named:',
    heard || '(not recorded)',
    '',
    'What I can verify:',
    verify || '(not recorded)',
    '',
    'What I want to do with this:',
    choice || '(not recorded)',
  ].join('\n');

  const toggleCheck = (id) => setBeforeChecks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  if (phase === 'before') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Receiving Honest Feedback</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 6 }}>
        Use this before, during, or after someone tells you something true about your behavior.
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: C.activated + '0C', border: `1px solid ${C.activated}30`, borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
        This is different from the self-audit. Someone outside you is offering the information. That changes everything.
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: C.interactive + '08', border: `1px solid ${C.interactive}25`, borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.secondary, lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>↩</span>
        <span>Interpreting someone else's behavior first? Use <button onClick={() => navigate('module3-conclude')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.interactive, padding: 0 }}>Before I conclude</button> instead.</span>
      </div>

      <Card style={{ borderLeft: `4px solid ${C.interactive}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.interactive, letterSpacing: 0.4, marginBottom: 8 }}>BEFORE — Check your readiness</div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 14 }}>
          Check each one honestly. You do not have to proceed if you are not ready.
        </div>
        {BEFORE_STEPS.map(s => {
          const checked = beforeChecks.includes(s.id);
          return (
            <button key={s.id} onClick={() => toggleCheck(s.id)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%',
              padding: '10px 0', background: 'none', border: 'none',
              borderBottom: `1px solid ${C.border}`,
              cursor: 'pointer', textAlign: 'left', marginBottom: 2,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{checked ? '☑️' : '⬜'}</span>
              <span style={{ fontSize: 13, color: checked ? C.primary : C.secondary, fontWeight: checked ? 600 : 400, lineHeight: 1.6 }}>{s.text}</span>
            </button>
          );
        })}
      </Card>

      {beforeChecks.length === 3 ? (
        <Btn label="I am ready to receive →" onClick={() => setPhase('during')} variant="calm" style={{ marginTop: 8 }} />
      ) : (
        <div style={{ padding: '10px 14px', backgroundColor: C.primary + '07', borderRadius: 8, marginTop: 8, fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>
          When all three are checked, you can proceed. If one is not true yet — this is not the right moment. That is information too.
        </div>
      )}
    </div>
  );

  if (phase === 'during') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>In the Moment</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        The feedback is arriving. Do these four things — in order. Nothing else is required yet.
      </div>

      {DURING_STEPS.map((s, i) => (
        <Card key={i} style={{ borderLeft: `4px solid ${s.color}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, marginRight: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, lineHeight: 1.4, marginBottom: 6 }}>
                <span style={{ fontSize: 18, marginRight: 8 }}>{s.icon}</span>{s.step}
              </div>
              <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{s.body}</div>
            </div>
            <SpeakButton text={s.step + '. ' + s.body} />
          </div>
        </Card>
      ))}

      <div style={{ padding: '10px 14px', backgroundColor: C.primary + '07', border: `1px solid ${C.primary}15`, borderRadius: 8, marginTop: 4, marginBottom: 14, fontSize: 13, color: C.secondary, lineHeight: 1.7, fontStyle: 'italic' }}>
        If you recognized something true in what you heard — that recognition is the beginning of the work. A behavior can be corrected. A behavior is not who you are.
      </div>

      <Btn label="The conversation is over — process what I heard →" onClick={() => setPhase('after')} variant="primary" style={{ marginBottom: 8 }} />
      <Btn label="← Back" onClick={() => setPhase('before')} variant="ghost" small />
    </div>
  );

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>After — Process What You Heard</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Take your time. This is not a judgment exercise. It is an honest look at what was said.
      </div>

      {[
        { label: 'WHAT BEHAVIOR WAS NAMED?', color: C.interactive, val: heard, set: setHeard, placeholder: 'They said I...', note: 'Write only the behavior — not the judgment, not their tone, not your reaction. Just the specific thing they said you did.' },
        { label: 'WHAT CAN YOU VERIFY?',     color: C.activated,   val: verify, set: setVerify, placeholder: 'I can check...', note: 'Not what you intended — what actually happened. Is there any log entry, message, or memory that could confirm or clarify?' },
        { label: 'WHAT DO YOU WANT TO DO WITH THIS?', color: C.calm, val: choice, set: setChoice, placeholder: 'I want to...', note: 'This is your choice. Possible options: bring to facilitator, work on through a rule, log in bilateral journal, set a goal.' },
      ].map(({ label, color, val, set, placeholder, note }) => (
        <Card key={label} style={{ borderLeft: `4px solid ${color}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 0.4, marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 8 }}>{note}</div>
          <textarea value={val} onChange={e => set(e.target.value)} placeholder={placeholder} rows={2}
            style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${val ? color : C.border}`, borderRadius: 10, fontSize: 14, color: C.primary, fontFamily: 'system-ui', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5, transition: 'border-color 0.15s' }} />
        </Card>
      ))}

      <Btn label="Save reflection" onClick={() => setSaved(true)} variant={heard.trim() ? 'primary' : 'ghost'} style={{ marginBottom: 4 }} />

      {saved && (
        <>
          <MasteryCard message="You received honest feedback and stayed present with it. That is one of the most difficult skills in this entire framework." />
          <FacilitatorShareButton summary={buildSummary()} />
        </>
      )}

      <Btn label="← Back to During" onClick={() => setPhase('during')} variant="ghost" small style={{ marginTop: 8 }} />
    </div>
  );
}

// ─── MODULE 3: THE SIGNAL AND THE SOURCE ──────────────────────────────────────

function Module3Signal({ navigate }) {
  const [openIdx, setOpenIdx] = useState(null);

  const cats = [
    {
      num: 1, label: 'Witnessing', tag: 'Always available', color: C.calm,
      what: 'The other person acknowledges that something is happening in you. They confirm your internal event is real. They do not have to have done anything wrong to offer this.',
      sounds: '"I can see something happened." "I can see you are affected." "Something shifted — I notice that."',
      ask: 'Witnessing is always a reasonable request. It assigns no blame. It confirms that your experience is real in the relational space between you.',
      note: 'Your system generates the experience because it cannot reconcile an incongruence. Witnessing from outside provides confirmation that the signal is real — even when the source is unclear.',
    },
    {
      num: 2, label: 'Empathic recognition', tag: 'Impact without wrongdoing', color: C.interactive,
      what: 'The other person understands that their behavior — not necessarily wrong behavior — landed in a way they did not intend or anticipate.',
      sounds: '"I did not realize how that landed." "I see now that affected you." "That was not my intention, but I can see how it landed."',
      ask: 'Appropriate when the impact was real even if no rule was broken. The other person is acknowledging a gap between their intent and your experience.',
      note: 'Empathic recognition is not the same as accountability. The person is saying "I see what happened" — not "I was wrong."',
    },
    {
      num: 3, label: 'Accountability for actual harm', tag: 'When a rule was broken', color: C.overwhelmed,
      what: 'The other person takes responsibility for behavior that actually violated the relational framework — a rule that was broken, a boundary that was crossed, a deliberate deception.',
      sounds: '"I was wrong to do that." "I crossed a line I knew about." "That was a violation and I own it."',
      ask: 'Only when a specific framework rule was actually broken. Verify first: can you name the specific rule? Can you describe the specific behavior? If the answer to either is unclear, this may not be what this moment requires.',
      note: 'Use the reality-testing tool before requesting this. The combination required is: rule broken + behavior nameable + other person knew the rule.',
    },
    {
      num: 4, label: 'Compliance', tag: 'Not the same as accountability', color: C.secondary,
      what: 'The other person does or says what you need to stop the reaction — not because they harmed you, but because they are managing a situation they feel trapped in.',
      sounds: '"I am sorry." (without knowing what they are apologizing for.) Said to end the situation, not to own a specific act.',
      ask: 'This is not a request you make. It is a pattern to recognize and interrupt. When you identify this happening, the reality-testing tool is the next step.',
      note: 'When accountability is required for events that did not involve actual harm, the other person learns they cannot be fully themselves around you. Over time, they manage your reactions rather than relating to you. That is not friendship.',
    },
  ];

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>The signal and the source</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        When your system activates, four different things can happen next. They are not the same thing. Knowing which one fits changes what you ask for.
      </div>

      {cats.map((cat, i) => (
        <div key={cat.num} style={{ backgroundColor: C.white, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, backgroundColor: cat.color + '14', border: `1px solid ${cat.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: cat.color }}>
              {cat.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.3 }}>{cat.label}</div>
              <span style={{ display: 'inline-block', marginTop: 3, fontSize: 11, fontWeight: 700, color: cat.color, backgroundColor: cat.color + '14', borderRadius: 6, padding: '2px 8px' }}>{cat.tag}</span>
            </div>
            <span style={{ fontSize: 12, color: C.secondary, flexShrink: 0 }}>{openIdx === i ? '▲' : '▼'}</span>
          </button>
          {openIdx === i && (
            <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, marginBottom: 2 }}>
                <SpeakButton text={cat.what + '. ' + cat.sounds + '. ' + cat.ask} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                {[['WHAT IT IS', cat.what, false], ['WHAT IT SOUNDS LIKE', cat.sounds, true], ['WHAT TO DO WITH IT', cat.ask, false]].map(([lbl, val, italic]) => (
                  <div key={lbl}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 4 }}>{lbl}</div>
                    <div style={{ fontSize: 14, color: italic ? C.secondary : C.primary, lineHeight: 1.7, fontStyle: italic ? 'italic' : 'normal' }}>{val}</div>
                  </div>
                ))}
                <div style={{ backgroundColor: cat.color + '08', borderLeft: `3px solid ${cat.color}40`, borderRadius: '0 6px 6px 0', padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, fontStyle: 'italic' }}>{cat.note}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* About relief callout */}
      <div style={{ backgroundColor: C.activated + '0E', border: `1px solid ${C.activated}40`, borderRadius: 12, padding: '14px 16px', marginTop: 4, marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.activated, letterSpacing: 0.5, marginBottom: 8 }}>ABOUT RELIEF</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, marginBottom: 8, lineHeight: 1.4 }}>Relief is not evidence.</div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7 }}>
          When an apology quiets the system — when the shelter goes silent after someone says "I am sorry" — your nervous system received a repair signal. It resolved the incongruence. That is good. It does not mean the other person caused the alarm. The cause of your reaction and the cause of the relief are not the same thing.
        </div>
      </div>

      <button onClick={() => navigate('module3-reality')} style={{ display: 'block', width: '100%', padding: '11px 14px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', border: `1px solid ${C.border}`, backgroundColor: C.interactive + '07', fontSize: 13, fontWeight: 600, color: C.interactive }}>
        🔍 Use the reality-testing tool →
      </button>
    </div>
  );
}

// ─── MODULE 3: REALITY TESTING ────────────────────────────────────────────────

function Module3Reality({ navigate }) {
  const [step, setStep] = useState('q1');
  const [answers, setAnswers] = useState([]);

  const questions = [
    { id: 'q1', text: 'Did the other person do something that violated a specific rule from the framework?', sub: 'Not "did I feel hurt" — did they break a rule you can name.', yes: 'q2', no: 'r1' },
    { id: 'q2', text: 'Can you name the specific behavior — what they did, not how it felt?', sub: 'A behavior is an action. "They said X." "They did Y." Not "they made me feel Z."', yes: 'q3', no: 'r2' },
    { id: 'q3', text: 'Does the other person know about this rule?', sub: 'Have they read the framework? Was this boundary discussed before this interaction?', yes: 'r3', no: 'r4' },
  ];

  const RESULTS = {
    r1: { label: 'Your signal is real. The source may not be who you think.', color: C.activated, body: 'Something is happening in your nervous system. That is true and valid. But the evidence does not point to a rule violation by the other person.', action: 'What you can ask for: witnessing and empathic recognition. Not accountability. Your system may be responding to something unrelated to this person — a similarity, a tone, a previous experience. Use the grounding pause before you respond.', compliance: true },
    r2: { label: 'Activation without a specific cause. More investigation needed.', color: C.activated, body: 'You believe a rule was broken, but you cannot yet name what was done. That matters. Accountability requires a specific behavior — not a feeling, not an interpretation.', action: 'Write down what happened in behavioral terms before the next interaction. "They said ___." "They did ___." If you cannot complete that sentence, the moment is not ready for an accountability conversation.', compliance: true },
    r3: { label: 'Accountability may be appropriate.', color: C.calm, body: 'A rule was broken. You can name the behavior. The other person knew the rule. This is the combination that makes an accountability conversation appropriate.', action: 'What to say: "When you [specific behavior], that was [specific rule]. I want to address it directly." Bring this to your trusted adult first if you are unsure. Use the bilateral repair sequence.', compliance: false },
    r4: { label: 'They may need information, not accountability.', color: C.interactive, body: 'A rule may have been broken, but the other person did not know the rule existed. Accountability requires that someone knew what they were doing. Without that, what they need is information.', action: 'What to say: "I want to share something about how this interaction landed for me." Not "you did something wrong" — "here is something I need you to know." Use the advocacy scripts for specific language.', compliance: false },
  };

  const reset = () => { setStep('q1'); setAnswers([]); };

  const answer = (val) => {
    const q = questions.find(x => x.id === step);
    setAnswers(p => [...p, val ? 'Yes' : 'No']);
    setStep(val ? q.yes : q.no);
  };

  if (RESULTS[step]) {
    const r = RESULTS[step];
    return (
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 16 }}>Reality testing — result</div>
        <div style={{ backgroundColor: r.color + '0C', border: `1.5px solid ${r.color}40`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: r.color, letterSpacing: 0.5, marginBottom: 8 }}>RESULT</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 10, lineHeight: 1.4 }}>{r.label}</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 12 }}>{r.body}</div>
          <div style={{ backgroundColor: C.white, borderRadius: 8, padding: '12px 14px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.7 }}>{r.action}</div>
          </div>
        </div>
        {r.compliance && (
          <Card>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 6 }}>WATCH FOR COMPLIANCE</div>
            <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7 }}>
              If you ask for accountability here, what you will receive is compliance — the other person managing the situation rather than owning actual harm. That distinction matters for what happens to the relationship over time.
            </div>
          </Card>
        )}
        <Btn label="Start again ↺" onClick={reset} variant="ghost" style={{ marginBottom: 8 }} />
        <Btn label="← Back to Signal and Source" onClick={() => navigate('module3-signal')} variant="ghost" small />
      </div>
    );
  }

  const q = questions.find(x => x.id === step);
  const qNum = ['q1','q2','q3'].indexOf(step) + 1;

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Reality testing</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Three questions. Answer honestly — not how you want the answer to be.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: `${(qNum/3)*100}%`, height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>Q{qNum} of 3</span>
      </div>
      {answers.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {answers.map((a, i) => <span key={i} style={{ fontSize: 11, backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 10px', color: C.secondary }}>Q{i+1}: {a}</span>)}
        </div>
      )}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ flex: 1, marginRight: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.5, marginBottom: 6 }}>{q.text}</div>
            <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{q.sub}</div>
          </div>
          <SpeakButton text={q.text + '. ' + q.sub} />
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button onClick={() => answer(true)} style={{ flex: 1, padding: 12, borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, backgroundColor: C.calm + '14', border: `1.5px solid ${C.calm}`, color: C.calm }}>Yes</button>
        <button onClick={() => answer(false)} style={{ flex: 1, padding: 12, borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, backgroundColor: C.overwhelmed + '10', border: `1.5px solid ${C.overwhelmed}`, color: C.overwhelmed }}>No</button>
      </div>
    </div>
  );
}

// ─── MODULE 3: ADVOCACY SCRIPTS ──────────────────────────────────────────────

function Module3Scripts({ navigate }) {
  const [situation, setSituation] = useState(null);
  const [copied, setCopied] = useState(null);

  const SITUATIONS = [
    { id: 'shift', icon: '📡', label: 'Something shifted and I need to name it', scripts: [
      "I want to tell you that something shifted in me just now. I am not sure what caused it. I am not saying you did anything wrong. I just need you to know it happened.",
      "Something is happening in my nervous system right now. I am okay. I just need a moment before we continue.",
      "I can feel my system activating. I want to stay in this conversation. Can we slow down for a second?",
    ]},
    { id: 'witness', icon: '👁️', label: 'I need you to witness what is happening', scripts: [
      "I am not asking you to apologize or explain anything. I just need you to acknowledge that something is happening for me right now.",
      "Can you just say that you can see I am affected? That is all I need right now.",
      "I need you to know this is real for me, even if you are not sure why.",
    ]},
    { id: 'landed', icon: '💬', label: 'What you said landed differently than you may have intended', scripts: [
      "I want to tell you that something you said landed in a way I did not expect. I am not saying you meant it that way. I just want you to know.",
      "Something you said hit me differently. I do not think it was your intention. Can I tell you what I experienced?",
      "I am going to share how something landed for me. I am sharing information, not making an accusation.",
    ]},
    { id: 'pause', icon: '⏸', label: 'I need to pause this interaction', scripts: [
      "I need to stop here. I am not ending this. I need to reset and come back to it.",
      "Can we pause? I want to give this conversation what it deserves and I cannot do that right now.",
      "I need to step back from this for now. This is not about you. I will come back to this.",
    ]},
    { id: 'return', icon: '↩️', label: 'I want to return to something that happened', scripts: [
      "I want to come back to what happened earlier. I was not in a good state to respond at the time. Can we try again?",
      "I have had time to think about what happened between us. I would like to address it when you are ready.",
      "Something from our last interaction stayed with me. I want to talk about it when the time is right for both of us.",
    ]},
  ];

  const copy = async (text, idx) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else { const el = document.createElement('textarea'); el.value = text; el.style.cssText = 'position:fixed;opacity:0;'; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
      setCopied(idx); setTimeout(() => setCopied(null), 3000);
    } catch(e) {}
  };

  if (!situation) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Advocacy scripts</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Scripts for communicating your experience without demanding a specific response. Tap a situation to see language you can use.
      </div>
      {SITUATIONS.map(s => (
        <button key={s.id} onClick={() => setSituation(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 16px', marginBottom: 8, borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.primary, lineHeight: 1.4, flex: 1 }}>{s.label}</span>
          <span style={{ fontSize: 14, color: C.secondary }}>›</span>
        </button>
      ))}
    </div>
  );

  const sit = SITUATIONS.find(s => s.id === situation);
  return (
    <div style={{ paddingTop: 8 }}>
      <button onClick={() => { setSituation(null); setCopied(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.interactive, marginBottom: 14 }}>← Back</button>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 4 }}>{sit.icon} {sit.label}</div>
      <div style={{ fontSize: 12, color: C.secondary, marginBottom: 16 }}>Tap any script to copy it. Edit before sending — these are starting points, not final words.</div>
      {sit.scripts.map((script, i) => (
        <div key={i} style={{ backgroundColor: C.white, border: `1px solid ${copied === i ? C.calm : C.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 10 }}>{script}</div>
          <button onClick={() => copy(script, i)} style={{ padding: '7px 14px', borderRadius: 8, cursor: 'pointer', backgroundColor: copied === i ? C.calm + '14' : C.bg, border: `1px solid ${copied === i ? C.calm : C.border}`, fontSize: 12, fontWeight: 700, color: copied === i ? C.calm : C.secondary }}>
            {copied === i ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── MODULE 3: BILATERAL REPAIR SEQUENCE ─────────────────────────────────────

function Module3Repair({ navigate }) {
  const [path, setPath] = useState(null);
  const [step, setStep] = useState(0);

  const PATHS = {
    mine: { label: 'I violated a rule', color: C.overwhelmed, steps: [
      { title: 'Name the behavior', body: 'Write down what you did specifically — not how you felt, not your intention. One sentence: "I [specific action]." Behavior only.' },
      { title: 'Name the rule', body: 'Which rule from the framework does this map to? Go to The Framework if you need to check. The behavior and the rule must both be nameable before proceeding.' },
      { title: 'Wait 24 hours', body: 'Do not initiate the repair conversation while either of you is still activated. 24 hours is the minimum. This is Rule 6 applied to repair.' },
      { title: 'Initiate with permission', body: '"I want to address something I did in our last interaction. Is now a good time?" Wait for the answer. Do not begin until they confirm readiness.' },
      { title: 'Name it directly', body: '"I [specific behavior]. That violated [specific rule]. I want to own that." Stop there. Do not explain why. Do not reframe. Let it land.' },
      { title: 'Accept the response', body: 'Take whatever comes — silence, acknowledgment, or continued hurt. Do not argue. Do not re-explain. One clear statement of accountability, then listen.' },
      { title: 'Adjust and close', body: 'Ask if there is anything they need going forward. Close with a closing statement (Rule 9). Do not re-open unless they initiate.' },
    ]},
    theirs: { label: 'They violated a rule', color: C.interactive, steps: [
      { title: 'Run the reality-testing tool first', body: 'Before any conversation, complete the reality-testing tool. If the result is not "accountability may be appropriate," stop here and follow that result instead.' },
      { title: 'Wait until both are regulated', body: 'Check your own regulation state. Check theirs. A repair conversation from an activated state will not produce what you need.' },
      { title: 'Initiate with permission', body: '"I want to address something that happened in our last interaction. Is now a good time?" Wait. Do not begin until they confirm.' },
      { title: 'Name the behavior', body: '"When you [specific behavior], that was [specific rule]." One sentence. Behavior first, rule second. Not "you made me feel" — "you did X which is Y."' },
      { title: 'Name what you need', body: '"What I need from you is [witnessing / empathic recognition / accountability for actual harm]." Be specific. Use the language from the signal-and-source tool.' },
      { title: 'Accept the response', body: 'Take whatever comes. If they respond with defensiveness, state your need once more and close. Do not repeat the conversation more than twice.' },
      { title: 'Bring to trusted adult if unresolved', body: 'If the behavior continues or repair does not happen, Rule 13 applies: bring this pattern to your trusted adult before attempting another direct conversation.' },
    ]},
    both: { label: 'We both contributed', color: DC[4], steps: [
      { title: 'Run the reality-testing tool for your own conduct first', body: 'Complete the reality-testing sequence for what you did before addressing theirs. Your conduct is evaluated first — that is the bilateral principle applied to repair.' },
      { title: 'Write both sides separately', body: 'On one side: what you did specifically. On the other: what they did specifically. Keep them separate on paper before you bring them into conversation.' },
      { title: 'Acknowledge yours before addressing theirs', body: 'In the conversation, name your contribution first. This demonstrates the standard you are asking them to meet.' },
      { title: 'Use the bilateral frame', body: '"I want to address something I did, and also something I experienced from your side." Name yours. Then name theirs. Keep them in separate sentences.' },
      { title: 'Do not conflate them', body: 'Your violation does not cancel theirs. Theirs does not cancel yours. Each is accounted for separately. Do not allow the conversation to become a trade.' },
      { title: 'Accept whatever comes on each side', body: 'They may accept accountability for their part. They may not. Your repair of your own conduct is not contingent on theirs.' },
    ]},
  };

  if (!path) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Bilateral repair sequence</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 20 }}>
        Use this after an interaction went wrong. Choose the path that matches what happened.
      </div>
      {Object.entries(PATHS).map(([id, p]) => (
        <button key={id} onClick={() => { setPath(id); setStep(0); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 10, borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${p.color}`, cursor: 'pointer' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, marginBottom: 2 }}>{p.label}</div>
          <div style={{ fontSize: 11, color: C.secondary }}>{p.steps.length} steps</div>
        </button>
      ))}
    </div>
  );

  const p = PATHS[path];
  const s = p.steps[step];
  const isLast = step === p.steps.length - 1;

  return (
    <div style={{ paddingTop: 8 }}>
      <button onClick={() => setPath(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.interactive, marginBottom: 14 }}>← Back</button>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 12 }}>{p.label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: `${((step+1)/p.steps.length)*100}%`, height: 4, backgroundColor: p.color, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary, whiteSpace: 'nowrap' }}>Step {step+1} of {p.steps.length}</span>
      </div>
      <Card style={{ borderLeft: `4px solid ${p.color}`, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, marginRight: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: p.color, letterSpacing: 0.5, marginBottom: 8 }}>STEP {step+1}</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.primary, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</div>
            <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.7 }}>{s.body}</div>
          </div>
          <SpeakButton text={s.title + '. ' + s.body} />
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && <button onClick={() => setStep(v => v-1)} style={{ flex: 1, padding: 12, borderRadius: 8, cursor: 'pointer', border: `1px solid ${C.border}`, backgroundColor: C.white, fontSize: 13, fontWeight: 600, color: C.secondary }}>← Previous</button>}
        {!isLast
          ? <button onClick={() => setStep(v => v+1)} style={{ flex: 1, padding: 12, borderRadius: 8, cursor: 'pointer', border: 'none', backgroundColor: p.color, color: '#fff', fontSize: 13, fontWeight: 700 }}>Next step →</button>
          : <div style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: C.calm + '14', border: `1px solid ${C.calm}`, textAlign: 'center', fontSize: 13, fontWeight: 700, color: C.calm }}>Sequence complete ✓</div>
        }
      </div>
    </div>
  );
}

// ─── MODULE 3: CONTROLLED DISCLOSURE ─────────────────────────────────────────

function Module3Disclosure({ navigate }) {
  const [ring, setRing] = useState(null);
  const [copied, setCopied] = useState(false);

  const LEVELS = {
    2: { label: 'Acquaintance (Ring 2)', level: 'Minimal disclosure', color: C.secondary,
      desc: 'Enough to explain a pause or brief withdrawal without sharing personal detail.',
      script: "I sometimes need a moment to process in conversations. It is not about you. I will be right back.",
      note: 'This level names a need without naming a condition. It is appropriate for professional contacts and people you interact with regularly but have not established trust with.',
    },
    3: { label: 'Casual friend (Ring 3)', level: 'Functional disclosure', color: C.interactive,
      desc: 'Enough to explain your experience in ways that support continued interaction.',
      script: "I want to tell you something that might help you understand me better. I have a condition that makes some social information feel very intense. When I go quiet suddenly, I need a moment. It does not mean I am upset with you.",
      note: 'This level names a functional impact without clinical detail. It invites understanding without requiring the listener to hold a complex account.',
    },
    4: { label: 'Friend (Ring 4)', level: 'Contextual disclosure', color: C.activated,
      desc: 'Enough for the person to understand your experience and adjust naturally.',
      script: "I want to share something about how I experience conversations, because I think it will help us. When something does not add up for me in an interaction — a tone that does not match words, something that feels off — my nervous system responds intensely. I am not choosing it. It builds during the conversation and usually recedes when the incongruence resolves. What helps most: acknowledge what you see happening in me, do not ask me to explain it in the moment, and give me a moment if I go quiet.",
      note: 'This level describes the experience in functional terms and includes what helps. It is appropriate for people who have demonstrated they can hold information about you with care.',
    },
    5: { label: 'Trusted friend (Ring 5)', level: 'Full disclosure', color: C.calm,
      script: null,
      desc: 'Your own account of the experience, in your own words, shared with someone who has earned that level of access.',
      note: 'At this level, the words are yours. The framework does not write them. Use the language you have developed with your facilitator — the words that are true to your experience, not a clinical description of it.',
    },
  };

  const copy = async (text) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else { const el = document.createElement('textarea'); el.value = text; el.style.cssText = 'position:fixed;opacity:0;'; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
      setCopied(true); setTimeout(() => setCopied(false), 3000);
    } catch(e) {}
  };

  if (!ring) return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Controlled disclosure</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 6 }}>
        Who you share your experience with, and how much, is your decision. Not everyone in your life needs the same level of information.
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: C.calm + '0C', border: `1px solid ${C.calm}30`, borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
        The framework does not require disclosure to anyone. This is a tool for when you choose to share.
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 10 }}>WHO ARE YOU DISCLOSING TO?</div>
      {Object.entries(LEVELS).map(([r, l]) => (
        <button key={r} onClick={() => { setRing(parseInt(r)); setCopied(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 8, borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, borderLeft: `4px solid ${l.color}`, cursor: 'pointer' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: l.color, marginBottom: 3 }}>RING {r}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.primary, marginBottom: 2 }}>{l.label}</div>
          <div style={{ fontSize: 12, color: C.secondary }}>{l.level}</div>
        </button>
      ))}
    </div>
  );

  const l = LEVELS[ring];
  return (
    <div style={{ paddingTop: 8 }}>
      <button onClick={() => setRing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: C.interactive, marginBottom: 14 }}>← Back</button>
      <div style={{ fontSize: 11, fontWeight: 700, color: l.color, letterSpacing: 0.5, marginBottom: 4 }}>RING {ring} — {l.level.toUpperCase()}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, marginBottom: 6 }}>{l.label}</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>{l.desc}</div>
      {l.script ? (
        <Card style={{ borderLeft: `4px solid ${l.color}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 8 }}>SUGGESTED SCRIPT</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 12 }}>{l.script}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SpeakButton text={l.script} />
            <button onClick={() => copy(l.script)} style={{ padding: '7px 14px', borderRadius: 8, cursor: 'pointer', backgroundColor: copied ? C.calm + '14' : C.bg, border: `1px solid ${copied ? C.calm : C.border}`, fontSize: 12, fontWeight: 700, color: copied ? C.calm : C.secondary }}>
              {copied ? '✓ Copied' : '📋 Copy script'}
            </button>
          </div>
        </Card>
      ) : (
        <Card style={{ borderLeft: `4px solid ${l.color}`, backgroundColor: C.primary + '06' }}>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.7 }}>
            At this level, the words are yours. The framework does not write them for you. Use the language you have developed with your facilitator — the words that are true to your experience, not a clinical description of it.
          </div>
        </Card>
      )}
      <div style={{ padding: '10px 14px', backgroundColor: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, marginTop: 12, fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>{l.note}</div>
    </div>
  );
}

// ─── MODULE 3: BEFORE I CONCLUDE ─────────────────────────────────────────────

function Module3Conclude({ navigate }) {
  const [behavior, setBehavior] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [alternatives, setAlternatives] = useState(['', '', '']);
  const [step, setStep] = useState('intro');

  const setAlt = (idx, val) => setAlternatives(p => p.map((v, i) => i === idx ? val : v));
  const allAltsFilledIn = alternatives.every(a => a.trim().length > 0);
  const altCount = alternatives.filter(a => a.trim().length > 0).length;

  if (step === 'intro') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 4 }}>Before I conclude</div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 6 }}>
        Use this before you act on an interpretation of someone's behavior.
      </div>
      <div style={{ padding: '8px 12px', backgroundColor: C.activated + '0C', border: `1px solid ${C.activated}30`, borderRadius: 8, marginBottom: 16, fontSize: 12, color: C.secondary, lineHeight: 1.6 }}>
        Your system may have already concluded. This tool asks you to check that conclusion before you act on it.
      </div>
      <Card>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>You will name the behavior, name your interpretation, and then generate three alternative explanations for the same behavior. Three steps. No right or wrong answers.</div>
      </Card>
      <Btn label="Begin →" onClick={() => setStep('behavior')} variant="primary" style={{ marginTop: 8 }} />
    </div>
  );

  if (step === 'behavior') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: '33%', height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary }}>Step 1 of 3</span>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4 }}>WHAT DID THEY DO?</div>
          <SpeakButton text="Name only the behavior — one sentence. What they said or did. Not how it felt. Not what you think it means." />
        </div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 12 }}>Name only the behavior — one sentence. What they said or did. Not how it felt. Not what you think it means.</div>
        <textarea value={behavior} onChange={e => setBehavior(e.target.value)} placeholder="They..." rows={2}
          style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${behavior ? C.interactive : C.border}`, borderRadius: 10, fontSize: 14, color: C.primary, fontFamily: 'system-ui', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
      </Card>
      <Btn label="Next →" onClick={() => setStep('interpretation')} variant={behavior.trim() ? 'primary' : 'ghost'} />
    </div>
  );

  if (step === 'interpretation') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: '66%', height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary }}>Step 2 of 3</span>
      </div>
      <Card style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>THE BEHAVIOR</div>
        <div style={{ fontSize: 13, color: C.secondary, fontStyle: 'italic' }}>{behavior}</div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4 }}>WHAT DO YOU THINK IT MEANS?</div>
          <SpeakButton text="Name your interpretation honestly. This is not about whether you are right — it is about making the interpretation visible so you can examine it." />
        </div>
        <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 12 }}>Name your interpretation honestly. This is not about whether you are right — it is about making the interpretation visible so you can examine it.</div>
        <textarea value={interpretation} onChange={e => setInterpretation(e.target.value)} placeholder="I think it means..." rows={2}
          style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${interpretation ? C.activated : C.border}`, borderRadius: 10, fontSize: 14, color: C.primary, fontFamily: 'system-ui', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
      </Card>
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <Btn label="← Back" onClick={() => setStep('behavior')} variant="ghost" small />
        <Btn label="Next →" onClick={() => setStep('alternatives')} variant={interpretation.trim() ? 'primary' : 'ghost'} />
      </div>
    </div>
  );

  if (step === 'alternatives') return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 4, backgroundColor: C.border, borderRadius: 2 }}>
          <div style={{ width: '100%', height: 4, backgroundColor: C.interactive, borderRadius: 2 }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.secondary }}>Step 3 of 3</span>
      </div>
      <Card style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 4 }}>BEHAVIOR</div>
        <div style={{ fontSize: 13, color: C.secondary, fontStyle: 'italic', marginBottom: 8 }}>{behavior}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 4 }}>YOUR INTERPRETATION</div>
        <div style={{ fontSize: 13, color: C.secondary, fontStyle: 'italic' }}>{interpretation}</div>
      </Card>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4 }}>THREE OTHER EXPLANATIONS</div>
          <SpeakButton text="Name three other explanations for the same behavior that do not involve intent to harm. They do not have to be probable. They only have to be possible." />
        </div>
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6, marginBottom: 14 }}>
          Name three other explanations for the same behavior that do not involve intent to harm. They do not have to be probable. They only have to be possible.
        </div>
        {alternatives.map((alt, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 4 }}>EXPLANATION {i+1}</div>
            <textarea value={alt} onChange={e => setAlt(i, e.target.value)} placeholder="They may have..." rows={2}
              style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${alt ? C.calm : C.border}`, borderRadius: 10, fontSize: 14, color: C.primary, fontFamily: 'system-ui', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
          </div>
        ))}
      </Card>

      {allAltsFilledIn && (
        <div style={{ backgroundColor: C.calm + '0E', border: `1px solid ${C.calm}40`, borderRadius: 10, padding: '12px 14px', marginTop: 4, marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.calm, marginBottom: 6 }}>You named three alternatives.</div>
          <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7 }}>
            Does your original interpretation still seem most likely? If yes — run the reality-testing tool before you act on it. If you are less certain — that uncertainty is information. Start with witnessing, not accountability.
          </div>
        </div>
      )}

      {altCount >= 1 && !allAltsFilledIn && (
        <div style={{ fontSize: 12, color: C.secondary, marginTop: 4, padding: '6px 0' }}>
          {3 - altCount} more to go.
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <Btn label="← Back" onClick={() => setStep('interpretation')} variant="ghost" small />
        {allAltsFilledIn && <Btn label="Run reality test →" onClick={() => navigate('module3-reality')} variant="calm" />}
      </div>
    </div>
  );

  return null;
}

// ─── OLD MODULE 4 SCREENS LABEL (kept for reference) ──────────────────────────

function Module4Home({ navigate }) {
  const tools = [
    { id: 'module4-scenarios',  icon: '🃏', title: 'Scenario Cards',       desc: '8 practice scenarios with three levels of support.', badge: 'Bilateral practice' },
    { id: 'module4-trivia',     icon: '🧠', title: 'Rule Trivia',           desc: '12 questions across three levels of difficulty.', badge: 'Knowledge check' },
    { id: 'module4-flashcards', icon: '📚', title: 'Flashcard Deck',        desc: 'All 24 definitions. Flip through each one and rate yourself.', badge: 'Definition review' },
    { id: 'module4-generator',  icon: '✨', title: 'Scenario Generator',    desc: 'Describe a real situation. Get a practice scenario built around it.', badge: 'Template-based' },
  ];

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 16 }}>
        Try out the rules through practice. Choose a tool for what you need today.
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
        {[['scaffolded', 'More help'], ['supported', 'Some help'], ['independent', 'No help']].map(([v, l]) => (
          <button key={v} onClick={() => setLevel(v)} style={{ flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${level === v ? C.interactive : C.border}`, backgroundColor: level === v ? C.interactive + '10' : 'transparent', color: level === v ? C.interactive : C.secondary, fontSize: 11, fontWeight: level === v ? 700 : 400, textAlign: 'center' }}>{l}</button>
        ))}
      </div>

      {/* Scenario */}
      <Card style={{ borderLeft: `4px solid ${diffColor[selected.difficulty] || C.interactive}` }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          {selected.tags.map(t => <span key={t} style={{ fontSize: 10, fontWeight: 700, color: C.interactive, backgroundColor: C.interactive + '14', padding: '2px 8px', borderRadius: 10 }}>{t}</span>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.primary, flex: 1, marginRight: 8 }}>{selected.title}</div>
          <SpeakButton text={selected.title + '. ' + selected.text} />
        </div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{selected.text}</div>
      </Card>

      {/* Scaffolded hint */}
      {level === 'scaffolded' && (
        <Card style={{ backgroundColor: DC[1] + '08', borderColor: DC[1] + '40' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[1], letterSpacing: 0.4, marginBottom: 6 }}>HINT — Rules {selected.rules.join(' + ')}</div>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.6 }}>{selected.scaffold}</div>
        </Card>
      )}
      {level === 'supported' && (
        <Card style={{ backgroundColor: DC[3] + '08', borderColor: DC[3] + '40' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[3], letterSpacing: 0.4, marginBottom: 6 }}>HINT</div>
          <div style={{ fontSize: 13, color: C.primary }}>This scenario involves a rule from the <strong>{selected.clusterHint}</strong> cluster. Identify the specific rule(s).</div>
        </Card>
      )}

      {/* Outward analysis questions */}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 8 }}>QUESTIONS</div>
      {selected.analysis.slice(0, 3).map((q, i) => (
        <div key={i} style={{ padding: '10px 12px', borderLeft: `3px solid ${C.border}`, borderRadius: '0 8px 8px 0', marginBottom: 8, backgroundColor: C.white }}>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>{i + 1}. {q}</div>
        </div>
      ))}

      {/* Bilateral turn — explicit, weighted equally to journal/audit */}
      {selected.analysis.length > 3 && (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: DC[4], letterSpacing: 0.4, marginBottom: 6 }}>YOUR TURN</div>
          <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic' }}>
            Now look at your own behavior. The same rules apply to what you do.
          </div>
          <div style={{ padding: '10px 12px', borderLeft: `3px solid ${DC[4]}`, backgroundColor: DC[4] + '08', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: 13, color: DC[4], fontWeight: 700, lineHeight: 1.5 }}>{selected.analysis[3]}</div>
          </div>
          <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6, marginTop: 8, padding: '8px 12px', backgroundColor: C.primary + '06', borderRadius: 8, fontStyle: 'italic' }}>
            If you recognized yourself in this scenario — that recognition is the beginning of the work. A behavior can be corrected. A behavior is not who you are.
          </div>
        </div>
      )}

      {/* Reveal answer */}
      {!revealed ? (
        <Btn label="Reveal framework answer" onClick={() => setRevealed(true)} variant="secondary" style={{ marginBottom: 8 }} />
      ) : (
        <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4, marginBottom: 6 }}>FRAMEWORK ANSWER</div>
          <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7 }}>{selected.scaffold}</div>
          <div style={{ marginTop: 10, padding: '8px 10px', backgroundColor: DC[4] + '10', borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: DC[4], letterSpacing: 0.4, marginBottom: 4 }}>YOUR REFLECTION</div>
            <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5 }}>{selected.bilateral}</div>
          </div>
        </Card>
      )}

      {/* Generalization bridge */}
      <div style={{ padding: 12, backgroundColor: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4, marginBottom: 6 }}>THINK ABOUT THIS</div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6, fontStyle: 'italic' }}>{selected.generalization}</div>
        <div style={{ fontSize: 12, color: C.secondary, marginTop: 6 }}>You do not have to write an answer. Just notice.</div>
      </div>

      <Btn label="← Back to scenario library" onClick={() => setSelected(null)} variant="ghost" small style={{ marginTop: 12 }} />
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 14, color: C.secondary, lineHeight: 1.6, marginBottom: 12 }}>
        Pick a scenario. Choose your level of support before you open it.
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[['scaffolded', 'More help'], ['supported', 'Some help'], ['independent', 'No help']].map(([v, l]) => (
          <button key={v} onClick={() => setLevel(v)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer', border: `1.5px solid ${level === v ? C.interactive : C.border}`, backgroundColor: level === v ? C.interactive + '10' : 'transparent', color: level === v ? C.interactive : C.secondary, fontSize: 12, fontWeight: level === v ? 700 : 400, textAlign: 'center' }}>{l}</button>
        ))}
      </div>

      {pausing && (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 14, color: C.secondary, marginBottom: 8 }}>Take one breath before you begin.</div>
          <div style={{ fontSize: 13, color: C.secondary }}>The scenario will load in a moment.</div>
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
          The questions that surprised you are the ones most worth revisiting. Note them for your next session.
        </div>
      </Card>
      <MasteryCard message="You worked through the full deck. Recall under pressure is how rules become automatic — not just understood." />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: current.rule > 0 ? 6 : 0 }}>
          {current.rule > 0
            ? <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 0.4 }}>Rule {current.rule}</div>
            : <div />}
          <SpeakButton text={current.q} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.primary, lineHeight: 1.5 }}>{current.q}</div>
      </Card>

      {!revealed ? (
        <Btn label="Reveal answer" onClick={() => setRevealed(true)} variant="secondary" style={{ marginBottom: 8 }} />
      ) : (
        <div>
          <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.4 }}>ANSWER</div>
              <SpeakButton text={current.a + '. ' + current.explanation} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.primary, lineHeight: 1.6, marginBottom: 10 }}>{current.a}</div>
            <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>{current.explanation}</div>
          </Card>
          <div style={{ padding: 10, backgroundColor: DC[4] + '08', borderRadius: 10, border: `1px solid ${DC[4] + '40'}`, marginBottom: 12, fontSize: 13, color: C.primary, lineHeight: 1.6 }}>
            If this answer surprised you — mark this question. Surprising answers are the most valuable ones.
          </div>
          <Btn label={qIdx < questions.length - 1 ? 'Next question →' : 'Complete deck →'} onClick={next} variant="primary" />
        </div>
      )}
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
      <MasteryCard message="You reviewed all 24 definitions — the vocabulary the rules are built on. The terms you marked Not yet are your next targets. The terms you marked Not yet are your next targets." />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: DC[term.domainNum], letterSpacing: 0.4 }}>PLAIN LANGUAGE</div>
              <SpeakButton text={term.plain + '. ' + term.boundary.split('.')[0] + '.'} />
            </div>
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
    </div>
  );

  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.primary, marginBottom: 6 }}>Scenario Generator</div>
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

    </div>
  );
}



// ─── TERM POPUP ───────────────────────────────────────────────────────────────

function TermPopup({ termId, onClose, onNavigate }) {
  const term = TERMS.find(t => t.id === termId);
  if (!term) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 250,
        backgroundColor: 'rgba(26,39,68,0.55)',
        display: 'flex', alignItems: 'flex-end',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', backgroundColor: C.white,
          borderRadius: '20px 20px 0 0',
          padding: '20px 20px 28px',
          boxShadow: '0 -6px 32px rgba(26,39,68,0.18)',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, margin: '0 auto 16px' }} />

        {/* Term identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            backgroundColor: DC[term.domainNum] + '18',
            border: `1.5px solid ${DC[term.domainNum]}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>{term.metaphor.symbol}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 3 }}>{term.name}</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: DC[term.domainNum], backgroundColor: DC[term.domainNum] + '18', padding: '2px 8px', borderRadius: 10 }}>
              {DOMAIN_LABELS[term.domainNum]}
            </span>
          </div>
        </div>

        {/* Plain definition */}
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.7, marginBottom: 10 }}>
          {term.plain}
        </div>

        {/* Boundary clause */}
        <div style={{ fontSize: 12, color: C.secondary, lineHeight: 1.6, marginBottom: 18, padding: '8px 12px', backgroundColor: C.bg, borderRadius: 8 }}>
          <span style={{ fontWeight: 700 }}>Limit: </span>{term.boundary}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onNavigate} style={{
            flex: 1, padding: '13px', borderRadius: 10, cursor: 'pointer', border: 'none',
            backgroundColor: C.interactive, color: '#fff', fontWeight: 700, fontSize: 14,
            boxShadow: '0 3px 10px rgba(61,95,200,0.3)',
          }}>See full definition →</button>
          <button onClick={onClose} style={{
            padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
            border: `1px solid ${C.border}`, backgroundColor: 'transparent',
            color: C.secondary, fontWeight: 600, fontSize: 13,
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── FACILITATOR SHARE ────────────────────────────────────────────────────────

function FacilitatorShareButton({ summary }) {
  const [state, setState] = useState('idle'); // idle | copied | error

  const handleShare = async () => {
    const formatted = [
      'THE ART OF FRIENDSHIP — Facilitator Note',
      new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      '',
      summary,
      '',
      '— The Art of Friendship · catrinawright.github.io/art-of-friendship',
    ].join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const el = document.createElement('textarea');
        el.value = formatted;
        el.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setState('copied');
      setTimeout(() => setState('idle'), 4500);
    } catch (e) {
      setState('error');
      setTimeout(() => setState('idle'), 4500);
    }
  };

  return (
    <div style={{
      backgroundColor: '#F4F0FA', border: `1px solid ${C.secondary}28`,
      borderRadius: 12, padding: '12px 14px', marginTop: 10,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: 0.5, marginBottom: 6 }}>
        FACILITATOR SHARE
      </div>
      {state === 'idle' && (
        <>
          <div style={{ fontSize: 13, color: C.primary, lineHeight: 1.5, marginBottom: 10 }}>
            Copy a summary to share with your facilitator by text, email, or message.
          </div>
          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
            backgroundColor: C.primary, border: 'none',
            color: '#fff', fontWeight: 700, fontSize: 13,
          }}>📋 Copy summary to clipboard</button>
        </>
      )}
      {state === 'copied' && (
        <div style={{ fontSize: 14, fontWeight: 700, color: C.calm, lineHeight: 1.5 }}>
          ✓ Copied — paste into a message to your facilitator.
        </div>
      )}
      {state === 'error' && (
        <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>
          Could not copy automatically. Take a screenshot of this screen to share with your facilitator.
        </div>
      )}
    </div>
  );
}

// ─── MASTERY CARD ─────────────────────────────────────────────────────────────

function MasteryCard({ message }) {
  return (
    <div style={{
      backgroundColor: C.calm + '14',
      border: `1.5px solid ${C.calm}45`,
      borderRadius: 12, padding: '12px 14px',
      marginTop: 10, marginBottom: 4,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.calm, letterSpacing: 0.5, marginBottom: 5 }}>
        COMPETENCY ACKNOWLEDGMENT
      </div>
      <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6 }}>{message}</div>
    </div>
  );
}

// ─── SPEAK BUTTON ─────────────────────────────────────────────────────────────

function SpeakButton({ text }) {
  const [state, setState] = useState('idle');
  const handle = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    if (state === 'playing') {
      window.speechSynthesis.cancel();
      setState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.pitch = 1.0; u.volume = 1.0;
    u.onstart = () => setState('playing');
    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');
    setState('playing');
    window.speechSynthesis.speak(u);
  };
  return (
    <button onClick={handle} style={{
      background: 'none',
      border: `1px solid ${state === 'playing' ? C.overwhelmed : C.border}`,
      borderRadius: 6, padding: '3px 9px', cursor: 'pointer',
      fontSize: 11, color: state === 'playing' ? C.overwhelmed : C.secondary,
      fontWeight: 600, flexShrink: 0, lineHeight: 1.4,
    }}>{state === 'playing' ? '⏹' : '🔊'}</button>
  );
}

// ─── GOAL STRIP ───────────────────────────────────────────────────────────────

function GoalStrip({ goal, onEdit }) {
  if (!goal) return null;
  return (
    <div style={{
      backgroundColor: C.calm + '14',
      borderBottom: `1px solid ${C.calm}28`,
      padding: '5px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0, minHeight: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, flexShrink: 0 }}>🎯</span>
        <div style={{ fontSize: 12, color: C.primary, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 700, color: C.calm }}>This week: </span>
          <span>{goal}</span>
        </div>
      </div>
      <button onClick={onEdit} style={{
        flexShrink: 0, marginLeft: 8, background: 'none', border: 'none',
        cursor: 'pointer', fontSize: 11, fontWeight: 700, color: C.calm, padding: '2px 4px',
      }}>Edit</button>
    </div>
  );
}

// ─── GOAL EDITOR ──────────────────────────────────────────────────────────────

function GoalEditor({ goal, onSave }) {
  const [editing, setEditing] = useState(!goal);
  const [draft, setDraft] = useState(goal || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCluster, setActiveCluster] = useState('Before');

  const clusterColors = { Before: DC[1], During: DC[3], After: DC[4], Periodic: DC[5], Checklist: C.interactive };
  const filtered = GOAL_SUGGESTIONS.filter(s => s.cluster === activeCluster);

  if (!editing && goal) {
    return (
      <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.5, marginBottom: 6 }}>
          THIS WEEK'S GOAL
        </div>
        <div style={{ fontSize: 14, color: C.primary, lineHeight: 1.6, marginBottom: 8 }}>{goal}</div>
        <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: C.calm }}>
          Change goal →
        </button>
      </Card>
    );
  }

  return (
    <Card style={{ borderLeft: `4px solid ${C.calm}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.calm, letterSpacing: 0.5, marginBottom: 4 }}>
        {goal ? 'CHANGE THIS WEEK\'S GOAL' : 'SET YOUR GOAL FOR THIS WEEK'}
      </div>
      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.5, marginBottom: 10 }}>
        Which rule do you want to practice this week?
      </div>

      {/* Suggestions toggle */}
      <button
        onClick={() => setShowSuggestions(s => !s)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
          background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          color: showSuggestions ? C.calm : C.secondary,
          backgroundColor: showSuggestions ? C.calm + '10' : 'transparent',
        }}
      >
        <span>💡</span>
        <span>{showSuggestions ? 'Hide suggestions' : 'Need an idea? See suggested goals'}</span>
        <span style={{ fontSize: 10, marginLeft: 2 }}>{showSuggestions ? '▲' : '▼'}</span>
      </button>

      {showSuggestions && (
        <div style={{ marginBottom: 12, padding: '12px', backgroundColor: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
          {/* Cluster tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, overflowX: 'auto' }}>
            {['Before', 'During', 'After', 'Periodic', 'Checklist'].map(cl => (
              <button
                key={cl}
                onClick={() => setActiveCluster(cl)}
                style={{
                  flexShrink: 0, padding: '5px 10px', borderRadius: 16, cursor: 'pointer',
                  border: `1.5px solid ${activeCluster === cl ? clusterColors[cl] : C.border}`,
                  backgroundColor: activeCluster === cl ? clusterColors[cl] + '18' : 'transparent',
                  color: activeCluster === cl ? clusterColors[cl] : C.secondary,
                  fontSize: 11, fontWeight: activeCluster === cl ? 700 : 500,
                }}
              >{cl}</button>
            ))}
          </div>

          {/* Suggestion chips */}
          {filtered.map(s => (
            <button
              key={s.ruleNum + s.text}
              onClick={() => { setDraft(s.text); setShowSuggestions(false); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 12px', marginBottom: 6, borderRadius: 8, cursor: 'pointer',
                backgroundColor: C.white, border: `1px solid ${clusterColors[s.cluster]}40`,
                fontSize: 13, color: C.primary, lineHeight: 1.5,
              }}
            >
              {s.ruleNum > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: clusterColors[s.cluster], marginRight: 6 }}>R{s.ruleNum}</span>}
              {s.text}
            </button>
          ))}
          <div style={{ fontSize: 11, color: C.secondary, marginTop: 4 }}>Tap any suggestion to use it — then edit as needed.</div>
        </div>
      )}

      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="I want to practice..."
        rows={2}
        style={{
          width: '100%', padding: '10px 12px',
          border: `1.5px solid ${draft ? C.calm : C.border}`, borderRadius: 10,
          fontSize: 14, color: C.primary, fontFamily: 'system-ui',
          resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5,
          transition: 'border-color 0.15s',
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => { if (draft.trim()) { onSave(draft.trim()); setEditing(false); setShowSuggestions(false); } }}
          style={{
            flex: 1, padding: '11px', borderRadius: 8, cursor: 'pointer', border: 'none',
            backgroundColor: draft.trim() ? C.calm : C.border,
            color: '#fff', fontWeight: 700, fontSize: 14,
            boxShadow: draft.trim() ? '0 3px 10px rgba(42,157,143,0.3)' : 'none',
          }}
        >Save goal</button>
        {goal && (
          <button onClick={() => { setDraft(goal); setEditing(false); setShowSuggestions(false); }} style={{
            padding: '11px 14px', borderRadius: 8, cursor: 'pointer',
            border: `1px solid ${C.border}`, backgroundColor: 'transparent',
            color: C.secondary, fontWeight: 600, fontSize: 13,
          }}>Cancel</button>
        )}
      </div>
    </Card>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  const [audioState, setAudioState] = useState('idle');
  const welcomeText = 'Nothing is required right now. You can leave at any time. You do not need to be ready. When you want to begin, the door is open.';

  const handleAudio = (e) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      setAudioState('idle');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(welcomeText);
    u.rate = 0.82; u.pitch = 1.05; u.volume = 1.0;
    u.onstart = () => setAudioState('playing');
    u.onend = () => setAudioState('done');
    u.onerror = () => setAudioState('idle');
    setAudioState('playing');
    window.speechSynthesis.speak(u);
  };

  const handleContinue = () => {
    window.speechSynthesis && window.speechSynthesis.cancel();
    onStart();
  };

  return (
    <div
      onClick={handleContinue}
      style={{
        position: 'absolute', inset: 0, zIndex: 300,
        background: 'linear-gradient(160deg, #1A2744 0%, #243672 55%, #3D5FC8 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 36px', cursor: 'pointer',
      }}
    >
      {/* App description */}
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: 0.3, marginBottom: 32, textAlign: 'center' }}>A guide to building and keeping real friendships.</div>
      {/* Four sentences */}
      <div style={{ maxWidth: 300, width: '100%' }}>
        {[
          { text: 'Nothing is required right now.', weight: 800, opacity: 1,    size: 22 },
          { text: 'You can leave at any time.',     weight: 700, opacity: 0.90, size: 20 },
          { text: 'You do not need to be ready.',   weight: 700, opacity: 0.85, size: 20 },
          { text: 'When you want to begin,\nthe door is open.', weight: 500, opacity: 0.70, size: 18 },
        ].map((s, i) => (
          <div key={i} style={{
            fontSize: s.size,
            fontWeight: s.weight,
            color: `rgba(255,255,255,${s.opacity})`,
            lineHeight: 1.4,
            marginBottom: i < 3 ? 24 : 0,
            whiteSpace: 'pre-line',
          }}>{s.text}</div>
        ))}
      </div>

      {/* Start button — primary CTA */}
      <button
        onClick={e => { e.stopPropagation(); handleContinue(); }}
        style={{
          marginTop: 44,
          padding: '16px 52px',
          borderRadius: 14,
          border: 'none',
          backgroundColor: '#2A9D8F',
          color: '#fff',
          fontSize: 18,
          fontWeight: 800,
          cursor: 'pointer',
          letterSpacing: 0.3,
          boxShadow: '0 4px 22px rgba(42,157,143,0.55)',
        }}
      >Start</button>

      {/* Audio — secondary */}
      <button
        onClick={handleAudio}
        style={{
          marginTop: 14,
          padding: '6px 16px', borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.18)',
          background: audioState === 'playing' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 500,
          cursor: 'pointer', letterSpacing: 0.3,
        }}
      >{audioState === 'idle' ? '🔊 Hear this' : audioState === 'playing' ? '⏹ Stop' : '↺ Again'}</button>
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
      content: 'The Scenario Generator builds practice scenarios from your framework rules. All app data stays in your browser session only. No data is transmitted externally.',
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
  const [navHistory, setNavHistory] = useState([]);
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

  // Goal — persisted in localStorage so it survives browser close
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    try { return localStorage.getItem('aof-weekly-goal') || ''; } catch { return ''; }
  });
  const saveGoal = (goal) => {
    setWeeklyGoal(goal);
    try { localStorage.setItem('aof-weekly-goal', goal); } catch (e) {}
  };

  // Term popup — shows a term definition without leaving the current screen
  const [termPopupId, setTermPopupId] = useState(null);
  const showTerm = (id) => setTermPopupId(id);

  const [transitionNote, setTransitionNote] = useState(null);

  const navigate = (to) => {
    setNavHistory(h => [...h, screen]);
    if (to !== 'home' && to !== 'emergency') {
      try {
        localStorage.setItem('aof-last-screen', JSON.stringify({ screen: to, title: fallbackTitle(to) }));
      } catch (e) {}
    }
    if (screen === 'home' && MAJOR_SCREENS.includes(to)) {
      setTransitionNote(`Leaving Home. Entering ${MAJOR_TITLES[to]}.`);
    } else {
      setTransitionNote(null);
    }
    setScreen(to);
  };

  const goBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(h => h.slice(0, -1));
      setScreen(prev);
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
    navigator: 'After a Conversation',
    regulation: 'Check In',
    'overwhelmed-stop': 'Stop Here',
    emergency: null,
    module1: 'The Framework',
    'ring-mismatch': 'Understanding Rings',
    'trusted-adult-setup': 'Trusted Adult',
    'ring-mismatch-rings': 'The Five Rings',
    'ring-mismatch-signs': 'Ring Mismatch',
    'ring-mismatch-check': 'Ring Check',
    'module1-term': 'Term Detail',
    'module1-rules': 'Rule Cards',
    'module1-map': 'Framework Map',
    'module1-rule': 'Rule Detail',
    module4: 'Practice',
    'module4-scenarios': 'Scenario Cards',
    'module4-trivia': 'Rule Trivia',
    'module4-flashcards': 'Flashcard Deck',
    'module4-generator': 'Scenario Generator',
    module3: 'My Tracker',
    'module3-gate': 'Check In First',
    'module3-audit': 'Self-Audit',
    'module3-skill': 'Skill Tracker',
    'module3-applied': 'Rule Applied',
    'module3-precorrect': 'Before It Happens',
    'module3-initiation': 'Initiation Tracker',
    'module3-journal': 'Bilateral Journal',
    'module3-health': 'Health Check',
    'module3-progress':  'Progress Summary',
    'module3-quarterly': 'Quarterly Self-Assessment',
    'module3-feedback':  'Receiving Honest Feedback',
    'module3-signal':    'The signal and the source',
    'module3-reality':   'Reality testing',
    'module3-scripts':   'Advocacy scripts',
    'module3-repair':    'Bilateral repair sequence',
    'module3-disclosure':'Controlled disclosure',
    'module3-conclude':  'Before I conclude',
    'module2-anchor': 'Module 2',
    'module2-q1': 'Pre-Comm Checklist',
    'module2-q2': 'Pre-Comm Checklist',
    'module2-q3': 'Pre-Comm Checklist',
    'module2-q4': 'Pre-Comm Checklist',
    'module2-q5': 'Pre-Comm Checklist',
    'module2-result': 'Your Result',
    'module2-prepare': 'Prepare for This',
  };

  const showBack = screen !== 'home' && screen !== 'emergency';
  const screenTitle = screen.startsWith('module1-rule-')
    ? 'Rule ' + screen.replace('module1-rule-', '')
    : screenTitles[screen];

  const renderScreen = () => {
    if (screen === 'home') return <HomeScreen navigate={navigate} regState={regState} goal={weeklyGoal} saveGoal={saveGoal} />;
    if (screen === 'navigator') return <NavigatorScreen navigate={navigate} setDest={setModule3Dest} />;
    if (screen === 'regulation') return <RegulationScreen navigate={navigate} onSetReg={setRegState} regState={regState} />;
    if (screen === 'overwhelmed-stop') return <OverwhelmedStop navigate={navigate} onEmergency={handleEmergency} onGrounding={() => setShowGrounding(true)} />;
    if (screen === 'emergency') return <EmergencyScreen navigate={navigate} />;
    if (screen === 'module2-anchor') return <Module2Anchor navigate={navigate} settings={settings} showTerm={showTerm} />;
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
    if (screen === 'ring-mismatch') return <RingMismatchHome navigate={navigate} />;
    if (screen === 'trusted-adult-setup') return <TrustedAdultSetup navigate={navigate} />;
    if (screen === 'ring-mismatch-rings') return <RingMismatchRings navigate={navigate} showTerm={showTerm} />;
    if (screen === 'ring-mismatch-signs') return <RingMismatchSigns navigate={navigate} showTerm={showTerm} />;
    if (screen === 'ring-mismatch-check') return <RingMismatchCheck navigate={navigate} />;
    if (screen === 'module1-map') return <Module1FrameworkMap navigate={navigate} setSelectedTerm={setSelectedTermId} />;
    // Rule detail — handles module1-rule-1 through module1-rule-13
    if (screen.startsWith('module1-rule-')) {
      const num = parseInt(screen.replace('module1-rule-', ''));
      return <Module1RuleDetail navigate={navigate} ruleNum={num} setSelectedTerm={setSelectedTermId} showTerm={showTerm} />;
    }
    if (screen === 'module3') return <Module3Home navigate={navigate} setDest={setModule3Dest} goal={weeklyGoal} />;
    if (screen === 'module3-gate') return <Module3Gate navigate={navigate} dest={module3Dest} onSetReg={setRegState} regState={regState} />;
    if (screen === 'module3-audit') return <Module3SelfAudit navigate={navigate} settings={settings} />;
    if (screen === 'module3-skill') return <Module3SkillTracker navigate={navigate} />;
    if (screen === 'module3-applied') return <Module3Applied navigate={navigate} />;
    if (screen === 'module3-precorrect') return <Module3PreCorrect navigate={navigate} />;
    if (screen === 'module3-initiation') return <Module3InitiationTracker navigate={navigate} />;
    if (screen === 'module3-journal') return <Module3Journal navigate={navigate} />;
    if (screen === 'module3-health') return <Module3HealthCheck navigate={navigate} />;
    if (screen === 'module3-progress')  return <Module3Progress navigate={navigate} />;
    if (screen === 'module3-quarterly') return <Module3Quarterly navigate={navigate} />;
    if (screen === 'module3-feedback')  return <Module3Feedback navigate={navigate} />;
    if (screen === 'module3-signal')    return <Module3Signal navigate={navigate} />;
    if (screen === 'module3-reality')   return <Module3Reality navigate={navigate} />;
    if (screen === 'module3-scripts')   return <Module3Scripts navigate={navigate} />;
    if (screen === 'module3-repair')    return <Module3Repair navigate={navigate} />;
    if (screen === 'module3-disclosure')return <Module3Disclosure navigate={navigate} />;
    if (screen === 'module3-conclude')  return <Module3Conclude navigate={navigate} />;
    if (screen === 'module4') return <Module4Home navigate={navigate} />;
    if (screen === 'module4-scenarios') return <Module4Scenarios navigate={navigate} />;
    if (screen === 'module4-trivia') return <Module4Trivia navigate={navigate} />;
    if (screen === 'module4-flashcards') return <Module4Flashcards navigate={navigate} />;
    if (screen === 'module4-generator') return <Module4Generator navigate={navigate} />;
    if (screen === 'legal') return <LegalScreen navigate={navigate} />;
    return <HomeScreen navigate={navigate} regState={regState} goal={weeklyGoal} saveGoal={saveGoal} />;
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
        {showWelcome && <WelcomeScreen onStart={() => setShowWelcome(false)} />}

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
            goal={weeklyGoal}
            onGoalEdit={() => navigate('home')}
            transitionNote={transitionNote}
          >
            {renderScreen()}
          </Shell>
        )}

        {termPopupId && (
          <TermPopup
            termId={termPopupId}
            onClose={() => setTermPopupId(null)}
            onNavigate={() => { setSelectedTermId(termPopupId); setTermPopupId(null); navigate('module1-term'); }}
          />
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
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}
