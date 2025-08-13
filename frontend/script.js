const API = "http://localhost:5000/api/employees";

let editMode = false;
let editId = null;

// DOM
const form = document.getElementById("employeeForm");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const positionEl = document.getElementById("position");
const submitBtn = document.getElementById("submitBtn");
const tbody = document.getElementById("employeeTableBody");
const searchEl = document.getElementById("search");

function validEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/.test(email);
}

// Load employees (with optional search)
async function loadEmployees(search = "") {
  const url = search ? `${API}?search=${encodeURIComponent(search)}` : API;
  const res = await fetch(url);
  const data = await res.json();
  renderTable(data);
}

function renderTable(rows) {
  tbody.innerHTML = "";
  if (!rows || rows.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4">No employees found.</td>`;
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(emp => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${emp.name}</td>
      <td>${emp.email}</td>
      <td>${emp.position}</td>
      <td>
        <button class="action-btn edit-btn"
          data-id="${emp._id}"
          data-name="${emp.name}"
          data-email="${emp.email}"
          data-position="${emp.position}">Edit</button>
        <button class="action-btn delete-btn" data-id="${emp._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Add or Update (same form)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const position = positionEl.value.trim();

  if (!name || !email || !position) {
    alert("Please fill all fields");
    return;
  }
  if (!validEmail(email)) {
    alert("Email must end with @gmail.com or @outlook.com");
    return;
  }

  const method = editMode ? "PUT" : "POST";
  const url = editMode ? `${API}/${editId}` : API;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, position })
  });

  if (!res.ok) {
    const msgText = await res.text();
    try {
      const msg = JSON.parse(msgText);
      alert(msg.error || "Failed to save");
    } catch {
      alert("Failed to save");
    }
    return;
  }

  // Reset to Add mode
  editMode = false;
  editId = null;
  submitBtn.textContent = "Add Employee";
  form.reset();

  // reload current search view
  loadEmployees(searchEl.value.trim());
});

// Table click: Edit / Delete
tbody.addEventListener("click", async (e) => {
  const t = e.target;
  if (t.classList.contains("edit-btn")) {
    editMode = true;
    editId = t.dataset.id;
    nameEl.value = t.dataset.name;
    emailEl.value = t.dataset.email;
    positionEl.value = t.dataset.position;
    submitBtn.textContent = "Update Employee";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (t.classList.contains("delete-btn")) {
    const id = t.dataset.id;
    if (!confirm("Delete this employee?")) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    loadEmployees(searchEl.value.trim());
  }
});

// Live search
searchEl.addEventListener("input", (e) => {
  loadEmployees(e.target.value.trim());
});

// Initial load
loadEmployees();
