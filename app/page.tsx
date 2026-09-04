'use client';

import {
  ArrowRight,
  BadgeCheck,
  BatteryMedium,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crop,
  Crown,
  Download,
  FileScan,
  FileText,
  Grid2X2,
  GripVertical,
  Highlighter,
  History,
  Home,
  ImagePlus,
  Images,
  LayoutGrid,
  LayoutTemplate,
  LoaderCircle,
  LockKeyhole,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  Plus,
  QrCode,
  Redo2,
  ScanText,
  Scissors,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  SquarePen,
  TextCursorInput,
  Trash2,
  Undo2,
  UserRound,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PhotoPicker, type PickedPhoto } from '@/components/photo-picker';

type Tab = 'home' | 'longshot' | 'tools' | 'profile';
type ToolId = 'redact' | 'ocr' | 'clean' | 'annotate' | 'compare' | 'idphoto' | 'qrcode' | 'export';
type Theme = 'system' | 'light' | 'dark';
type Shot = PickedPhoto;

const navItems: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'longshot', label: '长截图', icon: PanelsTopLeft },
  { id: 'tools', label: '工具', icon: Grid2X2 },
  { id: 'profile', label: '我的', icon: UserRound },
];

const toolGroups: Array<{ title: string; items: Array<{ id: ToolId; label: string; hint: string; icon: LucideIcon; color: string; pro?: boolean }> }> = [
  {
    title: '截图处理',
    items: [
      { id: 'redact', label: '智能打码', hint: '自动识别头像、号码和二维码', icon: ShieldCheck, color: 'violet' },
      { id: 'clean', label: '截图净化', hint: '清除状态栏、黑边和浮动控件', icon: Sparkles, color: 'blue' },
      { id: 'annotate', label: '图片标注', hint: '添加箭头、文字、编号和高亮', icon: SquarePen, color: 'orange' },
      { id: 'qrcode', label: '二维码工具', hint: '识别截图中的二维码，也可快速制作', icon: QrCode, color: 'mint' },
    ],
  },
  {
    title: '文档与画面',
    items: [
      { id: 'ocr', label: '文档扫描', hint: '把拍歪、偏暗的文档变清晰并提取文字', icon: ScanText, color: 'mint' },
      { id: 'compare', label: '图片对比', hint: '自动对齐并高亮两张图的差异', icon: Copy, color: 'violet', pro: true },
      { id: 'idphoto', label: '证件照', hint: '自动抠图、构图检查和标准尺寸', icon: BadgeCheck, color: 'blue' },
      { id: 'export', label: '导出中心', hint: '统一设置尺寸、格式、压缩和水印', icon: Download, color: 'orange' },
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
  { name: '产品需求文档截图', meta: '今天 14:30 · 1.2 MB', color: 'blue', tool: 'ocr' as ToolId },
  { name: '聊天记录截图', meta: '今天 11:05 · 1.8 MB', color: 'violet', tool: 'redact' as ToolId },
  { name: '订单详情截图', meta: '昨天 17:42 · 0.9 MB', color: 'orange', tool: 'annotate' as ToolId },
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

type ResultArtworkKind = ToolId | 'longshot' | 'ninegrid' | 'commerce';

function FocusCorners({ className = '' }: { className?: string }) {
  return <span className={`focus-corners ${className}`} aria-hidden="true"><i /><i /><i /><i /></span>;
}

function ResultArtwork({ kind }: { kind: ResultArtworkKind }) {
  const iconMap: Record<ResultArtworkKind, LucideIcon> = {
    longshot: PanelsTopLeft,
    redact: ShieldCheck,
    ocr: ScanText,
    clean: Sparkles,
    annotate: SquarePen,
    compare: Copy,
    idphoto: BadgeCheck,
    qrcode: QrCode,
    export: Download,
    ninegrid: Grid2X2,
    commerce: Images,
  };
  const Icon = iconMap[kind];
  return (
    <span className={`result-art result-art-${kind}`} aria-hidden="true">
      <span className="result-art-glow" />
      {kind === 'longshot' ? <FocusCorners className="result-focus" /> : null}
      {kind === 'longshot' ? <span className="art-longshot"><i /><i /><i /><em /><b>4 → 1</b></span> : null}
      {kind === 'redact' ? <span className="art-redact"><i /><i /><b /><i /><em /></span> : null}
      {kind === 'ocr' ? <span className="art-ocr"><i /><i /><i /><i /><b>TEXT</b></span> : null}
      {kind === 'clean' ? <span className="art-clean"><i /><i /><b /><em /><small>已清理 3 项</small></span> : null}
      {kind === 'annotate' ? <span className="art-annotate"><i /><i /><i /><b>↗</b><em>1</em></span> : null}
      {kind === 'compare' ? <span className="art-compare"><i /><i /><b /><em>3 处变化</em></span> : null}
      {kind === 'idphoto' ? <span className="art-idphoto"><i><UserRound size={22} /></i><i><UserRound size={22} /></i><i><UserRound size={22} /></i></span> : null}
      {kind === 'qrcode' ? <span className="art-qrcode"><QrCode size={52} /><b>扫码查看</b></span> : null}
      {kind === 'export' ? <span className="art-export"><i>4.8 MB</i><ArrowRight size={14} /><b>980 KB</b><em>PNG</em></span> : null}
      {kind === 'ninegrid' ? <span className="art-ninegrid">{Array.from({ length:9 }, (_, index) => <i key={index} />)}</span> : null}
      {kind === 'commerce' ? <span className="art-commerce"><i /><strong>今日精选</strong><small>轻巧 · 清晰 · 好看</small><b>¥ 99</b></span> : null}
      <span className="result-art-icon"><Icon size={15} /></span>
    </span>
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
    <fieldset className="theme-switcher" aria-label="外观模式">
      {options.map((option) => {
        const Icon = option.icon;
        return <button key={option.id} className={theme === option.id ? 'active' : ''} onClick={() => onChange(option.id)}><Icon size={15} /><span>{option.label}</span></button>;
      })}
    </fieldset>
  );
}

function useEdgeSwipeBack(onBack: () => void) {
  const touchStartX = useRef<number | null>(null);
  return {
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
      const x = event.changedTouches[0]?.clientX;
      touchStartX.current = typeof x === 'number' && x <= 28 ? x : null;
    },
    onTouchEnd: (event: React.TouchEvent<HTMLDivElement>) => {
      const startX = touchStartX.current;
      const endX = event.changedTouches[0]?.clientX;
      touchStartX.current = null;
      if (startX !== null && typeof endX === 'number' && endX - startX >= 72) onBack();
    },
    onTouchCancel: () => { touchStartX.current = null; },
  };
}

function ScreenHeader({ title, subtitle, back, onBack, trailing, large = false }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void; trailing?: React.ReactNode; large?: boolean }) {
  return (
    <header className={`screen-header ${large ? 'large-title' : ''}`}>
      <div className="screen-header-side">
        {back ? <button className="icon-button back-button" aria-label="返回" onClick={onBack}><ChevronLeft size={27} /></button> : null}
      </div>
      <div className="screen-heading"><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}</div>
      <div className="screen-header-side end">{trailing}</div>
    </header>
  );
}

function EditorHeader({ title, onBack, onUndo, onRedo, onDone, canUndo, canRedo }: { title: string; onBack: () => void; onUndo: () => void; onRedo: () => void; onDone: () => void; canUndo: boolean; canRedo: boolean }) {
  return (
    <header className="editor-header">
      <button className="icon-button back-button" aria-label="返回" onClick={onBack}><ChevronLeft size={27} /></button>
      <h1>{title}</h1>
      <div>
        <button className="icon-button" disabled={!canUndo} aria-label="撤销" onClick={onUndo}><Undo2 size={19} /></button>
        <button className="icon-button" disabled={!canRedo} aria-label="恢复" onClick={onRedo}><Redo2 size={19} /></button>
        <button className="editor-done" onClick={onDone}>完成</button>
      </div>
    </header>
  );
}

