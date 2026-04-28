#!/usr/bin/env python3
"""
Generador completo de archivos .astro para Catecismo Digital
Genera todos los archivos faltantes de forma automática.
"""

import os
import sys

BASE_DIR = "/home/family/Dropbox/OpenClaw/workspace/catecismo-digital"

# Templates para cada tipo de archivo

def lesson_en_template(title, cic, scripture, big_question, sections_content, memory_verse, key_idea):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
const lessonRef = "{cic}";
const lessonScripture = "{scripture}";
---
<LessonLayout title="{title}" cic={{lessonRef}} scripture={{lessonScripture}}>

<section class="content">

<h2>Big Question</h2>

<p class="big-question">{big_question}</p>

<p>{sections_content.get("intro", "This lesson explores the richness of our Catholic faith.")}</p>

</section>

<section class="content">

<h2>Understanding the Mystery</h2>

<p>{sections_content.get("content1", "The Church teaches us through the Catechism.")}</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Activity</h4>
<p>Reflect on how this teaching applies to your daily life.</p>
</div>

</section>

<section class="content">

<h2>Biblical Foundation</h2>

<p>{sections_content.get("content2", "Sacred Scripture reveals God's plan for us.")}</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Connection</h4>
<p>Read the related passages and meditate on their meaning.</p>
</div>

</section>

<section class="content">

<h2>For Reflection</h2>

<ol>
<li>What does this teaching mean for your life right now?</li>
<li>How has your understanding changed after this lesson?</li>
<li>What concrete step can you take this week?</li>
<li>What gift of God have you discovered in this topic?</li>
<li>How can you share this with someone else?</li>
</ol>

</section>

<section class="content">

<h2>Key Idea</h2>

<div class="callout">
<p><strong>Key Idea:</strong> {key_idea}</p>
</div>

</section>

<section class="content">

<h2>Cultural Richness</h2>

<p>
<strong>Patristic Tradition:</strong> The Church Fathers have handed down this teaching through the ages.
</p>

<p>
<strong>Liturgical Celebration:</strong> The Church's worship expresses this mystery in the liturgical year.
</p>

</section>

</LessonLayout>
'''

def workbook_en_template(title, cic):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
---
<LessonLayout title="Workbook \u0026mdash; {title}" cic="{cic}" scripture="">

<section class="content">

<h2>Student Workbook</h2>
<p class="big-question">For use after class or in groups.</p>

<h3>Remembering the Essentials</h3>

<ol>
<li>What is the main teaching of this lesson?</li>
<li>How does this affect the life of a Christian?</li>
<li>What are the essential elements to remember?</li>
<li>How can we apply this teaching daily?</li>
<li>How does this connect to other teachings of the Church?</li>
</ol>

</section>

<section class="content">

<h3>For Reflection and Writing</h3>

<div class="question-block">
<p class="question-block__q">1. What obstacles prevent you from living this teaching more fully?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. How have you experienced God's grace in this area?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. Who could you share what you've learned with?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Practical Activities</h3>

<h4>A. Scripture Study</h4>
<p>Read the related passages and write a reflection.</p>

<h4>B. Share Your Faith</h4>
<p>Explain what you learned in this class to someone.</p>

</section>

<section class="content">

<h3>Scripture to Memorize</h3>

<div class="bible-passage">
<p>"The Lord is my shepherd, I shall not want."</p>
<p class="bible-passage__ref">\u0026mdash; Psalm 23:1</p>
</div>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Print Workbook</a>
</div>

</section>

</LessonLayout>
'''

def guide_en_template(title, cic):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
---
<LessonLayout title="Catechist Guide \u0026mdash; {title}" cic="{cic}" scripture="">

<section class="content">

<h2>Catechist Guide</h2>
<p class="big-question">For preparing and leading the class.</p>

<h3>Class Summary</h3>

<p><strong>Estimated Duration:</strong> 60 minutes</p>
<p><strong>Central Theme:</strong> {title}</p>
<p><strong>Objectives:</strong></p>
<ul>
<li>Understand the teaching of the Church on this topic.</li>
<li>Value its importance in Christian life.</li>
<li>Apply the teaching to daily life.</li>
</ul>
<p><strong>Key Verse:</strong> Cf. {cic}</p>
<p><strong>Catechism References:</strong> {cic}</p>

</section>

<section class="content">

<h3>Suggested Class Structure</h3>

<table style="width:100%;border-collapse:collapse;font-size:.85rem;margin:16px 0">
<tr style="background:var(--gold-light)">
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Section</th>
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Duration</th>
<th style="padding:8px;text-align:left;border:1px solid var(--border)">Catechist Actions</th>
</tr>
<tr><td style="padding:8px;border:1px solid var(--border)">1. Big Question</td><td style="padding:8px;border:1px solid var(--border)">8 min</td><td style="padding:8px;border:1px solid var(--border)">Present central question and motivate.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">2. Main Content</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explain doctrine with examples.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Biblical Connection</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Read and comment on Scripture passages.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. For Reflection</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Small groups, share in plenary.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Key Idea</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Summarize and memorize.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Closing</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Prayer and distribute workbooks.</td></tr>
</table>

