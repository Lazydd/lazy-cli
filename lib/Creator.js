const inquirer = require("inquirer");
const downloadGitRepo = require("download-git-repo");
const chalk = require("chalk");
const util = require("util");

const ora = require("ora");
class Creator {
    constructor(name, target) {
        this.name = name
        this.target = target
        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async create() {
        // 仓库信息 —— 模板信息
        let repo = await this.getRepoInfo();
        // 下载模板
        await this.download(repo);
    }

    async getRepoInfo() {
        // 选取模板信息
        let { repo } = await new inquirer.prompt([
            {
                name: "repo",
                type: "list",
                message: "Please choose a template to create project",
                choices: [
                    {
                        name: 'lazy-blog',
                    },
                    {
                        name: 'lazy-blog-ui',
                    }
                ],
            },
        ]);
        return repo;
    }

    async download(repo) {
        let templateUrl
        switch (repo) {
            case 'lazy-blog-ui':
                templateUrl = 'https://github.com/Lazydd/doc.git#main'
                break;
            case 'lazy-blog':
                templateUrl = 'https://github.com/Lazydd/doc.git#main-blog'
                break;
        }
        // 调用 downloadGitRepo 方法将对应模板下载到指定目录
        const spinner = ora('downloading template, please wait');
        spinner.start(); // 开启加载
        await this.downloadGitRepo(`direct:${templateUrl}`, // 这里是随便填的笔主的一个开源项目地址
            this.name,
            { clone: true }, (err) => {
                if (!err) {
                    spinner.succeed();
                    // 模板使用提示
                    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
                    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
                    console.log("  pnpm install");
                    console.log("  pnpm dev\r\n");
                } else {
                    spinner.fail("request fail, reTrying");
                }
            })
    }
}

module.exports = Creator;
