export const isAuth = (req, res, next) => {
  // Passport's built-in check; looks for .user object
  if (req.isAuthenticated()) {
    return next(); 
  }
  
  // If not logged in, redirect
  res.redirect('/login'); 
};