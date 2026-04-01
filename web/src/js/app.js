// ===== USER MENU =====

// toggle menu
function toggleMenu() {
  const menu = document.getElementById("user-menu");
    if (!menu) return;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function setUserTriggerIcon() {
        const iconMarkup = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.2 10.9a7 7 0 0 1-2.7 1.5A17.3 17.3 0 0 1 15 18h-2a14.4 14.4 0 0 0-.4-3.1 27.8 27.8 0 0 0 4.6-1.1zM12 4a8 8 0 0 1 3.4.8A14.8 14.8 0 0 1 13 8H11a14.8 14.8 0 0 1-2.4-3.2A8 8 0 0 1 12 4zM8.6 4.8A17.3 17.3 0 0 0 9.4 8H5.8a8.1 8.1 0 0 1 2.8-3.2zM4.4 10h5.3c.1.7.3 1.4.5 2.1a29.6 29.6 0 0 1-5.4 1.3A8.2 8.2 0 0 1 4.4 10zm.4 5.2a31.9 31.9 0 0 0 6.1-1.5A15.8 15.8 0 0 1 11 18H9a8.1 8.1 0 0 1-4.2-2.8zM15 18a15.7 15.7 0 0 0 .1-2.3 8.9 8.9 0 0 0 2.1-1A8.1 8.1 0 0 1 15 18z"/></svg>';
        document.querySelectorAll('.user-icon').forEach((icon) => {
                icon.innerHTML = `<span class="user-icon-svg">${iconMarkup}</span>`;
        });
}

function syncUserMenuNavigation() {
    const userMenu = document.getElementById('user-menu');
    const mainMenu = document.querySelector('.main-menu');
    if (!userMenu || !mainMenu) return;

    userMenu
        .querySelectorAll('.menu-separator, .menu-section-title, .mobile-nav-link')
        .forEach((el) => el.remove());

    if (window.innerWidth > 768) return;

    const separator = document.createElement('hr');
    separator.className = 'menu-separator';

    const title = document.createElement('p');
    title.className = 'menu-section-title';
    title.textContent = 'Navigation';

    userMenu.append(separator, title);

    mainMenu.querySelectorAll('a').forEach((link) => {
        const mobileLink = document.createElement('a');
        mobileLink.className = 'mobile-nav-link';
        mobileLink.href = link.getAttribute('href') || '#';
        mobileLink.textContent = link.textContent || '';
        userMenu.appendChild(mobileLink);
    });

    setMenuIcons();
}

function setMenuIcons() {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;

    const iconMap = {
        home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5v9a1 1 0 0 1-1 1h-5.5a.5.5 0 0 1-.5-.5V14a2 2 0 1 0-4 0v6.5a.5.5 0 0 1-.5.5H4a1 1 0 0 1-1-1v-9z"/></svg>',
        ranking: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H4v-2zm1-2h3V8H5v9zm5 0h3V4h-3v13zm5 0h3v-6h-3v6z"/></svg>',
        history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-2.34-5.66L15 9h7V2l-2.89 2.89A9.96 9.96 0 0 0 12 2zm-1 5h2v6h5v2h-7V7z"/></svg>',
        groups: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>',
        proba: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h2.5l3-6 3 4 3.5-8L20 18h0v2H4v-2z"/></svg>',
        prediction: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.8 5.7L21 8.6l-4.5 4.4L17.6 20 12 17l-5.6 3 1.1-7L3 8.6l6.2-.9L12 2z"/></svg>',
        news: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h14a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5zm3 4h10v2H7V9zm0 4h6v2H7v-2z"/></svg>',
        data: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c5.5 0 10 1.8 10 4s-4.5 4-10 4S2 8.2 2 6s4.5-4 10-4zm0 10c5.5 0 10-1.8 10-4v4c0 2.2-4.5 4-10 4s-10-1.8-10-4V8c0 2.2 4.5 4 10 4zm0 6c5.5 0 10-1.8 10-4v4c0 2.2-4.5 4-10 4s-10-1.8-10-4v-4c0 2.2 4.5 4 10 4z"/></svg>',
        favorites: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.17C.56 9.9 2.2 6 5.98 6c2 0 3.12 1.1 4.02 2.26C10.9 7.1 12.02 6 14.02 6 17.8 6 19.44 9.9 21.5 12.83 19 16.65 12 21 12 21z"/></svg>',
        profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>',
        logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4h9a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-9v-2h8V6h-8V4zM4.7 12l3.6-3.6L9.7 9.8 8.4 11H15v2H8.4l1.3 1.2-1.4 1.4L4.7 12z"/></svg>'
    };

    const pickKey = (href = '', text = '') => {
        const lowerHref = href.toLowerCase();
        const lowerText = text.toLowerCase();
        if (lowerHref.includes('logout')) return 'logout';
        if (lowerHref.includes('profile')) return 'profile';
        if (lowerHref.includes('favorite')) return 'favorites';
        if (lowerHref.includes('index')) return 'home';
        if (lowerHref.includes('ranking')) return 'ranking';
        if (lowerHref.includes('history')) return 'history';
        if (lowerHref.includes('group')) return 'groups';
        if (lowerHref.includes('proba')) return 'proba';
        if (lowerHref.includes('prediction')) return 'prediction';
        if (lowerHref.includes('news')) return 'news';
        if (lowerHref.includes('data-manager')) return 'data';

        if (lowerText.includes('deconnexion')) return 'logout';
        if (lowerText.includes('profil')) return 'profile';
        if (lowerText.includes('favoris')) return 'favorites';
        return null;
    };

    userMenu.querySelectorAll('a').forEach((link) => {
        const currentText = (link.textContent || '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}]/gu, '').trim();
        const key = pickKey(link.getAttribute('href') || '', currentText);
        if (!key || !iconMap[key]) return;

        link.innerHTML = `<span class="menu-link-icon">${iconMap[key]}</span><span class="menu-link-text">${currentText}</span>`;
    });
}

// fermer si click ailleurs
document.addEventListener("click", function(event) {
  const menu = document.getElementById("user-menu");
  const icon = document.querySelector(".user-icon");

    if (!menu || !icon) return;

  if (!menu.contains(event.target) && !icon.contains(event.target)) {
    menu.style.display = "none";
  }
});

// ===== COUNTDOWN CLEAN =====
const targetDate = new Date(2026, 5, 8, 0, 0, 0).getTime();

function updateCountdown() {

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl) return;

    let diff = targetDate - Date.now();

    if (diff <= 0) {
        daysEl.textContent = "0";
        hoursEl.textContent = "0";
        minutesEl.textContent = "0";
        secondsEl.textContent = "0";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
}

document.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

function toggleFavorite(team) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(team)) {
        favorites = favorites.filter(t => t !== team);
    } else {
        favorites.push(team);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    updateFavoritesUI();
}

function updateFavoritesUI() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const favoriteOnIcon = '<span class="fav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-8.17C.56 9.9 2.2 6 5.98 6c2 0 3.12 1.1 4.02 2.26C10.9 7.1 12.02 6 14.02 6 17.8 6 19.44 9.9 21.5 12.83 19 16.65 12 21 12 21z"/></svg></span>';
    const favoriteOffIcon = '<span class="fav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.78 8.4 6 6.98 6 3.2 6 1.56 9.9 3.62 12.83 6.12 16.65 12.1 21 12.1 21s5.98-4.35 8.48-8.17C22.64 9.9 21 6 17.22 6c-1.42 0-3.16.78-5.12 2.64zM12 18.56c-1.58-1.17-4.97-3.88-6.8-6.67C3.9 9.92 4.81 8 6.98 8c1 0 2.32.62 3.62 2.01l1.4 1.5 1.4-1.5C14.7 8.62 16.02 8 17.22 8c2.17 0 3.08 1.92 1.78 3.89-1.83 2.79-5.22 5.5-7 6.67z"/></svg></span>';
    const favoriteBadgeIcon = '<span class="fav-badge-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2l2.9 6 6.6 1-4.8 4.7 1.1 6.6L12 17.2 6.2 20.3l1.1-6.6L2.5 9l6.6-1L12 2z"/></svg></span>';

    document.querySelectorAll(".fav-btn").forEach(btn => {
        let team = btn.getAttribute("data-team");

        if (favorites.includes(team)) {
            btn.classList.add("active");
            btn.innerHTML = favoriteOnIcon;
        } else {
            btn.classList.remove("active");
            btn.innerHTML = favoriteOffIcon;
        }
    });
    document.querySelectorAll(".fav-badge").forEach(badge => {
    let team = badge.getAttribute("data-team");

    if (favorites.includes(team)) {
        badge.innerHTML = favoriteBadgeIcon;
    } else {
        badge.innerHTML = "";
    }
    });
}

