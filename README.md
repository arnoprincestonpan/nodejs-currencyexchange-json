## Current Process
### for review only, not for production remove later
April 8th, 2023
Thinking of adding new routes to currencyRouter or making even more Routers for specific roles.
A new middleware will be added to the routes in the currencyRouter and what it does is it makes sure that 
staff and manager roles have the same access to currencyRouter but staff cannot delete any. Also the staff 
can also edit like the manager but if the existing buyPrice and SellPrice exceeds a difference of over twice the 
difference of the buyPrice and sellPrice it cannot update. Whereas the manager does whatever they want. 