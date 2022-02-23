import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ICommand } from "wokcommands";
import { data, open } from "../data_manager";

export default {
    category: "Deadline Management",
    description: "Make a deadline",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "name",
            description: "The name of the deadline",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "date_time",
            description: "The date and time for this deadline. Enter in MM/DD/YYYY HH:MM:SS (24 hour) format",
            type: ApplicationCommandOptionTypes.STRING,
            required: true,
        },
        {
            name: "desc",
            description: "The description for the deadline",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
        {
            name: "link",
            description: "A relevant link for the deadline",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        }
    ],

    callback: async ({ interaction }) => {
        const { options, channelId, guildId } = interaction;
        const name = options.getString("name")!;
        const date_time = new Date(options.getString("date_time")!);
        const desc = options.getString("desc") ?? name;
        const link = options.getString("link") ?? "";

        if(!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        if(isNaN(date_time.getTime()))
            return "Invalid Date or Time Specified, please try again";

        for await(const _ of open(guildId, { loadDeadlines: true })) {
            let { deadlines = [], } = data[guildId];
            deadlines.push({
                createdBy: interaction.user.id,
                desc,
                name,
                reminders: {},
                timestamp: date_time.getTime(),
                link,
            });
        }
        return "Deadline added successfully";
    }
} as ICommand;