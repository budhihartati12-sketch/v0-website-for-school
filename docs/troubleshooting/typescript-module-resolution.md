# TypeScript Module Resolution Troubleshooting

## Issue: Module has no exported member

If you see errors like:
```
Module '"@/components/navigation"' has no exported member 'Breadcrumb'.
```

### Solutions:

#### 1. Restart TypeScript Server (VSCode/Cursor)

**Method A: Command Palette**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "TypeScript: Restart TS Server"
3. Press Enter

**Method B: Reload Window**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Developer: Reload Window"
3. Press Enter

#### 2. Clear TypeScript Cache

```bash
# Delete TypeScript cache
rm -rf node_modules/.cache
rm -rf .next

# Reinstall dependencies
npm install

# Rebuild
pnpm run build
```

#### 3. Verify Path Aliases

Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

#### 4. Verify Exports

Check that files are properly exported:

**components/navigation/index.ts:**
```typescript
export { Breadcrumb } from "./breadcrumb"
export { FloatingActions } from "./floating-actions"
```

**components/navigation/breadcrumb.tsx:**
```typescript
export function Breadcrumb({ ... }) { ... }
```

#### 5. Check Import Syntax

Ensure correct import syntax:
```typescript
// ✅ Correct
import { Breadcrumb, FloatingActions } from "@/components/navigation"

// ❌ Wrong
import { Breadcrumb } from "@/components/navigation/breadcrumb"
```

### Common Causes:

1. **TypeScript Server Cache**: Most common, needs restart
2. **Missing node_modules**: Run `npm install`
3. **Wrong tsconfig.json**: Check path aliases
4. **File not saved**: Ensure all files are saved
5. **IDE not in workspace root**: Open folder at project root

### Verification:

```bash
# Check if files exist
ls -la components/navigation/
# Should show: breadcrumb.tsx, floating-actions.tsx, index.ts

# Check exports
cat components/navigation/index.ts
# Should show proper export statements

# Check TypeScript compilation
npx tsc --noEmit
# Should complete without errors
```

### VSCode/Cursor Settings:

Create `.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Still Not Working?

1. Close and reopen your editor
2. Delete `.next` folder: `rm -rf .next`
3. Rebuild: `pnpm run dev`
4. Check if the issue persists

---

**Note**: After refactoring or creating new modules, always restart the TypeScript server to ensure proper module resolution.

