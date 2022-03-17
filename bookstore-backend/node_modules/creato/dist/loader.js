"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tar = require("tar");
const tmp = require("tmp");
const github = require("parse-github-url");
const fs = require("fs");
const request = require("request");
/** Loaders */
/**
 *
 * Installs template locally.
 *
 * @param template
 * @param output
 */
async function loadTemplate(template, output) {
    /** Generate tar information. */
    const tar = getRepositoryTarInformation(template);
    /** Download repository to tmp folder. */
    const tmp = await downloadRepository(tar);
    if (tmp.status === 'err') {
        return {
            status: 'err',
            message: tmp.message,
        };
    }
    /** Extract template from repository to dist. */
    const dist = await extractTemplateFromRepository(tmp.path, tar, output);
    if (dist.status === 'err') {
        return {
            status: 'err',
            message: dist.message,
        };
    }
    return {
        status: 'ok',
        message: 'Successfully installed template.',
    };
}
exports.loadTemplate = loadTemplate;
/**
 *
 * Generates repository tar information.
 *
 * @param template
 */
function getRepositoryTarInformation(template) {
    const meta = github(template.repo.uri);
    const uri = [
        `https://api.github.com/repos`,
        meta.repo,
        'tarball',
        template.repo.branch,
    ].join('/');
    return { uri, files: template.repo.path };
}
/**
 *
 * Downloads repository tar to temporary folder.
 *
 * @param tar
 */
async function downloadRepository(tar) {
    try {
        const tmpPath = tmp.fileSync({
            postfix: '.tar.gz',
        });
        await new Promise(resolve => {
            request(tar.uri, {
                headers: {
                    'User-Agent': 'maticzav/creato',
                },
            })
                .pipe(fs.createWriteStream(tmpPath.name))
                .on('close', resolve);
        });
        return { status: 'ok', path: tmpPath.name };
    }
    catch (err) {
        return { status: 'err', message: err.message };
    }
}
/**
 *
 * Extracts repository from tar to dist.
 *
 * @param tmp
 * @param repo
 * @param output
 */
async function extractTemplateFromRepository(tmp, repo, dist) {
    try {
        await tar.extract({
            file: tmp,
            cwd: dist,
            filter: path => RegExp(repo.files).test(path),
            strip: repo.files.split('/').length,
        });
        return { status: 'ok' };
    }
    catch (err) {
        return { status: 'err', message: err.message };
    }
}
//# sourceMappingURL=loader.js.map