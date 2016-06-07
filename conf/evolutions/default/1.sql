# DC schema
 
# --- !Ups

CREATE TABLE USER(
    ID integer NOT NULL AUTO_INCREMENT PRIMARY KEY,
    EMAIL varchar(255) NOT NULL,
    PASSWORD_HASH text NOT NULL,
    SALT1 varchar(255) NOT NULL,
    SALT2 integer NOT NULL
);

CREATE TABLE LITTLE_SQUARE(
    IDX integer NOT NULL PRIMARY KEY,
    IMG longtext NOT NULL,
    USER_ID integer NOT NULL
);



# --- !Downs
DROP TABLE USER;
DROP TABLE LITTLE_SQUARE;

