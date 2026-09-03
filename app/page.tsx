'use client';

import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Crop,
  Crown,
  Download,
  Droplet,
  Eraser,
  FileImage,
  FileScan,
  FileText,
  Grid2X2,
  Highlighter,
  History,
  Home,
  ImageDown,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Link2,
  LockKeyhole,
  MessageSquareText,
  MoreHorizontal,
  MoveVertical,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  Plus,
  QrCode,
  ScanFace,
  ScanText,
  Scissors,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  SquarePen,
  SwatchBook,
  TextCursorInput,
  Trash2,
  Upload,
  UserRound,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Tab = 'home' | 'longshot' | 'tools' | 'templates' | 'profile';
type ToolId = 'redact' | 'ocr' | 'annotate' | 'idphoto' | 'watermark' | 'compress' | 'qrcode' | 'format';
type Theme = 'system' | 'light' | 'dark';
type Shot = { id: number; name: string; meta: string; url?: string; tone: string };

const navItems: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'longshot', label: '长截图', icon: PanelsTopLeft },
  { id: 'tools', label: '工具', icon: Grid2X2 },
  { id: 'templates', label: '模板', icon: LayoutTemplate },
  { id: 'profile', label: '我的', icon: UserRound },
];

const toolCards: Array<{ id: ToolId | 'longshot'; label: string; hint: string; icon: LucideIcon; color: string }> = [
  { id: 'longshot', label: '长截图', hint: '自动拼接', icon: PanelsTopLeft, color: 'blue' },
  { id: 'redact', label: '智能打码', hint: '隐私保护', icon: ShieldCheck, color: 'violet' },
  { id: 'ocr', label: 'OCR 识字', hint: '提取文字', icon: ScanText, color: 'mint' },
  { id: 'annotate', label: '标注图片', hint: '突出重点', icon: WandSparkles, color: 'orange' },
  { id: 'idphoto', label: '证件照', hint: '智能换底', icon: BadgeCheck, color: 'cyan' },
  { id: 'compress', label: '图片压缩', hint: '轻巧清晰', icon: ImageDown, color: 'slate' },
];

const toolGroups: Array<{ title: string; items: Array<{ id: ToolId; label: string; hint: string; icon: LucideIcon; color: string; pro?: boolean }> }> = [
  {
    title: '图像处理',
    items: [
      { id: 'redact', label: '智能打码', hint: '识别头像与敏感信息', icon: ShieldCheck, color: 'violet' },
      { id: 'ocr', label: 'OCR 识字', hint: '保留段落结构', icon: ScanText, color: 'mint' },
      { id: 'idphoto', label: '证件照', hint: '智能抠图换底', icon: BadgeCheck, color: 'blue' },
      { id: 'annotate', label: '图片标注', hint: '箭头、文字与高亮', icon: SquarePen, color: 'orange' },
    ],
  },
  {
    title: '实用工具',
    items: [
      { id: 'qrcode', label: '二维码', hint: '生成与识别', icon: QrCode, color: 'blue' },
      { id: 'compress', label: '图片压缩', hint: '减小体积，保持清晰', icon: ImageDown, color: 'mint' },
      { id: 'format', label: '格式转换', hint: 'JPG / PNG / WebP', icon: FileImage, color: 'violet', pro: true },
      { id: 'watermark', label: '添加水印', hint: '文字与图片水印', icon: Droplet, color: 'orange' },
    ],
  },
];

const demoShots: Shot[] = [
  { id: 1, name: 'IMG_0001.PNG', meta: '今天 09:41 · 1.2 MB', tone: 'sky' },
  { id: 2, name: 'IMG_0002.PNG', meta: '今天 09:41 · 1.1 MB', tone: 'indigo' },
  { id: 3, name: 'IMG_0003.PNG', meta: '今天 09:41 · 1.3 MB', tone: 'mint' },
  { id: 4, name: 'IMG_0004.PNG', meta: '今天 09:41 · 1.0 MB', tone: 'peach' },
];

const recent = [
  { name: '产品需求文档截图', meta: '今天 14:30 · 1.2 MB', color: 'blue' },
  { name: '聊天记录截图', meta: '今天 11:05 · 1.8 MB', color: 'violet' },
  { name: '订单详情截图', meta: '昨天 17:42 · 0.9 MB', color: 'orange' },
];

function AppLogo() {
  return (
    <div className="app-logo" aria-hidden="true">
      <span className="corner corner-a" />
      <span className="corner corner-b" />
      <Scissors size={27} strokeWidth={2.4} />
    </div>
  );
}

