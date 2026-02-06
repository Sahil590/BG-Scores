"""
Custom storage backend for Vercel Blob Storage using REST API
"""
import os
import mimetypes
import json
from django.core.files.storage import Storage
from django.core.files.base import File
from django.utils.deconstruct import deconstructible
from io import BytesIO
import requests


@deconstructible
class VercelBlobStorage(Storage):
    """
    Custom storage backend that uses Vercel Blob Storage via REST API
    """
    
    def __init__(self):
        self.token = os.environ.get('BLOB_READ_WRITE_TOKEN')
        if not self.token:
            raise ValueError("BLOB_READ_WRITE_TOKEN environment variable is required")
        self.api_url = 'https://blob.vercel-storage.com'
    
    def _save(self, name, content):
        """
        Save file to Vercel Blob Storage using REST API
        Returns the full URL of the uploaded blob
        """
        # Read content
        if hasattr(content, 'read'):
            file_content = content.read()
        else:
            file_content = content
        
        # Determine content type
        content_type = mimetypes.guess_type(name)[0] or 'application/octet-stream'
        
        # Upload to Vercel Blob using REST API
        try:
            # PUT request to upload the blob
            upload_url = f"{self.api_url}/{name}"
            headers = {
                'Authorization': f'Bearer {self.token}',
                'x-content-type': content_type,
                'x-add-random-suffix': '1',  # Prevents filename collisions
            }
            
            response = requests.put(
                upload_url,
                data=file_content,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            
            # Parse response to get the blob URL
            result = response.json()
            blob_url = result.get('url')
            
            if not blob_url:
                raise IOError("No URL returned from Vercel Blob")
            
            # Return the full URL to be saved in the database
            return blob_url
        except requests.exceptions.RequestException as e:
            raise IOError(f"Error uploading to Vercel Blob: {str(e)}")
    
    def _open(self, name, mode='rb'):
        """
        Open a file from Vercel Blob Storage
        """
        url = self.url(name)
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            return File(BytesIO(response.content), name=name)
        except requests.exceptions.RequestException as e:
            raise IOError(f"Error reading from Vercel Blob: {str(e)}")
    
    def delete(self, name):
        """
        Delete a file from Vercel Blob Storage
        name is the full URL in this implementation
        """
        if not name or not name.startswith('http'):
            return
        
        try:
            headers = {
                'Authorization': f'Bearer {self.token}',
            }
            # DELETE request to remove the blob
            response = requests.delete(
                name,
                headers=headers,
                timeout=10
            )
            # Don't raise on error, just log
            if response.status_code not in [200, 204, 404]:
                print(f"Error deleting from Vercel Blob: {response.status_code}")
        except requests.exceptions.RequestException as e:
            # Log the error but don't raise it
            print(f"Error deleting from Vercel Blob: {str(e)}")
    
    def exists(self, name):
        """
        Check if a file exists in Vercel Blob Storage
        """
        if not name:
            return False
        
        # name is the full URL, so check if it's accessible
        try:
            response = requests.head(name, timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False
    
    def url(self, name):
        """
        Return the URL for accessing the file
        name is already the full URL from Vercel Blob
        """
        if not name:
            return ''
        
        # If name is already a full URL, return it
        if name.startswith('http'):
            return name
        
        # Otherwise, return as is (shouldn't happen with Vercel Blob)
        return name
    
    def size(self, name):
        """
        Return the size of the file
        """
        if not name:
            return 0
        
        try:
            response = requests.head(name, timeout=5)
            return int(response.headers.get('Content-Length', 0))
        except requests.exceptions.RequestException:
            return 0
    
    def get_available_name(self, name, max_length=None):
        """
        Return a filename that's available in the storage mechanism
        Vercel Blob handles duplicate names automatically with x-add-random-suffix
        """
        return name
