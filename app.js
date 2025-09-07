/* app.js - ZeroBite prototype
   - hash routing: #home, #donor, #recipient, #leaderboard, #campaigns, #admin
   - localStorage-backed seed data
   - dynamic rendering for each view
*/

// -------------------- Seed data --------------------
const seedDonors = [
  {
    id: 1,
    name: "Aditya Dhiman",
    type: "Individual",
    donations: 22,
    points: 420,
  },
  {
    id: 2,
    name: "Green Cafe",
    type: "Restaurant",
    donations: 130,
    points: 3120,
  },
  { id: 3, name: "FreshMart", type: "Store", donations: 82, points: 1800 },
  {
    id: 4,
    name: "Community Kitchen",
    type: "NGO",
    donations: 54,
    points: 1100,
  },
];

const seedFood = [
  {
    id: 101,
    type: "Rice Meal Boxes",
    qty: 40,
    expiry: "6 hours",
    donor: "Green Cafe",
    location: "Sector 24",
    status: "Available",
    pickup: true,
  },
  {
    id: 102,
    type: "Veg Thali",
    qty: 20,
    expiry: "4 hours",
    donor: "Community Kitchen",
    location: "Old City",
    status: "Available",
    pickup: false,
  },
  {
    id: 103,
    type: "Bread Packs",
    qty: 100,
    expiry: "24 hours",
    donor: "FreshMart",
    location: "Market Road",
    status: "Available",
    pickup: true,
  },
  {
    id: 104,
    type: "Cooked Curry",
    qty: 18,
    expiry: "5 hours",
    donor: "Aditya Dhiman",
    location: "Green Park",
    status: "Pending Approval",
    pickup: true,
  },
];

const seedUsers = [
  "aditya@example.com",
  "manager@greencafe.com",
  "admin@ZeroBite.org",
];

function seedLocal() {
  if (!localStorage.getItem("ff_donors"))
    localStorage.setItem("ff_donors", JSON.stringify(seedDonors));
  if (!localStorage.getItem("ff_food"))
    localStorage.setItem("ff_food", JSON.stringify(seedFood));
  if (!localStorage.getItem("ff_users"))
    localStorage.setItem("ff_users", JSON.stringify(seedUsers));
}
seedLocal();

// -------------------- Utilities --------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const getData = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// -------------------- Header & Footer --------------------
function renderHeader(active) {
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
  <div class="container inner">
    <div class="brand">
      <div class="logo-mark">ZB</div>
      <div>
        <div class="logo-text">ZeroBite</div>
        <div class="kicker">Zero Waste. Zero Hunger.</div>
      </div>
    </div>

    <nav class="nav">
      <a href="#home" class="${active === "home" ? "active" : ""}">Home</a>
      <a href="#donor" class="${active === "donor" ? "active" : ""}">Donate</a>
      <a href="#recipient" class="${
        active === "recipient" ? "active" : ""
      }">Recipients</a>
      <a href="#leaderboard" class="${
        active === "leaderboard" ? "active" : ""
      }">Leaderboard</a>
      <a href="#campaigns" class="${
        active === "campaigns" ? "active" : ""
      }">Campaigns</a>
      <a href="#admin" class="${active === "admin" ? "active" : ""}">Admin</a>
    </nav>

    <div class="header-actions">
      <div class="search" title="Search food or donors">
        <i class="fas fa-search" style="color:var(--muted)"></i>
        <input id="globalSearch" placeholder="Search donors, food..." />
      </div>
      <button class="icon-btn" id="themeToggle" title="Toggle theme"><i class="fas fa-sun"></i></button>
      <button class="btn" onclick="location.hash='#donor'">Donate Now</button>
    </div>
  </div>`;
  return header;
}

function renderFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<div class="container"><div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
    <div style="color:var(--muted)">© ${new Date().getFullYear()} ZeroBite · Built for good</div>
    <div style="display:flex;gap:0.6rem;color:var(--muted)"><a href="#campaigns">Impact</a><a href="#admin">Admin</a><a href="#">Contact</a></div>
  </div></div>`;
  return footer;
}

