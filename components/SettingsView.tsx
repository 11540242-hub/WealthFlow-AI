import React from 'react';
import { Terminal, Cloud, Database, Github } from 'lucide-react';

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">System Settings & Deployment Guide</h2>
        <p className="text-slate-500">How to deploy this app to GitHub Pages with Firebase.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
        
        {/* Step 1: GitHub */}
        <div className="flex gap-4">
            <div className="p-3 bg-slate-100 rounded-lg h-fit">
                <Github className="w-6 h-6 text-slate-700" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">1. GitHub Pages Deployment</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   This application is built with React. To deploy to GitHub Pages:
                </p>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg mt-3 font-mono text-sm overflow-x-auto">
                    <p># 1. Install gh-pages</p>
                    <p className="text-emerald-400">npm install gh-pages --save-dev</p>
                    <p className="mt-2"># 2. Add to package.json</p>
                    <p className="text-emerald-400">"homepage": "https://username.github.io/repo-name",</p>
                    <p className="text-emerald-400">"scripts": &#123; "deploy": "gh-pages -d build" &#125;</p>
                    <p className="mt-2"># 3. Deploy</p>
                    <p className="text-emerald-400">npm run build</p>
                    <p className="text-emerald-400">npm run deploy</p>
                </div>
            </div>
        </div>

        <div className="h-px bg-slate-100 w-full my-4"></div>

        {/* Step 2: Firebase */}
        <div className="flex gap-4">
            <div className="p-3 bg-orange-100 rounded-lg h-fit">
                <Database className="w-6 h-6 text-orange-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">2. Firebase Integration</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   This app currently uses <b>LocalStorage</b> for the demo. To use Firebase Firestore:
                </p>
                <ol className="list-decimal list-inside mt-2 text-sm text-slate-600 space-y-1">
                    <li>Create a project at <a href="https://console.firebase.google.com" className="text-blue-600 underline">console.firebase.google.com</a>.</li>
                    <li>Enable <b>Firestore Database</b>.</li>
                    <li>Copy your web app configuration keys.</li>
                    <li>Create a <code>firebase.ts</code> file in your source code with the config.</li>
                    <li>Update <code>dataService.ts</code> to switch from LocalStorage to Firestore.</li>
                </ol>
                
                <div className="bg-slate-50 p-4 rounded-lg mt-3 border border-slate-200">
                    <p className="text-xs font-mono text-slate-500 mb-2">// services/firebase.ts structure</p>
                    <pre className="text-xs font-mono text-slate-700 overflow-x-auto">
{`import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);`}
                    </pre>
                </div>
            </div>
        </div>

        <div className="h-px bg-slate-100 w-full my-4"></div>

        {/* Step 3: API Keys */}
         <div className="flex gap-4">
            <div className="p-3 bg-blue-100 rounded-lg h-fit">
                <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h3 className="font-semibold text-lg text-slate-800">3. Gemini AI Configuration</h3>
                <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                   To enable the stock price updates and financial advice, ensure you provide the API Key in the environment.
                </p>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg mt-3 font-mono text-sm">
                    <p># .env file</p>
                    <p className="text-emerald-400">REACT_APP_GEMINI_API_KEY=your_key_here</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;
