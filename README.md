# Customization Guide - Drushtishree's Portfolio

Welcome to your new personal portfolio website! The project files have been created in this folder (`c:\Users\DRUSHTISHREE\Desktop\protfolio 1`). 

The website has a professional glassmorphism look, interactive particle backgrounds, animated skill meters, and clickable project popup details.

To make the portfolio truly yours, follow this simple checklist of inputs and customization edits:

---

## 1. Asset Files to Add
Add the following files directly inside this folder (`c:\Users\DRUSHTISHREE\Desktop\protfolio 1`):

1. **Your Profile Photo (`profile.jpg`)**
   * **Filename**: `profile.jpg`
   * **Usage**: This will replace the default stylized avatar on the landing screen.
   * **Tip**: For best results, use a high-quality vertical portrait or headshot. The CSS will automatically clip and frame it with a glowing neon border.

2. **Your Resume (`resume.pdf`)**
   * **Filename**: `resume.pdf`
   * **Usage**: When visitors click the "Download Resume" button, this is the document they will download.

3. **Your Self-Introduction Video (`intro.mp4`)**
   * **Filename**: `intro.mp4`
   * **Usage**: Once placed, the website will switch to playing your custom self-introduction video.
   * **Tip**: Keep the video short (30 to 60 seconds), introducing your name, college major, technical interests, and projects. 
   * **Fallback**: If you don't have a video ready, *no worries!* The site has a built-in interactive briefing system that plays animated audio waves and prints out your profile details like subtitles when clicked.

---

## 2. Personal Detail Customizations
You can open `index.html` in a text editor (like VS Code or Notepad) to edit your links and form settings:

* **Social Profiles (Lines 371-372)**:
  Replace the dummy links in `href="..."` with your actual LinkedIn and GitHub links:
  ```html
  <a href="https://linkedin.com/in/YOUR-USERNAME" target="_blank"...
  <a href="https://github.com/YOUR-USERNAME" target="_blank"...
  ```

* **Contact Form Submissions (Line 383)**:
  To make the contact form send emails to you directly, we recommend registering a free form handler at [Formspree](https://formspree.io) and replacing the placeholder action:
  ```html
  <form class="contact-form glass-card" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  ```

---

## 3. How to View Your Website
Double-click `index.html` in this folder to open the website directly in any web browser and watch the animations in action!