</section>

<section class="content">

<h3>Notes for the Catechist</h3>

<h4>Doctrinal Points</h4>
<p>Ensure teaching follows the Catechism of the Catholic Church.</p>

<h4>Common Challenges</h4>
<p>Catechumens may have questions. Respond with patience and charity.</p>

<h4>Supplementary Resources</h4>
<ul>
<li>YouCat: Relevant questions</li>
<li>Compendium of the Catechism</li>
<li>Church documents</li>
</ul>

</section>

<section class="content">

<h3>Age-Specific Adaptations</h3>

<h4>🌱 Seed (children 7-12)</h4>
<p>Use concrete examples, stories, practical activities.</p>

<h4>🌿 Sprouts (teens 13-17)</h4>
<p>Connect with their experiences, answer questions, personal testimony.</p>

<h4>🪴 Root (adults new to faith)</h4>
<p>Deepen doctrine, provide historical context.</p>

<h4>🌳 Tree (formed adults)</h4>
<p>Patristics, systematic theology, practical applications.</p>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Print Catechist Guide</a>
</div>

</section>

</LessonLayout>
'''

# Definición de archivos faltantes

FILES_TO_CREATE = [
    # EN Sacraments 16-17
    ("src/pages/en/sacraments/16-reconciliation.astro", lesson_en_template("Penance and Reconciliation", "CCC 1420-1498", "2 Cor 5:17-20; Jn 20:19-23; Lk 15:11-32", "Can God forgive anything? Even what I did?", {}, "Receive the Holy Spirit", "God's mercy is infinite and always available.")),
    ("src/pages/en/sacraments/16-reconciliation-workbook.astro", workbook_en_template("Penance and Reconciliation", "CCC 1420-1498")),
    ("src/pages/en/sacraments/16-reconciliation-guide.astro", guide_en_template("Penance and Reconciliation", "CCC 1420-1498")),
    
    ("src/pages/en/sacraments/17-anointing.astro", lesson_en_template("Anointing of the Sick", "CCC 1499-1532", "Jas 5:14-15; Mk 6:12-13; Is 38", "Where is God when I suffer? Has He abandoned me?", {}, "The Lord will raise up the sick", "God is present in our suffering.")),
    ("src/pages/en/sacraments/17-anointing-workbook.astro", workbook_en_template("Anointing of the Sick", "CCC 1499-1532")),
    ("src/pages/en/sacraments/17-anointing-guide.astro", guide_en_template("Anointing of the Sick", "CCC 1499-1532")),
    
    # EN Sacraments 18-20
    ("src/pages/en/sacraments/18-holy-orders.astro", lesson_en_template("Holy Orders", "CCC 1533-1600", "Num 11:16-17; Jn 15:16; Heb 5:1-10", "Why do we need priests? Can't we go directly to God?", {}, "You did not choose me, but I chose you", "The priesthood serves God's people.")),
    ("src/pages/en/sacraments/18-holy-orders-workbook.astro", workbook_en_template("Holy Orders", "CCC 1533-1600")),
    ("src/pages/en/sacraments/18-holy-orders-guide.astro", guide_en_template("Holy Orders", "CCC 1533-1600")),
    
    ("src/pages/en/sacraments/19-matrimony.astro", lesson_en_template("Holy Matrimony", "CCC 1601-1666", "Gen 2:18-24; Mt 19:3-9; Eph 5:25-33", "Can human love reflect God's love?", {}, "What God has joined, let no one separate", "Marriage mirrors Christ's love for the Church.")),
    ("src/pages/en/sacraments/19-matrimony-workbook.astro", workbook_en_template("Holy Matrimony", "CCC 1601-1666")),
    ("src/pages/en/sacraments/19-matrimony-guide.astro", guide_en_template("Holy Matrimony", "CCC 1601-1666")),
    
    ("src/pages/en/sacraments/20-sacramentals.astro", lesson_en_template("Sacramentals and Popular Piety", "CCC 1667-1690", "Num 6:22-27; Deut 6:4-9", "Do the 'little things' of faith matter?", {}, "Bless and keep us", "Sacramentals sanctify daily life.")),
    ("src/pages/en/sacraments/20-sacramentals-workbook.astro", workbook_en_template("Sacramentals and Popular Piety", "CCC 1667-1690")),
    ("src/pages/en/sacraments/20-sacramentals-guide.astro", guide_en_template("Sacramentals and Popular Piety", "CCC 1667-1690")),
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
