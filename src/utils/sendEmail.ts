import SparkPost = require("sparkpost");
const client = new SparkPost(process.env.SPARKPOST_API_KEY);

export const sendEmail = async (receipients: string, url: string) => {
  const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: "testing@sparkpostbox.com",
      subject: "Confirm Email",
      html: `<html>
        <body>
            <p>Testing SparkPost - the world's most awesomest email service!</p>
            <a href="${url}">confirm email</a>
        </body>
      </html>`
    },
    recipients: [{ address: receipients }]
  });
  console.log(response);
};