function ThemeSwitcher({ theme, onChange, compact = false }: { theme: Theme; onChange: (theme: Theme) => void; compact?: boolean }) {
  const options: Array<{ id: Theme; label: string; icon: LucideIcon }> = [
    { id: 'system', label: '自动', icon: Monitor },
    { id: 'light', label: '浅色', icon: Sun },
    { id: 'dark', label: '深色', icon: Moon },
  ];
  if (compact) {
    const currentIndex = options.findIndex((item) => item.id === theme);
    const current = options[currentIndex];
    const CurrentIcon = current.icon;
    const next = options[(currentIndex + 1) % options.length];
    return (
      <button className="theme-cycle" aria-label={`当前为${current.label}模式，切换到${next.label}模式`} onClick={() => onChange(next.id)}>
        <CurrentIcon size={18} />
      </button>
    );
  }
  return (
    <div className="theme-switcher" role="group" aria-label="外观模式">
      {options.map((option) => {
        const Icon = option.icon;
        return <button key={option.id} className={theme === option.id ? 'active' : ''} onClick={() => onChange(option.id)}><Icon size={15} /><span>{option.label}</span></button>;
      })}
    </div>
  );
}

function ScreenHeader({ title, subtitle, back, onBack, trailing }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void; trailing?: React.ReactNode }) {
  return (
    <header className="screen-header">
      <div className="screen-header-side">
        {back ? <button className="icon-button" aria-label="返回" onClick={onBack}><ArrowLeft size={21} /></button> : null}
      </div>
      <div className="screen-heading"><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>
      <div className="screen-header-side end">{trailing}</div>
    </header>
  );
}

function HomeScreen({ onNavigate, onOpenTool, notify, theme, onThemeChange }: { onNavigate: (tab: Tab) => void; onOpenTool: (id: ToolId) => void; notify: (message: string) => void; theme: Theme; onThemeChange: (theme: Theme) => void }) {
  return (
    <div className="screen-scroll home-screen">
      <header className="topbar">
        <div><span className="eyebrow">轻松截屏 · 高效处理</span><h1>截屏王</h1></div>
        <div className="top-actions">
          <button className="vip-pill" aria-label="打开会员中心" onClick={() => onNavigate('profile')}><Crown size={14} fill="currentColor" /> VIP</button>
          <ThemeSwitcher theme={theme} onChange={onThemeChange} compact />
          <button className="icon-button" aria-label="设置" onClick={() => notify('设置已准备好，前往「我的」查看')}><Settings size={21} /></button>
        </div>
      </header>

      <button className="hero-card" onClick={() => onNavigate('longshot')}>
        <span className="hero-orb hero-orb-one" /><span className="hero-orb hero-orb-two" />
        <span className="hero-copy">
          <span className="hero-kicker"><Sparkles size={15} /> 智能截屏助手</span>
          <strong>一键捕捉，精彩不遗漏</strong>
          <small>长截图、智能识别与图片编辑</small>
          <span className="hero-cta">开始处理 <span>→</span></span>
        </span>
        <span className="hero-visual"><AppLogo /></span>
      </button>

      <section className="section-block">
        <div className="section-title"><h2>常用工具</h2><button onClick={() => onNavigate('tools')}>全部工具 <span>›</span></button></div>
        <div className="tool-grid">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => tool.id === 'longshot' ? onNavigate('longshot') : onOpenTool(tool.id)}>
                <span className={`tool-icon ${tool.color}`}><Icon size={23} /></span>
                <span><strong>{tool.label}</strong><small>{tool.hint}</small></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-block recent-block">
        <div className="section-title"><h2>最近项目</h2><button onClick={() => notify('已展示最近 3 个项目')}>查看全部 <span>›</span></button></div>
        <div className="recent-card">
          {recent.map((item) => (
            <button className="recent-row" key={item.name} onClick={() => notify(`已打开「${item.name}」`)}>
              <span className={`doc-thumb ${item.color}`}><Images size={18} /></span>
              <span className="recent-copy"><strong>{item.name}</strong><small>{item.meta}</small></span>
              <MoreHorizontal size={18} />
            </button>
          ))}
        </div>
      </section>

      <button className="pro-banner" onClick={() => onNavigate('profile')}>
        <span className="pro-crown"><Crown size={23} fill="currentColor" /></span>
        <span><strong>解锁截屏王 Pro</strong><small>无限长截图 · 去水印 · 高清导出</small></span>
        <span className="pro-cta">立即开通</span>
      </button>
    </div>
  );
}

function ShotPreview({ shot, tall = false }: { shot: Shot; tall?: boolean }) {
  return (
    <span className={`shot-preview ${shot.tone} ${tall ? 'tall' : ''}`} style={shot.url ? { backgroundImage: `url(${shot.url})` } : undefined}>
      {!shot.url ? <><i /><i /><i /><b /></> : null}
    </span>
  );
}

