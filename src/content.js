/**
 * PRANAYFLIX - Master Content Configuration
 * 
 * All personal content, photos, videos, and jokes live in this single file.
 * The owner (Janmesh) can edit any text, photo paths, or friend codes here.
 * If any media file is missing or still set to PLACEHOLDER, the app will 
 * gracefully display a tasteful dark gradient cinematic fallback card.
 */

export const CONFIG = {
  birthdayName: "Pranay",
  age: 20,
  seasonsWatched: 19,
  unlockAt: "2026-11-10T00:00:00+05:30", // IST midnight (10 November 2026)
  siteName: "PRANAYFLIX",
  tagline: "19 Seasons Down. New Chaos Loading.",
  heroPhoto: "/photos/hero.jpg",
  mainVideo: "/video/journey.mp4",
  videoPoster: "/photos/video-poster.jpg",
  backgroundVideo: "/video/video-bg.mp4",
  backgroundPoster: "/photos/video-poster.jpg",
  introSound: "/audio/intro.mp3",

  // Review wall settings: hold until premiere unlock (default true)
  holdUntilUnlock: true,
  reviews: {
    holdUntilUnlock: true,
  },

  giftCard: {
    title: "The Ultimate 20th Birthday Pass",
    code: "PRANAY-20",
    message: "Redeemable for unlimited chai, endless bro-trips, and zero adult responsibilities for the next 365 days. (Real surprise details to follow!)"
  },

  // 19 Seasons (One per year of his life: 2007 to 2025)
  seasons: [
    { season: 1, year: 2007, title: "Pilot: Baby Pranay & The 1st Cake", caption: "The world premiere of Pranay in 2007. Adorned with the iconic bindi, gazing at his birthday cake in pure wonder. The legend begins.", photo: "/photos/seasons/01.jpg", hasRealPhoto: true },
    { season: 2, year: 2008, title: "Learning to Walk (and Fall)", caption: "Discovered gravity the hard way. First official temper tantrums.", photo: "/photos/seasons/02.jpg" },
    { season: 3, year: 2009, title: "The Terrible Threes", caption: "Mastered the word 'NO' and used it weapon-grade.", photo: "/photos/seasons/03.jpg" },
    { season: 4, year: 2010, title: "Kindergarten Chronicles", caption: "Trading crayon secrets and pretending nap time was torture.", photo: "/photos/seasons/04.jpg" },
    { season: 5, year: 2011, title: "Primary School Hustle", caption: "Heavy schoolbag, five notebooks, zero homework done.", photo: "/photos/seasons/05.jpg" },
    { season: 6, year: 2012, title: "The Apocalyptic Imagination", caption: "Thought the world was ending in 2012. Survived just to eat Maggi.", photo: "/photos/seasons/06.jpg" },
    { season: 7, year: 2013, title: "The Old Soul: B&W Chikankari", caption: "Monochrome elegance, long embroidered kurta, and gazing thoughtfully in the mirror like a classical poet.", photo: "/photos/seasons/07.jpg", hasRealPhoto: true },
    { season: 8, year: 2014, title: "Nature & Peace: The Petting Arc", caption: "Sun-drenched rural fields, wide open skies, and gently petting a white calf. Pure peace and pastoral serenity.", photo: "/photos/seasons/08.jpg", hasRealPhoto: true },
    { season: 9, year: 2015, title: "The Preadolescent Sass", caption: "Developing comebacks that didn't make sense, but delivered with confidence.", photo: "/photos/seasons/09.jpg" },
    { season: 10, year: 2016, title: "Tradition & Modaks: Festive Roots", caption: "White kurta, traditional veshti, and Lord Ganesha's blessings at home. The sweet era before teenage drama started.", photo: "/photos/seasons/10.jpg", hasRealPhoto: true },
    { season: 11, year: 2017, title: "The Iron Temple: Gym Arc Begins", caption: "Mirror selfie in the weights room. Zero excuses, high protein dreams, and building the physique for Season 20.", photo: "/photos/seasons/11.jpg", hasRealPhoto: true },
    { season: 12, year: 2018, title: "Campus Routine: Mint Green Era", caption: "Mint green sweatshirt, backpack on one shoulder, and elevator mirror selfies on the way to class.", photo: "/photos/seasons/12.jpg", hasRealPhoto: true },
    { season: 13, year: 2019, title: "Monochrome Mood: Late Night Elevators", caption: "Black and white aesthetics, watch on wrist, and cinematic reflections during late-night elevator rides.", photo: "/photos/seasons/13.jpg", hasRealPhoto: true },
    { season: 14, year: 2020, title: "Bappa's Shield: Kaal Bhairav Pandal", caption: "Standing proud beside the mighty Kaal Bhairav Ganesha idol at night. Divine vibes and powerful energy.", photo: "/photos/seasons/14.jpg", hasRealPhoto: true },
    { season: 15, year: 2021, title: "The Aesthetic Era: Specs & Fade", caption: "Plaid shirt, vintage round glasses, and a fresh taper fade. Caught looking candidly into the distance like a Bollywood philosopher.", photo: "/photos/seasons/15.jpg", hasRealPhoto: true },
    { season: 16, year: 2022, title: "Night Rider: Leaning on the Bike", caption: "Crisp white shirt, silver chain, and the midnight bike arc. Officially adopting the mysterious main character aura.", photo: "/photos/seasons/16.jpg", hasRealPhoto: true },
    { season: 17, year: 2023, title: "The Blue Bike Saga: King of the Road", caption: "Mounted on the blue machine with a confident grin. Claiming ownership of every street, late-night tea stall, and city corner.", photo: "/photos/seasons/17.jpg", hasRealPhoto: true },
    { season: 18, year: 2024, title: "The Triad: Bro Code & Chaos", caption: "Janmesh, Pranay & the squad. Black shirt, waffle knit, and white tee. Standing tall through exams, midnight chai runs, and lifelong bro code.", photo: "/photos/seasons/18.jpg", hasRealPhoto: true },
    { season: 19, year: 2025, title: "The Finale: Elevator Mirror Syndicate", caption: "No elevator in the city was safe from this squad. 4 friends, 100 selfies, and the crew that made the teenage finale legendary.", photo: "/photos/seasons/19.jpg", hasRealPhoto: true }
  ],

  // Top 10 in Pranay's Friend Circle Today
  topTen: [
    { rank: 1, text: "Saying 'I am reaching in 5 mins' while still lying in bed naked" },
    { rank: 2, text: "Deleting Instagram for 6 hours as a 'dopamine detox'" },
    { rank: 3, text: "Saying 'One last game' at 2:30 AM" },
    { rank: 4, text: "Ordering food on Zomato for 45 minutes then eating leftover roti" },
    { rank: 5, text: "Pretending to know what mutual funds are" },
    { rank: 6, text: "Sending reels from 2021 that everyone already saw" },
    { rank: 7, text: "Borrowing Janmesh's clothes and never returning them" },
    { rank: 8, text: "Replying to texts strictly after 7 working days" },
    { rank: 9, text: "Blaming Indian traffic for being late to online meetings" },
    { rank: 10, text: "Giving life advice like he has survived three divorces" }
  ],

  // Continue Watching
  continueWatching: [
    { title: "Adulting: The Struggle", progress: 3, season: "S20:E1", duration: "48m remaining", photo: "/photos/pranay/bike-hero.jpg" },
    { title: "Hitting the Gym (Gains Arc)", progress: 78, season: "S11:E4", duration: "Bulking Phase", photo: "/photos/pranay/gym-physique.jpg" },
    { title: "Village Peace & Cow Petting", progress: 42, season: "S8:E3", duration: "24m remaining", photo: "/photos/pranay/nature-calf.jpg" },
    { title: "Replying to Texts Promptly", progress: 1, season: "S1:E1", duration: "Failed to load", photo: "/photos/pranay/specs-aesthetic.jpg" }
  ],

  // Coming Soon
  comingSoon: [
    { title: "Pranay's First Salary", date: "TBA (High Inflation Edition)", desc: "A thrilling saga of deductions, tax shock, and buying unnecessary gadgets." },
    { title: "Pranay's Wedding", date: "2030 (Subject to Horoscope)", desc: "Featuring 500+ guests, chaotic Baraat dancing, and runaway groomsmen." },
    { title: "Pranay: Season 21", date: "10 Nov 2027", desc: "The college finale and existential crisis special. Bigger drama, less sleep." },
    { title: "Season 30: Midlife Crisis", date: "10 Nov 2036", desc: "Locked in the vault. Includes buying an electric scooter and talking about back pain." }
  ],

  // Friends' Episodes (Locked behind secret codes)
  friends: [
    {
      id: "friend01",
      name: "Aryan Sharma",
      role: "The Crime Partner & Late-Night Strategist",
      code: "ARYAN-404",
      photo: "/photos/friends/friend01.jpg",
      message: "Happy 20th birthday Pranay! From surviving math exams to midnight food runs, wouldn't trade our chaotic memories for anything. Stop being late to everything!",
      video: null
    },
    {
      id: "friend02",
      name: "Rohan Varma",
      role: "Chief Vibe Officer & Roast Specialist",
      code: "ROHAN-99",
      photo: "/photos/friends/friend02.jpg",
      message: "Happy 20 bro! You are officially two decades old and still haven't learned how to text back within 4 business hours. Here's to more crazy years!",
      video: null
    },
    {
      id: "friend03",
      name: "Kabir Patel",
      role: "Minister of Bad Decisions & Good Times",
      code: "KABIR-CHAI",
      photo: "/photos/friends/friend03.jpg",
      message: "To the guy who always says 'bhai bas 5 minute'. Happy 20th birthday! May your Season 20 have less drama and way more money.",
      video: null
    },
    {
      id: "friend04",
      name: "Tanvi Deshmukh",
      role: "The Voice of Reason (Ignored Always)",
      code: "TANVI-VIBES",
      photo: "/photos/friends/friend04.jpg",
      message: "Happy Birthday Pranay! Honestly shocked you made it to 20 without burning your house down. Hope this year brings everything you wish for!",
      video: null
    }
  ],

  // Special Episode: Janmesh Roida (The architect of this entire platform)
  special: {
    id: "janmesh",
    name: "Janmesh Roida",
    role: "The Creator, Best Brother & Lifelong Co-Star",
    code: "JANMESH-ROIDA",
    photo: "/photos/janmesh/02.jpg",
    photos: [
      {
        url: "/photos/janmesh/01.jpg",
        title: "Bappa's Blessings & Infinite Smiles",
        subtitle: "Festive Traditions & Radiant Joy",
        tag: "Festive Edition",
        caption: "Standing side-by-side with Lord Ganesha's blessings. Every festival, every new beginning, always together as brothers."
      },
      {
        url: "/photos/janmesh/02.jpg",
        title: "Suited Up & Unstoppable",
        subtitle: "Two Brothers, One Vision",
        tag: "Dapper Duo",
        caption: "Dressed in black, sharp as ever. From quiet planning to conquering life's biggest milestones, we move as one team."
      },
      {
        url: "/photos/janmesh/03.jpg",
        title: "The Hand-Drawn Sketch",
        subtitle: "A Timeless Masterpiece of Us",
        tag: "Artistic Portrait",
        caption: "Captured in artistic strokes — an immortal hand-drawn sketch honoring 19+ years of unshakeable brotherhood.",
        isSketch: true
      },
      {
        url: "/video/janmesh-pranay.mp4",
        title: "The Brotherhood Video Reel",
        subtitle: "Unscripted Moments & Pure Chaos",
        tag: "Special Video",
        caption: "Raw laughter, candid brotherhood, and unscripted memories captured live on camera. Two brothers navigating life together.",
        isVideo: true
      }
    ],
    letter: `Dear Pranay,

Happy 20th Birthday, brother.

They say 20 is the year where childhood officially hands over the keys to whatever comes next. But looking back at the last 19 seasons of your life, I don't see someone getting older — I see someone who has made every single year around him brighter, funnier, and infinitely more memorable.

You and I have shared moments that no camera ever caught: the silent inside jokes across crowded rooms, the late-night talks when the rest of the world was asleep, the dumb fights that evaporated in minutes, and the quiet reassurance that no matter how chaotic life gets, we always have each other's back.

Building this entire platform for you wasn't just a birthday surprise — it's a testament to how much you mean to me and to everyone whose life you touch. You have an energy that turns ordinary days into blockbuster episodes.

As you step into Season 20, don't worry about having everything figured out. No great show has a predictable script. Chase what makes you come alive, laugh without holding back, and remember that whatever plot twists come your way, you'll always have your co-pilot right here.

I love you, brother. 

Season 20 is going to be your best one yet.

— Janmesh Roida`,
    video: "/video/janmesh-pranay.mp4",
    videoTitle: "Janmesh & Pranay: The Brotherhood Reel",
    videoSubtitle: "19+ Years of Brotherhood • Unfiltered & Real"
  },

  // Family Profile / Mom Surprise
  family: {
    title: "A Message from Mom & Family ❤️",
    message: "Our dearest Pranay, watching you grow into this wonderful, kind-hearted young man has been the greatest joy of our lives. May God bless you with health, endless happiness, wisdom, and success. Happy 20th Birthday, our champ!",
    video: null
  },

  // Roast Subtitles (Overlaid during main trailer when Roast Mode is ON)
  roastSubtitles: [
    { at: 2, text: "[Dramatic cinematic silence because he overslept]" },
    { at: 5, text: "Look at him pretending to look focused for the camera." },
    { at: 9, text: "Fun fact: He took 47 takes just to get that casual look." },
    { at: 14, text: "Warning: High levels of self-confidence with zero proof." },
    { at: 20, text: "Still hasn't paid back that ₹200 from last Tuesday." },
    { at: 27, text: "Acting like he understands stocks after watching one Instagram reel." },
    { at: 34, text: "His greatest life achievement: reaching Level 100 on Candy Crush." },
    { at: 42, text: "Now entering his 20s. Back pain will arrive shortly." },
    { at: 50, text: "We love you Pranay, but please reply to our WhatsApp messages." }
  ],

  // Notifications Bell (Initial default list)
  notifications: [
    { id: "note_1", text: "🎉 New arrival: Pranay Season 20 has officially premiered worldwide!", time: "Today", unread: true },
    { id: "note_2", text: "⚠️ Advisory: You are now 20. Government permits you to complain about knee pain.", time: "Today", unread: true },
    { id: "note_3", text: "👀 Alert: Janmesh Roida has uploaded a classified Special Episode.", time: "Today", unread: true },
    { id: "note_4", text: "🍿 Reminder: You still owe chai to 4 different people.", time: "1d ago", unread: false },
    { id: "note_5", text: "⭐ System: 100% of viewers rated Pranay Season 20 five stars.", time: "2d ago", unread: false }
  ],

  // 1. Secret Director's Cut (Unlocked only when ALL friend episodes are unlocked)
  directorsCut: {
    title: "Pranay: Season 20 — The Director's Cut (Uncensored)",
    subtitle: "The Classified Vault Footage & Raw Brotherhood Behind the 20-Year Saga",
    badge: "100% SQUAD UNLOCKED EXCLUSIVE",
    video: "/video/directors-cut.mp4",
    poster: "/photos/directors-cut-poster.jpg",
    directorNote: `To anyone watching this: you've unlocked every friend's secret code.

That means you know Pranay through the eyes of the people who love him most. This Director's Cut isn't just bloopers or extra footage — it's 19 years of unscripted loyalty, shared laughter, midnight tea stalls, and brotherly pride. 

Building PRANAYFLIX was our way of showing that while seasons end, the brotherhood never does. Pranay, welcome to Season 20. The best plotlines are still unwritten.

— Janmesh Roida (Director)`,
    commentary: [
      { timestamp: "00:15", title: "Why Episode 1 almost didn't make the cut", note: "Pranay was sleeping during the original audition." },
      { timestamp: "01:20", title: "The secret origin of 'Bas 5 minute'", note: "First documented in 2014, still ongoing as of today." },
      { timestamp: "02:45", title: "Janmesh's closing note to the squad", note: "Whatever happens in Season 20 stays in Season 20." }
    ],
    secretPhotos: [
      "/photos/directors-cut/01.jpg",
      "/photos/directors-cut/02.jpg",
      "/photos/directors-cut/03.jpg"
    ]
  },

  // 2. Deleted Scenes (Bloopers, embarrassing photos, voice notes, chat screenshots)
  deletedScenes: [
    {
      id: "del_baby",
      title: "Baby Pranay: Season 1 Prototype (2007)",
      type: "photo",
      file: "/photos/pranay/baby-season1.jpg",
      tag: "Baby Pranay Vault",
      duration: "2007 Archival Cut",
      caption: "The world premiere in 2007. Bindi on forehead, gazing at his 1st birthday cake in pure wonder. Completely innocent before discovering memes and cutting chai."
    },
    {
      id: "del_squad_mirror",
      title: "The Elevator Mirror Syndicate (Uncensored)",
      type: "photo",
      file: "/photos/squad/elevator-squad-heart.jpg",
      tag: "Squad Archive",
      duration: "S19 Golden Reel",
      caption: "Classified proof that no elevator mirror in the city was safe from this crew. 4 friends, 1 elevator, 100 takes to get the aesthetic right."
    },
    {
      id: "del_boys_night",
      title: "The Triad: Janmesh, Pranay & Squad",
      type: "photo",
      file: "/photos/squad/boys-squad.jpg",
      tag: "Brothers' Vault",
      duration: "Midnight Archives",
      caption: "Black shirt, waffle knit, and white tee. Standing tall through exams, midnight chai runs, and lifelong bro code."
    },
    {
      id: "del_janmesh_reel",
      title: "Janmesh & Pranay: The Brotherhood Reel",
      type: "video",
      file: "/video/janmesh-pranay.mp4",
      tag: "Brothers' Reel",
      duration: "Exclusive Reel",
      caption: "Unfiltered laughter, inside jokes, and the true bond between Janmesh and Pranay live in motion."
    },
    {
      id: "del_specs",
      title: "The Intellectual Phase (Philosopher Era)",
      type: "photo",
      file: "/photos/pranay/specs-aesthetic.jpg",
      tag: "Vintage Aesthetic",
      duration: "9:17 PM Friday",
      caption: "Round glasses, intense side glance, and thinking about absolutely nothing. Peak teenage aesthetic."
    },
    {
      id: "del_bike",
      title: "The Midnight Bike Rider (Behind the Scenes)",
      type: "photo",
      file: "/photos/pranay/bike-hero.jpg",
      tag: "Rider Arc",
      duration: "Midnight Chronicles",
      caption: "Sitting on the machine like he owns the highway. Real story: he was just waiting for the tea stall to open."
    },
    {
      id: "del_mandap",
      title: "Sanskaari Pranay: Mandap Special",
      type: "photo",
      file: "/photos/pranay/traditional-mandap.jpg",
      tag: "Festive Vault",
      duration: "Home Archive",
      caption: "Full white kurta and veshti with Lord Ganesha. 10/10 sanskaari boy ready to ask for 5 extra modaks."
    },
    {
      id: "del_gym",
      title: "The Iron Temple: Uncensored Gains",
      type: "photo",
      file: "/photos/pranay/gym-physique.jpg",
      tag: "Fitness Vault",
      duration: "Peak Bulk",
      caption: "Mirror selfie after hitting arms and chest. High protein, heavy lifting, and manifesting the Greek god physique for Season 20."
    },
    {
      id: "del_nature",
      title: "Pastoral Serenity: Cow Petting Arc",
      type: "photo",
      file: "/photos/pranay/nature-calf.jpg",
      tag: "Peace Vault",
      duration: "Golden Hour",
      caption: "Out in the fields under clear blue skies, showing his soft side by gently petting a baby calf. Total inner calm and village therapy."
    },
    {
      id: "del_kurta",
      title: "Classical Poet: Chikankari Mirror Reflection",
      type: "photo",
      file: "/photos/pranay/bw-kurta.jpg",
      tag: "Vintage Monochrome",
      duration: "Poet Cut",
      caption: "Black and white portrait in a detailed chikankari embroidered kurta. Giving royal lineage and soulful shayari energy."
    },
    {
      id: "del_01",
      title: "The 2:00 AM WhatsApp Meltdown",
      type: "chat", // 'chat' | 'audio' | 'video' | 'photo'
      file: "/photos/deleted/chat01.jpg",
      tag: "Leaked Chat",
      duration: "2021 Archives",
      caption: "Proof that Pranay sent 14 voice notes explaining why 8 hours of sleep is a scam, then passed out mid-sentence."
    },
    {
      id: "del_02",
      title: "Candid Voice Note: 'Bhai Bas 2 Minute'",
      type: "audio",
      file: "/audio/deleted/voicenote01.mp3",
      tag: "Audio Leak",
      duration: "0:38",
      caption: "Recorded live at 7:45 PM while he was still brushing his teeth. Swore on his life he was already at the auto stand."
    },
    {
      id: "del_03",
      title: "The Failed Gym Arc (Blooper Reel)",
      type: "video",
      file: "/video/deleted/gym_blooper.mp4",
      tag: "Blooper Reel",
      duration: "0:45",
      caption: "Day 1 of the new fitness era. Lasted exactly 14 minutes before navigating directly to the nearest shawarma stall."
    },
    {
      id: "del_04",
      title: "Classified 10th Standard Passport Photo",
      type: "photo",
      file: "/photos/deleted/awkward_photo.jpg",
      tag: "Embarrassing Archive",
      duration: "Level 5 Clearance",
      caption: "A haircut certified by the UN as a biological hazard. Stored in an encrypted vault for national security."
    },
    {
      id: "del_05",
      title: "Late Night G-Meet Conspiracy Theories",
      type: "chat",
      file: "/photos/deleted/gmeet_screenshot.jpg",
      tag: "Group Screenshot",
      duration: "Lockdown Era",
      caption: "Him convincing the entire group at 3 AM that Bermuda Triangle is just a giant cosmic Wi-Fi router."
    }
  ],

  // 3. Season 30 Time Capsule (Locked until 10 Nov 2036)
  timeCapsule: {
    unlockAt: "2036-11-10T00:00:00+05:30", // 10 Nov 2036 (Pranay turning 30)
    title: "Season 30: The 10-Year Time Capsule",
    tagline: "Cryogenically sealed on 10 Nov 2026. Automated vault unlock at midnight 10 Nov 2036 IST.",
    sealedBy: "Janmesh Roida & The Pranayflix Squad",
    lockedMessage: "This vault is locked with 256-bit time encryption. Content will auto-decrypt when Pranay hits the big 3-0.",
    janmeshLetter: `Dear 30-Year-Old Pranay,

If you're reading this, a decade has passed since I built PRANAYFLIX for your 20th birthday in 2026.

I hope by now you've figured out what mutual funds actually are. I hope your back doesn't hurt as much as we joked it would. And most importantly, I hope you're still the same fiercely loyal, hilarious, genuine guy you were at 20.

No matter where life took us in these 10 years — whether we're neighbors or across oceans, whether you're running a company or still waking up at noon on Sundays — remember that what we built over chai and late-night drives was real and permanent.

Happy 30th Birthday, brother. Go hug your family, call the squad, and remember that Season 30 is just another blockbuster chapter.

— Janmesh Roida`,
    predictions: [
      {
        friend: "Aryan Sharma",
        role: "The Strategist",
        prediction: "Will definitely drive an EV, complain about lumbar support, and will still say 'Bhai 5 minute me aa raha hu'."
      },
      {
        friend: "Rohan Varma",
        role: "Roast Master",
        prediction: "Will have started 4 different startup ideas and abandoned every one of them for a 3 PM afternoon nap."
      },
      {
        friend: "Tanvi Deshmukh",
        role: "Voice of Reason",
        prediction: "Will finally learn how to file income tax, but will still call Janmesh in a panic 10 minutes before the deadline."
      },
      {
        friend: "Kabir Patel",
        role: "Minister of Fun",
        prediction: "Will be married with a golden retriever, passionately explaining to his kids why 2010s Bollywood songs are peak human culture."
      }
    ]
  },

  // 4. Your Year in Review (Spotify Wrapped / Story-style card set)
  yearInReview: {
    year: "2026",
    title: "Pranay: Season 19 Wrapped",
    subtitle: "Your official stats from the last 365 days of teenage chaos",
    stories: [
      {
        id: "stat_1",
        category: "TOP VOCABULARY",
        badge: "VERBAL HABIT #1",
        stat: "4,218",
        label: "Times you said 'Bhai' this year",
        detail: "That's an average of 11.5 'Bhais' per waking hour. Your vocal cords are 92% bro-energy.",
        gradient: "from-red-900 via-rose-950 to-black",
        accent: "#E50914",
        icon: "MessageCircle"
      },
      {
        id: "stat_2",
        category: "FITNESS & LIFESTYLE",
        badge: "GYM SAGA",
        stat: "342 : 3",
        label: "Gym sessions planned vs. Gym sessions attended",
        detail: "Top reasons cited for missing: 'The weather was emotionally draining' and 'Protein shaker was in the wash'.",
        gradient: "from-amber-900 via-orange-950 to-black",
        accent: "#F59E0B",
        icon: "Dumbbell"
      },
      {
        id: "stat_3",
        category: "COMMUNICATION SPEED",
        badge: "WHATSAPP METRICS",
        stat: "14 Days",
        label: "Average WhatsApp reply latency",
        detail: "Fastest reply on record: 2.8 seconds (when Janmesh asked 'Chai peene chal raha hai kya?').",
        gradient: "from-purple-900 via-indigo-950 to-black",
        accent: "#8B5CF6",
        icon: "Clock"
      },
      {
        id: "stat_4",
        category: "FUEL CONSUMPTION",
        badge: "NUTRITIONAL PROFILE",
        stat: "847 Cups",
        label: "Cutting chai consumed with the squad",
        detail: "You are single-handedly stabilizing the local tapri's quarterly revenue and GDP.",
        gradient: "from-emerald-900 via-teal-950 to-black",
        accent: "#10B981",
        icon: "Coffee"
      },
      {
        id: "stat_5",
        category: "SERIES STATUS",
        badge: "OFFICIAL MILESTONE",
        stat: "100%",
        label: "Completion of Teenage Years",
        detail: "19 Seasons in the vault. Season 20 officially premiered worldwide on PRANAYFLIX.",
        gradient: "from-rose-950 via-red-900 to-black",
        accent: "#E50914",
        icon: "Sparkles"
      }
    ]
  },

  credits: {
    director: "Janmesh Roida",
    starring: "Pranay (as Himself)",
    supportingCast: "Aryan Sharma, Rohan Varma, Kabir Patel, Tanvi Deshmukh & The Family",
    genre: "Biographical Comedy / Drama / 20-Year Chaos",
    studio: "PRANAYFLIX Original Productions",
    thanks: "Special thanks to everyone who tolerated Pranay's jokes and lent him money over the past 19 years. No actual feelings were harmed in the making of Season 20."
  }
};

