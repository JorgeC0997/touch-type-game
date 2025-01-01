# Touch Type

#### Video Demo: <https://www.youtube.com/>

## Description

Touch Type is a web application designed for those who want to improve their typing skills.  
Packed with 28 exercises distributed into three levels of difficulty, Touch Type keeps track of  
your acomplishements saving the highest amount of words per minute (WPM) typed during the game.

When completing all exercises of each level, **you level up!** and Touch Type will upgrade your account  
grating you access to a new set of exercises more dificult to type. Happy typing!

### Backend

The backend uses Express to create a RESTful API with a MVC architecture that allows developers\
a faster way to create and maintain API endpoints. The following image illustrates the file structure\
inside the backend folder.

![Backend file structure](/screenshots/backend_src_structure.png)

All global vairables are defined in the .config file, in here you can find the environment variables that holds\
sencitive information to connect to the database.

The dbConnection.js file exports a new instance of the Pool Object from the 'pg' library, inside that pool\
instance we configure all properties to connect to our dabatase.

```
export const pool = new Pool({
  user: USER,
  host: HOST,
  database: DB,
  password: PASSWORD,
  port: DB_PORT,
});
```

In index.js we configure Cross-Origin Resource Sharing (CORS) since the backend server and the frontend app\
are running in different ports. Then we define our main api endpoints:

```
app.use("/api/users", usersRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/exercises", requireAuth, exercisesRoutes);
app.use("/api/scores", requireAuth, scoresRoutes);
```

We use the requireAuth middleware to ensure that the incoming request have the right credentials to get access.\
The routing files contains controller methods that sends query commands to the database server and those\
controller methods sends back the response with data to the client or error messages if something goes wrong\
with re request parameters or the server.

Example from **accounts.routes.js**:

```
import {
  getAccount,
  levelUp,
  setSuperuser,
} from "../controllers/accounts.controllers.js";

const router = Router();

router.get("/:user_id", requireAuth, getAccount);
router.patch("/levelup", requireAuth, levelUp);
router.patch("/superuser", requireAuth, setSuperuser);
```

### Frontend

For the fontend I decided to go for a vite/react app. The following is a list of libraries used:

* React
* React Router
* Axios
* Tailwind

The app uses 4 pages:

**_Welcome_** "**/welcome**"

The Welcome page shows a bigger version of the app's logo "**_Touch Type \__**" than the one used\
in the navigation bar, as well as the login form to get access to the rest of the app's content.

![Welcome page](/screenshots/welcome_page.jpg)

**_Register_** "**/register**"

The register page shows a form for users to register and create an account. This form contains two\
passwords fields to ensure the user typed in their password correctly.

![Register page](/screenshots/register_page.jpg)

**_Home_** "**/**" (*protected route*)

The home page displays a list of levels and exercises. The availabe exercises will be displayed\
as a "**_Link_**" tag to redirect users to the "**Practice Room**" page with the specific exercise.\
Those exercises that aren't available, will be displayed as a simple "**-Span-**" tag, so users cannot\
interact with them; They will also be grayed out to emphesise that it is unavailable. 

![Home page](/screenshots/home_page.jpg)

**_Practice Room_** "**/room/:roomId**" (*protected route*)

This is one of the most important pages since this is where users will test their skills typing as fast\
as they can completing milestones and breaking personal records.

![Practice Room page](/screenshots/practice_room_page.jpg)


This application uses **React Context** that allows us to share state and data across multiple\
components without having to pass props down through every level of the component tree avoiding\
"prop drilling".

I divided the app's state in multiple react context providers to separate the logic such as\
functions that retrieves and save the data feched by axios as well as functions to create, update\
or delete data in our backend api.

* AccountContext
* AuthContext
* ExerciseContext
* ModalContext
* ScoreContext
* UserContext

* #### AuthContext

&nbsp; &nbsp; &nbsp; &nbsp; The AuthContext file is key to ensure that the app can log in, log out and verify user's credentials.\
&nbsp; &nbsp; &nbsp; &nbsp; AuthContext have only one boolean state "**isUserAuth**" that will change upon loging in or loging out\
&nbsp; &nbsp; &nbsp; &nbsp; the user. It also uses userContext to change the "**userData**" state to save the response that we get\
&nbsp; &nbsp; &nbsp; &nbsp; back from the login api endpoint (id, username):

```
const loginUser = async (username, password) => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username,
          password,
        }
      );
      if (data) {
        userContext.setUserDataState(data);
        setIsUserAuth(true);
        navigate("/");
        return true;
      } else {
        userContext.setUserDataState(null);
        setIsUserAuth(false);
        navigate("/welcome");
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
```


