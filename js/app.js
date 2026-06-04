// ─── ALKE WALLET - app.js ───────────────────────────────────────────────────

// ── Estado global de la app ──
const AlkeWallet = {
  users: [
    { id: 1, name: "María González", email: "maria@alkemy.com", password: "123456", balance: 85000 },
    { id: 2, name: "Carlos Pérez",   email: "carlos@alkemy.com", password: "password", balance: 42500 }
  ],

  contacts: [
    { id: 1, name: "Ana López",       email: "ana@email.com",    avatar: "AL" },
    { id: 2, name: "Pedro Ramírez",   email: "pedro@email.com",  avatar: "PR" },
    { id: 3, name: "Sofía Torres",    email: "sofia@email.com",  avatar: "ST" },
    { id: 4, name: "Javier Morales",  email: "javier@email.com", avatar: "JM" },
    { id: 5, name: "Lucía Fernández", email: "lucia@email.com",  avatar: "LF" }
  ],

  transactions: [
    { id: 1, type: "income",  name: "Salario Alkemy",   amount: 85000, date: "2025-06-01", category: "Ingreso" },
    { id: 2, type: "expense", name: "Ana López",        amount: 5000,  date: "2025-05-30", category: "Transferencia" },
    { id: 3, type: "income",  name: "Pedro Ramírez",    amount: 12000, date: "2025-05-28", category: "Recibido" },
    { id: 4, type: "expense", name: "Sofía Torres",     amount: 3500,  date: "2025-05-25", category: "Transferencia" },
    { id: 5, type: "expense", name: "Depósito retiro",  amount: 2000,  date: "2025-05-22", category: "Retiro" },
    { id: 6, type: "income",  name: "Javier Morales",   amount: 8000,  date: "2025-05-20", category: "Recibido" },
    { id: 7, type: "expense", name: "Lucía Fernández",  amount: 1500,  date: "2025-05-18", category: "Transferencia" },
    { id: 8, type: "income",  name: "Depósito propio",  amount: 20000, date: "2025-05-15", category: "Depósito" }
  ],

  // ── Sesión ──
  getSession() {
    const data = sessionStorage.getItem('alke_user');
    return data ? JSON.parse(data) : null;
  },
  setSession(user) {
    sessionStorage.setItem('alke_user', JSON.stringify(user));
  },
  clearSession() {
    sessionStorage.removeItem('alke_user');
  },

  // ── Saldo ──
  getBalance() {
    const stored = localStorage.getItem('alke_balance');
    if (stored !== null) return parseFloat(stored);
    const user = this.getSession();
    return user ? user.balance : 0;
  },
  setBalance(amount) {
    localStorage.setItem('alke_balance', amount);
  },

  // ── Transacciones ──
  getTransactions() {
    const stored = localStorage.getItem('alke_transactions');
    return stored ? JSON.parse(stored) : [...this.transactions];
  },
  addTransaction(tx) {
    const txs = this.getTransactions();
    txs.unshift({ ...tx, id: Date.now(), date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('alke_transactions', JSON.stringify(txs));
  },

  // ── Formato ──
  formatMoney(amount) {
    return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(amount);
  },
  formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
};

// ── Proteger páginas que requieren login ──
function requireAuth() {
  const user = AlkeWallet.getSession();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

// ── Logout ──
function logout() {
  AlkeWallet.clearSession();
  window.location.href = 'login.html';
}

// ── Mostrar alerta ──
function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `alke-alert ${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}

// ── Animación de número ──
function animateNumber(el, from, to, duration = 600) {
  const start = performance.now();
  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * eased;
    el.textContent = AlkeWallet.formatMoney(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Navbar con usuario ──
function initNavbar(userName) {
  const userEl = document.getElementById('nav-user');
  if (userEl) userEl.textContent = userName || '';
}
