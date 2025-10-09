// ✅ app.js — стабільна версія без import, сумісна з Vercel
console.log("✅ App script loaded.");

// === Ініціалізація Supabase з window.__env ===
if (!window.__env || !window.__env.SUPABASE_URL || !window.__env.SUPABASE_ANON_KEY) {
  console.error("❌ env.js не знайдено або містить помилки.");
} else {
  window.supabase = supabase.createClient(window.__env.SUPABASE_URL, window.__env.SUPABASE_ANON_KEY);
}

// === ADMIN PANEL ===
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginDiv = document.getElementById("loginDiv");
  const adminTable = document.getElementById("adminTable");
  const userTable = document.getElementById("userTable");

  if (loginForm) {
    const ADMIN_LOGIN = "admin138";
    const ADMIN_PASSWORD = "admin2025";

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginValue = document.getElementById("login").value;
      const passwordValue = document.getElementById("password").value;

      if (loginValue === ADMIN_LOGIN && passwordValue === ADMIN_PASSWORD) {
        loginDiv.style.display = "none";
        adminTable.style.display = "block";
        await loadUsers();
      } else {
        alert("❌ Невірний логін або пароль!");
      }
    });

    async function loadUsers() {
      const { data: users, error } = await supabase.from("users").select("*");
      userTable.innerHTML = "";

      if (error) {
        console.error("Supabase error:", error);
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="8" style="text-align:center;">Error loading users</td>`;
        userTable.appendChild(tr);
        return;
      }

      if (!users || users.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="8" style="text-align:center;">No users registered</td>`;
        userTable.appendChild(tr);
        return;
      }

      users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.firstName || ""}</td>
          <td>${user.lastName || ""}</td>
          <td>${user.email || ""}</td>
          <td>${user.prefix || ""}</td>
          <td>${user.phone || ""}</td>
          <td>${user.goal || ""}</td>
          <td>${user.experience || ""}</td>
          <td>${user.date || ""}</td>
        `;
        userTable.appendChild(tr);
      });
    }
  }

  // === FORM PAGE ===
  const form = document.getElementById("regForm");
  if (form) {
    const phone = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");
    const survey = document.getElementById("survey");
    const surveyBtn = document.getElementById("surveyBtn");
    const goal = document.getElementById("goal");
    const experience = document.getElementById("experience");

    const steps = [
      document.getElementById("step1"),
      document.getElementById("step2"),
      document.getElementById("step3"),
      document.getElementById("step4"),
    ];

    function showStep(index) {
      steps.forEach((s) => s.classList.remove("active"));
      survey.classList.remove("active");
      if (index >= 0 && index < steps.length) steps[index].classList.add("active");
    }

    let userData = {};

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phoneValue = phone.value.trim();
      if (!/^[0-9]{9,10}$/.test(phoneValue)) {
        phoneError.style.display = "block";
        phone.focus();
        return;
      }
      phoneError.style.display = "none";

      userData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        prefix: document.getElementById("prefix").value,
        phone: phoneValue,
        date: new Date().toLocaleString(),
      };

      form.style.display = "none";
      survey.classList.add("active");
    });

    surveyBtn.addEventListener("click", async () => {
      if (!goal.value || !experience.value) {
        alert("Seleziona tutte le opzioni!");
        return;
      }

      userData.goal = goal.value;
      userData.experience = experience.value;

      try {
        const { error } = await supabase.from("users").insert([userData]);
        if (error) throw error;
      } catch (err) {
        console.error("❌ Supabase error:", err);
        alert("Errore durante il salvataggio. Riprova.");
        return;
      }

      survey.classList.remove("active");
      showStep(0);
      setTimeout(() => showStep(1), 2000);
      setTimeout(() => showStep(2), 4000);
      setTimeout(() => showStep(3), 6000);
    });
  }

  // === INDEX PAGE ===
  const slides = document.querySelectorAll(".slide");
  const btn = document.getElementById("slideBtn");

  if (slides.length && btn) {
    let current = 0;

    function updateButton() {
      if (current < slides.length - 1) {
        btn.textContent = "Avanti";
        btn.onclick = nextSlide;
      } else {
        btn.textContent = "Inizia ora";
        btn.onclick = () => (window.location.href = "form.html");
      }
    }

    function showSlide(index) {
      slides.forEach((s) => s.classList.remove("active"));
      slides[index].classList.add("active");
      current = index;
      updateButton();
    }

    function nextSlide() {
      if (current < slides.length - 1) showSlide(current + 1);
    }

    showSlide(0);
  }

  // === LOADING PAGE ===
  const spinner = document.querySelector(".spinner");
  const success = document.querySelector(".success");
  if (spinner && success) {
    setTimeout(() => {
      spinner.style.display = "none";
      success.style.display = "block";
      setTimeout(() => {
        window.location.href = "manager.html";
      }, 2000);
    }, 3000);
  }

  // === MANAGER PAGE ===
  const managerInfo = document.querySelector(".manager-info");
  if (managerInfo) {
    setTimeout(() => {
      document.querySelector(".spinner").style.display = "none";
      document.querySelector(".success").style.display = "block";

      setTimeout(() => {
        document.querySelector(".success").style.display = "none";
        managerInfo.style.display = "block";
      }, 2000);
    }, 3000);
  }

  // === QUESTIONS PAGE ===
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(quizForm);
      const answers = Object.fromEntries(formData.entries());
      localStorage.setItem("userAnswers", JSON.stringify(answers));
      window.location.href = "loading.html";
    });
  }
});
