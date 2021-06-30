const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const client = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  retry_strategy: () => 1000,
});

client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = { time: 60 }) {
  this.useCache = true;
  this.time = options.time;
  this.hashKey = JSON.stringify(options.key || this.mongooseCollection.name);

  return this;
};

mongoose.Query.prototype.exec = async function () {
  //To query the MongoDB directly, instead of using the cache
  if (!this.useCache) {
    return await exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    ...this.getQuery(),
  });

  //Querying the Cache if value for key exists
  const cacheValue = await client.hget(this.hashKey, key);

  //If data is found in cache
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    
    console.log("Response from Redis");

    //This converts the json into mongoose model
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  //If data is not found in cache, MongoDB is queried
  const result = await exec.apply(this, arguments);
  
  //Saving data from MongoDB to Cache
  client.hset(this.hashKey, key, JSON.stringify(result));
  client.expire(this.hashKey, this.time);

  console.log("Response from MongoDB");
  return result;
};

module.exports = {
    //To delete the cache
  clearKey(hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};