function HomeScreen({ onNavigate, onOpenTool, notify }: { onNavigate: (tab: Tab) => void; onOpenTool: (id: ToolId) => void; notify: (message: string) => void }) {
  const resumableProject = recent[0];

  return (
    <div className="screen-scroll home-screen">
      <header className="topbar">
        <h1>截屏王</h1>
        <div className="top-actions">
          <button className="icon-button" aria-label="设置" onClick={() => onNavigate('profile')}><Settings size={21} /></button>
        </div>
      </header>

      <section className="hero-card smart-task-card" aria-label="发现可处理的连续截图">
        <span className="hero-orb hero-orb-one" /><span className="hero-orb hero-orb-two" />
        <FocusCorners className="hero-focus" />
        <span className="hero-copy">
          <span className="hero-kicker"><Sparkles size={15} /> 智能发现</span>
          <strong>6 张截图，<br />可拼成 1 张长图</strong>
          <small>自动找到 5 处重叠 · 预计减少 38% 重复内容</small>
          <span className="hero-actions"><button onClick={() => onNavigate('longshot')}>预览长图</button><button onClick={() => notify('已保留这组截图')}>稍后处理</button></span>
        </span>
        <span className="hero-visual"><ResultArtwork kind="longshot" /><b className="hero-detected">已识别 6 张</b></span>
      </section>

      <section className="section-block home-recommendations">
        <div className="section-title"><h2>推荐处理</h2><button onClick={() => onNavigate('tools')}>全部工具 <span>›</span></button></div>
        <div className="home-feature-stack">
          <button className="home-redact-card" aria-label="打开智能打码" onClick={() => onOpenTool('redact')}>
            <span className="home-feature-copy">
              <span className="home-feature-heading"><span><ShieldCheck size={18} /></span><strong>智能打码</strong></span>
              <small>一键隐藏聊天截图中的隐私</small>
            </span>
            <span className="home-redact-comparison">
              <span className="home-compare-shot home-redact-before"><ResultArtwork kind="redact" /><small>处理前</small></span>
              <ArrowRight size={16} />
              <span className="home-compare-shot home-redact-after"><ResultArtwork kind="redact" /><small>处理后</small></span>
              <b>已识别 6 项</b>
            </span>
          </button>

          <div className="home-medium-grid">
            <button className="home-medium-card" aria-label="打开文档扫描" onClick={() => onOpenTool('ocr')}>
              <span className="home-medium-art home-ocr-art"><ResultArtwork kind="ocr" /><b>可复制文字</b></span>
              <span><strong>文档扫描</strong><small>清晰增强 + OCR</small></span>
            </button>
            <button className="home-medium-card" aria-label="打开截图净化" onClick={() => onOpenTool('clean')}>
              <span className="home-medium-art home-clean-pair">
                <span className="home-clean-before"><ResultArtwork kind="clean" /><i>前</i></span>
                <span className="home-clean-after"><ResultArtwork kind="clean" /><i>后</i></span>
              </span>
              <span><strong>截图净化</strong><small>去状态栏 · 黑边 · 浮层</small></span>
            </button>
          </div>

          <button className="home-annotation-row" aria-label="打开图片标注" onClick={() => onOpenTool('annotate')}>
            <span className="home-annotation-icon"><SquarePen size={19} /></span>
            <span><strong>图片标注</strong><small>箭头 · 编号 · 高亮</small></span>
            <span className="home-annotation-demo" aria-hidden="true"><i>1</i><b /><em>↗</em></span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {resumableProject ? (
        <section className="section-block home-continue-section">
          <div className="section-title"><h2>继续处理</h2><button onClick={() => onNavigate('profile')}>查看全部 <span>›</span></button></div>
          <button className="home-continue-card" onClick={() => onOpenTool(resumableProject.tool)}>
            <ResultArtwork kind={resumableProject.tool} />
            <span><strong>{resumableProject.name}</strong><small>文档扫描 · 今天 14:30</small></span>
            <b>继续 <ChevronRight size={14} /></b>
          </button>
        </section>
      ) : null}
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
  const [isStitching, setIsStitching] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [quality, setQuality] = useState('高清');
  const removeFixedBars = true;
  const smartSeam = true;
  const [draggedShotId, setDraggedShotId] = useState<number | null>(null);
  const [revealedShotId, setRevealedShotId] = useState<number | null>(null);
  const stitchTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);
  const touchOrigin = useRef<{ id: number; x: number; y: number } | null>(null);
  const leaveResult = () => { setStitched(false); setSaved(false); };
  const resultBackGesture = useEdgeSwipeBack(leaveResult);

  const addPhotos = (photos: PickedPhoto[]) => {
    const additions = photos.map((photo, index) => ({
      ...photo,
      id: Date.now() + index,
    }));
    setShots((current) => [...current, ...additions].slice(-8));
    setSaved(false);
    notify(`已导入 ${additions.length} 张图片`);
  };

  const moveShotTo = (draggedId: number, targetId: number) => {
    if (draggedId === targetId) return;
    setShots((current) => {
      const from = current.findIndex((item) => item.id === draggedId);
      const to = current.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return current;
      const reordered = [...current];
      const [moved] = reordered.splice(from, 1);
      reordered.splice(to, 0, moved);
      return reordered;
    });
  };

  const beginTouchSort = (shot: Shot, event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchOrigin.current = { id: shot.id, x: touch.clientX, y: touch.clientY };
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setDraggedShotId(shot.id);
      setRevealedShotId(null);
      notify('拖动截图调整顺序');
    }, 380);
  };

  const updateTouchSort = (event: React.TouchEvent<HTMLDivElement>) => {
    const origin = touchOrigin.current;
    const touch = event.touches[0];
    if (!origin || !touch) return;
    if (draggedShotId) {
      event.preventDefault();
      const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest<HTMLElement>('[data-shot-id]');
      const targetId = Number(target?.dataset.shotId);
      if (targetId) moveShotTo(draggedShotId, targetId);
      return;
    }
    if (Math.abs(touch.clientY - origin.y) > 12 && holdTimer.current) window.clearTimeout(holdTimer.current);
  };

  const finishTouchSort = (event: React.TouchEvent<HTMLDivElement>) => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    const origin = touchOrigin.current;
    const touch = event.changedTouches[0];
    if (origin && touch && !draggedShotId) {
      const distance = touch.clientX - origin.x;
      if (distance < -52) setRevealedShotId(origin.id);
      if (distance > 36) setRevealedShotId(null);
    }
    touchOrigin.current = null;
    if (draggedShotId) notify('截图顺序已更新');
    setDraggedShotId(null);
  };

  const startStitching = () => {
    if (shots.length < 2 || isStitching) return;
    setIsStitching(true);
    setSaved(false);
    stitchTimer.current = window.setTimeout(() => {
      setIsStitching(false);
      setStitched(true);
      notify(removeFixedBars ? '已消除重叠并清理重复导航栏' : '已智能识别并消除重叠区域');
    }, 900);
  };

  useEffect(() => () => {
    if (stitchTimer.current) window.clearTimeout(stitchTimer.current);
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
  }, []);

  if (stitched) {
    return (
      <div className="screen-scroll app-screen longshot-screen result-workspace" {...resultBackGesture}>
        <ScreenHeader title="导出长图" back onBack={leaveResult} trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
        <div className="long-result">{shots.map((shot) => <ShotPreview key={shot.id} shot={shot} tall />)}</div>
        <div className={`result-status ${saved ? 'saved' : ''}`}><span><Check size={15} /></span><div><strong>{saved ? '已存入照片' : '拼接完成'}</strong><small>{saved ? '长图已保存在本机相册' : '5 处重叠与 2 个重复栏已清理'}</small></div></div>
        <div className="result-insights"><span><strong>{shots.length}</strong><small>张截图</small></span><span><strong>{Math.max(0, shots.length - 1)}</strong><small>处重叠</small></span><span><strong>{removeFixedBars ? '38%' : '31%'}</strong><small>重复已移除</small></span></div>
        <div className="settings-card compact">
          <div className="settings-row"><span>导出尺寸</span><strong>1080px <ChevronRight size={15} /></strong></div>
          <div className="settings-row"><span>输出质量</span><select aria-label="输出质量" value={quality} onChange={(event) => setQuality(event.target.value)}><option>高清</option><option>标准</option><option>超清 VIP</option></select></div>
          <div className="settings-row"><span>智能接缝</span><strong>{smartSeam ? '已优化' : '手动调整'}</strong></div>
          <div className="settings-row"><span>文件信息</span><strong>PNG · {(shots.length * 0.7 + 0.4).toFixed(1)} MB</strong></div>
        </div>
        <button className={`primary-button ${saved ? 'completed' : ''}`} onClick={() => { setSaved(true); notify(`长图已按${quality}质量存入照片`); }}><Download size={18} /> {saved ? '已保存到照片' : '保存长图'}</button>
        <div className="split-actions"><button onClick={() => notify('PDF 已生成并存入文件')}><FileText size={17} /> 导出 PDF</button><button onClick={leaveResult}><SquarePen size={17} /> 继续编辑</button></div>
      </div>
    );
  }

  return (
    <div className="screen-scroll app-screen longshot-screen editing-workspace">
      <ScreenHeader large title="长截图" trailing={<button className="icon-button" onClick={() => notify('长截图设置已打开')} aria-label="长截图设置"><Settings size={20} /></button>} />
      <div className="segmented-control">
        <button className={mode === 'image' ? 'active' : ''} onClick={() => setMode('image')}>添加截图</button>
        <button className={mode === 'recording' ? 'active' : ''} onClick={() => setMode('recording')}>录屏转长图</button>
      </div>
      <section className="longshot-status"><span><Check size={16} /></span><div><strong>{shots.length} 张截图已就绪</strong><small>顺序和重叠区域已自动识别，可直接调整</small></div></section>
      <div className="shot-toolbar">
        <div><strong>{mode === 'image' ? `${shots.length} 张截图` : '关键画面'}</strong></div>
        <span><button disabled={shots.length < 2} onClick={() => { setShots((current) => [...current].sort((left, right) => left.id - right.id)); notify('已按拍摄时间排序'); }}>自动排序</button><button className="shot-add-button" disabled={shots.length >= 8} onClick={() => setPickerOpen(true)}><ImagePlus size={16} />添加</button></span>
      </div>
      <div className="shot-list longshot-main-list">
        {shots.map((shot, index) => (
          <div className={`shot-swipe-shell ${revealedShotId === shot.id ? 'revealed' : ''}`} data-shot-id={shot.id} key={shot.id}>
            <button className="shot-swipe-delete" aria-label={`删除 ${shot.name}`} onClick={() => { setShots((current) => current.filter((item) => item.id !== shot.id)); setRevealedShotId(null); notify(`已移除 ${shot.name}`); }}><Trash2 size={17} />删除</button>
            <div
              className={`shot-row ${draggedShotId === shot.id ? 'dragging' : ''}`}
              draggable
              onDragStart={() => { setDraggedShotId(shot.id); setRevealedShotId(null); }}
              onDragEnter={() => { if (draggedShotId) moveShotTo(draggedShotId, shot.id); }}
              onDragOver={(event) => event.preventDefault()}
              onDragEnd={() => { setDraggedShotId(null); notify('截图顺序已更新'); }}
              onTouchStart={(event) => beginTouchSort(shot, event)}
              onTouchMove={updateTouchSort}
              onTouchEnd={finishTouchSort}
              onTouchCancel={finishTouchSort}
            >
              <GripVertical className="shot-drag-handle" size={18} aria-hidden="true" />
              <strong className="shot-index">{String(index + 1).padStart(2, '0')}</strong>
              <ShotPreview shot={shot} />
              <span className="shot-copy"><strong>{shot.name}</strong><small>{index ? `与上一张重叠 ${99 - index}%` : '长按拖动排序 · 左滑删除'}</small></span>
              <ChevronRight size={17} />
            </div>
          </div>
        ))}
        {!shots.length ? <button className="empty-drop" onClick={() => setPickerOpen(true)}><ImagePlus size={28} /><strong>选择截图</strong><small>最多添加 8 张</small></button> : null}
      </div>
      <button className="primary-button sticky-primary" disabled={shots.length < 2 || isStitching} onClick={startStitching}>{isStitching ? <LoaderCircle className="spinner" size={18} /> : <Sparkles size={18} />} {isStitching ? '正在生成预览…' : '预览拼接结果'}</button>
      <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={addPhotos} max={Math.max(1, 8 - shots.length)} />
    </div>
  );
}

