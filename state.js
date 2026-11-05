// --- CONSTS ---
const JOB_UNLOCK_BEGGAR = 10;
const TAB_CONTENT_HEIGHT = '480px';

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
    */
    resources: {
        kibble: { amount: 20, max: 100, unlocked: true, label: 'Kibble', icon: 'fa-bowl-rice', color: 'text-supply' },
        sticks: { amount: 0, max: 100, unlocked: true, label: 'Sticks', icon: 'fa-cubes', color: 'text-supply' },
        dirt: { amount: 0, max: 100, unlocked: false, label: 'Dirt Clods', icon: 'fa-mound', color: 'text-supply' },
        bones: { amount: 0, max: 100, unlocked: false, label: 'Bones', icon: 'fa-bone', color: 'text-supply' },
        treats: { amount: 0, max: 100, unlocked: false, label: 'Treats', icon: 'fa-cookie', color: 'text-supply' },
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
        - FEEDER: increases kibble storage
        - QUARRY: unlocks deeper digging and storage
        - KENNEL: increases puppy capacity
    */
    buildings: {
        doghouse: { count: 0, unlocked: true, label: 'Doghouse', desc: '+1 Pup Capacity', cost: { sticks: 10 }, icon: 'fa-house-user' },
        feeder: { count: 0, unlocked: true, label: 'Food Container', desc: '+100 Kibble Storage', cost: { sticks: 15 }, icon: 'fa-utensils' },
        woodpile: { count: 0, unlocked: true, label: 'Stick Shed', desc: '+100 Stick Storage', cost: { sticks: 25 }, icon: 'fa-boxes-stacked' },
        quarry: { count: 0, unlocked: false, label: 'Dirt Hole', desc: 'Unlocks deeper digging & storage', cost: { sticks: 40, dirt: 10 }, icon: 'fa-mountain' },
        kennel: { count: 0, unlocked: false, label: 'Kennel', desc: '+3 Pup Capacity', cost: { sticks: 75, dirt: 30 }, icon: 'fa-warehouse' }
    },

    /* TRICKS
        - FETCH TECHNIQUES: teaches puppies to bring back sticks
        - EXCAVATION: allows digging up mud, dirt, and hidden bones
        - DOGGY WISDOM: unlocks Wise Pup job for rapid research
        - PACK TACTICS: increases all worker pup efficiency by 20%
    */
    tricks: {
        fetchTechniques: { teached: false, unlocked: false, label: 'Fetch Training', desc: 'Teach puppies to bring back sticks.', cost: { treats: 10 }, unlocks: ['jobs.fetcher'] },
        excavation: { teached: false, unlocked: false, label: 'Backyard Excavation', desc: 'Allow digging up dirt and bones.', cost: { treats: 25 }, unlocks: ['resources.dirt', 'resources.bones', 'jobs.digger', 'buildings.quarry'] },
        zoomies: { teached: false, unlocked: false, label: 'Zoomies', desc: 'Increase all puppy efficiency by 20%.', cost: { treats: 50 }, effectMultiplier: 1.2 },
        zoomies2: { teached: false, unlocked: false, label: 'Zoomies', desc: 'Increase all puppy efficiency by 20%.', cost: { treats: 50 }, effectMultiplier: 1.5 },
    },

    /* CRAFTS
        - TREAT: baked from kibble to boost puppy morale
    */
    crafts: {
        treat: { unlocked: false, label: 'Bake Treat', cost: { kibble: 25 }, yields: { treats: 1 }, icon: 'fa-cookie' }
    }
};