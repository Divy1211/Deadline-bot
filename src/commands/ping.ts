import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { client } from "../main";

export default {
    category: "Tools",
    description: "Responds with the ping of the user and the bot.",

    slash: true,
    testOnly: true,

    callback: async ({ interaction }) => {
        let embed = new MessageEmbed()
            .setColor("#ED2939")
            .setTitle("Ping Information")
            .addFields([
                {
                    name: `${interaction.user.username}'s Ping`,
                    value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
                    inline: true,
                },
                {
                    name: "Bot's Ping",
                    value: `\`${client.ws.ping}ms\``,
                    inline: true,
                }
            ]);

        return embed;
    }
} as ICommand;