function LongShotScreen({ notify }: { notify: (message: string) => void }) {
  const [shots, setShots] = useState<Shot[]>(demoShots);
  const [mode, setMode] = useState<'image' | 'recording'>('image');
  const [stitched, setStitched] = useState(false);
  const [quality, setQuality] = useState('高清');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const additions = Array.from(files).slice(0, 8).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      meta: `${(file.size / 1024 / 1024).toFixed(1)} MB · 本地图片`,
      url: URL.createObjectURL(file),
      tone: ['sky', 'indigo', 'mint', 'peach'][index % 4],
    }));
    setShots((current) => [...current, ...additions].slice(-8));
    notify(`已导入 ${additions.length} 张图片`);
  };

  if (stitched) {
    return (
      <div className="screen-scroll app-screen">
        <ScreenHeader title="导出长图" back onBack={() => setStitched(false)} trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
        <div className="result-status"><span><Check size={15} /></span><div><strong>拼接完成</strong><small>已自动消除重叠区域</small></div></div>
        <div className="long-result">{shots.map((shot) => <ShotPreview key={shot.id} shot={shot} tall />)}</div>
        <div className="settings-card compact">
          <label><span>导出尺寸</span><strong>1080px <ChevronRight size={15} /></strong></label>
          <label><span>输出质量</span><select value={quality} onChange={(event) => setQuality(event.target.value)}><option>高清</option><option>标准</option><option>超清 Pro</option></select></label>
          <label><span>文件信息</span><strong>PNG · {shots.length * 0.7 + 0.4} MB</strong></label>
        </div>
        <button className="primary-button" onClick={() => notify(`长图已按${quality}质量保存`)}><Download size={18} /> 保存长图</button>
        <div className="split-actions"><button onClick={() => notify('PDF 已生成')}><FileText size={17} /> 导出 PDF</button><button onClick={() => setStitched(false)}><SquarePen size={17} /> 继续编辑</button></div>
      </div>
    );
  }

  return (
    <div className="screen-scroll app-screen">
      <ScreenHeader title="长截图" subtitle="自动拼接，保持每一处清晰" trailing={<button className="icon-button" onClick={() => notify('长截图设置已打开')} aria-label="长截图设置"><Settings size={20} /></button>} />
      <div className="segmented-control">
        <button className={mode === 'image' ? 'active' : ''} onClick={() => setMode('image')}>添加截图</button>
        <button className={mode === 'recording' ? 'active' : ''} onClick={() => setMode('recording')}>录屏转长图</button>
      </div>
      <div className="inline-message"><Sparkles size={15} /><span>{mode === 'image' ? '按截图时间智能排序，自动检测重复区域' : '从录屏中自动提取关键画面并合成长图'}</span></div>

      <div className="section-title list-heading"><h2>已导入 {shots.length} 张截图</h2><button onClick={() => setShots([])}>清空</button></div>
      <div className="shot-list">
        {shots.map((shot, index) => (
          <div className="shot-row" key={shot.id}>
            <strong className="shot-index">{String(index + 1).padStart(2, '0')}</strong>
            <ShotPreview shot={shot} />
            <span className="shot-copy"><strong>{shot.name}</strong><small>{shot.meta}</small></span>
            <button aria-label={`删除 ${shot.name}`} onClick={() => setShots((current) => current.filter((item) => item.id !== shot.id))}><Trash2 size={16} /></button>
            <MoveVertical size={17} />
          </div>
        ))}
        {!shots.length ? <button className="empty-drop" onClick={() => inputRef.current?.click()}><Upload size={26} /><strong>导入截图开始拼接</strong><small>支持 JPG、PNG 与 WebP</small></button> : null}
      </div>
      <input ref={inputRef} className="visually-hidden" type="file" multiple accept="image/*" onChange={(event) => addFiles(event.target.files)} />
      <button className="secondary-button" onClick={() => inputRef.current?.click()}><Plus size={18} /> 继续添加</button>
      <button className="primary-button" disabled={shots.length < 2} onClick={() => { setStitched(true); notify('已智能识别并消除重叠区域'); }}><Sparkles size={18} /> 开始自动拼接</button>
    </div>
  );
}

function ToolsScreen({ onOpenTool }: { onOpenTool: (id: ToolId) => void }) {
  const [search, setSearch] = useState('');
  const matches = (label: string, hint: string) => `${label}${hint}`.toLowerCase().includes(search.trim().toLowerCase());
  return (
    <div className="screen-scroll app-screen">
      <ScreenHeader title="工具箱" subtitle="常用能力，一站完成" trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
      <label className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索工具" aria-label="搜索工具" />{search ? <button onClick={() => setSearch('')}>清除</button> : null}</label>
      {toolGroups.map((group) => {
        const items = group.items.filter((item) => matches(item.label, item.hint));
        if (!items.length) return null;
        return (
          <section className="section-block" key={group.title}>
            <div className="section-title"><h2>{group.title}</h2><span className="section-count">{items.length} 项</span></div>
            <div className="tool-list-card">
              {items.map((item) => {
                const Icon = item.icon;
                return <button key={item.id} onClick={() => onOpenTool(item.id)}><span className={`tool-icon ${item.color}`}><Icon size={22} /></span><span><strong>{item.label}</strong><small>{item.hint}</small></span>{item.pro ? <em>Pro</em> : null}<ChevronRight size={17} /></button>;
              })}
            </div>
          </section>
        );
      })}
      {search && !toolGroups.some((group) => group.items.some((item) => matches(item.label, item.hint))) ? <div className="empty-search"><Search size={25} /><strong>没有找到“{search}”</strong><small>换个关键词试试</small></div> : null}
    </div>
  );
}

