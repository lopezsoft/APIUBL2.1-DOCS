#!/usr/bin/env bash
# Instalador en 1 paso del Skill y Contexto Oficial de MATIAS API UBL 2.1
# Compatible con Antigravity (.gemini/skills), Claude Code (.claude/skills), Cursor (.cursor/rules) y AGENTS.md

set -e

BASE_URL="https://docs.matias-api.com"
SKILL_DIR=".claude/skills/matias-api-ubl21"
AGY_SKILL_DIR=".gemini/skills/matias-api-ubl21"
CURSOR_DIR=".cursor/rules"

echo "🚀 Instalando Skill y Contexto de MATIAS API UBL 2.1..."

mkdir -p "$SKILL_DIR/references" "$AGY_SKILL_DIR" "$CURSOR_DIR"

curl -fsSL "$BASE_URL/ai/matias-api-skill/SKILL.md" -o "$SKILL_DIR/SKILL.md"
cp "$SKILL_DIR/SKILL.md" "$AGY_SKILL_DIR/SKILL.md"
curl -fsSL "$BASE_URL/ai/matias-api.cursorrules" -o "$CURSOR_DIR/matias-api.mdc"
curl -fsSL "$BASE_URL/ai/AGENTS.md" -o "$SKILL_DIR/references/AGENTS.md"
curl -fsSL "$BASE_URL/openapi.json" -o "$SKILL_DIR/references/openapi.json"

for pack in quickstart-auth-sandbox invoicing-pos-notes health-sector-rips payroll-support-doc radian-bulk-webhooks troubleshooting-errors; do
  curl -fsSL "$BASE_URL/ai/packs/$pack.md" -o "$SKILL_DIR/references/$pack.md"
done

echo "✅ Instalación completada:"
echo "   - Claude Code Skill: $SKILL_DIR/SKILL.md (+ paquetes en references/)"
echo "   - Antigravity Skill: $AGY_SKILL_DIR/SKILL.md"
echo "   - Cursor Rule:       $CURSOR_DIR/matias-api.mdc"
