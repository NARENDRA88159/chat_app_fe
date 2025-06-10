// decodeJwt.js

export const decodeJwtToken = (token) => {
    try {
      if (!token) throw new Error("Token is required");

      const parts = token.split('.');
      if (parts.length !== 3) throw new Error("Invalid JWT token format");

      const payload = parts[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.error("Failed to decode JWT:", error.message);
      return null;
    }
  };
