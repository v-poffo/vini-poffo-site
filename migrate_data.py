import json
import os
import yaml

def migrate():
    with open('src/data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    projects = data.get('projects', [])
    
    for project in projects:
        # Criar um nome de arquivo amigável
        filename = project['title'].lower().replace(' ', '-').replace('(', '').replace(')', '')
        filepath = f'src/projects/{filename}.json'
        
        # Garantir que campos booleanos existam
        if 'videoHome' in project and project['videoHome']:
            project['showInHero'] = True
        else:
            project['showInHero'] = False
            
        with open(filepath, 'w', encoding='utf-8') as pf:
            json.dump(project, pf, indent=2, ensure_ascii=False)
            
    print(f"Migrados {len(projects)} projetos para src/projects/")

if __name__ == "__main__":
    migrate()