// -------------------- Views --------------------
function viewHome() {
  const donors = getData("ff_donors");
  const food = getData("ff_food");
  const topDonor = donors.slice().sort((a, b) => b.points - a.points)[0] ||
    donors[0] || { name: "—", donations: 0, points: 0 };

  return `
  <section class="container hero">
    <div class="hero-card">
      <div>
        <h1>Fight Hunger. <span style="color:var(--accent)">Stop Waste.</span></h1>
        <p class="meta">ZeroBite connects surplus food from individuals, restaurants, and stores to local communities in need — and turns non-edible waste into compost.</p>
        <div class="cta-row">
          <button class="btn" onclick="location.hash='#donor'">Donate Now</button>
          <button class="btn secondary" onclick="location.hash='#campaigns'">See Campaigns</button>
        </div>

        <div style="display:flex;gap:0.8rem;margin-top:1.25rem">
          <div class="small-stat card"><b>${
            food.length
          }</b><div>Active food offers</div></div>
          <div class="small-stat card"><b>${donors.reduce(
            (s, d) => s + d.donations,
            0
          )}</b><div>Total donations</div></div>
          <div class="small-stat card"><b>${
            donors.length
          }</b><div>Registered donors</div></div>
        </div>
      </div>
      <div>
        <div class="card">
          <h3>Top Donor</h3>
          <div style="display:flex;align-items:center;gap:1rem;margin-top:0.6rem">
            <div class="food-thumb" style="width:86px;height:86px;border-radius:12px;display:flex;align-items:center;justify-content:center">${topDonor.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}</div>
            <div>
              <div style="font-weight:800">${topDonor.name}</div>
              <div class="meta">${topDonor.donations} donations · ${
    topDonor.points
  } pts</div>
              <div style="margin-top:0.6rem"><button class="btn" onclick="location.hash='#leaderboard'">See leaderboard</button></div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:1rem">
          <h3>How it works</h3>
          <ol style="color:var(--muted);margin:0;padding-left:1rem">
            <li>Donor posts surplus food (quick form).</li>
            <li>Local recipients request pickup or drop.</li>
            <li>Admin approves & coordinates pickup.</li>
            <li>Non-edible items go to compost partners.</li>
          </ol>
        </div>
      </div>
    </div>

    <div style="margin-top:1.25rem;display:grid;grid-template-columns:2fr 1fr;gap:1.25rem">
      <div>
        <div class="card"><h3>Latest food offers</h3>
          <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.8rem">
            ${food
              .map(
                (f) => `
              <div class="food-card card">
                <div class="food-left">
                  <div class="food-thumb">${(f.type || "F")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}</div>
                  <div class="food-body">
                    <h4>${f.type}</h4>
                    <div class="food-meta">${f.qty} units · ${f.expiry} · ${
                  f.location
                } · donated by <b>${f.donor}</b></div>
                  </div>
                </div>
                <div>
                  <button class="btn" onclick="requestFood(${
                    f.id
                  })">Request</button>
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
      <div>
        <div class="card"><h3>Monthly Impact</h3>
          <canvas id="impactChart" style="max-height:220px"></canvas>
        </div>
        <div class="card" style="margin-top:1rem">
          <h3>Partners</h3>
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.6rem">
            <span class="badge">Zomato</span>
            <span class="badge">Swiggy</span>
            <span class="badge">GreenFarm</span>
            <span class="badge">CityWaste</span>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function viewDonor() {
  return `
  <section class="container">
    <div style="display:flex;gap:1rem;align-items:flex-start">
      <div style="flex:1">
        <div class="card"><h3>Quick Donate</h3>
          <form id="donorForm" style="margin-top:0.8rem">
            <div class="form-grid">
              <input class="input" id="d_type" placeholder="Food type (e.g. Rice Meal Boxes)" required />
              <input class="input" id="d_qty" type="number" placeholder="Quantity" required />
              <input class="input" id="d_location" placeholder="Location / Area" required />
              <select class="input" id="d_pickup">
                <option value="pickup">Pickup</option>
                <option value="drop">Drop</option>
              </select>
            </div>
            <div style="margin-top:0.8rem;display:flex;gap:0.6rem">
              <button class="btn" type="submit">Post Donation</button>
              <button class="btn secondary" type="button" onclick="prefillDemo();">Auto Fill Demo</button>
            </div>
          </form>
        </div>

        <div class="card" style="margin-top:1rem"><h3>Your Past Donations</h3>
          <div id="donorHistory" style="margin-top:0.6rem"></div>
        </div>
      </div>

      <div style="width:360px">
        <div class="card"><h3>Tips for safe donations</h3>
          <ul style="color:var(--muted);margin:0;padding-left:1rem">
            <li>Only donate edible, packaged or covered food.</li>
            <li>Label expiry / preparation time clearly.</li>
            <li>Prefer small batches to avoid waste.</li>
          </ul>
        </div>

        <div class="card" style="margin-top:1rem"><h3>Donation Score</h3>
          <div style="font-size:28px;font-weight:800">+${Math.floor(
            Math.random() * 500
          )}</div>
          <div class="meta" style="margin-top:0.5rem">Leaderboard points will be awarded for each verified donation.</div>
        </div>
      </div>
    </div>
  </section>`;
}

