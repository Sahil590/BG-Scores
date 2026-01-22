import os
import requests
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.utils.deconstruct import deconstructible

@deconstructible
class VercelBlobStorage(Storage):
    def __init__(self, token=None):
        self.token = token or os.environ.get('BLOB_READ_WRITE_TOKEN')
        self.api_url = "https://blob.vercel-storage.com"

    def _open(self, name, mode='rb'):
        # For simplicity, we might just read from the URL if needed, 
        # but often Django opens files to read chunks.
        # This implementation mainly supports writing (uploading).
        # Reading would require fetching the file content.
        resp = requests.get(self.url(name))
        if resp.status_code == 200:
            return ContentFile(resp.content)
        raise FileNotFoundError(f"File {name} not found")

    def _save(self, name, content):
        if not self.token:
            raise Exception("BLOB_READ_WRITE_TOKEN is not set")
            
        headers = {
            "authorization": f"Bearer {self.token}",
            "x-add-random-suffix": "false" # Use Django's filename handling
        }
        # Vercel Blob PUT /<filename>
        # We need to use the put API.
        # Docs: PUT https://blob.vercel-storage.com/<path>
        
        # Ensure we are at the beginning of the file
        if hasattr(content, 'seek'):
            content.seek(0)
            
        file_data = content.read()
        
        response = requests.put(
            f"{self.api_url}/{name}",
            headers=headers,
            data=file_data
        )
        
        if response.status_code != 200:
             raise Exception(f"Vercel Blob Upload Failed: {response.text}")
             
        data = response.json()
        # Return the full URL or the path? Django expects the name saved.
        # Vercel might change the name if we didn't force it.
        # But we want to return the name relative to storage?
        # Vercel Blob returns a URL like https://.../filename
        # We can store the full URL or just the name if we reconstruct it.
        # Let's store the name we sent, assuming Vercel accepted it.
        return name

    def exists(self, name):
        # Checking existence requires a HEAD request or listing.
        # For performance, we can assume False and overwrite, 
        # or implement a HEAD check.
        # Vercel Blob operations usually allow overwriting or handle conflicts.
        response = requests.head(f"{self.api_url}/{name}")
        return response.status_code == 200

    def url(self, name):
        # If name is already a full URL (which happens sometimes), return it.
        if name.startswith('http'):
            return name
        # We can't easily guess the random suffix if Vercel added one,
        # but if we forced the name, we can guess.
        # However, the `put` response gave us the URL.
        # If we didn't save the URL in the DB (only the filename), we might lose access 
        # if Vercel changes the domain.
        # BUT, standard Django storage assumes base_url + name.
        # Vercel Blob URLs are unique per store.
        # We should probably configure a BASE_URL for the store.
        base_url = os.environ.get('BLOB_BASE_URL', '') # e.g. https://storeId.public.blob.vercel-storage.com
        return f"{base_url}/{name}"
