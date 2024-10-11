// Define role-based access control (RBAC) using binary values

/*
Permissions:
- READ:   001 (1 in decimal)
- WRITE:  010 (2 in decimal)
- DELETE: 100 (4 in decimal)


Access Matrix:
=====================
| R | W | D | Binary | Decimal |
=====================
| 0 | 0 | 0 |  000   |    0    |  (no access)
| 1 | 1 | 1 |  111   |    7    |  (read, write, delete)
| 1 | 1 | 0 |  011   |    3    |  (read, write)
| 1 | 0 | 0 |  001   |    1    |  (read)
| 0 | 1 | 1 |  110   |    6    |  (write, delete)
| 0 | 1 | 0 |  010   |    2    |  (write)
| 0 | 0 | 1 |  100   |    4    |  (delete)
| 1 | 0 | 1 |  101   |    5    |  (read, delete)

=====================
*/
const User  = require('../models/userModel');

const accessRules = {
    admin: {
    //   order: 7,    // 111 (read, write, delete)
      user: 7,    // 111 (read, write, delete)
      userByEmail: 1,    // 001 (read)
      userByUID: 1,    // 001 (read)
      brand: 3,    // 111 (read, write, delete)
      category: 7, // 111 (read, write, delete)
      subCategory : 7, // 111 (read, write, delete)
    },
    user: {
    //   order: 3,    // 011 (read, write)
      user: 2,    // 010 (write)
      userByEmail: 1,    // 001 (read)
      userByUID: 1,    // 001 (read)
      brand: 1,    // 001 (read)
      category: 1, // 001 (read)
      subCategory : 1 // 001 (read)
    },
  };
  
  // Binary representation of permissions
  const PERMISSIONS = {
    READ: 1,  // 001
    WRITE: 2, // 010
    DELETE: 4 // 100
  };
  
  // Function to check if the user has permission for a specific action on a resource
  const checkAccess = async (user, action, resource) => {
    console.log("Check Access", user, action, resource);
    const userRole = await User.getUserRole(user.uid);
    console.log("User Role", userRole);
    if (!userRole) {
      throw new Error(`User ${user.uid} does not have a role assigned`);
    }
    const rolePermissions = accessRules[userRole][resource];
    console.log("Role Permissions", rolePermissions);
  
    if (rolePermissions === undefined) {
      throw new Error(`Role ${role} does not have access to resource: ${resource}`);
    }
  
    // Check if the role has the required permission by performing a bitwise AND
    return (rolePermissions & action) === action;
  };



  
  module.exports = { checkAccess, PERMISSIONS };
  