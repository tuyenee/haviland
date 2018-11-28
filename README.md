# Haviland
## Install
1. Create the .env file  
You can Rename the existing .env-sample to .env and modify the default settings if needed.
2. Run `docker-compose up`
 - App will be serving at port 8087
 - MongoDb will be opening port 27017
## Known vulnerabilities
1. Session fixation
2. CSRF everywhere
3. Reflected XSS in Users & Room listing
4. DOM-based XSS in room-sharing function
5. Vulnerable database query in room search
6. Username enumeration in login function
7. Login function is vulnerable to Brute Force attack
## Security patch
**Turn on the following switches in your .env**
> SESSION_FIXATION_FIXED=1  
> REFLECTED_XSS_FIXED=1  
> DOM_BASED_XSS_FIXED=1  
> CSRF_FIXED=1  
> MONGO_QUERY_FIXED=1  
> USERNAME_ENUMERATION_FIXED=1  
> LOGIN_BRUTE_FORCE_FIXED=1  
