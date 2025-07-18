import {
  AttachmentBuilder,
  EmbedBuilder,
  WebhookClient,
  WebhookMessageCreateOptions
} from "discord.js";
import EmbedData from "../storage/embed";
import config from "../../config";
import post from "../functions/post";

interface ErrorType {
  message: string;
  stack?: string;
  name?: string;
  code?: number;
  status?: string;
}

export default function (error: ErrorType | string) {
  try {
    if (typeof error === "string")
      error = { message: error };

    if (config.source.logger && config.discord.support.webhook.url) {
      const
        date = Date.parse(Date.now().toString()) / 1000,
        data: WebhookMessageCreateOptions = {
          avatarURL: config.discord.support.webhook.avatar,
          username: config.discord.support.webhook.username
        },
        webhook = new WebhookClient(
          {
            url: config.discord.support.webhook.url
          }
        ),
        embed = new EmbedBuilder()
          .setColor(EmbedData.color.theme.HexToNumber())
          .setAuthor(
            {
              name: `${error.message}`
            }
          )
          .setFooter(
            {
              text: EmbedData.footer.footerText,
              iconURL: EmbedData.footer.footerIcon
            }
          )
          .setTitle(`${EmbedData.emotes.error}| An error occurred!!`)
          .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
          .addFields(
            [
              {
                name: `${EmbedData.emotes.entry}| Name:`,
                value: `${error.name}`
              }
            ]
          );

      if (error.code)
        embed.addFields(
          [
            {
              name: `${EmbedData.emotes.prohibited}| Code:`,
              value: `${error.code}`
            }
          ]
        );

      if (error.status)
        embed.addFields(
          [
            {
              name: `${EmbedData.emotes.globe}| httpStatus:`,
              value: `${error.status}`
            }
          ]
        );

      embed.addFields(
        [
          {
            name: `${EmbedData.emotes.clock}| Timestamp:`,
            value: `**<t:${date}:D> | <t:${date}:R>**`
          }
        ]
      );
      if (error.stack && error.stack.length > 4087) {
        data.content = `**${EmbedData.emotes.entry}| Name: \`${error.name}\`${error.code ?
          `\n${EmbedData.emotes.prohibited}| Code: \`${error.code}\`` : ""
          }${error.status ?
            `\n${EmbedData.emotes.globe}| httpStatus: \`${error.status}\`` : ""
          }\n${EmbedData.emotes.clock}| Timestamp: <t:${date}:D> | <t:${date}:R>**`;

        data.files = [
          new AttachmentBuilder(Buffer.from(error.stack), {
            name: "error_message.txt",
            description: error.name,
          })
        ];
      }

      else
        data.embeds = [embed];


      if (config.discord.support.webhook.threads.bugs)
        data.threadId = config.discord.support.webhook.threads.bugs;

      return webhook.send(data);
    }

    else
      console.log(error);

  } catch (e) {
    post("Error logger to discord webhook have bug!!", "E", "red", "red");
    console.log(e);
    post("Main Error:", "E", "red", "red");
    console.log(error);
  }
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */