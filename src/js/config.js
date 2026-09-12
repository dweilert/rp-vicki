/* RP Discoverer — runtime configuration.

   Loaded before site.js. Kept separate so switching the signup list on is a
   one-line change to a file with nothing else in it.

   When the collection backend exists (API Gateway -> Lambda -> DynamoDB,
   see infra/README.md), uncomment the line below and point it at the
   invoke URL. Until then the form falls back to a prefilled mailto and
   tells the visitor plainly that nothing was stored. */

// window.RP_SIGNUP_ENDPOINT = "https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/prod/signup";
