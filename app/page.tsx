'use client';

import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  BatteryMedium,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crop,
  Crown,
  Download,
  Droplet,
  FileImage,
  FileScan,
  FileText,
  Grid2X2,
  Highlighter,
  History,
  Home,
  ImageDown,
  ImagePlus,
  Images,
  LayoutGrid,
  LayoutTemplate,
  Link2,
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
  WandSparkles,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { PhotoPicker, type PickedPhoto } from '@/components/photo-picker';

type Tab = 'home' | 'longshot' | 'tools' | 'profile';
type ToolId = 'redact' | 'ocr' | 'annotate' | 'idphoto' | 'watermark' | 'compress' | 'qrcode' | 'format';
type Theme = 'system' | 'light' | 'dark';
type Shot = PickedPhoto;

const navItems: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'longshot', label: '长截图', icon: PanelsTopLeft },
  { id: 'tools', label: '工具', icon: Grid2X2 },
  { id: 'profile', label: '我的', icon: UserRound },
];

const homeToolCards: Array<{ id: ToolId; label: string; hint: string; scene: string; icon: LucideIcon }> = [
  { id: 'redact', label: '智能打码', hint: '自动隐藏隐私', scene: '头像 · 昵称 · 手机号', icon: ShieldCheck },
  { id: 'ocr', label: '图片转文字', hint: '保留段落结构', scene: '支持复制与导出', icon: ScanText },
  { id: 'annotate', label: '图片标注', hint: '突出重点内容', scene: '箭头 · 编号 · 高亮', icon: WandSparkles },
  { id: 'idphoto', label: '证件照', hint: '自动构图换底色', scene: '一寸 · 二寸 · 考试', icon: BadgeCheck },
];

