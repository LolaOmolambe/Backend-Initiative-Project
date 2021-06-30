const dotenv = require("dotenv");
const Email = require("../utils/emailService");

dotenv.config({ path: "../config.env" });
const queue = "user-messages";

const open = require("amqplib").connect(process.env.AMQP_SERVER);

//Publisher
const publishMessage = (payload) =>
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel
        .assertQueue(queue)
        .then(() =>
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
        )
    )
    .catch((error) => console.warn(error));

//Consumer
const consumeMessage = () => {
  open
    .then((connection) => connection.createChannel())
    .then((channel) =>
      channel.assertQueue(queue).then(() => {
        console.log("Waiting for message");
        return channel.consume(queue, (msg) => {
          if (msg !== null) {
            const { mail, subject, template } = JSON.parse(
              msg.content.toString()
            );
            console.log("Received ", mail);

            //Send Mail using Nodemailer
            new Email().send(subject, template, mail).then(() => {
              channel.ack(msg);
            });
          }
        });
      })
    )
    .catch((error) => console.warn(error));
};

module.exports = {
  publishMessage,
  consumeMessage,
};
