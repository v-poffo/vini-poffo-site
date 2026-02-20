import json
import os

def build():
    # Ler configurações do site
    with open('src/data.json', 'r', encoding='utf-8') as f:
        site_data = json.load(f)
    
    # Limpar lista de projetos para reconstruir
    site_data['projects'] = []
    
    # Ler todos os arquivos de projeto em src/projects
    project_dir = 'src/projects'
    for filename in os.listdir(project_dir):
        if filename.endswith('.json'):
            with open(os.path.join(project_dir, filename), 'r', encoding='utf-8') as f:
                project = json.load(f)
                site_data['projects'].append(project)
    
    # Ordenar projetos por ID ou Ano (opcional)
    site_data['projects'].sort(key=lambda x: x.get('id', 0), reverse=True)
    
    # Salvar como data.js para o frontend
    js_content = f"const siteData = {json.dumps(site_data, indent=2, ensure_ascii=False)};"
    with open('public/data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("public/data.js atualizado com sucesso!")

if __name__ == "__main__":
    build()