&nbsp; &nbsp; &nbsp; &nbsp; For the logout function, because we are using JWT (JSON Web Token) to authorize users to\
&nbsp; &nbsp; &nbsp; &nbsp; certain pages in our app, when loging out, the api endpint will issue a new JWT on a http only\
&nbsp; &nbsp; &nbsp; &nbsp; cookie with a very short expritation date; after the token expires, the app will verify if\
&nbsp; &nbsp; &nbsp; &nbsp; there is a valid token and allow access to those pages where no authorization is required in\
&nbsp; &nbsp; &nbsp; &nbsp; the case of not being loged in like **Welcome** and **Register** pages.

```
const logoutUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/auth/logout",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsUserAuth(false);
        userContext.setUserDataState({});
        verifyUserAuth(new AbortController());
      }
    } catch (error) {
      console.log(error);
    }
  };
```

* #### UserContext

&nbsp; &nbsp; &nbsp; &nbsp; The user context holds the user data like id and username that other components\
&nbsp; &nbsp; &nbsp; &nbsp; and contexts need in order to work as intended.

&nbsp; &nbsp; &nbsp; &nbsp; "**setUserDataState()**" saves the user data in context state ensuring that the\
&nbsp; &nbsp; &nbsp; &nbsp; data passed in contains an object with id and username. If Nither one of those keys\
&nbsp; &nbsp; &nbsp; &nbsp; exist in the object, the userData state will not be changed.

```
const setUserDataState = (data) => {
  if (data === null) return setUserData(null);

  const keys = Object.keys(data);
  if (!keys.includes('id') || !keys.includes('username')) return;
  if (data.id === '' || data.username === '') return;

  setUserData(data);
};
```

&nbsp; &nbsp; &nbsp; &nbsp; "**createUser()**" makes a post request to the users api endpoint passing in\
&nbsp; &nbsp; &nbsp; &nbsp; an object with username and password to store in the users table.

