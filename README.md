# bothub-test-task
Bothub test task

Technical task link: https://docs.google.com/document/d/1oPH8JBo4P8z8gC5R4Zzv8m8Aacm9AB8FZ5eGjA_IziY/edit

## Launch the project 
Firstly you have to create .env file in the root directory and input there variables like in example:<br>
````
HOST=localhost
PORT=8001

DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bothub

SALT=salt

MAIN_ADMIN_EMAIL=email to create user with role 'admin' automatically
MAIN_ADMIN_PASSWORD=password for this user

JWT_KEY='secretJwtKey!'

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465

EMAIL_TRANSPORT_ADDRESS=address for send emails to users
EMAIL_TRANSPORT_PASSWORD=password for external applications

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

EMAIL_CODE_TIME=3600
````
For run the server, please, execute the next commands<br>
npm: ``npm install`` after this run ``npm build & npm start`` <br>
yarn: ``yarn install`` after this run ``yarn build & yarn start``<br>

You also can execute ``docker-compose up`` command to run this project in the docker

# Routes

`/users/verify-email` route for send email with verification code, which should be used as value of "code" field in ``/users/register`` route. 
