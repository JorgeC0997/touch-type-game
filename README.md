# Type Game

#### Video Demo: <https://www.youtube.com/>

## Description

Type Game is a web application designed for those who want to improve their typing skills.  
Packed with 28 exercises distributed into three levels of difficulty, Type Game keeps track of  
your acomplishements saving the highest amount of words per minute (WPM) typed during the game.

When completing all exercises of each level, **you level up!** and Type Game will upgrade your account  
grating you access to a new set of exercises more dificult to type. Happy typing!

## Project Installation

This project uses the power of Postgresql.\
Start by opening a terminal or command prompt and access the PostgreSQL server using the following command:

`psql -U your_admin_username`

Replace *your_admin_username* with your actual PostgreSQL admin username. After hitting enter, psql\
will prompt you for your password. If you typed in your credentials correctly, you should now see:

`postgres=#`

Next, enter the following query to create *touch_type* database.

`CREATE DATABASE touch_type;`

> **_NOTE:_**   The database must be named exactly ***touch_type*** because the app will connect to that database name specifically.

Now, open your local repo with VSCode, go to the **backend** folder and create a *.env* file.\
In the same directory you'll find a *.env.example* file, copy all of its content and paste it inside *.env*

> **_NOTE:_**   You must change the values of **USER** and **PASSWORD** with your own postgres user and password.

Open up a terminal window within VSCode by going to **View > Terminal** from the menu bar or using the shortcut ``Ctrl+` ``

Change directory from **...\touch-type-game>** to **...\touch-type-game\backend>** by running the following command:

`cd backend`

Run the following command to restore the newly created database with all tables required for the app to run:

> **_NOTE:_**   The command line will prompt you for postgres password, use the same password you used to connect to the postgers\
>server previously.

`pg_restore -U postgres -Ft -d touch_type < ./db_backup/touch_type.tar`

Next, install all dependencies for Nodejs backend server:

`npm install`

Start backend server:

`npm run server`

After running the last command, the terminal will display the following:

![Server running](/screenshots/server_running.png)

In separate terminal, from the root directory, go to **...\touch-type-game\frontend>** using the following commands:

`cd frontend`

Install all dependencies for React app:

`npm install`

Start react app:

`npm run dev`

After running the last command, the terminal will display the following:

![React app running](/screenshots/react_app_running.png)

Now you can go to **__http://localhost:5173/__** to use the app.