```
const createUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/users', {
      username,
      password,
    });
    if (!response) return false;
    return true;
  } catch (error) {
    return false;
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; "**updateUserData()**" updates both username and/or password. This function\
&nbsp; &nbsp; &nbsp; &nbsp; is called in the Account Info modal, which allow the user to change its username\
&nbsp; &nbsp; &nbsp; &nbsp; or, in case that the user forgets the password, replace it with a new one.

```
const updateUserData = async ({ username = null, password = null } = {}) => {
  if (!username && !password) return false;

  if (username && username === userData.username) return false;
  try {
    const { data } = await axios.patch(
      `http://localhost:3001/api/users/${userData?.id}`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );

    if (data) {
      setUserData(data);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
```

* #### AccountContext

&nbsp; &nbsp; &nbsp; &nbsp; The account context manages the state for data related to the current user's\
&nbsp; &nbsp; &nbsp; &nbsp; account like "**getAccountData()**":

`const getAccountData = async (userId, controller) => {`

&nbsp; &nbsp; &nbsp; &nbsp; Which purpose is to fetch the account *id*, *user_id*, *level* the account is at,\
&nbsp; &nbsp; &nbsp; &nbsp; and a boolean column *is_super_user*:

![Accounts table](/screenshots/account_table.png)

&nbsp; &nbsp; &nbsp; &nbsp; **updateLevel()** makes an api post request passing in the *new_level* and *account_id*.\
&nbsp; &nbsp; &nbsp; &nbsp; This api call will update the account's level field and will return true or false in\
&nbsp; &nbsp; &nbsp; &nbsp; case of being successful or not respectively.

```
const getAccountData = async (userId, controller) => {
  try {
    const { data } = await axios.get(
      `http://localhost:3001/api/accounts/${userId}`,
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );
    if (data) {
      setAccountData(data);
    }
  } catch (error) {
    console.log(error);
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; **levelUp()** is called at the end of each completed exercise and checks if user has scores\
&nbsp; &nbsp; &nbsp; &nbsp; stored in scores table for all exercises of the same account level.
> **_E.g._** Loop through all scores of a particular account and count how many scores of the same account level are\
> in the database, if the amount equals the total amount of exercises for that level **updateLevel()**\
> will be called to level up the account.

```
const levelUp = async (scoresByAccount) => {
  const levelExerciseCount = [10, 10, 8];
  let completedScoreByLevel = 0;

  if (scoresByAccount) {
    scoresByAccount.forEach((score) => {
      if (score.level === accountData.level) {
        completedScoreByLevel += 1;
      }
    });
  }

  if (accountData.level === 3) {
    if (
      completedScoreByLevel ===
      levelExerciseCount[accountData.level - 1] - 1
    ) {
      const superuserStatus = await setSuperuser(accountData.id);
      if (superuserStatus) {
        getAccountData(userContext.userData.id, new AbortController());
        return console.log("You're Super User now!");
      } else {
        return console.log("Couldn't update account superuser");
      }
    }
  }

  if (
    completedScoreByLevel ===
    levelExerciseCount[accountData.level - 1] - 1
  ) {
    const newLevel = accountData.level + 1;
    const levelUpStatus = await updateLevel(newLevel, accountData.id);
    if (levelUpStatus) {
      getAccountData(userContext.userData.id, new AbortController());
      console.log("You leveled up!");
    } else {
      console.log("Couldn't update account level");
    }
  }
  console.log(scoresByAccount);
};
```

&nbsp; &nbsp; &nbsp; &nbsp; **setSuperuser()** is called when a user completes all exercises of all levels, showing\
&nbsp; &nbsp; &nbsp; &nbsp; "*superuser*" in the top right corner of the navigation bar as well as in the account\
&nbsp; &nbsp; &nbsp; &nbsp; information modal:

```
const setSuperuser = async (account_id) => {
  try {
    const response = await axios.patch(
      `http://localhost:3001/api/accounts/superuser`,
      {
        value: true,
        account_id,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 401) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};
```

![Superuser Button](/screenshots/super_user_button.png) ![Superuser Badge](/screenshots/super_user_badge.png)

* #### ExerciseContext

&nbsp; &nbsp; &nbsp; &nbsp; Exercise context has functions to retrieve a single exercise by its id.

```
const getExercise = async (exerciseId, controller) => {
  if (!exerciseId) {
    navigate('/');
    return;
  }
  try {
    const { data } = await axios.get(
      `http://localhost:3001/api/exercises/${exerciseId}`,
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );
    if (data) {
      setRoomData(data);
    }
  } catch (error) {
    console.log(error);
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; Get a list of exercises that contains (id, level, exercise_number) by account level.

```
const getExerciseIds = async (level, controller) => {
  if (!level) {
    navigate('/');
    return;
  }
  try {
    const { data } = await axios.get(
      `http://localhost:3001/api/exercises/getIds/${level}`,
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );
    return data ? data : [];
  } catch (error) {
    console.log(error);
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; And a function that generates the list of exercises that are available to the user.\
&nbsp; &nbsp; &nbsp; &nbsp; The final structure generated is like this:

![Exercise ids structure](/screenshots/exercise_ids.png)

&nbsp; &nbsp; &nbsp; &nbsp; The function uses two main for loops, one for iterating three times (the three dificulty levels)\
&nbsp; &nbsp; &nbsp; &nbsp; generating a level object with *level*, *isUnlocked* and *exerciseList*. The other for loop\
&nbsp; &nbsp; &nbsp; &nbsp; iterates as many times as exercises are in that level (level 1 -> 10 exercises, level 2 -> 10 exercises,\
&nbsp; &nbsp; &nbsp; &nbsp; level 3 -> 8 exercises) generating an exercise object with *id*, *level*, *exerciseNumber* and\
&nbsp; &nbsp; &nbsp; &nbsp; *wpm_score*. 

```
const generateExerciseList = async (level, controller) => {
  setIsLoading(true);
  let exerciseCount = 10;
  let exercises = [];
  for (let i = 0; i < 3; i++) {
    let newLevel = {
      level: i + 1,
      isUnlocked: i < level ? true : false,
      exerciseList: [],
    };
    if (i === 2) exerciseCount = 8;
    for (let j = 0; j < exerciseCount; j++) {
      let newExercise = {
        id: `${i}${j}`,
        level: i + 1,
        exerciseNumber: j + 1,
        wpm_score: null,
      };
      newLevel.exerciseList.push(newExercise);
    }
    exercises.push(newLevel);
  }
  try {
    const unlockedExercises = await getExerciseIds(level, controller);
    if (unlockedExercises.length > 0) {
      for (let unlockedExercise of unlockedExercises) {
        exercises[unlockedExercise.level - 1].exerciseList[
          unlockedExercise.exercise_number - 1
        ].id = unlockedExercise.id;
      }
    }

    if (scoreContext.scoresByAccount) {
      scoreContext.scoresByAccount.forEach((score) => {
        exercises[score.level - 1].exerciseList[
          score.exercise_number - 1
        ].wpm_score = score.wpm_record;
      });
    }
    setExerciseIds(exercises);
  } catch (error) {
    console.log(error.message);
  } finally {
    setIsLoading(false);
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; This structure is used in the Home page to render each exercise link.

![Exercise links](/screenshots/exercise_links.png)

* #### ScoreContext

&nbsp; &nbsp; &nbsp; &nbsp; "**getScoresByAccount()**" populates the *scoresByAccount* state with an array\
&nbsp; &nbsp; &nbsp; &nbsp; of scores that contains *score_id*, *exercise_id*, *exercise_level*, *exercise_number*\
&nbsp; &nbsp; &nbsp; &nbsp; and *wpm_record*.

```
const getScoresByAccount = async (controller) => {
  if (!accountContext.accountData) return;
  try {
    const { data } = await axios.get(
      `http://localhost:3001/api/scores/byAccount/${accountContext.accountData.id}`,
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );

    if (data) {
      setScoresByAccount(data);
    }
  } catch (error) {
    console.log(error);
  }
};
```
&nbsp; &nbsp; &nbsp; &nbsp; "**checkNewScore()**" will update the score of a given *exerciseId*. The server\
&nbsp; &nbsp; &nbsp; &nbsp; will compare the actual score saved in the database with the passed in new score\
&nbsp; &nbsp; &nbsp; &nbsp; and if the new score is higher, the score will be updated.

```
const checkNewScore = async (accountId, exerciseId, score, controller) => {
  try {
    const response = await axios.patch(
      `http://localhost:3001/api/scores/update_score`,
      {
        account_id: accountId,
        exercise_id: exerciseId,
        new_record: score,
      },
      {
        withCredentials: true,
        signal: controller.signal,
      }
    );

    if (response.status === 406) {
      console.log(response.data.message);
      return false;
    }

    getScoresByAccount(new AbortController());
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
```

&nbsp; &nbsp; &nbsp; &nbsp; "**getHighestScore()**" will update highestScore state after looping through each\
&nbsp; &nbsp; &nbsp; &nbsp; score in the account and find the highest score.

```
const getHighestScore = async () => {
  if (!scoresByAccount) return;

  let highest = 0;
  scoresByAccount.forEach((score) => {
    if (score.wpm_record > highest) {
      highest = score.wpm_record;
    }
  });

  setHighestScore(highest);
};
```

&nbsp; &nbsp; &nbsp; &nbsp; This states is used in Account info component:

![Highest score](/screenshots/highest_score.png)

* #### ModalContext

&nbsp; &nbsp; &nbsp; &nbsp; The modal context manages the state used in the modal component that is being\
&nbsp; &nbsp; &nbsp; &nbsp; conditionaly rendered in the app.js file. It holds the following states: *isActive*,\
&nbsp; &nbsp; &nbsp; &nbsp; *content* and *redirectUrl*.

&nbsp; &nbsp; &nbsp; &nbsp; "**activateModal()**" will set the active state to *true* and if a *redirectOnClose*\
&nbsp; &nbsp; &nbsp; &nbsp; url is passed, it will be saved in *redirectUrl* state. the *content* parameter\
&nbsp; &nbsp; &nbsp; &nbsp; contains the jsx that the modal will display as its children.

```
const activateModal = (content, redirectOnClose = null) => {
  if (redirectOnClose) {
    setRedirectUrl(redirectOnClose);
  }
  setIsActive(true);
  setContent(content);
};
```

&nbsp; &nbsp; &nbsp; &nbsp; "**hideModal()**" will simply hide the modal when the button "**_Close_**" is pressed.

```
const hideModal = () => {
  setIsActive(false);
};
```


## Project Installation

This project uses the power of Postgresql.\
Before we start, it is required to [install PostgreSql](https://www.postgresql.org/) (if you don't have it\
in your system already), and add the postgres bin directory to the system path as follows:

1. c> program files> PostgreSQL> bin> psql

2. copy the path

3. control panel> advanced system settings> Environment Variables> select Path from the system variables> Edit > New> Paste> Ok> OK> OK

We do this to have access to postgres tools in the command line.

Next steps involves creating the database of our project.\
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

Open up a terminal window within VSCode by going to **View > Terminal** from the menu bar or using\
the shortcut ``Ctrl+` ``\
Add a new Command Prompt Terminal as shown in the picture down below:

![Open new terminal 1](/screenshots/open_terminal_1.png) ![Open new terminal 2](/screenshots/open_terminal_2.png)

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
