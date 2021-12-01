-- store the target size of a group, for cases where we may have partially complete groups.

alter table groups
    add target_size integer default 5 not null;
