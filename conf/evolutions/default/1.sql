# DC schema
 
# --- !Ups

CREATE TABLE "MY_USER"(
    "ID" SERIAL PRIMARY KEY,
    "EMAIL" varchar(255) NOT NULL,
    "PASSWORD_HASH" text NOT NULL,
    "SALT1" varchar(255) NOT NULL,
    "SALT2" integer NOT NULL
);

CREATE TABLE "LITTLE_SQUARE"(
    "IDX" integer NOT NULL PRIMARY KEY,
    "IMG" text NOT NULL,
    "USER_ID" integer NOT NULL
);


# --- !Downs
DROP TABLE "MY_USER";
DROP TABLE "LITTLE_SQUARE";






