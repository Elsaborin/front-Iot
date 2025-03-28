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

export const saveUserSession = (token: string, user: any) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUserSession = () => {
  const user = localStorage.getItem("user");

  // Si el valor no es null y es una cadena JSON, analízalo
  if (user) {
    try {
      return JSON.parse(user); // Parseamos solo si es una cadena JSON válida
    } catch (error) {
      console.error("Error al analizar el JSON del usuario:", error);
      return null;
    }
  }

  return null; // Si no existe el usuario en localStorage, retornamos null
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// utils/auth.ts

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token");
  return token !== null; // Verifica si el token está en el localStorage
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


