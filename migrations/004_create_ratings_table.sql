create table ratings
(
    id     serial
        constraint ratings_pk
            primary key,
    rater  varchar(11) not null
        constraint ratings_users_id_fk_2
            references users
            on update cascade on delete cascade,
    target varchar(11) not null
        constraint ratings_users_id_fk
            references users
            on update cascade on delete cascade,
    value  int         not null
);

create unique index ratings_id_uindex
    on ratings (id);

