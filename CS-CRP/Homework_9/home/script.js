/* =================================================================
   CartoonVerse — script.js
   Full Interactive Implementation for all 12 Tabs across 4 Worlds,
   PokéAPI Live Network, Mini-Games, Quizzes, Search & Discovery.
   ================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ───────────────────────────────────────────────────────────────
     1. STARFIELD
     ─────────────────────────────────────────────────────────────── */
  const starfield = document.getElementById("starfield");
  if (starfield) {
    const STAR_COUNT = 150;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < STAR_COUNT; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = 1 + Math.random() * 2.2;
      s.style.width  = size + "px";
      s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top  = Math.random() * 100 + "%";
      s.style.setProperty("--tw-dur", (2 + Math.random() * 4).toFixed(1) + "s");
      s.style.setProperty("--tw-del", (Math.random() * 5).toFixed(1) + "s");
      frag.appendChild(s);
    }

    starfield.appendChild(frag);
  }

  /* ───────────────────────────────────────────────────────────────
     2. FLOATING PARTICLES
     ─────────────────────────────────────────────────────────────── */
  const particlesEl = document.getElementById("particles");
  if (particlesEl) {
    const PARTICLE_COUNT = 30;
    const colors = [
      "rgba(0,188,212,0.45)",
      "rgba(255,64,129,0.4)",
      "rgba(255,179,0,0.4)",
      "rgba(118,255,3,0.38)",
      "rgba(30,136,229,0.4)"
    ];
    const frag = document.createDocumentFragment();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = 3 + Math.random() * 7;
      p.style.width  = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top  = (55 + Math.random() * 45) + "%";
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty("--fl-dur", (9 + Math.random() * 16).toFixed(1) + "s");
      p.style.setProperty("--fl-del", (Math.random() * 12).toFixed(1) + "s");
      frag.appendChild(p);
    }

    particlesEl.appendChild(frag);
  }

  /* ───────────────────────────────────────────────────────────────
     3. NAVBAR — scroll effect & active highlighting
     ─────────────────────────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("navMenu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });

    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("open") &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("open");
      }
    });
  }

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let currentId   = "";

    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        if (href === "#" + currentId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ───────────────────────────────────────────────────────────────
     4. SCROLL REVEAL & PORTAL HOVER
     ─────────────────────────────────────────────────────────────── */
  const revealTargets = document.querySelectorAll(
    ".world-card, .char-card, .qa-card, .section-header, .detail-header, .detail-intro, .back-link"
  );
  revealTargets.forEach(el => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );
    revealTargets.forEach(el => revealObs.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("visible"));
  }

  const scrollHint = document.getElementById("scrollHint");
  if (scrollHint) {
    let hintHidden = false;
    window.addEventListener("scroll", () => {
      if (!hintHidden && window.scrollY > 100) {
        scrollHint.style.opacity = "0";
        scrollHint.style.transition = "opacity 0.5s";
        hintHidden = true;
      }
    }, { passive: true });
  }

  const portalStage = document.querySelector(".portal-stage");
  const portal      = document.querySelector(".portal");
  if (portalStage && portal) {
    portalStage.addEventListener("mouseenter", () => {
      portal.style.transition = "transform 0.5s ease";
      portal.style.transform  = "scale(1.08)";
    });
    portalStage.addEventListener("mouseleave", () => {
      portal.style.transform = "scale(1)";
    });
  }

  const worldCards = document.querySelectorAll(".world-card");
  worldCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * -6;
      const tiltY = ((x - cx) / cx) * 6;
      card.style.transform = "translateY(-10px) perspective(600px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ───────────────────────────────────────────────────────────────
     5. CHARACTER SEARCH & FILTERING & RANDOM SPOTLIGHT
     ─────────────────────────────────────────────────────────────── */
  const charSearch      = document.getElementById("charSearch");
  const clearSearchBtn  = document.getElementById("clearSearchBtn");
  const filterPills     = document.querySelectorAll(".filter-pill");
  const charCards       = document.querySelectorAll(".char-card");
  const noResultsMsg    = document.getElementById("noResultsMsg");
  const resetFilterBtn  = document.getElementById("resetFilterBtn");

  let currentFilter = "all";

  function applyFilters() {
    const query = charSearch ? charSearch.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    if (clearSearchBtn) {
      clearSearchBtn.style.display = query.length > 0 ? "block" : "none";
    }

    charCards.forEach(card => {
      const world = card.dataset.world || "";
      const name  = card.dataset.name  || "";
      const tags  = card.dataset.tags  || "";
      const text  = (card.textContent || "").toLowerCase();

      const matchesWorld = (currentFilter === "all" || world === currentFilter);
      const matchesQuery = !query ||
                           name.toLowerCase().includes(query) ||
                           tags.toLowerCase().includes(query) ||
                           text.includes(query);

      if (matchesWorld && matchesQuery) {
        card.classList.remove("hidden");
        card.classList.add("visible");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0) noResultsMsg.classList.remove("hidden");
      else noResultsMsg.classList.add("hidden");
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
      filterPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentFilter = pill.dataset.filter || "all";
      applyFilters();
    });
  });

  if (charSearch)     charSearch.addEventListener("input", applyFilters);
  if (clearSearchBtn) clearSearchBtn.addEventListener("click", () => {
    charSearch.value = "";
    applyFilters();
    charSearch.focus();
  });
  if (resetFilterBtn) resetFilterBtn.addEventListener("click", () => {
    if (charSearch) charSearch.value = "";
    filterPills.forEach(p => {
      if (p.dataset.filter === "all") p.classList.add("active");
      else p.classList.remove("active");
    });
    currentFilter = "all";
    applyFilters();
  });

  const btnRandomChar   = document.getElementById("btnRandomChar");
  const spotlightCard   = document.getElementById("spotlightCard");
  const spotlightClose  = document.getElementById("spotlightClose");
  const spotlightIcon   = document.getElementById("spotlightIcon");
  const spotlightWorld  = document.getElementById("spotlightWorld");
  const spotlightName   = document.getElementById("spotlightName");
  const spotlightDesc   = document.getElementById("spotlightDesc");
  const spotlightTraits = document.getElementById("spotlightTraits");

  const worldLabelMap = {
    doraemon:  "Doraemon World",
    powerpuff: "Powerpuff Girls World",
    pokemon:   "Pokémon World",
    tomjerry:  "Tom & Jerry World"
  };

  if (btnRandomChar && spotlightCard) {
    btnRandomChar.addEventListener("click", () => {
      const visibleCards = Array.from(charCards).filter(c => !c.classList.contains("hidden"));
      const pool = visibleCards.length > 0 ? visibleCards : Array.from(charCards);
      if (pool.length === 0) return;

      const randomCard = pool[Math.floor(Math.random() * pool.length)];
      const iconEl  = randomCard.querySelector(".char-icon");
      const nameEl  = randomCard.querySelector(".char-name");
      const descEl  = randomCard.querySelector(".char-desc");
      const worldId = randomCard.dataset.world || "doraemon";
      const badges  = randomCard.querySelectorAll(".badge");

      if (spotlightIcon)  spotlightIcon.textContent  = iconEl ? iconEl.textContent : "🌟";
      if (spotlightName)  spotlightName.textContent  = nameEl ? nameEl.textContent : "Mystery Hero";
      if (spotlightDesc)  spotlightDesc.textContent  = descEl ? descEl.textContent : "";
      if (spotlightWorld) spotlightWorld.textContent = worldLabelMap[worldId] || "Multiverse Character";

      if (spotlightTraits) {
        spotlightTraits.innerHTML = "";
        badges.forEach(b => {
          const traitSpan = document.createElement("span");
          traitSpan.className = "trait";
          traitSpan.textContent = b.textContent;
          spotlightTraits.appendChild(traitSpan);
        });
      }

      const accentMap = {
        doraemon:  "#1976d2",
        powerpuff: "#ff4081",
        pokemon:   "#e53935",
        tomjerry:  "#ffb300"
      };
      spotlightCard.style.borderColor = accentMap[worldId] || "#ff4081";
      spotlightCard.classList.remove("hidden");
      spotlightCard.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (spotlightClose) {
      spotlightClose.addEventListener("click", () => {
        spotlightCard.classList.add("hidden");
      });
    }
  }

  /* ───────────────────────────────────────────────────────────────
     6. GENERIC WORLD TAB SWITCHER
     ─────────────────────────────────────────────────────────────── */
  const tabBars = document.querySelectorAll(".world-tabs");
  tabBars.forEach(bar => {
    const buttons = bar.querySelectorAll(".tab-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const targetId = btn.dataset.tab;
        const parentDetail = bar.closest(".world-detail");
        if (parentDetail) {
          const panes = parentDetail.querySelectorAll(".tab-pane");
          panes.forEach(pane => {
            if (pane.id === targetId) {
              pane.classList.add("active");
            } else {
              pane.classList.remove("active");
            }
          });
        }
      });
    });
  });

  /* ───────────────────────────────────────────────────────────────
     7. DORAEMON — TAB 1: GADGET EXPLORER
     ─────────────────────────────────────────────────────────────── */
  const gadgets = [
    {
      id: "anywhere-door",
      icon: "🚪",
      name: "Anywhere Door",
      short: "Step through to any destination up to 10 light years away.",
      desc: "Turn the brass knob and visualize your destination. The door accesses spatial coordinates through dimensional folding to transport users anywhere instantaneously.",
      range: "10 Light Years",
      rule: "Clear mental image required",
      fact: "Cannot teleport to locations without a prior spatial record in its database."
    },
    {
      id: "take-copter",
      icon: "🚁",
      name: "Take-copter",
      short: "Pocket-sized anti-gravity rotor attaches directly to your head.",
      desc: "Placed firmly on the crown of your head, the Take-copter creates a localised anti-gravity cushion, allowing flight speeds of up to 80 km/h for 4 continuous hours.",
      range: "80 km/h / 4 Hours",
      rule: "Battery needs recharge after 4h",
      fact: "Over 2 billion units were sold in the 22nd century as daily commute tools."
    },
    {
      id: "time-machine",
      icon: "⏳",
      name: "Time Machine",
      short: "Hidden in Nobita's desk drawer, navigates the space-time flow.",
      desc: "Travel to prehistoric dinosaur eras or hyper-futuristic cities. Uses a dimensional warp rudder to sail across the temporal vortex without causing space-time paradoxes.",
      range: "Infinite Timeline",
      rule: "Temporal Police jurisdiction applies",
      fact: "Nobita accidentally parked it in the Cretaceous period over a dozen times."
    },
    {
      id: "small-light",
      icon: "🔦",
      name: "Small Light",
      short: "Flashlight that shrinks objects and living beings to miniature scale.",
      desc: "Emits sub-atomic compression waves. Shining it on any target reduces its volume down to bug size while retaining relative muscle mass and intellect.",
      range: "Line of Sight Beam",
      rule: "Reversible with the Big Light",
      fact: "Frequently used to turn Nobita's bedroom into a vast driving racetrack."
    },
    {
      id: "translation-gummy",
      icon: "🍬",
      name: "Translation Gummy",
      short: "Delicious jelly that allows you to speak and understand any language.",
      desc: "Eat a single cube of this sweet confection, and your brain instantly interprets and articulates any foreign, alien, or prehistoric animal dialect seamlessly.",
      range: "Universal Dialects",
      rule: "Must be swallowed whole",
      fact: "Available in grape, strawberry, and dorayaki bean flavours!"
    },
    {
      id: "memory-bread",
      icon: "🍞",
      name: "Memory Bread",
      short: "Press bread onto textbook pages, eat it, and memorize everything.",
      desc: "Copies mathematical formulas, history dates, and foreign vocabulary when pressed onto page text. Eating the bread transfers 100% of the data directly into your memory.",
      range: "1 Page per Slice",
      rule: "Digesting flushes the memory",
      fact: "Nobita once ate 40 slices before an exam and developed an upset stomach!"
    },
    {
      id: "dress-up-camera",
      icon: "📷",
      name: "Dress-Up Camera",
      short: "Insert a photo or drawing of clothing, snap a picture to wear it.",
      desc: "Draw any costume or outfit on a sheet of paper, slide it into the camera's slot, and photograph your friend. The clothes manifest instantly onto their body.",
      range: "Instant Transformation",
      rule: "Blank paper results in no clothes!",
      fact: "Shizuka loves using it for instant winter princess dresses."
    },
    {
      id: "pass-loop",
      icon: "⭕",
      name: "Pass Loop",
      short: "Stick this ring on any solid wall to create an instant doorway.",
      desc: "A super-adhesive dimensional ring. Slap it onto vaults, brick walls, or mountain rock, and the center turns into an open passage through any solid material.",
      range: "Walls up to 3m thick",
      rule: "Remove the ring to close passage",
      fact: "Used by Nobita to escape Gian and Suneo during games of hide-and-seek."
    }
  ];

  const gadgetGrid = document.getElementById("gadgetGrid");
  const gadgetModal = document.getElementById("gadgetModal");
  const gadgetModalClose = document.getElementById("gadgetModalClose");
  const gadgetModalIcon = document.getElementById("gadgetModalIcon");
  const gadgetModalTitle = document.getElementById("gadgetModalTitle");
  const gadgetModalDesc = document.getElementById("gadgetModalDesc");
  const gadgetModalRange = document.getElementById("gadgetModalRange");
  const gadgetModalRule = document.getElementById("gadgetModalRule");
  const gadgetModalFact = document.getElementById("gadgetModalFact");
  const btnSurpriseGadget = document.getElementById("btnSurpriseGadget");

  function openGadgetModal(g) {
    if (!gadgetModal) return;
    if (gadgetModalIcon)  gadgetModalIcon.textContent  = g.icon;
    if (gadgetModalTitle) gadgetModalTitle.textContent = g.name;
    if (gadgetModalDesc)  gadgetModalDesc.textContent  = g.desc;
    if (gadgetModalRange) gadgetModalRange.textContent = g.range;
    if (gadgetModalRule)  gadgetModalRule.textContent  = g.rule;
    if (gadgetModalFact)  gadgetModalFact.textContent  = "💡 Fun Fact: " + g.fact;
    gadgetModal.classList.remove("hidden");
  }

  if (gadgetGrid) {
    gadgets.forEach(g => {
      const card = document.createElement("div");
      card.className = "gadget-card";
      card.innerHTML = `
        <div class="gadget-icon">${g.icon}</div>
        <h4>${g.name}</h4>
        <p>${g.short}</p>
        <span class="gadget-inspect-btn">View Blueprint →</span>
      `;
      card.addEventListener("click", () => openGadgetModal(g));
      gadgetGrid.appendChild(card);
    });
  }

  if (gadgetModalClose && gadgetModal) {
    gadgetModalClose.addEventListener("click", () => gadgetModal.classList.add("hidden"));
    gadgetModal.addEventListener("click", (e) => {
      if (e.target === gadgetModal) gadgetModal.classList.add("hidden");
    });
  }

  if (btnSurpriseGadget) {
    btnSurpriseGadget.addEventListener("click", () => {
      const rand = gadgets[Math.floor(Math.random() * gadgets.length)];
      openGadgetModal(rand);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     8. DORAEMON — TAB 2: WHAT IF MACHINE
     ─────────────────────────────────────────────────────────────── */
  const whatIfSolutions = {
    "late-school": {
      gadget: "The Anywhere Door",
      icon: "🚪",
      how: "Step through the pink door straight from your bedside into your homeroom chair with 2 minutes to spare!",
      outcome: "Perfect attendance preserved! Teacher is amazed at your punctuality."
    },
    "forgot-homework": {
      gadget: "Time Machine & Memory Bread",
      icon: "⏳",
      how: "Rewind time 30 minutes, press Memory Bread onto the notebook, eat the slice, and re-write the answers perfectly!",
      outcome: "Earned an unexpected A+ from the teacher!"
    },
    "rainy-picnic": {
      gadget: "The Weather Box & Mood Sun",
      icon: "☀️",
      how: "Insert the 'Sunny Day' cartridge into the Weather Box to create a 500-meter radiant sky dome over the park.",
      outcome: "Picnic saved! Warm sunshine, singing birds, and dry sandwiches."
    },
    "bully-gian": {
      gadget: "Translation Gummy & Compliment Microphone",
      icon: "🎤",
      how: "Sing an auto-tuned duet through the microphone, convincing Gian that friendship beats wrestling!",
      outcome: "Gian invites you to eat dorayaki instead of a wrestling match."
    },
    "messy-room": {
      gadget: "Mini-Doraemon Cleaning Squad",
      icon: "🧹",
      how: "Release two miniature red Doraemons with pocket vacuums to organize every comic and sock in 60 seconds.",
      outcome: "Mom opens the door, gasps at the spotless room, and hands you pocket money!"
    },
    "animal-talk": {
      gadget: "Animal Translation Biscuit",
      icon: "🐕",
      how: "Feed one bone-shaped biscuit to the dog and eat one yourself to hold a deep philosophical conversation.",
      outcome: "Discovered the dog was simply complaining that the mailman wears funny hats!"
    },
    "bored-weekend": {
      gadget: "Storybook Shoes & Submarine Paper",
      icon: "🏝️",
      how: "Step into the enchanted shoes and jump directly into the pages of 'Treasure Island' for real adventures.",
      outcome: "Discovered pirate treasure before dinnertime!"
    }
  };

  const problemSelect    = document.getElementById("problemSelect");
  const btnRandomProblem = document.getElementById("btnRandomProblem");
  const solIcon          = document.getElementById("solIcon");
  const solName          = document.getElementById("solName");
  const solHow           = document.getElementById("solHow");
  const solOutcome       = document.getElementById("solOutcome");

  function updateWhatIf() {
    if (!problemSelect) return;
    const val = problemSelect.value;
    const data = whatIfSolutions[val] || whatIfSolutions["late-school"];
    if (solIcon)    solIcon.textContent    = data.icon;
    if (solName)    solName.textContent    = data.gadget;
    if (solHow)     solHow.textContent     = data.how;
    if (solOutcome) solOutcome.innerHTML   = `<strong>Result:</strong> ${data.outcome}`;
  }

  if (problemSelect) problemSelect.addEventListener("change", updateWhatIf);
  if (btnRandomProblem && problemSelect) {
    btnRandomProblem.addEventListener("click", () => {
      const keys = Object.keys(whatIfSolutions);
      const randKey = keys[Math.floor(Math.random() * keys.length)];
      problemSelect.value = randKey;
      updateWhatIf();
    });
  }

  /* ───────────────────────────────────────────────────────────────
     9. DORAEMON — TAB 3: ANYWHERE DOOR
     ─────────────────────────────────────────────────────────────── */
  const destinations = [
    {
      id: "moon",
      name: "The Moon Rabbit Kingdom",
      coord: "Coordinates: Luna Basin Sector 4",
      desc: "Travel to the far side of the moon where mochi-pounding lunar rabbits have constructed an invisible bio-dome filled with anti-gravity jumps.",
      fact: "Nobita used the Badge of Trust so he and his friends could breathe on the lunar surface without spacesuits!",
      art: "🌕 🐇 🚀",
      bg: "radial-gradient(circle at center, #fff9c4 0%, #1a237e 75%)"
    },
    {
      id: "atlantis",
      name: "Underwater Atlantis City",
      coord: "Coordinates: Mariana Trench Deep-Sea Lab",
      desc: "Dive 11,000 meters beneath the waves into an ancient sunken metropolis powered by luminous bio-crystals and guarded by friendly giant manta rays.",
      fact: "Protected by Doraemon's Water-Repelling Rope, allowing dry walking on the seabed!",
      art: "🌊 🏛️ 🐬",
      bg: "radial-gradient(circle at center, #80deea 0%, #006064 75%)"
    },
    {
      id: "tokyo-2126",
      name: "Futuristic Tokyo 2126",
      coord: "Coordinates: Neo Shibuya Cyber-Zone",
      desc: "Experience flying solar-skycars, robotic cat cafés, holographic skyscrapers, and Matsushiba robot department stores in Doraemon's birth century.",
      fact: "This is where Doraemon was manufactured on September 3, 2112!",
      art: "🏙️ 🛸 ⚡",
      bg: "radial-gradient(circle at center, #ff80ab 0%, #311b92 75%)"
    },
    {
      id: "dino-island",
      name: "Prehistoric Dinosaur Island",
      coord: "Coordinates: Jurassic Epoch 150M BC",
      desc: "Step out into a prehistoric jungle of giant ferns and towering Brachiosaurus herds where Nobita's dinosaur friend Pisuke roams free.",
      fact: "Doraemon tamed wild T-Rexes using Momotaro's Delicious Taming Dumplings!",
      art: "🦕 🌴 🌋",
      bg: "radial-gradient(circle at center, #ffcc80 0%, #2e7d32 75%)"
    },
    {
      id: "clouds",
      name: "The Cloud Kingdom",
      coord: "Coordinates: Stratosphere Haven 10,000m",
      desc: "Walk on solidified cumulus clouds using Cloud Solidifier Spray, building castles, swimming in cloud pools, and sliding down rainbow bridges.",
      fact: "The Cloud kingdom has its own weather railway powered by friendly cloud engines!",
      art: "☁️ 🏰 🌈",
      bg: "radial-gradient(circle at center, #ffffff 0%, #0288d1 75%)"
    }
  ];

  const destPills   = document.getElementById("destPills");
  const destName    = document.getElementById("destName");
  const destCoord   = document.getElementById("destCoord");
  const destDesc    = document.getElementById("destDesc");
  const destFact    = document.getElementById("destFact");
  const destBg      = document.getElementById("destBg");
  const btnTeleport = document.getElementById("btnTeleport");
  const btnRandomDest = document.getElementById("btnRandomDestination");
  const destPortalFrame = document.querySelector(".dest-portal-frame");

  function setDestination(d) {
    if (destName)  destName.textContent  = d.name;
    if (destCoord) destCoord.textContent = d.coord;
    if (destDesc)  destDesc.textContent  = d.desc;
    if (destFact)  destFact.innerHTML   = `<strong>💡 Cosmic Lore:</strong> ${d.fact}`;
    if (destBg) {
      destBg.style.background = d.bg;
      destBg.textContent = d.art;
    }
  }

  if (destPills) {
    destinations.forEach((d, idx) => {
      const pill = document.createElement("button");
      pill.className = "dest-pill" + (idx === 0 ? " active" : "");
      pill.textContent = d.name;
      pill.addEventListener("click", () => {
        destPills.querySelectorAll(".dest-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        setDestination(d);
      });
      destPills.appendChild(pill);
    });
  }

  if (btnRandomDest) {
    btnRandomDest.addEventListener("click", () => {
      const pills = destPills ? destPills.querySelectorAll(".dest-pill") : [];
      const randIdx = Math.floor(Math.random() * destinations.length);
      if (pills[randIdx]) pills[randIdx].click();
    });
  }

  if (btnTeleport && destPortalFrame) {
    btnTeleport.addEventListener("click", () => {
      destPortalFrame.classList.add("open");
      btnTeleport.textContent = "Teleporting...";
      setTimeout(() => {
        destPortalFrame.classList.remove("open");
        btnTeleport.innerHTML = "<span>✨</span> Step Through The Door";
      }, 2000);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     10. POWERPUFF GIRLS — TAB 1: VILLAIN DATABASE
     ─────────────────────────────────────────────────────────────── */
  const villains = [
    {
      id: "mojo",
      icon: "🧠",
      name: "Mojo Jojo",
      threat: "Threat Level: OMEGA",
      threatClass: "threat-omega",
      short: "Simian super-genius armed with giant lasers and convoluted speeches.",
      desc: "Formerly Professor Utonium's laboratory chimpanzee before Chemical X mutated his brain. Driven by jealousy, Mojo engineers towering mechanical robots and laser fortresses to destroy the Powerpuff Girls.",
      power: "Hyper-Cognitive Intellect & Robotics",
      hideout: "Volcano Observatory atop Townsville",
      weakness: "Over-explaining schemes redundantly",
      quote: `"I am Mojo Jojo! You must listen to the words that are spoken by me, for I am the evil one who will conquer Townsville!"`
    },
    {
      id: "him",
      icon: "😈",
      name: "HIM",
      threat: "Threat Level: OMEGA",
      threatClass: "threat-omega",
      short: "Sinister entity of psychological torment, nightmares, and dark magic.",
      desc: "The most menacing adversary in Townsville. Speaks in an eerie dual falsetto and deep voice. Attacks the girls through psychological manipulation, illusions, and dimensional distortions.",
      power: "Reality Warping & Demonic Sorcery",
      hideout: "The Crimson Netherdome",
      weakness: "Overpowering love, joy, and laughter",
      quote: `"Oh, how simply delightful! The precious little heroines are tearing themselves apart!"`
    },
    {
      id: "fuzzy",
      icon: "🪕",
      name: "Fuzzy Lumpkins",
      threat: "Threat Level: ALPHA",
      threatClass: "threat-alpha",
      short: "Country monster who flies into berserker rages when property is touched.",
      desc: "A hot-tempered pink hillbilly creature with antenna ears and a beloved banjo. Extremely territorial—anyone who steps onto his property or disturbs his jam-making faces unbridled destructive fury.",
      power: "Primal Berserk Super-Strength",
      hideout: "Deep Townsville Woods Cabin",
      weakness: "Poor manners and banjo duels",
      quote: `"GET OFF'N MAH PROPERTY! NOBODY TOUCHES MAH BANJO!"`
    },
    {
      id: "princess",
      icon: "👑",
      name: "Princess Morbucks",
      threat: "Threat Level: ALPHA",
      threatClass: "threat-alpha",
      short: "Spoiled billionaire schoolgirl who buys high-tech combat exosuits.",
      desc: "An arrogant kindergartner who was refused membership as the fourth Powerpuff Girl. Since she cannot possess superpowers naturally, her billionaire father buys her weaponized gold mech suits and laser crowns.",
      power: "Infinite Wealth & Weaponized Exosuits",
      hideout: "The Morbucks Gilded Manor",
      weakness: "Ego tantrums and kindergarten detention",
      quote: `"DADDY! Buy me Townsville so I can outlaw the Powerpuff Girls forever!"`
    },
    {
      id: "gangreen",
      icon: "🧟",
      name: "The Gangreen Gang",
      threat: "Threat Level: MENACE",
      threatClass: "threat-menace",
      short: "Green-skinned teen delinquents headed by the prankster Ace.",
      desc: "Ace, Snake, Lil' Arturo, Grubber, and Big Billy. A squad of green-skinned juvenile pranksters who loiter in junkyards, rig pinball machines, and cause municipal chaos across the city.",
      power: "Street-Brawling & Sneak Attacks",
      hideout: "Townsville Municipal Junkyard",
      weakness: "Easily frightened by Buttercup's fists",
      quote: `"Hey girls, look what we got! Time to trash Townsville park!"`
    },
    {
      id: "sedusa",
      icon: "🐍",
      name: "Sedusa",
      threat: "Threat Level: ALPHA",
      threatClass: "threat-alpha",
      short: "Master of disguise with living, prehensile combat hair.",
      desc: "A cunning jewel thief and master of disguise who manipulates the Mayor and Professor Utonium. Her long hair acts as sentient, razor-sharp whips capable of crushing bank vaults.",
      power: "Prehensile Whip-Hair & Deception",
      hideout: "Luxury Penthouse Suite",
      weakness: "Hair scissors and shampoo traps",
      quote: `"Brains, beauty, and brawn—I have it all, little girls!"`
    }
  ];

  const villainGrid = document.getElementById("villainGrid");
  const villainModal = document.getElementById("villainModal");
  const villainModalClose = document.getElementById("villainModalClose");
  const villainModalIcon = document.getElementById("villainModalIcon");
  const villainModalName = document.getElementById("villainModalName");
  const villainThreat = document.getElementById("villainThreat");
  const villainModalDesc = document.getElementById("villainModalDesc");
  const villainModalPower = document.getElementById("villainModalPower");
  const villainModalHideout = document.getElementById("villainModalHideout");
  const villainModalWeakness = document.getElementById("villainModalWeakness");
  const villainModalQuote = document.getElementById("villainModalQuote");
  const btnRandomVillain = document.getElementById("btnRandomVillain");

  function openVillainModal(v) {
    if (!villainModal) return;
    if (villainModalIcon)  villainModalIcon.textContent  = v.icon;
    if (villainModalName)  villainModalName.textContent  = v.name;
    if (villainThreat) {
      villainThreat.textContent = v.threat;
      villainThreat.className = "modal-tag danger-tag " + v.threatClass;
    }
    if (villainModalDesc)  villainModalDesc.textContent  = v.desc;
    if (villainModalPower) villainModalPower.textContent = v.power;
    if (villainModalHideout) villainModalHideout.textContent = v.hideout;
    if (villainModalWeakness) villainModalWeakness.textContent = v.weakness;
    if (villainModalQuote) villainModalQuote.textContent = v.quote;
    villainModal.classList.remove("hidden");
  }

  if (villainGrid) {
    villains.forEach(v => {
      const card = document.createElement("div");
      card.className = "villain-card";
      card.innerHTML = `
        <div class="villain-avatar">${v.icon}</div>
        <span class="villain-threat-badge ${v.threatClass}">${v.threat}</span>
        <h4>${v.name}</h4>
        <p>${v.short}</p>
        <span class="gadget-inspect-btn" style="color:#ff4081;">Inspect Dossier →</span>
      `;
      card.addEventListener("click", () => openVillainModal(v));
      villainGrid.appendChild(card);
    });
  }

  if (villainModalClose && villainModal) {
    villainModalClose.addEventListener("click", () => villainModal.classList.add("hidden"));
    villainModal.addEventListener("click", (e) => {
      if (e.target === villainModal) villainModal.classList.add("hidden");
    });
  }

  if (btnRandomVillain) {
    btnRandomVillain.addEventListener("click", () => {
      const rand = villains[Math.floor(Math.random() * villains.length)];
      openVillainModal(rand);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     11. POWERPUFF GIRLS — TAB 2: MISSION CONTROL
     ─────────────────────────────────────────────────────────────── */
  const missions = [
    {
      title: "Mojo Jojo's Giant Mech Downtown",
      brief: "Mojo Jojo is marching a 100-foot robot down Townsville Main Street, aiming a laser at the pickle factory! The citizens need immediate evacuation and tactical response.",
      choices: [
        {
          tag: "Blossom's Tactic",
          tagClass: "tag-blossom",
          text: "Formulate a pincer attack: Freeze the robot's hydraulic coolant vents with Ice Breath!",
          outcome: "Flawless victory! The freeze shattered the joints, causing the mech to collapse into scrap safely. Mojo was jailed!",
          score: "Townsville Safety: 100% — Tactical Perfection!"
        },
        {
          tag: "Bubbles' Approach",
          tagClass: "tag-bubbles",
          text: "Use sonic scream to vibrate the robot's cockpit and disorient Mojo's controls!",
          outcome: "Success! Mojo became dizzy, hit the wrong eject button, and landed straight in the police van!",
          score: "Townsville Safety: 95% — Zero civilian injuries!"
        },
        {
          tag: "Buttercup's Assault",
          tagClass: "tag-buttercup",
          text: "Punch directly through the titanium knee joint at Mach 5 speed!",
          outcome: "Total knockout! The mech flipped into an abandoned lot. Buttercup caught the pickle factory sign just in time!",
          score: "Townsville Safety: 92% — A few cracked sidewalks, but victory!"
        }
      ]
    },
    {
      title: "Fuzzy Lumpkins Takes Over City Hall",
      brief: "Fuzzy Lumpkins broke into the Mayor's office because a Townsville billboard cast a shadow over his tomato patch! He is holding the Mayor and Miss Bellum hostage with a boomstick.",
      choices: [
        {
          tag: "Blossom's Tactic",
          tagClass: "tag-blossom",
          text: "Present Fuzzy with an official mayoral decree declaring his cabin an independent sovereign tomato reserve!",
          outcome: "Brilliant diplomatic solution! Fuzzy happily signed the peace treaty and walked back to his woods with a jar of pickles.",
          score: "Townsville Safety: 100% — Zero damage caused!"
        },
        {
          tag: "Bubbles' Approach",
          tagClass: "tag-bubbles",
          text: "Bring an orphaned woodland squirrel to appeal to Fuzzy's secretly gentle heart!",
          outcome: "Fuzzy broke into tears of joy hugging the squirrel, dropping his weapon immediately!",
          score: "Townsville Safety: 98% — Heartwarming resolution!"
        },
        {
          tag: "Buttercup's Assault",
          tagClass: "tag-buttercup",
          text: "Bust in through the skylight, kick the boomstick away, and tie Fuzzy in a pretzel knot!",
          outcome: "Fuzzy was instantly overpowered before he could pull the trigger! The Mayor rewarded the girls with golden medals.",
          score: "Townsville Safety: 94% — One broken skylight repaired by noon."
        }
      ]
    },
    {
      title: "Princess Morbucks Buys Chemical X",
      brief: "Princess Morbucks bribed an underground research supplier and acquired a canister of unstable Chemical X. She is threatening to mutate the school playground into gold statues!",
      choices: [
        {
          tag: "Blossom's Tactic",
          tagClass: "tag-blossom",
          text: "Hack Princess's credit line through Townsville Bank, freezing her funds before the transaction clears!",
          outcome: "Masterstroke! The seller took back the canister when her card declined, and the police arrested both villains!",
          score: "Townsville Safety: 100% — Cleanest white-collar bust ever!"
        },
        {
          tag: "Bubbles' Approach",
          tagClass: "tag-bubbles",
          text: "Convince Princess that real friendship and playground fun cannot be bought with gold statues!",
          outcome: "Princess paused, shed a tear, dropped the canister safely, and joined the kindergarten hopscotch game!",
          score: "Townsville Safety: 99% — Emotional victory!"
        },
        {
          tag: "Buttercup's Assault",
          tagClass: "tag-buttercup",
          text: "Dive-bomb at supersonic speed, snatch the canister mid-air, and punt Princess into a sandbox!",
          outcome: "Chemical X secured safely in Professor Utonium's lead container! Princess grounded for 3 months.",
          score: "Townsville Safety: 96% — Playground completely intact!"
        }
      ]
    }
  ];

  let currentMissionIdx = 0;
  const missionTitle   = document.getElementById("missionTitle");
  const missionIdTag   = document.getElementById("missionIdTag");
  const missionBrief   = document.getElementById("missionBrief");
  const missionChoices = document.getElementById("missionChoices");
  const missionResult  = document.getElementById("missionResult");
  const resTitle       = document.getElementById("resTitle");
  const resDesc        = document.getElementById("resDesc");
  const resScore       = document.getElementById("resScore");
  const btnNextMission = document.getElementById("btnNextMission");

  function renderMission(idx) {
    const m = missions[idx];
    if (!m) return;
    if (missionIdTag) missionIdTag.textContent = `MISSION ${idx + 1} / ${missions.length}`;
    if (missionTitle) missionTitle.textContent = m.title;
    if (missionBrief) missionBrief.textContent = m.brief;
    if (missionResult) missionResult.classList.add("hidden");

    if (missionChoices) {
      missionChoices.innerHTML = "";
      missionChoices.classList.remove("hidden");
      m.choices.forEach(ch => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerHTML = `
          <span class="choice-heroine-tag ${ch.tagClass}">${ch.tag}</span>
          <span>${ch.text}</span>
        `;
        btn.addEventListener("click", () => {
          missionChoices.classList.add("hidden");
          if (missionResult) {
            missionResult.classList.remove("hidden");
            if (resTitle) resTitle.textContent = "Townsville Saved!";
            if (resDesc)  resDesc.textContent  = ch.outcome;
            if (resScore) resScore.textContent = ch.score;
          }
        });
        missionChoices.appendChild(btn);
      });
    }
  }

  if (missionTitle) renderMission(0);

  if (btnNextMission) {
    btnNextMission.addEventListener("click", () => {
      currentMissionIdx = (currentMissionIdx + 1) % missions.length;
      renderMission(currentMissionIdx);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     12. POWERPUFF GIRLS — TAB 3: POWER TEST QUIZ
     ─────────────────────────────────────────────────────────────── */
  const quizQuestions = [
    {
      q: "When a rampaging monster attacks downtown, what is your primary move?",
      opts: [
        { text: "Analyze the monster's anatomy, coordinate a squad pincer, and freeze its weapon.", hero: "blossom" },
        { text: "Try talking to it first! Maybe it's just scared, lost, or needs a warm hug.", hero: "bubbles" },
        { text: "Charge straight at its jaw and punch it with full strength before it even blinks!", hero: "buttercup" }
      ]
    },
    {
      q: "Your best friend is having a difficult day. How do you comfort them?",
      opts: [
        { text: "Create an organized to-do plan and help them solve every problem logically.", hero: "blossom" },
        { text: "Bake colorful cupcakes, give them a fluffy stuffed octopus, and sing together.", hero: "bubbles" },
        { text: "Take them outside, teach them how to throw a baseball, and punch a boxing bag.", hero: "buttercup" }
      ]
    },
    {
      q: "What is your favorite weekend pastime?",
      opts: [
        { text: "Reading classic novels, studying science books, and organizing my desk.", hero: "blossom" },
        { text: "Drawing with crayons, visiting the animal shelter, and playing with puppies.", hero: "bubbles" },
        { text: "Skateboarding at high speed, rock climbing, and playing contact sports.", hero: "buttercup" }
      ]
    },
    {
      q: "Choose your signature superpower:",
      opts: [
        { text: "Cryokinetic Ice Breath and tactical supersonic flight.", hero: "blossom" },
        { text: "Supersonic sonic scream and communicating with all animal species.", hero: "bubbles" },
        { text: "Raw indestructible physical power and lightning-fast brawling.", hero: "buttercup" }
      ]
    }
  ];

  const quizIntro       = document.getElementById("quizIntro");
  const quizQuestionBox = document.getElementById("quizQuestionBox");
  const quizResultBox   = document.getElementById("quizResultBox");
  const btnStartQuiz    = document.getElementById("btnStartQuiz");
  const btnRetakeQuiz   = document.getElementById("btnRetakeQuiz");
  const quizProgressFill = document.getElementById("quizProgressFill");
  const quizQNum        = document.getElementById("quizQNum");
  const quizQText       = document.getElementById("quizQText");
  const quizOptions     = document.getElementById("quizOptions");
  const quizResAvatar   = document.getElementById("quizResAvatar");
  const quizResName     = document.getElementById("quizResName");
  const quizResDesc     = document.getElementById("quizResDesc");
  const quizResTraits   = document.getElementById("quizResTraits");

  let quizStep = 0;
  const quizScores = { blossom: 0, bubbles: 0, buttercup: 0 };

  function renderQuizQuestion(idx) {
    const qData = quizQuestions[idx];
    if (!qData) return;
    if (quizQNum) quizQNum.textContent = `Question ${idx + 1} of ${quizQuestions.length}`;
    if (quizQText) quizQText.textContent = qData.q;
    if (quizProgressFill) quizProgressFill.style.width = ((idx + 1) / quizQuestions.length * 100) + "%";

    if (quizOptions) {
      quizOptions.innerHTML = "";
      qData.opts.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "quiz-opt-btn";
        btn.textContent = opt.text;
        btn.addEventListener("click", () => {
          quizScores[opt.hero]++;
          if (idx + 1 < quizQuestions.length) {
            quizStep++;
            renderQuizQuestion(quizStep);
          } else {
            showQuizResult();
          }
        });
        quizOptions.appendChild(btn);
      });
    }
  }

  function showQuizResult() {
    if (quizQuestionBox) quizQuestionBox.classList.add("hidden");
    if (quizResultBox)   quizResultBox.classList.remove("hidden");

    let winner = "blossom";
    if (quizScores.bubbles > quizScores.blossom && quizScores.bubbles >= quizScores.buttercup) {
      winner = "bubbles";
    } else if (quizScores.buttercup > quizScores.blossom && quizScores.buttercup > quizScores.bubbles) {
      winner = "buttercup";
    }

    const heroProfiles = {
      blossom: {
        avatar: "🎀",
        name: "You are BLOSSOM!",
        desc: "You are the commander and leader! Natural strategist, intelligent, disciplined, and responsible. When pressure rises, you keep a cool head and freeze problems with Ice Breath!",
        traits: ["Tactical Mind", "Ice Breath", "Natural Leader", "Signature Red Bow"]
      },
      bubbles: {
        avatar: "🫧",
        name: "You are BUBBLES!",
        desc: "You are the joy and laughter! Sweet, kind, deeply empathetic, and a friend to all living creatures. But mess with your loved ones and your supersonic scream will shatter mountains!",
        traits: ["Pure Compassion", "Sonic Scream", "Speaks Animal", "Hardcore Joy"]
      },
      buttercup: {
        avatar: "🥊",
        name: "You are BUTTERCUP!",
        desc: "You are the toughest fighter! Pure spice, fearless, independent, and always ready to stand up for the little guy with thunderous fists. You back down from no challenge!",
        traits: ["Super Strength", "Fearless Fighter", "Direct Action", "Rebel Spirit"]
      }
    };

    const prof = heroProfiles[winner];
    if (quizResAvatar) quizResAvatar.textContent = prof.avatar;
    if (quizResName)   quizResName.textContent   = prof.name;
    if (quizResDesc)   quizResDesc.textContent   = prof.desc;
    if (quizResTraits) {
      quizResTraits.innerHTML = "";
      prof.traits.forEach(t => {
        const s = document.createElement("span");
        s.className = "trait";
        s.textContent = t;
        quizResTraits.appendChild(s);
      });
    }
  }

  if (btnStartQuiz) {
    btnStartQuiz.addEventListener("click", () => {
      quizStep = 0;
      quizScores.blossom = 0;
      quizScores.bubbles = 0;
      quizScores.buttercup = 0;
      if (quizIntro) quizIntro.classList.add("hidden");
      if (quizQuestionBox) quizQuestionBox.classList.remove("hidden");
      renderQuizQuestion(0);
    });
  }

  if (btnRetakeQuiz) {
    btnRetakeQuiz.addEventListener("click", () => {
      if (quizResultBox) quizResultBox.classList.add("hidden");
      if (quizIntro) quizIntro.classList.remove("hidden");
    });
  }

  /* ───────────────────────────────────────────────────────────────
     13. POKÉMON — TAB 1: 18 ELEMENTAL TYPES
     ─────────────────────────────────────────────────────────────── */
  const pokeTypes = [
    { name: "Fire", icon: "🔥", class: "bg-type-fire", strong: "Grass, Ice, Bug, Steel", weak: "Water, Ground, Rock", example: "Charizard, Arcanine, Cinderace", fact: "Fire-type Pokémon cannot be inflicted with the Burn status condition." },
    { name: "Water", icon: "💧", class: "bg-type-water", strong: "Fire, Ground, Rock", weak: "Electric, Grass", example: "Blastoise, Gyarados, Greninja", fact: "Water is the most common elemental type in the entire Pokédex." },
    { name: "Grass", icon: "🍃", class: "bg-type-grass", strong: "Water, Ground, Rock", weak: "Fire, Ice, Poison, Flying, Bug", example: "Venusaur, Sceptile, Meowscarada", fact: "Grass Pokémon are completely immune to powder and spore moves like Spore." },
    { name: "Electric", icon: "⚡", class: "bg-type-electric", strong: "Water, Flying", weak: "Ground", example: "Pikachu, Zapdos, Luxray", fact: "Electric Pokémon are completely immune to Paralysis!" },
    { name: "Psychic", icon: "🔮", class: "bg-type-psychic", strong: "Fighting, Poison", weak: "Bug, Ghost, Dark", example: "Mewtwo, Alakazam, Gardevoir", fact: "Dominated Generation 1 competitively with zero effective weaknesses." },
    { name: "Ice", icon: "❄️", class: "bg-type-ice", strong: "Grass, Ground, Flying, Dragon", weak: "Fire, Fighting, Rock, Steel", example: "Lapras, Articuno, Glaceon", fact: "Ice attacks are celebrated for devastating Dragon and Flying legendaries." },
    { name: "Dragon", icon: "🐉", class: "bg-type-dragon", strong: "Dragon", weak: "Ice, Dragon, Fairy", example: "Dragonite, Garchomp, Rayquaza", fact: "Known for possessing the highest base stat averages of all non-legendaries." },
    { name: "Dark", icon: "🌑", class: "bg-type-dark", strong: "Psychic, Ghost", weak: "Fighting, Bug, Fairy", example: "Umbreon, Tyranitar, Darkrai", fact: "Dark types are completely immune to Psychic-type offensive attacks." },
    { name: "Fairy", icon: "✨", class: "bg-type-fairy", strong: "Fighting, Dragon, Dark", weak: "Poison, Steel", example: "Sylveon, Togekiss, Zacian", fact: "Introduced in Gen 6 to balance Dragon dominance, boasting total Dragon immunity." },
    { name: "Ground", icon: "🏜️", class: "bg-type-ground", strong: "Fire, Electric, Poison, Rock, Steel", weak: "Water, Grass, Ice", example: "Groudon, Garchomp, Excadrill", fact: "Ground attacks like Earthquake are among the most popular competitive moves." },
    { name: "Flying", icon: "🪶", class: "bg-type-flying", strong: "Grass, Fighting, Bug", weak: "Electric, Ice, Rock", example: "Pidgeot, Corviknight, Talonflame", fact: "Flying types are immune to Ground-type attacks and Spikes hazards." },
    { name: "Fighting", icon: "🥊", class: "bg-type-fighting", strong: "Normal, Ice, Rock, Dark, Steel", weak: "Flying, Psychic, Fairy", example: "Lucario, Machamp, Urshifu", fact: "Tied with Ground for dealing super-effective damage to the most types (5)." },
    { name: "Rock", icon: "🪨", class: "bg-type-rock", strong: "Fire, Ice, Flying, Bug", weak: "Water, Grass, Fighting, Ground, Steel", example: "Tyranitar, Aerodactyl, Golem", fact: "Special Defense increases by 50% during a Sandstorm weather effect." },
    { name: "Steel", icon: "🛡️", class: "bg-type-steel", strong: "Ice, Rock, Fairy", weak: "Fire, Fighting, Ground", example: "Metagross, Scizor, Steelix", fact: "Boasts the best defensive profile in the game with 10 type resistances and 1 immunity!" },
    { name: "Bug", icon: "🐞", class: "bg-type-bug", strong: "Grass, Psychic, Dark", weak: "Fire, Flying, Rock", example: "Scizor, Volcarona, Heracross", fact: "Bug Pokémon evolve earlier than any other type, making them vital early-game allies." },
    { name: "Poison", icon: "🧪", class: "bg-type-poison", strong: "Grass, Fairy", weak: "Ground, Psychic", example: "Gengar, Toxapex, Nidoking", fact: "Cannot be poisoned, and Toxic move never misses when used by a Poison type." },
    { name: "Ghost", icon: "👻", class: "bg-type-ghost", strong: "Psychic, Ghost", weak: "Ghost, Dark", example: "Gengar, Mimikyu, Giratina", fact: "Ghost Pokémon cannot be trapped in battle by moves like Mean Look or Shadow Tag." },
    { name: "Normal", icon: "⚪", class: "bg-type-normal", strong: "None", weak: "Fighting", example: "Snorlax, Eevee, Slaking", fact: "Completely immune to Ghost-type attacks and boasts massive learnsets." }
  ];

  const typesGrid       = document.getElementById("typesGrid");
  const typeModal       = document.getElementById("typeModal");
  const typeModalClose  = document.getElementById("typeModalClose");
  const typeModalIcon   = document.getElementById("typeModalIcon");
  const typeModalTitle  = document.getElementById("typeModalTitle");
  const typeModalDesc   = document.getElementById("typeModalDesc");
  const typeModalStrong = document.getElementById("typeModalStrong");
  const typeModalWeak   = document.getElementById("typeModalWeak");
  const typeModalExample = document.getElementById("typeModalExample");
  const typeModalFact   = document.getElementById("typeModalFact");
  const btnRandomType   = document.getElementById("btnRandomType");

  function openTypeModal(t) {
    if (!typeModal) return;
    if (typeModalIcon)    typeModalIcon.textContent    = t.icon;
    if (typeModalTitle)   typeModalTitle.textContent   = t.name + " Type";
    if (typeModalDesc)    typeModalDesc.textContent    = `The ${t.name} type represents elemental energy with distinct tactical affinities and unique combat immunities.`;
    if (typeModalStrong)  typeModalStrong.textContent  = t.strong;
    if (typeModalWeak)    typeModalWeak.textContent    = t.weak;
    if (typeModalExample) typeModalExample.textContent = t.example;
    if (typeModalFact)    typeModalFact.textContent    = `💡 Trivia: ${t.fact}`;
    typeModal.classList.remove("hidden");
  }

  if (typesGrid) {
    pokeTypes.forEach(t => {
      const card = document.createElement("div");
      card.className = `type-card ${t.class}`;
      card.innerHTML = `
        <span class="type-icon">${t.icon}</span>
        <span class="type-name">${t.name}</span>
      `;
      card.addEventListener("click", () => openTypeModal(t));
      typesGrid.appendChild(card);
    });
  }

  if (typeModalClose && typeModal) {
    typeModalClose.addEventListener("click", () => typeModal.classList.add("hidden"));
    typeModal.addEventListener("click", (e) => {
      if (e.target === typeModal) typeModal.classList.add("hidden");
    });
  }

  if (btnRandomType) {
    btnRandomType.addEventListener("click", () => {
      const rand = pokeTypes[Math.floor(Math.random() * pokeTypes.length)];
      openTypeModal(rand);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     14. POKÉMON — TAB 2: GYMS & LEAGUES
     ─────────────────────────────────────────────────────────────── */
  const gymLeadersData = {
    kanto: [
      { city: "Pewter City", name: "Brock", type: "Rock", badge: "Boulder Badge", icon: "🪨", bg: "#78909c", ace: "Onix" },
      { city: "Cerulean City", name: "Misty", type: "Water", badge: "Cascade Badge", icon: "💧", bg: "#2196f3", ace: "Starmie" },
      { city: "Vermilion City", name: "Lt. Surge", type: "Electric", badge: "Thunder Badge", icon: "⚡", bg: "#fbc02d", ace: "Raichu" },
      { city: "Celadon City", name: "Erika", type: "Grass", badge: "Rainbow Badge", icon: "🌸", bg: "#4caf50", ace: "Vileplume" },
      { city: "Saffron City", name: "Sabrina", type: "Psychic", badge: "Marsh Badge", icon: "🔮", bg: "#e91e63", ace: "Alakazam" },
      { city: "Indigo Plateau", name: "Lance (Champion)", type: "Dragon", badge: "Kanto Champion", icon: "🐉", bg: "#673ab7", ace: "Dragonite" }
    ],
    johto: [
      { city: "Violet City", name: "Falkner", type: "Flying", badge: "Zephyr Badge", icon: "🪶", bg: "#7986cb", ace: "Pidgeotto" },
      { city: "Goldenrod City", name: "Whitney", type: "Normal", badge: "Plain Badge", icon: "🥛", bg: "#9e9e9e", ace: "Miltank (Rollout!)" },
      { city: "Ecruteak City", name: "Morty", type: "Ghost", badge: "Fog Badge", icon: "👻", bg: "#4527a0", ace: "Gengar" },
      { city: "Olivine City", name: "Jasmine", type: "Steel", badge: "Mineral Badge", icon: "🛡️", bg: "#607d8b", ace: "Steelix" },
      { city: "Blackthorn City", name: "Clair", type: "Dragon", badge: "Rising Badge", icon: "🐉", bg: "#673ab7", ace: "Kingdra" },
      { city: "Mt. Silver", name: "Red (Legend)", type: "All-Rounder", badge: "Living Legend", icon: "🏆", bg: "#d32f2f", ace: "Pikachu (Lv. 88)" }
    ],
    hoenn: [
      { city: "Rustboro City", name: "Roxanne", type: "Rock", badge: "Stone Badge", icon: "🪨", bg: "#78909c", ace: "Nosepass" },
      { city: "Dewford Town", name: "Brawly", type: "Fighting", badge: "Knuckle Badge", icon: "🥊", bg: "#b71c1c", ace: "Makuhita" },
      { city: "Petalburg City", name: "Norman", type: "Normal", badge: "Balance Badge", icon: "👨‍👦", bg: "#9e9e9e", ace: "Slaking" },
      { city: "Fortree City", name: "Winona", type: "Flying", badge: "Feather Badge", icon: "🪶", bg: "#7986cb", ace: "Altaria" },
      { city: "Mossdeep City", name: "Tate & Liza", type: "Psychic", badge: "Mind Badge", icon: "🔮", bg: "#e91e63", ace: "Lunatone & Solrock" },
      { city: "Ever Grande", name: "Steven Stone", type: "Steel", badge: "Hoenn Champion", icon: "💎", bg: "#455a64", ace: "Metagross (Mega)" }
    ],
    sinnoh: [
      { city: "Oreburgh City", name: "Roark", type: "Rock", badge: "Coal Badge", icon: "🪨", bg: "#78909c", ace: "Cranidos" },
      { city: "Eterna City", name: "Gardenia", type: "Grass", badge: "Forest Badge", icon: "🍃", bg: "#4caf50", ace: "Roserade" },
      { city: "Veilstone City", name: "Maylene", type: "Fighting", badge: "Cobble Badge", icon: "🥊", bg: "#b71c1c", ace: "Lucario" },
      { city: "Sunyshore City", name: "Volkner", type: "Electric", badge: "Beacon Badge", icon: "⚡", bg: "#fbc02d", ace: "Electivire" },
      { city: "Snowpoint City", name: "Candice", type: "Ice", badge: "Icicle Badge", icon: "❄️", bg: "#00bcd4", ace: "Froslass" },
      { city: "Sinnoh League", name: "Cynthia (Champion)", type: "Balanced / Dragon", badge: "Sinnoh Champion", icon: "👑", bg: "#212121", ace: "Garchomp" }
    ]
  };

  const gymGrid    = document.getElementById("gymGrid");
  const regionPills = document.querySelectorAll(".region-pill");

  function renderGyms(regionKey) {
    if (!gymGrid) return;
    gymGrid.innerHTML = "";
    const list = gymLeadersData[regionKey] || gymLeadersData.kanto;
    list.forEach(item => {
      const card = document.createElement("div");
      card.className = "gym-card";
      card.innerHTML = `
        <div class="gym-badge-avatar">${item.icon}</div>
        <span class="gym-city-tag">${item.city}</span>
        <h4 class="gym-leader-name">${item.name}</h4>
        <span class="gym-type-pill" style="background:${item.bg};">${item.type}</span>
        <div class="gym-ace">Badge: <strong>${item.badge}</strong></div>
        <div class="gym-ace" style="margin-top:0.3rem;">Ace Pokémon: <em>${item.ace}</em></div>
      `;
      gymGrid.appendChild(card);
    });
  }

  if (gymGrid) renderGyms("kanto");

  regionPills.forEach(pill => {
    pill.addEventListener("click", () => {
      regionPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderGyms(pill.dataset.region || "kanto");
    });
  });

  /* ───────────────────────────────────────────────────────────────
     15. POKÉMON — TAB 3: LIVE POKÉ-DATA (Real PokéAPI Integration)
     ─────────────────────────────────────────────────────────────── */
  const pokeApiSearchInput = document.getElementById("pokeApiSearchInput");
  const btnSearchPokeApi   = document.getElementById("btnSearchPokeApi");
  const btnRandomPokeApi   = document.getElementById("btnRandomPokeApi");
  const pokeLoading        = document.getElementById("pokeLoading");
  const pokeError          = document.getElementById("pokeError");
  const pokeErrorTitle     = document.getElementById("pokeErrorTitle");
  const pokeErrorMsg       = document.getElementById("pokeErrorMsg");
  const pokeDisplayCard    = document.getElementById("pokeDisplayCard");

  const pokeImg       = document.getElementById("pokeImg");
  const pokeIdTag     = document.getElementById("pokeIdTag");
  const pokeName      = document.getElementById("pokeName");
  const pokeTypesRow  = document.getElementById("pokeTypesRow");
  const pokeHeight    = document.getElementById("pokeHeight");
  const pokeWeight    = document.getElementById("pokeWeight");
  const pokeAbilities = document.getElementById("pokeAbilities");

  const statHp    = document.getElementById("statHp");
  const statAtk   = document.getElementById("statAtk");
  const statDef   = document.getElementById("statDef");
  const statSpAtk = document.getElementById("statSpAtk");
  const statSpDef = document.getElementById("statSpDef");
  const statSpd   = document.getElementById("statSpd");

  const fillHp    = document.getElementById("fillHp");
  const fillAtk   = document.getElementById("fillAtk");
  const fillDef   = document.getElementById("fillDef");
  const fillSpAtk = document.getElementById("fillSpAtk");
  const fillSpDef = document.getElementById("fillSpDef");
  const fillSpd   = document.getElementById("fillSpd");

  async function fetchPokeData(query) {
    if (!query) return;
    const cleanQuery = query.toString().trim().toLowerCase();
    if (!cleanQuery) return;

    if (pokeLoading)     pokeLoading.classList.remove("hidden");
    if (pokeError)       pokeError.classList.add("hidden");
    if (pokeDisplayCard) pokeDisplayCard.classList.add("hidden");

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanQuery}`);
      if (!response.ok) {
        throw new Error(`Pokémon "${cleanQuery}" not found.`);
      }
      const data = await response.json();
      renderLivePokemon(data);
    } catch (err) {
      if (pokeLoading) pokeLoading.classList.add("hidden");
      if (pokeError) {
        pokeError.classList.remove("hidden");
        if (pokeErrorTitle) pokeErrorTitle.textContent = "Pokémon Not Found";
        if (pokeErrorMsg)   pokeErrorMsg.textContent   = `Could not find "${cleanQuery}". Please check your spelling or try another number.`;
      }
    }
  }

  function renderLivePokemon(data) {
    if (pokeLoading) pokeLoading.classList.add("hidden");
    if (pokeError)   pokeError.classList.add("hidden");
    if (pokeDisplayCard) pokeDisplayCard.classList.remove("hidden");

    // Official artwork or standard sprite fallback
    const artUrl = data.sprites?.other?.["official-artwork"]?.front_default ||
                   data.sprites?.front_default ||
                   "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
    if (pokeImg) {
      pokeImg.src = artUrl;
      pokeImg.alt = data.name;
    }

    if (pokeIdTag) pokeIdTag.textContent = `#${String(data.id).padStart(4, "0")}`;
    if (pokeName)  pokeName.textContent  = data.name;

    // Types
    if (pokeTypesRow) {
      pokeTypesRow.innerHTML = "";
      data.types.forEach(t => {
        const typeBadge = document.createElement("span");
        typeBadge.className = `poke-type-badge type-${t.type.name}`;
        typeBadge.textContent = t.type.name;
        pokeTypesRow.appendChild(typeBadge);
      });
    }

    if (pokeHeight) pokeHeight.textContent = (data.height / 10).toFixed(1) + " m";
    if (pokeWeight) pokeWeight.textContent = (data.weight / 10).toFixed(1) + " kg";
    if (pokeAbilities) {
      pokeAbilities.textContent = data.abilities.map(a => a.ability.name.replace("-", " ")).join(", ");
    }

    // Stats
    const statsMap = {};
    data.stats.forEach(s => {
      statsMap[s.stat.name] = s.base_stat;
    });

    const hpVal    = statsMap["hp"] || 50;
    const atkVal   = statsMap["attack"] || 50;
    const defVal   = statsMap["defense"] || 50;
    const spAtkVal = statsMap["special-attack"] || 50;
    const spDefVal = statsMap["special-defense"] || 50;
    const spdVal   = statsMap["speed"] || 50;

    if (statHp)    statHp.textContent    = hpVal;
    if (statAtk)   statAtk.textContent   = atkVal;
    if (statDef)   statDef.textContent   = defVal;
    if (statSpAtk) statSpAtk.textContent = spAtkVal;
    if (statSpDef) statSpDef.textContent = spDefVal;
    if (statSpd)   statSpd.textContent   = spdVal;

    // Width percentages capped at 255 base stat
    if (fillHp)    fillHp.style.width    = Math.min(100, (hpVal / 255) * 100) + "%";
    if (fillAtk)   fillAtk.style.width   = Math.min(100, (atkVal / 255) * 100) + "%";
    if (fillDef)   fillDef.style.width   = Math.min(100, (defVal / 255) * 100) + "%";
    if (fillSpAtk) fillSpAtk.style.width = Math.min(100, (spAtkVal / 255) * 100) + "%";
    if (fillSpDef) fillSpDef.style.width = Math.min(100, (spDefVal / 255) * 100) + "%";
    if (fillSpd)   fillSpd.style.width   = Math.min(100, (spdVal / 255) * 100) + "%";
  }

  if (btnSearchPokeApi && pokeApiSearchInput) {
    btnSearchPokeApi.addEventListener("click", () => fetchPokeData(pokeApiSearchInput.value));
    pokeApiSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") fetchPokeData(pokeApiSearchInput.value);
    });
  }

  if (btnRandomPokeApi) {
    btnRandomPokeApi.addEventListener("click", () => {
      // Pick random Pokédex number (Gen 1-9: 1 to 1025)
      const randomId = Math.floor(Math.random() * 1025) + 1;
      if (pokeApiSearchInput) pokeApiSearchInput.value = randomId;
      fetchPokeData(randomId);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     16. TOM & JERRY — TAB 1: PRANK LAB
     ─────────────────────────────────────────────────────────────── */
  const pranks = [
    {
      title: "The Iron Skillet Rebound",
      bubble: "CLANG! 🍳",
      left: "🐱",
      right: "🐭",
      desc: "Tom swings a heavy cast-iron skillet at Jerry, who ducks gracefully. The pan ricochets off the oven and imprints Tom's face into a perfect circular waffle!"
    },
    {
      title: "The Rake in the High Grass",
      bubble: "WHACK! 🧹",
      left: "🐱",
      right: "🐶",
      desc: "Jerry lays a metal rake in the front lawn. Tom races after him at full speed, steps right on the prongs, and the handle snaps up with an explosive smack to his snout!"
    },
    {
      title: "The Exploding Piano Key",
      bubble: "BOOM! 🎹",
      left: "🐱",
      right: "🐭",
      desc: "Jerry rigs the high C key of the grand piano with dynamite. Tom plays Liszt's Hungarian Rhapsody with extreme drama until hitting the final note—kaboom!"
    },
    {
      title: "The Roller Skate & Super Magnet",
      bubble: "ZOOM! 🧲",
      left: "🐱",
      right: "🐭",
      desc: "Jerry straps magnetic roller skates to Tom's back paws while he sleeps, then holds an industrial horseshoe magnet from the second-floor banister!"
    },
    {
      title: "The Ultra-Hot Pepper in the Soup",
      bubble: "FIIIIRE! 🌶️",
      left: "🐱",
      right: "🐭",
      desc: "Tom prepares a bowl of cream to entice Jerry, but Jerry swaps in five Carolina Reaper peppers. Tom gulps it down and turns into a howling red rocket!"
    },
    {
      title: "The Sleeping Spike Doghouse Trap",
      bubble: "GRRRR! 🐶",
      left: "🐱",
      right: "🐶",
      desc: "Jerry leads the chase straight into Spike's doghouse. Jerry slips out the back, leaving Tom diving headfirst onto Spike's beloved midday nap bone!"
    }
  ];

  const prankGrid      = document.getElementById("prankGrid");
  const comicBubble    = document.getElementById("comicBubble");
  const prankHeadline  = document.getElementById("prankHeadline");
  const prankNarrative = document.getElementById("prankNarrative");
  const prankActorLeft = document.getElementById("prankActorLeft");
  const prankActorRight= document.getElementById("prankActorRight");
  const btnRandomPrank = document.getElementById("btnRandomPrank");

  function setPrank(p) {
    if (comicBubble)    comicBubble.textContent    = p.bubble;
    if (prankHeadline)  prankHeadline.textContent  = p.title;
    if (prankNarrative) prankNarrative.textContent = p.desc;
    if (prankActorLeft) prankActorLeft.textContent = p.left;
    if (prankActorRight)prankActorRight.textContent= p.right;
  }

  if (prankGrid) {
    pranks.forEach(p => {
      const card = document.createElement("div");
      card.className = "prank-card";
      card.innerHTML = `
        <div class="prank-avatar">${p.bubble.slice(-2)}</div>
        <h4>${p.title}</h4>
        <p>Trigger Trap →</p>
      `;
      card.addEventListener("click", () => setPrank(p));
      prankGrid.appendChild(card);
    });
  }

  if (btnRandomPrank) {
    btnRandomPrank.addEventListener("click", () => {
      const rand = pranks[Math.floor(Math.random() * pranks.length)];
      setPrank(rand);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     17. TOM & JERRY — TAB 2: CHASE CHALLENGE MINI-GAME
     ─────────────────────────────────────────────────────────────── */
  const chaseStages = [
    {
      stageName: "1 / 3 — The Living Room",
      art: "🛋️ 🧶 🐱 💨 🐭",
      title: "Tom has spotted you by the grandfather clock!",
      desc: "Tom pounces forward with claws out! You need to make a lightning split-second decision before he traps you against the sofa.",
      choices: [
        { text: "🐭 Slide under the Persian rug and tie Tom's shoelaces together!", score: 10, nextStage: 1 },
        { text: "🧶 Push the giant ball of yarn to roll Tom backwards into the lamp!", score: 15, nextStage: 1 },
        { text: "🫖 Jump into the silver teapot on the coffee table!", score: 5, nextStage: 1 }
      ]
    },
    {
      stageName: "2 / 3 — The Kitchen Arena",
      art: "🥞 🍳 🧊 🐱 🐭",
      title: "Tom corners you against the refrigerator door!",
      desc: "Tom grabs an iron skillet and swings wide! The kitchen table is covered with flour, syrup, and slippery butter dishes.",
      choices: [
        { text: "🧈 Toss the butter dish beneath Tom's paws to send him skating!", score: 20, nextStage: 2 },
        { text: "🥞 Flip a stack of hot syrup pancakes right onto Tom's face!", score: 15, nextStage: 2 },
        { text: "🧀 Grab the 5-pound wheel of Swiss cheese and sprint for the pet door!", score: 25, nextStage: 2 }
      ]
    },
    {
      stageName: "3 / 3 — The Backyard Doghouse",
      art: "🏡 🦴 🐶 🐱 🐭",
      title: "Spike the bulldog is sleeping by the doghouse!",
      desc: "You sprinted out to the yard with the cheese, but Tom is flying with a broomstick right behind you! Spike's eyes are fluttering open...",
      choices: [
        { text: "🦴 Slip behind Spike and slide the cheese bone into Tom's paws!", ending: "victory_spike", score: 30 },
        { text: "🚪 Dive into the secret mouse hole in the fence with all your cheese!", ending: "victory_escape", score: 25 },
        { text: "🥧 Push a fresh cherry pie off the windowsill right onto Tom's head!", ending: "victory_pie", score: 20 }
      ]
    }
  ];

  let currentStageIdx = 0;
  let chaseScore = 0;

  const hudStage       = document.getElementById("hudStage");
  const hudScore       = document.getElementById("hudScore");
  const gameSceneArt   = document.getElementById("gameSceneArt");
  const gameStageTitle = document.getElementById("gameStageTitle");
  const gameStageDesc  = document.getElementById("gameStageDesc");
  const gameChoicesGrid = document.getElementById("gameChoicesGrid");
  const gameEndingBox  = document.getElementById("gameEndingBox");
  const endingIcon     = document.getElementById("endingIcon");
  const endingTitle    = document.getElementById("endingTitle");
  const endingDesc     = document.getElementById("endingDesc");
  const btnRestartGame = document.getElementById("btnRestartGame");

  function renderChaseStage(idx) {
    const s = chaseStages[idx];
    if (!s) return;
    if (hudStage)       hudStage.textContent       = s.stageName;
    if (hudScore)       hudScore.textContent       = `🧀 ${chaseScore}`;
    if (gameSceneArt)   gameSceneArt.textContent   = s.art;
    if (gameStageTitle) gameStageTitle.textContent = s.title;
    if (gameStageDesc)  gameStageDesc.textContent  = s.desc;
    if (gameEndingBox)  gameEndingBox.classList.add("hidden");

    if (gameChoicesGrid) {
      gameChoicesGrid.innerHTML = "";
      gameChoicesGrid.classList.remove("hidden");
      s.choices.forEach(ch => {
        const btn = document.createElement("button");
        btn.className = "game-choice-btn";
        btn.textContent = ch.text;
        btn.addEventListener("click", () => {
          chaseScore += ch.score;
          if (hudScore) hudScore.textContent = `🧀 ${chaseScore}`;

          if (ch.ending) {
            showChaseEnding(ch.ending);
          } else {
            currentStageIdx = ch.nextStage;
            renderChaseStage(currentStageIdx);
          }
        });
        gameChoicesGrid.appendChild(btn);
      });
    }
  }

  function showChaseEnding(type) {
    if (gameChoicesGrid) gameChoicesGrid.classList.add("hidden");
    if (gameEndingBox)   gameEndingBox.classList.remove("hidden");

    if (type === "victory_spike") {
      if (endingIcon)  endingIcon.textContent  = "🐶 💥";
      if (endingTitle) endingTitle.textContent = "Spike Awakens! (Legendary Score!)";
      if (endingDesc)  endingDesc.textContent  = `Spike opened his eyes, saw Tom holding his bone, and chased Tom around the yard! Jerry enjoyed the cheese feast with a final score of 🧀 ${chaseScore} points!`;
    } else if (type === "victory_pie") {
      if (endingIcon)  endingIcon.textContent  = "🥧 😹";
      if (endingTitle) endingTitle.textContent = "Pie in the Face Comedy!";
      if (endingDesc)  endingDesc.textContent  = `Tom got blinded by cherry pie and spun into the birdbath! Jerry relaxed in his mouse hole with 🧀 ${chaseScore} points!`;
    } else {
      if (endingIcon)  endingIcon.textContent  = "🏆 🧀";
      if (endingTitle) endingTitle.textContent = "Master of Escapes!";
      if (endingDesc)  endingDesc.textContent  = `Clean getaway! You reached the mouse hole with 🧀 ${chaseScore} points of Swiss cheese before Tom even figured out what happened!`;
    }
  }

  if (gameStageTitle) renderChaseStage(0);

  if (btnRestartGame) {
    btnRestartGame.addEventListener("click", () => {
      currentStageIdx = 0;
      chaseScore = 0;
      renderChaseStage(0);
    });
  }

  /* ───────────────────────────────────────────────────────────────
     18. TOM & JERRY — TAB 3: CHARACTER FILES
     ─────────────────────────────────────────────────────────────── */
  const tjProfiles = [
    {
      icon: "🐱",
      name: "Thomas 'Tom' Cat",
      trait: "Tenacious, Theatrical & Resilient",
      rival: "Jerry Mouse",
      hobby: "Classical Concert Pianist",
      desc: "A determined grey domestic shorthair whose elaborate mechanical traps, catapults, and ruses invariably backfire into physical comedy. Despite their rivalry, Tom and Jerry share an unspoken bond and team up against outside threats.",
      fact: "Tom has played full classical masterpieces like Liszt's Hungarian Rhapsody No. 2 with perfect accuracy on screen!"
    },
    {
      icon: "🐭",
      name: "Jerry Mouse",
      trait: "Clever, Nimble & Unbeatable",
      rival: "Tom Cat",
      hobby: "Cheese Connoisseur & Ballroom Dance",
      desc: "A brown house mouse with quick wits and surprising strength. Jerry lives inside the skirting board and outsmarts every predator with household tools, iron skillets, and sheer agility.",
      fact: "Jerry famously danced alongside real-life Gene Kelly in the 1945 Hollywood film 'Anchors Aweigh'!"
    },
    {
      icon: "🐶",
      name: "Spike the Bulldog",
      trait: "Fierce Guardian & Devoted Father",
      rival: "Tom (when noisy)",
      hobby: "Burying Bones & Guarding Tyke",
      desc: "A powerful grey bulldog who desires peace, quiet, and a loving upbringing for his little pup Tyke. If Tom disturbs Tyke's nap or steps on his bone, Spike dishes out heavy-weight punishment.",
      fact: "Spike always tells Tom: 'If I catch you messing around my boy, I'll tear ya limb from limb!'"
    },
    {
      icon: "🐾",
      name: "Tyke the Pup",
      trait: "Playful, Innocent & Cute",
      rival: "None (Beloved by all)",
      hobby: "Learning to Bark like Dad",
      desc: "Spike's adorable pup who doesn't talk much aside from cheerful yips and barks. Tom goes to absurd lengths to avoid accidentally waking or stepping on little Tyke.",
      fact: "Tyke starred alongside his father Spike in his own MGM theatrical spin-off series in the 1950s."
    },
    {
      icon: "🍼",
      name: "Nibbles / Tuffy",
      trait: "Ravenous, Brave & French-Speaking",
      rival: "Tom Cat",
      hobby: "Eating Everything in the Fridge",
      desc: "A tiny grey orphan mouse who wears a white diaper. Blessed with an insatiable appetite and French musketeer bravery, he fearlessly duels Tom with toothpicks and bread knives.",
      fact: "Won an Oscar in 'The Two Mouseketeers' where he famously ended the cartoon with 'Touché, pussy cat!'"
    },
    {
      icon: "😼",
      name: "Butch Cat",
      trait: "Street-Smart Alley Leader",
      rival: "Tom & Jerry",
      hobby: "Playing Cigar-Box Bass",
      desc: "A mangy black alley cat who heads the local stray pack. Butch frequently competes against Tom for the affection of neighborhood female cats and fishbone scraps in garbage cans.",
      fact: "Butch is both Tom's closest alley friend and his most aggressive romantic rival."
    }
  ];

  const tjCharGrid  = document.getElementById("tjCharGrid");
  const tjModal     = document.getElementById("tjModal");
  const tjModalClose= document.getElementById("tjModalClose");
  const tjModalIcon = document.getElementById("tjModalIcon");
  const tjModalName = document.getElementById("tjModalName");
  const tjModalDesc = document.getElementById("tjModalDesc");
  const tjModalTrait= document.getElementById("tjModalTrait");
  const tjModalRival= document.getElementById("tjModalRival");
  const tjModalHobby= document.getElementById("tjModalHobby");
  const tjModalFact = document.getElementById("tjModalFact");
  const btnRandomTjChar = document.getElementById("btnRandomTjChar");

  function openTjModal(p) {
    if (!tjModal) return;
    if (tjModalIcon)  tjModalIcon.textContent  = p.icon;
    if (tjModalName)  tjModalName.textContent  = p.name;
    if (tjModalDesc)  tjModalDesc.textContent  = p.desc;
    if (tjModalTrait) tjModalTrait.textContent = p.trait;
    if (tjModalRival) tjModalRival.textContent = p.rival;
    if (tjModalHobby) tjModalHobby.textContent = p.hobby;
    if (tjModalFact)  tjModalFact.textContent  = `💡 Classic Lore: ${p.fact}`;
    tjModal.classList.remove("hidden");
  }

  if (tjCharGrid) {
    tjProfiles.forEach(p => {
      const card = document.createElement("div");
      card.className = "tj-card";
      card.innerHTML = `
        <div class="tj-avatar">${p.icon}</div>
        <h4>${p.name}</h4>
        <p>${p.trait}</p>
        <span class="gadget-inspect-btn" style="color:#e65100;">Inspect Dossier →</span>
      `;
      card.addEventListener("click", () => openTjModal(p));
      tjCharGrid.appendChild(card);
    });
  }

  if (tjModalClose && tjModal) {
    tjModalClose.addEventListener("click", () => tjModal.classList.add("hidden"));
    tjModal.addEventListener("click", (e) => {
      if (e.target === tjModal) tjModal.classList.add("hidden");
    });
  }

  if (btnRandomTjChar) {
    btnRandomTjChar.addEventListener("click", () => {
      const rand = tjProfiles[Math.floor(Math.random() * tjProfiles.length)];
      openTjModal(rand);
    });
  }

});