const toolGroups: Array<{ title: string; items: Array<{ id: ToolId; label: string; hint: string; icon: LucideIcon; color: string; pro?: boolean }> }> = [
  {
    title: '图像处理',
    items: [
      { id: 'redact', label: '智能打码', hint: '自动识别头像、号码和二维码', icon: ShieldCheck, color: 'violet' },
      { id: 'ocr', label: '图片转文字', hint: '提取文字并保留段落结构', icon: ScanText, color: 'mint' },
      { id: 'idphoto', label: '证件照', hint: '自动抠图、换底和标准尺寸', icon: BadgeCheck, color: 'blue' },
      { id: 'annotate', label: '图片标注', hint: '添加箭头、文字、编号和高亮', icon: SquarePen, color: 'orange' },
    ],
  },
  {
    title: '实用工具',
    items: [
      { id: 'qrcode', label: '制作二维码', hint: '将链接或文字生成二维码', icon: QrCode, color: 'blue' },
      { id: 'compress', label: '图片压缩', hint: '明显减小体积，保持画面清晰', icon: ImageDown, color: 'mint' },
      { id: 'format', label: '高清格式转换', hint: '转换 JPG、PNG、WebP 并保留尺寸', icon: FileImage, color: 'violet', pro: true },
      { id: 'watermark', label: '添加水印', hint: '调整文字、透明度和位置', icon: Droplet, color: 'orange' },
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

function ResultArtwork({ kind }: { kind: ResultArtworkKind }) {
  const iconMap: Record<ResultArtworkKind, LucideIcon> = {
    longshot: PanelsTopLeft,
    redact: ShieldCheck,
    ocr: ScanText,
    annotate: SquarePen,
    idphoto: BadgeCheck,
    watermark: Droplet,
    compress: ImageDown,
    qrcode: QrCode,
    format: FileImage,
    ninegrid: Grid2X2,
    commerce: Images,
  };
  const Icon = iconMap[kind];
  return (
    <span className={`result-art result-art-${kind}`} aria-hidden="true">
      <span className="result-art-glow" />
      {kind === 'longshot' ? <span className="art-longshot"><i /><i /><i /><b>4 → 1</b></span> : null}
      {kind === 'redact' ? <span className="art-redact"><i /><i /><b /><i /><em /></span> : null}
      {kind === 'ocr' ? <span className="art-ocr"><i /><i /><i /><i /><b>TEXT</b></span> : null}
      {kind === 'annotate' ? <span className="art-annotate"><i /><i /><i /><b>↗</b><em>1</em></span> : null}
      {kind === 'idphoto' ? <span className="art-idphoto"><i><UserRound size={22} /></i><i><UserRound size={22} /></i><i><UserRound size={22} /></i></span> : null}
      {kind === 'compress' ? <span className="art-compress"><i>4.8 MB</i><ArrowRight size={14} /><b>980 KB</b></span> : null}
      {kind === 'qrcode' ? <span className="art-qrcode"><QrCode size={52} /><b>扫码查看</b></span> : null}
      {kind === 'format' ? <span className="art-format"><i>PNG</i><ArrowRight size={14} /><b>WEBP</b></span> : null}
      {kind === 'watermark' ? <span className="art-watermark"><i /><b>© 截屏王</b></span> : null}
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

function HomeScreen({ onNavigate, onOpenTool, notify }: { onNavigate: (tab: Tab) => void; onOpenTool: (id: ToolId) => void; notify: (message: string) => void }) {
  return (
    <div className="screen-scroll home-screen">
      <header className="topbar">
        <h1>截屏王</h1>
        <div className="top-actions">
          <button className="top-sync-button" aria-label="连接 Mac" onClick={() => notify('Mac 同步已打开')}><Monitor size={19} /><span>Mac</span></button>
          <button className="icon-button" aria-label="设置" onClick={() => onNavigate('profile')}><Settings size={21} /></button>
        </div>
      </header>

      <section className="hero-card smart-task-card">
        <span className="hero-orb hero-orb-one" /><span className="hero-orb hero-orb-two" />
        <span className="hero-copy">
          <span className="hero-kicker"><Sparkles size={15} /> 发现 6 张连续截图</span>
          <strong>看起来是一段聊天记录</strong>
          <small>可自动排序、去重并拼成长图</small>
          <span className="hero-actions"><button onClick={() => onNavigate('longshot')}>立即拼接</button><button onClick={() => notify('已保留这组截图')}>稍后处理</button></span>
        </span>
        <span className="hero-visual"><ResultArtwork kind="longshot" /><b className="hero-detected">已识别 6 张</b></span>
      </section>

      <section className="section-block">
        <div className="section-title"><h2>常用工具</h2><button onClick={() => onNavigate('tools')}>全部工具 <span>›</span></button></div>
        <div className="tool-grid">
          {homeToolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} className="tool-card" onClick={() => onOpenTool(tool.id)}>
                <span className="tool-card-copy"><span className="tool-icon blue"><Icon size={20} /></span><span><strong>{tool.label}</strong><small>{tool.hint}</small></span></span>
                <span className="tool-card-scene">{tool.scene}</span>
              </button>
            );
          })}
        </div>
      </section>
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
  const stitchTimer = useRef<number | null>(null);
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

  const moveShot = (index: number, offset: -1 | 1) => {
    setShots((current) => {
      const destination = index + offset;
      if (destination < 0 || destination >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
      return reordered;
    });
  };

  const startStitching = () => {
    if (shots.length < 2 || isStitching) return;
    setIsStitching(true);
    setSaved(false);
    stitchTimer.current = window.setTimeout(() => {
      setIsStitching(false);
      setStitched(true);
      notify('已智能识别并消除重叠区域');
    }, 900);
  };

  useEffect(() => () => {
    if (stitchTimer.current) window.clearTimeout(stitchTimer.current);
  }, []);

  if (stitched) {
    return (
      <div className="screen-scroll app-screen longshot-screen" {...resultBackGesture}>
        <ScreenHeader title="导出长图" back onBack={leaveResult} trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
        <div className={`result-status ${saved ? 'saved' : ''}`}><span><Check size={15} /></span><div><strong>{saved ? '已存入照片' : '拼接完成'}</strong><small>{saved ? '长图已保存在本机相册' : '已自动消除重叠区域'}</small></div></div>
        <div className="long-result">{shots.map((shot) => <ShotPreview key={shot.id} shot={shot} tall />)}</div>
        <div className="result-insights"><span><strong>{shots.length}</strong><small>张截图</small></span><span><strong>3</strong><small>处重叠</small></span><span><strong>42%</strong><small>空间节省</small></span></div>
        <div className="settings-card compact">
          <div className="settings-row"><span>导出尺寸</span><strong>1080px <ChevronRight size={15} /></strong></div>
          <div className="settings-row"><span>输出质量</span><select aria-label="输出质量" value={quality} onChange={(event) => setQuality(event.target.value)}><option>高清</option><option>标准</option><option>超清 VIP</option></select></div>
          <div className="settings-row"><span>文件信息</span><strong>PNG · {(shots.length * 0.7 + 0.4).toFixed(1)} MB</strong></div>
        </div>
        <button className={`primary-button ${saved ? 'completed' : ''}`} onClick={() => { setSaved(true); notify(`长图已按${quality}质量存入照片`); }}><Download size={18} /> {saved ? '已保存到照片' : '保存长图'}</button>
        <div className="split-actions"><button onClick={() => notify('PDF 已生成并存入文件')}><FileText size={17} /> 导出 PDF</button><button onClick={leaveResult}><SquarePen size={17} /> 继续编辑</button></div>
      </div>
    );
  }

  return (
    <div className="screen-scroll app-screen longshot-screen">
      <ScreenHeader large title="长截图" trailing={<button className="icon-button" onClick={() => notify('长截图设置已打开')} aria-label="长截图设置"><Settings size={20} /></button>} />
      <div className="segmented-control">
        <button className={mode === 'image' ? 'active' : ''} onClick={() => setMode('image')}>添加截图</button>
        <button className={mode === 'recording' ? 'active' : ''} onClick={() => setMode('recording')}>录屏转长图</button>
      </div>
      <section className="longshot-story"><ResultArtwork kind="longshot" /><span><small>智能识别重叠区域</small><strong>{shots.length} 张截图，会变成 1 张完整长图</strong><p>自动排序、裁掉重复内容，聊天记录和网页都能顺滑衔接。</p></span></section>
      <div className="shot-toolbar">
        <div><strong>{mode === 'image' ? `${shots.length} 张截图` : '关键画面'}</strong></div>
        <span><button disabled={shots.length < 2} onClick={() => { setShots((current) => [...current].sort((left, right) => left.id - right.id)); notify('已按拍摄时间排序'); }}>自动排序</button><button className="shot-add-button" disabled={shots.length >= 8} onClick={() => setPickerOpen(true)}><ImagePlus size={16} />添加</button></span>
      </div>
      <div className="shot-list">
        {shots.map((shot, index) => (
          <div className="shot-row" key={shot.id}>
            <strong className="shot-index">{String(index + 1).padStart(2, '0')}</strong>
            <ShotPreview shot={shot} />
            <span className="shot-copy"><strong>{shot.name}</strong><small>{shot.meta}</small></span>
            <span className="overlap-badge">{index ? `重叠 ${12 + index * 3}%` : '起始'}</span>
            <span className="shot-order-actions">
              <button disabled={!index} aria-label={`上移 ${shot.name}`} onClick={() => moveShot(index, -1)}><ArrowUp size={15} /></button>
              <button disabled={index === shots.length - 1} aria-label={`下移 ${shot.name}`} onClick={() => moveShot(index, 1)}><ArrowDown size={15} /></button>
              <button className="delete" aria-label={`删除 ${shot.name}`} onClick={() => { setShots((current) => current.filter((item) => item.id !== shot.id)); notify(`已移除 ${shot.name}`); }}><Trash2 size={15} /></button>
            </span>
          </div>
        ))}
        {!shots.length ? <button className="empty-drop" onClick={() => setPickerOpen(true)}><ImagePlus size={28} /><strong>选择截图</strong><small>最多添加 8 张</small></button> : null}
      </div>
      <button className="primary-button" disabled={shots.length < 2 || isStitching} onClick={startStitching}>{isStitching ? <LoaderCircle className="spinner" size={18} /> : <Sparkles size={18} />} {isStitching ? '正在分析重叠区域…' : '开始自动拼接'}</button>
      <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={addPhotos} max={Math.max(1, 8 - shots.length)} />
    </div>
  );
}

function ToolsScreen({ onOpenTool, onOpenTemplates }: { onOpenTool: (id: ToolId) => void; onOpenTemplates: () => void }) {
  const [search, setSearch] = useState('');
  const matches = (label: string, hint: string) => `${label}${hint}`.toLowerCase().includes(search.trim().toLowerCase());
  return (
    <div className="screen-scroll app-screen tools-screen">
      <ScreenHeader large title="工具箱" trailing={<span className="vip-pill"><Crown size={13} fill="currentColor" />VIP</span>} />
      <label className="search-field"><Search size={17} /><input name="tool-search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索工具…" aria-label="搜索工具" />{search ? <button onClick={() => setSearch('')}>清除</button> : null}</label>
      {!search ? <button className="tool-featured" onClick={() => onOpenTool('redact')}><span><em>隐私分享必备</em><strong>发图前，先把敏感信息藏好</strong><small>自动找出头像、手机号和二维码，一次完成打码。</small><b>立即处理 <ArrowRight size={14} /></b></span><ResultArtwork kind="redact" /></button> : null}
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
      {!search ? <section className="section-block creative-tools-section"><div className="section-title"><h2>创作工具</h2></div><button className="creative-template-card" onClick={onOpenTemplates}><span><em>模板与拼图</em><strong>把截图排成可以直接分享的作品</strong><small>九宫格、操作教程、对比图与商品长图</small><b>浏览模板 <ArrowRight size={14} /></b></span><span className="creative-template-art"><ResultArtwork kind="ninegrid" /><ResultArtwork kind="commerce" /></span></button></section> : null}
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

function RedactTool({ notify }: { notify: (message: string) => void }) {
  const [method, setMethod] = useState('模糊');
  const [strength, setStrength] = useState(62);
  const [completed, setCompleted] = useState(false);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  return (
    <>
      <div className="detection-banner"><ShieldCheck size={17} /><strong>{!photo ? '选择图片后自动识别' : completed ? '处理完成' : '已识别 4 处隐私内容'}</strong>{photo ? <button onClick={() => setCompleted(false)}>重新识别</button> : null}</div>
      <div className={`chat-preview ${photo ? `photo-tone-${photo.tone}` : ''}`} style={photo?.url ? { backgroundImage: `linear-gradient(rgba(244,248,252,.82),rgba(244,248,252,.82)),url(${photo.url})` } : undefined}>
        {photo ? <span className="source-chip"><Images size={13} />{photo.name}</span> : null}
        <div className="chat-bubble left"><span className="avatar-mask" style={{ filter: method === '模糊' ? `blur(${strength / 12}px)` : undefined }} />周末一起去露营吧，地点我发你～</div>
        <div className="chat-bubble right">好呀，发我位置和联系方式吧</div>
        <div className="chat-bubble left">手机号：<b className={`redact-mark ${method}`}>138 8888 8888</b></div>
        <div className="location-card"><strong>大雁湖露营地</strong><small>广东省深圳市龙岗区大雁湖公园</small><span>◎</span></div>
        <div className={`qr-demo redact-mark ${method}`}><QrCode size={48} /></div>
      </div>
      <ImageInput selectedName={photo?.name} label={photo ? '更换图片' : '选择图片'} onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setCompleted(false); notify('已识别头像、手机号与二维码'); }} />
      <div className="editor-panel">
        <div className="method-tabs">{['模糊','马赛克','涂抹','色块'].map((item) => <button key={item} className={method === item ? 'active' : ''} onClick={() => setMethod(item)}>{item}</button>)}</div>
        <label className="range-row"><span>强度</span><input type="range" min="20" max="100" value={strength} onChange={(event) => setStrength(Number(event.target.value))} /><strong>{strength}%</strong></label>
        <button className="primary-button" disabled={!photo} onClick={() => { setCompleted(true); notify('全部隐私内容已安全打码'); }}><ShieldCheck size={18} />全部打码</button>
      </div>
    </>
  );
}

const ocrCopy = `人工智能发展趋势报告\n2026 年度\n\n一、概述\n人工智能正在全球范围内加速发展，已成为推动科技进步与产业变革的重要力量。\n\n二、关键趋势\n1. 大模型持续进化\n2. 应用场景加速落地\n3. 生态协同更加完善`;

function OcrTool({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [result, setResult] = useState(false);
  const [language, setLanguage] = useState('自动检测（中英混合）');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [batchPhotos, setBatchPhotos] = useState<PickedPhoto[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const sourceCount = mode === 'single' ? Number(Boolean(photo)) : batchPhotos.length;
  const changeMode = (nextMode: 'single' | 'batch') => { setMode(nextMode); setResult(false); };
  return (
    <>
      <div className="segmented-control tool-segment"><button className={mode === 'single' ? 'active' : ''} onClick={() => changeMode('single')}>图片识别</button><button className={mode === 'batch' ? 'active' : ''} onClick={() => changeMode('batch')}>批量识别</button></div>
      <label className="select-row"><span>识别语言</span><select name="ocr-language" value={language} onChange={(event) => { setLanguage(event.target.value); setResult(false); }}><option>自动检测（中英混合）</option><option>简体中文</option><option>English</option><option>日本語</option></select></label>
      <div className={`document-preview ${result ? 'recognized' : ''} ${mode === 'single' && photo ? `photo-tone-${photo.tone}` : ''}`} style={mode === 'single' && photo?.url ? { backgroundImage: `linear-gradient(rgba(255,255,255,.86), rgba(255,255,255,.86)), url(${photo.url})` } : undefined}>
        {sourceCount ? <span className="source-chip"><Images size={13} />{mode === 'single' ? photo?.name : `${batchPhotos.length} 张图片待识别`}</span> : null}
        {ocrCopy.split('\n').map((line, index) => <p key={index} className={line.includes('、') || /^\d\./.test(line) ? 'doc-title' : ''}>{line || ' '}</p>)}
        {result ? <><i className="scan-box b1" /><i className="scan-box b2" /><i className="scan-box b3" /></> : null}
      </div>
      {mode === 'single' ? <ImageInput selectedName={photo?.name} label="选择待识别图片" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setResult(false); notify('图片已导入，等待识别'); }} /> : <>
        <button className="mini-upload" onClick={() => setPickerOpen(true)}><ImagePlus size={17} /><span>{batchPhotos.length ? `已选择 ${batchPhotos.length} 张图片` : '选择多张图片'}</span><ChevronRight size={15} /></button>
        <PhotoPicker open={pickerOpen} onOpenChange={setPickerOpen} onPick={(photos) => { setBatchPhotos(photos); setResult(false); notify(`已加入 ${photos.length} 张图片`); }} max={5} />
      </>}
      {result ? <div className="ocr-actions"><button onClick={() => { void navigator.clipboard?.writeText(ocrCopy); notify('识别文字已复制'); }}><Copy size={17} />复制</button><button onClick={() => notify(`已导出 ${sourceCount} 份 TXT 文档`)}><FileText size={17} />导出 TXT</button><button onClick={() => notify('已导出 Markdown')}><Download size={17} />Markdown</button></div> : <button className="primary-button" disabled={!sourceCount} onClick={() => { setResult(true); notify(mode === 'batch' ? `${sourceCount} 张图片批量识别完成` : '识别完成，已保留文档结构'); }}><ScanText size={18} /> {mode === 'batch' ? `识别 ${sourceCount || ''} 张图片` : '开始识别'}</button>}
    </>
  );
}

function AnnotateTool({ notify }: { notify: (message: string) => void }) {
  const [mode, setMode] = useState('箭头');
  const [color, setColor] = useState('#ff3b30');
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
    <>
      <div className={`annotation-canvas ${photo ? `photo-tone-${photo.tone}` : ''}`} style={photo?.url ? { backgroundImage: `url(${photo.url})` } : undefined}>
        {!photo ? <div className="mock-list">{recent.map((item, index) => <div key={item.name}><ShotPreview shot={demoShots[index]} /><span><strong>{item.name}</strong><small>{item.meta}</small></span></div>)}</div> : <span className="canvas-photo-label">{photo.name}</span>}
        {mode === '箭头' ? <span className="annotation-arrow" style={{ color }}>↗</span> : null}
        {mode === '编号' ? <span className="annotation-number" style={{ background: color }}>1</span> : null}
        {mode === '高亮' ? <span className="annotation-highlight" style={{ background: color }} /> : null}
        {mode === '文字' ? <span className="annotation-text" style={{ color }}>重点信息</span> : null}
        {mode === '裁剪' ? <span className="crop-guide"><i /><i /><i /><i /></span> : null}
        {saved ? <span className="generated-badge"><Check size={14} />已保存</span> : null}
      </div>
      <ImageInput selectedName={photo?.name} label={photo ? '更换图片' : '选择图片'} onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setHistory([]); setRedoHistory([]); setSaved(false); notify('图片已导入编辑器'); }} />
      <div className="editor-panel">
        <div className="edit-history" aria-label="编辑历史"><span>编辑操作</span><div><button disabled={!history.length} onClick={undo} aria-label="撤销"><Undo2 size={17} />撤销</button><button disabled={!redoHistory.length} onClick={redo} aria-label="重做"><Redo2 size={17} />重做</button></div></div>
        <div className="annotation-tools">
          {[['箭头', ArrowRight], ['文字', TextCursorInput], ['编号', BadgeCheck], ['高亮', Highlighter], ['裁剪', Crop]].map(([label, ToolIcon]) => {
            const Icon = ToolIcon as LucideIcon;
            return <button key={label as string} className={mode === label ? 'active' : ''} onClick={() => chooseMode(label as string)}><Icon size={19} /><span>{label as string}</span></button>;
          })}
        </div>
        <div className="color-row">{['#ff3b30','#ff9500','#ffcc00','#16c779','#1765fa','#8b5cf6','#111827'].map((item) => <button aria-label={`选择颜色 ${item}`} key={item} className={color === item ? 'active' : ''} style={{ background:item }} onClick={() => { setColor(item); setSaved(false); }} />)}</div>
        <button className={`primary-button ${saved ? 'completed' : ''}`} disabled={!photo} onClick={() => { setSaved(true); notify('标注图片已保存到照片'); }}><Download size={18} /> {saved ? '已保存到照片' : '保存图片'}</button>
      </div>
    </>
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

function GenericTool({ id, notify, onUpgrade, subscribed }: { id: ToolId; notify: (message: string) => void; onUpgrade: () => void; subscribed: boolean }) {
  const [value, setValue] = useState(76);
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const [processed, setProcessed] = useState(false);
  const [inputValue, setInputValue] = useState(id === 'qrcode' ? 'https://example.com' : '截屏王原创');
  const [format, setFormat] = useState('PNG');
  const [position, setPosition] = useState('右下');
  const configs: Record<string, { icon: LucideIcon; title: string; hint: string; action: string; result: string }> = {
    compress: { icon: ImageDown, title: '图片压缩', hint: '缩小体积，保持画面清晰', action: '压缩图片', result: '已节省 64% 空间' },
    qrcode: { icon: QrCode, title: '制作二维码', hint: '输入链接或文字即可生成', action: '生成二维码', result: '二维码已生成' },
    format: { icon: FileImage, title: '高清格式转换', hint: '保留原始尺寸与清晰度', action: '开始转换', result: `已转换为 ${format}` },
    watermark: { icon: Droplet, title: '添加水印', hint: '保护图片，避免被直接搬用', action: '添加水印', result: '水印已添加' },
  };
  const config = configs[id] ?? configs.compress;
  const Icon = config.icon;
  const requiresPhoto = id !== 'qrcode';
  const canProcess = (!requiresPhoto || Boolean(photo)) && (id !== 'watermark' || Boolean(inputValue.trim())) && (id !== 'qrcode' || Boolean(inputValue.trim()));
  return (
    <div className="generic-tool">
      <span className={`generic-icon ${processed ? 'processed' : ''}`}>{processed ? <Check size={40} /> : <Icon size={40} />}</span><h2>{processed ? config.result : config.title}</h2><p>{processed && id === 'compress' ? '1.8 MB → 648 KB' : config.hint}</p>
      {requiresPhoto ? <>
        <ImageInput selectedName={photo?.name} label="选择图片" onSelect={(selectedPhoto) => { setPhoto(selectedPhoto); setProcessed(false); notify('图片已添加'); }} />
        {photo ? <div className="generic-source-card"><ShotPreview shot={photo} /><span><strong>{photo.name}</strong><small>{photo.meta}</small></span><Check size={17} /></div> : null}
      </> : <div className="qr-live-preview"><QrCode size={72} /><small>{inputValue || '输入内容后实时生成'}</small></div>}
      {id === 'qrcode' || id === 'watermark' ? <label className="generic-input"><span>{id === 'qrcode' ? '链接或文字' : '水印文字'}</span><input name={id === 'qrcode' ? 'qr-content' : 'watermark-text'} autoComplete="off" value={inputValue} onChange={(event) => { setInputValue(event.target.value); setProcessed(false); }} /></label> : null}
      {id === 'format' ? <><span className="control-label">输出格式</span><div className="method-tabs">{['JPG','PNG','WebP'].map((item) => <button key={item} className={format === item ? 'active' : ''} onClick={() => { setFormat(item); setProcessed(false); }}>{item}</button>)}</div></> : null}
      {id === 'watermark' ? <><span className="control-label">水印位置</span><div className="method-tabs">{['左下','居中','右下'].map((item) => <button key={item} className={position === item ? 'active' : ''} onClick={() => { setPosition(item); setProcessed(false); }}>{item}</button>)}</div></> : null}
      {id === 'compress' || id === 'qrcode' || id === 'watermark' ? <label className="range-row"><span>{id === 'compress' ? '清晰度' : id === 'qrcode' ? '二维码尺寸' : '透明度'}</span><input aria-label={id === 'compress' ? '清晰度' : id === 'qrcode' ? '二维码尺寸' : '水印透明度'} type="range" value={value} onChange={(event) => { setValue(Number(event.target.value)); setProcessed(false); }} /><strong>{value}%</strong></label> : null}
      <button className={`primary-button ${processed ? 'completed' : ''}`} disabled={!canProcess} onClick={() => { if (processed && id === 'format' && !subscribed) onUpgrade(); else if (processed) notify('结果已保存到照片'); else { setProcessed(true); notify(config.result); } }}>{processed ? (id === 'format' && !subscribed ? <Crown size={18} fill="currentColor" /> : <Download size={18} />) : <Sparkles size={18} />} {processed ? (id === 'format' && !subscribed ? '开通 VIP 并保存' : '保存结果') : config.action}</button>
    </div>
  );
}

function ToolDetail({ id, onBack, notify, onUpgrade, subscribed }: { id: ToolId; onBack: () => void; notify: (message: string) => void; onUpgrade: () => void; subscribed: boolean }) {
  const titles: Record<ToolId, string> = { redact:'智能打码', ocr:'图片转文字', annotate:'图片标注', idphoto:'证件照', watermark:'添加水印', compress:'图片压缩', qrcode:'制作二维码', format:'高清格式转换' };
  const backGesture = useEdgeSwipeBack(onBack);
  return (
    <div className={`screen-scroll app-screen detail-screen detail-${id}`} {...backGesture}>
      <ScreenHeader title={titles[id]} back onBack={onBack} trailing={<button className="icon-button" onClick={() => notify('工具设置已打开')} aria-label="工具设置"><Settings size={20} /></button>} />
      {id === 'redact' ? <RedactTool notify={notify} /> : id === 'ocr' ? <OcrTool notify={notify} /> : id === 'annotate' ? <AnnotateTool notify={notify} /> : id === 'idphoto' ? <IdPhotoTool notify={notify} /> : <GenericTool id={id} notify={notify} onUpgrade={onUpgrade} subscribed={subscribed} />}
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
  { id:'tutorial', title:'操作教程', subtitle:'截图编号 / 步骤说明', scenario:'软件操作、安装和使用说明', value:'自动编号并导出清晰长图', tone:'blueprint', cells:4, ratio:'3:4', categories:['热门','教程'], numbered:true, titleLabel:'教程标题', pro:true },
  { id:'feedback', title:'问题反馈', subtitle:'现象截图 / 重点说明', scenario:'向客服或研发提交 Bug', value:'问题、复现、期望结构化排版', tone:'minty', cells:4, ratio:'3:4', categories:['热门','反馈'], cellLabels:['问题','复现','结果','期望'], titleLabel:'问题标题' },
  { id:'compare', title:'前后对比', subtitle:'双图对照 / 差异清晰', scenario:'修图效果、设计改版和验收对比', value:'自动生成“修改前 / 修改后”标签', tone:'graphite', cells:2, ratio:'4:3', categories:['热门','反馈'], cellLabels:['修改前','修改后'] },
  { id:'chat', title:'聊天记录整理', subtitle:'连续截图 / 时间顺序', scenario:'售后沟通、报销或问题举证', value:'按时间顺序整理连续截图', tone:'paper', cells:3, ratio:'3:4', categories:['反馈','办公'], titleLabel:'记录标题' },
  { id:'recipe', title:'图文步骤', subtitle:'步骤配图 / 要点说明', scenario:'菜谱、手作和课程步骤', value:'基础编号和图文排版', tone:'rose', cells:4, ratio:'3:4', categories:['教程','社交'], numbered:true, titleLabel:'内容标题' },
  { id:'id-sheet', title:'证件照冲印', subtitle:'单张人像 / 六张同版', scenario:'制作六寸相纸冲印排版', value:'自动计算尺寸并添加裁切线', tone:'ice', cells:6, ratio:'4:3', categories:['证件照'], kind:'repeat-photo', pro:true },
  { id:'report', title:'产品验收报告', subtitle:'问题对照 / 结论汇总', scenario:'研发验收、周报和项目汇报', value:'自动生成编号、结论和统一版式', tone:'navy', cells:4, ratio:'4:3', categories:['教程','反馈','办公'], numbered:true, cellLabels:['问题','修改','验证','结论'], titleLabel:'报告标题', pro:true },
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
    <div className="screen-scroll app-screen detail-screen template-editor-screen" {...backGesture}>
      <ScreenHeader title={saved ? '预览' : template.title} back onBack={onBack} trailing={<button className="text-action" onClick={saved ? onBack : hasContent ? generatePreview : startContentEntry}>{saved ? '完成' : hasContent ? '预览' : '选照片'}</button>} />
      <div className="template-editor-meta"><span className={template.pro ? 'vip' : 'free'}>{template.pro ? <><Crown size={11} fill="currentColor" />VIP</> : '免费'}</span><p>{template.scenario}</p><small>{getTemplateInputLabel(template)}</small></div>
      <div className={`collage-preview ratio-${ratio.replace(':','-')}`}><TemplateArt template={template} spacing={spacing} radius={radius} photos={photos} showSlots={!photos.length} titleText={titleText} /></div>
      {saved ? <>
        <div className={`share-panel ${requiresUpgrade ? 'vip-export-panel' : ''}`}><h3>{requiresUpgrade ? '解锁高清成品' : '成品已生成'}</h3><p>{requiresUpgrade ? `${template.value} · 无水印导出` : isNineSlice ? '已输出 9 张连续切图' : isRepeatPhoto ? '六寸相纸冲印版' : `${photos.length} 张照片 · ${ratio}`}</p>{requiresUpgrade ? <div className="vip-preview-benefits"><span><Check size={14} />高清无水印</span><span><Check size={14} />保存与分享</span></div> : <div><button onClick={() => notify('已复制图片')}><Copy size={19} />复制</button><button onClick={() => notify('系统分享面板已打开')}><Share2 size={19} />分享</button><button onClick={() => notify('分享链接已复制')}><Link2 size={19} />复制链接</button><button onClick={() => { setExported(true); notify('图片已保存到照片'); }}><Download size={19} />存入照片</button></div>}</div>
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
        <h1>{subscribed ? 'VIP 已开通' : '把常用工作一次做完'}</h1>
        <p>{subscribed ? '全部高级功能现已可用' : '解锁高频工具和实用模板，先预览效果再决定'}</p>
      </section>
      <div className="purchase-showcase" aria-label="VIP 成品示例"><ResultArtwork kind="longshot" /><ResultArtwork kind="ninegrid" /><ResultArtwork kind="idphoto" /></div>
      <section className="purchase-benefit-list" aria-label="VIP 权益">
        <div><span><PanelsTopLeft size={19} /></span><p><strong>无限长截图</strong><small>不限张数，智能去重拼接</small></p><Check size={17} /></div>
        <div><span><Scissors size={19} /></span><p><strong>九宫格自动切图</strong><small>一张原图直接输出 9 张</small></p><Check size={17} /></div>
        <div><span><FileImage size={19} /></span><p><strong>高清格式转换</strong><small>PNG、JPG、WebP 无水印导出</small></p><Check size={17} /></div>
        <div><span><LayoutTemplate size={19} /></span><p><strong>全部 VIP 模板</strong><small>教程、证件照和商品长图持续更新</small></p><Check size={17} /></div>
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
    </div>
  );
}

function ProfileScreen({ notify, onOpenTool, theme, onThemeChange, subscribed, onUpgrade }: { notify: (message: string) => void; onOpenTool: (id: ToolId) => void; theme: Theme; onThemeChange: (theme: Theme) => void; subscribed: boolean; onUpgrade: () => void }) {
  const menu = [
    ['我的模板','管理收藏和草稿',LayoutGrid],['我的证件照','管理证件照',BadgeCheck],['Mac 端互传','跨设备管理截屏',Share2],
  ] as Array<[string,string,LucideIcon]>;
  return (
    <div className="screen-scroll app-screen profile-screen">
      <ScreenHeader large title="我的" trailing={<button className="icon-button" onClick={() => notify('设置中心已打开')} aria-label="设置"><Settings size={20} /></button>} />
      <div className="profile-card"><div className="profile-avatar"><UserRound size={31} /></div><span><strong>截屏小能手</strong><small>ID: 12345678 · {subscribed ? 'VIP 会员' : '普通会员'}</small></span><button onClick={() => notify('个人资料可编辑')}>编辑</button></div>
      <button className={`profile-vip-status ${subscribed ? 'active' : ''}`} onClick={subscribed ? () => notify('会员管理已打开') : onUpgrade}>
        <span>{subscribed ? <BadgeCheck size={21} /> : <Crown size={21} fill="currentColor" />}</span>
        <span><strong>{subscribed ? 'VIP 已开通' : '开通 VIP 会员'}</strong><small>{subscribed ? '全部高级功能已解锁' : '无限长截图、VIP 模板与高清导出'}</small></span>
        <span>{subscribed ? '管理' : '查看权益'}<ChevronRight size={15} /></span>
      </button>
      <div className="stats-card"><span><strong>128</strong><small>截屏总数</small></span><span><strong>36</strong><small>编辑图片</small></span><span><strong>12</strong><small>我的模板</small></span></div>
      <section className="profile-history-card">
        <div className="profile-history-head"><span><strong>历史记录</strong><small>最近处理的图片</small></span><button onClick={() => notify('已打开全部历史记录')}>查看全部 <ChevronRight size={14} /></button></div>
        <div className="profile-history-list">{recent.map((item) => <button key={item.name} onClick={() => { onOpenTool(item.tool); notify(`已继续编辑「${item.name}」`); }}><ResultArtwork kind={item.tool} /><span><strong>{item.name}</strong><small>{item.meta}</small></span><ChevronRight size={16} /></button>)}</div>
      </section>
      <div className="profile-menu">{menu.map(([title,hint,Icon]) => <button key={title} onClick={() => notify(`${title}已打开`)}><span><Icon size={18} /></span><span><strong>{title}</strong><small>{hint}</small></span><ChevronRight size={16} /></button>)}</div>
      <section className="appearance-card">
        <div><span><Palette size={18} /></span><span><strong>外观</strong><small>跟随系统，或选择浅色与深色模式</small></span></div>
        <ThemeSwitcher theme={theme} onChange={(value) => { onThemeChange(value); notify(`已切换为${value === 'system' ? '自动' : value === 'light' ? '浅色' : '深色'}模式`); }} />
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
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');
  const [systemDark, setSystemDark] = useState(false);
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
    }, 0);
    const syncSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', syncSystemTheme);
    return () => {
      window.clearTimeout(syncInitialAppearance);
      media.removeEventListener('change', syncSystemTheme);
    };
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
      name: 'navigate_screenshot_king', title: '打开截屏王模块', description: '切换到首页、长截图、工具或我的页面。',
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
        <div className="brand-copy"><span className="brand-tag">截屏与图片工具</span><h2>让每一次截屏，<br />都成为<span>清晰表达。</span></h2><p>长截图、文字识别、图片编辑，一个 App 就够了。</p></div>
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
