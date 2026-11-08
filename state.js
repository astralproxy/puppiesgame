// --- CONSTS ---
const GATHER_INTERVAL = 1000; // 1 second in milliseconds
const STRAY_JOIN_CHANCE = 0.1;
const JOB_UNLOCK_TREATS = 5;
const BUILDING_UNLOCK_KENNEL = 20;
const TAB_CONTENT_HEIGHT = '480px';
const WINDOW_WIDTH_THRESHOLD = 768; // 768px and up is considered wide screen

// --- GAME STATE ---
let game = {
    lastSaveName: 'My Save',
    
    /* PUPPY STATE
        - total: number of puppies in the pack
        - max: maximum number of puppies allowed
        - morale: overall happiness and well-being of the pack
            - 
        - consumptionRate: amount of kibble consumed per puppy per second
    */
    pups: {
        total: 0,
        max: 0,
        morale: 1.0,
        consumptionRate: 0.2 // kibble consumed per pup/sec
    },

    /* RESOURCE DEFINITIONS and USES
        - KIBBLE: fed to puppies to maintain morale
        - STICKS: used for building and upgrading infrastructure
            - DIRT: used with sticks to build advanced structures
        - BONES: unlocks additional crafting options
        - TREATS: used to teach Tricks
        - TRINKET: trade for cosmetics that may or may not have effects
    */
    resources: {
        kibble: { amount: 20, max: 100, unlocked: true, label: 'Kibble', icon: 'fa-bowl-rice', color: 'text-supply' },
        sticks: { amount: 0, max: 100, unlocked: true, label: 'Sticks', icon: 'fa-cubes', color: 'text-supply' },
        dirt: { amount: 0, max: 100, unlocked: false, label: 'Dirt Clods', icon: 'fa-mound', color: 'text-supply' },
        bones: { amount: 0, max: 100, unlocked: false, label: 'Bones', icon: 'fa-bone', color: 'text-supply' },
        treats: { amount: 0, max: 100, unlocked: false, label: 'Treats', icon: 'fa-cookie', color: 'text-supply' },
        // trinket: { amount: 0, max: 100, unlocked: false, label: 'Trinket', icon: 'fa-gem', color: 'text-supply' },
    },

    /* JOB DESCRIPTIONS
        - FORAGER: gathers kibble for eating/morale
        - FETCHER: gathers sticks for building
        - BEGGAR: begs for treats to teach tricks
        - DIGGER: digs up dirt and bones for crafting
    */
    jobs: {
        forager: { count: 0, unlocked: true,  label: 'Forager', icon: 'fa-bowl-rice',   yields: { kibble: 0.3 } },
        fetcher: { count: 0, unlocked: false, label: 'Fetcher', icon: 'fa-cubes',       yields: { sticks: 0.2 } },
        beggar:  { count: 0, unlocked: false, label: 'Beggar',  icon: 'fa-cookie',      yields: { treats: 0.1 } },
        digger:  { count: 0, unlocked: false, label: 'Digger',  icon: 'fa-mound',       yields: { dirt: 0.1, bones: 0.01 } }
    },

    /* BUILDINGS
        - DOGHOUSE: increases puppy capacity
        - WOODPILE: increases stick storage
        - FOODBIN: increases kibble storage
        - HOLE: unlocks deeper digging and storage
        - TREATBIN: increases treat storage
        - KENNEL: increases puppy capacity
    */
    buildings: {
        doghouse: { count: 0, unlocked: true, label: 'Doghouse', desc: '+1 Pup capacity', cost: { sticks: 10 }, icon: 'fa-house-user' },
        foodbin: { count: 0, unlocked: true, label: 'Food Bin', desc: '+Kibble storage', cost: { sticks: 15 }, icon: 'fa-utensils' },
        woodpile: { count: 0, unlocked: true, label: 'Stick Shed', desc: '+Stick storage', cost: { sticks: 25 }, icon: 'fa-boxes-stacked' },
        hole: { count: 0, unlocked: false, label: 'Deep Hole', desc: 'Deeper dirt storage', cost: { sticks: 40, dirt: 10 }, icon: 'fa-bore-hole' },
        treatbin: { count: 0, unlocked: false, label: 'Treat Bin', desc: '+Treat storage', cost: { sticks: 80 }, icon: 'fa-utensils' },
        kennel: { count: 0, unlocked: false, label: 'Kennel', desc: '+3 Pup capacity', cost: { sticks: 100, dirt: 20 }, icon: 'fa-warehouse' }
    },

    /* TRICKS
        - FETCH TECHNIQUES: teaches puppies to bring back sticks
        - EXCAVATION: allows digging up mud, dirt, and hidden bones
        - ZOOMIES: increases all puppy efficiency by 10%
        - PLAYDEAD: reduces kibble consumption by 10%
        - SCENT: shortens the time for strays to join the pack
        - ZOOMIES2: increases all puppy efficiency by another 10%
        - SCRAPS: decreases kibble reliance by 20%
    */
    tricks: {
        fetchTechniques: { teached: false, unlocked: false, label: 'Fetch!', desc: 'Teach puppies to bring back sticks.', cost: { treats: 10 }, unlocks: ['jobs.fetcher'] },
        excavation: { teached: false, unlocked: false, label: 'Excavation', desc: 'Allow digging up dirt and bones.', cost: { treats: 25 }, unlocks: ['resources.dirt', 'resources.bones', 'jobs.digger', 'buildings.hole'] },
        zoomies: { teached: false, unlocked: false, label: 'Zoomies', desc: 'Increase all puppy efficiency by 10%.', cost: { treats: 50 }, effectMultiplier: 1.1 },
        selfcontrol: { teached: false, unlocked: false, label: 'Self-Control', desc: 'Control your cravings, make room for more treats.', cost: { treats: 80 }, unlocks: ['buildings.treatbin'] },
        playdead: { teached: false, unlocked: false, label: 'Play Dead', desc: 'Reduce kibble consumption by 10%.', cost: { treats: 100 }, effectMultiplier: 0.9 },
        scent: { teached: false, unlocked: false, label: 'Scent Tracking', desc: 'Shortens the time for strays to join the pack.', cost: { treats: 120 }, effectMultiplier: 2.0 },
        zoomies2: { teached: false, unlocked: false, label: 'Zoomies Too', desc: 'Increase all puppy efficiency by another 10%.', cost: { treats: 200 }, effectMultiplier: 1.1 },
        scraps: { teached: false, unlocked: false, label: 'Table Scraps', desc: 'Decrease kibble reliance by 20%.', cost: { treats: 200 }, effectMultiplier: 0.8 },
    },

    /* CRAFTS
        - TREAT: baked from kibble to boost puppy morale
    */
    crafts: {
        treat: { unlocked: false, label: 'Baked Treat', cost: { kibble: 25 }, yields: { treats: 1 }, icon: 'fa-cookie' },
        // chewtoy: { unlocked: false, label: 'Chew Toy', cost: { sticks: 25, bones: 5 }, yields: { trinket: 1 }, icon: 'fa-cookie' }
    }
};