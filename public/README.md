# PRANAYFLIX Media Assets Directory

Place your personal photos, videos, and custom audio files here.
If any file is missing, the web app will gracefully display an original dark gradient cinematic card with the title and "Coming soon".

### Directory Structure & Files:

1. **Hero & Video Poster**:
   - `/public/photos/hero.jpg` : Main banner photo of Pranay.
   - `/public/photos/video-poster.jpg` : Poster thumbnail for the main video trailer.

2. **Seasons (1 to 19)**:
   - Place photos in `/public/photos/seasons/`
   - Files: `01.jpg`, `02.jpg`, ... up to `19.jpg` (or edit paths in `src/content.js`).

3. **Friends' Episodes**:
   - Place photos in `/public/photos/friends/`
   - e.g. `friend01.jpg`, `friend02.jpg`, `friend03.jpg`, `friend04.jpg`.

4. **Janmesh Roida (Special Episode)**:
   - Place photos in `/public/photos/janmesh/`
   - e.g. `01.jpg`, `02.jpg`, `03.jpg`.

5. **Video Trailer**:
   - Place your main montage video at `/public/video/journey.mp4` (H.264 MP4, 720p/1080p).

6. **Audio**:
   - (Optional) `/public/audio/intro.mp3` - If omitted, the web app uses its built-in Web Audio API cinematic synth sting!

