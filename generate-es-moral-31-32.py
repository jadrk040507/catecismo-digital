#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 3: Moral (ES)
Temas 31-32 en español (mandamientos)
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

<p>Esta lección explora los Mandamientos de Dios, que nos guían en el camino de la vida y el amor.</p>

</section>

<section class="content">

<h2>Los Mandamientos de Dios</h2>

<p>Los Diez Mandamientos son un don de Dios para su pueblo. No son restricciones arbitrarias, sino un camino hacia la verdadera libertad y felicidad. Como el amor de un padre que establece límites para proteger a sus hijos, Dios nos da mandamientos para protegernos del daño y guiarnos hacia la plenitud.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Actividad</h4>
<p>Reflexiona sobre cómo los límites establecidos por tus padres te han protegido. ¿Cómo te ayudan ahora?</p>
</div>

</section>

<section class="content">

<h2>Fundamento Bíblico</h2>

<p>Los Mandamientos fueron dados por Dios a Moisés en el Monte Sinaí, formando la base del pacto entre Dios y su pueblo. Jesús resumió toda la ley en el amor a Dios y al prójimo.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Conexión</h4>
<p>Lee los pasajes de las Escrituras y reflexiona sobre cómo Jesús interpreta y vivió los Mandamientos.</p>
</div>

</section>

<section class="content">

<h2>Para Reflexionar</h2>

<ol>
<li>¿Cómo cambia tu perspectiva si ves los Mandamientos como un don y no como restricciones?</li>
<li>¿Qué Mandamiento te resulta más difícil de seguir? ¿Por qué?</li>
<li>¿Cómo nos ayuda la gracia a vivir los Mandamientos?</li>
<li>¿Qué pasos concretos puedes tomar esta semana?</li>
<li>¿Cómo puedes ayudar a otros a entender los Mandamientos como camino de amor?</li>
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
<strong>Tradición de los Mandamientos:</strong> A lo largo de la historia, los santos han mostrado cómo vivir los Mandamientos con amor y alegría.
</p>

<p>
<strong>Catecismo:</strong> La Iglesia ha desarrollado profundas reflexiones sobre cada Mandamiento, mostrando su alcance espiritual.
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
<li>¿Cuáles son los Mandamientos tratados en esta lección?</li>
<li>¿Cómo nos protegen los Mandamientos?</li>
<li>¿Cuáles son las actitudes del corazón que subyacen a estos Mandamientos?</li>
<li>¿Cómo vivió Jesús estos Mandamientos?</li>
<li>¿Qué gracia nos ayuda a seguirlos?</li>
</ol>

</section>

<section class="content">

<h3>Para reflexionar y escribir</h3>

<div class="question-block">
<p class="question-block__q">1. ¿Cuál de estos Mandamientos te cuesta más seguir? ¿Por qué?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. ¿Cómo te ayuda la gracia de Dios en esta área?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. ¿A quién podrías compartir lo que has aprendido?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Actividades prácticas</h3>

<h4>A. Estudio de los Mandamientos</h4>
<p>Lee los Mandamientos en la Escritura y escribe tu reflexión.</p>

<h4>B. Compartir la fe</h4>
<p>Explica a alguien el propósito de estos Mandamientos.</p>

</section>

<section class="content">

<h3>Versículo para memorizar</h3>

<div class="bible-passage">
<p>«Ama al Señor tu Dios con todo tu corazón».</p>
<p class="bible-passage__ref">\u0026mdash; Deuteronomio 6,5</p>
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
<li>Comprender estos Mandamientos de Dios.</li>
<li>Descubrir cómo nos protegen y guían.</li>
<li>Aplicar estas enseñanzas a la vida diaria.</li>
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
<tr><td style="padding:8px;border:1px solid var(--border)">2. Contenido principal</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explicar los Mandamientos.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Conexión bíblica</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Leer y comentar las Escrituras.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. Para Reflexionar</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Grupos pequeños, compartir.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Idea Fuerza</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Resumir y memorizar.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Cierre</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Oración y entregar trabajo.</td></tr>
</table>

</section>

<section class="content">

<h3>Notas para el catequista</h3>

<h4>Los Mandamientos como Don</h4>
<p>Enfatiza que los Mandamientos son un don de amor, no restricciones arbitrarias. Son para nuestra protección y florecimiento.</p>

<h4>Desafíos Comunes</h4>
<p>Muchos ven los Mandamientos como limitaciones. Ayuda a descubrir cómo nos liberan para amar verdaderamente.</p>

<h4>Adaptación por edades</h4>
<ul>
<li>🌱 Semilla: Enfócate en el amor que subyace a los Mandamientos.</li>
<li>🌿 Brotes: Conecta con decisiones éticas diarias.</li>
<li>🪴 Raíz: Profundiza en el significado espiritual.</li>
<li>🌳 Árbol: Explora la tradición patrística sobre los Mandamientos.</li>
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

# ES Moral Topics 31-32 (mandamientos)
FILES_TO_CREATE = [
    ("src/pages/es/moral/31-el-trabajo.astro", lesson_es_template("Los Mandamientos I-III: Amar a Dios", "CIC 2052-2141", "Ex 20,1-11; Dt 5,6-15", "¿Cómo amamos a Dios sobre todas las cosas?", "Los primeros tres mandamientos nos enseñan a amar a Dios con todo nuestro ser.")),
    ("src/pages/es/moral/31-el-trabajo-workbook.astro", workbook_es_template("Los Mandamientos I-III", "CIC 2052-2141")),
    ("src/pages/es/moral/31-el-trabajo-guide.astro", guide_es_template("Los Mandamientos I-III", "CIC 2052-2141")),
    
    ("src/pages/es/moral/32-la-comunidad.astro", lesson_es_template("Los Mandamientos IV-X: Amar al Prójimo", "CIC 2142-2557", "Ex 20,12-17; Dt 5,16-21", "¿Cómo amamos a nuestro prójimo como a nosotros mismos?", "Los últimos siete mandamientos nos guían en el amor al prójimo.")),
    ("src/pages/es/moral/32-la-comunidad-workbook.astro", workbook_es_template("Los Mandamientos IV-X", "CIC 2142-2557")),
    ("src/pages/es/moral/32-la-comunidad-guide.astro", guide_es_template("Los Mandamientos IV-X", "CIC 2142-2557")),
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