function ToolsScreen({ onOpenTool, onOpenTemplates }: { onOpenTool: (id: ToolId) => void; onOpenTemplates: () => void }) {
  const [search, setSearch] = useState('');
  const matches = (label: string, hint: string) => `${label}${hint}`.toLowerCase().includes(search.trim().toLowerCase());
  return (
    <div className="screen-scroll app-screen tools-screen">
      <ScreenHeader large title="工具" subtitle="选择一项，马上处理图片" />
      <label className="search-field"><Search size={17} /><input name="tool-search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索打码、文档扫描等" aria-label="搜索工具" />{search ? <button onClick={() => setSearch('')}>清除</button> : null}</label>
      {!search ? <button className="tool-featured" onClick={() => onOpenTool('redact')}><span><em>发图前推荐</em><strong>先检查有没有隐私</strong><small>自动找到头像、昵称、手机号和二维码。</small><b>选择一张截图 <ArrowRight size={14} /></b></span><ResultArtwork kind="redact" /></button> : null}
      {toolGroups.map((group) => {
        const items = group.items.filter((item) => matches(item.label, item.hint));
        if (!items.length) return null;
        return (
          <section className="section-block" key={group.title}>
            <div className="section-title"><h2>{group.title}</h2></div>
            <div className="tool-list-card">
              {items.map((item) => {
                return <button key={item.id} onClick={() => onOpenTool(item.id)}><ResultArtwork kind={item.id} /><span><strong>{item.label}</strong><small>{item.hint}</small></span>{item.pro ? <em>VIP</em> : null}<ChevronRight size={17} /></button>;
              })}
            </div>
          </section>
        );
      })}
      {!search ? <section className="section-block creative-tools-section"><div className="section-title"><h2>创作模板</h2></div><button className="creative-template-card" onClick={onOpenTemplates}><span><em>自动识别并排版</em><strong>把一组截图变成可直接分享的作品</strong><small>自动排序、保留主体并添加步骤编号</small><b>选择使用场景 <ArrowRight size={14} /></b></span><span className="creative-template-art"><ResultArtwork kind="ninegrid" /><ResultArtwork kind="commerce" /></span></button></section> : null}
      {search && !toolGroups.some((group) => group.items.some((item) => matches(item.label, item.hint))) ? <div className="empty-search"><Search size={25} /><strong>没有找到“{search}”</strong><small>换个关键词试试</small></div> : null}
    </div>
  );
}

function ImageInput({ onSelect, selectedName, label = '选择照片' }: { onSelect: (photo: PickedPhoto) => void; selectedName?: string; label?: string }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  return (
    <>
      <button className="mini-upload" onClick={() => setPickerOpen(true)}><ImagePlus size={17} /><span>{selectedName || label}</span><ChevronRight size={15} /></button>
      <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={(photos) => { if (photos[0]) onSelect(photos[0]); }} multiple={false} max={1} />
    </>
  );
}

function RedactTool({ notify, onBack }: { notify: (message: string) => void; onBack: () => void }) {
  const [method, setMethod] = useState('模糊');
  const [strength, setStrength] = useState(62);
  const [completed, setCompleted] = useState(false);
  const [redoAvailable, setRedoAvailable] = useState(false);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [enabledKinds, setEnabledKinds] = useState(['头像', '昵称', '手机号', '地址', '二维码']);
  const privacyKinds = [
    { label: '头像', count: 3 },
    { label: '昵称', count: 2 },
    { label: '手机号', count: 1 },
    { label: '地址', count: 1 },
    { label: '二维码', count: 2 },
  ];
  const selectedCount = privacyKinds.reduce((total, item) => total + (enabledKinds.includes(item.label) ? item.count : 0), 0);
  const toggleKind = (label: string) => {
    setEnabledKinds((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
    setCompleted(false);
    setRedoAvailable(false);
  };
  return (
    <div className="redact-editor-flow">
      <EditorHeader
        title="智能打码"
        onBack={onBack}
        canUndo={completed}
        canRedo={redoAvailable}
        onUndo={() => { setCompleted(false); setRedoAvailable(true); notify('已撤销打码'); }}
        onRedo={() => { setCompleted(true); setRedoAvailable(false); notify('已恢复打码'); }}
        onDone={() => { if (!photo) notify('请先选择图片'); else { setCompleted(true); setRedoAvailable(false); notify(`${selectedCount} 处隐私已处理`); } }}
      />
      <ImageInput selectedName={photo?.name} label={photo ? '更换图片' : '选择图片'} onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setCompleted(false); setRedoAvailable(false); notify('已识别头像、手机号与二维码'); }} />
      {!photo ? <div className="editor-empty-state redact-empty"><span><ImagePlus size={28} /></span><strong>选择聊天截图开始</strong><small>隐私区域会直接标在图片上</small><button onClick={() => { setPhoto(demoShots[1]); notify('已载入示例截图'); }}>查看示例</button></div> : (
        <div className={`chat-preview redact-canvas ${photo.tone} ${completed ? 'is-complete' : ''}`} style={photo.url ? { backgroundImage: `linear-gradient(rgba(244,248,252,.82),rgba(244,248,252,.82)),url(${photo.url})` } : undefined}>
          <span className={`detection-count ${completed ? 'complete' : ''}`}><ShieldCheck size={14} />{completed ? `已处理 ${selectedCount} 处` : `已识别 ${selectedCount} 处`}</span>
          <div className="chat-bubble left"><span className="avatar-mask" style={{ filter: method === '模糊' ? `blur(${strength / 12}px)` : undefined }} />周末一起去露营吧，地点我发你～</div>
          <div className="chat-bubble right">好呀，发我位置和联系方式吧</div>
          <div className="chat-bubble left">手机号：<b className={`redact-mark ${method}`}>138 8888 8888</b></div>
          <div className="location-card"><strong>大雁湖露营地</strong><small>广东省深圳市龙岗区大雁湖公园</small><span>◎</span></div>
          <div className={`qr-demo redact-mark ${method}`}><QrCode size={48} /></div>
          {enabledKinds.includes('头像') ? <i className="privacy-box privacy-avatar">头像</i> : null}
          {enabledKinds.includes('昵称') ? <i className="privacy-box privacy-name">昵称</i> : null}
          {enabledKinds.includes('手机号') ? <i className="privacy-box privacy-phone">手机号</i> : null}
          {enabledKinds.includes('地址') ? <i className="privacy-box privacy-address">地址</i> : null}
          {enabledKinds.includes('二维码') ? <i className="privacy-box privacy-qr">二维码</i> : null}
        </div>
      )}
      <div className="redact-bottom-panel editor-bottom-panel">
        <div className="panel-heading"><strong>隐私类型</strong><small>已选 {selectedCount} 处</small></div>
        <div className="privacy-kind-chips">{privacyKinds.map((item) => <button key={item.label} className={enabledKinds.includes(item.label) ? 'active' : ''} onClick={() => toggleKind(item.label)}><span>{item.label}</span><small>{item.count}</small></button>)}</div>
        <div className="method-tabs">{['模糊','马赛克','涂抹','色块'].map((item) => <button key={item} className={method === item ? 'active' : ''} onClick={() => { setMethod(item); setCompleted(false); setRedoAvailable(false); }}>{item}</button>)}</div>
        <label className="range-row"><span>强度</span><input type="range" min="20" max="100" value={strength} onChange={(event) => { setStrength(Number(event.target.value)); setCompleted(false); setRedoAvailable(false); }} /><strong>{strength}%</strong></label>
      </div>
      <button className={`primary-button sticky-primary ${completed ? 'completed' : ''}`} disabled={!photo || !selectedCount} onClick={() => { if (completed) notify('图片已保存到照片'); else { setCompleted(true); setRedoAvailable(false); notify(`${selectedCount} 处隐私内容已安全打码`); } }}>{completed ? <Download size={18} /> : <ShieldCheck size={18} />}{completed ? '保存图片' : `处理 ${selectedCount || ''} 处隐私`}</button>
    </div>
  );
}

const ocrCopy = `人工智能发展趋势报告\n2026 年度\n\n一、概述\n人工智能正在全球范围内加速发展，已成为推动科技进步与产业变革的重要力量。\n\n二、关键趋势\n1. 大模型持续进化\n2. 应用场景加速落地\n3. 生态协同更加完善`;

function OcrTool({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [result, setResult] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultView, setResultView] = useState<'image' | 'text'>('image');
  const [language, setLanguage] = useState('自动识别中英文');
  const [enhancement, setEnhancement] = useState('自动变清晰');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [batchPhotos, setBatchPhotos] = useState<PickedPhoto[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const processingTimer = useRef<number | null>(null);
  const sourceCount = mode === 'single' ? Number(Boolean(photo)) : batchPhotos.length;
  const changeMode = (nextMode: 'single' | 'batch') => { setMode(nextMode); setResult(false); setProcessing(false); setResultView('image'); };
  const previewStyle = mode === 'single' && photo?.url
    ? { backgroundImage: `linear-gradient(rgba(255,255,255,.2), rgba(255,255,255,.2)), url(${photo.url})` }
    : undefined;
  const startScan = () => {
    if (!sourceCount || processing) return;
    setProcessing(true);
    if (processingTimer.current) window.clearTimeout(processingTimer.current);
    processingTimer.current = window.setTimeout(() => {
      setProcessing(false);
      setResult(true);
      setResultView('image');
      notify(mode === 'batch' ? `${sourceCount} 页文档已生成` : '文档已变清晰，文字也已提取');
    }, 900);
  };
  useEffect(() => () => {
    if (processingTimer.current) window.clearTimeout(processingTimer.current);
  }, []);
  return (
    <div className="ocr-flow">
      <div className="segmented-control tool-segment"><button className={mode === 'single' ? 'active' : ''} onClick={() => changeMode('single')}>扫描一张</button><button className={mode === 'batch' ? 'active' : ''} onClick={() => changeMode('batch')}>扫描多页</button></div>
      {mode === 'single' ? <ImageInput selectedName={photo?.name} label={photo ? '更换文档照片' : '选择文档照片'} onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setResult(false); setProcessing(false); notify('文档照片已加入'); }} /> : <>
        <button className="mini-upload" onClick={() => setPickerOpen(true)}><ImagePlus size={17} /><span>{batchPhotos.length ? `已选择 ${batchPhotos.length} 页` : '选择多页文档照片'}</span><ChevronRight size={15} /></button>
        <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={(photos) => { setBatchPhotos(photos); setResult(false); setProcessing(false); notify(`已加入 ${photos.length} 页文档`); }} max={5} />
      </>}
      {!sourceCount ? <div className="editor-empty-state document-empty"><span><FileScan size={28} /></span><strong>选择文档照片开始</strong><small>自动拉正、去除阴影并提取文字</small><button onClick={() => { setPhoto(demoShots[0]); setMode('single'); notify('已载入示例文档'); }}>查看示例</button></div> : null}
      {sourceCount && !result ? <div className={`document-preview document-source ${mode === 'single' && photo ? `photo-tone-${photo.tone}` : ''}`} style={previewStyle}><FocusCorners className="document-focus" /><span className="source-chip"><Images size={13} />{mode === 'single' ? photo?.name : `${batchPhotos.length} 页文档`}</span><div className="document-ready-state"><span><ScanText size={18} /></span><div><strong>{sourceCount} 页文档已加入</strong><small>确认效果后生成清晰文档</small></div></div></div> : null}
      {sourceCount && !result ? <>
        <label className="select-row"><span>文字语言</span><select name="ocr-language" value={language} onChange={(event) => { setLanguage(event.target.value); setResult(false); }}><option>自动识别中英文</option><option>简体中文</option><option>English</option><option>日本語</option></select></label>
        <div className="scan-modes" aria-label="文档效果">{['自动变清晰','去除阴影','黑白扫描'].map((item) => <button key={item} className={enhancement === item ? 'active' : ''} onClick={() => { setEnhancement(item); setResult(false); }}>{item}</button>)}</div>
      </> : null}
      {processing ? <div className="scan-pipeline processing"><span><Check size={13} />找到文档</span><span><LoaderCircle className="spinner" size={13} />正在拉正</span><span>提取文字</span></div> : null}
      {result ? <>
        <div className="segmented-control ocr-result-tabs"><button className={resultView === 'image' ? 'active' : ''} onClick={() => setResultView('image')}>图片</button><button className={resultView === 'text' ? 'active' : ''} onClick={() => setResultView('text')}>文字</button></div>
        {resultView === 'image' ? <div className={`document-preview recognized document-result-image ${mode === 'single' && photo ? `photo-tone-${photo.tone}` : ''}`} style={previewStyle}><FocusCorners className="document-focus" /><span className="source-chip"><Check size={13} />已拉正并增强</span><div className="document-page-lines"><strong>人工智能发展趋势报告</strong><i /><i /><i /><i /><i /><i /></div></div> : <div className="ocr-text-result">{ocrCopy.split('\n').map((line, index) => <p key={index} className={line.includes('、') || /^\d\./.test(line) ? 'doc-title' : ''}>{line || ' '}</p>)}</div>}
        <div className="ocr-actions result-actions"><button onClick={() => { void navigator.clipboard?.writeText(ocrCopy); notify('文档文字已复制'); }}><Copy size={17} />复制文字</button><button onClick={() => notify(`已保存 ${sourceCount} 页 PDF`)}><FileText size={17} />保存 PDF</button><button onClick={() => notify('可编辑文本已存入文件')}><Download size={17} />导出文本</button></div>
      </> : <button className="primary-button sticky-primary" disabled={!sourceCount || processing} onClick={startScan}>{processing ? <LoaderCircle className="spinner" size={18} /> : <ScanText size={18} />}{processing ? '正在处理文档…' : `生成${mode === 'batch' && sourceCount ? ` ${sourceCount} 页` : ''}清晰文档`}</button>}
    </div>
  );
}

