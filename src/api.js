// src/api.js

// Function to sign up a new user
export const signupUser = async (userData) => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to sign up");
    }
  
    const newUser = await response.json();
    return newUser;
  };
  

  export const loginUser = async (email, password) => {
    const response = await fetch("http://localhost:5000/users");
    
    if (!response.ok) {
      throw new Error("Failed to log in");
    }
  
    const users = await response.json();
    const user = users.find((user) => user.email === email && user.password === password);
  
    if (!user) {
      throw new Error("Invalid credentials");
    }
  
    return user; 
  };
  