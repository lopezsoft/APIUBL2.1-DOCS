# Instalador en 1 paso del Skill y Contexto Oficial de MATIAS API UBL 2.1 (PowerShell)
# Compatible con Antigravity (.gemini/skills), Claude Code (.claude/skills) y Cursor (.cursor/rules)

$ErrorActionPreference = "Stop"
$BaseUrl = "https://docs.matias-api.com"
$SkillDir = ".claude/skills/matias-api-ubl21"
$AgySkillDir = ".gemini/skills/matias-api-ubl21"
$CursorDir = ".cursor/rules"

Write-Host "🚀 Instalando Skill y Contexto de MATIAS API UBL 2.1..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "$SkillDir/references", $AgySkillDir, $CursorDir | Out-Null

Invoke-WebRequest -Uri "$BaseUrl/ai/matias-api-skill/SKILL.md" -OutFile "$SkillDir/SKILL.md" -UseBasicParsing
Copy-Item "$SkillDir/SKILL.md" "$AgySkillDir/SKILL.md" -Force
Invoke-WebRequest -Uri "$BaseUrl/ai/matias-api.cursorrules" -OutFile "$CursorDir/matias-api.mdc" -UseBasicParsing
Invoke-WebRequest -Uri "$BaseUrl/ai/AGENTS.md" -OutFile "$SkillDir/references/AGENTS.md" -UseBasicParsing
Invoke-WebRequest -Uri "$BaseUrl/openapi.json" -OutFile "$SkillDir/references/openapi.json" -UseBasicParsing

$Packs = @(
  "quickstart-auth-sandbox",
  "invoicing-pos-notes",
  "health-sector-rips",
  "payroll-support-doc",
  "radian-bulk-webhooks",
  "troubleshooting-errors"
)

foreach ($Pack in $Packs) {
  Invoke-WebRequest -Uri "$BaseUrl/ai/packs/$Pack.md" -OutFile "$SkillDir/references/$Pack.md" -UseBasicParsing
}

Write-Host "✅ Instalación completada con éxito:" -ForegroundColor Green
Write-Host "   - Claude Code Skill: $SkillDir/SKILL.md (+ referencias)"
Write-Host "   - Antigravity Skill: $AgySkillDir/SKILL.md"
Write-Host "   - Cursor Rule:       $CursorDir/matias-api.mdc"
