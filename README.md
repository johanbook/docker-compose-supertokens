# supertokens-poc

This is a PoC using authentication with [SuperTokens](https://supertokens.com/).

## Startup

First time starting the database we need to create a table for SuperTokens. Run
`docker exec -it <db_container> psql -U admin` and run

```sql
CREATE DATABASE supertokens;
```
