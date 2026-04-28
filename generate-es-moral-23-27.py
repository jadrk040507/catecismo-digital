#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 3: Moral (ES)
Temas 23-27 en español (faltantes)
"""

import os
import sys

BASE_DIR = "/home/family/Dropbox/OpenClaw/workspace/catecismo-digital"

def lesson_es_template(title, cic, scripture, big_question, key_idea):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
const lessonRef = "{cic}";
const lessonScripture = "{scripture}";
---
<LessonLayout title="{title}" cic={{lessonRef}} scripture={{lessonScripture}}>

<section class="content">

<h2>Gran Pregunta</h2>

<p class="big-question">{big_question}</p>

<p>Esta lección explora la enseñanza moral de la Iglesia Católica, ayudándonos a comprender cómo vivir como discípulos de Cristo en el mundo de hoy.</p>

</section>

<section class="content">

<h2>Comprendiendo la Enseñanza</h2>

<p>El Catecismo de la Iglesia Católica proporciona una guía clara sobre cómo debemos vivir como seguidores de Cristo. Esta enseñanza no es una carga sino un camino hacia la verdadera libertad y felicidad.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Actividad</h4>
<p>Considera cómo esta enseñanza moral se aplica a las decisiones que enfrentas diariamente.</p>
</div>

</section>

<section class="content">

<h2>Fundamento Bíblico</h2>

<p>La Sagrada Escritura revela el plan de Dios para el florecimiento humano. La ley moral no es arbitraria sino que refleja la sabiduría del Creador que sabe lo que conduce a la felicidad humana.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Conexión</h4>
<p>Lee los pasajes de las Escrituras y reflexiona sobre cómo iluminan esta enseñanza.</p>
</div>

</section>

<section class="content">

<h2>Para Reflexionar</h2>

<ol>
<li>¿Cómo desafía esta enseñanza tu forma actual de vivir?</li>
<li>¿Qué pasos prácticos puedes tomar para crecer en este área?</li>
<li>¿Cómo nos asiste la gracia para vivir esta enseñanza moral?</li>
<li>¿Qué obstáculos enfrentas para vivir según esta enseñanza?</li>
<li>¿Quién puede apoyarte en crecer en este aspecto de la vida cristiana?</li>
</ol>

</section>

<section class="content">

<h2>Idea Fuerza</h2>

<div class="callout">
<p><strong>Idea Fuerza:</strong> {key_idea}</p>
</div>

</section>

<section class="content">

<h2>Riqueza Cultural</h2>

<p>
<strong>Tradición Moral:</strong> La enseñanza moral de la Iglesia se ha desarrollado a través de siglos de reflexión sobre la Escritura y la experiencia humana.
</p>

<p>
<strong>Ética de las Virtudes:</strong> La teología moral católica enfatiza la formación de la virtud como esencial para la vida cristiana.
</p>

</section>

</LessonLayout>
'''

def workbook_es_template(title, cic):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
---
<LessonLayout title="Workbook \u0026mdash; {title}" cic="{cic}" scripture="">

<section class="content">

<h2>Workbook del Alumno</h2>
<p class="big-question">Para usar después de la clase o en grupo.</p>

<h3>Recordando lo esencial</h3>

<ol>
<li>¿Cuál es la enseñanza principal de esta lección?</li>
<li>¿Cómo afecta esto la vida del cristiano?</li>
<li>¿Cuáles son los elementos esenciales para recordar?</li>
<li>¿Cómo podemos aplicar esta enseñanza diariamente?</li>
<li>¿Cómo se conecta esto con otras enseñanzas de la Iglesia?</li>
</ol>

</section>

<section class="content">

<h3>Para reflexionar y escribir</h3>

<div class="question-block">
<p class="question-block__q">1. ¿Qué obstáculos te impiden vivir esta enseñanza más plenamente?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. ¿Cómo has experimentado la gracia de Dios en este ámbito?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. ¿A quién podrías compartir lo que has aprendido?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Actividades prácticas</h3>

<h4>A. Estudio de las Escrituras</h4>
<p>Lee los pasajes relacionados y escribe una reflexión.</p>

<h4>B. Compartir la fe</h4>
<p>Explica a alguien lo que aprendiste en esta clase.</p>

</section>

<section class="content">

<h3>Versículo para memorizar</h3>

<div class="bible-passage">
<p>«Bienaventurados los limpios de corazón, porque ellos verán a Dios».</p>
<p class="bible-passage__ref">\u0026mdash; Mateo 5,8</p>
</div>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Imprimir Workbook</a>
</div>

</section>

</LessonLayout>
'''

def guide_es_template(title, cic):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
---
<LessonLayout title="Guía del Catequista \u0026mdash; {title}" cic="{cic}" scripture="">

<section class="content">

<h2>Guía del Catequista</h2>
<p class="big-question">Para preparar y dirigir la clase.</p>

<h3>Resumen de la clase</h3>

<p><strong>Duración estimada:</strong> 60 minutos</p>
<p><strong>Tema central:</strong> {title}</p>
<p><strong>Objetivos:</strong></p>
<ul>
<li>Comprender la enseñanza moral de la Iglesia.</li>
<li>Aplicar esta enseñanza a la vida diaria.</li>
<li>Crecer en virtud y discipulado cristiano.</li>
</ul>
<p><strong>Versículo clave:</strong> Cf. {cic}</p>
<p><strong>Referencias del Catecismo:</strong> {cic}</p>

</section>

<section class="content">

<h3>Estructura sugerida de la clase</h3>

<table style="width:100%;border-collapse:collapse;font-size:.85rem;margin:16px 0">
<tr style="background:var(--gold-light)">
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Sección</th>
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Duración</th>
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Qué hace el catequista</th>
</tr>
<tr><td style="padding:8px;border:1px solid var(--border)">1. Gran Pregunta</td><td style="padding:8px;border:1px solid var(--border)">8 min</td><td style="padding:8px;border:1px solid var(--border)">Presentar la pregunta central.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">2. Contenido principal</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explicar la enseñanza moral.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Conexión bíblica</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Leer y comentar las Escrituras.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. Para Reflexionar</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Grupos pequeños, compartir.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Idea Fuerza</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Resumir y memorizar.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Cierre</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Oración y entregar trabajo.</td></tr>
</table>

</section>

<section class="content">

<h3>Notas para el catequista</h3>

<h4>Aspectos Doctrinales</h4>
<p>Asegúrate de enseñar conforme al Catecismo de la Iglesia Católica.</p>

<h4>Desafíos Comunes</h4>
<p>La enseñanza moral puede ser desafiante en la cultura contemporánea. Preséntala con caridad y claridad.</p>

<h4>Adaptación por edades</h4>
<ul>
<li>🌱 Semilla: Enfócate en elecciones morales básicas y consecuencias.</li>
<li>🌿 Brotes: Aborda la presión de pares y dilemas éticos.</li>
<li>🪴 Raíz: Conecta con decisiones de vida y elecciones vocacionales.</li>
<li>🌳 Árbol: Profundiza en la ética de las virtudes y la teología moral.</li>
</ul>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Imprimir Guía del Catequista</a>
</div>

</section>

</LessonLayout>
'''

# ES Moral Topics 23-27 (faltantes)
FILES_TO_CREATE = [
    # 23 guide (lesson y workbook ya existen)
    ("src/pages/es/moral/23-la-libertad-guide.astro", guide_es_template("La Libertad Humana", "CIC 1730-1748")),
    
    # 24 workbook + guide (lesson ya existe)
    ("src/pages/es/moral/24-la-conciencia-workbook.astro", workbook_es_template("La Conciencia Moral", "CIC 1749-1761")),
    ("src/pages/es/moral/24-la-conciencia-guide.astro", guide_es_template("La Conciencia Moral", "CIC 1749-1761")),
    
    # 25-27 completos
    ("src/pages/es/moral/25-las-virtudes.astro", lesson_es_template("Las Virtudes", "CIC 1762-1802", "1 Cor 13; Sab 8,7", "¿Cómo puedo crecer en bondad?", "Las virtudes dan forma a nuestro carácter y nos capacitan para vivir según la voluntad de Dios.")),
    ("src/pages/es/moral/25-las-virtudes-workbook.astro", workbook_es_template("Las Virtudes", "CIC 1762-1802")),
    ("src/pages/es/moral/25-las-virtudes-guide.astro", guide_es_template("Las Virtudes", "CIC 1762-1802")),
    
    ("src/pages/es/moral/26-el-pecado.astro", lesson_es_template("El Pecado", "CIC 1803-1845", "Gn 3; Rom 3,23; 1 Jn 1,8-9", "¿Por qué hacemos lo que sabemos que está mal?", "El pecado hiere nuestra relación con Dios, pero la misericordia siempre está disponible.")),
    ("src/pages/es/moral/26-el-pecado-workbook.astro", workbook_es_template("El Pecado", "CIC 1803-1845")),
    ("src/pages/es/moral/26-el-pecado-guide.astro", guide_es_template("El Pecado", "CIC 1803-1845")),
    
    ("src/pages/es/moral/27-la-justicia.astro", lesson_es_template("La Gracia y la Justificación", "CIC 1846-1876", "Rom 3,24; Ef 2,8-9", "¿Cómo somos hechos justos ante Dios?", "La gracia restaura nuestra relación con Dios y nos capacita para vivir como sus hijos.")),
    ("src/pages/es/moral/27-la-justicia-workbook.astro", workbook_es_template("La Gracia y la Justificación", "CIC 1846-1876")),
    ("src/pages/es/moral/27-la-justicia-guide.astro", guide_es_template("La Gracia y la Justificación", "CIC 1846-1876")),
]

def main():
    created = []
    skipped = []
    failed = []
    
    for filepath, content in FILES_TO_CREATE:
        full_path = os.path.join(BASE_DIR, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        if os.path.exists(full_path):
            skipped.append(filepath)
            continue
        
        try:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            created.append(filepath)
            print(f"CREATED: {filepath}")
        except Exception as e:
            failed.append((filepath, str(e)))
            print(f"FAILED: {filepath} - {e}")
    
    print(f"\n=== SUMMARY ===")
    print(f"Created: {len(created)}")
    print(f"Skipped (exists): {len(skipped)}")
    print(f"Failed: {len(failed)}")
    
    return len(failed) == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
