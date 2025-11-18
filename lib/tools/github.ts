// lib/tools/github.ts
import { Octokit } from "@octokit/rest";

if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
  throw new Error("GitHub env vars are missing in dualpilot-dev-bot");
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

export async function getFile(path: string) {
  const res = await octokit.repos.getContent({ owner, repo, path });

  if (Array.isArray(res.data) || !("content" in res.data)) {
    throw new Error(`Path is not a file ${path}`);
  }

  const buff = Buffer.from(res.data.content, "base64");
  return { content: buff.toString("utf8"), sha: res.data.sha };
}
