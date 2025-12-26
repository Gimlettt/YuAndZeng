#!/usr/bin/env python3
"""
Simple icon generator for Chrome extension
Requires: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Pillow is not installed")
    print("Install it with: pip install Pillow")
    exit(1)

def create_icon(size, filename):
    """Create a simple gradient icon with a play symbol"""
    # Create image with gradient
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)

    # Draw gradient background (purple)
    for y in range(size):
        # Gradient from #667eea to #764ba2
        r = int(102 + (118 - 102) * y / size)
        g = int(126 + (75 - 126) * y / size)
        b = int(234 + (162 - 234) * y / size)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    # Draw circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin],
                 outline=(255, 255, 255, 200), width=max(1, size//32))

    # Draw play triangle
    triangle_margin = size // 3
    points = [
        (triangle_margin, triangle_margin),
        (triangle_margin, size - triangle_margin),
        (size - triangle_margin, size // 2)
    ]
    draw.polygon(points, fill=(255, 255, 255))

    # Save
    img.save(filename)
    print(f"Created {filename}")

# Generate all required sizes
sizes = [
    (16, 'icon16.png'),
    (48, 'icon48.png'),
    (128, 'icon128.png')
]

for size, filename in sizes:
    create_icon(size, filename)

print("\n✅ All icons generated successfully!")
print("You can now load the extension in Chrome.")