function ImageInput({ onSelect }: { onSelect: (url: string) => void }) {
  return <label className="mini-upload"><Upload size={17} /><span>换一张本地图片</span><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(URL.createObjectURL(file)); }} /></label>;
}

function RedactTool({ notify }: { notify: (message: string) => void }) {
  const [method, setMethod] = useState('模糊');
  const [strength, setStrength] = useState(62);
  const [completed, setCompleted] = useState(false);
  return (
    <>
      <div className="detection-banner"><ShieldCheck size={17} /><strong>{completed ? '处理完成' : '已自动识别 4 处隐私内容'}</strong><button onClick={() => setCompleted(false)}>重新识别</button></div>
      <div className="chat-preview">
        <div className="chat-bubble left"><span className="avatar-mask" style={{ filter: method === '模糊' ? `blur(${strength / 12}px)` : undefined }} />周末一起去露营吧，地点我发你～</div>
        <div className="chat-bubble right">好呀，发我位置和联系方式吧</div>
        <div className="chat-bubble left">手机号：<b className={`redact-mark ${method}`}>138 8888 8888</b></div>
        <div className="location-card"><strong>大雁湖露营地</strong><small>广东省深圳市龙岗区大雁湖公园</small><span>◎</span></div>
        <div className={`qr-demo redact-mark ${method}`}><QrCode size={48} /></div>
      </div>
      <div className="editor-panel">
        <div className="method-tabs">{['模糊','马赛克','涂抹','色块'].map((item) => <button key={item} className={method === item ? 'active' : ''} onClick={() => setMethod(item)}>{item}</button>)}</div>
        <label className="range-row"><span>强度</span><input type="range" min="20" max="100" value={strength} onChange={(event) => setStrength(Number(event.target.value))} /><strong>{strength}%</strong></label>
        <button className="primary-button" onClick={() => { setCompleted(true); notify('全部隐私内容已安全打码'); }}><ShieldCheck size={18} /> 全部打码</button>
      </div>
    </>
  );
}

const ocrCopy = `人工智能发展趋势报告\n2026 年度\n\n一、概述\n人工智能正在全球范围内加速发展，已成为推动科技进步与产业变革的重要力量。\n\n二、关键趋势\n1. 大模型持续进化\n2. 应用场景加速落地\n3. 生态协同更加完善`;

function OcrTool({ notify }: { notify: (message: string) => void }) {
  const [result, setResult] = useState(false);
  const [language, setLanguage] = useState('自动检测（中英混合）');
  const [image, setImage] = useState('');
  return (
    <>
      <div className="segmented-control tool-segment"><button className="active">图片识别</button><button>批量识别</button></div>
      <label className="select-row"><span>识别语言</span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option>自动检测（中英混合）</option><option>简体中文</option><option>English</option><option>日本語</option></select></label>
      <div className={`document-preview ${result ? 'recognized' : ''}`} style={image ? { backgroundImage: `linear-gradient(rgba(255,255,255,.86), rgba(255,255,255,.86)), url(${image})` } : undefined}>
        {ocrCopy.split('\n').map((line, index) => <p key={index} className={line.includes('、') || /^\d\./.test(line) ? 'doc-title' : ''}>{line || ' '}</p>)}
        {result ? <><i className="scan-box b1" /><i className="scan-box b2" /><i className="scan-box b3" /></> : null}
      </div>
      <ImageInput onSelect={(url) => { setImage(url); setResult(false); notify('图片已导入'); }} />
      {result ? <div className="ocr-actions"><button onClick={() => { void navigator.clipboard?.writeText(ocrCopy); notify('识别文字已复制'); }}><Copy size={17} />复制</button><button onClick={() => notify('已导出 TXT 文档')}><FileText size={17} />导出 TXT</button><button onClick={() => notify('已导出 Markdown')}><Download size={17} />Markdown</button></div> : <button className="primary-button" onClick={() => { setResult(true); notify('识别完成，已保留文档结构'); }}><ScanText size={18} /> 开始识别</button>}
    </>
  );
}

