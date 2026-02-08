// Authentication system using localStorage and user.json
class AuthSystem {
  constructor() {
    this.users = [];
    this.currentUser = null;
    this.initPromise = this.init();
  }

  async init() {
    // Load users from user.json
    try {
      const response = await fetch('./user.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.users = await response.json();
      console.log('Users loaded:', this.users.length);
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      // Show warning message if in a browser context
      if (typeof window !== 'undefined' && document.body) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-0 left-0 right-0 bg-red-100 text-red-800 p-3 text-center';
        errorDiv.textContent = 'Gagal memuat data pengguna. Silakan refresh halaman.';
        document.body.prepend(errorDiv);
      }
    }

    // Check if user is already logged in
    this.restoreSession();
    return true;
  }

  async login(username, password) {
    // Wait for users to be loaded
    await this.initPromise;
    
    // Find user by NIS (username)
    const user = this.users.find(u => u.nis === username);
    
    if (!user) {
      return { success: false, message: 'Username tidak ditemukan' };
    }

    // Check password
    if (user.password !== password) {
      return { success: false, message: 'Password salah' };
    }

    // Set current user and save to localStorage
    this.currentUser = {
      nis: user.nis,
      nama: user.nama,
      nisn: user.nisn,
      birth_date: user.birth_date,
      gender: user.gender,
      birth_place: user.birth_place,
      url: user.url,
      class: user.class,
      profil: user.profil,
      shtka: user.shtka
    };

    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('loginTime', new Date().getTime());

    return { success: true, message: 'Login berhasil', user: this.currentUser };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
  }

  restoreSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error('Error restoring session:', error);
        this.logout();
      }
    }
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Helper function to format date for password display
  static formatDateForPassword(dateStr) {
    // Input format: yyyy-mm-dd
    // Output format: ddmmyyyy
    const [year, month, day] = dateStr.split('-');
    return `${day}${month}${year}`;
  }
}

// Initialize auth system
const auth = new AuthSystem();

// Helper function to redirect if not logged in
async function requireLogin() {
  await auth.initPromise;
  if (!auth.isLoggedIn()) {
    window.location.href = './login.html';
  }
}

// Helper function to redirect if already logged in (for login page)
async function requireLogout() {
  await auth.initPromise;
  if (auth.isLoggedIn()) {
    window.location.href = './dashboard.html';
  }
}