function CleanScreenshotTool({ notify }: { notify: (message: string) => void }) {
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [cleaned, setCleaned] = useState(false);
  const [divider, setDivider] = useState(52);
  const [draggingDivider, setDraggingDivider] = useState(false);
  const [enabledItems, setEnabledItems] = useState(['状态栏', '底部指示条', '浮动按钮']);
  const cleanCompareRef = useRef<HTMLDivElement | null>(null);
  const cleanupItems = [
    { label: '状态栏', hint: '时间、电量和网络信息' },
    { label: '底部指示条', hint: '自动补齐底部背景' },
    { label: '浮动按钮', hint: '清理悬浮操作控件' },
  ];
  const toggleItem = (label: string) => {
    setEnabledItems((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
    setCleaned(false);
  };
  const updateDivider = (clientX: number) => {
    const rect = cleanCompareRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDivider(Math.min(88, Math.max(12, ((clientX - rect.left) / rect.width) * 100)));
  };
  const cleanupArtwork = (after: boolean) => (
    <span className={`clean-compare-layer ${after ? 'after' : 'before'} ${photo ? `photo-tone-${photo.tone}` : ''}`} style={photo?.url ? { backgroundImage:`linear-gradient(rgba(241,246,253,.72),rgba(241,246,253,.72)),url(${photo.url})` } : undefined}>
      {!after || !enabledItems.includes('状态栏') ? <span className="clean-status"><b>9:41</b><i>•••</i></span> : null}
      <span className="clean-content"><strong>订单已经提交</strong><span /><span /><span /><div><i /><b>预计明天送达</b></div></span>
      {!after || !enabledItems.includes('浮动按钮') ? <span className="clean-floating"><Sparkles size={15} /></span> : null}
      {!after || !enabledItems.includes('底部指示条') ? <span className="clean-home" /> : null}
    </span>
  );
  return (
    <div className="smart-tool-flow clean-tool-flow">
      <ImageInput selectedName={photo?.name} label="选择需要净化的截图" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setCleaned(false); notify('已发现状态栏、底部指示条和浮动按钮'); }} />
      {!photo ? <div className="editor-empty-state clean-empty"><span><Sparkles size={28} /></span><strong>选择截图开始净化</strong><small>可直接比较清理前后的效果</small><button onClick={() => { setPhoto(demoShots[3]); notify('已载入示例截图'); }}>查看示例</button></div> : <div
        ref={cleanCompareRef}
        className={`clean-compare-stage ${cleaned ? 'is-clean' : ''} ${draggingDivider ? 'is-dragging' : ''}`}
        onPointerDown={(event) => { setDraggingDivider(true); event.currentTarget.setPointerCapture(event.pointerId); updateDivider(event.clientX); }}
        onPointerMove={(event) => { if (draggingDivider) updateDivider(event.clientX); }}
        onPointerUp={(event) => { setDraggingDivider(false); event.currentTarget.releasePointerCapture(event.pointerId); }}
        onPointerCancel={() => setDraggingDivider(false)}
      >
        {cleanupArtwork(false)}
        <span className="clean-after-clip" style={{ clipPath:`inset(0 0 0 ${divider}%)` }}>{cleanupArtwork(true)}</span>
        <span className="clean-compare-divider" style={{ left:`${divider}%` }}><i /><b>↔</b></span>
        <span className="clean-compare-label before">处理前</span><span className="clean-compare-label after">处理后</span>
        {cleaned ? <span className="generated-badge"><Check size={14} />已清理 {enabledItems.length} 项</span> : null}
      </div>}
      {photo ? <div className="cleanup-summary"><span><Sparkles size={17} /></span><div><strong>发现 3 项可清理内容</strong><small>拖动画面中的分割线比较效果</small></div></div> : null}
      <div className="cleanup-options compact" aria-label="选择需要清理的内容">
        {cleanupItems.map((item) => <label key={item.label}><input type="checkbox" checked={enabledItems.includes(item.label)} onChange={() => toggleItem(item.label)} /><span><strong>{item.label}</strong><small>{item.hint}</small></span><i><Check size={12} /></i></label>)}
      </div>
      {photo ? <button className="manual-repair" onClick={() => notify('已进入手动修复模式')}><SquarePen size={16} /><span><strong>自动效果不好？手动修复</strong><small>涂抹或恢复局部区域</small></span><ChevronRight size={16} /></button> : null}
      <button className={`primary-button sticky-primary ${cleaned ? 'completed' : ''}`} disabled={!photo || !enabledItems.length} onClick={() => { if (cleaned) notify('清爽截图已保存到照片'); else { setCleaned(true); notify(`${enabledItems.length} 项界面元素已清理`); } }}>{cleaned ? <Download size={18} /> : <Sparkles size={18} />}{cleaned ? '保存清爽截图' : `应用净化效果 · ${enabledItems.length} 项`}</button>
    </div>
  );
}

function CompareTool({ notify }: { notify: (message: string) => void }) {
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mode, setMode] = useState<'slider' | 'difference'>('slider');
  const [divider, setDivider] = useState(52);
  const [analyzed, setAnalyzed] = useState(false);
  const [saved, setSaved] = useState(false);
  const left = photos[0];
  const right = photos[1];
  const renderLayer = (photo: PickedPhoto | undefined, side: 'before' | 'after') => (
    <span className={`compare-layer ${side} ${photo ? `photo-tone-${photo.tone}` : ''}`} style={photo?.url ? { backgroundImage:`url(${photo.url})` } : undefined}>
      {!photo?.url ? <><i /><i /><i /><b /></> : null}
    </span>
  );
  return (
    <div className="smart-tool-flow compare-tool-flow">
      <div className={`compare-stage ${analyzed ? 'is-ready' : ''} ${mode === 'difference' ? 'show-difference' : ''}`}>
        {renderLayer(left, 'before')}
        <span className="compare-after-clip" style={{ clipPath:`inset(0 0 0 ${divider}%)` }}>{renderLayer(right, 'after')}</span>
        <span className="compare-divider" style={{ left:`${divider}%` }}><i /><b>↔</b></span>
        <span className="compare-label before">修改前</span><span className="compare-label after">修改后</span>
        {mode === 'difference' && analyzed ? <><i className="difference-box box-a" /><i className="difference-box box-b" /><i className="difference-box box-c" /></> : null}
      </div>
      <button className="mini-upload" onClick={() => setPickerOpen(true)}><Images size={17} /><span>{photos.length === 2 ? '已选择 2 张图片' : '选择修改前与修改后图片'}</span><ChevronRight size={15} /></button>
      <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={(pickedPhotos) => { setPhotos(pickedPhotos.slice(0, 2)); setAnalyzed(false); setSaved(false); notify('两张图片已加入对比'); }} max={2} />
      <div className="segmented-control compare-modes"><button className={mode === 'slider' ? 'active' : ''} onClick={() => setMode('slider')}>滑动对比</button><button className={mode === 'difference' ? 'active' : ''} onClick={() => setMode('difference')}>差异高亮</button></div>
      <label className="range-row compare-range"><span>对比位置</span><input type="range" min="18" max="82" value={divider} onChange={(event) => setDivider(Number(event.target.value))} /><strong>{divider}%</strong></label>
      {analyzed ? <div className="compare-insights"><span><strong>自动对齐</strong><small>偏移已修正</small></span><span><strong>3 处变化</strong><small>差异已定位</small></span><span><strong>97%</strong><small>画面相似度</small></span></div> : null}
      <button className={`primary-button ${saved ? 'completed' : ''}`} disabled={photos.length < 2} onClick={() => { if (!analyzed) { setAnalyzed(true); notify('两张图片已对齐，发现 3 处变化'); } else { setSaved(true); notify('对比图已保存到照片'); } }}>{analyzed ? <Download size={18} /> : <Sparkles size={18} />}{analyzed ? saved ? '已保存对比图' : '保存对比图' : '自动对齐并查找差异'}</button>
    </div>
  );
}

