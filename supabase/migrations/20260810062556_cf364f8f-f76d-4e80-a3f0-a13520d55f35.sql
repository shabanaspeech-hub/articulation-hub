CREATE POLICY "Public can read default therapist videos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'therapist-videos' AND (storage.foldername(name))[1] = 'defaults');