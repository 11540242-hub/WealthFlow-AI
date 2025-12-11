import React from 'react';
import { Terminal, Cloud, Database, Github, Shield } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Deployment & Configuration Guide</h2>
        <p className="text-slate-500">Step-by-step guide to deploy on GitHub Pages with Firebase Database.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-8">
        
        {/* Step 1: Firebase Setup */}
        <div className="flex gap-4">
            <div className="p-3 bg-orange-100 rounded-lg h-fit">
                <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">1. Setup Firebase (Database)</h3>
                <div className="text-slate-600 mt-2 text-sm leading-relaxed space-y-2">
                    <p>1. Go to <a href="https://console.firebase.google.com" className="text-blue-600 underline" target="_blank">Firebase Console</a> and create a new project.</p>
                    <p>2. Navigate to <b>Build &gt; Firestore Database</b> and click "Create Database". Start in <b>Test mode</b> for development.</p>
                    <p>3. Go to Project Settings (gear icon) &gt; General &gt; "Your apps" &gt; Web app (<code>&lt;/&gt;</code>). Register app.</p>
                    <p>4. Create a file named <code>firebase.ts</code> in your project `src/services/` folder:</p>
                </div>
                
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg mt-3 font-mono text-xs overflow-x-auto">
<pre>{`// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Replace with keys from Firebase Console
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);`}</pre>
                </div>
            </div>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        {/* Step 2: GitHub Actions */}
        <div className="flex gap-4">
            <div className="p-3 bg-slate-100 rounded-lg h-fit">
                <Github className="w-6 h-6 text-slate-700" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">2. Deploy via GitHub Actions</h3>
                <p className="text-slate-600 mt-2 text-sm">
                   Automate deployment so every push to `main` updates your site.
                </p>
                
                <ol className="list-decimal list-inside mt-2 text-sm text-slate-600 space-y-1">
                    <li>In your repository, create <code>.github/workflows/deploy.yml</code>.</li>
                    <li>Paste the configuration below.</li>
                    <li><b>Important:</b> We use <code>dist</code> as the folder because Vite builds to dist.</li>
                </ol>

                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg mt-3 font-mono text-xs overflow-x-auto">
<pre>{`name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install and Build
        run: |
          npm install
          npm run build
        env:
          # If using Vite, prefixes should ideally be VITE_
          # But we can map secrets to what the app expects
          REACT_APP_GEMINI_API_KEY: \${{ secrets.REACT_APP_GEMINI_API_KEY }}
          REACT_APP_FIREBASE_API_KEY: \${{ secrets.REACT_APP_FIREBASE_API_KEY }}
          # Add other firebase secrets here...

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist # CHANGED: Vite outputs to 'dist', not 'build'
          branch: gh-pages`}</pre>
                </div>
            </div>
        </div>

        <div className="h-px bg-slate-100 w-full"></div>

        {/* Step 3: Secrets */}
         <div className="flex gap-4">
            <div className="p-3 bg-blue-100 rounded-lg h-fit">
                <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">3. Secure Your Keys</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   Never commit API keys to code. Use GitHub Secrets.
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-slate-600">
                    <li>Go to Repo Settings &gt; <b>Secrets and variables</b> &gt; <b>Actions</b>.</li>
                    <li>Click <b>New repository secret</b>.</li>
                    <li>Add <code>REACT_APP_GEMINI_API_KEY</code>.</li>
                    <li>Add <code>REACT_APP_FIREBASE_API_KEY</code>, etc.</li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;