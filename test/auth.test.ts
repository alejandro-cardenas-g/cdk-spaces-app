import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

const TestAuth = async () => {
  const service = new AuthService();
  const loginResult = await service.login("acardenas", "XXXX");
  const idToken = await service.getIdToken();
  console.log(idToken);
  const credentials = await service.generateTemporaryCredentials();
  await listBucket(credentials);
};

async function listBucket(credentials: any) {
  const client = new S3Client({
    credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  console.log(result);
}

TestAuth();
