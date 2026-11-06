# latest.yml lets copies of the old Electron build (1.x) update themselves to this version.
import base64, datetime, hashlib, os, sys
version, path = sys.argv[1], sys.argv[2]
data = open(path, 'rb').read()
sha = base64.b64encode(hashlib.sha512(data).digest()).decode()
name = os.path.basename(path)
date = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
print(f"version: {version}\nfiles:\n  - url: {name}\n    sha512: {sha}\n    size: {len(data)}\npath: {name}\nsha512: {sha}\nreleaseDate: '{date}'")
