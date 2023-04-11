const redis = require("redis");

const client = redis.createClient({
  url:"redis://default:jKnThiUqDr7ko7ESOUban2Rawrt7DSu2@redis-19172.c8.us-east-1-2.ec2.cloud.redislabs.com:19172"
});
try {
  client.connect();
  console.log('Redis Connected Successfully');
} catch (error) {
  // client.on("error", (err) => console.log(err, "ERROR in REDIS"));
  console.log('Error in Redis',error);
}
module.exports = {client}