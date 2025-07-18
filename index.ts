/**
 * @license
    BSD 3-Clause License

    Copyright (c) 2025, Sobhan-SRZA (mr.sinre) from Persian Caesar 
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

    3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import {
    readdirSync,
    readFileSync
} from "fs";
import { PackageJson } from "./src/types/interfaces";
import DiscordClient from "./src/models/Client";
import * as dotenv from "dotenv";
import error from "./src/utils/error";
import post from "./src/functions/post";

// Add color to console messages.
import "colors";

// Support .env args
dotenv.config();

// Adding "toCapitalize" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.toCapitalize = function (): string {
    return String(this).toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}
// Adding "replaceValues" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.replaceValues = function (object: Record<string, any>): string {
    let string = String(this);
    Object
        .keys(object)
        .forEach(a => {
            string = string.replace(`{${a}}`, object[a]);
        });

    return string;
}
// Adding "HexToNumber" method to String class. | ts type is in ./src/types/global.d.ts
String.prototype.HexToNumber = function (): number {
    return parseInt(this.replace("#", ""), 16)
}

// Adding "random" method to Array class. | ts type is in ./src/types/global.d.ts
Array.prototype.random = function () {
    const array = Array.from(this);
    return array[Math.floor(Math.random() * array.length)]
}

// Load discord client
const
    client = new DiscordClient(),
    handle = readdirSync(__dirname + "/src/handlers").filter(file => file.endsWith(".js")),
    packageJSON: PackageJson = JSON.parse(readFileSync("./package.json", "utf8"));

// Login 
const main = async () => {
    try {
        // Load Handlers 
        let amount = 0;
        post(
            "Welcome to ".cyan + (packageJSON.name).blue + "! | Version: ".cyan + (packageJSON.version).blue + "\n" +
            "Coded By ".cyan + ("Sobhan-SRZA").yellow + " & ".cyan + ("Persian Caesar").yellow + " With ".cyan + ("❤️").red + "\n" +
            `Discord: ${("Mr.Sinre").blue}` + " | ".cyan + `${("mr.sinre").blue}` + " | ".cyan + `${("https://dsc.gg/persian-caesar").blue}`,
            "W",
            "magenta",
            "cyan"
        );
        post("Logging into the BOT...", "S");
        for (const file of handle) {
            const handlerFile = await import(`./src/handlers/${file}`);
            const handler = handlerFile.default || handlerFile;
            await handler(client);
            amount++;
        }
        post((String(amount)).cyan + " Handler Is Loaded!!".green, "S");
        if (client.token)
            await client
                .login(client.token)
                .catch((e: any) => {
                    post("The Bot Token You Entered Into Your Project Is Incorrect Or Your Bot's INTENTS Are OFF!!", "E", "red", "red");
                    error(e);
                });

        else
            post("Please Write Your Bot Token Opposite The Token In The config.js File In Your Project!!", "E", "red", "red");

    } catch (e: any) {
        error(e);
        await client.destroy();
        process.exit(1);
    }
};
void main();

// Load Anti Crash
if (client.config.source.anti_crash) {
    process.on("unhandledRejection", (e: any) => error(e));
    process.on("rejectionHandled", (e: any) => error(e));
    process.on("uncaughtException", (e: any) => error(e));
    process.on("uncaughtExceptionMonitor", (e: any) => error(e));
}

// Export client
export default client;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */