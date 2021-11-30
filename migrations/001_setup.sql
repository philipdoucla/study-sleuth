create table users
(
    id                   varchar(11)       not null
        constraint users_pk
            primary key,
    fname                varchar(30)       not null,
    lname                varchar(40)       not null,
    email                varchar(50)       not null,
    password             varchar(255)      not null,
    major                integer,
    residence            integer,
    group_state          integer default 0 not null,
    preferred_group_size integer,
    academic_class       varchar(255)
);

create unique index users_email_uindex
    on users (email);

create unique index users_id_uindex
    on users (id);

create table groups
(
    id serial
        constraint groups_pk
            primary key
);

alter table users
	add "group" int;

alter table users
	add constraint users_groups_id_fk
		foreign key ("group") references groups
			on update cascade on delete set null;
