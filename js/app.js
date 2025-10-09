// app.js - place site-wide JS here. 
// Existing inline scripts remain; migrate important code here over time.
console.log("App script loaded.");
// app.js - объединённый скрипт, полученный из inline <script> блоков.
(function(){
  document.addEventListener('DOMContentLoaded', function(){

/* from: admin.html */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- Вставляєш сюди свої дані Supabase ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById('loginForm');
const loginDiv = document.getElementById('loginDiv');
const adminTable = document.getElementById('adminTable');
const userTable = document.getElementById('userTable');

const ADMIN_LOGIN = 'admin138';
const ADMIN_PASSWORD = 'admin2025';

loginForm.addEventListener('submit', async function(e){
  e.preventDefault();
  const loginValue = document.getElementById('login').value;
  const passwordValue = document.getElementById('password').value;

  if(loginValue === ADMIN_LOGIN && passwordValue === ADMIN_PASSWORD){
    loginDiv.style.display='none';
    adminTable.style.display='block';
    await loadUsers();
  } else {
    alert('Invalid login or password!');
  }
});

async function loadUsers(){
  const { data: users, error } = await supabase.from('users').select('*');
  userTable.innerHTML = '';

  if(error){
    console.error('Supabase error:', error);
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 8;
    td.textContent = 'Error loading users';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    userTable.appendChild(tr);
    return;
  }

  if(!users || users.length === 0){
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 8;
    td.textContent = 'No users registered';
    td.style.textAlign = 'center';
    tr.appendChild(td);
    userTable.appendChild(tr);
    return;
  }

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.firstName || ''}</td>
      <td>${user.lastName || ''}</td>
      <td>${user.email || ''}</td>
      <td>${user.prefix || ''}</td>
      <td>${user.phone || ''}</td>
      <td>${user.goal || ''}</td>
      <td>${user.experience || ''}</td>
      <td>${user.date || ''}</td>
    `;
    userTable.appendChild(tr);
  });
}

/* from: form.html */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById('regForm');
  const phone = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  const survey = document.getElementById('survey');
  const surveyBtn = document.getElementById('surveyBtn');
  const goal = document.getElementById('goal');
  const experience = document.getElementById('experience');
  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];

  function showStep(index){
    steps.forEach(s=>s.classList.remove('active'));
    survey.classList.remove('active');
    if(index>=0 && index<steps.length) steps[index].classList.add('active');
  }

  let userData = {};

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const phoneValue = phone.value.trim();
    if(!/^[0-9]{9,10}$/.test(phoneValue)){
      phoneError.style.display='block';
      phone.focus();
      return;
    }
    phoneError.style.display='none';

    userData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      prefix: document.getElementById('prefix').value,
      phone: phoneValue,
      date: new Date().toLocaleString()
    };
    form.style.display='none';
    survey.classList.add('active');
  });

  surveyBtn.addEventListener('click', async function(){
    if(!goal.value || !experience.value){
      alert('Seleziona tutte le opzioni!');
      return;
    }

    userData.goal = goal.value;
    userData.experience = experience.value;

    try {
      const { data, error } = await supabase.from('users').insert([userData]);
      if(error) throw error;
      console.log('Salvato:', data);
    } catch(err){
      console.error('Errore Supabase:', err);
      alert('Errore durante il salvataggio. Riprova.');
      return;
    }

    survey.classList.remove('active');
    showStep(0);
    setTimeout(()=>showStep(1), 2000);
    setTimeout(()=>showStep(2), 4000);
    setTimeout(()=>showStep(3), 6000);
  });

/* from: index.html */
const slides = document.querySelectorAll('.slide');
  const btn = document.getElementById('slideBtn');
  let current = 0;

  function updateButton(){
    if(current < slides.length - 1){
      btn.textContent = 'Avanti';
      btn.onclick = nextSlide;
    } else {
      btn.textContent = 'Inizia ora';
      btn.onclick = () => { location.href='form.html'; };
    }
  }

  function showSlide(index){
    slides.forEach((s,i)=>s.classList.remove('active'));
    slides[index].classList.add('active');
    current = index;
    updateButton();
  }

  function nextSlide(){
    if(current < slides.length-1){
      showSlide(current+1);
    }
  }

  // Ініціалізація
  showSlide(0);

  // === Particle фон ===
  const canvas=document.getElementById('particles');
  const ctx=canvas.getContext('2d');
  let particlesArray;
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;

  class Particle{
    constructor(){
      this.x=Math.random()*canvas.width;
      this.y=Math.random()*canvas.height;
      this.size=Math.random()*2+1;
      this.speedX=Math.random()*0.5-0.25;
      this.speedY=Math.random()*0.5-0.25;
    }
    update(){
      this.x+=this.speedX;
      this.y+=this.speedY;
      if(this.x>canvas.width)this.x=0;
      if(this.x<0)this.x=canvas.width;
      if(this.y>canvas.height)this.y=0;
      if(this.y<0)this.y=canvas.height;
    }
    draw(){
      ctx.fillStyle='rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fill();
    }
  }

  function init(){particlesArray=[];for(let i=0;i<120;i++){particlesArray.push(new Particle());}}
  function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);particlesArray.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animate);}
  init();animate();
  window.addEventListener('resize',()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    init();
  });

/* from: loading.html */
setTimeout(() => {
      document.querySelector('.spinner').style.display = 'none';
      document.querySelector('.success').style.display = 'block';

      setTimeout(() => {
        window.location.href = 'manager.html';
      }, 2000);
    }, 3000);

/* from: manager.html */
setTimeout(() => {
      document.querySelector('.spinner').style.display = 'none';
      document.querySelector('.success').style.display = 'block';

      setTimeout(() => {
        document.querySelector('.success').style.display = 'none';
        document.querySelector('.manager-info').style.display = 'block';
      }, 2000);
    }, 3000);

/* from: questions.html */
document.getElementById('quizForm').addEventListener('submit', function(e){
      e.preventDefault();

      const formData = new FormData(this);
      const answers = Object.fromEntries(formData.entries());

      // Salviamo le risposte in localStorage (temporaneamente)
      localStorage.setItem('userAnswers', JSON.stringify(answers));

      // Passiamo alla prossima pagina
      window.location.href = 'loading.html';
    });
  });
})();
