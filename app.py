import os
import sys

# Get the base directory (root of project)
base_dir = os.path.dirname(os.path.abspath(__file__))
server_dir = os.path.join(base_dir, 'server')

# Add server directory to Python path
sys.path.insert(0, server_dir)

# Change to server directory so relative paths in util.py work correctly
os.chdir(server_dir)

# Import server module - need to use importlib since it's not a package
import importlib.util
server_path = os.path.join(server_dir, 'server.py')
spec = importlib.util.spec_from_file_location("server_module", server_path)
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

# Get the Flask app instance (artifacts are loaded in server.py)
app = server.app

# Export for Render/gunicorn
__all__ = ['app']