function AnnotateTool({ notify, onBack }: { notify: (message: string) => void; onBack: () => void }) {
  const [mode, setMode] = useState('箭头');
  const [color, setColor] = useState('#ff3b30');
  const [cropRatio, setCropRatio] = useState('自由');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const chooseMode = (nextMode: string) => {
    if (nextMode === mode) return;
    setHistory((current) => [...current, mode]);
    setRedoHistory([]);
    setMode(nextMode);
    setSaved(false);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setHistory((current) => current.slice(0, -1));
    setRedoHistory((current) => [...current, mode]);
    setMode(previous);
    setSaved(false);
  };
  const redo = () => {
    const next = redoHistory.at(-1);
    if (!next) return;
    setRedoHistory((current) => current.slice(0, -1));
    setHistory((current) => [...current, mode]);
    setMode(next);
    setSaved(false);
  };
  return (
    <div className="annotation-editor-flow">
      <EditorHeader title="图片标注" onBack={onBack} onUndo={undo} onRedo={redo} canUndo={Boolean(history.length)} canRedo={Boolean(redoHistory.length)} onDone={() => { if (!photo) notify('请先选择图片'); else { setSaved(true); notify('标注已完成'); } }} />
      <ImageInput selectedName={photo?.name} label={photo ? '更换图片' : '选择图片'} onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setHistory([]); setRedoHistory([]); setSaved(false); notify('图片已导入编辑器'); }} />
      {!photo ? <div className="editor-empty-state annotation-empty"><span><SquarePen size={28} /></span><strong>选择图片开始标注</strong><small>支持箭头、文字、编号、高亮和裁剪</small><button onClick={() => { setPhoto(demoShots[0]); notify('已载入示例图片'); }}>查看示例</button></div> : <div className={`annotation-canvas editor-canvas ${photo.tone}`} style={photo.url ? { backgroundImage: `url(${photo.url})` } : undefined}>
        <span className="canvas-photo-label">{photo.name}</span>
        {mode === '箭头' ? <span className="annotation-arrow" style={{ color }}>↗</span> : null}
        {mode === '编号' ? <span className="annotation-number" style={{ background: color }}>1</span> : null}
        {mode === '高亮' ? <span className="annotation-highlight" style={{ background: color }} /> : null}
        {mode === '文字' ? <span className="annotation-text" style={{ color }}>重点信息</span> : null}
        {mode === '裁剪' ? <span className="crop-guide"><i /><i /><i /><i /></span> : null}
        {saved ? <span className="generated-badge"><Check size={14} />已保存</span> : null}
      </div>}
      <div className="editor-panel annotation-bottom-panel editor-bottom-panel">
        <div className="annotation-tools">
          {[['箭头', ArrowRight], ['文字', TextCursorInput], ['编号', BadgeCheck], ['高亮', Highlighter], ['裁剪', Crop]].map(([label, ToolIcon]) => {
            const Icon = ToolIcon as LucideIcon;
            return <button key={label as string} className={mode === label ? 'active' : ''} onClick={() => chooseMode(label as string)}><Icon size={19} /><span>{label as string}</span></button>;
          })}
        </div>
        {mode === '裁剪' ? <div className="crop-parameters"><div>{['自由','1:1','4:3','16:9'].map((item) => <button key={item} className={cropRatio === item ? 'active' : ''} onClick={() => { setCropRatio(item); setSaved(false); }}>{item}</button>)}</div><button onClick={() => { setSaved(false); notify('图片已旋转 90°'); }}><Redo2 size={17} />旋转</button></div> : <div className="color-row">{['#ff3b30','#ff9500','#ffcc00','#16c779','#1765fa','#8b5cf6','#111827'].map((item) => <button aria-label={`选择颜色 ${item}`} key={item} className={color === item ? 'active' : ''} style={{ background:item }} onClick={() => { setColor(item); setSaved(false); }} />)}</div>}
      </div>
      <button className={`primary-button sticky-primary ${saved ? 'completed' : ''}`} disabled={!photo} onClick={() => { setSaved(true); notify('标注图片已保存到照片'); }}><Download size={18} /> {saved ? '已保存到照片' : '保存图片'}</button>
    </div>
  );
}

function IdPhotoTool({ notify }: { notify: (message: string) => void }) {
  const [background, setBackground] = useState('#2675ee');
  const [size, setSize] = useState('一寸');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [generated, setGenerated] = useState(false);
  return (
    <>
      <div className="size-tabs">{['一寸','二寸','简历','考试'].map((item) => <button key={item} className={size === item ? 'active' : ''} onClick={() => setSize(item)}>{item}</button>)}</div>
      <div className="id-photo-stage" style={{ background }}>
        {photo?.url ? <div className="id-photo-image" aria-hidden="true" style={{ backgroundImage:`url(${photo.url})` }} /> : <div className={`person-placeholder ${photo ? `photo-tone-${photo.tone}` : ''}`}><span className="head" /><span className="body" /></div>}
        <span className="face-guide" /><i className="eye-line" /><i className="chin-line" />
        {generated ? <span className="generated-badge"><Check size={14} />背景已优化</span> : null}
      </div>
      <div className="id-meta"><span><strong>{size}</strong><small>{size === '二寸' ? '35 × 49 mm' : '25 × 35 mm'}</small></span><button onClick={() => notify('支持自定义像素与毫米尺寸')}>更改 <ChevronRight size={15} /></button></div>
      <ImageInput selectedName={photo?.name} label="选择人像照片" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setGenerated(false); notify('已智能识别人像与肩部轮廓'); }} />
      <div className="background-options">
        {[['白底','#f8fafc'],['蓝底','#2675ee'],['红底','#ef3340']].map(([label, value]) => <button key={label} className={background === value ? 'active' : ''} onClick={() => setBackground(value)}><span style={{ background:value }} />{label}</button>)}
      </div>
      <button className={`primary-button ${generated ? 'completed' : ''}`} disabled={!photo} onClick={() => { setGenerated(true); notify('证件照已生成，可继续切换底色'); }}><Download size={18} /> {generated ? '保存证件照' : '生成证件照'}</button>
    </>
  );
}

function QrCodeTool({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<'scan' | 'create'>('scan');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [inputValue, setInputValue] = useState('https://example.com');
  const [processed, setProcessed] = useState(false);
  const changeMode = (nextMode: 'scan' | 'create') => { setMode(nextMode); setProcessed(false); };
  const canProcess = mode === 'scan' ? Boolean(photo) : Boolean(inputValue.trim());
  return (
    <div className="smart-tool-flow qr-tool-flow">
      <div className="segmented-control"><button className={mode === 'scan' ? 'active' : ''} onClick={() => changeMode('scan')}>识别二维码</button><button className={mode === 'create' ? 'active' : ''} onClick={() => changeMode('create')}>制作二维码</button></div>
      <div className={`qr-result-stage ${processed ? 'is-ready' : ''}`}>
        <span className="qr-code-frame"><QrCode size={88} /><FocusCorners /></span>
        {mode === 'scan' ? <><strong>{processed ? '已识别链接' : '从截图中自动定位二维码'}</strong><small>{processed ? 'example.com/product/42' : '支持倾斜、模糊或尺寸较小的二维码'}</small></> : <><strong>{processed ? '二维码已生成' : '输入内容后生成高清二维码'}</strong><small>{processed ? inputValue : '适合链接、文字和联系方式'}</small></>}
      </div>
      {mode === 'scan' ? <ImageInput selectedName={photo?.name} label="选择包含二维码的截图" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setProcessed(false); notify('截图已加入，等待识别'); }} /> : <label className="generic-input"><span>链接或文字</span><input name="qr-content" autoComplete="off" value={inputValue} onChange={(event) => { setInputValue(event.target.value); setProcessed(false); }} /></label>}
      {processed && mode === 'scan' ? <div className="qr-result-actions"><button onClick={() => notify('链接已复制')}><Copy size={17} />复制链接</button><button onClick={() => notify('已完成安全检查，可以打开链接')}><ShieldCheck size={17} />安全打开</button></div> : null}
      <button className={`primary-button ${processed ? 'completed' : ''}`} disabled={!canProcess} onClick={() => { if (processed) notify(mode === 'scan' ? '链接已复制' : '二维码已保存到照片'); else { setProcessed(true); notify(mode === 'scan' ? '二维码已识别并完成安全检查' : '高清二维码已生成'); } }}>{processed ? <Download size={18} /> : <QrCode size={18} />}{processed ? mode === 'scan' ? '复制识别结果' : '保存二维码' : mode === 'scan' ? '识别截图中的二维码' : '生成二维码'}</button>
    </div>
  );
}

function ExportCenterTool({ notify, onUpgrade, subscribed }: { notify: (message: string) => void; onUpgrade: () => void; subscribed: boolean }) {
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [format, setFormat] = useState('PNG');
  const [quality, setQuality] = useState(82);
  const [watermark, setWatermark] = useState(false);
  const [processed, setProcessed] = useState(false);
  return (
    <div className="smart-tool-flow export-tool-flow">
      <div className={`export-result-card ${processed ? 'is-ready' : ''}`}>
        <ResultArtwork kind="export" />
        <span><small>{processed ? '导出方案已就绪' : '一次设置，直接得到可分享文件'}</small><strong>{processed ? `预计 980 KB · ${format}` : '尺寸、格式、压缩与水印'}</strong><p>{processed ? `比原图减少 64% · 清晰度 ${quality}%` : '普通导出免费，批量与超清为 VIP 权益'}</p></span>
      </div>
      <ImageInput selectedName={photo?.name} label="选择需要导出的图片" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setProcessed(false); notify('图片已加入导出中心'); }} />
      <div className="export-settings-card">
        <div><span><strong>输出格式</strong><small>保留原始尺寸</small></span><select aria-label="输出格式" value={format} onChange={(event) => { setFormat(event.target.value); setProcessed(false); }}><option>PNG</option><option>JPG</option><option>WebP</option></select></div>
        <label className="export-quality"><span><strong>文件大小</strong><small>清晰度 {quality}%</small></span><input aria-label="导出清晰度" type="range" min="45" max="100" value={quality} onChange={(event) => { setQuality(Number(event.target.value)); setProcessed(false); }} /></label>
        <label className="export-switch"><span><strong>添加署名水印</strong><small>右下角 · 低透明度</small></span><input type="checkbox" checked={watermark} onChange={(event) => { setWatermark(event.target.checked); setProcessed(false); }} /><i><Check size={12} /></i></label>
      </div>
      {!subscribed ? <button className="batch-upgrade" onClick={onUpgrade}><Crown size={16} fill="currentColor" /><span><strong>批量导出与超清画质</strong><small>开通 VIP 后一次处理整组图片</small></span><ChevronRight size={16} /></button> : null}
      <button className={`primary-button ${processed ? 'completed' : ''}`} disabled={!photo} onClick={() => { if (processed) notify(`${format} 图片已保存到照片`); else { setProcessed(true); notify('导出方案已生成，预计节省 64% 空间'); } }}>{processed ? <Download size={18} /> : <Sparkles size={18} />}{processed ? `保存 ${format} 图片` : '生成导出方案'}</button>
    </div>
  );
}

