## Current Process

### for review only, not for production remove later

April 14th, 2023
Make sure to hash the passwords before saving on the JSON file. Because it will NOT dehash properly.
Make sure to remove passport.authenticated("local"), you only need it once when you log in.
Use isAuthenticate that has a req.isAuthenticated() to check if it has been authenticated, it come from passport package.
Progress: Users work now. Edit some permissions and ready for frontend.
