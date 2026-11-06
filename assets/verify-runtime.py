"""Same standalone project validator for the portable skills' generated templates."""
from pathlib import Path
if __name__ == '__main__':
    print('Generated projects use `node scripts/verify-project.mjs layout|strict|full`.')
    print('Layout only is not a rendered/approved film; all modes return mediaAccepted=false.')