document.addEventListener("DOMContentLoaded", updateFavoritesUI);

const COUNTRY_CODE_MAP = {
    "argentina": "ar",
    "france": "fr",
    "brazil": "br",
    "england": "gb",
    "belgium": "be",
    "spain": "es",
    "portugal": "pt",
    "netherlands": "nl",
    "morocco": "ma",
    "germany": "de",
    "croatia": "hr",
    "italy": "it",
    "colombia": "co",
    "senegal": "sn",
    "usa": "us",
    "mexico": "mx",
    "uruguay": "uy",
    "switzerland": "ch",
    "japan": "jp",
    "iran": "ir",
    "ir iran": "ir",
    "denmark": "dk",
    "korea republic": "kr",
    "ecuador": "ec",
    "austria": "at",
    "turkey": "tr",
    "turkiye": "tr",
    "czech republic": "cz",
    "nigeria": "ng",
    "australia": "au",
    "algeria": "dz",
    "canada": "ca",
    "egypt": "eg",
    "norway": "no",
    "panama": "pa",
    "qatar": "qa",
    "slovakia": "sk",
    "cameroon": "cm",
    "tunisia": "tn",
    "romania": "ro",
    "costa rica": "cr",
    "uzbekistan": "uz",
    "peru": "pe",
    "chile": "cl",
    "slovenia": "si",
    "south africa": "za",
    "saudi arabia": "sa",
    "jordan": "jo",
    "ghana": "gh",
    "georgia": "ge",
    "bolivia": "bo",
    "suriname": "sr",
    "iraq": "iq",
    "north macedonia": "mk",
    "republic of ireland": "ie",
    "ireland": "ie",
    "bosnia and herzegovina": "ba",
    "czechia": "cz",
    "sweden": "se",
    "poland": "pl",
    "albania": "al",
    "albanie": "al",
    "hungary": "hu",
    "hongrie": "hu",
    "ukraine": "ua",
    "wales": "gb",
    "northern ireland": "gb",
    "kosovo": "xk",
    "jamaica": "jm",
    "dr congo": "cd",
    "congo dr": "cd",
    "democratic republic of congo": "cd",
    "haiti": "ht",
    "new zealand": "nz",
    "paraguay": "py",
    "scotland": "gb",
    "cape verde": "cv",
    "cabo verde": "cv",
    "ivory coast": "ci",
    "cote d ivoire": "ci",
    "curacao": "cw",
    "venezuela": "ve",
    "guatemala": "gt",
    "honduras": "hn",
    "el salvador": "sv",
    "trinidad and tobago": "tt",
    "bolivarian republic of venezuela": "ve",
    "russia": "ru",
    "serbia": "rs",
    "montenegro": "me",
    "iceland": "is",
    "finland": "fi",
    "greece": "gr",
    "bulgaria": "bg",
    "armenia": "am",
    "azerbaijan": "az",
    "belarus": "by",
    "cyprus": "cy",
    "estonia": "ee",
    "faroe islands": "fo",
    "kazakhstan": "kz",
    "latvia": "lv",
    "lithuania": "lt",
    "luxembourg": "lu",
    "malta": "mt",
    "moldova": "md",
    "andorra": "ad",
    "san marino": "sm",
    "liechtenstein": "li",
    "israel": "il",
    "palestine": "ps",
    "united arab emirates": "ae",
    "uae": "ae",
    "oman": "om",
    "kuwait": "kw",
    "bahrain": "bh",
    "syria": "sy",
    "lebanon": "lb",
    "yemen": "ye",
    "india": "in",
    "china": "cn",
    "china pr": "cn",
    "taiwan": "tw",
    "hong kong": "hk",
    "vietnam": "vn",
    "thailand": "th",
    "indonesia": "id",
    "malaysia": "my",
    "singapore": "sg",
    "philippines": "ph",
    "myanmar": "mm",
    "cambodia": "kh",
    "laos": "la",
    "nepal": "np",
    "pakistan": "pk",
    "bangladesh": "bd",
    "sri lanka": "lk",
    "afghanistan": "af",
    "tajikistan": "tj",
    "kyrgyz republic": "kg",
    "kyrgyzstan": "kg",
    "turkmenistan": "tm",
    "kenya": "ke",
    "uganda": "ug",
    "tanzania": "tz",
    "zambia": "zm",
    "zimbabwe": "zw",
    "angola": "ao",
    "gabon": "ga",
    "benin": "bj",
    "togo": "tg",
    "guinea": "gn",
    "guinea bissau": "gw",
    "sierra leone": "sl",
    "liberia": "lr",
    "madagascar": "mg",
    "mozambique": "mz",
    "namibia": "na",
    "botswana": "bw",
    "mauritania": "mr",
    "equatorial guinea": "gq",
    "comoros": "km",
    "lesotho": "ls",
    "eswatini": "sz",
    "swaziland": "sz",
    "rwanda": "rw",
    "burundi": "bi",
    "ethiopia": "et",
    "sudan": "sd",
    "south sudan": "ss",
    "djibouti": "dj",
    "somalia": "so",
    "gambia": "gm",
    "niger": "ne",
    "chad": "td",
    "central african republic": "cf",
    "malawi": "mw",
    "mali": "ml",
    "burkina faso": "bf",
    "cuba": "cu",
    "dominican republic": "do",
    "puerto rico": "pr",
    "guyana": "gy",
    "barbados": "bb",
    "grenada": "gd",
    "saint kitts and nevis": "kn",
    "saint vincent and the grenadines": "vc",
    "antigua and barbuda": "ag",
    "dominica": "dm",
    "bermuda": "bm",
    "bahamas": "bs",
    "aruba": "aw",
    "martinique": "mq",
    "guadeloupe": "gp",
    "fiji": "fj",
    "solomon islands": "sb",
    "samoa": "ws",
    "tonga": "to",
    "vanuatu": "vu",
    "papua new guinea": "pg",
    "south korea": "kr",
    "united states": "us",
    "to be announced": "un",
    "tbd": "un",
    "na": "un"
};

