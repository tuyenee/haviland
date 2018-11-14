# Haviland
## Known vulnerabilities
1. Session fixation
2. CSRF everywhere
3. Reflected XSS in Users & Room listing
4. Stored XSS in user data
5. DOM-based XSS in room-sharing function
6. Vulnerable database query in room search

## Security patch
**Turn on the following switches in your .env**
> SESSION_FIXATION_FIXED=true  
> REFLECTED_XSS_FIXED=true  
> STORED_XSS_FIXED=true  
> DOM_BASED_XSS_FIXED=true  
> CSRF_FIXED=true  
> MONGO_QUERY_FIXED=true  