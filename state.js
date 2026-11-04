// --- GAME STATE ---
let game = {
    lastSaveName: 'My Save',
    
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
        - SCIENCE: used for researching technologies
    */
    resources: {
        kibble: { amount: 20, max: 100, unlocked: true, label: 'Kibble', icon: 'fa-bowl-rice', color: 'text-amber-400' },
        sticks: { amount: 0, max: 100, unlocked: true, label: 'Sticks', icon: 'fa-cubes', color: 'text-stone-400' },
        dirt: { amount: 0, max: 100, unlocked: false, label: 'Dirt Clods', icon: 'fa-mound', color: 'text-yellow-700' },
        bones: { amount: 0, max: 50, unlocked: false, label: 'Bones', icon: 'fa-bone', color: 'text-card-header' },
        treats: { amount: 0, max: 20, unlocked: false, label: 'Treats', icon: 'fa-cookie', color: 'text-amber-300' },
        science: { amount: 0, max: 200, unlocked: false, label: 'Science', icon: 'fa-book-open', color: 'text-blue-400' }
    },

    /* JOB DESCRIPTIONS
        - FORAGER: gathers kibble
        - FETCHER: gathers sticks
        - DIGGER: digs up dirt and bones
        - SCHOLAR: researches science
    */
    jobs: {
        forager: { count: 0, unlocked: true, label: 'Forager', desc: '+0.8 Kibble/s', icon: 'fa-wheat-awn' },
        fetcher: { count: 0, unlocked: false, label: 'Fetcher', desc: '+0.5 Sticks/s', icon: 'fa-tree' },
        digger: { count: 0, unlocked: false, label: 'Digger', desc: '+0.3 Dirt, +0.05 Bones/s', icon: 'fa-shovels' },
        scholar: { count: 0, unlocked: false, label: 'Wise Pup', desc: '+0.25 Science/s', icon: 'fa-graduation-cap' }
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
        fetchTechniques: { researched: false, unlocked: true, label: 'Fetch Training', desc: 'Teaches puppies to bring back sticks.', cost: { science: 10 }, unlocks: ['jobs.fetcher'] },
        excavation: { researched: false, unlocked: false, label: 'Backyard Excavation', desc: 'Allows digging up mud, dirt, and hidden bones.', cost: { science: 25 }, unlocks: ['resources.dirt', 'resources.bones', 'jobs.digger', 'buildings.quarry'] },
        doggyWisdom: { researched: false, unlocked: false, label: 'Canine Philosophy', desc: 'Unlocks Wise Pup job for rapid research.', cost: { science: 15 }, unlocks: ['jobs.scholar'] },
        packTactics: { researched: false, unlocked: false, label: 'Pack Tactics', desc: 'Increases all worker pup efficiency by 20%.', cost: { science: 50 }, effectMultiplier: 1.2 }
    },

    /* CRAFTS
        - TREAT: baked from kibble to boost puppy morale
    */
    crafts: {
        treat: { unlocked: false, label: 'Bake Treat', cost: { kibble: 25 }, yields: { treats: 1 }, icon: 'fa-cookie' }
    }
};