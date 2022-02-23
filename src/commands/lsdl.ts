import { MessageEmbed } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import { ICommand } from "wokcommands";
import { data, open } from "../data_manager";

export default {
    category: "Deadline Management",
    description: "List Deadlines",

    slash: true,
    testOnly: true,

    options: [
        {
            name: "date_time",
            description: "Deadlines after this date are not shown.",
            type: ApplicationCommandOptionTypes.STRING,
            required: false,
        },
    ],

    callback: async ({ interaction }) => {
        const { options, channelId, guildId } = interaction;
        const date_time = new Date(options.getString("date_time") ?? 4502275200000);

        if(!channelId || !guildId)
            return "This command can only be run in a text channel in a server";

        if(isNaN(date_time.getTime()))
            return "Invalid Date or Time Specified, please try again";

        let deadlineEmbed = new MessageEmbed()
            .setColor("#ED2939")
            .setTitle("Upcoming Deadlines")
            .addFields(
                {
                    name: "Name",
                    value: "⠀",
                    inline: true
                },
                {
                    name: "Date // Time Left",
                    value: "⠀",
                    inline: true
                },
                {
                    name: "Desc",
                    value: "⠀",
                    inline: true
                }
            );

        for await(const _ of open(guildId, { loadDeadlines: true }, { readOnlyDeadlines: true })) {
            let { deadlines = [], } = data[guildId];
            deadlines = deadlines.filter(deadline => deadline.timestamp < date_time.getTime());

            if(deadlines.length === 0)
                return "🙌🏼 No deadlines yet!"
            
            deadlines.forEach((deadline, i) => {
                deadlineEmbed.addFields(
                    {
                        name: "⠀",
                        value: `${i}. [${deadline.name}](${deadline.link})`,
                        inline: true
                    },
                    {
                        name: "⠀",
                        value: `<t:${deadline.timestamp/1000}> // <t:${deadline.timestamp/1000}:R>`,
                        inline: true
                    },
                    {
                        name: "⠀",
                        value: deadline.desc,
                        inline: true
                    }
                );
            });
        }
        return deadlineEmbed;
    }
} as ICommand;