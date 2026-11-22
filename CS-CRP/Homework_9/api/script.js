/**
 * CartoonVerse — Multiverse API Explorer Hub
 * 
 * TWO SEPARATE EXPLORE OPTIONS:
 * 1. Pokémon Explorer — Live PokéAPI integration (1,025+ Pokémon, stats, types, artwork, abilities)
 * 2. CartoonVerse TV Universe — Live TVmaze API (Show discovery, posters, ratings, episode explorer, surprise me)
 * 
 * Both APIs are independent, require no API keys, and handle live fetching, rate limits, and errors.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ===================================================================
     EXPLORER VIEW SWITCHER (Pokémon Explorer vs TV Universe)
     =================================================================== */
  const tabBtnTv            = document.getElementById("tabBtnTv");
  const tabBtnPokemon       = document.getElementById("tabBtnPokemon");
  const viewTvUniverse      = document.getElementById("viewTvUniverse");
  const viewPokemonExplorer = document.getElementById("viewPokemonExplorer");
  const navLinkTv           = document.getElementById("navLinkTv");
  const navLinkPokemon      = document.getElementById("navLinkPokemon");

  function switchExplorerView(viewName) {
    if (viewName === "pokemon") {
      tabBtnPokemon.classList.add("active");
      tabBtnPokemon.setAttribute("aria-selected", "true");
      tabBtnTv.classList.remove("active");
      tabBtnTv.setAttribute("aria-selected", "false");

      viewPokemonExplorer.classList.remove("hidden");
      viewTvUniverse.classList.add("hidden");

      if (navLinkPokemon) navLinkPokemon.classList.add("active");
      if (navLinkTv) navLinkTv.classList.remove("active");
    } else {
      tabBtnTv.classList.add("active");
      tabBtnTv.setAttribute("aria-selected", "true");
      tabBtnPokemon.classList.remove("active");
      tabBtnPokemon.setAttribute("aria-selected", "false");

      viewTvUniverse.classList.remove("hidden");
      viewPokemonExplorer.classList.add("hidden");

      if (navLinkTv) navLinkTv.classList.add("active");
      if (navLinkPokemon) navLinkPokemon.classList.remove("active");
    }
  }

  if (tabBtnTv) {
    tabBtnTv.addEventListener("click", () => {
      switchExplorerView("tv");
      window.location.hash = "tv";
    });
  }

  if (tabBtnPokemon) {
    tabBtnPokemon.addEventListener("click", () => {
      switchExplorerView("pokemon");
      window.location.hash = "pokemon";
    });
  }

  if (navLinkTv) {
    navLinkTv.addEventListener("click", (e) => {
      e.preventDefault();
      switchExplorerView("tv");
      window.location.hash = "tv";
    });
  }

  if (navLinkPokemon) {
    navLinkPokemon.addEventListener("click", (e) => {
      e.preventDefault();
      switchExplorerView("pokemon");
      window.location.hash = "pokemon";
    });
  }

  // Handle URL hash on load (e.g. /api#pokemon or /api#tv)
  function handleUrlHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash === "#pokemon" || hash === "#pokemon-explorer") {
      switchExplorerView("pokemon");
    } else {
      switchExplorerView("tv");
    }
  }
  window.addEventListener("hashchange", handleUrlHash);
  handleUrlHash();


  /* ===================================================================
     OPTION 1: POKÉMON EXPLORER (PokéAPI Integration)
     Endpoint: https://pokeapi.co/api/v2/pokemon/:query
     =================================================================== */
  const pokeSearchInput    = document.getElementById("pokeSearchInput");
  const btnClearPokeSearch = document.getElementById("btnClearPokeSearch");
  const btnSubmitPokeSearch= document.getElementById("btnSubmitPokeSearch");
  const btnRandomPoke      = document.getElementById("btnRandomPoke");
  const pokeLoadingState   = document.getElementById("pokeLoadingState");
  const pokeErrorCard      = document.getElementById("pokeErrorCard");
  const pokeErrorHeading   = document.getElementById("pokeErrorHeading");
  const pokeErrorDescription = document.getElementById("pokeErrorDescription");
  const pokeDisplayWrapper = document.getElementById("pokeDisplayWrapper");

  // Display Elements
  const pokeLiveImg        = document.getElementById("pokeLiveImg");
  const pokeLiveId         = document.getElementById("pokeLiveId");
  const pokeLiveName       = document.getElementById("pokeLiveName");
  const pokeLiveTypes      = document.getElementById("pokeLiveTypes");
  const pokeLiveHeight     = document.getElementById("pokeLiveHeight");
  const pokeLiveWeight     = document.getElementById("pokeLiveWeight");
  const pokeLiveAbilities  = document.getElementById("pokeLiveAbilities");

  // Base Stats
  const pokeStatHp         = document.getElementById("pokeStatHp");
  const barHp              = document.getElementById("barHp");
  const pokeStatAtk        = document.getElementById("pokeStatAtk");
  const barAtk             = document.getElementById("barAtk");
  const pokeStatDef        = document.getElementById("pokeStatDef");
  const barDef             = document.getElementById("barDef");
  const pokeStatSpAtk      = document.getElementById("pokeStatSpAtk");
  const barSpAtk           = document.getElementById("barSpAtk");
  const pokeStatSpDef      = document.getElementById("pokeStatSpDef");
  const barSpDef           = document.getElementById("barSpDef");
  const pokeStatSpd        = document.getElementById("pokeStatSpd");
  const barSpd             = document.getElementById("barSpd");

  // Clear button toggle
  if (pokeSearchInput && btnClearPokeSearch) {
    pokeSearchInput.addEventListener("input", () => {
      if (pokeSearchInput.value.trim().length > 0) {
        btnClearPokeSearch.classList.remove("hidden");
      } else {
        btnClearPokeSearch.classList.add("hidden");
      }
    });

    btnClearPokeSearch.addEventListener("click", () => {
      pokeSearchInput.value = "";
      btnClearPokeSearch.classList.add("hidden");
      pokeSearchInput.focus();
    });
  }

  /**
   * Fetch Live Pokémon from PokéAPI
   */
  async function fetchPokeApiData(query) {
    const cleanQ = String(query).trim().toLowerCase();
    if (!cleanQ) return;

    pokeLoadingState.classList.remove("hidden");
    pokeErrorCard.classList.add("hidden");
    pokeDisplayWrapper.style.opacity = "0.5";

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(cleanQ)}`);

      if (!response.ok) {
        throw new Error(`Pokémon "${cleanQ}" not found in PokéAPI.`);
      }

      const data = await response.json();
      pokeLoadingState.classList.add("hidden");
      pokeDisplayWrapper.style.opacity = "1";

      renderLivePokemonCard(data);

    } catch (err) {
      console.error("PokéAPI fetch error:", err);
      pokeLoadingState.classList.add("hidden");
      pokeDisplayWrapper.style.opacity = "1";
      pokeErrorCard.classList.remove("hidden");
      pokeErrorHeading.textContent = "Pokémon Not Found";
      pokeErrorDescription.textContent = `Could not find "${cleanQ}". Please check your spelling or ID number (1–1025).`;
    }
  }

  function renderLivePokemonCard(data) {
    // Official high-res artwork with animated sprite fallbacks
    const artworkUrl = 
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.other?.home?.front_default ||
      data.sprites?.front_default ||
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

    if (pokeLiveImg) {
      pokeLiveImg.src = artworkUrl;
      pokeLiveImg.alt = data.name;
    }

    if (pokeLiveId) {
      pokeLiveId.textContent = `#${String(data.id).padStart(4, "0")}`;
    }

    if (pokeLiveName) {
      pokeLiveName.textContent = data.name;
    }

    // Types
    if (pokeLiveTypes) {
      pokeLiveTypes.innerHTML = "";
      (data.types || []).forEach(t => {
        const typeBadge = document.createElement("span");
        typeBadge.className = `poke-type-badge type-${t.type.name}`;
        typeBadge.textContent = t.type.name;
        pokeLiveTypes.appendChild(typeBadge);
      });
    }

    // Height & Weight (converted from decimetres & hectograms)
    if (pokeLiveHeight) {
      pokeLiveHeight.textContent = `${(data.height / 10).toFixed(1)} m`;
    }
    if (pokeLiveWeight) {
      pokeLiveWeight.textContent = `${(data.weight / 10).toFixed(1)} kg`;
    }

    // Abilities
    if (pokeLiveAbilities) {
      const abilitiesList = (data.abilities || []).map(a => capitalize(a.ability.name.replace(/-/g, " "))).join(", ");
      pokeLiveAbilities.textContent = abilitiesList || "None";
    }

    // Base Stats
    const statsMap = {};
    (data.stats || []).forEach(s => {
      statsMap[s.stat.name] = s.base_stat;
    });

    updateStat(pokeStatHp, barHp, statsMap["hp"] || 35);
    updateStat(pokeStatAtk, barAtk, statsMap["attack"] || 55);
    updateStat(pokeStatDef, barDef, statsMap["defense"] || 40);
    updateStat(pokeStatSpAtk, barSpAtk, statsMap["special-attack"] || 50);
    updateStat(pokeStatSpDef, barSpDef, statsMap["special-defense"] || 50);
    updateStat(pokeStatSpd, barSpd, statsMap["speed"] || 90);
  }

  function updateStat(numEl, barEl, val) {
    if (numEl) numEl.textContent = val;
    if (barEl) {
      const pct = Math.min(100, Math.round((val / 255) * 100));
      barEl.style.width = `${pct}%`;
    }
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // PokéAPI Search Button & Enter Key
  if (btnSubmitPokeSearch && pokeSearchInput) {
    btnSubmitPokeSearch.addEventListener("click", () => {
      fetchPokeApiData(pokeSearchInput.value);
    });

    pokeSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        fetchPokeApiData(pokeSearchInput.value);
      }
    });
  }

  // PokéAPI Random Button (Gen 1-9: 1 to 1025)
  if (btnRandomPoke) {
    btnRandomPoke.addEventListener("click", () => {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      if (pokeSearchInput) pokeSearchInput.value = randomId;
      fetchPokeApiData(randomId);
    });
  }

  // Quick Pokémon Pills Click
  document.querySelectorAll(".poke-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pName = btn.dataset.pokemon;
      if (pokeSearchInput) pokeSearchInput.value = pName;
      fetchPokeApiData(pName);
    });
  });


  /* ===================================================================
     OPTION 2: CARTOONVERSE TV UNIVERSE (TVmaze API Integration)
     Endpoint: https://api.tvmaze.com/search/shows?q=QUERY
     =================================================================== */
  const tvSearchInput    = document.getElementById("tvSearchInput");
  const btnClearSearch   = document.getElementById("btnClearSearch");
  const btnSubmitSearch  = document.getElementById("btnSubmitSearch");
  const btnSurpriseMe    = document.getElementById("btnSurpriseMe");
  const quickTags        = document.getElementById("quickTags");
  const genrePills       = document.getElementById("genrePills");
  const showsGrid        = document.getElementById("showsGrid");
  const resultsCount     = document.getElementById("resultsCount");
  const loadingState     = document.getElementById("loadingState");
  const errorBanner      = document.getElementById("errorBanner");
  const errorTitle       = document.getElementById("errorTitle");
  const errorMsg         = document.getElementById("errorMsg");
  const btnRetry         = document.getElementById("btnRetry");
  const rateLimitAlert   = document.getElementById("rateLimitAlert");
  const emptyState       = document.getElementById("emptyState");
  const btnResetEmpty    = document.getElementById("btnResetEmpty");
  const mobileMenuBtn    = document.getElementById("mobileMenuBtn");
  const navLinks         = document.getElementById("navLinks");

  // Episode Modal Elements
  const episodeModal     = document.getElementById("episodeModal");
  const btnModalClose    = document.getElementById("btnModalClose");
  const modalPoster      = document.getElementById("modalPoster");
  const modalRating      = document.getElementById("modalRating");
  const modalStatus      = document.getElementById("modalStatus");
  const modalNetwork     = document.getElementById("modalNetwork");
  const modalYear        = document.getElementById("modalYear");
  const modalShowTitle   = document.getElementById("modalShowTitle");
  const modalGenres      = document.getElementById("modalGenres");
  const modalSynopsis    = document.getElementById("modalSynopsis");
  const modalTvmazeLink  = document.getElementById("modalTvmazeLink");
  const modalOfficialLink= document.getElementById("modalOfficialLink");
  const episodesTotalCount = document.getElementById("episodesTotalCount");
  const seasonSelect     = document.getElementById("seasonSelect");
  const episodesLoading  = document.getElementById("episodesLoading");
  const episodesGrid     = document.getElementById("episodesGrid");
  const episodesEmpty    = document.getElementById("episodesEmpty");

  // Surprise Modal Elements
  const surpriseModal    = document.getElementById("surpriseModal");
  const btnSurpriseClose = document.getElementById("btnSurpriseClose");
  const surprisePoster   = document.getElementById("surprisePoster");
  const surpriseRating   = document.getElementById("surpriseRating");
  const surpriseTitle    = document.getElementById("surpriseTitle");
  const surpriseGenres   = document.getElementById("surpriseGenres");
  const surpriseType     = document.getElementById("surpriseType");
  const surpriseYear     = document.getElementById("surpriseYear");
  const surpriseStatus   = document.getElementById("surpriseStatus");
  const surpriseDesc     = document.getElementById("surpriseDesc");
  const btnSurpriseExplore = document.getElementById("btnSurpriseExplore");
  const btnSurpriseAgain = document.getElementById("btnSurpriseAgain");

  let currentSearchResults = [];
  let currentFilterGenre = "all";
  let activeShowEpisodes = [];
  let currentSurpriseShow = null;
  let lastSearchedQuery = "cartoon";

  const CURATED_SURPRISE_QUERIES = [
    "doraemon", "powerpuff girls", "pokemon", "tom and jerry",
    "avatar the last airbender", "scooby-doo", "batman the animated series",
    "ben 10", "spongebob", "looney tunes", "samurai jack", "gravity falls",
    "adventure time", "teen titans", "phineas and ferb", "courage the cowardly dog"
  ];

  function cleanHtml(htmlStr) {
    if (!htmlStr) return "No description provided for this cartoon in the TVmaze database.";
    const temp = document.createElement("div");
    temp.innerHTML = htmlStr;
    return temp.textContent || temp.innerText || "";
  }

  // Mobile menu
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // TV Search clear button
  if (tvSearchInput && btnClearSearch) {
    tvSearchInput.addEventListener("input", () => {
      if (tvSearchInput.value.trim().length > 0) {
        btnClearSearch.classList.remove("hidden");
      } else {
        btnClearSearch.classList.add("hidden");
      }
    });

    btnClearSearch.addEventListener("click", () => {
      tvSearchInput.value = "";
      btnClearSearch.classList.add("hidden");
      tvSearchInput.focus();
    });
  }

  /**
   * Search shows on TVmaze API
   */
  async function searchTvShows(query) {
    const q = query.trim();
    if (!q) return;

    lastSearchedQuery = q;
    hideAllTvBanners();
    loadingState.classList.remove("hidden");
    showsGrid.innerHTML = "";
    resultsCount.textContent = `Searching for "${q}"...`;

    try {
      const endpoint = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`;
      const response = await fetch(endpoint);

      if (response.status === 429) {
        loadingState.classList.add("hidden");
        rateLimitAlert.classList.remove("hidden");
        resultsCount.textContent = "Rate limited (HTTP 429)";
        setTimeout(() => {
          rateLimitAlert.classList.add("hidden");
          searchTvShows(q);
        }, 3500);
        return;
      }

      if (!response.ok) {
        throw new Error(`TVmaze API responded with status ${response.status}`);
      }

      const data = await response.json();
      loadingState.classList.add("hidden");

      currentSearchResults = data.map(item => item.show).filter(Boolean);
      applyTvGenreFilter();

    } catch (err) {
      console.error("TVmaze search error:", err);
      loadingState.classList.add("hidden");
      errorBanner.classList.remove("hidden");
      errorTitle.textContent = "TVmaze Transmission Interrupted";
      errorMsg.textContent = err.message || "Failed to reach TVmaze API. Please check your internet connection.";
      resultsCount.textContent = "Error loading cartoons";
    }
  }

  function hideAllTvBanners() {
    loadingState.classList.add("hidden");
    errorBanner.classList.add("hidden");
    rateLimitAlert.classList.add("hidden");
    emptyState.classList.add("hidden");
  }

  function applyTvGenreFilter() {
    let filtered = currentSearchResults;

    if (currentFilterGenre !== "all") {
      filtered = currentSearchResults.filter(show => {
        const genres = show.genres || [];
        const type = show.type || "";
        return genres.some(g => g.toLowerCase() === currentFilterGenre.toLowerCase()) ||
               type.toLowerCase() === currentFilterGenre.toLowerCase();
      });
    }

    renderTvShowCards(filtered);
  }

  function renderTvShowCards(showsList) {
    showsGrid.innerHTML = "";

    if (!showsList || showsList.length === 0) {
      emptyState.classList.remove("hidden");
      resultsCount.textContent = `0 shows found`;
      return;
    }

    emptyState.classList.add("hidden");
    resultsCount.textContent = `Showing ${showsList.length} cartoon${showsList.length === 1 ? "" : "s"} for "${lastSearchedQuery}"`;

    showsList.forEach(show => {
      const card = document.createElement("article");
      card.className = "show-card";
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `View episodes and details for ${show.name}`);

      const posterUrl = show.image?.medium || show.image?.original || "";
      const ratingVal = show.rating?.average ? `⭐ ${show.rating.average}` : "⭐ N/A";
      const statusText = show.status || "Unknown";
      const statusClass = statusText.toLowerCase() === "running" ? "status-running" : "status-ended";
      const year = show.premiered ? show.premiered.substring(0, 4) : "TBA";
      const networkName = show.network?.name || show.webChannel?.name || "Global Web";
      const cleanDesc = cleanHtml(show.summary);

      const genresHtml = (show.genres && show.genres.length > 0)
        ? show.genres.slice(0, 3).map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join("")
        : `<span class="genre-tag">${escapeHtml(show.type || "Animation")}</span>`;

      card.innerHTML = `
        <div class="show-poster-wrap">
          ${posterUrl 
            ? `<img src="${escapeHtml(posterUrl)}" alt="${escapeHtml(show.name)} poster" class="show-poster-img" loading="lazy">` 
            : `<div class="poster-fallback"><span>📺</span><p>${escapeHtml(show.name)}</p></div>`
          }
          <div class="card-rating-badge">${ratingVal}</div>
          <div class="card-status-badge ${statusClass}">${escapeHtml(statusText)}</div>
        </div>
        <div class="show-card-body">
          <h3 class="show-card-title">${escapeHtml(show.name)}</h3>
          <div class="show-card-meta">
            <span>📅 ${escapeHtml(year)}</span> • 
            <span>📡 ${escapeHtml(networkName)}</span>
          </div>
          <div class="show-card-genres">${genresHtml}</div>
          <p class="show-card-desc">${escapeHtml(cleanDesc)}</p>
          <button class="show-card-btn" aria-hidden="true">🎬 Explore Episodes</button>
        </div>
      `;

      card.addEventListener("click", () => openEpisodeExplorer(show));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openEpisodeExplorer(show);
        }
      });

      showsGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Open Episode Explorer Modal
   */
  async function openEpisodeExplorer(show) {
    if (!show) return;

    const posterUrl = show.image?.original || show.image?.medium || "";
    if (posterUrl) {
      modalPoster.src = posterUrl;
      modalPoster.alt = `${show.name} poster`;
      modalPoster.style.display = "block";
    } else {
      modalPoster.src = "";
      modalPoster.style.display = "none";
    }

    modalRating.textContent = show.rating?.average ? `⭐ ${show.rating.average}` : "⭐ N/A";
    modalStatus.textContent = show.status || "Unknown";
    modalNetwork.textContent = show.network?.name || show.webChannel?.name || "Global Broadcast";
    modalYear.textContent = show.premiered ? show.premiered.substring(0, 4) : "Year TBA";
    modalShowTitle.textContent = show.name;

    modalGenres.innerHTML = (show.genres && show.genres.length > 0)
      ? show.genres.map(g => `<span class="modal-genre-tag">${escapeHtml(g)}</span>`).join("")
      : `<span class="modal-genre-tag">${escapeHtml(show.type || "Animation")}</span>`;

    modalSynopsis.textContent = cleanHtml(show.summary);

    if (show.url) {
      modalTvmazeLink.href = show.url;
      modalTvmazeLink.classList.remove("hidden");
    } else {
      modalTvmazeLink.classList.add("hidden");
    }

    if (show.officialSite) {
      modalOfficialLink.href = show.officialSite;
      modalOfficialLink.classList.remove("hidden");
    } else {
      modalOfficialLink.classList.add("hidden");
    }

    episodeModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    episodesGrid.innerHTML = "";
    episodesEmpty.classList.add("hidden");
    episodesLoading.classList.remove("hidden");
    episodesTotalCount.textContent = "(Loading...)";

    try {
      const epEndpoint = `https://api.tvmaze.com/shows/${show.id}/episodes`;
      const epResp = await fetch(epEndpoint);

      if (!epResp.ok) {
        throw new Error(`Failed to load episodes (Status ${epResp.status})`);
      }

      const episodes = await epResp.json();
      episodesLoading.classList.add("hidden");
      activeShowEpisodes = Array.isArray(episodes) ? episodes : [];

      episodesTotalCount.textContent = `(${activeShowEpisodes.length} episode${activeShowEpisodes.length === 1 ? "" : "s"})`;

      populateSeasonDropdown(activeShowEpisodes);
      renderEpisodes(activeShowEpisodes);

    } catch (err) {
      console.error("Episode fetch error:", err);
      episodesLoading.classList.add("hidden");
      episodesEmpty.classList.remove("hidden");
      episodesEmpty.innerHTML = `<p style="color:#ef5350;">Could not load episode list: ${escapeHtml(err.message)}</p>`;
    }
  }

  function populateSeasonDropdown(episodes) {
    seasonSelect.innerHTML = `<option value="all">All Seasons (${episodes.length} eps)</option>`;
    const seasons = Array.from(new Set(episodes.map(e => e.season).filter(Boolean))).sort((a, b) => a - b);

    seasons.forEach(s => {
      const count = episodes.filter(e => e.season === s).length;
      const opt = document.createElement("option");
      opt.value = String(s);
      opt.textContent = `Season ${s} (${count} eps)`;
      seasonSelect.appendChild(opt);
    });

    seasonSelect.value = "all";
  }

  function renderEpisodes(episodes) {
    episodesGrid.innerHTML = "";

    if (!episodes || episodes.length === 0) {
      episodesEmpty.classList.remove("hidden");
      return;
    }

    episodesEmpty.classList.add("hidden");

    episodes.forEach(ep => {
      const epCard = document.createElement("div");
      epCard.className = "episode-card";

      const thumbUrl = ep.image?.medium || ep.image?.original || "";
      const sNum = String(ep.season || 1).padStart(2, "0");
      const eNum = String(ep.number || 1).padStart(2, "0");
      const code = `S${sNum}E${eNum}`;
      const airdate = ep.airdate || "Airdate TBA";
      const runtime = ep.runtime ? `${ep.runtime} min` : "";
      const desc = cleanHtml(ep.summary);

      epCard.innerHTML = `
        <div class="ep-thumb-wrap">
          ${thumbUrl 
            ? `<img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(ep.name)} thumbnail" class="ep-thumb-img" loading="lazy">` 
            : `<div class="poster-fallback" style="aspect-ratio:16/9;"><span>🎬</span><p>${code}</p></div>`
          }
          <div class="ep-code-badge">${code}</div>
          ${runtime ? `<div class="ep-runtime-badge">⏱️ ${runtime}</div>` : ""}
        </div>
        <div class="ep-card-body">
          <h4 class="ep-title">${escapeHtml(ep.name || `Episode ${ep.number}`)}</h4>
          <div class="ep-airdate">📅 ${escapeHtml(airdate)}</div>
          <p class="ep-desc">${escapeHtml(desc)}</p>
        </div>
      `;

      episodesGrid.appendChild(epCard);
    });
  }

  if (seasonSelect) {
    seasonSelect.addEventListener("change", () => {
      const val = seasonSelect.value;
      if (val === "all") {
        renderEpisodes(activeShowEpisodes);
      } else {
        const seasonNum = parseInt(val, 10);
        const filtered = activeShowEpisodes.filter(e => e.season === seasonNum);
        renderEpisodes(filtered);
      }
    });
  }

  if (btnModalClose) btnModalClose.addEventListener("click", closeEpisodeModal);
  if (episodeModal) {
    episodeModal.addEventListener("click", (e) => {
      if (e.target === episodeModal) closeEpisodeModal();
    });
  }

  function closeEpisodeModal() {
    episodeModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  /**
   * Surprise Me Roulette
   */
  async function triggerSurpriseMe() {
    hideAllTvBanners();
    loadingState.classList.remove("hidden");
    resultsCount.textContent = "Rolling multiverse cartoon roulette...";

    try {
      let pool = currentSearchResults;

      if (!pool || pool.length === 0) {
        const randomQ = CURATED_SURPRISE_QUERIES[Math.floor(Math.random() * CURATED_SURPRISE_QUERIES.length)];
        const resp = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(randomQ)}`);
        if (resp.ok) {
          const data = await resp.json();
          pool = data.map(i => i.show).filter(Boolean);
        }
      }

      if (!pool || pool.length === 0) {
        throw new Error("Could not find cartoon results for Surprise Me.");
      }

      const pick = pool[Math.floor(Math.random() * pool.length)];
      currentSurpriseShow = pick;
      loadingState.classList.add("hidden");

      showSurpriseModal(pick);

    } catch (err) {
      console.error("Surprise Me error:", err);
      loadingState.classList.add("hidden");
      searchTvShows("cartoon");
    }
  }

  function showSurpriseModal(show) {
    if (!show) return;

    const posterUrl = show.image?.medium || show.image?.original || "";
    if (posterUrl) {
      surprisePoster.src = posterUrl;
      surprisePoster.alt = `${show.name} poster`;
      surprisePoster.style.display = "block";
    } else {
      surprisePoster.src = "";
      surprisePoster.style.display = "none";
    }

    surpriseRating.textContent = show.rating?.average ? `⭐ ${show.rating.average}` : "⭐ N/A";
    surpriseTitle.textContent = show.name;
    surpriseType.textContent = show.type || "Animation";
    surpriseYear.textContent = show.premiered ? show.premiered.substring(0, 4) : "Year TBA";
    surpriseStatus.textContent = show.status || "Completed";

    surpriseGenres.innerHTML = (show.genres && show.genres.length > 0)
      ? show.genres.map(g => `<span class="modal-genre-tag">${escapeHtml(g)}</span>`).join("")
      : `<span class="modal-genre-tag">${escapeHtml(show.type || "Animation")}</span>`;

    surpriseDesc.textContent = cleanHtml(show.summary);

    surpriseModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  if (btnSurpriseClose) btnSurpriseClose.addEventListener("click", closeSurpriseModal);
  if (surpriseModal) {
    surpriseModal.addEventListener("click", (e) => {
      if (e.target === surpriseModal) closeSurpriseModal();
    });
  }

  function closeSurpriseModal() {
    surpriseModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (btnSurpriseAgain) {
    btnSurpriseAgain.addEventListener("click", () => {
      const randomQ = CURATED_SURPRISE_QUERIES[Math.floor(Math.random() * CURATED_SURPRISE_QUERIES.length)];
      fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(randomQ)}`)
        .then(r => r.json())
        .then(data => {
          const list = data.map(i => i.show).filter(Boolean);
          if (list.length > 0) {
            const pick = list[Math.floor(Math.random() * list.length)];
            currentSurpriseShow = pick;
            showSurpriseModal(pick);
          }
        })
        .catch(err => console.error("Roll again error:", err));
    });
  }

  if (btnSurpriseExplore) {
    btnSurpriseExplore.addEventListener("click", () => {
      closeSurpriseModal();
      if (currentSurpriseShow) {
        openEpisodeExplorer(currentSurpriseShow);
      }
    });
  }

  if (btnSurpriseMe) btnSurpriseMe.addEventListener("click", triggerSurpriseMe);

  // Search Submit
  if (btnSubmitSearch && tvSearchInput) {
    btnSubmitSearch.addEventListener("click", () => {
      const q = tvSearchInput.value.trim();
      if (q) searchTvShows(q);
    });

    tvSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const q = tvSearchInput.value.trim();
        if (q) searchTvShows(q);
      }
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener("click", () => searchTvShows(lastSearchedQuery));
  }

  if (btnResetEmpty) {
    btnResetEmpty.addEventListener("click", () => {
      tvSearchInput.value = "cartoon";
      currentFilterGenre = "all";
      updateGenrePillActive("all");
      searchTvShows("cartoon");
    });
  }

  // Quick Tags
  if (quickTags) {
    quickTags.addEventListener("click", (e) => {
      const btn = e.target.closest(".tag-pill");
      if (!btn) return;
      const q = btn.dataset.query;
      if (q) {
        tvSearchInput.value = q;
        btnClearSearch.classList.remove("hidden");
        searchTvShows(q);
      }
    });
  }

  // Genre Filters
  if (genrePills) {
    genrePills.addEventListener("click", (e) => {
      const pill = e.target.closest(".genre-pill");
      if (!pill) return;
      const genre = pill.dataset.genre;
      if (genre) {
        currentFilterGenre = genre;
        updateGenrePillActive(genre);
        applyTvGenreFilter();
      }
    });
  }

  function updateGenrePillActive(selectedGenre) {
    const pills = genrePills.querySelectorAll(".genre-pill");
    pills.forEach(p => {
      if (p.dataset.genre.toLowerCase() === selectedGenre.toLowerCase()) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEpisodeModal();
      closeSurpriseModal();
    }
  });

  /* ── Initial Live Data Load for Both APIs ───────────────────────── */
  // 1. Initial live TVmaze load
  searchTvShows("doraemon");

  // 2. Initial live PokéAPI load (Pikachu)
  fetchPokeApiData("pikachu");
});
