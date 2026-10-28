// All Bookworm dummy data lives here. Edit freely.

export type CharacterId = "nick" | "gatsby" | "daisy" | "tom" | "jordan" | "myrtle" | "george";
export type ReactionKey = "wow" | "lol" | "sad" | "mad" | "hmm";
export const REACTIONS: { key: ReactionKey; emoji: string }[] = [
  { key: "wow", emoji: "😮" },
  { key: "lol", emoji: "😂" },
  { key: "sad", emoji: "😢" },
  { key: "mad", emoji: "😡" },
  { key: "hmm", emoji: "🤔" },
];

export interface Character {
  id: CharacterId;
  name: string;
  initials: string;
  bio: string;
  firstChapter: number;
  hue: number; // avatar tint
  sentiment: (number | null)[]; // index 0 = chapter 1
}

export interface BookEvent {
  id: string;
  chapter: number;
  title: string;
  description: string;
  characters: CharacterId[];
}

export interface Chapter {
  number: number;
  title: string;
  recap: string;
  notes: Partial<Record<CharacterId, string>>;
}

export interface Reply {
  id: string;
  user: string;
  body: string;
  progress: number; // reply author's chapter when they replied
}

export interface Prediction {
  resolvesAt: number;
  outcome: "correct" | "incorrect";
  agree: number; // %
}

export interface Post {
  id: string;
  chapter: number;
  user: string;
  body: string;
  events: string[];
  characters: CharacterId[];
  reactions: Record<ReactionKey, number>;
  replies: Reply[];
  prediction?: Prediction | undefined;
  hindsight?: boolean;
  mine?: boolean;
}

export const BOOK = {
  id: "gatsby",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  chapters: 9,
};

export const SHELF = [
  { id: "gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", available: true },
  { id: "pride", title: "Pride and Prejudice", author: "Jane Austen", available: false },
  { id: "frank", title: "Frankenstein", author: "Mary Shelley", available: false },
  { id: "mrs", title: "Mrs Dalloway", author: "Virginia Woolf", available: false },
];

export const CHARACTERS: Character[] = [
  { id: "nick", name: "Nick Carraway", initials: "NC", firstChapter: 1, hue: 220,
    bio: "A young Midwesterner who moves to West Egg to learn the bond business. Our narrator — observant, and quick to say he reserves judgment.",
    sentiment: [3.6, 3.7, 3.8, 3.8, 3.9, 3.9, 3.6, 3.9, 4.2] },
  { id: "gatsby", name: "Jay Gatsby", initials: "JG", firstChapter: 1, hue: 140,
    bio: "Nick's mysterious, fabulously wealthy neighbor, famous for parties nobody quite understands.",
    sentiment: [3.4, 3.5, 3.9, 4.0, 4.5, 3.6, 3.2, 3.8, 4.4] },
  { id: "daisy", name: "Daisy Buchanan", initials: "DB", firstChapter: 1, hue: 50,
    bio: "Nick's charming cousin, married to Tom, living in fashionable East Egg.",
    sentiment: [3.5, 3.4, 3.4, 3.6, 3.9, 3.5, 2.1, 1.8, 1.6] },
  { id: "tom", name: "Tom Buchanan", initials: "TB", firstChapter: 1, hue: 10,
    bio: "Daisy's husband — a former Yale football star with old money and a forceful temperament.",
    sentiment: [1.9, 1.5, 1.6, 1.6, 1.7, 1.8, 1.9, 1.5, 1.3] },
  { id: "jordan", name: "Jordan Baker", initials: "JB", firstChapter: 1, hue: 280,
    bio: "A professional golfer and Daisy's old friend, cool and self-possessed.",
    sentiment: [3.2, 3.2, 2.9, 3.4, 3.3, 3.3, 3.1, 3.0, 2.9] },
  { id: "myrtle", name: "Myrtle Wilson", initials: "MW", firstChapter: 2, hue: 340,
    bio: "A vivid woman living above a garage in the valley of ashes, eager for a bigger life.",
    sentiment: [null, 2.8, 2.9, 2.9, 2.9, 2.9, 3.7, 3.6, 3.5] },
  { id: "george", name: "George Wilson", initials: "GW", firstChapter: 2, hue: 190,
    bio: "Myrtle's husband, a worn-out mechanic who runs the garage by the ashes.",
    sentiment: [null, 3.1, 3.1, 3.1, 3.1, 3.2, 3.6, 2.4, 2.2] },
];

