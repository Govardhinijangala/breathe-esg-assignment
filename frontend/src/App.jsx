import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UploadCloud, RefreshCw, CheckCircle2, Leaf,
  AlertTriangle, XCircle, Clock, BarChart3
} from 'lucide-react'

const API_BASE = 'https://breathe-esg-assignment-zt17.onrender.com/api'

// ── Floating particle background ──────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => i)
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${140 + Math.random() * 60}, 70%, 60%)`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PENDING:  { icon: Clock,         color: 'text-amber-400',  bg: 'bg-amber-400/10  border-amber-400/30' },
  APPROVED: { icon: CheckCircle2,  color: 'text-emerald-400',bg: 'bg-emerald-400/10 border-emerald-400/30' },
  FAILED:   { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/30' },
  WARNING:  { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10  border-orange-400/30' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}>
      <Icon size={11} />
      {status}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
    >
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </motion.div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedFile, setSelectedFile]   = useState(null)
  const [sourceType, setSourceType]       = useState('SAP')
  const [records, setRecords]             = useState([])
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError]     = useState('')
  const [loading, setLoading]             = useState(false)
  const [approvingId, setApprovingId]     = useState(null)
  const [dragOver, setDragOver]           = useState(false)
  const fileInputRef = useRef()

  useEffect(() => { fetchRecords() }, [])

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/records/`)
      setRecords(res.data)
    } catch (e) { console.error(e) }
  }

  const handleUpload = async () => {
    if (!selectedFile) { alert('Pick a CSV file first.'); return }
    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('source_type', sourceType)
    setLoading(true); setUploadMessage(''); setUploadError('')
    try {
      const res = await axios.post(`${API_BASE}/upload/`, fd)
      setUploadMessage(res.data.message)
      setSelectedFile(null)
      fetchRecords()
    } catch {
      setUploadError('Upload failed. Check the file format.')
    } finally { setLoading(false) }
  }

  const handleApprove = async (id) => {
    setApprovingId(id)
    try {
      await axios.patch(`${API_BASE}/records/${id}/approve/`)
      fetchRecords()
    } catch (e) { console.error(e) }
    finally { setApprovingId(null) }
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) setSelectedFile(file)
  }

  // Stats derived from records
  const total    = records.length
  const approved = records.filter(r => r.status === 'APPROVED').length
  const pending  = records.filter(r => r.status === 'PENDING').length
  const failed   = records.filter(r => r.status === 'FAILED').length

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans relative">
      <Particles />

      {/* Gradient blobs */}
      <div className="fixed top-[-200px] left-[-200px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Leaf className="text-emerald-400" size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ESG Emission Tracker</h1>
            <p className="text-xs text-gray-400 mt-0.5">Upload, review and approve emission records</p>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total"    value={total}    color="text-white"         delay={0.1} />
          <StatCard label="Approved" value={approved} color="text-emerald-400"   delay={0.2} />
          <StatCard label="Pending"  value={pending}  color="text-amber-400"     delay={0.3} />
          <StatCard label="Failed"   value={failed}   color="text-red-400"       delay={0.4} />
        </div>

        {/* ── Upload card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-emerald-400" />
            <h2 className="font-semibold text-gray-200">Upload CSV</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Source type */}
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Source Type</label>
              <select
                value={sourceType}
                onChange={e => setSourceType(e.target.value)}
                className="w-full bg-[#0f1729] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/60 transition"
                style={{ colorScheme: 'dark' }}
              >
                <option value="SAP"     style={{ background: '#0f1729', color: '#fff' }}>SAP</option>
                <option value="UTILITY" style={{ background: '#0f1729', color: '#fff' }}>UTILITY</option>
                <option value="TRAVEL"  style={{ background: '#0f1729', color: '#fff' }}>TRAVEL</option>
              </select>
            </div>

            {/* Drop zone */}
            <div className="flex-[2]">
              <label className="text-xs text-gray-400 mb-1 block">CSV File</label>
              <motion.div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                animate={{ borderColor: dragOver ? '#34d399' : 'rgba(255,255,255,0.1)' }}
                className="cursor-pointer border-2 border-dashed rounded-xl px-4 py-4 flex items-center gap-3 transition-colors"
              >
                <UploadCloud size={20} className={dragOver ? 'text-emerald-400' : 'text-gray-500'} />
                <span className="text-sm text-gray-400">
                  {selectedFile ? selectedFile.name : 'Drop CSV here or click to browse'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => setSelectedFile(e.target.files[0])}
                />
              </motion.div>
            </div>
          </div>

          {/* Upload button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              >
                <RefreshCw size={16} />
              </motion.div>
            ) : <UploadCloud size={16} />}
            {loading ? 'Uploading…' : 'Upload CSV'}
          </motion.button>

          {/* Feedback */}
          <AnimatePresence>
            {uploadMessage && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 text-sm text-emerald-400 flex items-center gap-1"
              >
                <CheckCircle2 size={14} /> {uploadMessage}
              </motion.p>
            )}
            {uploadError && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-3 text-sm text-red-400 flex items-center gap-1"
              >
                <XCircle size={14} /> {uploadError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Records table ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-gray-200">Records</h2>
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={fetchRecords}
              className="text-gray-400 hover:text-emerald-400 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </motion.button>
          </div>

          {records.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <UploadCloud size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No records yet. Upload a CSV to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/10">
                    <th className="px-5 py-3 text-left">ID</th>
                    <th className="px-5 py-3 text-left">Company</th>
                    <th className="px-5 py-3 text-left">Source</th>
                    <th className="px-5 py-3 text-left">Raw Value</th>
                    <th className="px-5 py-3 text-left">Unit</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {records.map((record, i) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                        className="border-t border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-3 text-gray-500">#{record.id}</td>
                        <td className="px-5 py-3 font-medium text-gray-200">{record.company_name}</td>
                        <td className="px-5 py-3">
                          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-xs font-medium">
                            {record.source_type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-300 font-mono">{record.raw_value}</td>
                        <td className="px-5 py-3 text-gray-400">{record.unit}</td>
                        <td className="px-5 py-3"><StatusBadge status={record.status} /></td>
                        <td className="px-5 py-3">
                          {record.status !== 'APPROVED' ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleApprove(record.id)}
                              disabled={approvingId === record.id}
                              className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                            >
                              {approvingId === record.id ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}>
                                  <RefreshCw size={11} />
                                </motion.div>
                              ) : <CheckCircle2 size={11} />}
                              Approve
                            </motion.button>
                          ) : (
                            <span className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  )
}
