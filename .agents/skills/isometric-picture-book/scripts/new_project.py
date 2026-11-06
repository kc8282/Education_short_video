#!/usr/bin/env python3
"""CLI entry; generation is input-driven, never a sample-film template."""
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[4] / 'assets'))
from new_project_base import generate

if __name__ == '__main__':
    generate('isometric-picture-book', Path(__file__).resolve().parent.parent)
