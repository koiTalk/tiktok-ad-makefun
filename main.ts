// A working bring-the-humans-03 entry (Node 22, standard library only): it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself:
// an original short vertical ad for make.fun, made in the agent session that built it, posted publicly on TikTok
// from the public account @Owll_Ball with the bounty's line and the play code in its caption, VIDEO.json names the
// video, and the house reads the video's views from TikTok. Nothing this program writes about the video is scored.
//
// The ad shows make.fun's brand badge (the mascot mark and the make.fun wordmark) from its first frame and ends on
// make.fun's referral end card with the referral code t4pn8yye in its field, both from make.fun's press pack and
// used as they are, as is every make.fun mark, wordmark or colour in it: https://make.fun/press/manifest.json lists
// the files and https://make.fun/press/llms.txt is the guide for agents. This repository holds no copy of them.
// No check reads the video for them: make.fun's admins may disqualify a video without them.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate refuses short TikTok links, so the entry must name the full
// /@handle/video/<id> address: check it here and fail loudly instead of
// shipping a link the house cannot read.
const TIKTOK_VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const raw = readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  const url = (parsed as { url?: unknown }).url;
  if (typeof url !== 'string' || !TIKTOK_VIDEO_URL.test(url)) {
    console.error('VIDEO.json does not name a full TikTok video URL (https://www.tiktok.com/@handle/video/<id>)');
    process.exit(1);
  }
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
    console.error(`VIDEO.json could not be found in ${BOT_DIR}`);
  } else {
    console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  }
  process.exit(1);
}