export const CHAPTERS: Chapter[] = [
  { number: 1, title: "East Egg Evenings",
    recap: "Nick settles in West Egg and visits his cousin Daisy and her husband Tom in East Egg. That night he glimpses his neighbor alone on the lawn, reaching toward a distant light.",
    notes: { nick: "Moves to West Egg and dines with the Buchanans.", daisy: "Charms Nick and hints at an unhappy marriage.", tom: "Lectures about race theory and takes a suspicious call.", jordan: "Meets Nick, bored and elegant.", gatsby: "Seen alone, reaching toward a green light." } },
  { number: 2, title: "The Valley of Ashes",
    recap: "Tom drags Nick to meet his mistress Myrtle in a grim industrial wasteland. A drunken party in a Manhattan apartment ends in violence.",
    notes: { nick: "Reluctantly tags along to Tom's apartment party.", tom: "Openly flaunts his affair and strikes Myrtle.", myrtle: "Throws a party and taunts Tom about Daisy.", george: "Wipes his hands at the garage, oblivious." } },
  { number: 3, title: "Blue Gardens",
    recap: "Nick finally attends one of his neighbor's legendary parties. He meets the host without realizing it, and spends time with Jordan.",
    notes: { nick: "Attends a party and starts seeing Jordan.", gatsby: "Introduces himself with a famous smile.", jordan: "Has a private talk with the host and drives recklessly." } },
  { number: 4, title: "A Ride to Lunch",
    recap: "Gatsby tells Nick an implausible life story on a drive into the city and introduces him to a shady associate. Jordan reveals a history connecting Gatsby to Daisy.",
    notes: { nick: "Hears Gatsby's story and is asked for a favor.", gatsby: "Claims Oxford, war medals and inherited wealth.", jordan: "Tells Nick about Daisy's past with a young officer.", daisy: "Remembered as she was in Louisville in 1917." } },
  { number: 5, title: "Tea at Nick's",
    recap: "Nick hosts a nervous tea where Gatsby and Daisy meet again after five years. Gatsby shows Daisy his mansion and its treasures.",
    notes: { nick: "Hosts the reunion and quietly leaves them alone.", gatsby: "Is overwhelmed, then elated, showing off everything.", daisy: "Cries over Gatsby's shirts." } },
  { number: 6, title: "James Gatz of North Dakota",
    recap: "Nick reveals Gatsby's real origins. Tom and Daisy attend a party, and Daisy doesn't enjoy it.",
    notes: { nick: "Shares what he learned of Gatsby's youth.", gatsby: "Insists he can repeat the past.", daisy: "Is unsettled by West Egg's crowd.", tom: "Grows suspicious of Gatsby." } },
  { number: 7, title: "The Hottest Day",
    recap: "On a sweltering afternoon, tensions explode in a Plaza Hotel suite. The drive home ends in tragedy on the road through the ashes.",
    notes: { nick: "Remembers it's his thirtieth birthday.", gatsby: "Demands Daisy say she never loved Tom.", daisy: "Can't say it — and drives home.", tom: "Exposes Gatsby's business.", jordan: "Stays with the Buchanans.", myrtle: "Runs into the road.", george: "Plans to move his wife West." } },
  { number: 8, title: "Waiting for a Call",
    recap: "Gatsby tells Nick the full story of his first love. The next afternoon a grieving man finds his way to West Egg.",
    notes: { nick: "Tells Gatsby he's worth the whole bunch put together.", gatsby: "Waits by the pool for a call.", george: "Searches for the car's owner." } },
  { number: 9, title: "Borne Back",
    recap: "Nick tries to arrange a funeral nobody seems willing to attend. He leaves the East, reflecting on the green light.",
    notes: { nick: "Organizes the funeral and heads home.", tom: "Meets Nick one last time.", daisy: "Leaves without a word.", jordan: "Breaks things off with Nick." } },
];

