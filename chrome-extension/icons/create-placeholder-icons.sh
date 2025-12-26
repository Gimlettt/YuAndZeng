#!/bin/bash
# Create simple placeholder PNG icons for quick testing
# These are minimal valid PNG files with a purple color

# 16x16 purple square
echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGklEQVR4nGNk+M+AHjD+J8TIqhiZGAYLHAAA
3ToD8QkLPwwAAAAASUVORK5CYII=" | base64 -d > icon16.png

# 48x48 purple square
echo "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAQklEQVR4nO3OMQ0AAAwCoP6/6VnBTQgk
VTyAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAwGYBEvED8bN2MQQAAAAASUVORK5CYII=" | base64 -d > icon48.png

# 128x128 purple square
echo "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAAAYklEQVR4nO3OMQ0AAAwDoM77t3YFBCCh
qmYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4RABmowHxBH8z8wAAAABJRU5ErkJggg==" | base64 -d > icon128.png

echo "✅ Placeholder icons created!"
echo "Note: These are simple purple squares for testing."
echo "For better icons, use generate-icons.html or generate-icons.py"
