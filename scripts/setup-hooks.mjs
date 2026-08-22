import { writeFileSync, mkdirSync } from "fs";
mkdirSync(".git/hooks", { recursive: true });
writeFileSync(".git/hooks/pre-commit", `#!/bin/sh\nnpx lint-staged\n`, { mode: 0o755 });
console.log("hook installed — pre-commit <40s via lint-staged");