function normalizeTeamName(teamName) {
    if (!teamName) return "";
    return String(teamName)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
        
}

function normalizeTeamKey(teamName) {
    return normalizeTeamName(teamName)
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getTeamFlagUrl(teamName) {
    const normalized = normalizeTeamKey(teamName);
    const code = COUNTRY_CODE_MAP[normalized];
    if (!code) return null;
    return `https://flagcdn.com/w40/${code}.png`;
}

function getTeamFlagTag(teamName, cssClass = "team-flag") {
    const flagUrl = getTeamFlagUrl(teamName);
    if (!flagUrl) return "";
    return `<img class='${cssClass}' src='${flagUrl}' alt='Drapeau ${teamName}'>`;
}

function cleanTextValue(value, fallback = '') {
    const text = String(value ?? '').trim();
    if (!text) return fallback;
    const normalized = normalizeTeamKey(text);
    if (normalized === 'na' || normalized === 'n a' || normalized === 'n a a' || normalized === 'n a n a' || normalized === 'null' || normalized === 'undefined') {
        return fallback;
    }
    if (text.toLowerCase() === 'n/a' || text.toLowerCase() === 'na') {
        return fallback;
    }
    return text;
}

// ===== API FUNCTIONS =====

let apiBaseUrlPromise = null;

async function resolveApiBaseUrl() {
    if (!apiBaseUrlPromise) {
        apiBaseUrlPromise = (async () => {
            const fallbackBase = `${window.location.protocol}//localhost:3070`;

            try {
                const configResponse = await fetch('/api-config.php', { cache: 'no-store' });
                if (configResponse.ok) {
                    const config = await configResponse.json();
                    const fromConfig = String(config?.apiBaseUrl ?? '').trim().replace(/\/$/, '');
                    if (fromConfig) {
                        return fromConfig;
                    }
                }
            } catch (_error) {
                // Ignore and use fallback
            }

            const host = window.location.hostname;
            if (host === 'localhost' || host === '127.0.0.1') {
                return `${window.location.protocol}//${host}:3070`;
            }

            return fallbackBase;
        })();
    }

    return apiBaseUrlPromise;
}

// Fonction générique pour appeler l'API
async function callAPI(endpoint) {
    try {
        const apiBaseUrl = await resolveApiBaseUrl();

        const response = await fetch(`${apiBaseUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        return null;
    }
}

// Charger et afficher le classement des équipes (sans fallback)
async function loadRanking() {
    const container = document.querySelector(".ranking-container");
    if (!container) return;

    const data = await callAPI('/api/equipes');
    
    // Pas de fallback: afficher une erreur explicite si l'API est indisponible
    if (!data || !data.equipes || data.equipes.length === 0) {
        container.innerHTML = `
            <p style="color:red; text-align:center; padding:20px;">
                API indisponible ou base de donnees vide.<br>
                Vérifiez que Docker est lancé et que le seed a été exécuté.
            </p>
            <p style="color:white; text-align:center;">
                Commande: docker compose exec api npx prisma db seed
            </p>
        `;
        return;
    }

    let html = `
        <div class='ranking-header'>
            <span>Rang</span>
            <span>Equipe</span>
            <span style='text-align:right'>Points FIFA</span>
            <span style='text-align:center'>Fav</span>
        </div>
    `;
    let rank = 1;
    data.equipes.forEach(team => {
        const rankAPI = team.classement || rank;
        const pointsValue = Number(team.points_fifa);
        const points = Number.isFinite(pointsValue) ? pointsValue.toFixed(1) : 'N/A';
        html += `
            <div class='ranking-card'>
                <span class='rank'>${rankAPI}</span>
                <span class='team-name'>
                    ${getTeamFlagTag(team.nom)}
                    ${team.nom}
                    <span class='fav-badge' data-team='${team.nom}'></span>
                </span>
                <span class='points'>${points} pts</span>
                <span class='fav-btn' data-team='${team.nom}' onclick='toggleFavorite("${team.nom}")'><span class='fav-icon' aria-hidden='true'><svg viewBox='0 0 24 24'><path d='M12.1 8.64l-.1.1-.11-.11C10.14 6.78 8.4 6 6.98 6 3.2 6 1.56 9.9 3.62 12.83 6.12 16.65 12.1 21 12.1 21s5.98-4.35 8.48-8.17C22.64 9.9 21 6 17.22 6c-1.42 0-3.16.78-5.12 2.64zM12 18.56c-1.58-1.17-4.97-3.88-6.8-6.67C3.9 9.92 4.81 8 6.98 8c1 0 2.32.62 3.62 2.01l1.4 1.5 1.4-1.5C14.7 8.62 16.02 8 17.22 8c2.17 0 3.08 1.92 1.78 3.89-1.83 2.79-5.22 5.5-7 6.67z'/></svg></span></span>
            </div>
        `;
        rank++;
    });
    container.innerHTML = html;
    updateFavoritesUI();
}

// Charger et afficher l'historique des matchs (sans fallback)
let historyPage = 1;
let historyLoading = false;
let historyTotalPages = 0;
let historyAllLoaded = false;

async function loadHistory(page = 1, append = false) {
    if (historyLoading) return;
    historyLoading = true;

    const container = document.getElementById("history");
    if (!container) return;

    const data = await callAPI(`/api/matchs-historique?page=${page}&limit=50`);
    
    if (!data || !data.matchs || data.matchs.length === 0) {
        historyAllLoaded = true;
        historyLoading = false;
        return;
    }

    historyTotalPages = data.pages || 0;

    let html = '';
    data.matchs.forEach(match => {
        const dateObj = match.date_match ? new Date(match.date_match) : null;
        const dateStr = dateObj && !Number.isNaN(dateObj.getTime())
            ? dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Date inconnue';
        const teamHome = cleanTextValue(match.equipe1, 'Equipe inconnue');
        const teamAway = cleanTextValue(match.equipe2, 'Equipe inconnue');
        const homeFlag = getTeamFlagTag(teamHome, "history-flag");
        const awayFlag = getTeamFlagTag(teamAway, "history-flag");
        const scoreHome = Number.isInteger(match.score1) ? match.score1 : '-';
        const scoreAway = Number.isInteger(match.score2) ? match.score2 : '-';
        const tournoi = cleanTextValue(match.tournoi, 'Match international');

        html += `
            <div class="history-item">
                <span class="date">${dateStr}</span>
                <span class="teams">
                    <span class="history-team home">${homeFlag}<span class="team-text">${teamHome}</span></span>
                    <strong class="score">${scoreHome} - ${scoreAway}</strong>
                    <span class="history-team away"><span class="team-text">${teamAway}</span>${awayFlag}</span>
                </span>
                <span class="tournoi">${tournoi}</span>
            </div>
        `;
    });

    if (append) {
        container.querySelector('.history-list').innerHTML += html;
    } else {
        container.innerHTML = `<h2 class='ranking-title'>Historique des Matchs (40k+ matchs)</h2><div class='history-list'>${html}</div>`;
    }

    historyPage = page;
    historyLoading = false;
}

function onHistoryScroll() {
    const container = document.getElementById("history");
    if (!container || historyAllLoaded || historyLoading) return;

    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        if (historyPage < historyTotalPages) {
            loadHistory(historyPage + 1, true);
        }
    }
}

// Initial load
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("history")) {
        loadHistory(1);
        document.getElementById("history").addEventListener('scroll', onHistoryScroll);
    }
});

// Charger et afficher les groupes (sans fallback)
async function loadGroups() {
    const container = document.querySelector(".groups-container");
    if (!container) return;

    const data = await callAPI('/api/groupes');
    
    if (!data || !data.groupes || data.groupes.length === 0) {
        container.innerHTML = `
            <p style="color:red; text-align:center; padding:20px;">
                Aucun groupe trouve.<br>
                Vérifiez que le fichier fifa-world-cup-2026-UTC.csv a bien été importé.
            </p>
        `;
        return;
    }

    // Récupérer les matchs pour connaître les équipes de chaque groupe
    const matchsData = await callAPI('/api/matchs-cdm2026');
    const groupesMap = {};
    
    if (matchsData && matchsData.matchs) {
        matchsData.matchs.forEach(match => {
            if (match.id_groupe) {
                if (!groupesMap[match.id_groupe]) {
                    groupesMap[match.id_groupe] = {
                        nom: match.groupe?.nom || `Groupe ${match.id_groupe}`,
                        equipes: new Set()
                    };
                }
                if (match.equipe_dom && match.equipe_dom !== 'To be announced') {
                    groupesMap[match.id_groupe].equipes.add(match.equipe_dom);
                }
                if (match.equipe_ext && match.equipe_ext !== 'To be announced') {
                    groupesMap[match.id_groupe].equipes.add(match.equipe_ext);
                }
            }
        });
    }

    let html = "";
    data.groupes.forEach(g => {
        const equipes = groupesMap[g.id_groupe]?.equipes || [];
        html += `<div class="group"><h3>${g.nom}</h3><ul>`;
        if (equipes.size > 0) {
            equipes.forEach(team => {
                html += `<li>${getTeamFlagTag(team)}<span>${team}</span></li>`;
            });
        } else {
            html += `<li>Équipes à déterminer</li>`;
        }
        html += "</ul></div>";
    });
    container.innerHTML = html;
}

// Charger et afficher les prédictions
async function loadPredictions() {
    const container = document.getElementById("predictions-container");
    if (!container) return;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length === 0) {
        container.innerHTML = "<p style='color:white;text-align:center'>Ajoute des equipes en favoris.</p>";
        return;
    }

    let html = "";
    for (const team of favorites) {
        try {
            const fifaData = await callAPI(`/api/scores/fifa/${encodeURIComponent(team)}`);
            const formeData = await callAPI(`/api/scores/forme/${encodeURIComponent(team)}`);

            html += `
                <div class="prediction-card">
                    <h3>${getTeamFlagTag(team)} ${team}</h3>
                    <div class="scores">
                        <p>Score FIFA: ${fifaData ? (fifaData.score_fifa * 100).toFixed(1) + '%' : 'N/A'}</p>
                        <p>Forme récente: ${formeData ? (formeData.forme_recente * 100).toFixed(1) + '%' : 'N/A'}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            html += `
                <div class="prediction-card">
                    <h3>${getTeamFlagTag(team)} ${team}</h3>
                    <p>Erreur lors du chargement des données</p>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}

// Charger et afficher les détails d'une équipe
async function loadTeamDetails(teamName) {
    const container = document.getElementById("teamMatches");
    if (!container) return;

    // TODO: Ajouter la route /api/equipes/:nom/matchs à l'API
    container.innerHTML = `<h3>Matchs de ${teamName}</h3><p>Fonctionnalité à implémenter</p>`;
}

// Charger les probabilités de la CDM 2026 (sans fallback)
async function loadWorldCupProbabilities() {
    const container = document.getElementById("probabilities-container");
    if (!container) return;

    const data = await callAPI('/api/probabilites-2026');
    
    if (!data || !data.favoris || data.favoris.length === 0) {
        container.innerHTML = `
            <p class="proba-intro" style="color:red; text-align:center;">
                Impossible de charger les probabilites.<br>
                Vérifiez que l'API est accessible.
            </p>
        `;
        return;
    }

    const teams = data.favoris;

    let html = `<p class='proba-intro'>Projection des favoris de la Coupe du Monde 2026 selon les statistiques disponibles (forme, classement FIFA et historique).</p><div class='proba-grid'>`;
    teams.forEach((team, index) => {
        const ranking = index + 1;
        const probability = Number(team.probabilite_titulo) || 0;
        const barWidth = Math.max(0, Math.min(100, probability));

        html += `
            <div class='proba-card'>
                <div class='proba-rank'>${index + 1}</div>
                <div class='proba-team'>${getTeamFlagTag(team.equipe, "team-flag")}${team.equipe}</div>
                <div class='proba-bar'><div class='proba-fill' style='width:${barWidth}%'></div></div>
                <div class='proba-value'>${probability.toFixed(1)}%</div>
            </div>
        `;
    });
    html += "</div>";
    container.innerHTML = html;
}

// ===== PAGE INITIALIZATION =====

// Initialiser les pages selon leur contenu
document.addEventListener("DOMContentLoaded", function() {
    updateFavoritesUI();
    setUserTriggerIcon();
    syncUserMenuNavigation();
    setMenuIcons();

    window.addEventListener('resize', syncUserMenuNavigation);

    // Initialiser selon la page courante
    if (document.querySelector(".ranking-container")) {
        loadRanking();
    }
    if (document.getElementById("history")) {
        loadHistory();
    }
    if (document.querySelector(".groups-container")) {
        loadGroups();
    }
    if (document.getElementById("predictions-container")) {
        loadPredictions();
    }
    if (document.getElementById("teamMatches")) {
        const urlParams = new URLSearchParams(window.location.search);
        const team = urlParams.get('team') || 'Morocco';
        loadTeamDetails(team);
    }
    if (document.getElementById("probabilities-container")) {
        loadWorldCupProbabilities();
    }
});