#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 4: Oración (ES)
Temas 36-37 en español
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

<p>Esta lección explora la rica tradición de la oración cristiana, invitándonos a una relación más profunda con Dios.</p>

</section>

<section class="content">

<h2>Comprendiendo la Oración</h2>

<p>La oración es la elevación de la mente y el corazón a Dios. Es un don de la gracia y una respuesta decidida de nuestra parte. El Catecismo enseña que la oración es a la vez contemplación y comunión con Dios.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Actividad</h4>
<p>¿Cuándo te resulta más natural acudir a Dios en oración? ¿Qué te atrae a la oración?</p>
</div>

</section>

<section class="content">

<h2>Fundamento Bíblico</h2>

<p>La Biblia está llena de oraciones: salmos de alabanza, lamentos de sufrimiento, clamores de auxilio y cantos de acción de gracias. El mismo Jesús nos enseñó a orar.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Conexión</h4>
<p>Lee los pasajes de las Escrituras y observa cómo los autores bíblicos se acercaban a Dios en oración.</p>
</div>

</section>

<section class="content">

<h2>Para Reflexionar</h2>

<ol>
<li>¿Cómo ha evolucionado tu vida de oración con el tiempo?</li>
<li>¿Qué obstáculos enfrentas para mantener una oración constante?</li>
<li>¿Cómo profundiza esta enseñanza tu comprensión de la oración?</li>
<li>¿Qué pasos prácticos puedes tomar para crecer en la oración?</li>
<li>¿Quién puede apoyarte en el desarrollo de una vida de oración más profunda?</li>
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
<strong>Tradición de Oración:</strong> La Iglesia ha desarrollado ricas tradiciones de oración: litúrgica, comunitaria, personal, contemplativa.
</p>

<p>
<strong>Santos de la Oración:</strong> A lo largo de la historia, hombres y mujeres santos nos han enseñado el camino de la oración mediante su ejemplo y escritos.
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
<li>¿Cuál es la enseñanza principal de esta lección sobre la oración?</li>
<li>¿Cómo afecta la oración nuestra relación con Dios?</li>
<li>¿Cuáles son los elementos esenciales para recordar?</li>
<li>¿Cómo podemos aplicar esta enseñanza a nuestra oración diaria?</li>
<li>¿Cómo se conecta esto con otros aspectos de la vida cristiana?</li>
</ol>

</section>

<section class="content">

<h3>Para reflexionar y escribir</h3>

<div class="question-block">
<p class="question-block__q">1. ¿Cuándo te resulta más fácil orar? ¿Cuándo es más difícil?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. ¿Cómo has experimentado la presencia de Dios en la oración?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. ¿Qué nueva perspectiva sobre la oración obtuviste de esta lección?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Actividades prácticas</h3>

<h4>A. Meditación de las Escrituras</h4>
<p>Lee y medita sobre los pasajes de las Escrituras, escribiendo tus reflexiones.</p>

<h4>B. Práctica de Oración</h4>
<p>Prueba una nueva forma de orar esta semana basada en lo que aprendiste.</p>

</section>

<section class="content">

<h3>Versículo para memorizar</h3>

<div class="bible-passage">
<p>«Señor, enséñanos a orar».</p>
<p class="bible-passage__ref">\u0026mdash; Lucas 11,1</p>
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
<li>Comprender este aspecto de la oración cristiana.</li>
<li>Desarrollar una vida de oración más rica.</li>
<li>Aplicar estas enseñanzas a la práctica diaria de oración.</li>
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
<tr><td style="padding:8px;border:1px solid var(--border)">2. Contenido principal</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explicar la enseñanza sobre la oración.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Conexión bíblica</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Leer y comentar las Escrituras.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. Para Reflexionar</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Grupos pequeños, compartir.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Idea Fuerza</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Resumir y memorizar.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Cierre</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Oración y entregar trabajo.</td></tr>
</table>

</section>

<section class="content">

<h3>Notas para el catequista</h3>

<h4>La Oración como Relación</h4>
<p>Enfatizar que la oración es primordialmente sobre la relación con Dios, no solo pedir cosas.</p>

<h4>Desafíos Comunes</h4>
<p>Muchos luchan con la distracción en la oración o sienten que "no pasa nada". Normaliza estas experiencias.</p>

<h4>Adaptación por edades</h4>
<ul>
<li>🌱 Semilla: Mantener la oración simple, usar imágenes concretas.</li>
<li>🌿 Brotes: Responder preguntas sobre la oración y la respuesta de Dios.</li>
<li>🪴 Raíz: Profundizar en el entendimiento de diferentes tradiciones de oración.</li>
<li>🌳 Árbol: Explorar la oración contemplativa y el misticismo.</li>
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

# ES Oración Temas 36-37
FILES_TO_CREATE = [
    ("src/pages/es/oracion/36-el-padre-nuestro.astro", lesson_es_template("El Padre Nuestro: Invocación", "CIC 2759-2800", "Mt 6,9-13; Lc 11,1-4", "¿Por qué Jesús nos enseñó esta oración específica?", "El Padre Nuestro es la oración que Cristo nos dio, resumiendo todo el Evangelio.")),
    ("src/pages/es/oracion/36-el-padre-nuestro-workbook.astro", workbook_es_template("El Padre Nuestro: Invocación", "CIC 2759-2800")),
    ("src/pages/es/oracion/36-el-padre-nuestro-guide.astro", guide_es_template("El Padre Nuestro: Invocación", "CIC 2759-2800")),
    
    ("src/pages/es/oracion/37-las-siete-peticiones.astro", lesson_es_template("Las Siete Peticiones", "CIC 2801-2865", "Mt 6,9-13", "¿Qué estamos pidiendo realmente en cada petición?", "Cada petición del Padre Nuestro expresa nuestras necesidades fundamentales y nuestros anhelos más profundos.")),
    ("src/pages/es/oracion/37-las-siete-peticiones-workbook.astro", workbook_es_template("Las Siete Peticiones", "CIC 2801-2865")),
    ("src/pages/es/oracion/37-las-siete-peticiones-guide.astro", guide_es_template("Las Siete Peticiones", "CIC 2801-2865")),
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
