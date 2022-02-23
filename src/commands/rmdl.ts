import { MessageEmbed } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ICommand } from "wokcommands";
import { data, open } from "../data_manager";

export default {
    category: "Deadline Management",
    description: "Remove a Deadline",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "index",
            description: "The index of the deadline that is shown when you use /lsdl. This changes after removing deadlines!",
            type: ApplicationCommandOptionTypes.NUMBER,
            required: true,
        },
    ],

    callback: async ({ interaction }) => {
        const { options, channelId, guildId } = interaction;
        const index = options.getNumber("index")!;

        if(!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        for await(const _ of open(guildId, { loadDeadlines: true })) {
            let { deadlines = [], } = data[guildId];

            if(index < 0 || index >= deadlines.length)
                return `Deadline index \`${index}\` invalid or not found`;

            deadlines.splice(index, 1);
        }
        return `Deadline \`${index}\` deleted successfully`;
    }
} as ICommand;