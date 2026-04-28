#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital
Parte 2: Sacramentos Temas 17-20 ES+EN
Parte 3: Moral Temas 24-32 ES+EN (23 ya existe)
Parte 4: Oración Temas 35-37 EN (35-36 ES ya existe)
"""

import os

BASE_DIR = "/home/family/Dropbox/OpenClaw/workspace/catecismo-digital"

# Templates simplificados para cada tipo de archivo

def lesson_es_template(title, cic, scripture, big_question, intro, sections, memory_verse, idea_fuerza):
    sections_html = "\n\n".join([
        f'''<section class="content">

<h2>{s["title"]}</h2>

{s["content"]}

</section>''' for s in sections
    ])
    
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
const lessonRef = "{cic}";
const lessonScripture = "{scripture}";
---
<LessonLayout title="{title}" cic={{lessonRef}} scripture={{lessonScripture}}>

<section class="content">

<h2>Gran Pregunta</h2>

<p class="big-question">{big_question}</p>

<p>
{intro}
</p>

</section>

{sections_html}

<section class="content">

<h2>Conexión Bíblica</h2>

<p>
{sections[0]["content"] if sections else ""}
</p>

</section>

<section class="content">

<h2>Para Reflexionar</h2>

<ol>
<li>¿Qué significa para ti este sacramento en tu vida?</li>
<li>¿Cómo ha cambiado tu comprensión después de esta clase?</li>
<li>¿Qué paso concreto puedes dar esta semana?</li>
<li>¿Qué don de Dios has descubierto en este tema?</li>
<li>¿Cómo puedes compartir esto con alguien más?</li>
</ol>

</section>

<section class="content">

<h2>Idea Fuerza</h2>

<div class="callout">
<p><strong>Idea Fuerza:</strong> {idea_fuerza}</p>
</div>

</section>

<section class="content">

<h2>Riqueza Cultural</h2>

<p>
<strong>Patrística:</strong> Los Padres de la Iglesia enseñaron que {title.lower()} es esencial para la vida cristiana.
</p>

<p>
<strong>Liturgia:</strong> Las celebraciones litúrgicas reflejan esta doctrina a lo largo del año.
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
<li>¿Cuál es el significado de este sacramento?</li>
<li>¿Qué efectos produce en la vida del cristiano?</li>
<li>¿Cuáles son los elementos esenciales?</li>
<li>¿Cómo se prepara el creyente para recibirlo?</li>
<li>¿Qué relación tiene con los demás sacramentos?</li>
</ol>

</section>

<section class="content">

<h3>Para reflexionar y escribir</h3>

<div class="question-block">
<p class="question-block__q">1. ¿Qué te impide vivir más plenamente este sacramento?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. ¿Cómo has experimentado la gracia de Dios en este ámbito?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. ¿A quién podrías compartir lo que has aprendido?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Actividades prácticas</h3>

<h4>A. Estudio bíblico</h4>
<p>Lee los pasajes relacionados y escribe una reflexión.</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>

<h4>B. Compartir la fe</h4>
<p>Explica a alguien lo que aprendiste en esta clase.</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>

</section>

<section class="content">

<h3>Versículo para memorizar</h3>

<div class="bible-passage">
<p>«El Señor es mi pastor, nada me falta».</p>
<p class="bible-passage__ref">\u0026mdash; Salmo 23,1</p>
</div>

</section>

<section class="content">

<h3>Oración para esta semana</h3>

<blockquote>
<p>Señor, ayúdame a vivir más plenamente<br />
la gracia de este sacramento.<br />
Que mi fe crezca cada día<br />
y que pueda ser testigo de tu amor.<br />
Amén.</p>
</blockquote>

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
<li>Comprender el significado de este sacramento.</li>
<li>Valorar su importancia en la vida cristiana.</li>
<li>Aplicar la enseñanza a la vida diaria.</li>
</ul>
<p><strong>Versículo clave:</strong> Cf. CIC {cic}</p>
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
<tr>
<td style="padding:8px;border:1px solid var(--border)">1. Gran Pregunta</td>
<td style="padding:8px;border:1px solid var(--border)">8 min</td>
<td style="padding:8px;border:1px solid var(--border)">Presentar la pregunta central y motivar.</td>
</tr>
<tr>
<td style="padding:8px;border:1px solid var(--border)">2. Contenido principal</td>
<td style="padding:8px;border:1px solid var(--border)">15 min</td>
<td style="padding:8px;border:1px solid var(--border)">Explicar la doctrina con ejemplos.</td>
</tr>
<tr>
<td style="padding:8px;border:1px solid var(--border)">3. Conexión bíblica</td>
<td style="padding:8px;border:1px solid var(--border)">10 min</td>
<td style="padding:8px;border:1px solid var(--border)">Leer y comentar pasajes bíblicos.</td>
</tr>
<tr>
<td style="padding:8px;border:1px solid var(--border)">4. Para Reflexionar</td>
<td style="padding:8px;border:1px solid var(--border)">12 min</td>
<td style="padding:8px;border:1px solid var(--border)">Grupos pequeños, compartir.</td>
</tr>
<tr>
<td style="padding:8px;border:1px solid var(--border)">5. Idea Fuerza</td>
<td style="padding:8px;border:1px solid var(--border)">5 min</td>
<td style="padding:8px;border:1px solid var(--border)">Resumir y memorizar.</td>
</tr>
<tr>
<td style="padding:8px;border:1px solid var(--border)">6. Cierre</td>
<td style="padding:8px;border:1px solid var(--border)">10 min</td>
<td style="padding:8px;border:1px solid var(--border)">Oración y entregar trabajo.</td>
</tr>
</table>

</section>

<section class="content">

<h3>Notas para el catequista</h3>

<h4>Aspectos doctrinales</h4>
<p>Asegúrate de enseñar conforme al Catecismo de la Iglesia Católica.</p>

<h4>Desafíos comunes</h4>
<p>Los catecúmenos pueden tener dudas. Respóndeles con paciencia y caridad.</p>

<h4>Recursos complementarios</h4>
<ul>
<li>YouCat: Preguntas relevantes</li>
<li>Compendio del Catecismo</li>
<li>Documentos de la Iglesia</li>
</ul>

</section>

<section class="content">

<h3>Adaptación por edades</h3>

<h4>🌱 Semilla (niños 7-12)</h4>
<p>Usar ejemplos concretos, historias, actividades prácticas.</p>

<h4>🌿 Brotes (jóvenes 13-17)</h4>
<p>Conectar con sus experiencias, responder dudas, testimonio personal.</p>

<h4>🪴 Raíz (adultos nuevos en la fe)</h4>
<p>Profundizar en la doctrina, dar contexto histórico.</p>

<h4>🌳 Árbol (adultos formados)</h4>
<p>Patrística, teología sistemática, aplicaciones prácticas.</p>

</section>

<section class="content">

<h3>Preguntas difíciles</h3>

<h4>«¿Por qué la Iglesia enseña esto?»</h4>
<p>La enseñanza proviene de la Tradición apostólica y la Escritura.</p>

<h4>«¿Cómo se relaciona con mi vida?»</h4>
<p>El sacramento transforma y santifica nuestra vida cotidiana.</p>

</section>

<section class="content">

<h3>Oración del catequista</h3>

<blockquote>
<p>Señor, dame sabiduría para enseñar<br />
paciencia para escuchar<br />
y amor para acompañar<br />
a quienes me has confiado.<br />
Amén.</p>
</blockquote>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Imprimir Guía del Catequista</a>
</div>

</section>

</LessonLayout>
'''

# Definición de archivos a crear

FILES_TO_CREATE = [
    # Parte 2: Sacramentos ES Temas 17
    ("src/pages/es/sacramentos/17-la-uncion.astro", lesson_es_template("La Unción de los Enfermos", "CIC 1499-1532", "St 5,14-15; Mc 6,12-13; Is 38", "¿Dónde está Dios cuando sufro? ¿Me ha abandonado?", "Enfermedad y fe", [], "El Señor salvará al enfermo", "Dios está en nuestra enfermedad")),
    ("src/pages/es/sacramentos/17-la-uncion-workbook.astro", workbook_es_template("La Unción de los Enfermos", "CIC 1499-1532")),
    ("src/pages/es/sacramentos/17-la-uncion-guide.astro", guide_es_template("La Unción de los Enfermos", "CIC 1499-1532")),
    
    # Parte 2: Sacramentos EN Tema 13-17 (14-16 ya existen en parte)
    # Tema 13 ya existe, 14-16 necesitan EN
    # Parte 3: Moral ES Temas 24-32
    # Parte 3: Moral EN Temas 23-32
    # Parte 4: Oración EN Tema 35-37
]

def main():
    created = []
    failed = []
    
    for filepath, content in FILES_TO_CREATE:
        full_path = os.path.join(BASE_DIR, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Skip if file already exists
        if os.path.exists(full_path):
            print(f"SKIP (exists): {filepath}")
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
    print(f"Failed: {len(failed)}")
    
    if failed:
        print("\nFailed files:")
        for f, e in failed:
            print(f"  {f}: {e}")

if __name__ == "__main__":
    main()
