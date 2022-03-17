#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const ora = require("ora");
const inquirer = require("inquirer");
const mkdirp = require("mkdirp");
const loader_1 = require("./loader");
/**
 *
 * Creates a CLI tool from description and templates.
 *
 * @param templates
 * @param options
 */
async function creato(templates, options) {
    /**
     * Inquier about template
     */
    const { template } = await inquirer.prompt([
        {
            name: 'template',
            message: 'Choose a template!',
            type: 'list',
            choices: templates.map(template => ({
                name: `${template.name}    ${template.description}`,
                value: template,
            })),
        },
    ]);
    const { dist } = await inquirer.prompt([
        {
            name: 'dist',
            message: 'Where should we scaffold your template?',
            type: 'input',
        },
    ]);
    const absoluteDist = path.resolve(process.cwd(), dist);
    if (fs.existsSync(absoluteDist) && !options.force) {
        console.warn(`Directory ${absoluteDist} must be empty.`);
        return process.exit(1);
    }
    else {
        mkdirp.sync(absoluteDist);
    }
    /**
     * Load template
     */
    const spinner = ora({
        text: `Loading ${template.name} template.`,
    }).start();
    const res = await loader_1.loadTemplate(template, absoluteDist);
    if (res.status === 'ok') {
        spinner.succeed();
        console.log(res.message);
        return process.exit(0);
    }
    else {
        spinner.fail();
        console.warn(res.message);
        return process.exit(1);
    }
}
exports.creato = creato;
//# sourceMappingURL=creato.js.map