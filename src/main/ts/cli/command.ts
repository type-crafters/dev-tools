import { CommandAction, Entry, Primitive } from "@/types";
import { Argument } from "./argument";
import { UI } from "./ui";
import { Positional } from "./positional";
import { Optional } from "./optional";
import { Switch } from "./switch";
import { CommandBuilder } from "./command-builder";

export class Command {
    public static readonly cliVersion = "0.0.1"
    public name: string;
    public help: string;
    public subcommands: Command[] = [];
    public arguments: Argument[] = [];
    private parameters: Map<string, Primitive> = new Map();
    public action: CommandAction;

    public get helpString(): string {
        return [
            `Command '${this.name}':`,
            "-".repeat(this.help.length),
            this.help,
            "-".repeat(this.help.length),
            "",
            "Positional Arguments: ",
            this.arguments.filter((a) => a instanceof Positional).reduce((acc, p) => acc + `- ${p.name}: ${p.description}\n`, "") || "None",
            "",
            "Optional Arguments: ",
            this.arguments.filter((a) => a instanceof Optional).reduce((acc, o) => acc + `- ${o.name}: ${o.description}\n`, "") || "None",
            "",
            "Flags: ",
            this.arguments.filter((a) => a instanceof Switch).reduce((acc, f) => acc + `- ${f.name}: ${f.description}\n`, "") || "None",
            "",
            "Subcommands: ",
            this.subcommands.reduce((acc, cmd) => acc + `- ${cmd.name}: ${cmd.help}\n`, "") || "None"
        ].join("\n");
    }

    constructor()
    constructor(name: string, help: string)
    constructor(name: string, help: string, action: CommandAction)
    constructor(name: string = "", help: string = "", action: CommandAction = () => void UI.warning("Action not implemented")) {
        this.name = name;
        this.help = help;
        this.action = action;

    }

    public static builder(): CommandBuilder {
        return new CommandBuilder();
    }

    public traverse(args: string[]) {
        if (args.length === 1 && ["-h", "--help"].includes(args[0])) {
            return UI.echo(UI.white(this.helpString));
        }
        if (args.length === 0) {
            return this.action(this.parameters);
        }
        const subcommand = this.subcommands.find(subcmd => subcmd.name === args[0]);
        if (subcommand) {
            subcommand.traverse(args.slice(1));
        } else {
            this.parse(args);
        }
    }

    public parse(args: string[]) {
        this.arguments.forEach((argument) => {
            const entry: Entry<string, any> = argument.capture(args);
            this.parameters.set(entry.key, entry.value);
        });

        return this.action(this.parameters);
    }
}
