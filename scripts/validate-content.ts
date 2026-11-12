import { readFileSync, readdirSync, existsSync } from "fs";
import matter from "gray-matter";
import path from "path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

const REQUIRED: string[] = [
  "title",
  "slug",
  "date",
  "source",
  "sourceUrl",
  "category",
  "tags",
  "excerpt",
];

const VALID_CATEGORIES = [
  "official-notices",
  "sonchayapatra-savings",
  "mutual-growth-funds",
  "market-news",
  "explainers",
];

function main() {
  if (!existsSync(ARTICLES_DIR)) {
    console.log(`No articles directory at ${ARTICLES_DIR}`);
    process.exit(0);
  }

  const files = readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const slugs = new Set<string>();
  let hasIssues = false;

  console.log(`Found ${files.length} article(s)\n`);

  for (const file of files) {
    const fullPath = path.join(ARTICLES_DIR, file);
    const raw = readFileSync(fullPath, "utf-8");
    const { data } = matter(raw) as { data: Record<string, any> };
    const issues: string[] = [];

    for (const field of REQUIRED) {
      const val = data[field];
      if (val === undefined || val === null || val === "") {
        issues.push(`missing ${field}`);
      }
    }

    const slug: string | undefined = data.slug;
    if (slug) {
      if (slugs.has(slug)) {
        issues.push(`duplicate slug: ${slug}`);
      } else {
        slugs.add(slug);
      }
    }

    const category: string | undefined = data.category;
    if (category && !VALID_CATEGORIES.includes(category)) {
      issues.push(`invalid category: ${category}`);
    }

    const date: string | undefined = data.date;
    if (date && isNaN(new Date(date).getTime())) {
      issues.push(`invalid date: ${date}`);
    }

    if (issues.length > 0) {
      hasIssues = true;
      console.log(`- ${file}`);
      for (const issue of issues) {
        console.log(`    [!] ${issue}`);
      }
    }
  }

  if (!hasIssues) {
    console.log("All articles valid. No missing or invalid frontmatter fields.");
  } else {
    console.log("\nSome articles have issues. Fix the frontmatter and re-run.");
    process.exit(1);
  }
}

main();