function ToolDetail({ id, onBack, notify, onUpgrade, subscribed }: { id: ToolId; onBack: () => void; notify: (message: string) => void; onUpgrade: () => void; subscribed: boolean }) {
  const titles: Record<ToolId, string> = { redact:'智能打码', ocr:'文档扫描', clean:'截图净化', annotate:'图片标注', compare:'图片对比', idphoto:'证件照', qrcode:'二维码工具', export:'导出中心' };
  const backGesture = useEdgeSwipeBack(onBack);
  const ownsEditorHeader = id === 'redact' || id === 'annotate';
  return (
    <div className={`screen-scroll app-screen detail-screen detail-${id} editing-workspace tool-workspace`} {...backGesture}>
      {!ownsEditorHeader ? <ScreenHeader title={titles[id]} back onBack={onBack} trailing={<button className="icon-button" onClick={() => notify('工具设置已打开')} aria-label="工具设置"><Settings size={20} /></button>} /> : null}
      {id === 'redact' ? <RedactTool notify={notify} onBack={onBack} /> : id === 'ocr' ? <OcrTool notify={notify} /> : id === 'clean' ? <CleanScreenshotTool notify={notify} /> : id === 'annotate' ? <AnnotateTool notify={notify} onBack={onBack} /> : id === 'compare' ? <CompareTool notify={notify} /> : id === 'idphoto' ? <IdPhotoTool notify={notify} /> : id === 'qrcode' ? <QrCodeTool notify={notify} /> : <ExportCenterTool notify={notify} onUpgrade={onUpgrade} subscribed={subscribed} />}
    </div>
  );
}

type TemplateTheme = {
  id: string;
  title: string;
  subtitle: string;
  scenario: string;
  tone: string;
  cells: number;
  ratio: string;
  categories: string[];
  value: string;
  kind?: 'nine-slice' | 'repeat-photo';
  titleLabel?: string;
  numbered?: boolean;
  cellLabels?: string[];
  pro?: boolean;
};

const templateThemes: TemplateTheme[] = [
  { id:'nine-basic', title:'基础九宫格', subtitle:'九张照片 / 整齐排列', scenario:'朋友圈日常、聚会和晒图', value:'基础排版与高清导出', tone:'sky', cells:9, ratio:'1:1', categories:['热门','九宫格','社交'] },
  { id:'nine-slice', title:'九宫格切图', subtitle:'一张大图 / 自动切九张', scenario:'朋友圈连续发布一张完整大图', value:'自动裁切并标好发布顺序', tone:'graphite', cells:9, ratio:'1:1', categories:['热门','九宫格','社交'], kind:'nine-slice', numbered:true, pro:true },
  { id:'daily', title:'日常四格', subtitle:'生活碎片 / 灵感时刻', scenario:'日常记录与旅行回顾', value:'自由换图和基础布局', tone:'sunset', cells:4, ratio:'3:4', categories:['热门','社交'] },
  { id:'tutorial', title:'操作教程', subtitle:'自动排序 / 步骤编号', scenario:'软件操作、安装和使用说明', value:'识别截图顺序并自动添加编号', tone:'blueprint', cells:4, ratio:'3:4', categories:['热门','教程'], numbered:true, titleLabel:'教程标题', pro:true },
  { id:'feedback', title:'问题反馈', subtitle:'定位差异 / 重点说明', scenario:'向客服或研发提交 Bug', value:'自动整理问题、复现、结果与期望', tone:'minty', cells:4, ratio:'3:4', categories:['热门','反馈'], cellLabels:['问题','复现','结果','期望'], titleLabel:'问题标题' },
  { id:'compare', title:'前后对比', subtitle:'自动对齐 / 差异清晰', scenario:'修图效果、设计改版和验收对比', value:'对齐画面并生成“修改前 / 修改后”标签', tone:'graphite', cells:2, ratio:'4:3', categories:['热门','反馈'], cellLabels:['修改前','修改后'] },
  { id:'chat', title:'聊天记录整理', subtitle:'去除重复 / 时间顺序', scenario:'售后沟通、报销或问题举证', value:'识别重叠内容并按时间整理', tone:'paper', cells:3, ratio:'3:4', categories:['反馈','办公'], titleLabel:'记录标题' },
  { id:'recipe', title:'图文步骤', subtitle:'步骤配图 / 要点说明', scenario:'菜谱、手作和课程步骤', value:'基础编号和图文排版', tone:'rose', cells:4, ratio:'3:4', categories:['教程','社交'], numbered:true, titleLabel:'内容标题' },
  { id:'id-sheet', title:'证件照冲印', subtitle:'单张人像 / 六张同版', scenario:'制作六寸相纸冲印排版', value:'自动计算尺寸并添加裁切线', tone:'ice', cells:6, ratio:'4:3', categories:['证件照'], kind:'repeat-photo', pro:true },
  { id:'report', title:'产品验收报告', subtitle:'差异定位 / 结论汇总', scenario:'研发验收、周报和项目汇报', value:'自动对齐截图并高亮变化区域', tone:'navy', cells:4, ratio:'4:3', categories:['教程','反馈','办公'], numbered:true, cellLabels:['问题','修改','验证','结论'], titleLabel:'报告标题', pro:true },
  { id:'commerce', title:'商品详情长图', subtitle:'卖点分区 / 多图介绍', scenario:'商品详情、二手发布和团购介绍', value:'批量换图并高清导出长图', tone:'sand', cells:6, ratio:'3:4', categories:['热门','电商','办公'], titleLabel:'商品名称', pro:true },
];

function getTemplateInputLabel(template: TemplateTheme) {
  if (template.kind === 'nine-slice') return '1 张完整图 · 输出 9 张';
  if (template.kind === 'repeat-photo') return '1 张人像 · 自动排 6 张';
  return `${template.cells} 张照片 · ${template.ratio}`;
}

function TemplateArt({ template, spacing = 4, radius = 7, photos = [], showSlots = false, titleText }: { template: TemplateTheme; spacing?: number; radius?: number; photos?: PickedPhoto[]; showSlots?: boolean; titleText?: string }) {
  const isNineSlice = template.kind === 'nine-slice';
  return <div className={`template-art ${template.tone}`} style={{ gap:spacing }}><strong>{titleText?.trim() || template.title}</strong><span>{template.subtitle}</span><div className={`template-cells cells-${template.cells}`}>{Array.from({ length: template.cells }, (_, index) => {
    const photo = photos.length ? (isNineSlice ? photos[0] : photos[index % photos.length]) : undefined;
    const column = index % 3;
    const row = Math.floor(index / 3);
    const slotText = template.cellLabels?.[index] ?? (template.numbered || (showSlots && !photo) ? String(index + 1) : '');
    const photoStyle = photo?.url ? { backgroundImage:`url(${photo.url})`, ...(isNineSlice ? { backgroundSize:'300% 300%', backgroundPosition:`${column * 50}% ${row * 50}%` } : {}) } : undefined;
    return <i key={index} className={`${photo ? `photo-tone-${photo.tone}` : ''} ${isNineSlice ? 'nine-slice-cell' : ''}`} style={{ borderRadius:radius, ...photoStyle }}><b /><em />{slotText ? <small className={template.cellLabels?.[index] ? 'cell-label' : 'cell-number'}>{slotText}</small> : null}</i>;
  })}</div></div>;
}

