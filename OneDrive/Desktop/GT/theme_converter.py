
import os

source_path = r"c:\Users\ssang\OneDrive\Desktop\GT\PPT5_updated.html"
target_path = r"c:\Users\ssang\OneDrive\Desktop\GT\PPT5_White.html"

with open(source_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS Variable Replacements
content = content.replace('--dark-bg: #0F172A;', '--dark-bg: #FFFFFF;')
content = content.replace('--card-bg: #1E293B;', '--card-bg: #F8FAFC;') # Light Slate 50
content = content.replace('--text-light: #F8FAFC;', '--text-light: #0F172A;') # Dark Slate 900
content = content.replace('--text-gray: #94A3B8;', '--text-gray: #475569;') # Darker Slate 600
content = content.replace('border-bottom: 1px solid rgba(255, 255, 255, 0.05);', 'border-bottom: 1px solid rgba(0, 0, 0, 0.1);')

# 2. General Style Adjustments
content = content.replace('rgba(255, 255, 255, 0.1)', 'rgba(0, 0, 0, 0.1)') # Generic borders
content = content.replace('rgba(255,255,255,0.05)', 'rgba(0,0,0,0.1)') # Chart Grid lines
content = content.replace('rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)') # Chart Grid lines variation

# 3. Javascript Usage Replacements
content = content.replace("Chart.defaults.color = '#94A3B8';", "Chart.defaults.color = '#475569';")
content = content.replace("textLight: '#F8FAFC'", "textLight: '#0F172A'")
content = content.replace("textGray: '#94A3B8'", "textGray: '#475569'")
content = content.replace("cardBg: '#1E293B'", "cardBg: '#F8FAFC'")
content = content.replace("darkBg: '#0F172A'", "darkBg: '#FFFFFF'")

# 4. Title Update
content = content.replace('<title>XYZ Mobiles India - Strategic Turnaround Blueprint</title>', '<title>XYZ Mobiles India - Strategic Turnaround (White Theme)</title>')

# 5. Fix Chart Tooltips (Dark tooltip on light chart is fine, but text needs to be readable if it defaults to system)
# Chart.js defaults for tooltips are usually black/dark gray background with white text, which works on white.
# However, let's explicitly set tooltip background to dark slate if needed.
# The previous code set tooltip background to: backgroundColor: colors.cardBg.
# In white mode, cardBg is white. We don't want white text on white bg.
content = content.replace('backgroundColor: colors.cardBg,', 'backgroundColor: "#1E293B",') # Force dark tooltip bg
# And title/body color was set to textLight/accentGold.
content = content.replace('bodyColor: colors.textLight,', 'bodyColor: "#F8FAFC",') # Force white text in tooltip

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Successfully created {target_path}")
