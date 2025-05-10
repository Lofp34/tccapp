import { auth, db, getSynthesisFromBackend } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const syntheseBtn = document.getElementById('synthese-btn');
const journalContainer = document.getElementById('journal-container');

let conversationHistory = [];

// Auth
loginBtn.onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (e) {
    alert('Erreur connexion : ' + e.message);
  }
};

registerBtn.onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (e) {
    alert('Erreur inscription : ' + e.message);
  }
};

logoutBtn.onclick = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    userInfo.textContent = `Connecté en tant que : ${user.email}`;
    authSection.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    appSection.classList.remove('hidden');
    loadJournal();
  } else {
    userInfo.textContent = '';
    authSection.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    appSection.classList.add('hidden');
  }
});

// Chat
function renderChat() {
  chatContainer.innerHTML = '';
  conversationHistory.forEach(msg => {
    const div = document.createElement('div');
    div.className = msg.role === 'user' ? 'text-right mb-1' : 'text-left mb-1 text-blue-700';
    div.textContent = `${msg.role === 'user' ? 'Moi' : 'IA'} : ${msg.content}`;
    chatContainer.appendChild(div);
  });
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.onclick = () => {
  const content = chatInput.value.trim();
  if (!content) return;
  conversationHistory.push({ role: 'user', content });
  renderChat();
  chatInput.value = '';
};

// Synthèse et Enregistrement
syntheseBtn.onclick = async () => {
  if (conversationHistory.length === 0) return alert('Commencez une conversation !');
  syntheseBtn.disabled = true;
  syntheseBtn.textContent = 'Analyse en cours...';
  try {
    const synthesis = await getSynthesisFromBackend(conversationHistory);
    saveSynthesis(synthesis, conversationHistory);
    conversationHistory = [];
    renderChat();
    loadJournal();
    alert('Synthèse enregistrée !');
  } catch (e) {
    alert('Erreur lors de la synthèse : ' + e.message);
  }
  syntheseBtn.disabled = false;
  syntheseBtn.textContent = 'Synthèse et Enregistrement';
};

// Journal (MVP : localStorage)
function saveSynthesis(synthesis, conversation) {
  const user = auth.currentUser;
  if (!user) return;
  const key = `journal_${user.uid}`;
  const journal = JSON.parse(localStorage.getItem(key) || '[]');
  journal.unshift({
    ...synthesis,
    date: new Date().toISOString(),
    rawConversation: conversation
  });
  localStorage.setItem(key, JSON.stringify(journal));
}

function loadJournal() {
  const user = auth.currentUser;
  if (!user) return;
  const key = `journal_${user.uid}`;
  const journal = JSON.parse(localStorage.getItem(key) || '[]');
  journalContainer.innerHTML = '';
  if (journal.length === 0) {
    journalContainer.innerHTML = '<div class="text-gray-400">Aucune synthèse enregistrée.</div>';
    return;
  }
  journal.forEach((entry, idx) => {
    const div = document.createElement('div');
    div.className = 'border rounded p-2 bg-gray-50';
    div.innerHTML = `
      <div class="text-xs text-gray-500 mb-1">${new Date(entry.date).toLocaleString()}</div>
      <div><b>Situation :</b> ${entry.situation}</div>
      <div><b>Émotions :</b> ${entry.emotions}</div>
      <div><b>Intensité :</b> ${entry.intensity}</div>
      <div><b>Pensées :</b> ${entry.thoughts}</div>
      <div><b>Degré de croyance :</b> ${entry.beliefDegree}</div>
      <div><b>Sensations :</b> ${entry.sensations}</div>
      <div><b>Comportements :</b> ${entry.behaviors}</div>
      <details class="mt-1"><summary class="cursor-pointer text-blue-600">Voir la conversation</summary><pre class="text-xs">${entry.rawConversation.map(m => `${m.role}: ${m.content}`).join('\n')}</pre></details>
      <button class="text-red-500 mt-2" onclick="this.parentElement.remove();removeSynthesis(${idx})">Supprimer</button>
    `;
    journalContainer.appendChild(div);
  });
}

window.removeSynthesis = function(idx) {
  const user = auth.currentUser;
  if (!user) return;
  const key = `journal_${user.uid}`;
  const journal = JSON.parse(localStorage.getItem(key) || '[]');
  journal.splice(idx, 1);
  localStorage.setItem(key, JSON.stringify(journal));
  loadJournal();
}; 