function AnnotateTool({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState('箭头');
  const [color, setColor] = useState('#ff3b30');
  const [image, setImage] = useState('');
  return (
    <>
      <div className="annotation-canvas" style={image ? { backgroundImage: `url(${image})` } : undefined}>
        {!image ? <div className="mock-list">{recent.map((item, index) => <div key={item.name}><ShotPreview shot={demoShots[index]} /><span><strong>{item.name}</strong><small>{item.meta}</small></span></div>)}</div> : null}
        {mode === '箭头' ? <span className="annotation-arrow" style={{ color }}>↗</span> : null}
        {mode === '编号' ? <span className="annotation-number" style={{ background: color }}>1</span> : null}
        {mode === '高亮' ? <span className="annotation-highlight" style={{ background: color }} /> : null}
        {mode === '文字' ? <span className="annotation-text" style={{ color }}>重点信息</span> : null}
      </div>
      <ImageInput onSelect={(url) => { setImage(url); notify('图片已导入编辑器'); }} />
      <div className="editor-panel">
        <div className="annotation-tools">
          {[['箭头', ArrowRight], ['文字', TextCursorInput], ['编号', BadgeCheck], ['高亮', Highlighter], ['裁剪', Crop]].map(([label, ToolIcon]) => {
            const Icon = ToolIcon as LucideIcon;
            return <button key={label as string} className={mode === label ? 'active' : ''} onClick={() => setMode(label as string)}><Icon size={19} /><span>{label as string}</span></button>;
          })}
        </div>
        <div className="color-row">{['#ff3b30','#ff9500','#ffcc00','#16c779','#1765fa','#8b5cf6','#111827'].map((item) => <button aria-label={`选择颜色 ${item}`} key={item} className={color === item ? 'active' : ''} style={{ background:item }} onClick={() => setColor(item)} />)}</div>
        <button className="primary-button" onClick={() => notify('标注图片已保存')}><Download size={18} /> 保存图片</button>
      </div>
    </>
  );
}

function IdPhotoTool({ notify }: { notify: (message: string) => void }) {
  const [background, setBackground] = useState('#2675ee');
  const [size, setSize] = useState('一寸');
  const [image, setImage] = useState('');
  return (
    <>
      <div className="size-tabs">{['一寸','二寸','简历','考试'].map((item) => <button key={item} className={size === item ? 'active' : ''} onClick={() => setSize(item)}>{item}</button>)}</div>
      <div className="id-photo-stage" style={{ background }}>
        {image ? <img src={image} alt="已导入的证件照" /> : <div className="person-placeholder"><span className="head" /><span className="body" /></div>}
        <span className="face-guide" /><i className="eye-line" /><i className="chin-line" />
      </div>
      <div className="id-meta"><span><strong>{size}</strong><small>{size === '二寸' ? '35 × 49 mm' : '25 × 35 mm'}</small></span><button onClick={() => notify('支持自定义像素与毫米尺寸')}>更改 <ChevronRight size={15} /></button></div>
      <ImageInput onSelect={(url) => { setImage(url); notify('已智能识别人像'); }} />
      <div className="background-options">
        {[['白底','#f8fafc'],['蓝底','#2675ee'],['红底','#ef3340']].map(([label, value]) => <button key={label} className={background === value ? 'active' : ''} onClick={() => setBackground(value)}><span style={{ background:value }} />{label}</button>)}
      </div>
      <button className="primary-button" onClick={() => notify('证件照已生成并保存')}><Download size={18} /> 生成证件照</button>
    </>
  );
}

function GenericTool({ id, notify }: { id: ToolId; notify: (message: string) => void }) {
  const [value, setValue] = useState(76);
  const configs: Record<string, { icon: LucideIcon; title: string; hint: string }> = {
    compress: { icon: ImageDown, title: '智能压缩', hint: '预计节省 64% 存储空间' },
    qrcode: { icon: QrCode, title: '生成二维码', hint: '输入链接或文字，快速生成' },
    format: { icon: FileImage, title: '格式转换', hint: '支持 JPG、PNG 与 WebP' },
    watermark: { icon: Droplet, title: '添加水印', hint: '用文字保护原创内容' },
  };
  const config = configs[id] ?? configs.compress;
  const Icon = config.icon;
  return (
    <div className="generic-tool">
      <span className="generic-icon"><Icon size={40} /></span><h2>{config.title}</h2><p>{config.hint}</p>
      <label className="generic-input"><span>{id === 'qrcode' ? '内容' : id === 'watermark' ? '水印文字' : '输出设置'}</span><input defaultValue={id === 'qrcode' ? 'https://example.com' : id === 'watermark' ? '截屏王原创' : '自动优化'} /></label>
      <label className="range-row"><span>{id === 'compress' ? '清晰度' : '强度'}</span><input type="range" value={value} onChange={(event) => setValue(Number(event.target.value))} /><strong>{value}%</strong></label>
      <button className="primary-button" onClick={() => notify(`${config.title}处理完成`)}><Sparkles size={18} /> 开始处理</button>
    </div>
  );
}

function ToolDetail({ id, onBack, notify }: { id: ToolId; onBack: () => void; notify: (message: string) => void }) {
  const titles: Record<ToolId, string> = { redact:'智能打码', ocr:'OCR 识字', annotate:'标注图片', idphoto:'证件照', watermark:'添加水印', compress:'图片压缩', qrcode:'二维码', format:'格式转换' };
  return (
    <div className="screen-scroll app-screen detail-screen">
      <ScreenHeader title={titles[id]} back onBack={onBack} trailing={<button className="icon-button" onClick={() => notify('工具设置已打开')} aria-label="工具设置"><Settings size={20} /></button>} />
      {id === 'redact' ? <RedactTool notify={notify} /> : id === 'ocr' ? <OcrTool notify={notify} /> : id === 'annotate' ? <AnnotateTool notify={notify} /> : id === 'idphoto' ? <IdPhotoTool notify={notify} /> : <GenericTool id={id} notify={notify} />}
    </div>
  );
}

const templateThemes = [
  { id:'daily', title:'日常记录', subtitle:'生活碎片 / 灵感时刻', tone:'sunset', cells:4 },
  { id:'tutorial', title:'教程步骤', subtitle:'清晰编号 / 快速分享', tone:'blueprint', cells:3 },
  { id:'feedback', title:'问题反馈', subtitle:'重点标记 / 高效沟通', tone:'minty', cells:4 },
  { id:'resume', title:'简历长图', subtitle:'结构排版 / 专业表达', tone:'violet', cells:2 },
  { id:'story', title:'小红书封面', subtitle:'吸睛标题 / 社交适配', tone:'coral', cells:3 },
  { id:'id', title:'证件照排版', subtitle:'一键生成 / 高清打印', tone:'sky', cells:6 },
];

function TemplateArt({ template, spacing = 4, radius = 7 }: { template: (typeof templateThemes)[number]; spacing?: number; radius?: number }) {
  return <div className={`template-art ${template.tone}`} style={{ gap:spacing }}><strong>{template.title}</strong><span>{template.subtitle}</span><div className={`template-cells cells-${template.cells}`}>{Array.from({ length: template.cells }, (_, index) => <i key={index} style={{ borderRadius:radius }}><b /><em /></i>)}</div></div>;
}

function TemplatesScreen({ onSelect }: { onSelect: (id: string) => void }) {
  const [filter, setFilter] = useState('热门');
  return (
    <div className="screen-scroll app-screen">
      <ScreenHeader title="模板中心" subtitle="选好版式，只需替换内容" trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
      <div className="filter-pills">{['热门','教程','社交','反馈','证件照'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="section-title template-title"><h2>{filter}精选</h2><span className="section-count">持续更新</span></div>
      <div className="template-grid">{templateThemes.map((template) => <button key={template.id} onClick={() => onSelect(template.id)}><TemplateArt template={template} /><span><strong>{template.title}</strong><small>1080 × {template.cells > 4 ? '1920' : '1350'}</small></span>{template.id !== 'daily' ? <em>VIP</em> : null}</button>)}</div>
    </div>
  );
}

function TemplateEditor({ id, onBack, notify }: { id: string; onBack: () => void; notify: (message: string) => void }) {
  const template = templateThemes.find((item) => item.id === id) ?? templateThemes[0];
  const [ratio, setRatio] = useState('1:1');
  const [spacing, setSpacing] = useState(5);
  const [radius, setRadius] = useState(9);
  const [saved, setSaved] = useState(false);
  return (
    <div className="screen-scroll app-screen detail-screen">
      <ScreenHeader title={saved ? '预览与分享' : '拼图编辑'} back onBack={onBack} trailing={<button className="text-action" onClick={() => { setSaved(true); notify('拼图已生成'); }}>{saved ? '完成' : '保存'}</button>} />
      <div className={`collage-preview ratio-${ratio.replace(':','-')}`}><TemplateArt template={template} spacing={spacing} radius={radius} /></div>
      {saved ? <>
        <div className="share-panel"><h3>快速分享</h3><div><button onClick={() => notify('已复制图片')}><Copy size={19} />复制</button><button onClick={() => notify('分享面板已打开')}><Share2 size={19} />分享</button><button onClick={() => notify('链接已复制')}><Link2 size={19} />链接</button><button onClick={() => notify('图片已保存')}><Download size={19} />保存</button></div></div>
        <button className="primary-button orange-button" onClick={() => { setSaved(false); notify('已套用同款模板'); }}><LayoutTemplate size={18} /> 套用模板</button>
      </> : <div className="editor-panel collage-controls">
        <span className="control-label">布局比例</span><div className="ratio-tabs">{['1:1','4:3','3:4','16:9'].map((item) => <button key={item} className={ratio === item ? 'active' : ''} onClick={() => setRatio(item)}>{item}</button>)}</div>
        <label className="range-row"><span>间距</span><input type="range" min="0" max="16" value={spacing} onChange={(event) => setSpacing(Number(event.target.value))} /><strong>{spacing}px</strong></label>
        <label className="range-row"><span>圆角</span><input type="range" min="0" max="22" value={radius} onChange={(event) => setRadius(Number(event.target.value))} /><strong>{radius}px</strong></label>
        <button className="primary-button" onClick={() => { setSaved(true); notify('拼图已生成'); }}><Sparkles size={18} /> 生成预览</button>
      </div>}
    </div>
  );
}

function ProfileScreen({ notify, theme, onThemeChange }: { notify: (message: string) => void; theme: Theme; onThemeChange: (theme: Theme) => void }) {
  const [billing, setBilling] = useState<'year' | 'month'>('year');
  const [subscribed, setSubscribed] = useState(false);
  const menu = [
    ['历史记录','查看我的截屏历史',History],['我的模板','管理收藏和草稿',LayoutGrid],['我的证件照','管理证件照',BadgeCheck],['Mac 端互传','跨设备管理截屏',Share2],
  ] as Array<[string,string,LucideIcon]>;
  return (
    <div className="screen-scroll app-screen profile-screen">
      <ScreenHeader title="我的" trailing={<button className="icon-button" onClick={() => notify('设置中心已打开')} aria-label="设置"><Settings size={20} /></button>} />
      <div className="profile-card"><div className="profile-avatar"><UserRound size={31} /></div><span><strong>截屏小能手</strong><small>ID: 12345678 · {subscribed ? 'Pro 会员' : '普通会员'}</small></span><button onClick={() => notify('个人资料可编辑')}>编辑</button></div>
      <div className="stats-card"><span><strong>128</strong><small>截屏总数</small></span><span><strong>36</strong><small>编辑图片</small></span><span><strong>12</strong><small>我的模板</small></span></div>
      <div className="profile-menu">{menu.map(([title,hint,Icon]) => <button key={title} onClick={() => notify(`${title}已打开`)}><span><Icon size={18} /></span><span><strong>{title}</strong><small>{hint}</small></span><ChevronRight size={16} /></button>)}</div>
      <section className="appearance-card">
        <div><span><Palette size={18} /></span><span><strong>外观</strong><small>跟随系统，或选择浅色与深色模式</small></span></div>
        <ThemeSwitcher theme={theme} onChange={(value) => { onThemeChange(value); notify(`已切换为${value === 'system' ? '自动' : value === 'light' ? '浅色' : '深色'}模式`); }} />
      </section>
      <section className="membership-card"><div className="member-head"><span className="pro-crown"><Crown size={24} fill="currentColor" /></span><span><strong>{subscribed ? '已是 VIP 会员' : '成为 VIP 会员'}</strong><small>{subscribed ? '所有高级功能均已解锁' : '解锁全部高级功能'}</small></span></div>
        <div className="plan-options"><button className={billing === 'year' ? 'active' : ''} onClick={() => setBilling('year')}><span><strong>年度会员</strong><small>畅享所有 VIP 权益</small></span><b>38<small>元 / 年</small></b><i><Check size={12} /></i></button><button className={billing === 'month' ? 'active' : ''} onClick={() => setBilling('month')}><span><strong>月度会员</strong><small>灵活按月使用</small></span><b>18<small>元 / 月</small></b><i><Check size={12} /></i></button></div>
        <div className="benefits"><span><ShieldCheck size={17} />无限长截图</span><span><Eraser size={17} />智能去水印</span><span><FileScan size={17} />批量处理</span><span><CircleHelp size={17} />专属客服</span></div>
        <button className={`primary-button orange-button ${subscribed ? 'subscribed' : ''}`} onClick={() => { setSubscribed(true); notify(subscribed ? '会员权益已是最新状态' : '演示：VIP 权益已解锁'); }}><Crown size={18} fill="currentColor" /> {subscribed ? 'VIP 权益已解锁' : `确认订阅 ${billing === 'year' ? '38元 / 年' : '18元 / 月'}`}</button>
      </section>
      <div className="profile-links"><button onClick={() => notify('帮助与反馈已打开')}>帮助与反馈</button><span>·</span><button onClick={() => notify('隐私政策已打开')}>隐私政策</button><span>·</span><button onClick={() => notify('关于截屏王')}>关于我们</button></div>
    </div>
  );
}

type ModelContextLike = {
  registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => unknown }, options?: { signal: AbortSignal }) => void | Promise<void>;
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };
  const navigate = (tab: Tab) => { setActiveTool(null); setActiveTemplate(null); setActiveTab(tab); };
  const openTool = (id: ToolId) => { setActiveTemplate(null); setActiveTab('tools'); setActiveTool(id); };

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = window.localStorage.getItem('screenshot-king-theme');
    if (savedTheme === 'system' || savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
    setSystemDark(media.matches);
    const syncSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', syncSystemTheme);
    return () => media.removeEventListener('change', syncSystemTheme);
  }, []);

  useEffect(() => {
    const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    window.localStorage.setItem('screenshot-king-theme', theme);
  }, [theme, systemDark]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ModelContextLike['registerTool']>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* Unsupported preview context. */ }
    };
    register({
      name: 'navigate_screenshot_king', title: '打开截屏王模块', description: '切换到首页、长截图、工具、模板或我的页面。',
      inputSchema: { type:'object', properties:{ tab:{ type:'string', enum:navItems.map((item) => item.id) } }, required:['tab'], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute(input) { const tab = (input as { tab?: string }).tab; if (!navItems.some((item) => item.id === tab)) throw new Error('未知模块'); navigate(tab as Tab); return { activeTab:tab }; },
    });
    register({
      name: 'start_screenshot_tool', title: '打开图片处理工具', description: '直接打开智能打码、OCR、标注、证件照、压缩等工具。',
      inputSchema: { type:'object', properties:{ tool:{ type:'string', enum:toolGroups.flatMap((group) => group.items.map((item) => item.id)) } }, required:['tool'], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute(input) { const tool = (input as { tool?: string }).tool; const exists = toolGroups.some((group) => group.items.some((item) => item.id === tool)); if (!exists) throw new Error('未知工具'); openTool(tool as ToolId); return { activeTool:tool }; },
    });
    register({
      name: 'set_screenshot_king_appearance', title: '设置截屏王外观', description: '将界面设置为自动、浅色或深色模式。',
      inputSchema: { type:'object', properties:{ theme:{ type:'string', enum:['system','light','dark'] } }, required:['theme'], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute(input) { const selectedTheme = (input as { theme?: string }).theme; if (selectedTheme !== 'system' && selectedTheme !== 'light' && selectedTheme !== 'dark') throw new Error('未知外观模式'); setTheme(selectedTheme); return { theme:selectedTheme }; },
    });
    return () => lifecycle.abort();
  }, []);

  let screen: React.ReactNode;
  if (activeTool) screen = <ToolDetail key={activeTool} id={activeTool} onBack={() => setActiveTool(null)} notify={notify} />;
  else if (activeTemplate) screen = <TemplateEditor id={activeTemplate} onBack={() => setActiveTemplate(null)} notify={notify} />;
  else if (activeTab === 'home') screen = <HomeScreen onNavigate={navigate} onOpenTool={openTool} notify={notify} theme={theme} onThemeChange={setTheme} />;
  else if (activeTab === 'longshot') screen = <LongShotScreen notify={notify} />;
  else if (activeTab === 'tools') screen = <ToolsScreen onOpenTool={openTool} />;
  else if (activeTab === 'templates') screen = <TemplatesScreen onSelect={setActiveTemplate} />;
  else screen = <ProfileScreen notify={notify} theme={theme} onThemeChange={setTheme} />;

  const showNav = !activeTool && !activeTemplate;
  return (
    <main className="site-shell">
      <section className="brand-panel" aria-label="产品介绍">
        <div className="brand-top"><div className="brand-lockup"><AppLogo /><span><strong>截屏王</strong><small>Screenshot King</small></span></div><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
        <div className="brand-copy"><span className="brand-tag">交互设计原型 · 2026</span><h2>让每一次截屏，<br />都成为<span>清晰表达。</span></h2><p>从捕捉、识别到编辑与分享，所有高频图片任务都在一个轻盈流畅的工作流里完成。</p></div>
        <div className="feature-chips"><span><FileScan size={16} /> 智能识别</span><span><LockKeyhole size={16} /> 隐私保护</span><span><Images size={16} /> 本地处理</span></div>
      </section>
      <section className="device-stage">
        <div className="device-glow" />
        <div className="phone-shell">
          <div className="phone-screen">
            <div className="statusbar"><strong>9:41</strong><span className="dynamic-island" /><span className="signal">● ●◔ ▰</span></div>
            <div className={`page-area ${showNav ? '' : 'full'}`}>{screen}</div>
            {showNav ? <nav className="bottom-nav" aria-label="主导航">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={activeTab === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={21} /><span>{item.label}</span></button>; })}</nav> : null}
            {toast ? <output className="toast" aria-live="polite"><Check size={15} />{toast}</output> : null}
            <span className="home-indicator" />
          </div>
        </div>
        <p className="stage-hint">可点击、可上传、可编辑 · 真实交互原型</p>
      </section>
    </main>
  );
}
