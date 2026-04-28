#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 2: Sacramentos (ES)
Temas 18-20 en español
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

<p>Esta lección explora el sacramento de {title.lower()}, su significado en la vida cristiana y su fundamento bíblico.</p>

</section>

<section class="content">

<h2>El Sacramento de {title}</h2>

<p>El Catecismo de la Iglesia Católica nos enseña que este sacramento es un don de Dios para su pueblo. No es una mera ceremonia, sino una realidad transformadora que configura al cristiano para una nueva manera de vivir.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Actividad</h4>
<p>Reflexiona sobre cómo este sacramento ha impactado tu vida o la de personas que conoces.</p>
</div>

</section>

<section class="content">

<h2>Fundamento Bíblico</h2>

<p>Las Sagradas Escrituras nos revelan el misterio de este sacramento y su importancia en el plan de salvación de Dios.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Conexión</h4>
<p>Lee los pasajes bíblicos relacionados y medita en su significado para tu vida.</p>
</div>

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
<p><strong>Idea Fuerza:</strong> {key_idea}</p>
</div>

</section>

<section class="content">

<h2>Riqueza Cultural</h2>

<p>
<strong>Tradición de la Iglesia:</strong> A lo largo de los siglos, los santos y doctores de la Iglesia han reflexionado profundamente sobre este sacramento.
</p>

<p>
<strong>Liturgia:</strong> La celebración litúrgica de este sacramento expresa su riqueza teológica y su significado para la vida cristiana.
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

<h4>A. Estudio bíblico</h4>
<p>Lee los pasajes relacionados y escribe una reflexión.</p>

<h4>B. Compartir la fe</h4>
<p>Explica a alguien lo que aprendiste en esta clase.</p>

</section>

<section class="content">

<h3>Versículo para memorizar</h3>

<div class="bible-passage">
<p>«El Señor es mi pastor, nada me falta».</p>
<p class="bible-passage__ref">\u0026mdash; Salmo 23,1</p>
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
<li>Comprender el significado de este sacramento.</li>
<li>Valorar su importancia en la vida cristiana.</li>
<li>Aplicar la enseñanza a la vida diaria.</li>
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
<tr><td style="padding:8px;border:1px solid var(--border)">1. Gran Pregunta</td><td style="padding:8px;border:1px solid var(--border)">8 min</td><td style="padding:8px;border:1px solid var(--border)">Presentar la pregunta central y motivar.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">2. Contenido principal</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explicar la doctrina con ejemplos.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Conexión bíblica</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Leer y comentar pasajes bíblicos.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. Para Reflexionar</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Grupos pequeños, compartir en plenario.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Idea Fuerza</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Resumir y memorizar.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Cierre</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Oración y entregar trabajo.</td></tr>
</table>

</section>

<section class="content">

<h3>Notas para el catequista</h3>

<h4>Aspectos doctrinales</h4>
<p>Asegúrate de enseñar conforme al Catecismo de la Iglesia Católica.</p>

<h4>Desafíos comunes</h4>
<p>Los catecúmenos pueden tener dudas. Respóndeles con paciencia y caridad.</p>

<h4>Adaptación por edades</h4>
<ul>
<li>🌱 Semilla: Usar ejemplos concretos, historias, actividades prácticas.</li>
<li>🌿 Brotes: Conectar con sus experiencias, responder dudas, testimonio personal.</li>
<li>🪴 Raíz: Profundizar en la doctrina, dar contexto histórico.</li>
<li>🌳 Árbol: Patrística, teología sistemática, aplicaciones prácticas.</li>
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

# ES Sacramentos Temas 18-20
FILES_TO_CREATE = [
    ("src/pages/es/sacramentos/18-el-orden.astro", lesson_es_template("El Orden Sagrado", "CIC 1533-1600", "Nm 11,16-17; Jn 15,16; Heb 5,1-10", "¿Por qué necesitamos sacerdotes? ¿No podemos ir directamente a Dios?", "El sacerdocio es un don de Dios para su pueblo, configurando al ministro como servidor de Cristo.")),
    ("src/pages/es/sacramentos/18-el-orden-workbook.astro", workbook_es_template("El Orden Sagrado", "CIC 1533-1600")),
    ("src/pages/es/sacramentos/18-el-orden-guide.astro", guide_es_template("El Orden Sagrado", "CIC 1533-1600")),
    
    ("src/pages/es/sacramentos/19-el-matrimonio.astro", lesson_es_template("El Matrimonio", "CIC 1601-1666", "Gn 2,18-24; Mt 19,3-9; Ef 5,25-33", "¿Puede el amor humano reflejar el amor de Dios?", "El matrimonio es un signo sacramental del amor fiel y fecundo de Cristo por su Iglesia.")),
    ("src/pages/es/sacramentos/19-el-matrimonio-workbook.astro", workbook_es_template("El Matrimonio", "CIC 1601-1666")),
    ("src/pages/es/sacramentos/19-el-matrimonio-guide.astro", guide_es_template("El Matrimonio", "CIC 1601-1666")),
    
    ("src/pages/es/sacramentos/20-la-comunion.astro", lesson_es_template("Sacramentales y Piedad Popular", "CIC 1667-1690", "Nm 6,22-27; Dt 6,4-9", "¿Importan las cosas «pequeñas» de la fe? ¿El agua bendita, el incienso, las imágenes?", "Los sacramentales santifican la vida cotidiana y nos preparan para recibir los sacramentos.")),
    ("src/pages/es/sacramentos/20-la-comunion-workbook.astro", workbook_es_template("Sacramentales y Piedad Popular", "CIC 1667-1690")),
    ("src/pages/es/sacramentos/20-la-comunion-guide.astro", guide_es_template("Sacramentales y Piedad Popular", "CIC 1667-1690")),
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