export const EVENTS: BookEvent[] = [
  { id: "e1a", chapter: 1, title: "Dinner at the Buchanans'", description: "Nick dines with Daisy, Tom and Jordan on a breezy East Egg evening.", characters: ["nick", "daisy", "tom", "jordan"] },
  { id: "e1b", chapter: 1, title: "Tom's mysterious phone call", description: "A call interrupts dinner, and Jordan whispers that Tom has 'some woman in New York'.", characters: ["tom", "jordan", "daisy"] },
  { id: "e1c", chapter: 1, title: "Gatsby reaching toward the green light", description: "Nick sees his neighbor stretch his arms toward a single green light across the bay.", characters: ["gatsby", "nick"] },
  { id: "e2a", chapter: 2, title: "The valley of ashes", description: "A gray wasteland watched over by the faded eyes of Doctor T. J. Eckleburg.", characters: ["nick", "tom", "george"] },
  { id: "e2b", chapter: 2, title: "The party at Tom and Myrtle's apartment", description: "A cramped, boozy afternoon in a Manhattan flat with Myrtle's sister and neighbors.", characters: ["tom", "myrtle", "nick"] },
  { id: "e2c", chapter: 2, title: "Tom breaks Myrtle's nose", description: "Myrtle chants Daisy's name, and Tom silences her with one blow.", characters: ["tom", "myrtle"] },
  { id: "e3a", chapter: 3, title: "Gatsby's lavish party", description: "Orchestras, champagne and strangers trading rumors about their host.", characters: ["nick", "jordan"] },
  { id: "e3b", chapter: 3, title: "Nick finally meets Gatsby", description: "A friendly man says they served together in the war — and turns out to be Gatsby.", characters: ["nick", "gatsby"] },
  { id: "e3c", chapter: 3, title: "Jordan's careless driving", description: "Jordan nearly hits a workman and shrugs that other people will be careful.", characters: ["jordan", "nick"] },
  { id: "e4a", chapter: 4, title: "Gatsby's life story", description: "Gatsby recites a polished biography, complete with a medal from Montenegro.", characters: ["gatsby", "nick"] },
  { id: "e4b", chapter: 4, title: "Lunch with Meyer Wolfsheim", description: "Nick meets the man who 'fixed the World's Series' — wearing human molar cufflinks.", characters: ["gatsby", "nick"] },
  { id: "e4c", chapter: 4, title: "Jordan reveals the Daisy connection", description: "Gatsby and Daisy were in love five years ago, and he bought his house to be across the bay.", characters: ["jordan", "nick", "daisy", "gatsby"] },
  { id: "e5a", chapter: 5, title: "Gatsby and Daisy reunite at Nick's house", description: "A rainy, painfully awkward tea that turns into something radiant.", characters: ["gatsby", "daisy", "nick"] },
  { id: "e5b", chapter: 5, title: "The shirts scene", description: "Gatsby tosses his shirts in a soft rich heap, and Daisy sobs into them.", characters: ["gatsby", "daisy"] },
  { id: "e5c", chapter: 5, title: "Klipspringer plays piano", description: "The lodger plays 'Ain't We Got Fun?' as Nick slips away.", characters: ["gatsby", "daisy", "nick"] },
  { id: "e6a", chapter: 6, title: "The truth about James Gatz", description: "Gatsby was born poor in North Dakota and reinvented himself at seventeen.", characters: ["gatsby", "nick"] },
  { id: "e6b", chapter: 6, title: "Tom and Daisy attend a party", description: "Daisy finds West Egg's glamour vulgar; Tom sneers and investigates.", characters: ["tom", "daisy", "gatsby"] },
  { id: "e6c", chapter: 6, title: "\u201CCan't repeat the past? Of course you can!\u201D", description: "Gatsby wants Daisy to erase the last five years entirely.", characters: ["gatsby", "nick"] },
  { id: "e7a", chapter: 7, title: "The heat in the Buchanan house", description: "Daisy says Gatsby 'always looks so cool' — and Tom understands.", characters: ["daisy", "tom", "gatsby", "jordan", "nick"] },
  { id: "e7b", chapter: 7, title: "The confrontation at the Plaza Hotel", description: "In a stifling suite, Tom and Gatsby fight for Daisy in front of everyone.", characters: ["tom", "gatsby", "daisy", "nick", "jordan"] },
  { id: "e7c", chapter: 7, title: "Myrtle's death", description: "Myrtle runs toward the yellow car and is struck on the road.", characters: ["myrtle", "george", "daisy", "gatsby"] },
  { id: "e8a", chapter: 8, title: "Gatsby's story of Daisy", description: "Before dawn, Gatsby tells Nick about Louisville and the war.", characters: ["gatsby", "nick", "daisy"] },
  { id: "e8b", chapter: 8, title: "Gatsby waits by the pool", description: "Gatsby floats in the pool, waiting for a call that never comes.", characters: ["gatsby", "george"] },
  { id: "e9a", chapter: 9, title: "Gatsby's funeral", description: "Almost no one comes. Owl Eyes says: 'The poor son-of-a-bitch.'", characters: ["nick", "gatsby"] },
  { id: "e9b", chapter: 9, title: "Nick leaves the East", description: "Nick ends things with Jordan, runs into Tom, and goes home.", characters: ["nick", "tom", "jordan"] },
];

