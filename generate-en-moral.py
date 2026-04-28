#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 3: Moral (EN)
Temas 23-32 en inglés
"""

import os
import sys

BASE_DIR = "/home/family/Dropbox/OpenClaw/workspace/catecismo-digital"

def lesson_en_template(title, cic, scripture, big_question, key_idea):
    return f'''---
import LessonLayout from '../../../layouts/LessonLayout.astro';
const lessonRef = "{cic}";
const lessonScripture = "{scripture}";
---
<LessonLayout title="{title}" cic={{lessonRef}} scripture={{lessonScripture}}>

<section class="content">

<h2>Big Question</h2>

<p class="big-question">{big_question}</p>

<p>This lesson explores the moral teaching of the Catholic Church, helping us understand how to live as disciples of Christ in today's world.</p>

</section>

<section class="content">

<h2>Understanding the Teaching</h2>

<p>The Catechism of the Catholic Church provides clear guidance on how we are to live as followers of Christ. This teaching is not a burden but a path to true freedom and happiness.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Activity</h4>
<p>Consider how this moral teaching applies to decisions you face daily.</p>
</div>

</section>

<section class="content">

<h2>Biblical Foundation</h2>

<p>Sacred Scripture reveals God's plan for human flourishing. The moral law is not arbitrary but reflects the wisdom of the Creator who knows what leads to human happiness.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Connection</h4>
<p>Read the Scripture passages and reflect on how they illuminate this teaching.</p>
</div>

</section>

<section class="content">

<h2>For Reflection</h2>

<ol>
<li>How does this teaching challenge your current way of living?</li>
<li>What practical steps can you take to grow in this area?</li>
<li>How does grace assist us in living this moral teaching?</li>
<li>What obstacles do you face in living according to this teaching?</li>
<li>Who can support you in growing in this aspect of Christian life?</li>
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
<strong>Moral Tradition:</strong> The Church's moral teaching has been developed through centuries of reflection on Scripture and human experience.
</p>

<p>
<strong>Virtue Ethics:</strong> Catholic moral theology emphasizes virtue formation as essential for Christian living.
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
<p>"Blessed are the pure in heart, for they will see God."</p>
<p class="bible-passage__ref">\u0026mdash; Matthew 5:8</p>
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
<li>Understand the moral teaching of the Church.</li>
<li>Apply this teaching to daily life.</li>
<li>Grow in virtue and Christian discipleship.</li>
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
<tr><td style="padding:8px;border:1px solid var(--border)">1. Big Question</td><td style="padding:8px;border:1px solid var(--border)">8 min</td><td style="padding:8px;border:1px solid var(--border)">Present central question.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">2. Main Content</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explain moral teaching.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Biblical Connection</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Read and comment on Scripture.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. For Reflection</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Small groups discussion.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Key Idea</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Summarize and memorize.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Closing</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Prayer and distribute workbooks.</td></tr>
</table>

</section>

<section class="content">

<h3>Notes for the Catechist</h3>

<h4>Doctrinal Points</h4>
<p>Ensure teaching follows the Catechism of the Catholic Church.</p>

<h4>Common Challenges</h4>
<p>Moral teaching can be challenging in contemporary culture. Present with charity and clarity.</p>

<h4>Age-Specific Adaptations</h4>
<ul>
<li>🌱 Seed: Focus on basic moral choices and consequences.</li>
<li>🌿 Sprouts: Address peer pressure and ethical dilemmas.</li>
<li>🪴 Root: Connect to life decisions and vocational choices.</li>
<li>🌳 Tree: Deepen virtue ethics and moral theology.</li>
</ul>

</section>

<section class="content">

<hr />
<div class="downloads">
<a href="javascript:window.print()" class="download-btn">Print Catechist Guide</a>
</div>

</section>

</LessonLayout>
'''

# EN Moral Topics 23-32
FILES_TO_CREATE = [
    ("src/pages/en/moral/23-freedom.astro", lesson_en_template("Freedom", "CCC 1730-1748", "Gal 5:1; Jn 8:31-36; Gen 2:15-17", "What does it mean to be truly free?", "True freedom is choosing the good according to God's plan.")),
    ("src/pages/en/moral/23-freedom-workbook.astro", workbook_en_template("Freedom", "CCC 1730-1748")),
    ("src/pages/en/moral/23-freedom-guide.astro", guide_en_template("Freedom", "CCC 1730-1748")),
    
    ("src/pages/en/moral/24-conscience.astro", lesson_en_template("Conscience", "CCC 1749-1761", "Rom 2:14-16; 1 Tim 1:5", "What is the voice of God within me?", "Conscience is the inner sanctuary where we hear God's voice.")),
    ("src/pages/en/moral/24-conscience-workbook.astro", workbook_en_template("Conscience", "CCC 1749-1761")),
    ("src/pages/en/moral/24-conscience-guide.astro", guide_en_template("Conscience", "CCC 1749-1761")),
    
    ("src/pages/en/moral/25-virtues.astro", lesson_en_template("Virtues", "CCC 1762-1802", "1 Cor 13; Wis 8:7", "How can I grow in goodness?", "The virtues shape our character and enable us to live according to God's will.")),
    ("src/pages/en/moral/25-virtues-workbook.astro", workbook_en_template("Virtues", "CCC 1762-1802")),
    ("src/pages/en/moral/25-virtues-guide.astro", guide_en_template("Virtues", "CCC 1762-1802")),
    
    ("src/pages/en/moral/26-sin.astro", lesson_en_template("Sin", "CCC 1803-1845", "Gen 3; Rom 3:23; 1 Jn 1:8-9", "Why do we do what we know is wrong?", "Sin wounds our relationship with God, but mercy is always available.")),
    ("src/pages/en/moral/26-sin-workbook.astro", workbook_en_template("Sin", "CCC 1803-1845")),
    ("src/pages/en/moral/26-sin-guide.astro", guide_en_template("Sin", "CCC 1803-1845")),
    
    ("src/pages/en/moral/27-justice.astro", lesson_en_template("Grace and Justification", "CCC 1846-1876", "Rom 3:24; Eph 2:8-9", "How are we made right with God?", "Grace restores our relationship with God and empowers us to live as His children.")),
    ("src/pages/en/moral/27-justice-workbook.astro", workbook_en_template("Grace and Justification", "CCC 1846-1876")),
    ("src/pages/en/moral/27-justice-guide.astro", guide_en_template("Grace and Justification", "CCC 1846-1876")),
    
    ("src/pages/en/moral/28-respect.astro", lesson_en_template("The Moral Law", "CCC 1950-1986", "Deut 30:15-20; Rom 2:14-16", "Does God give us rules to follow?", "The moral law guides us to authentic freedom and happiness.")),
    ("src/pages/en/moral/28-respect-workbook.astro", workbook_en_template("The Moral Law", "CCC 1950-1986")),
    ("src/pages/en/moral/28-respect-guide.astro", guide_en_template("The Moral Law", "CCC 1950-1986")),
    
    ("src/pages/en/moral/29-truth.astro", lesson_en_template("Grace and Merit", "CCC 1987-2029", "Rom 8:28-30; Phil 2:12-13", "What is grace and how do we receive it?", "Grace is God's gift that enables us to share in His divine life.")),
    ("src/pages/en/moral/29-truth-workbook.astro", workbook_en_template("Grace and Merit", "CCC 1987-2029")),
    ("src/pages/en/moral/29-truth-guide.astro", guide_en_template("Grace and Merit", "CCC 1987-2029")),
    
    ("src/pages/en/moral/30-sexuality.astro", lesson_en_template("Human Sexuality", "CCC 2331-2400", "Gen 1:27-28; Mt 19:4-6", "What does the Church teach about human sexuality?", "Human sexuality is a gift ordered to the love of spouses and the transmission of life.")),
    ("src/pages/en/moral/30-sexuality-workbook.astro", workbook_en_template("Human Sexuality", "CCC 2331-2400")),
    ("src/pages/en/moral/30-sexuality-guide.astro", guide_en_template("Human Sexuality", "CCC 2331-2400")),
    
    ("src/pages/en/moral/31-work.astro", lesson_en_template("The Commandments I-III", "CCC 2052-2141", "Ex 20:1-11; Deut 5:6-15", "How do we love God above all things?", "The first three commandments teach us to love God with all our heart, soul, and mind.")),
    ("src/pages/en/moral/31-work-workbook.astro", workbook_en_template("The Commandments I-III", "CCC 2052-2141")),
    ("src/pages/en/moral/31-work-guide.astro", guide_en_template("The Commandments I-III", "CCC 2052-2141")),
    
    ("src/pages/en/moral/32-community.astro", lesson_en_template("The Commandments IV-X", "CCC 2142-2557", "Ex 20:12-17; Deut 5:16-21", "How do we love our neighbor?", "The last seven commandments guide us in loving our neighbor as ourselves.")),
    ("src/pages/en/moral/32-community-workbook.astro", workbook_en_template("The Commandments IV-X", "CCC 2142-2557")),
    ("src/pages/en/moral/32-community-guide.astro", guide_en_template("The Commandments IV-X", "CCC 2142-2557")),
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