function TemplatesScreen({ onSelect, onUpgrade, onBack }: { onSelect: (id: string) => void; onUpgrade: () => void; onBack: () => void }) {
  const [filter, setFilter] = useState('全部');
  const [accessFilter, setAccessFilter] = useState<'全部' | '免费' | 'VIP'>('全部');
  const visibleTemplates = templateThemes.filter((template) => {
    const matchesCategory = filter === '全部' || template.categories.includes(filter);
    const matchesAccess = accessFilter === '全部' || (accessFilter === 'VIP' ? template.pro : !template.pro);
    return matchesCategory && matchesAccess;
  });
  const featuredTemplate = templateThemes.find((template) => template.id === 'nine-slice') ?? templateThemes[0];
  return (
    <div className="screen-scroll app-screen templates-screen">
      <ScreenHeader title="模板" back onBack={onBack} trailing={<button className="vip-pill" aria-label="打开会员购买页" onClick={onUpgrade}><Crown size={13} fill="currentColor" />VIP</button>} />
      <button className="template-featured" onClick={() => onSelect(featuredTemplate.id)}><span><em><Crown size={11} fill="currentColor" />本周热门</em><strong>一张照片，铺满九宫格</strong><small>自动切成 9 张并标好顺序，发布后仍是一幅完整画面。</small><b>使用模板 <ArrowRight size={14} /></b></span><TemplateArt template={featuredTemplate} /></button>
      <div className="template-access-tabs" aria-label="模板权限筛选">
        <button className={accessFilter === '全部' ? 'active' : ''} onClick={() => setAccessFilter('全部')}>全部</button>
        <button className={accessFilter === '免费' ? 'active' : ''} onClick={() => setAccessFilter('免费')}>免费</button>
        <button className={accessFilter === 'VIP' ? 'active' : ''} onClick={() => setAccessFilter('VIP')}>VIP</button>
      </div>
      <div className="filter-pills">{['全部','九宫格','教程','社交','办公','反馈','证件照','电商'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="section-title template-title"><h2>{filter === '全部' ? '精选模板' : filter}</h2><span className="section-count">{visibleTemplates.length} 款</span></div>
      <div className="template-grid">{visibleTemplates.map((template) => <button key={template.id} className={template.pro ? 'template-card-vip' : 'template-card-free'} onClick={() => onSelect(template.id)} aria-label={`使用${template.pro ? 'VIP' : '免费'}${template.title}模板`}><TemplateArt template={template} /><span className="template-card-copy"><strong>{template.title}</strong><small>{template.scenario}</small>{template.pro ? <b>{template.value}</b> : null}</span>{template.pro ? <em><Crown size={9} fill="currentColor" />VIP</em> : <i>免费</i>}</button>)}</div>
      {!visibleTemplates.length ? <div className="template-empty"><LayoutTemplate size={28} /><strong>当前分类暂无模板</strong><small>切换上方权限或场景筛选查看其他模板。</small></div> : null}
    </div>
  );
}

function TemplateEditor({ id, onBack, notify, onUpgrade, subscribed }: { id: string; onBack: () => void; notify: (message: string) => void; onUpgrade: () => void; subscribed: boolean }) {
  const template = templateThemes.find((item) => item.id === id) ?? templateThemes[0];
  const isNineSlice = template.kind === 'nine-slice';
  const isRepeatPhoto = template.kind === 'repeat-photo';
  const isSinglePhotoTemplate = isNineSlice || isRepeatPhoto;
  const [ratio, setRatio] = useState(template.ratio);
  const [spacing, setSpacing] = useState(5);
  const [radius, setRadius] = useState(9);
  const [titleText, setTitleText] = useState('');
  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const backGesture = useEdgeSwipeBack(onBack);
  const hasContent = Boolean(photos.length);
  const requiresUpgrade = Boolean(template.pro && !subscribed);
  const startContentEntry = () => setPickerOpen(true);
  const generatePreview = () => {
    if (!hasContent) { startContentEntry(); return; }
    setSaved(true);
    setExported(false);
    notify('预览已生成，可以保存或分享');
  };
  const rotatePhotos = () => {
    if (photos.length < 2) return;
    setPhotos((current) => [...current.slice(1), current[0]]);
    setSaved(false);
    setExported(false);
    notify('照片顺序已调整');
  };
  return (
    <div className={`screen-scroll app-screen detail-screen template-editor-screen ${saved ? 'result-workspace' : 'editing-workspace'}`} {...backGesture}>
      <ScreenHeader title={saved ? '预览' : template.title} back onBack={onBack} trailing={<button className="text-action" onClick={saved ? onBack : hasContent ? generatePreview : startContentEntry}>{saved ? '完成' : hasContent ? '预览' : '选照片'}</button>} />
      <div className="template-editor-meta"><span className={template.pro ? 'vip' : 'free'}>{template.pro ? <><Crown size={11} fill="currentColor" />VIP</> : '免费'}</span><p>{template.scenario}</p><small>{getTemplateInputLabel(template)}</small></div>
      <div className={`collage-preview ratio-${ratio.replace(':','-')}`}><TemplateArt template={template} spacing={spacing} radius={radius} photos={photos} showSlots={!photos.length} titleText={titleText} /></div>
      {saved ? <>
        <div className={`share-panel ${requiresUpgrade ? 'vip-export-panel' : ''}`}><h3>{requiresUpgrade ? '解锁高清成品' : '成品已生成'}</h3><p>{requiresUpgrade ? `${template.value} · 无水印导出` : isNineSlice ? '已输出 9 张连续切图' : isRepeatPhoto ? '六寸相纸冲印版' : `${photos.length} 张照片 · ${ratio}`}</p>{requiresUpgrade ? <div className="vip-preview-benefits"><span><Check size={14} />高清无水印</span><span><Check size={14} />保存与分享</span></div> : <div><button onClick={() => notify('已复制图片')}><Copy size={19} />复制</button><button onClick={() => notify('系统分享面板已打开')}><Share2 size={19} />分享</button><button onClick={() => notify('图片已存入“文件”')}><FileText size={19} />存入文件</button><button onClick={() => { setExported(true); notify('图片已保存到照片'); }}><Download size={19} />存入照片</button></div>}</div>
        <div className="template-result-actions"><button className="secondary-button" onClick={() => { setSaved(false); setExported(false); }}>返回编辑</button><button className={`primary-button ${exported ? 'completed' : ''} ${requiresUpgrade ? 'vip-save' : ''}`} onClick={() => { if (requiresUpgrade) onUpgrade(); else { setExported(true); notify(exported ? '图片已经保存' : '图片已保存到照片'); } }}>{requiresUpgrade ? <Crown size={18} fill="currentColor" /> : <Download size={18} />}{requiresUpgrade ? '开通 VIP 并保存' : exported ? '已保存到照片' : '保存图片'}</button></div>
      </> : <div className="editor-panel collage-controls">
        {template.titleLabel ? <label className="generic-input template-title-input"><span>{template.titleLabel}</span><input name={`template-${template.id}-title`} autoComplete="off" value={titleText} placeholder={`输入${template.titleLabel}…`} onChange={(event) => { setTitleText(event.target.value); setSaved(false); setExported(false); }} /></label> : null}
        <button className="replace-photos-button" onClick={() => setPickerOpen(true)}><Images size={18} /><span><strong>{photos.length ? (isSinglePhotoTemplate ? '更换照片' : `已选择 ${photos.length} 张`) : (isNineSlice ? '选择完整图片' : isRepeatPhoto ? '选择证件照' : '选择照片')}</strong><small>{isNineSlice ? '自动切为九宫格' : isRepeatPhoto ? '自动生成冲印排版' : `建议选择 ${template.cells} 张`}</small></span><ChevronRight size={16} /></button>
        {photos.length && !isSinglePhotoTemplate ? <div className="photo-order-panel"><div><strong>照片顺序</strong><button disabled={photos.length < 2} onClick={rotatePhotos}>向前轮换</button></div><div>{photos.map((photo, index) => <span key={photo.id}><ShotPreview shot={photo} /><small>{index + 1}</small></span>)}</div></div> : null}
        {isSinglePhotoTemplate ? <div className="template-fixed-layout"><span>{isNineSlice ? '9' : '6'}</span><div><strong>{isNineSlice ? '9 张正方形图片' : '六寸相纸排版'}</strong><small>{isNineSlice ? '按发布顺序编号' : '包含标准裁切间距'}</small></div></div> : <><span className="control-label">画布比例</span><div className="ratio-tabs">{['1:1','4:3','3:4','16:9'].map((item) => <button key={item} className={ratio === item ? 'active' : ''} onClick={() => { setRatio(item); setExported(false); }}>{item}</button>)}</div><label className="range-row"><span>图片间距</span><input type="range" min="0" max="16" value={spacing} onChange={(event) => { setSpacing(Number(event.target.value)); setExported(false); }} /><strong>{spacing}px</strong></label><label className="range-row"><span>图片圆角</span><input type="range" min="0" max="22" value={radius} onChange={(event) => { setRadius(Number(event.target.value)); setExported(false); }} /><strong>{radius}px</strong></label></>}
        <button className="primary-button" disabled={!photos.length} onClick={generatePreview}><Sparkles size={18} />生成预览</button>
      </div>}
      <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={(pickedPhotos) => { setPhotos(pickedPhotos); setSaved(false); setExported(false); notify(isNineSlice ? '原图已自动切成 9 张并标记顺序' : isRepeatPhoto ? '证件照已自动排成冲印版' : `已填充 ${pickedPhotos.length} 张照片`); }} max={isSinglePhotoTemplate ? 1 : template.cells} multiple={!isSinglePhotoTemplate} />
    </div>
  );
}

function PurchaseScreen({ onBack, notify, subscribed, onSubscribe }: { onBack: () => void; notify: (message: string) => void; subscribed: boolean; onSubscribe: () => void }) {
  const [billing, setBilling] = useState<'year' | 'month'>('year');
  const backGesture = useEdgeSwipeBack(onBack);
  const purchase = () => {
    onSubscribe();
    notify('VIP 权益已解锁');
  };
  return (
    <div className="screen-scroll app-screen purchase-screen" {...backGesture}>
      <ScreenHeader title="VIP 会员" back onBack={onBack} trailing={subscribed ? <button className="text-action" onClick={onBack}>完成</button> : null} />
      <section className={`purchase-hero ${subscribed ? 'active' : ''}`}>
        <span className="purchase-crown">{subscribed ? <Check size={31} strokeWidth={2.7} /> : <Crown size={31} fill="currentColor" />}</span>
        <h1>{subscribed ? 'VIP 已开通' : '解锁更多本机处理能力'}</h1>
        <p>{subscribed ? '当前 iOS 高级功能现已可用' : '先预览高级结果，再决定是否开通'}</p>
      </section>
      <div className="purchase-showcase" aria-label="VIP 成品示例"><ResultArtwork kind="longshot" /><ResultArtwork kind="ninegrid" /><ResultArtwork kind="idphoto" /></div>
      <section className="purchase-benefit-list" aria-label="VIP 权益">
        <div><span><PanelsTopLeft size={19} /></span><p><strong>高级长截图</strong><small>处理更多截图，自动清理重复栏并超清导出</small></p><Check size={17} /></div>
        <div><span><ShieldCheck size={19} /></span><p><strong>批量隐私处理</strong><small>一次检查多张截图中的头像、号码和二维码</small></p><Check size={17} /></div>
        <div><span><ScanText size={19} /></span><p><strong>多页 OCR 与 PDF</strong><small>多页扫描、提取文字并保存为 PDF</small></p><Check size={17} /></div>
        <div><span><Download size={19} /></span><p><strong>超清无水印导出</strong><small>保存高清 PNG、JPG、WebP 和模板成品</small></p><Check size={17} /></div>
        <div><span><LayoutTemplate size={19} /></span><p><strong>专业模板</strong><small>解锁九宫格切图、教程和证件照冲印</small></p><Check size={17} /></div>
      </section>
      {!subscribed ? <>
        <div className="purchase-plans" aria-label="选择会员套餐">
          <button className={billing === 'year' ? 'active' : ''} aria-pressed={billing === 'year'} onClick={() => setBilling('year')}><em>推荐</em><strong>年度会员</strong><span><b>38</b> 元 / 年</span><small>约 3.2 元 / 月</small><i><Check size={12} /></i></button>
          <button className={billing === 'month' ? 'active' : ''} aria-pressed={billing === 'month'} onClick={() => setBilling('month')}><strong>月度会员</strong><span><b>18</b> 元 / 月</span><small>按月续订，随时取消</small><i><Check size={12} /></i></button>
        </div>
        <button className="primary-button orange-button purchase-button" onClick={purchase}><Crown size={18} fill="currentColor" />开通{billing === 'year' ? '年度会员 · 38 元' : '月度会员 · 18 元'}</button>
        <button className="restore-purchase" onClick={() => { onSubscribe(); notify('购买已恢复，VIP 权益已解锁'); }}>恢复购买</button>
        <p className="purchase-terms">确认后将通过 App Store 付款，可随时在系统设置中取消订阅</p>
      </> : <>
        <button className="primary-button completed purchase-button" onClick={onBack}><Check size={18} />开始使用</button>
        <button className="restore-purchase" onClick={() => notify('会员管理已打开')}>管理订阅</button>
      </>}
      <div className="purchase-links"><button onClick={() => notify('服务协议已打开')}>服务协议</button><span>·</span><button onClick={() => notify('隐私政策已打开')}>隐私政策</button></div>
    </div>
  );
}

function ProfileScreen({ notify, onOpenTool, theme, onThemeChange, subscribed, onUpgrade }: { notify: (message: string) => void; onOpenTool: (id: ToolId) => void; theme: Theme; onThemeChange: (theme: Theme) => void; subscribed: boolean; onUpgrade: () => void }) {
  const toolNames: Record<ToolId, string> = { redact:'智能打码', ocr:'文档扫描', clean:'截图净化', annotate:'图片标注', compare:'图片对比', idphoto:'证件照', qrcode:'二维码工具', export:'导出中心' };
  const menu = [
    ['我的模板','收藏与未完成的排版',LayoutGrid],['我的证件照','查看已保存的证件照',BadgeCheck],
  ] as Array<[string,string,LucideIcon]>;
  const openPreferences = () => {
    document.getElementById('profile-preferences')?.scrollIntoView({ behavior:'smooth', block:'start' });
    notify('已定位到偏好设置');
  };
  return (
    <div className="screen-scroll app-screen profile-screen">
      <ScreenHeader large title="我的" trailing={<button className="icon-button" onClick={openPreferences} aria-label="打开偏好设置"><Settings size={20} /></button>} />
      <section className="profile-projects-section">
        <div className="profile-section-heading">
          <span><strong>本机项目</strong><small>图片和编辑记录仅保存在本机</small></span>
          <button onClick={() => notify('已打开全部历史记录')}>全部 <ChevronRight size={15} /></button>
        </div>
        <button className="profile-featured-project" onClick={() => { onOpenTool(recent[0].tool); notify(`已继续编辑「${recent[0].name}」`); }}>
          <ResultArtwork kind={recent[0].tool} />
          <span>
            <small>最近编辑</small>
            <strong>{recent[0].name}</strong>
            <em>{toolNames[recent[0].tool]} · {recent[0].meta}</em>
            <b>继续编辑 <ArrowRight size={14} /></b>
          </span>
        </button>
        <div className="profile-project-list">
          {recent.slice(1).map((item) => (
            <button key={item.name} onClick={() => { onOpenTool(item.tool); notify(`已继续编辑「${item.name}」`); }}>
              <ResultArtwork kind={item.tool} />
              <span><strong>{item.name}</strong><small>{toolNames[item.tool]} · {item.meta}</small></span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <button className={`profile-vip-status ${subscribed ? 'active' : ''}`} onClick={subscribed ? () => notify('会员管理已打开') : onUpgrade}>
        <span>{subscribed ? <BadgeCheck size={21} /> : <Crown size={21} fill="currentColor" />}</span>
        <span><strong>{subscribed ? 'VIP 会员' : '截屏王 VIP'}</strong><small>{subscribed ? '本机高级工具与模板已解锁' : '高级长截图、批量隐私处理与专业模板'}</small></span>
        <span>{subscribed ? '管理订阅' : '了解权益'}<ChevronRight size={15} /></span>
      </button>

      <section className="profile-content-section">
        <div className="profile-section-heading"><span><strong>我的内容</strong><small>保存在本机的模板与照片</small></span></div>
        <div className="profile-menu">{menu.map(([title,hint,Icon]) => <button key={title} onClick={() => notify(`${title}已打开`)}><span><Icon size={18} /></span><span><strong>{title}</strong><small>{hint}</small></span><ChevronRight size={16} /></button>)}</div>
      </section>

      <section className="profile-preferences" id="profile-preferences">
        <div className="profile-section-heading"><span><strong>设置</strong><small>本机权限与导出偏好</small></span></div>
        <div className="appearance-card">
          <div><span><Palette size={18} /></span><span><strong>外观模式</strong><small>跟随系统，或手动切换</small></span></div>
          <ThemeSwitcher theme={theme} onChange={(value) => { onThemeChange(value); notify(`已切换为${value === 'system' ? '自动' : value === 'light' ? '浅色' : '深色'}模式`); }} />
        </div>
        <div className="profile-settings-list">
          <button onClick={() => notify('照片权限设置已打开')}><span><Images size={18} /></span><span><strong>照片权限</strong><small>仅访问你选择的照片</small></span><b>已允许</b><ChevronRight size={16} /></button>
          <button onClick={() => notify('导出设置已打开')}><span><Download size={18} /></span><span><strong>导出设置</strong><small>PNG · 高清 · 保留原始尺寸</small></span><ChevronRight size={16} /></button>
          <button className="destructive" onClick={() => notify('清理前会再次确认，不会删除原图')}><span><Trash2 size={18} /></span><span><strong>清理历史</strong><small>移除本机编辑记录，不删除原图</small></span><ChevronRight size={16} /></button>
          <button onClick={() => notify('帮助与反馈已打开')}><span><FileText size={18} /></span><span><strong>帮助与反馈</strong><small>使用说明与问题反馈</small></span><ChevronRight size={16} /></button>
        </div>
      </section>
      <div className="profile-links"><button onClick={() => notify('服务协议已打开')}>服务协议</button><span>·</span><button onClick={() => notify('隐私政策已打开')}>隐私政策</button><span>·</span><button onClick={() => notify('关于截屏王')}>关于我们</button></div>
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
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(false);
  const [appearanceReady, setAppearanceReady] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };
  const navigate = (tab: Tab) => { setPurchaseOpen(false); setTemplateLibraryOpen(false); setActiveTool(null); setActiveTemplate(null); setActiveTab(tab); };
  const openTool = (id: ToolId) => { setPurchaseOpen(false); setTemplateLibraryOpen(false); setActiveTemplate(null); setActiveTab('tools'); setActiveTool(id); };
  const openTemplate = (id: string) => { setPurchaseOpen(false); setTemplateLibraryOpen(false); setActiveTool(null); setActiveTab('tools'); setActiveTemplate(id); };
  const openTemplateLibrary = () => { setPurchaseOpen(false); setActiveTool(null); setActiveTemplate(null); setActiveTab('tools'); setTemplateLibraryOpen(true); };
  const openPurchase = () => setPurchaseOpen(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncInitialAppearance = window.setTimeout(() => {
      const savedTheme = window.localStorage.getItem('screenshot-king-theme');
      if (savedTheme === 'system' || savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
      setSystemDark(media.matches);
      setAppearanceReady(true);
    }, 0);
    const syncSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', syncSystemTheme);
    return () => {
      window.clearTimeout(syncInitialAppearance);
      media.removeEventListener('change', syncSystemTheme);
    };
  }, []);

  useEffect(() => {
    if (!appearanceReady) return;
    const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    window.localStorage.setItem('screenshot-king-theme', theme);
  }, [appearanceReady, theme, systemDark]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContextLike }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<ModelContextLike['registerTool']>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* Unsupported preview context. */ }
    };
    register({
      name: 'navigate_screenshot_king', title: '打开截屏王模块', description: '切换到首页、长截图、工具或我的页面。',
      inputSchema: { type:'object', properties:{ tab:{ type:'string', enum:navItems.map((item) => item.id) } }, required:['tab'], additionalProperties:false },
      annotations: { readOnlyHint:false, untrustedContentHint:false },
      execute(input) { const tab = (input as { tab?: string }).tab; if (!navItems.some((item) => item.id === tab)) throw new Error('未知模块'); navigate(tab as Tab); return { activeTab:tab }; },
    });
    register({
      name: 'start_screenshot_tool', title: '打开图片处理工具', description: '直接打开智能打码、文档扫描、截图净化、图片对比等工具。',
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
  if (purchaseOpen) screen = <PurchaseScreen onBack={() => setPurchaseOpen(false)} notify={notify} subscribed={subscribed} onSubscribe={() => setSubscribed(true)} />;
  else if (activeTool) screen = <ToolDetail key={activeTool} id={activeTool} onBack={() => setActiveTool(null)} notify={notify} onUpgrade={openPurchase} subscribed={subscribed} />;
  else if (activeTemplate) screen = <TemplateEditor id={activeTemplate} onBack={() => setActiveTemplate(null)} notify={notify} onUpgrade={openPurchase} subscribed={subscribed} />;
  else if (templateLibraryOpen) screen = <TemplatesScreen onSelect={openTemplate} onUpgrade={openPurchase} onBack={() => setTemplateLibraryOpen(false)} />;
  else if (activeTab === 'home') screen = <HomeScreen onNavigate={navigate} onOpenTool={openTool} notify={notify} />;
  else if (activeTab === 'longshot') screen = <LongShotScreen notify={notify} />;
  else if (activeTab === 'tools') screen = <ToolsScreen onOpenTool={openTool} onOpenTemplates={openTemplateLibrary} />;
  else screen = <ProfileScreen notify={notify} onOpenTool={openTool} theme={theme} onThemeChange={setTheme} subscribed={subscribed} onUpgrade={openPurchase} />;

  const showNav = !activeTool && !activeTemplate && !purchaseOpen;
  return (
    <main className="site-shell">
      <section className="brand-panel" aria-label="产品介绍">
        <div className="brand-top"><div className="brand-lockup"><AppLogo /><span><strong>截屏王</strong><small>Screenshot King</small></span></div><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
        <div className="brand-copy"><span className="brand-tag">本机智能截图工作台</span><h2>让每一次截屏，<br />都成为<span>清晰表达。</span></h2><p>自动理解截图内容，再完成拼接、净化、识别与分享。</p></div>
        <div className="brand-gallery" aria-hidden="true"><span className="brand-gallery-main"><ResultArtwork kind="longshot" /><b>聊天记录 · 自动拼接</b></span><span><ResultArtwork kind="ninegrid" /><b>社交九宫格</b></span><span><ResultArtwork kind="idphoto" /><b>标准证件照</b></span></div>
        <div className="feature-chips"><span><FileScan size={16} /> 智能识别</span><span><LockKeyhole size={16} /> 隐私保护</span><span><Images size={16} /> 本地处理</span></div>
      </section>
      <section className="device-stage">
        <div className="device-glow" />
        <div className="phone-shell">
          <div className="phone-screen">
            <div className="statusbar"><strong>9:41</strong><span className="dynamic-island" /><span className="signal"><span className="cellular" aria-hidden="true"><i /><i /><i /><i /></span><Wifi size={14} strokeWidth={2.6} /><BatteryMedium size={19} strokeWidth={2.4} /></span></div>
            <aside className="tablet-sidebar" aria-label="iPad 主导航">
              <div className="tablet-brand"><AppLogo /><span><strong>截屏王</strong><small>iPad 工作台</small></span></div>
              <button className="tablet-create" onClick={() => navigate('longshot')}><Plus size={18} />新建长截图</button>
              <nav>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return <button key={item.id} className={activeTab === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={20} /><span>{item.label}</span>{activeTab === item.id ? <ChevronRight size={16} /> : null}</button>;
                })}
              </nav>
              <div className="tablet-library"><span>资料库</span><button onClick={() => { navigate('profile'); notify('已打开历史记录'); }}><History size={17} />历史记录</button><button onClick={() => { openTemplateLibrary(); notify('已打开模板'); }}><LayoutGrid size={17} />模板</button></div>
              <div className="tablet-theme"><span>外观</span><ThemeSwitcher theme={theme} onChange={setTheme} /></div>
            </aside>
            <div className={`page-area ${showNav ? '' : 'full'}`}>{screen}</div>
            {showNav ? <nav className="bottom-nav" aria-label="主导航">{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={activeTab === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={21} /><span>{item.label}</span></button>; })}</nav> : null}
            {toast ? <output className="toast" aria-live="polite"><Check size={15} />{toast}</output> : null}
            <span className="home-indicator" />
          </div>
        </div>
      </section>
    </main>
  );
}
