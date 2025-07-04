#! /usr/bin/env bun

import { Command } from "@cli/command";
import { CommandBuilder } from "@cli/command-builder";
import {
    NestModule,
    NestController,
    NestService,
    NestFilter,
    NestEntity,
    NestResource,
    NestProject,
    NestPipe,
    NestGuard,
    NestInterceptor
} from "./handlers/nest";
import { ReactPage } from "./handlers/react/react-page";


// devtools
const cli = CommandBuilder.buildRoot();

// devtools nest
Command.builder()
    .childOf(cli)
    .setName("nest")
    .setHelp("NestJS file creation commands. Use this command to generate modules, controllers, services, and other NestJS components quickly.")
    .addChild(NestModule.command)
    .addChild(NestController.command)
    .addChild(NestService.command)
    .addChild(NestPipe.command)
    .addChild(NestFilter.command)
    .addChild(NestGuard.command)
    .addChild(NestInterceptor.command)
    .addChild(NestEntity.command)
    .addChild(NestResource.command)
    .addChild(NestProject.command)
    .build();

// devtools react 
Command.builder()
    .childOf(cli)
    .setName("react")
    .setHelp("React and Next.js file creation Commands. Use this command to generate pages, views, layouts, and empty css modules.")
    .addChild(ReactPage.command)
    .build()

cli.traverse(process.argv.slice(2));