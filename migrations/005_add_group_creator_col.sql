alter table groups
    add creator varchar(11) not null;

alter table groups
    add constraint groups_users_id_fk
        foreign key (creator) references users;

