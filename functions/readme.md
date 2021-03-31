

**Trigger the functions**

Get number of total enemies slayed:
    
`curl --request GET 'https://us-central1-counting-1a02e.cloudfunctions.net/api/getAllKIlls`

In order to access endpoints below you need to provide token, you need to be a user of the application.
You can get your token by using Identity Platform REST API.

Sign up with email and password:

`https://cloud.google.com/identity-platform/docs/use-rest-api#section-create-email-password`

Sign in:

`https://cloud.google.com/identity-platform/docs/use-rest-api#section-sign-in-email-password`

Get number of enemies slayed by you, provide a token:

`curl --request GET 'https://us-central1-counting-1a02e.cloudfunctions.net/api/getMyKIlls' \
--header 'Authorization: Bearer <Your Token here>'`


Add number of batches of enemies killed, provide a token in the headed 
and add number of kills as a query parameter:

`curl --request POST 'https://us-central1-counting-1a02e.cloudfunctions.net/api/addKills?number=30' \
--header 'Authorization: Bearer <Your Token here>'`
