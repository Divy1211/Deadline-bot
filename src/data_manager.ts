import fs from "fs";
import { check, lockSync } from "proper-lockfile";
import path from "path";

import { Deadline } from "./data_structs";
import { delay } from "./common";

let releaseFunctions: {
    [guildId: string]: {
        releaseDeadlines?: Function,
    }
} = {};

export let data: {
    [guuildId: string]: {
        deadlines?: Deadline[],
    }
} = {};

/**
 * 
 * Loads the required data for the given server. Every resource that is loaded using this function
 * is locked (unless loaded in read only mode) and must be manually released by either calling the
 * releaseData function or automatically by the saveData function.
 * 
 * @param guildId The ID of the discord server to load the data for
 * 
 * @param loadDeadlines Loads the deadlines data for the server if set to true
 * 
 * @param readOnlyDeadlines Prevents locking the deadlines data for the server if set to true
 */

async function loadData(guildId: string, { loadDeadlines = false, }, { readOnlyDeadlines = false, } = {}): Promise<void> {
    data[guildId] ??= {};
    releaseFunctions[guildId] ??= {};
    if(loadDeadlines) {
        const deadlinesPath = path.join(__dirname, "..", "data", `${guildId}.json`);
        if(fs.existsSync(deadlinesPath)) {
            while(await check(deadlinesPath))
                await delay(10);
            if(!readOnlyDeadlines)
                releaseFunctions[guildId].releaseDeadlines = lockSync(deadlinesPath);
            data[guildId].deadlines = JSON.parse(fs.readFileSync(deadlinesPath, {encoding: "utf8"}));
        }
    }
}


/**
 * 
 * Releases locks for the required data for the given server
 * 
 * @param guildId The ID of the discord server to release the data for
 * @param relDeadlines Releases lock on deadlines data for the server if set to true
 */

function releaseData( guildId: string, { relDeadlines = false, }): void {
    if(relDeadlines && releaseFunctions[guildId]?.releaseDeadlines) {
        releaseFunctions[guildId].releaseDeadlines!();
        releaseFunctions[guildId].releaseDeadlines = undefined;
    }
}

/**
 * 
 * Saves the required data for the given server. Also releases locks on the data being saved
 * 
 * @param guildId The ID of the discord server to load the data for
 * @param saveDeadlines Saves Deadlines data for the server if set to true
 */
function saveData(guildId: string, { saveDeadlines = false, }): void {

    releaseData(guildId, { relDeadlines: saveDeadlines, });

    if(saveDeadlines && data[guildId].deadlines) {
        const DeadlinesPath = path.join(__dirname, "..", "data", `${guildId}.json`);
        fs.writeFileSync(DeadlinesPath, JSON.stringify(data[guildId].deadlines, null, 4), {encoding: "utf8"});
        data[guildId].deadlines = undefined;
    }
}


/**
 * 
 * This is a context manager that wraps around the load and save functions, always ensuring
 * that the save functions are called after the load functions
 * 
 * @param guildId The ID of the discord server to load the data for
 * 
 * @param loadDeadlines Loads the deadlines data for the server if set to true
 * 
 * @param readOnlyDeadlines Prevents locking the deadlines data for the server if set to true
 */
export async function *open(guildId: string, { loadDeadlines = false, }, { readOnlyDeadlines = false, } = {}) {
    await loadData(guildId, { loadDeadlines, }, { readOnlyDeadlines, });
    
    if(loadDeadlines)
        data[guildId] = { deadlines: [], ...data[guildId] };

    try {
        yield;
    }
    finally {
        saveData(guildId, { saveDeadlines: loadDeadlines && !readOnlyDeadlines, });
    }
}