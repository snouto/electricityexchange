## How to set the environment

- Install MYSQL Server 5.1 or later.
- create a new empty database named "dsu" or any database you like (change its name in the App class accordingly in the database connection config section).
- Dump the DDL Database File named "db.sql" into the newly created database in the above step.
- Configure the database name , user and password and host variables in the constructor of the App class.

# How to run

- First convert app.js into an executable program , `chmod +x app.js`

- Then, try to run the program from linux shell , `./app.js`