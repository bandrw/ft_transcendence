CREATE USER root WITH SUPERUSER;
CREATE DATABASE root;
create user pfile with encrypted password 'pfile';
create database pfile;
grant all privileges on database pfile to pfile;