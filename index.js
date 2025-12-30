// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob');
const fs = require('fs');
const readline = require('readline');

async function run() {
    try {
        const token = core.getInput('token');
        const keyword = core.getInput('keyword') || 'TODO';
        const closeOnResolve = core.getInput('close_on_resolve') === 'true';

        const octokit = github.getOctokit(token);
        const { owner, repo } = github.context.repo;

        console.log(`Scanning for '${keyword}' in ${owner}/${repo}...`);

        // In a real robust implementation, we would compare with previous commit or parse AST.
        // This is a simplified version that scans all files and checks existing issues.

        // 1. Get all open issues created by this bot or with a specific label
        const issues = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'open',
            labels: 'automated-todo'
        });

        const existingTitles = new Set(issues.data.map(i => i.title));
        console.log(`Found ${existingTitles.size} existing open automated issues.`);

        const foundTodos = new Set();

        // 2. Scan files
        const files = glob.sync('**/*.{js,ts,py,md,java,c,cpp,h}', { ignore: 'node_modules/**' });

        for (const file of files) {
            const fileStream = fs.createReadStream(file);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            let lineNum = 0;
            for await (const line of rl) {
                lineNum++;
                if (line.includes(keyword)) {
                    // Extract the TODO text
                    // Simple regex: // TODO: message or # TODO: message
                    const regex = new RegExp(`[\\/\\#\\*]+\\s*${keyword}[:\\s]*(.*)`);
                    const match = line.match(regex);

                    if (match && match[1]) {
                        const title = match[1].trim();
                        if (title.length > 0) {
                            foundTodos.add(title);

                            if (!existingTitles.has(title)) {
                                console.log(`Creating issue for: ${title}`);
                                await octokit.rest.issues.create({
                                    owner,
                                    repo,
                                    title: title,
                                    body: `Found ${keyword} in [${file}:${lineNum}](${github.context.payload.repository.html_url}/blob/${github.context.sha}/${file}#L${lineNum})`,
                                    labels: ['automated-todo']
                                });
                                existingTitles.add(title); // Prevent dupes in same run
                            }
                        }
                    }
                }
            }
        }

        // 3. Close resolved issues (Optional)
        if (closeOnResolve) {
            for (const issue of issues.data) {
                if (!foundTodos.has(issue.title)) {
                    console.log(`Closing issue '${issue.title}' as the TODO is no longer found.`);
                    await octokit.rest.issues.update({
                        owner,
                        repo,
                        issue_number: issue.number,
                        state: 'closed',
                        state_reason: 'completed'
                    });
                }
            }
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
