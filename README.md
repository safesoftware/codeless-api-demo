# codeless-api-demo
Create a codeless API using AWS API Gateway and FME Cloud

##Deploying the Demo

- **Create Database** - This demo stores the data in a PostGIS database. There is a workspace in the fme_cloud folder called CreateTransitWorkspace.fmw which will create the table, you just need to conect the writer to a database. I used a PostGIS dataabse on RDS for this demo.

- **Create the AWS Lambda function** - Login to the AWS Console and locate the AWS Lambda service. Click on "Create a Lambda Function" and then paste in the code from the lambda.js file in the api_gateway folder. I called it transitAPIResourceHandler but you can call it whatever you want. You will need to update the host and the path which are on lines 4 and 5 of the file. Nothing else should need updating. 

- **Create API** - Locate the Amazon API Gateway service, select to "Create a New API" and the choose to "Import from Swagger". Select the TransitAPI-staging-swagger.json swagger file in the api_gateway folder.

- **Launch an FME Cloud Instance** - [Create an account](https://console.fmecloud.safe.com/signup) on FME Cloud (you get $250 of free credit so you can trial fro free without a credit card). Once you are on the dashboard follow the documentation [here](http://docs.safe.com/fme_cloud/FME_Cloud/Content/Getting_Started/Launch_an_Instance.htm) to launch an instance.

- **Publish the workspaces to the FME Cloud Instance** - Using [FME Workbench](https://www.safe.com/support/support-resources/fme-downloads/) open each of the workspaces in the fme_cloud folder and publish them up to the FME Cloud instance. You will also need to create a database connection object that maps to your database. On publish register the workspaces with the data streaming service.

- **Set the AWS permissions** - You need to grant the correct IAM permissions to the AWS Lambda function so that the API gateway can connect to it. The easiest way to do this is for each method (GET, POST, PUT etc), click on Integration Request and then reslect the Lambda function, this should popup a message that says: "You are about to give API Gateway permission to invoke your Lambda function:
arn:aws:lambda:us-east-1:xxxxxxxxxxxxx:function:transitAPIResourceHandler"
