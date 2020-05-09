# Crevalto NodeServer

## Getting started

### Prerequisites

- Should have `node` and `npm` installed on your system [Download Node & NPM](https://nodejs.org/en/download/)

### Clone the repository

Clone the `master` repository to your local machine by executing the following command in your command prompt:

```
git clone https://github.com/Crevalto/Brand-NodeServer.git
```

### Install packages

Navigate into the cloned repository and initiate npm install of the required packages as prescribed in the `package.json` file by executing the following command in your command prompt:

```
npm install
```

### Starting server

Start the node server using the command:

```
npm start
```

## API Documentation

### Authentication

#### Register User

Create user instance in database and generate OTP and send email to the registered address.

> https://crevaltobkend.herokuapp.com/brand/users/register

```json
method: POST
bodyType: JSON
JSON-Structure:
{

    "brandName": "name of brand (unique)",
    "accountPassword": "password (> 7 characters)",
    "brandAddress": "brand location string",
    "identificationDetail": {
        "regNo": "registration number (unique)",
        "cinNo": "corporate identity number (unique)"
    },
    "emailAddress": "brand email address (unique)",
    "phoneNo": 000000,
    "brandAssets": {
        "brandLogoSrc": "brand logo src",
        "brandColor": "brand color code",
        "brandSoundTrack": "brand soundtrack src"
    }

}
```

#### User OTP Verification

Send registered user database id and also the OTP code entered by the user

> https://crevaltobkend.herokuapp.com/brand/users/verifysecure

```json
{
  "userId": "database id of the user",
  "otpCode": 5544
}
```

#### Login

Login user to get the user token and user account verified status

> https://crevaltobkend.herokuapp.com/brand/users/login

```json
method: POST
bodyType: JSON
JSON-Structure:
{
    "emailAddress":"brand email address",
	"accountPassword":"password"
}
```

### Products

#### Get Categories

Gets all the categories of products available

> https://crevaltobkend.herokuapp.com/brand/getcategories

```json
method: GET
```

#### Get Products

Return all products for provided category Id

> https://crevaltobkend.herokuapp.com/brand/getproducts

```json
method: POST
bodyType: JSON
JSON-Structure:
{
	"categoryId":"Id of category"
}
```