// ---------- Posts ----------
const USERS = ["marginalia_mae", "jazzagejules", "eggwest_reader", "dogeared_dan", "oldsport_olive", "bookish_benji", "green_light_gia", "quietcorner_quinn", "ashes_and_ink", "flapperfran"];

let seed = 7;
const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const rx = (): Record<ReactionKey, number> => ({
  wow: Math.floor(rand() * 30), lol: Math.floor(rand() * 12), sad: Math.floor(rand() * 18),
  mad: Math.floor(rand() * 10), hmm: Math.floor(rand() * 25),
});

type R = [string, string, number];
let pid = 0;
function P(chapter: number, user: string, body: string, events: string[], characters: CharacterId[], replies: R[] = [], extra: Partial<Post> = {}): Post {
  const id = `p${++pid}`;
  return { id, chapter, user, body, events, characters, reactions: rx(), replies: replies.map(([u, b, pr], i) => ({ id: `${id}r${i}`, user: u, body: b, progress: pr })), ...extra };
}

export const POSTS: Post[] = [
  // Chapter 1
  P(1, "marginalia_mae", "The way Daisy's voice is described — 'a promise that she had done gay, exciting things' — I already feel like she's performing for everyone.", ["e1a"], ["daisy"], [["jazzagejules", "Performing is exactly the word. Even her sadness feels staged.", 1], ["oldsport_olive", "Just wait. That voice becomes a whole thing later.", 8], ["dogeared_dan", "Her line about her daughter being 'a beautiful little fool' hit hard.", 1]]),
  P(1, "jazzagejules", "Tom is so unbearable on page one I almost admire the efficiency. 'Civilization's going to pieces' over the soup course.", ["e1a"], ["tom"], [["eggwest_reader", "He's a walking bully with a rulebook.", 1], ["ashes_and_ink", "Hold onto that feeling. You'll need it.", 7]]),
  P(1, "eggwest_reader", "That phone call! Jordan just casually spilling 'Tom's got some woman in New York.' Bold.", ["e1b"], ["tom", "jordan"], [["bookish_benji", "Jordan is my favorite already. Zero filter.", 1], ["marginalia_mae", "Daisy definitely knows too.", 1]]),
  P(1, "green_light_gia", "THE GREEN LIGHT. A man alone, arms stretched out toward the water, trembling. Chills.", ["e1c"], ["gatsby"], [["quietcorner_quinn", "Such an image to end a first chapter on.", 1], ["flapperfran", "Who's at the end of that dock though…", 2], ["oldsport_olive", "Everything in this book points back here. Everything.", 9]]),
  P(1, "dogeared_dan", "Prediction: the green light belongs to someone Gatsby is in love with. Nobody stretches toward a lamp that dramatically.", ["e1c"], ["gatsby"], [["green_light_gia", "Agree — it's across the bay, toward East Egg...", 1], ["jazzagejules", "Bold of you to be right this early 👀", 5]], { prediction: { resolvesAt: 4, outcome: "correct", agree: 52 } }),
  P(1, "quietcorner_quinn", "Nick says he's 'inclined to reserve all judgments' and then judges every single person in the first ten pages.", [], ["nick"], [["marginalia_mae", "Unreliable narrator energy.", 1], ["bookish_benji", "Ha — he's honest about being dishonest.", 1]]),
  P(1, "bookish_benji", "Jordan balancing on the couch like something might fall off her chin is such a specific, perfect detail.", ["e1a"], ["jordan"], [["flapperfran", "Fitzgerald's character intros are elite.", 1]]),

  // Chapter 2
  P(2, "ashes_and_ink", "The valley of ashes feels like the moral underside of both Eggs. Those billboard eyes watching everything...", ["e2a"], ["george"], [["quietcorner_quinn", "Eckleburg as a god who's stopped caring.", 2], ["green_light_gia", "Those eyes come back in a big way.", 8]]),
  P(2, "jazzagejules", "Prediction: Tom's affair is going to blow up in public. He's not even hiding it — he introduced Nick to Myrtle in front of her husband!", ["e2a", "e2b"], ["tom", "myrtle"], [["eggwest_reader", "Arrogance like this always gets punished in novels.", 2], ["dogeared_dan", "Oh it blows up. Just not the way you'd guess.", 7]], { prediction: { resolvesAt: 7, outcome: "correct", agree: 71 } }),
  P(2, "flapperfran", "Myrtle's apartment party is chaos in the best way. The puppy! The sister! Mr. McKee photographing everyone!", ["e2b"], ["myrtle"], [["bookish_benji", "Nick getting drunk for 'the second time in his life' lol", 2], ["marginalia_mae", "It's so claustrophobic and sad underneath.", 2]]),
  P(2, "marginalia_mae", "Tom breaking Myrtle's nose with one 'short deft movement' — the casualness of that violence is the whole point.", ["e2c"], ["tom", "myrtle"], [["ashes_and_ink", "And then the scene just... moves on. Horrifying.", 2], ["oldsport_olive", "This moment explains so much about what's coming for Tom.", 7], ["jazzagejules", "Agreed. Hard to read.", 2]]),
  P(2, "dogeared_dan", "George Wilson might be the only sincere person we've met so far. Spiritless, but sincere.", ["e2a"], ["george"], [["quietcorner_quinn", "He's so tired. You can feel it.", 2]]),
  P(2, "oldsport_olive", "Myrtle wants out of the ashes so badly. Hard not to root for her a little even as she's awful to her husband.", ["e2b"], ["myrtle"], [["flapperfran", "She's the most alive person in the book.", 2], ["ashes_and_ink", "That line about her vitality will haunt you later.", 9]]),

  // Chapter 3
  P(3, "green_light_gia", "The party descriptions are like a fever dream. 'Men and girls came and went like moths.'", ["e3a"], [], [["bookish_benji", "Moths to a light, maybe? 👀", 3], ["eggwest_reader", "Everyone gossips about the host and nobody knows him.", 3]]),
  P(3, "eggwest_reader", "Nick meets Gatsby and doesn't even realize it. That smile paragraph — 'one of those rare smiles with a quality of eternal reassurance.'", ["e3b"], ["gatsby", "nick"], [["marginalia_mae", "Best introduction in American literature, I'll die on this hill.", 3], ["jazzagejules", "And then 'old sport' begins.", 3], ["dogeared_dan", "The smile hits so differently on a reread.", 9]]),
  P(3, "bookish_benji", "Prediction: Nick and Jordan are going to end up together. They're both observers, both a little detached.", ["e3c"], ["nick", "jordan"], [["flapperfran", "I could see it!", 3], ["quietcorner_quinn", "Hmm. Detached people don't always stick.", 3], ["oldsport_olive", "No comment 🙂", 9]], { prediction: { resolvesAt: 9, outcome: "incorrect", agree: 58 } }),
  P(3, "quietcorner_quinn", "Jordan: 'It takes two to make an accident.' A careless driver telling on herself. Feels like foreshadowing for... something.", ["e3c"], ["jordan"], [["ashes_and_ink", "Fitzgerald doesn't waste car scenes.", 3], ["jazzagejules", "You have no idea how right you are.", 7]]),
  P(3, "flapperfran", "The drunk guy in the library amazed that the books are REAL. Owl Eyes might be my favorite side character.", ["e3a"], [], [["green_light_gia", "'Knew when to stop — didn't cut the pages.' Iconic.", 3]]),
  P(3, "jazzagejules", "Gatsby stands apart at his own party, not drinking, watching. Who throws parties like this for nobody?", ["e3a", "e3b"], ["gatsby"], [["marginalia_mae", "Someone throwing them FOR somebody.", 3], ["dogeared_dan", "Keep that question in mind for Chapter 4.", 5]]),

  // Chapter 4
  P(4, "dogeared_dan", "Prediction: Gatsby isn't who he says he is. 'Educated at Oxford' and 'all my family died' in one breath? Nope.", ["e4a"], ["gatsby"], [["bookish_benji", "The medal felt like a prop to me.", 4], ["eggwest_reader", "But the photo with the Oxford guys…", 4], ["green_light_gia", "Spoiler-free answer: trust your gut.", 6]], { prediction: { resolvesAt: 6, outcome: "correct", agree: 64 } }),
  P(4, "ashes_and_ink", "Meyer Wolfsheim's human molar cufflinks. I cannot get over that detail.", ["e4b"], ["gatsby"], [["flapperfran", "And he FIXED the World Series. Gatsby's connections are sketchy.", 4], ["quietcorner_quinn", "Where does Gatsby's money come from, really?", 4]]),
  P(4, "marginalia_mae", "Jordan's story reframes everything. He bought the house so Daisy would be across the bay. The green light is her dock!", ["e4c"], ["jordan", "daisy", "gatsby"], [["green_light_gia", "I KNEW IT. Chapter 1 people, we called it.", 4], ["jazzagejules", "The parties were all bait for her. Wow.", 4], ["oldsport_olive", "And it's even more tragic than you think.", 9]]),
  P(4, "green_light_gia", "Young Daisy in Louisville sounds magnetic. Hard to square with the bored woman in East Egg.", ["e4c"], ["daisy"], [["bookish_benji", "Five years and Tom will do that to you.", 4]]),
  P(4, "eggwest_reader", "Gatsby asking Nick to set up a tea with Daisy instead of just calling her himself is so painfully shy.", ["e4c"], ["gatsby", "nick"], [["marginalia_mae", "Five years of planning and he can't make a phone call.", 4], ["dogeared_dan", "Wait until you see how the tea goes 😭", 5]]),
  P(4, "oldsport_olive", "Prediction: Daisy will leave Tom for Gatsby once they reconnect.", ["e4c"], ["daisy", "tom", "gatsby"], [["ashes_and_ink", "Romance novel brain says yes. Fitzgerald brain says no.", 4], ["flapperfran", "Old money doesn't let go easily.", 4]], { prediction: { resolvesAt: 7, outcome: "incorrect", agree: 61 } }),

  // Chapter 5
  P(5, "jazzagejules", "Gatsby showing up at Nick's soaking wet from rain, pale as death, nearly knocking over the clock. I'm dying.", ["e5a"], ["gatsby", "nick"], [["bookish_benji", "The clock! Trying to stop time, literally.", 5], ["quietcorner_quinn", "Most relatable rich man ever.", 5]]),
  P(5, "marginalia_mae", "The shirts scene. 'They're such beautiful shirts' — she isn't crying about shirts at all.", ["e5b"], ["daisy", "gatsby"], [["green_light_gia", "She's crying about the life she didn't wait for.", 5], ["oldsport_olive", "Some people read this as pure materialism. Both readings get sharper later.", 9], ["dogeared_dan", "Wept.", 5]]),
  P(5, "green_light_gia", "Gatsby noticing the green light lost its 'colossal significance' now that Daisy is beside him. Devastating line.", ["e5a"], ["gatsby"], [["eggwest_reader", "The dream is always better than the real thing.", 5]]),
  P(5, "eggwest_reader", "Klipspringer playing 'Ain't We Got Fun?' while Gatsby and Daisy are lost in each other — and Nick just quietly leaves.", ["e5c"], ["nick", "gatsby", "daisy"], [["flapperfran", "Nick is the best wingman in literature.", 5]]),
  P(5, "ashes_and_ink", "Gatsby went through three emotional states in one chapter: embarrassment, joy, wonder. Peak Gatsby.", ["e5a", "e5b"], ["gatsby"], [["jazzagejules", "This is the happiest he'll ever be, isn't it.", 5], ["dogeared_dan", "Enjoy it while it lasts.", 8]]),
  P(5, "quietcorner_quinn", "Nick suspects Daisy 'tumbled short of his dreams' — not through her fault but because the dream was too big.", ["e5a"], ["daisy", "nick"], [["marginalia_mae", "This is the thesis of the book, right?", 5]]),

  // Chapter 6
  P(6, "bookish_benji", "James Gatz from North Dakota! He 'sprang from his Platonic conception of himself.' Called it in Chapter 4.", ["e6a"], ["gatsby"], [["dogeared_dan", "Prediction squad wins 🎉", 6], ["eggwest_reader", "Dan Cody's yacht changed his whole life.", 6]]),
  P(6, "flapperfran", "Daisy at the party is appalled by everything. West Egg is too raw for her. That says a lot.", ["e6b"], ["daisy"], [["ashes_and_ink", "She likes the idea of Gatsby, not his world.", 6], ["oldsport_olive", "Notice who she's protecting from now on.", 9]]),
  P(6, "quietcorner_quinn", "Tom saying 'I'd like to know who he is and what he does' — the threat is so quiet.", ["e6b"], ["tom"], [["jazzagejules", "Tom investigating Gatsby is going to end badly.", 6], ["marginalia_mae", "Badly is an understatement.", 7]]),
  P(6, "marginalia_mae", "\"Can't repeat the past? Why of course you can!\" Gatsby is the most romantic and the most deluded man in fiction.", ["e6c"], ["gatsby"], [["green_light_gia", "He wants Daisy to say she never loved Tom. That's impossible.", 6], ["bookish_benji", "This is the tragic flaw spelled out.", 6]]),
  P(6, "eggwest_reader", "Nick is starting to sound protective of Gatsby. 'Gatsby's notion of the unutterable.' He's falling for the dream too.", ["e6c"], ["nick", "gatsby"], [["quietcorner_quinn", "Nick is the only one who sees all of him.", 6]]),
  P(6, "jazzagejules", "Gatsby stopped the parties because Daisy didn't like them. The whole show was only ever for one person.", ["e6b"], ["gatsby", "daisy"], [["flapperfran", "So many servants fired too...", 6]]),

  // Chapter 7
  P(7, "oldsport_olive", "'Her voice is full of money.' Gatsby finally names the thing about Daisy we've all felt since Chapter 1.", ["e7a"], ["daisy", "gatsby"], [["marginalia_mae", "Called it on page 9, babes.", 7]]),
  P(7, "dogeared_dan", "The Plaza scene is the most uncomfortable thing I've ever read. Everyone is sweating and miserable and Tom wins by being cruel.", ["e7b"], ["tom", "gatsby", "daisy"], [["ashes_and_ink", "Daisy: 'I did love him once — but I loved you too.' Oof.", 7], ["jazzagejules", "Gatsby's face when he loses her.", 7], ["bookish_benji", "Gatsby's whole dream cracks right there.", 7]]),
  P(7, "ashes_and_ink", "Myrtle's death. I had to put the book down. The 'tremendous vitality' just — gone.", ["e7c"], ["myrtle"], [["flapperfran", "She thought the car was Tom's.", 7], ["quietcorner_quinn", "And George is left with nothing.", 7]]),
  P(7, "flapperfran", "Daisy was driving. And Gatsby is going to take the blame. I'm so angry.", ["e7c"], ["daisy", "gatsby"], [["green_light_gia", "Daisy just dropped to a 2 for me.", 7], ["marginalia_mae", "And she goes right back to Tom over cold chicken.", 7], ["oldsport_olive", "Brace yourself for Chapter 8.", 9]]),
  P(7, "jazzagejules", "Nick realizing it's his thirtieth birthday on the drive home is such a quiet gut-punch.", ["e7b"], ["nick"], [["eggwest_reader", "'A thinning briefcase of enthusiasm.'", 7]]),
  P(7, "green_light_gia", "Gatsby standing outside the Buchanans' house all night 'watching over nothing.' Peak tragedy.", ["e7c"], ["gatsby"], [["dogeared_dan", "He still thinks she might call.", 7]]),

  // Chapter 8
  P(8, "quietcorner_quinn", "Gatsby's dawn confession about Louisville might be the most tender writing in the book.", ["e8a"], ["gatsby", "daisy"], [["marginalia_mae", "'He felt married to her, that was all.'", 8]]),
  P(8, "marginalia_mae", "'They're a rotten crowd. You're worth the whole damn bunch put together.' Nick's only compliment. I'm sobbing.", ["e8a"], ["nick", "gatsby"], [["bookish_benji", "And he disapproved of him from beginning to end.", 8], ["flapperfran", "Both things are true.", 8]]),
  P(8, "eggwest_reader", "George Wilson staring at Eckleburg's eyes: 'God sees everything.' The billboard from Chapter 2 finally pays off.", ["e8b"], ["george"], [["ashes_and_ink", "Told you those eyes were coming back.", 8]]),
  P(8, "dogeared_dan", "Gatsby in the pool, waiting for a call from Daisy that never comes. I can't.", ["e8b"], ["gatsby"], [["green_light_gia", "The first time he uses his pool all summer.", 8], ["jazzagejules", "The leaf slowly turning on the water...", 8]]),
  P(8, "bookish_benji", "Tom pointed George toward Gatsby, didn't he. He has to have.", ["e8b"], ["tom", "george"], [["quietcorner_quinn", "Chapter 9 confirms it. Spoiler-free: you're right.", 9]]),
  P(8, "flapperfran", "Daisy is at 1.8 stars on the reader chart and honestly that's generous.", [], ["daisy"], [["oldsport_olive", "She never even called.", 8]]),

  // Chapter 9
  P(9, "green_light_gia", "'So we beat on, boats against the current, borne back ceaselessly into the past.' I need a minute.", ["e9b"], ["nick"], [["marginalia_mae", "The green light was the future the whole time.", 9], ["jazzagejules", "Best last line ever written?", 9]]),
  P(9, "oldsport_olive", "Gatsby's funeral. Hundreds came to his parties. Almost nobody came to say goodbye.", ["e9a"], ["gatsby", "nick"], [["dogeared_dan", "Owl Eyes coming made me cry so hard.", 9], ["ashes_and_ink", "Gatsby's father showing the schedule from his childhood...", 9]]),
  P(9, "jazzagejules", "Tom and Daisy: 'careless people... they smashed up things and creatures and then retreated back into their money.'", ["e9b"], ["tom", "daisy"], [["flapperfran", "The verdict of the book in one line.", 9]]),
  P(9, "bookish_benji", "My prediction about Nick and Jordan crashed and burned. 'A bad driver' indeed.", ["e9b"], ["nick", "jordan"], [["quietcorner_quinn", "The car metaphor came full circle!", 9]]),
  P(9, "quietcorner_quinn", "Nick going back West feels right. The East broke something in him.", ["e9b"], ["nick"], [["eggwest_reader", "Distorted, like an El Greco painting.", 9]]),
  P(9, "marginalia_mae", "Daisy didn't even send flowers. Final rating: 1 star.", ["e9a"], ["daisy"], [["green_light_gia", "No address left either.", 9]]),

  // Hindsight posts — written by readers who finished the book, attached to early chapters
  P(1, "oldsport_olive", "Rereading Chapter 1 after finishing: the green light was never really Daisy. It was the idea of a future he could never reach.", ["e1c"], ["gatsby"], [["marginalia_mae", "Chills on the reread.", 9]], { hindsight: true }),
  P(3, "ashes_and_ink", "In hindsight Jordan's 'careless driving' scene is the whole ending in miniature. Careless people, cars, other people paying.", ["e3c"], ["jordan"], [["dogeared_dan", "Fitzgerald planted everything here.", 9]], { hindsight: true }),
  P(5, "dogeared_dan", "Knowing how it ends, the clock Gatsby nearly knocks over in the reunion is the saddest object in the book.", ["e5a"], ["gatsby"], [], { hindsight: true }),
  P(2, "green_light_gia", "Myrtle chanting Daisy's name and Tom silencing her — reread this after Chapter 7. Brutal symmetry.", ["e2c"], ["myrtle", "daisy", "tom"], [["flapperfran", "Oof. Yes.", 9]], { hindsight: true }),
];

export const ALL_USERS = USERS;
