#!/usr/bin/env python3
"""
Generador de archivos .astro para Catecismo Digital - Parte 4: Prayer (EN)
Temas 35-37 en inglés
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

<p>This lesson explores the rich tradition of Christian prayer, inviting us into a deeper relationship with God.</p>

</section>

<section class="content">

<h2>Understanding Prayer</h2>

<p>Prayer is the raising of the mind and heart to God. It is a gift of grace and a determined response on our part. The Catechism teaches that prayer is both contemplation and communion with God.</p>

<div class="depth-box depth-box--semilla">
<h4 class="depth-box__title">Activity</h4>
<p>When do you most naturally turn to God in prayer? What draws you to prayer?</p>
</div>

</section>

<section class="content">

<h2>Biblical Foundation</h2>

<p>The Bible is filled with prayers: psalms of praise, laments of suffering, cries for help, and songs of thanksgiving. Jesus Himself taught us to pray.</p>

<div class="depth-box depth-box--brotes">
<h4 class="depth-box__title">Connection</h4>
<p>Read the Scripture passages and notice how the biblical authors approached God in prayer.</p>
</div>

</section>

<section class="content">

<h2>For Reflection</h2>

<ol>
<li>How has your prayer life developed over time?</li>
<li>What obstacles do you face in maintaining a consistent prayer life?</li>
<li>How does this teaching deepen your understanding of prayer?</li>
<li>What practical steps can you take to grow in prayer?</li>
<li>Who can support you in developing a deeper prayer life?</li>
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
<strong>Prayer Tradition:</strong> The Church has developed rich traditions of prayer: liturgical, communal, personal, contemplative.
</p>

<p>
<strong>Saints of Prayer:</strong> Throughout history, holy men and women have taught us the way of prayer through their example and writings.
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
<li>What is the main teaching of this lesson about prayer?</li>
<li>How does prayer affect our relationship with God?</li>
<li>What are the essential elements to remember?</li>
<li>How can we apply this teaching to our daily prayer?</li>
<li>How does this connect to other aspects of Christian life?</li>
</ol>

</section>

<section class="content">

<h3>For Reflection and Writing>/h3>

<div class="question-block">
<p class="question-block__q">1. When do you find it easiest to pray? When is it most difficult?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">2. How have you experienced God's presence in prayer?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

<div class="question-block">
<p class="question-block__q">3. What new insight about prayer did you gain from this lesson?</p>
<p style="border-bottom:1px solid var(--border);margin-bottom:8px">\u0026nbsp;</p>
</div>

</section>

<section class="content" id="activities">

<h3>Practical Activities</h3>

<h4>A. Scripture Meditation</h4>
<p>Read and meditate on the Scripture passages, writing your reflections.</p>

<h4>B. Prayer Practice</h4>
<p>Try a new way of praying this week based on what you learned.</p>

</section>

<section class="content">

<h3>Scripture to Memorize</h3>

<div class="bible-passage">
<p>"Lord, teach us to pray."</p>
<p class="bible-passage__ref">\u0026mdash; Luke 11:1</p>
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
<li>Understand this aspect of Christian prayer.</li>
<li>Develop a richer prayer life.</li>
<li>Apply these teachings to daily prayer practice.</li>
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
<tr><td style="padding:8px;border:1px solid var(--border)">2. Main Content</td><td style="padding:8px;border:1px solid var(--border)">15 min</td><td style="padding:8px;border:1px solid var(--border)">Explain prayer teaching.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">3. Biblical Connection</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Read and comment on Scripture.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">4. For Reflection</td><td style="padding:8px;border:1px solid var(--border)">12 min</td><td style="padding:8px;border:1px solid var(--border)">Small groups discussion.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">5. Key Idea</td><td style="padding:8px;border:1px solid var(--border)">5 min</td><td style="padding:8px;border:1px solid var(--border)">Summarize and memorize.</td></tr>
<tr><td style="padding:8px;border:1px solid var(--border)">6. Closing</td><td style="padding:8px;border:1px solid var(--border)">10 min</td><td style="padding:8px;border:1px solid var(--border)">Prayer and distribute workbooks.</td></tr>
</table>

</section>

<section class="content">

<h3>Notes for the Catechist</h3>

<h4>Prayer as Relationship</h4>
<p>Emphasize that prayer is primarily about relationship with God, not just asking for things.</p>

<h4>Common Challenges</h4>
<p>Many struggle with distraction in prayer or feeling that "nothing happens." Normalize these experiences.</p>

<h4>Age-Specific Adaptations</h4>
<ul>
<li>🌱 Seed: Keep prayer simple, use concrete imagery.</li>
<li>🌿 Sprouts: Address questions about prayer and God's response.</li>
<li>🪴 Root: Deepen understanding of different prayer traditions.</li>
<li>🌳 Tree: Explore contemplative prayer and mysticism.</li>
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

# EN Prayer Topics 35-37
FILES_TO_CREATE = [
    ("src/pages/en/prayer/35-the-contemplative-tradition.astro", lesson_en_template("The Contemplative Tradition", "CCC 2650-2719", "Ps 46:10; 1 Kgs 19:12; Lk 10:38-42", "Is prayer just talking to God, or is there a deeper way?", "Contemplative prayer is gazing on God in loving silence.")),
    ("src/pages/en/prayer/35-the-contemplative-tradition-workbook.astro", workbook_en_template("The Contemplative Tradition", "CCC 2650-2719")),
    ("src/pages/en/prayer/35-the-contemplative-tradition-guide.astro", guide_en_template("The Contemplative Tradition", "CCC 2650-2719")),
    
    ("src/pages/en/prayer/36-the-lords-prayer.astro", lesson_en_template("The Lord's Prayer", "CCC 2759-2800", "Mt 6:9-13; Lk 11:1-4", "Why did Jesus teach us this specific prayer?", "The Our Father is the prayer Christ gave us, summing up all the Gospel.")),
    ("src/pages/en/prayer/36-the-lords-prayer-workbook.astro", workbook_en_template("The Lord's Prayer", "CCC 2759-2800")),
    ("src/pages/en/prayer/36-the-lords-prayer-guide.astro", guide_en_template("The Lord's Prayer", "CCC 2759-2800")),
    
    ("src/pages/en/prayer/37-the-seven-petitions.astro", lesson_en_template("The Seven Petitions", "CCC 2801-2865", "Mt 6:9-13", "What are we really asking for in each petition?", "Each petition of the Our Father expresses our fundamental needs and deepest longings.")),
    ("src/pages/en/prayer/37-the-seven-petitions-workbook.astro", workbook_en_template("The Seven Petitions", "CCC 2801-2865")),
    ("src/pages/en/prayer/37-the-seven-petitions-guide.astro", guide_en_template("The Seven Petitions", "CCC 2801-2865")),
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
