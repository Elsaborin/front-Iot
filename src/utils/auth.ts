interface User {
  email: string;
  password: string;
  name: string;
}

// Usuario predefinido para pruebas
const predefinedUser: User = {
  email: 'admin@gmail.com',
  password: 'holaa123',
  name: 'Administrador'
};

export const authenticateUser = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === predefinedUser.email && password === predefinedUser.password) {
        // Store authentication status
        localStorage.setItem('isAuthenticated', 'true');
        resolve(predefinedUser);
      } else {
        resolve(null);
      }
    }, 1000); // Simulamos un delay de red
  });
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};