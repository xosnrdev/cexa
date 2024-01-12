import sys
import json
import traceback

class PYRuntimeError(Exception):
    """A standardized error class for runtime errors."""

    def __init__(self, message, stack):
        self.language = 'Python'
        self.message = message
        self.stack = stack

if __name__ == "__main__":
    try:
        pass
    except Exception as e:
        error = PYRuntimeError(str(e), traceback.format_exc())
        print(json.dumps(error.__dict__))