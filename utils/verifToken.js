import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      jwt.verify(bearerToken, "secret", (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Invalid token" });
        } else {
          req.userId = decoded.id;
          next();
        }
      });
    } else {
      res.status(401).json({ message: "Missing token" });
    }
  };


export const adminVerifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, "secret");
       // console.log(decodedToken.roleID)
        // Check if the user is an admin (role 2)
        if (decodedToken.role != 2) {
            return res.status(403).json({ error: "Access denied. Only admins can perform this action." });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};


export const companyVerifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, "secret");
        console.log(decodedToken.roleID)
        // Check if the user is an admin (role 2)
        if (decodedToken.role != 1) {
            return res.status(403).json({ error: "Access denied. Only partners can perform this action." });
        }

        req.user = decodedToken; // Set the user object in the request
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