function viewRecipient() {
  return `
  <section class="container">
    <div style="display:flex;gap:1rem">
      <div style="flex:1">
        <div class="card"><h3>Nearby Food</h3>
          <div id="recipientList" style="margin-top:0.8rem;display:grid;grid-template-columns:repeat(2,1fr);gap:0.8rem"></div>
        </div>

        <div class="card" style="margin-top:1rem"><h3>Requests</h3>
          <div id="requestList"></div>
        </div>
      </div>

      <div style="width:340px">
        <div class="card"><h3>Feedback</h3>
          <form id="recFeedback" style="display:flex;flex-direction:column;gap:0.6rem">
            <input class="input" id="fb_name" placeholder="Your name" required />
            <textarea class="input" id="fb_msg" placeholder="Share your experience" required></textarea>
            <button class="btn" type="submit">Send Feedback</button>
          </form>
        </div>

        <div class="card" style="margin-top:1rem"><h3>Safety & Hygiene</h3>
          <p class="meta">All food is screened by admins for basic safety before approval. Always follow pickup guidelines.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function viewLeaderboard() {
  return `
  <section class="container">
    <div class="card"><h3>Top Donors</h3>
      <table class="table" style="margin-top:0.8rem">
        <thead><tr><th>Rank</th><th>Name</th><th>Type</th><th>Donations</th><th>Points</th></tr></thead>
        <tbody id="lb_body"></tbody>
      </table>
    </div>
    <div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div class="card"><h3>Monthly Champions</h3><div id="champions" style="margin-top:0.6rem"></div></div>
      <div class="card"><h3>Badges</h3><div style="margin-top:0.6rem;color:var(--muted)">Bronze / Silver / Gold badges based on points.</div></div>
    </div>
  </section>`;
}

function viewCampaigns() {
  return `
  <section class="container">
    <div class="card"><h3>Campaigns & Stories</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:0.8rem">
        <div class="card"><h4>Zero Waste Week</h4><p class="meta">Local restaurants reduced waste by 40% in one week.</p></div>
        <div class="card"><h4>Impact Story — Rahim</h4><p class="meta">From getting daily meals to now volunteering as a hub coordinator.</p></div>
        <div class="card"><h4>Composting Drive</h4><p class="meta">Turning non-edible waste into nutrient-rich compost.</p></div>
      </div>
    </div>
  </section>`;
}

function viewAdmin() {
  return `
  <section class="container">
    <div style="display:grid;grid-template-columns:1fr 360px;gap:1rem">
      <div>
        <div class="card"><h3>Pending Approvals</h3>
          <div id="adminApprovalList" style="margin-top:0.8rem"></div>
        </div>

        <div class="card" style="margin-top:1rem"><h3>Users</h3>
          <ul id="adminUsers"></ul>
        </div>
      </div>

      <div>
        <div class="card"><h3>Analytics</h3>
          <canvas id="adminChart" style="max-height:260px"></canvas>
        </div>
        <div class="card" style="margin-top:1rem"><h3>Actions</h3>
          <button class="btn" id="clearData">Reset Seed Data</button>
        </div>
      </div>
    </div>
  </section>`;
}

// -------------------- Router --------------------
function router() {
  const hash = location.hash.replace("#", "") || "home";
  const view = $("#view");
  view.innerHTML = "";
  // remove existing header/footer before injecting
  document.querySelectorAll("header, footer").forEach((n) => n.remove());
  document.body.prepend(renderHeader(hash));
  document.body.appendChild(renderFooter());
  let html = "";
  switch (hash) {
    case "donor":
      html = viewDonor();
      break;
    case "recipient":
      html = viewRecipient();
      break;
    case "leaderboard":
      html = viewLeaderboard();
      break;
    case "campaigns":
      html = viewCampaigns();
      break;
    case "admin":
      html = viewAdmin();
      break;
    default:
      html = viewHome();
      break;
  }
  view.innerHTML = html;
  attachHandlers(hash);
}

// -------------------- Attach handlers after render --------------------
function attachHandlers(page) {
  // theme
  const theme = $("#themeToggle");
  if (theme) theme.onclick = toggleTheme;
  const search = $("#globalSearch");
  if (search)
    search.addEventListener("input", (e) => filterGlobal(e.target.value));

  if (page === "donor") {
    const form = $("#donorForm");
    if (form)
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = $("#d_type").value.trim();
        const qty = +$("#d_qty").value;
        const location = $("#d_location").value.trim();
        const pickup = $("#d_pickup").value;
        if (!type || !qty || !location) return alert("Fill all fields");
        const newItem = {
          id: Date.now(),
          type,
          qty,
          expiry: "6 hours",
          donor: "You",
          location,
          status: "Pending Approval",
          pickup: pickup === "pickup",
        };
        const food = getData("ff_food");
        food.unshift(newItem);
        setData("ff_food", food);
        let donors = getData("ff_donors");
        let me = donors.find((d) => d.name === "You");
        if (!me) {
          me = {
            id: Date.now(),
            name: "You",
            type: "Individual",
            donations: 1,
            points: 40,
          };
          donors.unshift(me);
        } else {
          me.donations += 1;
          me.points += 40;
        }
        setData("ff_donors", donors);
        alert("Donation posted! Pending admin approval.");
        location.hash = "#home";
      });

    // show donor history
    const h = $("#donorHistory");
    if (h) {
      const all = getData("ff_food").filter(
        (f) =>
          f.donor === "You" ||
          f.donor === "Aditya Dhiman" ||
          f.donor === "Community Kitchen"
      );
      h.innerHTML =
        all.length === 0
          ? '<div class="meta">No donations yet</div>'
          : all
              .map(
                (f) =>
                  `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${f.type}</b><div class="meta">${f.qty} · ${f.location} · ${f.status}</div></div><div><button class="btn secondary" onclick="editDonation(${f.id})">Edit</button></div></div>`
              )
              .join("");
    }
  }

  if (page === "recipient") {
    const list = $("#recipientList");
    const arr = getData("ff_food").filter((f) => f.status === "Available");
    list.innerHTML = arr
      .map(
        (f) =>
          `<div class="card"><div style="display:flex;gap:0.8rem;align-items:center"><div class="food-thumb">${f.type
            .split(" ")
            .map((x) => x[0])
            .slice(0, 2)
            .join("")}</div><div><h4>${f.type}</h4><div class="meta">${
            f.qty
          } · ${f.location} · donated by ${
            f.donor
          }</div></div></div><div style="margin-top:0.8rem"><button class="btn" onclick="requestFood(${
            f.id
          })">Request Pickup</button></div></div>`
      )
      .join("");
    const reqForm = $("#recFeedback");
    if (reqForm)
      reqForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Thanks for your feedback!");
        reqForm.reset();
      });
  }

  if (page === "leaderboard") {
    const lb = getData("ff_donors")
      .slice()
      .sort((a, b) => b.points - a.points);
    const tbody = $("#lb_body");
    if (tbody)
      tbody.innerHTML = lb
        .map(
          (d, i) =>
            `<tr><td>#${i + 1}</td><td>${d.name}</td><td>${
              d.type || "N/A"
            }</td><td>${d.donations}</td><td><span class="badge">${
              d.points
            }</span></td></tr>`
        )
        .join("");
    const champs = $("#champions");
    if (champs && lb.length)
      champs.innerHTML = `<div style="font-weight:700">${lb[0].name}</div><div class="meta">${lb[0].points} pts</div>`;
  }

  if (page === "admin") {
    const approvals = $("#adminApprovalList");
    const pend = getData("ff_food").filter(
      (f) => f.status && f.status.toLowerCase().includes("pending")
    );
    approvals.innerHTML =
      pend.length === 0
        ? '<div class="meta">No pending items</div>'
        : pend
            .map(
              (p) =>
                `<div class="card" style="display:flex;justify-content:space-between;align-items:center"><div><b>${p.type}</b><div class="meta">${p.qty} · ${p.location} · ${p.donor}</div></div><div><button class="btn" onclick="approve(${p.id})">Approve</button></div></div>`
            )
            .join("");
    const us = $("#adminUsers");
    if (us)
      us.innerHTML = getData("ff_users")
        .map((u) => `<li>${u}</li>`)
        .join("");
    const clearBtn = $("#clearData");
    if (clearBtn)
      clearBtn.onclick = () => {
        if (confirm("Reset to seed data?")) {
          localStorage.clear();
          seedLocal();
          location.reload();
        }
      };
  }

  // render charts if present
  renderCharts();
}

