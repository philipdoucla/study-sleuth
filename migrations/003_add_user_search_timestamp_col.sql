-- record the date the user entered the matchmaking pool

alter table users
    add started_search_at timestamp;

