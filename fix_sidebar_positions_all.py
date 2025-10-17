#!/usr/bin/env python3
"""
Script para fijar sidebar_position duplicados en POS, NÓMINA y DOCUMENTO SOPORTE
Asigna posiciones únicas secuenciales 1-N para cada sección
"""

import os
import re
from pathlib import Path

# Definir secciones a procesar
sections = {
    'docs/jsons-pos': {
        'files': [
            'pos.md',
            'pos-final-consumer.md',
            'pos-with-discount.md',
            'pos-debit-note.md',
            'pos-credit-note.md'
        ],
        'start_pos': 1
    },
    'docs/payroll': {
        'files': [
            'payroll-fields.md',      # ya está 1
            'payroll-replace.md',     # ya está 2
            'payroll-delete.md'       # ya está 3
        ],
        'start_pos': 1  # ya está bien, pero lo normalizamos
    },
    'docs/jsons-support-document': {
        'files': [
            'support-document.md',
            'support-document-non-residents.md',
            'adjustment-note.md',
            'adjustment-note-non-residents.md'
        ],
        'start_pos': 1
    }
}

def update_sidebar_position(file_path, new_position):
    """Actualiza sidebar_position en un archivo markdown"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Patrón para encontrar sidebar_position (puede ser entero o decimal)
    pattern = r'sidebar_position:\s*[\d.]+'
    replacement = f'sidebar_position: {new_position}'
    
    new_content = re.sub(pattern, replacement, content)
    
    # Si no encuentra sidebar_position, agrega después del title
    if pattern not in content and new_content == content:
        # Buscar el patrón title y agregar sidebar_position después
        title_pattern = r'(title:\s*[^\n]+\n)'
        if re.search(title_pattern, content):
            new_content = re.sub(
                title_pattern,
                r'\1sidebar_position: ' + str(new_position) + '\n',
                content,
                count=1
            )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return new_content != content

# Procesar cada sección
base_path = Path('.')
print("=" * 70)
print("🔧 Actualizando sidebar_position en POS, NÓMINA y DOCUMENTO SOPORTE")
print("=" * 70)

total_updated = 0

for section_path, config in sections.items():
    print(f"\n📁 {section_path}")
    print("-" * 70)
    
    position = config['start_pos']
    section_updated = 0
    
    for filename in config['files']:
        file_full_path = base_path / section_path / filename
        
        if file_full_path.exists():
            old_pos = "?"
            # Leer posición anterior
            with open(file_full_path, 'r', encoding='utf-8') as f:
                match = re.search(r'sidebar_position:\s*([\d.]+)', f.read())
                if match:
                    old_pos = match.group(1)
            
            if update_sidebar_position(str(file_full_path), position):
                print(f"  ✓ {filename}: {old_pos} → {position}")
                section_updated += 1
                total_updated += 1
            else:
                print(f"  ✗ {filename}: No pudo actualizarse")
            
            position += 1
        else:
            print(f"  ✗ {filename}: No encontrado")
    
    print(f"  ✅ {section_updated} archivos actualizados")

print("\n" + "=" * 70)
print(f"✅ ACTUALIZACIÓN COMPLETADA: {total_updated} archivos procesados")
print("=" * 70)

# Verificación final
print("\n📊 VERIFICACIÓN FINAL:")
print("-" * 70)

for section_path, config in sections.items():
    print(f"\n{section_path}:")
    positions = []
    for filename in config['files']:
        file_full_path = base_path / section_path / filename
        if file_full_path.exists():
            with open(file_full_path, 'r', encoding='utf-8') as f:
                match = re.search(r'sidebar_position:\s*([\d.]+)', f.read())
                if match:
                    pos = match.group(1)
                    positions.append(pos)
                    print(f"  {filename}: {pos}")
    
    # Verificar duplicados
    if len(positions) != len(set(positions)):
        print(f"  ⚠️  ADVERTENCIA: Hay posiciones duplicadas!")
    else:
        print(f"  ✅ Todas las posiciones son únicas")
