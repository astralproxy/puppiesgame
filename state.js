// --- CONSTS ---
let JOB_UNLOCK_SNOOZER = 10;

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
            - TREATS: used to boost puppy morale
        - STICKS: used for building and upgrading infrastructure
            - DIRT: used with sticks to build advanced structures
        - BONES: unlocks additional crafting options
    */
    resources: {
        kibble: { amount: 20, max: 100, unlocked: true, label: 'Kibble', icon: 'fa-bowl-rice', color: 'text-supply' },
        treats: { amount: 0, max: 20, unlocked: false, label: 'Treats', icon: 'fa-cookie', color: 'text-supply' },
        sticks: { amount: 0, max: 100, unlocked: true, label: 'Sticks', icon: 'fa-cubes', color: 'text-supply' },
        dirt: { amount: 0, max: 100, unlocked: false, label: 'Dirt Clods', icon: 'fa-mound', color: 'text-supply' },
        bones: { amount: 0, max: 50, unlocked: false, label: 'Bones', icon: 'fa-bone', color: 'text-supply' },
        upgrades: { amount: 0, max: 200, unlocked: false, label: 'Upgrades', icon: 'fa-upgrade', color: 'text-supply' }
    },

    /* JOB DESCRIPTIONS
        - FORAGER: gathers kibble for eating/morale
        - FETCHER: gathers sticks for building
        - SNOOZER: dreams up new ideas for things to make
        - DIGGER: digs up dirt and bones for crafting
    */
    jobs: {
        forager: { count: 0, unlocked: true,  label: 'Forager', icon: 'fa-wheat-awn',   yields: { kibble: 0.2 } },
        fetcher: { count: 0, unlocked: false, label: 'Fetcher', icon: 'fa-tree',        yields: { sticks: 0.2 } },
        snoozer: { count: 0, unlocked: false, label: 'Snoozer', icon: 'fa-bed',         yields: { upgrades: 0.1 } },
        digger:  { count: 0, unlocked: false, label: 'Digger',  icon: 'fa-shovels',     yields: { dirt: 0.1, bones: 0.01 } }
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
        woodpile: { count: 0, unlocked: true, label: 'Stick Shed', desc: '+100 Stick Storage', cost: { sticks: 25 }, icon: 'fa-boxes-stacked' },
        feeder: { count: 0, unlocked: true, label: 'Kibble Bowl', desc: '+100 Kibble Storage', cost: { sticks: 15 }, icon: 'fa-utensils' },
        quarry: { count: 0, unlocked: false, label: 'Dirt Hole', desc: 'Unlocks deeper digging & storage', cost: { sticks: 40, dirt: 10 }, icon: 'fa-mountain' },
        kennel: { count: 0, unlocked: false, label: 'Kennel', desc: '+2 Pup Capacity', cost: { sticks: 75, dirt: 30 }, icon: 'fa-warehouse' }
    },

    /* TECHNOLOGY
        - FETCH TECHNIQUES: teaches puppies to bring back sticks
        - EXCAVATION: allows digging up mud, dirt, and hidden bones
        - DOGGY WISDOM: unlocks Wise Pup job for rapid research
        - PACK TACTICS: increases all worker pup efficiency by 20%
    */
    tech: {
        fetchTechniques: { researched: false, unlocked: true, label: 'Fetch Training', desc: 'Teaches puppies to bring back sticks.', cost: { upgrades: 10 }, unlocks: ['jobs.fetcher'] },
        excavation: { researched: false, unlocked: false, label: 'Backyard Excavation', desc: 'Allows digging up mud, dirt, and hidden bones.', cost: { upgrades: 25 }, unlocks: ['resources.dirt', 'resources.bones', 'jobs.digger', 'buildings.quarry'] },
        packTactics: { researched: false, unlocked: false, label: 'Zoomies', desc: 'Increases all worker pup efficiency by 20%.', cost: { upgrades: 50 }, effectMultiplier: 1.2 },
        fetchTechniques2: { researched: false, unlocked: true, label: 'Fetch Training 2', desc: 'Enhance puppies to bring back sticks.', cost: { upgrades: 10 }, unlocks: ['jobs.fetcher'] },
        excavation22: { researched: false, unlocked: false, label: 'Backyard Excavation 2', desc: 'Enhance digging up mud, dirt, and hidden bones.', cost: { upgrades: 25 }, unlocks: ['resources.dirt', 'resources.bones', 'jobs.digger', 'buildings.quarry'] },
        packTactics: { researched: false, unlocked: false, label: 'Zoomies 2', desc: 'Enhance worker pup efficiency by 20%.', cost: { upgrades: 50 }, effectMultiplier: 1.2 }
    },

    /* CRAFTS
        - TREAT: baked from kibble to boost puppy morale
    */
    crafts: {
        treat: { unlocked: false, label: 'Bake Treat', cost: { kibble: 25 }, yields: { treats: 1 }, icon: 'fa-cookie' }
    }
};