// -------------------- Actions --------------------
function requestFood(id) {
  const food = getData("ff_food");
  const item = food.find((f) => f.id === id);
  if (!item) return alert("Offer not found");
  item.status = "Requested";
  setData("ff_food", food);
  alert("Request sent. Admin will coordinate pickup.");
  router();
}

function approve(id) {
  const food = getData("ff_food");
  const item = food.find((f) => f.id === id);
  if (item) {
    item.status = "Available";
    setData("ff_food", food);
    alert("Approved");
    router();
  }
}

function editDonation(id) {
  alert("Edit flow — placeholder for modal edit.");
}
function prefillDemo() {
  $("#d_type").value = "Cooked Veg Curry";
  $("#d_qty").value = 10;
  $("#d_location").value = "Demo Zone";
}

// -------------------- Search (prototype) --------------------
function filterGlobal(txt) {
  if (!txt) return;
  alert(
    "Search (prototype): " +
      txt +
      "\nFuture: implement live filtering & highlighting."
  );
}

// -------------------- Theme --------------------
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  localStorage.setItem(
    "ff_theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
}
function initTheme() {
  const t = localStorage.getItem("ff_theme");
  if (t === "light") document.body.classList.add("light-theme");
}

// -------------------- Charts --------------------
function renderCharts() {
  // Home impact
  const ctx = document.getElementById("impactChart");
  if (ctx && typeof Chart !== "undefined") {
    if (ctx._chart) ctx._chart.destroy();
    ctx._chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Meals", "Boxes", "Packs"],
        datasets: [
          {
            data: [120, 80, 40],
            backgroundColor: ["#22c55e", "#06b6d4", "#f59e0b"],
          },
        ],
      },
      options: { plugins: { legend: { position: "bottom" } } },
    });
  }

  const ctx2 = document.getElementById("adminChart");
  if (ctx2 && typeof Chart !== "undefined") {
    if (ctx2._chart) ctx2._chart.destroy();
    ctx2._chart = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
          {
            label: "Donations",
            data: [120, 200, 180, 220, 260],
            backgroundColor: "#22c55e",
          },
        ],
      },
      options: { plugins: { legend: { display: false } } },
    });
  }
}

// -------------------- Router & init --------------------
window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
  router();
  initTheme();
});
window.requestFood = requestFood;
window.approve = approve;
window.editDonation = editDonation;
window.prefillDemo = prefillDemo;
