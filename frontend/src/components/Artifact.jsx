import { Code2, Copy, PanelRightClose, Rotate3D, Eye } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { easeInOut, motion } from "motion/react"
import Editor from '@monaco-editor/react';

function Artifact() {
  const { artifacts } = useSelector(state => state.message)
  const [collapse, setCollapse] = useState(false)
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  cosnt[copied, setCopied] = useState(false)

  if (artifacts.length == 0) return;
  const handleCopy = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)

  }

  const file = artifacts?.[0].files[activeFile]
  const htmlFile = artifacts?.[0]?.files?.find(f => f.name === "index.html")
  const cssFile = artifacts?.[0]?.files?.find(f => f.name === "style.css")
  const jsFile = artifacts?.[0]?.files?.find(f => f.name === "script.js")

  const previewPos = Boolean(htmlFile)

  const previewDoc = `
  
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    
    ${cssFile?.content || ""}
    
    </style>
</head>
<body>
  ${htmlFile?.content || ""}
    <script>  ${jsFile?.content || ""} </script>
</body>
</html>
  `

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase()
    if (name.endsWith(".cpp")) return "cpp";
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".c")) return "c";
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".json")) return "josn";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".java")) return "typescript";
    return "plaintext"
  }
  console.log(file)
  return (
    <motion.div
      initial={{ width: 400 }}
      animate={{ width: collapse ? 45 : 350 }}
      transition={{
        duration: 0.25,
        ease: easeInOut
      }}
      className='hidden lg:flex h-full border-l border-white/6 flex-col overflow-hidden shrink-0 w-50'>
      {!collapse ?

        <div className='flex flex-col h-full bg-[#33333d]'>
          <div className='h-14 px-4 flex shrink-0 items-center gap-3 border-b border-white/6 '>
            <button className='flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 
           hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent
           border-none cursor-pointer shrink-0
        ' onClick={() => setCollapse(true)}>
              <PanelRightClose size={16} />
            </button>
            <div className='flex items-center gap-2 flex-1 min-w-0'>
              <div className='flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border
            border-indigo-500/20 shrink-0'>
                <Code2 size={13} />
              </div>
              <div className='text-[13px] font-medium text-slate-200 truncate'>
                {artifacts?.[0]?.title}
              </div>
            </div>

            <div className='flex items-center gap-1 shrink-0'>
              <button className='
               flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 
           hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent
           border-none cursor-pointer shrink-0
               '>
                <Copy size={15} />
              </button>

            </div>
            {previewPos &&
              <div className='flex items-center gap-1 bg-white/4 border border-white/6 p-1 rounded-lg'>
                <button onClick={() => setTab("code")} className={`flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 
              ${tab === "code" ? "bg-indigo-500 text-white" : " text-slate-400 hover:text-slate-200"}
              `}>
                  <Code2 size={14} /> Code
                </button>

                <button onClick={() => setTab("preview")} className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 
              ${tab === "preview" ? "bg-indigo-500 text-white" : " text-slate-400 hover:text-slate-200"}
              `}>
                  <Eye size={14} /> Preview
                </button>
              </div>
            }
          </div>
          {tab == "code" &&
            <div className='h-auto flex border-b border-white/6 overflow-x-auto [scrollbar-none] [&::-webkit-scrollbar]:hidden shrink-0'>
              {
                artifacts[0]?.files?.map((f, index) => (
                  <button onClick={() => setActiveFile(index)} className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/5
                relative cursor-pointer bg-transparent ${activeFile === index ? "text-indigo-400" : "text-slate-400 hover:text-slate-300"}
                `}>
                    {f?.name}
                    {activeFile === index && <div className='absolute bottom-0 left-0 right-0 h-px bg-indigo-400 rounded-t-full' />}
                  </button>
                ))
              }
            </div>
          }
          <div className='flex-1 overflow-hidden'>
            {(tab == "preview" && previewPos) ?
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full h-full'
              >
                <iframe title='preview' srcDoc={previewDoc} sandbox='allow-scripts' className='w-full h-225 bg-white' />
              </motion.div> : <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full h-full'
              >
                <Editor theme='vs-dark'
                  language={detectLanguage(file?.name)}
                  value={file?.content}
                  options={{
                    readOnly: true, minimap: { enabled: false }, fontSize: 13, wordWrap: "on", automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 16 }, lineNumbers: "on",
                    renderLineHighlight: "none"
                  }}
                />
                <iframe title='preview' srcDoc={previewDoc} sandbox='allow-scripts' className='w-full h-full bg-white' />

              </motion.div>
            }
          </div>
        </div> : <div className='flex flex-col h-full bg-[#151619]'>
          <button className='flex items-center justify-center w-7 h-15 rounded-lg text-slate-500 
           hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent
           border-none cursor-pointer shrink-0
        ' onClick={() => setCollapse(false)}>
            <PanelRightClose size={16}
              style={{
                transform: "rotate(180deg)"
              }}
            />
          </button>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <div className='text-[10px] font-medium text-slate-600 tracking-widest uppercase  whitespace-nowrap'
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)"
              }}
            >
              {artifacts?.[0]?.title}
            </div>
          </div>
        </div>}
    </motion.div>
  )
}

export default Artifact